import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const defaultInput = path.join(rootDir, "practice", "sample-practice-v4.json");
const args = parseArgs(process.argv.slice(2));
const inputPath = path.resolve(args.inputPath || defaultInput);

installBrowserStubs(args.withCatalog);

const appModule = await importPracticeAppModule();
const raw = JSON.parse(await readFile(inputPath, "utf8"));
const first = appModule.normalizePracticeState(raw);
const exportedJson = canonicalJson(first);
const second = appModule.normalizePracticeState(JSON.parse(exportedJson));

const firstJson = canonicalJson(first);
const secondJson = canonicalJson(second);
const firstCounts = stateCounts(first);
const secondCounts = stateCounts(second);
const firstLinks = linkedRowSummary(first, appModule);
const secondLinks = linkedRowSummary(second, appModule);
const catalog = args.withCatalog ? await appModule.loadCatalog() : emptyCatalog("Catalog disabled by --no-catalog");
const firstValidation = appModule.validatePracticeState(first, catalog);
const secondValidation = appModule.validatePracticeState(second, catalog);
const syncSeedResult = await syncSeedRoundTrip(first, catalog, appModule, firstJson);

const checks = [
  check("canonical JSON stable", firstJson === secondJson),
  check("record counts stable", sameJson(firstCounts, secondCounts)),
  check("linked row summary stable", sameJson(firstLinks, secondLinks)),
  check("validation counts stable", sameJson(firstValidation.counts, secondValidation.counts)),
  check("no validation errors after import", firstValidation.counts.error === 0),
  check("no validation errors after re-import", secondValidation.counts.error === 0),
  check("sync seed hash matches canonical JSON", syncSeedResult.hashMatchesCanonical),
  check("sync seed import stable", syncSeedResult.importedJsonStable),
  check("sync seed tamper rejected", syncSeedResult.tamperRejected),
  check("unsupported import rejected", syncSeedResult.unsupportedRejected),
];

const passed = checks.every((item) => item.ok);
const report = {
  input: path.relative(rootDir, inputPath),
  schemaVersion: first.schemaVersion,
  stableHash: sha256(firstJson),
  counts: firstCounts,
  links: firstLinks,
  catalog: catalogSummary(catalog),
  syncSeed: syncSeedResult.summary,
  inspector: appModule.practiceDataInspectorStats(first, catalog, firstValidation),
  validation: {
    summary: firstValidation.summary,
    counts: firstValidation.counts,
    issues: firstValidation.issues.slice(0, 12),
  },
  checks,
};

console.log(JSON.stringify(report, null, 2));

if (!passed) {
  process.exitCode = 1;
}

async function importPracticeAppModule() {
  const appPath = path.join(rootDir, "practice", "src", "app.js");
  const source = await readFile(appPath, "utf8");
  const exportNames = [
    "normalizePracticeState",
    "validatePracticeState",
    "scoreLinkKey",
    "studyLinkKey",
    "videoLinkKey",
    "timestampBucket",
    "timestampValue",
    "normalizedString",
    "loadCatalog",
    "practiceDataInspectorStats",
    "buildPracticeSyncSeedEnvelope",
    "parsePracticeImportPayload",
  ];
  const harnessSource = `${source}\n\nexport { ${exportNames.join(", ")} };\n`;
  const encoded = Buffer.from(harnessSource).toString("base64");
  return import(`data:text/javascript;base64,${encoded}`);
}

function parseArgs(argv) {
  const parsed = {
    inputPath: "",
    withCatalog: true,
  };
  for (const arg of argv) {
    if (arg === "--no-catalog") {
      parsed.withCatalog = false;
    } else if (arg === "--catalog") {
      parsed.withCatalog = true;
    } else if (!arg.startsWith("--") && !parsed.inputPath) {
      parsed.inputPath = arg;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return parsed;
}

function installBrowserStubs(withCatalog) {
  const storage = new Map();
  const search = withCatalog ? "?pinball=1" : "?pinball=0";
  globalThis.localStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: (key) => storage.delete(key),
  };
  globalThis.window = {
    location: {
      hostname: "localhost",
      href: `http://localhost/practice/${search}`,
      origin: "http://localhost",
      search,
      replace() {},
    },
    confirm() { return true; },
    prompt() { return null; },
    addEventListener() {},
    requestAnimationFrame(callback) {
      return setTimeout(callback, 0);
    },
    history: {
      replaceState() {},
    },
  };
  globalThis.document = {
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    createElement(tagName) {
      return stubElement(tagName);
    },
    createElementNS(_namespace, tagName) {
      return stubElement(tagName);
    },
  };
  globalThis.fetch = fetchLocalFile;
}

function stubElement(tagName = "div") {
  return {
    tagName: String(tagName).toUpperCase(),
    className: "",
    dataset: {},
    style: { setProperty() {} },
    classList: { add() {}, remove() {}, toggle() {} },
    append() {},
    prepend() {},
    replaceChildren() {},
    addEventListener() {},
    setAttribute() {},
    removeAttribute() {},
    querySelector() { return null; },
    querySelectorAll() { return []; },
    focus() {},
    select() {},
  };
}

async function fetchLocalFile(resource) {
  const rawUrl = typeof resource === "string" ? resource : resource?.url ?? String(resource);
  const url = new URL(rawUrl, globalThis.window.location.origin);
  if (!url.pathname.startsWith("/pinball/")) {
    return localResponse(false, 404, `Unsupported harness path: ${url.pathname}`);
  }
  const relativePath = decodeURIComponent(url.pathname.replace(/^\/+/, ""));
  const localPath = path.normalize(path.join(rootDir, relativePath));
  if (!localPath.startsWith(`${rootDir}${path.sep}`)) {
    return localResponse(false, 403, `Blocked path outside workspace: ${url.pathname}`);
  }
  try {
    return localResponse(true, 200, await readFile(localPath, "utf8"));
  } catch (error) {
    return localResponse(false, error?.code === "ENOENT" ? 404 : 500, errorMessage(error));
  }
}

function localResponse(ok, status, body) {
  return {
    ok,
    status,
    async text() {
      return body;
    },
    async json() {
      return JSON.parse(body);
    },
  };
}

function emptyCatalog(status = "Catalog not loaded") {
  return {
    status,
    gamesByPracticeId: new Map(),
    resourcesByPracticeId: new Map(),
    targetsByPracticeId: new Map(),
    practiceIdByOpdb: new Map(),
    leagueRows: [],
    leaguePlayers: [],
    leagueIfpaByPlayer: new Map(),
    leagueMachineMappings: new Map(),
  };
}

function catalogSummary(catalog) {
  return {
    status: catalog.status,
    error: catalog.error ?? null,
    games: catalog.gamesByPracticeId.size,
    resourceBuckets: catalog.resourcesByPracticeId.size,
    targets: catalog.targetsByPracticeId.size,
    leagueRows: catalog.leagueRows.length,
    leaguePlayers: catalog.leaguePlayers.length,
    leagueMachineMappings: catalog.leagueMachineMappings.size,
  };
}

async function syncSeedRoundTrip(state, catalog, appModule, canonicalStateJson) {
  const envelope = await appModule.buildPracticeSyncSeedEnvelope(state, catalog);
  const imported = await appModule.parsePracticeImportPayload(envelope);
  const importedJson = canonicalJson(appModule.normalizePracticeState(imported.state));
  const expectedHash = sha256(canonicalStateJson);
  const envelopeHash = String(envelope.base?.canonicalHash ?? "");
  let tamperRejected = false;
  let unsupportedRejected = false;

  const tampered = structuredClone(envelope);
  if (Array.isArray(tampered.state?.scoreEntries) && tampered.state.scoreEntries[0]) {
    tampered.state.scoreEntries[0].score = Number(tampered.state.scoreEntries[0].score) + 1;
  } else {
    tampered.state.schemaVersion = Number(tampered.state?.schemaVersion ?? 4) + 1;
  }
  try {
    await appModule.parsePracticeImportPayload(tampered);
  } catch {
    tamperRejected = true;
  }

  try {
    await appModule.parsePracticeImportPayload({ payloadType: "pinprof.practice.qa-report", state: {} });
  } catch {
    unsupportedRejected = true;
  }

  return {
    hashMatchesCanonical: envelopeHash === expectedHash,
    importedJsonStable: importedJson === canonicalStateJson,
    tamperRejected,
    unsupportedRejected,
    summary: {
      payloadType: envelope.payloadType,
      envelopeVersion: envelope.envelopeVersion,
      canonicalHash: envelopeHash,
      importedLabel: imported.label,
      verifiedHash: imported.verifiedHash,
      syncDraftSchemaVersion: envelope.syncDraft?.schemaVersion ?? null,
      transactionGroups: envelope.syncDraft?.transactionGroups?.length ?? 0,
      validationCounts: envelope.summary?.validation?.counts ?? null,
    },
  };
}

function stateCounts(state) {
  return {
    topLevelKeys: Object.keys(state).sort().length,
    studyEvents: state.studyEvents.length,
    videoProgressEntries: state.videoProgressEntries.length,
    scoreEntries: state.scoreEntries.length,
    noteEntries: state.noteEntries.length,
    journalEntries: state.journalEntries.length,
    customGroups: state.customGroups.length,
    rulesheetResumeOffsets: Object.keys(state.rulesheetResumeOffsets ?? {}).length,
    videoResumeHints: Object.keys(state.videoResumeHints ?? {}).length,
    gameSummaryNotes: Object.keys(state.gameSummaryNotes ?? {}).length,
    leagueSettingsKeys: Object.keys(state.leagueSettings ?? {}).sort().length,
    syncSettingsKeys: Object.keys(state.syncSettings ?? {}).sort().length,
    analyticsSettingsKeys: Object.keys(state.analyticsSettings ?? {}).sort().length,
    practiceSettingsKeys: Object.keys(state.practiceSettings ?? {}).sort().length,
  };
}

function linkedRowSummary(state, appModule) {
  const scoreKeys = new Set(state.scoreEntries.map((entry) => appModule.scoreLinkKey(entry)));
  const studyKeys = new Set(state.studyEvents.map((entry) => appModule.studyLinkKey(
    entry.gameID,
    entry.task,
    entry.progressPercent,
    entry.timestamp
  )));
  const videoKeys = new Set(state.videoProgressEntries.map((entry) => appModule.videoLinkKey(
    entry.gameID,
    entry.kind,
    entry.value,
    entry.timestamp
  )));
  const noteKeys = new Set(state.noteEntries.map(noteLinkKey));

  const summary = {
    scoreJournalRows: 0,
    scoreJournalRowsLinked: 0,
    scoreJournalRowsWithoutScore: 0,
    rulesheetJournalRows: 0,
    rulesheetJournalRowsLinked: 0,
    videoJournalRows: 0,
    videoJournalRowsLinked: 0,
    noteJournalRows: 0,
    noteJournalRowsLinked: 0,
    browseJournalRows: 0,
  };

  for (const entry of state.journalEntries) {
    if (entry.action === "scoreLogged") {
      summary.scoreJournalRows += 1;
      if (!Number.isFinite(Number(entry.score)) || Number(entry.score) <= 0) {
        summary.scoreJournalRowsWithoutScore += 1;
      } else if (scoreKeys.has(appModule.scoreLinkKey({
        gameID: entry.gameID,
        score: entry.score,
        context: entry.scoreContext,
        timestamp: entry.timestamp,
      }))) {
        summary.scoreJournalRowsLinked += 1;
      }
    } else if (entry.action === "rulesheetRead") {
      summary.rulesheetJournalRows += 1;
      if (studyKeys.has(appModule.studyLinkKey(entry.gameID, "rulesheet", entry.progressPercent, entry.timestamp))) {
        summary.rulesheetJournalRowsLinked += 1;
      }
    } else if (entry.action === "tutorialWatch" || entry.action === "gameplayWatch") {
      summary.videoJournalRows += 1;
      if (videoKeys.has(appModule.videoLinkKey(entry.gameID, entry.videoKind, entry.videoValue, entry.timestamp))) {
        summary.videoJournalRowsLinked += 1;
      }
    } else if (entry.action === "noteAdded") {
      summary.noteJournalRows += 1;
      if (noteKeys.has(noteLinkKey({
        gameID: entry.gameID,
        category: entry.noteCategory,
        detail: entry.noteDetail,
        note: entry.note,
        timestamp: entry.timestamp,
      }))) {
        summary.noteJournalRowsLinked += 1;
      }
    } else if (entry.action === "gameBrowse") {
      summary.browseJournalRows += 1;
    }
  }

  return summary;
}

function noteLinkKey(entry) {
  return [
    clean(entry.gameID),
    clean(entry.category),
    clean(entry.detail),
    clean(entry.note),
    timestampBucket(entry.timestamp),
  ].join("|");
}

function timestampBucket(value) {
  const timestamp = timestampValue(value);
  return timestamp > 0 ? String(Math.round(timestamp / 1000)) : "invalid";
}

function timestampValue(value) {
  if (value instanceof Date) return value.getTime();
  const number = Number(value);
  if (!Number.isFinite(number)) {
    const parsed = Date.parse(String(value ?? ""));
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return number > 10_000_000_000 ? number : number * 1000;
}

function clean(value) {
  return String(value ?? "").trim();
}

function canonicalJson(value) {
  return JSON.stringify(value, null, 2);
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function check(name, ok) {
  return { name, ok };
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
