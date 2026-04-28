#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const appPath = path.join(rootDir, "practice", "src", "app.js");
const defaultInputPath = path.join(rootDir, "practice", "sample-practice-v4.json");

const args = parseArgs(process.argv.slice(2));

installBrowserStubs(args.withCatalog);

const app = await importPracticeAppModule();
const catalog = args.withCatalog ? await app.loadCatalog() : emptyCatalog("Catalog disabled by --no-catalog");
const inputPath = path.resolve(rootDir, args.inputPath ?? defaultInputPath);
const inputPayload = JSON.parse(await readFile(inputPath, "utf8"));
const importResult = await app.parsePracticeImportPayload(inputPayload, catalog);
const baseState = app.normalizePracticeState(importResult.state);
const beforeCounts = snapshotCounts(baseState);

const workState = app.normalizePracticeState(baseState);
const writeReport = applyWritePathCoverage(workState, catalog);
const normalized = app.normalizePracticeState(workState);
const validation = app.validatePracticeState(normalized, catalog);
const inspector = app.practiceDataInspectorStats(normalized, catalog, validation);
const canonicalJson = JSON.stringify(normalized);
const reimported = app.normalizePracticeState(JSON.parse(canonicalJson));
const reimportedJson = JSON.stringify(reimported);
const syncSeed = await app.buildPracticeSyncSeedEnvelope(normalized, catalog);
const syncImport = await app.parsePracticeImportPayload(syncSeed, catalog);
const syncJson = JSON.stringify(app.normalizePracticeState(syncImport.state));

const checks = buildChecks({
  app,
  state: normalized,
  report: writeReport,
  validation,
  canonicalJson,
  reimportedJson,
  syncImport,
  syncJson,
});

const summary = {
  input: path.relative(rootDir, inputPath),
  importedAs: importResult.kind,
  catalog: args.withCatalog ? "loaded" : "disabled",
  beforeCounts,
  afterCounts: snapshotCounts(normalized),
  validation: validation.counts,
  inspector,
  coverage: writeReport.operations,
  linkedRows: linkedRowSummary(normalized, app),
  checks,
};

console.log(JSON.stringify(summary, null, 2));

const failed = checks.filter((check) => !check.ok);
if (failed.length > 0) {
  console.error(`practice-write-path-check failed ${failed.length} check(s).`);
  process.exit(1);
}

function parseArgs(argv) {
  const parsed = {
    inputPath: null,
    withCatalog: true,
  };

  for (const arg of argv) {
    if (arg === "--no-catalog") {
      parsed.withCatalog = false;
      continue;
    }

    if (!parsed.inputPath) {
      parsed.inputPath = arg;
      continue;
    }

    throw new Error(`Unexpected argument: ${arg}`);
  }

  return parsed;
}

function installBrowserStubs(withCatalog) {
  const storage = new Map();
  const search = withCatalog ? "?pinball=1" : "?pinball=0";

  globalThis.window = {
    location: {
      hostname: "localhost",
      href: `http://localhost/practice/${search}`,
      origin: "http://localhost",
      search,
      replace() {},
    },
    matchMedia() {
      return {
        matches: false,
        addEventListener() {},
        removeEventListener() {},
      };
    },
    addEventListener() {},
    removeEventListener() {},
    requestAnimationFrame(callback) {
      return setTimeout(callback, 0);
    },
    cancelAnimationFrame(handle) {
      clearTimeout(handle);
    },
    document: null,
    history: {
      replaceState() {},
    },
  };

  globalThis.document = {
    addEventListener() {},
    removeEventListener() {},
    createElement() {
      return {
        click() {},
        remove() {},
        set href(value) {
          this._href = value;
        },
        get href() {
          return this._href;
        },
        set download(value) {
          this._download = value;
        },
        get download() {
          return this._download;
        },
      };
    },
    body: {
      appendChild() {},
    },
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    getElementById() {
      return null;
    },
    documentElement: {
      style: {
        setProperty() {},
      },
    },
  };
  globalThis.window.document = globalThis.document;

  globalThis.localStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: (key) => storage.delete(key),
  };

  globalThis.URL = globalThis.URL ?? {};
  globalThis.URL.createObjectURL = globalThis.URL.createObjectURL ?? (() => "blob:practice-write-path-check");
  globalThis.URL.revokeObjectURL = globalThis.URL.revokeObjectURL ?? (() => {});

  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: {
      userAgent: "practice-write-path-check",
    },
  });

  globalThis.confirm = () => true;
  globalThis.prompt = () => null;
  globalThis.alert = () => {};
  globalThis.HTMLElement = class HTMLElement {};
  globalThis.customElements = {
    define() {},
    get() {
      return undefined;
    },
  };
  globalThis.fetch = fetchLocalFile;
}

async function importPracticeAppModule() {
  const source = await readFile(appPath, "utf8");
  const exportNames = [
    "buildPracticeSyncSeedEnvelope",
    "loadCatalog",
    "normalizePracticeState",
    "normalizedString",
    "parsePracticeImportPayload",
    "practiceDataInspectorStats",
    "scoreLinkKey",
    "studyLinkKey",
    "timestampBucket",
    "timestampValue",
    "validatePracticeState",
    "videoLinkKey",
  ];

  const augmentedSource = `${source}\nexport { ${exportNames.join(", ")} };\n`;
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(augmentedSource).toString("base64")}`;
  return import(moduleUrl);
}

function snapshotCounts(state) {
  return {
    scoreEntries: state.scoreEntries.length,
    noteEntries: state.noteEntries.length,
    journalEntries: state.journalEntries.length,
    studyEvents: state.studyEvents.length,
    videoProgressEntries: state.videoProgressEntries.length,
    customGroups: state.customGroups.length,
    summaryNotes: Object.keys(state.gameSummaryNotes).length,
  };
}

function applyWritePathCoverage(state, catalog) {
  clearWritePathRows(state);

  const [primaryGameID, secondaryGameID] = pickCoverageGames(state, catalog);
  const timestamp = 1_780_000_000_000;
  const operations = [];
  const touched = {
    createdScoreID: "wp-score-practice",
    createdScoreJournalID: "wp-journal-score-practice",
    deletedScoreID: "wp-score-delete",
    deletedScoreJournalID: "wp-journal-score-delete",
    rulesheetStudyID: "wp-study-rulesheet",
    rulesheetJournalID: "wp-journal-rulesheet",
    tutorialVideoID: "wp-video-tutorial",
    tutorialStudyID: "wp-study-tutorial",
    tutorialJournalID: "wp-journal-tutorial",
    gameplayVideoID: "wp-video-gameplay",
    gameplayStudyID: "wp-study-gameplay",
    gameplayJournalID: "wp-journal-gameplay",
    mechanicsNoteID: "wp-note-mechanics",
    mechanicsJournalID: "wp-journal-mechanics",
    plainNoteID: "wp-note-plain",
    plainJournalID: "wp-journal-note",
    practiceJournalID: "wp-journal-practice",
    playfieldJournalID: "wp-journal-playfield",
    createdGroupID: "wp-group-create",
    tempBatchNoteID: "wp-note-batch-delete",
    tempBatchJournalID: "wp-journal-batch-delete",
    primaryGameID,
    secondaryGameID,
  };

  addScoreEntry(state, {
    entryID: touched.createdScoreID,
    journalID: touched.createdScoreJournalID,
    gameID: primaryGameID,
    score: 1_234_567,
    context: "practice",
    timestamp: timestamp + 1_000,
  });
  operations.push("create linked practice score and score journal");

  editScoreEntry(state, {
    entryID: touched.createdScoreID,
    journalID: touched.createdScoreJournalID,
    score: 2_345_678,
  });
  operations.push("edit score and matching score journal");

  addScoreEntry(state, {
    entryID: touched.deletedScoreID,
    journalID: touched.deletedScoreJournalID,
    gameID: secondaryGameID,
    score: 3_456_789,
    context: "tournament",
    tournamentName: "Write Path Tournament",
    timestamp: timestamp + 2_000,
  });
  deleteRowsByID(state.scoreEntries, [touched.deletedScoreID]);
  deleteRowsByID(state.journalEntries, [touched.deletedScoreJournalID]);
  operations.push("delete linked score and score journal");

  addStudyEvent(state, {
    eventID: touched.rulesheetStudyID,
    journalID: touched.rulesheetJournalID,
    gameID: primaryGameID,
    task: "rulesheet",
    action: "rulesheetRead",
    progressPercent: 40,
    timestamp: timestamp + 3_000,
  });
  operations.push("create linked rulesheet study event");

  addVideoEvent(state, {
    videoID: touched.tutorialVideoID,
    studyID: touched.tutorialStudyID,
    journalID: touched.tutorialJournalID,
    gameID: primaryGameID,
    task: "tutorialVideo",
    action: "tutorialWatch",
    videoKind: "percent",
    videoValue: 65,
    progressPercent: 65,
    timestamp: timestamp + 4_000,
  });
  operations.push("create linked tutorial video progress");

  addVideoEvent(state, {
    videoID: touched.gameplayVideoID,
    studyID: touched.gameplayStudyID,
    journalID: touched.gameplayJournalID,
    gameID: secondaryGameID,
    task: "gameplayVideo",
    action: "gameplayWatch",
    videoKind: "clock",
    videoValue: 1_200,
    progressPercent: 50,
    timestamp: timestamp + 5_000,
  });
  operations.push("create linked gameplay video progress");

  state.journalEntries.push({
    id: touched.practiceJournalID,
    gameID: primaryGameID,
    timestamp: timestamp + 6_000,
    action: "practiceSession",
    task: "practice",
    progressPercent: null,
    videoKind: null,
    videoValue: null,
    score: null,
    scoreContext: null,
    tournamentName: null,
    noteCategory: null,
    noteDetail: null,
    note: "30 minutes: Write path practice session",
  });
  operations.push("create practice-session journal row");

  addNoteEntry(state, {
    noteID: touched.mechanicsNoteID,
    journalID: touched.mechanicsJournalID,
    gameID: primaryGameID,
    category: "strategy",
    detail: "Drop Catch",
    note: "[Mechanics] Drop Catch comfort 4. Write path mechanics session.",
    timestamp: timestamp + 7_000,
  });
  operations.push("create linked mechanics note");

  addNoteEntry(state, {
    noteID: touched.plainNoteID,
    journalID: touched.plainJournalID,
    gameID: secondaryGameID,
    category: "strategy",
    detail: "Mode Start",
    note: "Write path plain practice note.",
    timestamp: timestamp + 8_000,
  });
  operations.push("create linked note");

  state.journalEntries.push({
    id: touched.playfieldJournalID,
    gameID: primaryGameID,
    timestamp: timestamp + 9_000,
    action: "playfieldViewed",
    task: "playfield",
    progressPercent: null,
    videoKind: null,
    videoValue: null,
    score: null,
    scoreContext: null,
    tournamentName: null,
    noteCategory: null,
    noteDetail: null,
    note: "Write path playfield open",
  });
  operations.push("create playfield-view journal row");

  addNoteEntry(state, {
    noteID: touched.tempBatchNoteID,
    journalID: touched.tempBatchJournalID,
    gameID: primaryGameID,
    category: "strategy",
    detail: "Batch Delete",
    note: "Temporary write path note for batch delete coverage.",
    timestamp: timestamp + 10_000,
  });
  deleteRowsByID(state.noteEntries, [touched.tempBatchNoteID]);
  deleteRowsByID(state.journalEntries, [touched.tempBatchJournalID]);
  operations.push("batch delete linked note and journal rows");

  state.customGroups.push({
    id: touched.createdGroupID,
    name: "Write Path Group",
    gameIDs: [primaryGameID, secondaryGameID],
    type: "custom",
    isActive: true,
    isArchived: false,
    isPriority: true,
    startDate: timestamp + 11_000,
    endDate: timestamp + 86_411_000,
    createdAt: timestamp + 11_000,
    updatedAt: timestamp + 11_000,
  });
  state.practiceSettings.selectedGroupID = touched.createdGroupID;
  operations.push("create custom group and select it");

  const customGroup = state.customGroups.find((group) => group.id === touched.createdGroupID);
  customGroup.name = "Write Path Group Edited";
  customGroup.gameIDs = [secondaryGameID, primaryGameID].filter(Boolean);
  customGroup.isPriority = false;
  customGroup.updatedAt = timestamp + 12_000;
  customGroup.isArchived = true;
  customGroup.updatedAt = timestamp + 13_000;
  customGroup.isArchived = false;
  customGroup.updatedAt = timestamp + 14_000;
  operations.push("edit, archive, and unarchive custom group");

  state.customGroups = state.customGroups.filter((group) => group.id !== touched.createdGroupID);
  if (state.practiceSettings.selectedGroupID === touched.createdGroupID) {
    state.practiceSettings.selectedGroupID = null;
  }
  operations.push("delete custom group without leaving selected group dangling");

  state.gameSummaryNotes[primaryGameID] = "Write path summary note for game view coverage.";
  operations.push("write game summary note");

  return {
    primaryGameID,
    secondaryGameID,
    operations,
    touched,
  };
}

function clearWritePathRows(state) {
  for (const key of ["scoreEntries", "noteEntries", "journalEntries", "studyEvents", "videoProgressEntries"]) {
    state[key] = state[key].filter((row) => !String(row.id ?? "").startsWith("wp-"));
  }

  state.customGroups = state.customGroups.filter((group) => !String(group.id ?? "").startsWith("wp-"));
  if (String(state.practiceSettings?.selectedGroupID ?? "").startsWith("wp-")) {
    state.practiceSettings.selectedGroupID = null;
  }
}

function pickCoverageGames(state, catalog) {
  const stateGameIDs = Array.from(new Set([
    ...state.scoreEntries.map((row) => row.gameID),
    ...state.noteEntries.map((row) => row.gameID),
    ...state.journalEntries.map((row) => row.gameID),
    ...state.studyEvents.map((row) => row.gameID),
    ...state.videoProgressEntries.map((row) => row.gameID),
    ...state.customGroups.flatMap((group) => group.gameIDs),
    ...Object.keys(state.gameSummaryNotes),
  ].filter(Boolean)));

  const catalogGameIDs = catalog?.gamesByPracticeId ? Array.from(catalog.gamesByPracticeId.keys()) : [];
  const candidates = [...stateGameIDs, ...catalogGameIDs, "Gd2Xb"];
  const primary = candidates[0] ?? "Gd2Xb";
  const secondary = candidates.find((gameID) => gameID !== primary) ?? primary;
  return [primary, secondary];
}

function addScoreEntry(state, { entryID, journalID, gameID, score, context, tournamentName = null, timestamp }) {
  state.scoreEntries.push({
    id: entryID,
    gameID,
    score,
    context,
    tournamentName,
    timestamp,
    leagueImported: false,
  });

  state.journalEntries.push({
    id: journalID,
    gameID,
    timestamp,
    action: "scoreLogged",
    task: null,
    progressPercent: null,
    videoKind: null,
    videoValue: null,
    score,
    scoreContext: context,
    tournamentName,
    noteCategory: null,
    noteDetail: null,
    note: "Write path score journal",
  });
}

function editScoreEntry(state, { entryID, journalID, score }) {
  const scoreEntry = state.scoreEntries.find((entry) => entry.id === entryID);
  const journalEntry = state.journalEntries.find((entry) => entry.id === journalID);
  scoreEntry.score = score;
  journalEntry.score = score;
}

function addStudyEvent(state, { eventID, journalID, gameID, task, action, progressPercent, timestamp }) {
  state.studyEvents.push({
    id: eventID,
    gameID,
    task,
    progressPercent,
    timestamp,
  });

  state.journalEntries.push({
    id: journalID,
    gameID,
    timestamp,
    action,
    task,
    progressPercent,
    videoKind: null,
    videoValue: null,
    score: null,
    scoreContext: null,
    tournamentName: null,
    noteCategory: null,
    noteDetail: null,
    note: "Write path study journal",
  });
}

function addVideoEvent(state, {
  videoID,
  studyID,
  journalID,
  gameID,
  task,
  action,
  videoKind,
  videoValue,
  progressPercent,
  timestamp,
}) {
  state.videoProgressEntries.push({
    id: videoID,
    gameID,
    kind: videoKind,
    value: videoValue,
    timestamp,
  });

  state.studyEvents.push({
    id: studyID,
    gameID,
    task,
    progressPercent,
    timestamp,
  });

  state.journalEntries.push({
    id: journalID,
    gameID,
    timestamp,
    action,
    task,
    progressPercent,
    videoKind,
    videoValue,
    score: null,
    scoreContext: null,
    tournamentName: null,
    noteCategory: null,
    noteDetail: null,
    note: "Write path video journal",
  });
}

function addNoteEntry(state, { noteID, journalID, gameID, category, detail, note, timestamp }) {
  state.noteEntries.push({
    id: noteID,
    gameID,
    category,
    detail,
    note,
    timestamp,
  });

  state.journalEntries.push({
    id: journalID,
    gameID,
    timestamp,
    action: "noteAdded",
    task: null,
    progressPercent: null,
    videoKind: null,
    videoValue: null,
    score: null,
    scoreContext: null,
    tournamentName: null,
    noteCategory: category,
    noteDetail: detail,
    note,
  });
}

function deleteRowsByID(rows, ids) {
  const idSet = new Set(ids);
  rows.splice(0, rows.length, ...rows.filter((row) => !idSet.has(row.id)));
}

function buildChecks({
  app,
  state,
  report,
  validation,
  canonicalJson,
  reimportedJson,
  syncImport,
  syncJson,
}) {
  const touched = report.touched;
  const checks = [];
  const push = (name, ok, details = null) => checks.push({ name, ok, ...(details ? { details } : {}) });

  push("validation has no errors", validation.counts.error === 0, validation.issues.filter((issue) => issue.severity === "error"));
  push("canonical export re-import is stable", canonicalJson === reimportedJson);
  push("sync seed import is stable", canonicalJson === syncJson);
  push("sync seed hash verified", syncImport.verifiedHash === true);

  const scoreEntry = state.scoreEntries.find((entry) => entry.id === touched.createdScoreID);
  const scoreJournal = state.journalEntries.find((entry) => entry.id === touched.createdScoreJournalID);
  push("created score row remains linked after edit", Boolean(scoreEntry && scoreJournal && app.scoreLinkKey(scoreEntry) === app.scoreLinkKey({
    gameID: scoreJournal.gameID,
    score: scoreJournal.score,
    context: scoreJournal.scoreContext,
    timestamp: scoreJournal.timestamp,
  })));

  push("deleted score row removed", !state.scoreEntries.some((entry) => entry.id === touched.deletedScoreID));
  push("deleted score journal removed", !state.journalEntries.some((entry) => entry.id === touched.deletedScoreJournalID));

  const rulesheetEvent = state.studyEvents.find((entry) => entry.id === touched.rulesheetStudyID);
  const rulesheetJournal = state.journalEntries.find((entry) => entry.id === touched.rulesheetJournalID);
  push("rulesheet study row remains linked", Boolean(rulesheetEvent && rulesheetJournal
    && app.studyLinkKey(rulesheetEvent.gameID, rulesheetEvent.task, rulesheetEvent.progressPercent, rulesheetEvent.timestamp)
      === app.studyLinkKey(rulesheetJournal.gameID, "rulesheet", rulesheetJournal.progressPercent, rulesheetJournal.timestamp)));

  const tutorialVideo = state.videoProgressEntries.find((entry) => entry.id === touched.tutorialVideoID);
  const tutorialJournal = state.journalEntries.find((entry) => entry.id === touched.tutorialJournalID);
  push("tutorial video row remains linked", Boolean(tutorialVideo && tutorialJournal
    && app.videoLinkKey(tutorialVideo.gameID, tutorialVideo.kind, tutorialVideo.value, tutorialVideo.timestamp)
      === app.videoLinkKey(tutorialJournal.gameID, tutorialJournal.videoKind, tutorialJournal.videoValue, tutorialJournal.timestamp)));

  const gameplayVideo = state.videoProgressEntries.find((entry) => entry.id === touched.gameplayVideoID);
  const gameplayJournal = state.journalEntries.find((entry) => entry.id === touched.gameplayJournalID);
  push("gameplay video row remains linked", Boolean(gameplayVideo && gameplayJournal
    && app.videoLinkKey(gameplayVideo.gameID, gameplayVideo.kind, gameplayVideo.value, gameplayVideo.timestamp)
      === app.videoLinkKey(gameplayJournal.gameID, gameplayJournal.videoKind, gameplayJournal.videoValue, gameplayJournal.timestamp)));

  push("practice session journal-only row exists", state.journalEntries.some((entry) => entry.id === touched.practiceJournalID && entry.action === "practiceSession"));
  push("playfield journal-only row exists", state.journalEntries.some((entry) => entry.id === touched.playfieldJournalID && entry.action === "playfieldViewed"));

  const mechanicsNote = state.noteEntries.find((entry) => entry.id === touched.mechanicsNoteID);
  const mechanicsJournal = state.journalEntries.find((entry) => entry.id === touched.mechanicsJournalID);
  push("mechanics note row remains linked", Boolean(mechanicsNote && mechanicsJournal && noteLinkKey(mechanicsNote, app) === noteLinkKey(mechanicsJournal, app)));

  const plainNote = state.noteEntries.find((entry) => entry.id === touched.plainNoteID);
  const plainJournal = state.journalEntries.find((entry) => entry.id === touched.plainJournalID);
  push("plain note row remains linked", Boolean(plainNote && plainJournal && noteLinkKey(plainNote, app) === noteLinkKey(plainJournal, app)));

  push("batch-deleted note removed", !state.noteEntries.some((entry) => entry.id === touched.tempBatchNoteID));
  push("batch-deleted journal removed", !state.journalEntries.some((entry) => entry.id === touched.tempBatchJournalID));

  push("deleted custom group removed", !state.customGroups.some((group) => group.id === touched.createdGroupID));
  const selectedGroupID = state.practiceSettings?.selectedGroupID;
  push("selected group is not dangling", !selectedGroupID || state.customGroups.some((group) => group.id === selectedGroupID));
  push("game summary note was written", state.gameSummaryNotes[touched.primaryGameID] === "Write path summary note for game view coverage.");

  return checks;
}

function linkedRowSummary(state, app) {
  const scoreKeys = new Set(state.scoreEntries.map((entry) => app.scoreLinkKey(entry)));
  const studyKeys = new Set(state.studyEvents.map((entry) => app.studyLinkKey(entry.gameID, entry.task, entry.progressPercent, entry.timestamp)));
  const videoKeys = new Set(state.videoProgressEntries.map((entry) => app.videoLinkKey(entry.gameID, entry.kind, entry.value, entry.timestamp)));
  const noteKeys = new Set(state.noteEntries.map((entry) => noteLinkKey(entry, app)));

  return {
    scoreJournalRows: state.journalEntries.filter((entry) => entry.action === "scoreLogged" && Number(entry.score) > 0).length,
    scoreJournalOrphans: state.journalEntries.filter((entry) => entry.action === "scoreLogged" && Number(entry.score) > 0 && !scoreKeys.has(app.scoreLinkKey({
      gameID: entry.gameID,
      score: entry.score,
      context: entry.scoreContext,
      timestamp: entry.timestamp,
    }))).length,
    studyJournalRows: state.journalEntries.filter((entry) => ["rulesheetRead"].includes(entry.action)).length,
    studyJournalOrphans: state.journalEntries.filter((entry) => ["rulesheetRead"].includes(entry.action) && !studyKeys.has(app.studyLinkKey(entry.gameID, "rulesheet", entry.progressPercent, entry.timestamp))).length,
    videoJournalRows: state.journalEntries.filter((entry) => ["tutorialWatch", "gameplayWatch"].includes(entry.action)).length,
    videoJournalOrphans: state.journalEntries.filter((entry) => ["tutorialWatch", "gameplayWatch"].includes(entry.action) && !videoKeys.has(app.videoLinkKey(entry.gameID, entry.videoKind, entry.videoValue, entry.timestamp))).length,
    noteJournalRows: state.journalEntries.filter((entry) => entry.action === "noteAdded").length,
    noteJournalOrphans: state.journalEntries.filter((entry) => entry.action === "noteAdded" && !noteKeys.has(noteLinkKey(entry, app))).length,
    journalOnlyPracticeSessions: state.journalEntries.filter((entry) => entry.action === "practiceSession").length,
    journalOnlyPlayfieldViews: state.journalEntries.filter((entry) => entry.action === "playfieldViewed").length,
  };
}

function noteLinkKey(entry, app) {
  return [
    entry.gameID,
    app.normalizedString(entry.noteCategory ?? entry.category),
    app.normalizedString(entry.noteDetail ?? entry.detail),
    app.normalizedString(entry.note),
    app.timestampBucket(entry.timestamp),
  ].join("|");
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

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
