const STORAGE_KEY = "pinprof-practice-web:v1:state";
const SELECTED_GAME_KEY = "pinprof-practice-web:v1:selected-game";
const ACTIVE_ROUTE_KEY = "pinprof-practice-web:v1:active-route";
const GROUP_DASHBOARD_FILTER_KEY = "pinprof-practice-web:v1:group-dashboard-filter";
const GROUP_EDITOR_LIBRARY_KEY = "pinprof-practice-web:v1:group-editor-library";
const ENTRY_ACTIVITY_KEY = "pinprof-practice-web:v1:entry-activity";
const JOURNAL_FILTER_KEY = "pinprof-practice-web:v1:journal-filter";
const SELECTED_JOURNAL_KEY = "pinprof-practice-web:v1:selected-journal";
const MECHANICS_SKILL_KEY = "pinprof-practice-web:v1:mechanics-skill";
const MECHANICS_COMFORT_KEY = "pinprof-practice-web:v1:mechanics-comfort";
const PRACTICE_SEARCH_TAB_KEY = "pinprof-practice-web:v1:search-tab";
const PRACTICE_SEARCH_LIBRARY_KEY = "pinprof-practice-web:v1:search-library";
const PRACTICE_SEARCH_RECENTS_KEY = "pinprof-practice-web:v1:search-recents";
const GAME_SUBVIEW_KEY = "pinprof-practice-web:v1:game-subview";
const ACTIVE_VIDEO_KEY = "pinprof-practice-web:v1:active-video";
const PRACTICE_CHECKPOINTS_KEY = "pinprof-practice-web:v1:checkpoints";
const PRACTICE_SYNC_SEED_PAYLOAD_TYPE = "pinprof.practice.sync-seed";
const SAMPLE_URL = "./sample-practice-v4.json";

const SHOULD_BOOT_APP = canonicalizeLocalPracticeHost();

const EXPECTED_SCHEMA_VERSION = 4;
const STUDY_TASKS = [
  { id: "playfield", label: "Playfield", shortLabel: "Playfield" },
  { id: "rulesheet", label: "Rulesheet", shortLabel: "Rules" },
  { id: "tutorialVideo", label: "Tutorial", shortLabel: "Tutorial" },
  { id: "gameplayVideo", label: "Gameplay", shortLabel: "Gameplay" },
  { id: "practice", label: "Practice", shortLabel: "Practice" },
];
const ALLOWED_STUDY_TASKS = new Set(STUDY_TASKS.map((task) => task.id));
const ALLOWED_JOURNAL_ACTIONS = new Set([
  "rulesheetRead",
  "tutorialWatch",
  "gameplayWatch",
  "playfieldViewed",
  "gameBrowse",
  "practiceSession",
  "scoreLogged",
  "noteAdded",
]);
const ALLOWED_SCORE_CONTEXTS = new Set(["practice", "league", "tournament"]);
const ALLOWED_NOTE_CATEGORIES = new Set(["general", "shots", "modes", "multiball", "strategy"]);
const ALLOWED_VIDEO_INPUTS = new Set(["clock", "percent"]);
const ALLOWED_GROUP_TYPES = new Set(["bank", "location", "custom"]);
const ALLOWED_GAP_MODES = new Set(["realTimeline", "compressInactive", "activeSessionsOnly", "brokenAxis"]);
const SCORE_JOURNAL_MATCH_WINDOW_MS = 5 * 60 * 1000;
const GAME_SUBVIEWS = [
  { id: "summary", label: "Summary" },
  { id: "input", label: "Input" },
  { id: "study", label: "Study" },
  { id: "log", label: "Log" },
];
const GAME_SUBVIEW_IDS = new Set(GAME_SUBVIEWS.map((subview) => subview.id));
const ENTRY_ACTIVITIES = [
  { id: "score", label: "Score" },
  { id: "rulesheet", label: "Rulesheet" },
  { id: "tutorialVideo", label: "Tutorial" },
  { id: "gameplayVideo", label: "Gameplay" },
  { id: "playfield", label: "Playfield" },
  { id: "practice", label: "Practice" },
  { id: "mechanics", label: "Mechanics" },
  { id: "note", label: "Note" },
];
const ENTRY_ACTIVITY_IDS = new Set(ENTRY_ACTIVITIES.map((activity) => activity.id));
const GAME_INPUT_SHORTCUTS = [
  { label: "Rulesheet", icon: "book", activity: "rulesheet" },
  { label: "Playfield", icon: "photo", activity: "playfield" },
  { label: "Score", icon: "score", activity: "score" },
  { label: "Tutorial", icon: "book", activity: "tutorialVideo" },
  { label: "Practice", icon: "run", activity: "practice" },
  { label: "Gameplay", icon: "dot", activity: "gameplayVideo" },
];
const GAME_INPUT_ACTIVITY_IDS = new Set(GAME_INPUT_SHORTCUTS.map((shortcut) => shortcut.activity));
const JOURNAL_FILTERS = [
  { id: "all", label: "All" },
  { id: "study", label: "Study" },
  { id: "practice", label: "Practice" },
  { id: "score", label: "Scores" },
  { id: "notes", label: "Notes" },
  { id: "league", label: "League" },
];
const JOURNAL_FILTER_IDS = new Set(JOURNAL_FILTERS.map((filter) => filter.id));
const PRACTICE_HUB_DESTINATIONS = [
  {
    id: "group-dashboard",
    label: "Group Dashboard",
    subtitle: "View and edit groups",
    icon: "dashboard",
  },
  {
    id: "journal",
    label: "Journal Timeline",
    subtitle: "Full app activity history",
    icon: "list",
  },
  {
    id: "insights",
    label: "Insights",
    subtitle: "Scores, variance, and trends",
    icon: "trend",
  },
  {
    id: "mechanics",
    label: "Mechanics",
    subtitle: "Track pinball skills",
    icon: "dot",
  },
];
const MECHANICS_SKILLS = [
  "Dead Bounce",
  "Post Pass",
  "Post Catch",
  "Flick Pass",
  "Nudge Pass",
  "Drop Catch",
  "Live Catch",
  "Shatz",
  "Back Flip",
  "Loop Pass",
  "Slap Save (Single)",
  "Slap Save (Double)",
  "Air Defense",
  "Cradle Separation",
  "Over Under",
  "Tap Pass",
];
const PRACTICE_LEAGUE_IMPORT_DESCRIPTION = "Select name to import Lansing Pinball League scores. Automatically imports new scores throughout the season.";
const LEAGUE_IMPORT_NOTE = "Imported from LPL stats CSV";
const MAX_PRACTICE_CHECKPOINTS = 12;

const EMPTY_STATE = {
  schemaVersion: 4,
  studyEvents: [],
  videoProgressEntries: [],
  scoreEntries: [],
  noteEntries: [],
  journalEntries: [],
  customGroups: [],
  leagueSettings: {
    playerName: "",
    csvAutoFillEnabled: true,
    lastImportAt: null,
    lastRepairVersion: null,
  },
  syncSettings: {
    cloudSyncEnabled: false,
    endpoint: "pinprof.com",
    phaseLabel: "Phase 1: On-device",
  },
  analyticsSettings: {
    gapMode: "compressInactive",
    useMedian: true,
  },
  rulesheetResumeOffsets: {},
  videoResumeHints: {},
  gameSummaryNotes: {},
  practiceSettings: {
    playerName: "",
    comparisonPlayerName: "",
    ifpaPlayerID: "",
    prpaPlayerID: "",
    selectedGroupID: null,
  },
};

const dom = {
  importInput: document.querySelector("#practice-import"),
  exportButton: document.querySelector("#practice-export"),
  sampleButton: document.querySelector("#practice-sample"),
  searchButton: document.querySelector("#practice-search-button"),
  settingsButton: document.querySelector("#practice-settings-button"),
  stateStatus: document.querySelector("#state-status"),
  libraryStatus: document.querySelector("#library-status"),
  schemaStatus: document.querySelector("#schema-status"),
  metrics: {
    scores: document.querySelector("#metric-scores"),
    journal: document.querySelector("#metric-journal"),
    groups: document.querySelector("#metric-groups"),
    study: document.querySelector("#metric-study"),
  },
  validationSummary: document.querySelector("#validation-summary"),
  validationCounts: document.querySelector("#validation-counts"),
  validationList: document.querySelector("#validation-list"),
  gameSearch: document.querySelector("#game-search"),
  gameList: document.querySelector("#game-list"),
  groupList: document.querySelector("#group-list"),
  selectedGameMeta: document.querySelector("#selected-game-meta"),
  selectedGameTitle: document.querySelector("#selected-game-title"),
  selectedContextStack: document.querySelector(".selected-context-stack"),
  selectedRouteLabel: document.querySelector("#selected-route-label"),
  selectedGroupLabel: document.querySelector("#selected-group-label"),
  gamePanelToolbar: document.querySelector("#game-panel-toolbar"),
  homeContent: document.querySelector("#home-content"),
  searchContent: document.querySelector("#search-content"),
  groupDashboardContent: document.querySelector("#group-dashboard-content"),
  groupEditorContent: document.querySelector("#group-editor-content"),
  summaryContent: document.querySelector("#summary-content"),
  entryContent: document.querySelector("#entry-content"),
  studyContent: document.querySelector("#study-content"),
  rulesheetContent: document.querySelector("#rulesheet-content"),
  playfieldContent: document.querySelector("#playfield-content"),
  journalContent: document.querySelector("#journal-content"),
  insightsContent: document.querySelector("#insights-content"),
  mechanicsContent: document.querySelector("#mechanics-content"),
  settingsContent: document.querySelector("#settings-content"),
  routeButtons: Array.from(document.querySelectorAll("[data-route]")),
  routePanels: {
    home: document.querySelector("#route-panel-home"),
    search: document.querySelector("#route-panel-search"),
    "group-dashboard": document.querySelector("#route-panel-group-dashboard"),
    "group-editor": document.querySelector("#route-panel-group-editor"),
    game: document.querySelector("#route-panel-game"),
    entry: document.querySelector("#route-panel-entry"),
    study: document.querySelector("#route-panel-study"),
    rulesheet: document.querySelector("#route-panel-rulesheet"),
    playfield: document.querySelector("#route-panel-playfield"),
    journal: document.querySelector("#route-panel-journal"),
    insights: document.querySelector("#route-panel-insights"),
    mechanics: document.querySelector("#route-panel-mechanics"),
    settings: document.querySelector("#route-panel-settings"),
  },
};

const initialStoredState = loadStoredState();
let practiceState = initialStoredState ?? structuredClone(EMPTY_STATE);
let statusMessage = initialStoredState ? "Loaded local Practice JSON" : "No Practice JSON loaded";
let statusIsError = false;
let catalog = {
  status: "loading",
  gamesByPracticeId: new Map(),
  resourcesByPracticeId: new Map(),
  targetsByPracticeId: new Map(),
  practiceIdByOpdb: new Map(),
  leagueRows: [],
  leaguePlayers: [],
  leagueIfpaByPlayer: new Map(),
  leagueMachineMappings: new Map(),
};
let routeSyncEnabled = false;
let pendingUrlGameID = "";
let selectedGameID = localStorage.getItem(SELECTED_GAME_KEY) || "";
let activeRoute = localStorage.getItem(ACTIVE_ROUTE_KEY) || "home";
let groupDashboardFilter = localStorage.getItem(GROUP_DASHBOARD_FILTER_KEY) || "current";
let groupEditorLibrary = localStorage.getItem(GROUP_EDITOR_LIBRARY_KEY) || "practice";
let groupEditorSearch = "";
let groupEditorTab = "search";
let groupEditorDraft = null;
let groupEditorTemplateSource = "none";
let groupEditorTemplateBank = 0;
let groupEditorTemplateDuplicateGroupID = "";
let entryActivity = ENTRY_ACTIVITY_IDS.has(localStorage.getItem(ENTRY_ACTIVITY_KEY))
  ? localStorage.getItem(ENTRY_ACTIVITY_KEY)
  : "score";
let gameSubview = GAME_SUBVIEW_IDS.has(localStorage.getItem(GAME_SUBVIEW_KEY))
  ? localStorage.getItem(GAME_SUBVIEW_KEY)
  : "summary";
let activeVideoByGame = loadActiveVideoState();
let selectedRulesheetResource = null;
let selectedPlayfieldResource = null;
let selectedJournalEntryID = localStorage.getItem(SELECTED_JOURNAL_KEY) || "";
let journalSelectionMode = false;
let selectedJournalEntryIDs = new Set();
let journalFilter = JOURNAL_FILTER_IDS.has(localStorage.getItem(JOURNAL_FILTER_KEY))
  ? localStorage.getItem(JOURNAL_FILTER_KEY)
  : "all";
let practiceCheckpoints = loadPracticeCheckpoints();
let selectedMechanicSkill = localStorage.getItem(MECHANICS_SKILL_KEY) || "";
let mechanicsComfort = Number(localStorage.getItem(MECHANICS_COMFORT_KEY)) || 3;
let practiceSearchTab = localStorage.getItem(PRACTICE_SEARCH_TAB_KEY) || "search";
let practiceSearchLibrary = localStorage.getItem(PRACTICE_SEARCH_LIBRARY_KEY) || "practice";
let practiceSearchQuery = "";
let practiceSearchManufacturer = "";
let practiceSearchYear = "";
let practiceSearchType = "";
let practiceSearchAdvancedExpanded = false;

if (SHOULD_BOOT_APP) {
  init();
}

function canonicalizeLocalPracticeHost() {
  if (!["localhost", "::1"].includes(window.location.hostname)) return true;
  const url = new URL(window.location.href);
  url.hostname = "127.0.0.1";
  window.location.replace(url.href);
  return false;
}

async function init() {
  applyRouteFromUrl();
  routeSyncEnabled = true;
  wireEvents();
  render();
  catalog = await loadCatalog();
  if (!selectedGameID) {
    selectedGameID = firstPracticeGameID();
  }
  render();
}

function wireEvents() {
  dom.importInput.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const importResult = await parsePracticeImportPayload(JSON.parse(await file.text()));
      practiceState = importResult.state;
      selectedGameID = firstPracticeGameID();
      activeRoute = "home";
      resetGroupEditorDraft();
      persistState();
      await recordPracticeCheckpoint(importResult.checkpointSource, file.name, importResult.state);
      setStatus(`Imported ${importResult.label} ${file.name}${importResult.verifiedHash ? " · verified hash" : ""}`);
      render();
    } catch (error) {
      setStatus(`Import failed: ${errorMessage(error)}`, true);
    } finally {
      dom.importInput.value = "";
    }
  });

  dom.exportButton.addEventListener("click", async () => {
    const filename = `pinprof-practice-${timestampSlug()}.json`;
    const normalized = normalizePracticeState(practiceState);
    await recordPracticeCheckpoint("Export", filename, normalized);
    downloadJson(filename, normalized);
    setStatus("Exported Practice JSON");
    render();
  });

  dom.sampleButton.addEventListener("click", async () => {
    try {
      const sample = await fetchJson(SAMPLE_URL);
      practiceState = normalizePracticeState(sample);
      selectedGameID = firstPracticeGameID();
      activeRoute = "home";
      resetGroupEditorDraft();
      persistState();
      await recordPracticeCheckpoint("Sample", "sample-practice-v4.json", practiceState);
      setStatus("Loaded sample Practice JSON");
      render();
    } catch (error) {
      setStatus(`Sample failed: ${errorMessage(error)}`, true);
    }
  });

  dom.gameSearch?.addEventListener("input", renderGameList);

  dom.routeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setActiveRoute(button.dataset.route || "home");
    });
  });

  dom.searchButton.addEventListener("click", openPracticeSearch);

  dom.settingsButton.addEventListener("click", () => {
    setActiveRoute("settings");
  });

  window.addEventListener("popstate", () => {
    applyRouteFromUrl();
    render();
  });
}

function applyRouteFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const requestedRoute = normalizedString(params.get("view") || params.get("route"));
  const requestedGameID = normalizedString(params.get("game") || params.get("gameID"));
  const requestedSubview = normalizedString(params.get("tab") || params.get("subview"));
  const requestedJournalID = normalizedString(params.get("journal"));
  const requestedGroupID = normalizedString(params.get("group"));
  const requestedLibrary = normalizedString(params.get("library"));
  pendingUrlGameID = requestedGameID || "";

  if (Object.hasOwn(dom.routePanels, requestedRoute)) {
    activeRoute = requestedRoute;
  } else if (requestedGameID) {
    activeRoute = "game";
  } else if (requestedJournalID) {
    activeRoute = "journal";
  } else if (requestedGroupID) {
    activeRoute = "group-dashboard";
  }

  if (requestedGameID) {
    selectedGameID = requestedGameID;
    localStorage.setItem(SELECTED_GAME_KEY, selectedGameID);
  }
  if (GAME_SUBVIEW_IDS.has(requestedSubview)) {
    gameSubview = requestedSubview;
    localStorage.setItem(GAME_SUBVIEW_KEY, gameSubview);
  }
  if (requestedJournalID) {
    selectedJournalEntryID = requestedJournalID;
    localStorage.setItem(SELECTED_JOURNAL_KEY, selectedJournalEntryID);
  }
  if (requestedGroupID && practiceState.customGroups.some((group) => normalizedString(group.id) === requestedGroupID)) {
    practiceState.practiceSettings.selectedGroupID = requestedGroupID;
  }
  if (requestedLibrary) {
    practiceSearchLibrary = practiceSearchLibraryOptionID(requestedLibrary);
    localStorage.setItem(PRACTICE_SEARCH_LIBRARY_KEY, practiceSearchLibrary);
  }
}

function syncRouteToUrl() {
  if (!routeSyncEnabled) return;
  const url = new URL(window.location.href);
  const params = url.searchParams;
  params.delete("route");
  params.delete("gameID");
  params.delete("subview");

  if (activeRoute && activeRoute !== "home") {
    params.set("view", activeRoute);
  } else {
    params.delete("view");
  }

  if (routeUsesSelectedGame(activeRoute) && selectedGameID) {
    params.set("game", selectedGameID);
  } else {
    params.delete("game");
  }

  if (activeRoute === "game") {
    params.set("tab", GAME_SUBVIEW_IDS.has(gameSubview) ? gameSubview : "summary");
  } else {
    params.delete("tab");
  }

  if (activeRoute === "journal" && selectedJournalEntryID) {
    params.set("journal", selectedJournalEntryID);
  } else {
    params.delete("journal");
  }

  const group = selectedGroup();
  if (["group-dashboard", "group-editor"].includes(activeRoute) && group?.id) {
    params.set("group", group.id);
  } else {
    params.delete("group");
  }

  if (activeRoute === "search") {
    params.set("library", practiceSearchLibraryOptionID(practiceSearchLibrary));
  } else {
    params.delete("library");
  }

  const next = url.href;
  if (next !== window.location.href) {
    window.history.replaceState(null, "", next);
  }
}

function routeUsesSelectedGame(route) {
  return ["game", "entry", "study", "rulesheet", "playfield", "journal", "insights"].includes(route);
}

async function loadCatalog() {
  if (!shouldAttemptPinballFetch()) {
    return {
      status: "Local preview without /pinball mirror",
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

  try {
    const [opdbRows, curations, rulesheets, playfields, videos, gameinfo, backglasses, targets, leagueStatsCsv, leagueIfpaCsv, leagueMappings] = await Promise.all([
      fetchPinballJson("/pinball/data/opdb_export.json"),
      fetchPinballJson("/pinball/data/practice_identity_curations_v1.json").catch(() => ({ splits: [] })),
      fetchPinballJson("/pinball/data/rulesheet_assets.json").catch(() => ({ records: [] })),
      fetchPinballJson("/pinball/data/playfield_assets.json").catch(() => ({ records: [] })),
      fetchPinballJson("/pinball/data/video_assets.json").catch(() => ({ records: [] })),
      fetchPinballJson("/pinball/data/gameinfo_assets.json").catch(() => ({ records: [] })),
      fetchPinballJson("/pinball/data/backglass_assets.json").catch(() => ({ records: [] })),
      fetchPinballJson("/pinball/data/lpl_targets_resolved_v2.json").catch(() => ({ items: [] })),
      fetchPinballText("/pinball/data/LPL_Stats.csv").catch(() => ""),
      fetchPinballText("/pinball/data/LPL_IFPA_Players.csv").catch(() => ""),
      fetchPinballJson("/pinball/data/lpl_machine_mappings_v1.json").catch(() => ({ items: [] })),
    ]);
    const curationIndex = parsePracticeIdentityCurations(curations);
    const practiceIdentityByOpdb = curationIndex.practiceIdentityByOpdb;
    const practiceIdByOpdb = new Map(practiceIdentityByOpdb);
    const gamesByPracticeId = new Map();
    const groupFallbacks = new Map();

    for (const row of Array.isArray(opdbRows) ? opdbRows : []) {
      if (!row || row.is_machine === false) continue;
      const opdbId = normalizedString(row.opdb_id);
      if (!opdbId) continue;
      const parts = parseOpdbId(opdbId);
      const practiceId = practiceIdentityByOpdb.get(opdbId)
        || practiceIdentityByOpdb.get(parts.machineId)
        || parts.groupId
        || opdbId;
      registerOpdbPracticeIdentity(practiceIdByOpdb, opdbId, practiceId);
      if (gamesByPracticeId.has(practiceId)) continue;
      const gameSummary = {
        practiceId,
        opdbId,
        name: normalizedString(row.common_name) || normalizedString(row.name) || practiceId,
        manufacturer: manufacturerName(row.manufacturer),
        year: parseYear(row.manufacture_date),
        type: normalizedString(row.type)?.toUpperCase() || "",
        imageUrl: primaryImageUrl(row.images),
      };
      gamesByPracticeId.set(practiceId, gameSummary);
      trackGroupFallback(groupFallbacks, parts.groupId, row, gameSummary);
    }

    for (const fallback of groupFallbacks.values()) {
      if (!fallback.practiceId || gamesByPracticeId.has(fallback.practiceId)) continue;
      gamesByPracticeId.set(fallback.practiceId, fallback);
    }

    const resourcesByPracticeId = new Map();
    for (const record of records(playfields)) {
      for (const id of practiceIdsForIdentity(record.practiceIdentity)) {
        ensureResources(resourcesByPracticeId, id).playfields.push(record);
      }
    }
    for (const record of records(backglasses)) {
      for (const id of practiceIdsForIdentity(record.practiceIdentity)) {
        ensureResources(resourcesByPracticeId, id).backglasses.push(record);
      }
    }
    for (const record of records(rulesheets)) {
      for (const id of practiceIdsForOpdb(practiceIdByOpdb, record.opdbId, record, "rulesheet", curationIndex)) {
        ensureResources(resourcesByPracticeId, id).rulesheets.push(record);
      }
    }
    for (const record of records(videos)) {
      for (const id of practiceIdsForOpdb(practiceIdByOpdb, record.opdbId, record, "video", curationIndex)) {
        ensureResources(resourcesByPracticeId, id).videos.push(record);
      }
    }
    for (const record of records(gameinfo)) {
      for (const id of practiceIdsForOpdb(practiceIdByOpdb, record.opdbId, record, "gameinfo", curationIndex)) {
        ensureResources(resourcesByPracticeId, id).gameinfo.push(record);
      }
    }

    const targetsByPracticeId = new Map();
    for (const item of Array.isArray(targets?.items) ? targets.items : []) {
      const id = normalizedString(item.practice_identity);
      if (!id) continue;
      targetsByPracticeId.set(id, item);
    }

    const assetCount = records(rulesheets).length + records(playfields).length + records(videos).length + records(gameinfo).length + records(backglasses).length;
    const leagueRows = parseLeagueRows(leagueStatsCsv);
    const leagueIfpaByPlayer = parseLeagueIfpaRecords(leagueIfpaCsv);
    const leagueMachineMappings = parseLeagueMachineMappings(leagueMappings);
    return {
      status: `Loaded ${gamesByPracticeId.size.toLocaleString()} games · ${assetCount.toLocaleString()} assets`,
      gamesByPracticeId,
      resourcesByPracticeId,
      targetsByPracticeId,
      practiceIdByOpdb,
      leagueRows,
      leaguePlayers: leaguePlayersFromRows(leagueRows),
      leagueIfpaByPlayer,
      leagueMachineMappings,
    };
  } catch (error) {
    return {
      status: `No mirrored /pinball data yet`,
      error: errorMessage(error),
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
}

function shouldAttemptPinballFetch() {
  const params = new URLSearchParams(window.location.search);
  const explicit = normalizedString(params.get("pinball")).toLowerCase();
  if (["0", "false", "off", "no"].includes(explicit)) return false;
  return true;
}

async function fetchPinballJson(path) {
  return fetchJson(path);
}

async function fetchPinballText(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${path}`);
  }
  return response.text();
}

async function fetchJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${path}`);
  }
  return response.json();
}

function render() {
  const state = normalizePracticeState(practiceState);
  practiceState = state;
  const gameIDs = practiceGameIDs();
  const hasCatalogGame = selectedGameID && catalog.gamesByPracticeId.has(selectedGameID);
  const isPendingUrlGame = pendingUrlGameID
    && selectedGameID === pendingUrlGameID
    && activeRoute === "game"
    && catalog.status === "loading";
  if (!selectedGameID || (!isPendingUrlGame && !gameIDs.includes(selectedGameID) && !(activeRoute === "game" && hasCatalogGame))) {
    selectedGameID = firstPracticeGameID();
  }
  if (catalog.status !== "loading") pendingUrlGameID = "";
  if (!Object.hasOwn(dom.routePanels, activeRoute)) {
    activeRoute = "home";
  }
  localStorage.setItem(SELECTED_GAME_KEY, selectedGameID);
  localStorage.setItem(ACTIVE_ROUTE_KEY, activeRoute);
  localStorage.setItem(GAME_SUBVIEW_KEY, gameSubview);

  dom.stateStatus.textContent = statusMessage;
  dom.stateStatus.classList.toggle("danger-text", statusIsError);
  dom.libraryStatus.textContent = catalog.status;
  dom.schemaStatus.textContent = `v${state.schemaVersion ?? 4}`;
  dom.metrics.scores.textContent = String(state.scoreEntries.length);
  dom.metrics.journal.textContent = String(state.journalEntries.length);
  dom.metrics.groups.textContent = String(state.customGroups.length);
  dom.metrics.study.textContent = String(state.studyEvents.length + state.videoProgressEntries.length);

  renderValidationReport(validatePracticeState(state, catalog));
  renderGameList();
  renderGroups();
  renderSelectedGame();
  renderHome();
  renderSearch();
  renderGroupDashboard();
  renderGroupEditor();
  renderEntry();
  renderRulesheet();
  renderPlayfield();
  renderInsights();
  renderMechanics();
  renderSettings();
  renderRoutes();
  syncRouteToUrl();
}

function setActiveRoute(route) {
  activeRoute = Object.hasOwn(dom.routePanels, route) ? route : "home";
  localStorage.setItem(ACTIVE_ROUTE_KEY, activeRoute);
  render();
}

function openPracticeSearch() {
  activeRoute = "search";
  localStorage.setItem(ACTIVE_ROUTE_KEY, activeRoute);
  render();
  window.requestAnimationFrame(() => {
    const input = document.querySelector("#practice-search-name");
    input?.focus();
    input?.select();
  });
}

function renderValidationReport(report) {
  dom.validationSummary.textContent = report.summary;
  dom.validationCounts.replaceChildren(
    validationPill("Errors", report.counts.error, "error"),
    validationPill("Warnings", report.counts.warning, "warning"),
    validationPill("Notes", report.counts.info, "info")
  );

  dom.validationList.replaceChildren();
  const visibleIssues = report.issues.slice(0, 10);
  if (!visibleIssues.length) {
    const item = document.createElement("div");
    item.className = "validation-item";
    item.dataset.severity = "info";
    item.innerHTML = `
      <span class="validation-severity">OK</span>
      <div>
        <span class="row-title">Canonical Practice JSON looks healthy.</span>
        <span class="row-meta">No schema, identity, or linked-entry issues found in the current local state.</span>
      </div>
    `;
    dom.validationList.append(item);
    return;
  }

  for (const issue of visibleIssues) {
    dom.validationList.append(validationIssueNode(issue));
  }

  if (report.issues.length > visibleIssues.length) {
    const more = document.createElement("p");
    more.className = "empty";
    more.textContent = `${report.issues.length - visibleIssues.length} more report items hidden.`;
    dom.validationList.append(more);
  }
}

function validationPill(label, count, severity) {
  const pill = document.createElement("div");
  pill.className = "validation-pill";
  pill.dataset.severity = severity;
  pill.innerHTML = `<strong>${count}</strong>${escapeHtml(label)}`;
  return pill;
}

function validationIssueNode(issue) {
  const item = document.createElement("div");
  item.className = "validation-item";
  item.dataset.severity = issue.severity;
  item.innerHTML = `
    <span class="validation-severity">${escapeHtml(issue.severity)}</span>
    <div>
      <span class="row-title">${escapeHtml(issue.title)}</span>
      <span class="row-meta">${escapeHtml(issue.detail)}</span>
    </div>
  `;
  return item;
}

function validatePracticeState(state, catalogState) {
  const issues = [];
  const addIssue = (severity, title, detail) => {
    issues.push({ severity, title, detail });
  };

  if (!hasPracticeData(state)) {
    addIssue("info", "No Practice JSON loaded", "Import your iOS export or load the sample file to run compatibility checks.");
    return buildValidationReport(issues);
  }

  if (state.schemaVersion !== EXPECTED_SCHEMA_VERSION) {
    addIssue(
      "warning",
      "Schema version mismatch",
      `Expected schemaVersion ${EXPECTED_SCHEMA_VERSION}, found ${String(state.schemaVersion)}.`
    );
  }

  for (const [field, label] of [
    ["studyEvents", "study events"],
    ["videoProgressEntries", "video progress entries"],
    ["scoreEntries", "score entries"],
    ["noteEntries", "note entries"],
    ["journalEntries", "journal entries"],
    ["customGroups", "custom groups"],
  ]) {
    if (!Array.isArray(state[field])) {
      addIssue("error", "Missing top-level array", `${field} must be an array of ${label}.`);
    }
  }

  validateDuplicateIds(issues, state.studyEvents, "studyEvents");
  validateDuplicateIds(issues, state.videoProgressEntries, "videoProgressEntries");
  validateDuplicateIds(issues, state.scoreEntries, "scoreEntries");
  validateDuplicateIds(issues, state.noteEntries, "noteEntries");
  validateDuplicateIds(issues, state.journalEntries, "journalEntries");
  validateDuplicateIds(issues, state.customGroups, "customGroups");

  for (const entry of state.studyEvents) {
    if (!ALLOWED_STUDY_TASKS.has(entry.task)) {
      addIssue("warning", "Unknown study task", `${entry.id || "Study event"} uses task "${String(entry.task)}".`);
    }
    if (!isValidTimestamp(entry.timestamp)) {
      addIssue("warning", "Invalid study timestamp", `${entry.id || "Study event"} has timestamp "${String(entry.timestamp)}".`);
    }
  }

  for (const entry of state.videoProgressEntries) {
    if (!ALLOWED_VIDEO_INPUTS.has(entry.kind)) {
      addIssue("warning", "Unknown video input kind", `${entry.id || "Video entry"} uses kind "${String(entry.kind)}".`);
    }
    if (!isValidTimestamp(entry.timestamp)) {
      addIssue("warning", "Invalid video timestamp", `${entry.id || "Video entry"} has timestamp "${String(entry.timestamp)}".`);
    }
  }

  for (const entry of state.scoreEntries) {
    if (!Number.isFinite(Number(entry.score)) || Number(entry.score) <= 0) {
      addIssue("error", "Invalid score", `${entry.id || "Score entry"} must have a score above 0.`);
    }
    if (!ALLOWED_SCORE_CONTEXTS.has(entry.context)) {
      addIssue("warning", "Unknown score context", `${entry.id || "Score entry"} uses context "${String(entry.context)}".`);
    }
    if (entry.context === "tournament" && !normalizedString(entry.tournamentName)) {
      addIssue("warning", "Missing tournament name", `${entry.id || "Tournament score"} is a tournament score without tournamentName.`);
    }
    if (!isValidTimestamp(entry.timestamp)) {
      addIssue("warning", "Invalid score timestamp", `${entry.id || "Score entry"} has timestamp "${String(entry.timestamp)}".`);
    }
  }

  for (const entry of state.noteEntries) {
    if (entry.category && !ALLOWED_NOTE_CATEGORIES.has(entry.category)) {
      addIssue("warning", "Unknown note category", `${entry.id || "Note entry"} uses category "${String(entry.category)}".`);
    }
    if (!isValidTimestamp(entry.timestamp)) {
      addIssue("warning", "Invalid note timestamp", `${entry.id || "Note entry"} has timestamp "${String(entry.timestamp)}".`);
    }
  }

  for (const entry of state.journalEntries) {
    if (!ALLOWED_JOURNAL_ACTIONS.has(entry.action)) {
      addIssue("warning", "Unknown journal action", `${entry.id || "Journal entry"} uses action "${String(entry.action)}".`);
    }
    if (entry.task && !ALLOWED_STUDY_TASKS.has(entry.task)) {
      addIssue("warning", "Unknown journal task", `${entry.id || "Journal entry"} uses task "${String(entry.task)}".`);
    }
    if (entry.scoreContext && !ALLOWED_SCORE_CONTEXTS.has(entry.scoreContext)) {
      addIssue("warning", "Unknown journal score context", `${entry.id || "Journal entry"} uses scoreContext "${String(entry.scoreContext)}".`);
    }
    if (entry.videoKind && !ALLOWED_VIDEO_INPUTS.has(entry.videoKind)) {
      addIssue("warning", "Unknown journal video input", `${entry.id || "Journal entry"} uses videoKind "${String(entry.videoKind)}".`);
    }
    if (!isValidTimestamp(entry.timestamp)) {
      addIssue("warning", "Invalid journal timestamp", `${entry.id || "Journal entry"} has timestamp "${String(entry.timestamp)}".`);
    }
  }

  for (const group of state.customGroups) {
    if (!normalizedString(group.name)) {
      addIssue("warning", "Unnamed group", `${group.id || "Custom group"} has no name.`);
    }
    if (!ALLOWED_GROUP_TYPES.has(group.type)) {
      addIssue("warning", "Unknown group type", `${group.id || group.name || "Custom group"} uses type "${String(group.type)}".`);
    }
    if (!Array.isArray(group.gameIDs) || group.gameIDs.length === 0) {
      addIssue("warning", "Empty group", `${group.name || group.id || "Custom group"} has no game IDs.`);
    }
    if (group.startDate && group.endDate && timestampValue(group.endDate) < timestampValue(group.startDate)) {
      addIssue("warning", "Group date range issue", `${group.name || group.id || "Custom group"} ends before it starts.`);
    }
  }

  if (!ALLOWED_GAP_MODES.has(state.analyticsSettings?.gapMode)) {
    addIssue("warning", "Unknown analytics gap mode", `analyticsSettings.gapMode is "${String(state.analyticsSettings?.gapMode)}".`);
  }

  const selectedGroupID = normalizedString(state.practiceSettings?.selectedGroupID);
  if (selectedGroupID && !state.customGroups.some((group) => group.id === selectedGroupID)) {
    addIssue("warning", "Selected group not found", `practiceSettings.selectedGroupID points to ${selectedGroupID}, but that group is not present.`);
  }

  validateLinkedJournalRows(issues, state);
  validateCatalogResolution(issues, state, catalogState);

  return buildValidationReport(issues);
}

function hasPracticeData(state) {
  return [
    state.studyEvents,
    state.videoProgressEntries,
    state.scoreEntries,
    state.noteEntries,
    state.journalEntries,
    state.customGroups,
  ].some((collection) => Array.isArray(collection) && collection.length > 0)
    || Object.keys(state.gameSummaryNotes ?? {}).length > 0;
}

function buildValidationReport(issues) {
  const counts = {
    error: issues.filter((issue) => issue.severity === "error").length,
    warning: issues.filter((issue) => issue.severity === "warning").length,
    info: issues.filter((issue) => issue.severity === "info").length,
  };
  let summary = "Canonical Practice JSON looks healthy.";
  if (counts.error > 0) {
    summary = "Fix errors before using this as sync test data.";
  } else if (counts.warning > 0) {
    summary = "Usable for review, with compatibility warnings to inspect.";
  } else if (counts.info > 0) {
    summary = "No blocking issues. Review notes for coverage context.";
  }
  return { counts, issues: sortValidationIssues(issues), summary };
}

function sortValidationIssues(issues) {
  const severityRank = { error: 0, warning: 1, info: 2 };
  return [...issues].sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);
}

function validateDuplicateIds(issues, entries, label) {
  const seen = new Set();
  const duplicates = new Set();
  for (const entry of entries ?? []) {
    const id = normalizedString(entry?.id);
    if (!id) {
      issues.push({
        severity: "error",
        title: "Missing record ID",
        detail: `${label} contains a record without an id.`,
      });
      continue;
    }
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  }
  if (duplicates.size > 0) {
    issues.push({
      severity: "error",
      title: `Duplicate IDs in ${label}`,
      detail: previewList([...duplicates]),
    });
  }
}

function buildScoreIndex(entries, keyForEntry) {
  const out = new Map();
  for (const entry of entries ?? []) {
    const key = keyForEntry(entry);
    if (!out.has(key)) out.set(key, []);
    out.get(key).push(entry);
  }
  return out;
}

function scoreJournalMatch(entry, exactScoreKeys, looseScoreIndex, scoreOnlyIndex) {
  const scoreLike = {
    gameID: entry.gameID,
    score: entry.score,
    context: entry.scoreContext,
    timestamp: entry.timestamp,
  };
  if (exactScoreKeys.has(scoreLinkKey(scoreLike))) return "exact";
  if (hasNearbyScore(looseScoreIndex.get(scoreLooseLinkKey(scoreLike)), entry.timestamp)) return "nearTimestamp";
  if (hasNearbyScore(scoreOnlyIndex.get(scoreOnlyLinkKey(scoreLike)), entry.timestamp)) return "nearContext";
  return null;
}

function hasNearbyScore(candidates, timestamp) {
  const targetTime = timestampValue(timestamp);
  if (targetTime <= 0) return false;
  return (candidates ?? []).some((entry) => {
    const scoreTime = timestampValue(entry.timestamp);
    return scoreTime > 0 && Math.abs(scoreTime - targetTime) <= SCORE_JOURNAL_MATCH_WINDOW_MS;
  });
}

function scoreJournalExample(entry, scoreOnlyIndex) {
  const gameID = normalizedString(entry.gameID) || "unknown game";
  const score = Number(entry.score);
  const context = normalizedString(entry.scoreContext) || "no context";
  const base = `${entry.id || "journal"} on ${gameID}, ${Number.isFinite(score) ? score.toLocaleString() : String(entry.score)}, ${context}`;
  const nearest = nearestScoreByTimestamp(scoreOnlyIndex.get(scoreOnlyLinkKey({
    gameID: entry.gameID,
    score: entry.score,
  })), entry.timestamp);
  if (!nearest) return `${base}, no score row with same game + score`;
  const nearestContext = normalizedString(nearest.entry.context) || "no context";
  return `${base}, nearest same-score row ${timeDeltaLabel(nearest.deltaMs)} away (${nearestContext})`;
}

function nearestScoreByTimestamp(candidates, timestamp) {
  const targetTime = timestampValue(timestamp);
  if (targetTime <= 0) return null;
  let nearest = null;
  for (const entry of candidates ?? []) {
    const scoreTime = timestampValue(entry.timestamp);
    if (scoreTime <= 0) continue;
    const deltaMs = Math.abs(scoreTime - targetTime);
    if (!nearest || deltaMs < nearest.deltaMs) nearest = { entry, deltaMs };
  }
  return nearest;
}

function timeDeltaLabel(deltaMs) {
  if (deltaMs < 1000) return "under 1 second";
  const seconds = Math.round(deltaMs / 1000);
  if (seconds < 60) return `${seconds} seconds`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours} hours`;
  return `${Math.round(hours / 24)} days`;
}

function hasPositiveNumericScore(value) {
  const score = Number(value);
  return Number.isFinite(score) && score > 0;
}

function scoreJournalWithoutScoreExample(entry) {
  const gameID = normalizedString(entry.gameID) || "unknown game";
  const context = normalizedString(entry.scoreContext) || "no context";
  const note = normalizedString(entry.note);
  return `${entry.id || "journal"} on ${gameID}, ${context}${note ? `, ${note}` : ""}`;
}

function validateLinkedJournalRows(issues, state) {
  const scoreKeys = new Set(state.scoreEntries.map((entry) => scoreLinkKey(entry)));
  const looseScoreIndex = buildScoreIndex(state.scoreEntries, scoreLooseLinkKey);
  const scoreOnlyIndex = buildScoreIndex(state.scoreEntries, scoreOnlyLinkKey);
  const studyKeys = new Set(state.studyEvents.map((entry) => studyLinkKey(entry.gameID, entry.task, entry.progressPercent, entry.timestamp)));
  const videoKeys = new Set(state.videoProgressEntries.map((entry) => videoLinkKey(entry.gameID, entry.kind, entry.value, entry.timestamp)));
  let orphanedScores = 0;
  let looselyMatchedScores = 0;
  const orphanedScoreExamples = [];
  let scoreJournalRowsWithoutScore = 0;
  const scoreJournalRowsWithoutScoreExamples = [];
  let orphanedStudy = 0;
  let orphanedVideo = 0;

  for (const entry of state.journalEntries) {
    if (entry.action === "scoreLogged") {
      if (!hasPositiveNumericScore(entry.score)) {
        scoreJournalRowsWithoutScore += 1;
        if (scoreJournalRowsWithoutScoreExamples.length < 3) {
          scoreJournalRowsWithoutScoreExamples.push(scoreJournalWithoutScoreExample(entry));
        }
        continue;
      }
      const scoreMatch = scoreJournalMatch(entry, scoreKeys, looseScoreIndex, scoreOnlyIndex);
      if (!scoreMatch) {
        orphanedScores += 1;
        if (orphanedScoreExamples.length < 3) {
          orphanedScoreExamples.push(scoreJournalExample(entry, scoreOnlyIndex));
        }
      } else if (scoreMatch !== "exact") {
        looselyMatchedScores += 1;
      }
    }
    if (entry.action === "rulesheetRead" && !studyKeys.has(studyLinkKey(entry.gameID, "rulesheet", entry.progressPercent, entry.timestamp))) {
      orphanedStudy += 1;
    }
    if ((entry.action === "tutorialWatch" || entry.action === "gameplayWatch")
      && !videoKeys.has(videoLinkKey(entry.gameID, entry.videoKind, entry.videoValue, entry.timestamp))) {
      orphanedVideo += 1;
    }
  }

  if (orphanedScores > 0) {
    issues.push({
      severity: "warning",
      title: "Orphaned score journal rows",
      detail: `${orphanedScores} score journal entries do not match a scoreEntries row by game, score, context, and timestamp. Examples: ${orphanedScoreExamples.join("; ")}.`,
    });
  }
  if (looselyMatchedScores > 0) {
    issues.push({
      severity: "info",
      title: "Score journal rows matched with tolerance",
      detail: `${looselyMatchedScores} score journal entries matched scoreEntries by game and score, but differed slightly by context or timestamp.`,
    });
  }
  if (scoreJournalRowsWithoutScore > 0) {
    issues.push({
      severity: "info",
      title: "Score journal rows without score payload",
      detail: `${scoreJournalRowsWithoutScore} scoreLogged journal entries have no score value and are treated as journal-only rows, not linked score rows. Examples: ${scoreJournalRowsWithoutScoreExamples.join("; ")}.`,
    });
  }
  if (orphanedStudy > 0) {
    issues.push({
      severity: "warning",
      title: "Orphaned rulesheet journal rows",
      detail: `${orphanedStudy} rulesheet journal entries do not match a studyEvents row by game, task, progress, and timestamp.`,
    });
  }
  if (orphanedVideo > 0) {
    issues.push({
      severity: "warning",
      title: "Orphaned video journal rows",
      detail: `${orphanedVideo} video journal entries do not match a videoProgressEntries row by game, value, and timestamp.`,
    });
  }
}

function validateCatalogResolution(issues, state, catalogState) {
  const gameIDs = practiceGameIDsFromState(state).filter(Boolean);
  if (catalogState.gamesByPracticeId.size === 0) {
    issues.push({
      severity: "info",
      title: "Catalog not loaded",
      detail: "Game identity and asset coverage checks need mirrored /pinball data.",
    });
    return;
  }

  const missingGames = gameIDs.filter((id) => !catalogState.gamesByPracticeId.has(id));
  if (missingGames.length > 0) {
    issues.push({
      severity: "warning",
      title: "Practice game IDs missing from OPDB catalog",
      detail: `${missingGames.length} game IDs did not resolve: ${previewList(missingGames)}.`,
    });
  }

  const resolvedGameIDs = gameIDs.filter((id) => catalogState.gamesByPracticeId.has(id));
  const gamesWithoutResources = resolvedGameIDs.filter((id) => {
    const resources = catalogState.resourcesByPracticeId.get(id) ?? emptyResources();
    return resources.rulesheets.length === 0
      && resources.playfields.length === 0
      && resources.videos.length === 0
      && resources.gameinfo.length === 0
      && resources.backglasses.length === 0;
  });
  if (gamesWithoutResources.length > 0) {
    issues.push({
      severity: "info",
      title: "Games without mapped study assets",
      detail: `${gamesWithoutResources.length} imported game IDs have no rulesheet, playfield, video, gameinfo, or backglass asset: ${previewList(gamesWithoutResources)}.`,
    });
  }
}

function practiceDataInspectorStats(state, catalogState, report) {
  const normalized = normalizePracticeState(state);
  const gameIDs = practiceGameIDsFromState(normalized);
  const catalogLoaded = catalogState.gamesByPracticeId.size > 0;
  const opdbResolvedGameIDs = catalogLoaded
    ? gameIDs.filter((id) => catalogState.gamesByPracticeId.has(id))
    : [];
  const opdbMissingGameIDs = catalogLoaded
    ? gameIDs.filter((id) => !catalogState.gamesByPracticeId.has(id))
    : [];
  const assetMappedGameIDs = opdbResolvedGameIDs.filter((id) => hasMappedStudyAssets(catalogState.resourcesByPracticeId.get(id) ?? emptyResources()));
  const assetMissingGameIDs = opdbResolvedGameIDs.filter((id) => !hasMappedStudyAssets(catalogState.resourcesByPracticeId.get(id) ?? emptyResources()));
  const importedLeagueScoreCount = normalized.scoreEntries.filter((entry) => entry.leagueImported).length;
  const timestamps = activityTimestamps(normalized);

  return {
    generatedAt: new Date().toISOString(),
    schemaVersion: normalized.schemaVersion,
    expectedSchemaVersion: EXPECTED_SCHEMA_VERSION,
    rowCounts: {
      scoreEntries: normalized.scoreEntries.length,
      studyEvents: normalized.studyEvents.length,
      videoProgressEntries: normalized.videoProgressEntries.length,
      noteEntries: normalized.noteEntries.length,
      journalEntries: normalized.journalEntries.length,
      customGroups: normalized.customGroups.length,
      gameSummaryNotes: Object.keys(normalized.gameSummaryNotes ?? {}).length,
    },
    gameCoverage: {
      importedGameIDs: gameIDs.length,
      catalogLoaded,
      opdbCatalogSize: catalogState.gamesByPracticeId.size,
      opdbResolved: opdbResolvedGameIDs.length,
      opdbMissing: opdbMissingGameIDs.length,
      assetMapped: assetMappedGameIDs.length,
      assetMissing: assetMissingGameIDs.length,
      opdbMissingGameIDs,
      assetMissingGameIDs,
    },
    linkedData: {
      scoreJournalRows: normalized.journalEntries.filter((entry) => entry.action === "scoreLogged").length,
      studyJournalRows: normalized.journalEntries.filter((entry) => ["rulesheetRead", "playfieldViewed", "practiceSession"].includes(entry.action)).length,
      videoJournalRows: normalized.journalEntries.filter((entry) => ["tutorialWatch", "gameplayWatch"].includes(entry.action)).length,
      noteJournalRows: normalized.journalEntries.filter((entry) => entry.action === "noteAdded").length,
    },
    activityRange: {
      firstActivityAt: timestamps.length ? new Date(Math.min(...timestamps)).toISOString() : null,
      lastActivityAt: timestamps.length ? new Date(Math.max(...timestamps)).toISOString() : null,
    },
    activityBreakdown: {
      scoreContexts: countBy(normalized.scoreEntries, (entry) => normalizedString(entry.context) || "unknown"),
      studyTasks: countBy(normalized.studyEvents, (entry) => normalizedString(entry.task) || "unknown"),
      journalActions: countBy(normalized.journalEntries, (entry) => normalizedString(entry.action) || "unknown"),
    },
    settings: {
      practice: {
        playerName: normalized.practiceSettings.playerName || "",
        comparisonPlayerName: normalized.practiceSettings.comparisonPlayerName || "",
        ifpaPlayerID: normalized.practiceSettings.ifpaPlayerID || "",
        prpaPlayerID: normalized.practiceSettings.prpaPlayerID || "",
        selectedGroupID: normalized.practiceSettings.selectedGroupID || null,
      },
      league: {
        playerName: normalized.leagueSettings.playerName || "",
        csvAutoFillEnabled: Boolean(normalized.leagueSettings.csvAutoFillEnabled),
        importedLeagueScoreCount,
        lastImportAt: normalized.leagueSettings.lastImportAt || null,
      },
      sync: {
        cloudSyncEnabled: Boolean(normalized.syncSettings.cloudSyncEnabled),
        endpoint: normalized.syncSettings.endpoint || "",
        phaseLabel: normalized.syncSettings.phaseLabel || "",
      },
      analytics: {
        gapMode: normalized.analyticsSettings.gapMode || "",
        useMedian: Boolean(normalized.analyticsSettings.useMedian),
      },
    },
    validation: {
      summary: report.summary,
      counts: report.counts,
      issues: report.issues,
    },
  };
}

function hasMappedStudyAssets(resources) {
  return resources.rulesheets.length > 0
    || resources.playfields.length > 0
    || resources.videos.length > 0
    || resources.gameinfo.length > 0
    || resources.backglasses.length > 0;
}

function activityTimestamps(state) {
  return [
    ...state.scoreEntries,
    ...state.studyEvents,
    ...state.videoProgressEntries,
    ...state.noteEntries,
    ...state.journalEntries,
  ]
    .map((entry) => timestampValue(entry.timestamp))
    .filter((value) => value > 0);
}

function countBy(entries, keyForEntry) {
  return entries.reduce((counts, entry) => {
    const key = keyForEntry(entry);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function practiceGameIDsFromState(state) {
  const ids = new Set();
  for (const group of state.customGroups ?? []) {
    for (const id of group.gameIDs ?? []) ids.add(id);
  }
  for (const entry of state.scoreEntries ?? []) ids.add(entry.gameID);
  for (const entry of state.studyEvents ?? []) ids.add(entry.gameID);
  for (const entry of state.videoProgressEntries ?? []) ids.add(entry.gameID);
  for (const entry of state.noteEntries ?? []) ids.add(entry.gameID);
  for (const entry of state.journalEntries ?? []) ids.add(entry.gameID);
  for (const id of Object.keys(state.gameSummaryNotes ?? {})) ids.add(id);
  return [...ids].map(normalizedString).filter(Boolean);
}

function scoreLinkKey(entry) {
  return [
    normalizedString(entry.gameID),
    String(Number(entry.score)),
    normalizedString(entry.context),
    timestampBucket(entry.timestamp),
  ].join("|");
}

function scoreLooseLinkKey(entry) {
  return [
    normalizedString(entry.gameID),
    String(Number(entry.score)),
    normalizedString(entry.context),
  ].join("|");
}

function scoreOnlyLinkKey(entry) {
  return [
    normalizedString(entry.gameID),
    String(Number(entry.score)),
  ].join("|");
}

function studyLinkKey(gameID, task, progressPercent, timestamp) {
  return [
    normalizedString(gameID),
    normalizedString(task),
    String(Number(progressPercent)),
    timestampBucket(timestamp),
  ].join("|");
}

function videoLinkKey(gameID, kind, value, timestamp) {
  return [
    normalizedString(gameID),
    normalizedString(kind),
    normalizedString(value),
    timestampBucket(timestamp),
  ].join("|");
}

function timestampBucket(value) {
  const timestamp = timestampValue(value);
  return timestamp > 0 ? String(Math.round(timestamp / 1000)) : "invalid";
}

function isValidTimestamp(value) {
  return timestampValue(value) > 0;
}

function previewList(values) {
  const visible = values.slice(0, 6);
  const suffix = values.length > visible.length ? `, +${values.length - visible.length} more` : "";
  return `${visible.join(", ")}${suffix}`;
}

function renderGameList() {
  if (!dom.gameSearch || !dom.gameList) return;
  const query = dom.gameSearch.value.trim().toLowerCase();
  const rows = practiceGameIDs()
    .map((gameID) => ({ gameID, game: catalog.gamesByPracticeId.get(gameID) }))
    .filter(({ gameID, game }) => {
      const label = `${game?.name ?? gameID} ${game?.manufacturer ?? ""} ${game?.year ?? ""}`.toLowerCase();
      return !query || label.includes(query);
    })
    .slice(0, 100);

  dom.gameList.replaceChildren();
  if (!rows.length) {
    dom.gameList.append(emptyNode("No Practice games loaded."));
    return;
  }

  for (const { gameID, game } of rows) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "game-row";
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", String(gameID === selectedGameID));
    button.innerHTML = `
      <span class="row-title">${escapeHtml(game?.name ?? gameID)}</span>
      <span class="row-meta">${escapeHtml(gameMeta(gameID, game))}</span>
    `;
    button.addEventListener("click", () => {
      selectedGameID = gameID;
      activeRoute = "game";
      localStorage.setItem(SELECTED_GAME_KEY, selectedGameID);
      localStorage.setItem(ACTIVE_ROUTE_KEY, activeRoute);
      render();
    });
    dom.gameList.append(button);
  }
}

function renderGroups() {
  if (!dom.groupList) return;
  dom.groupList.replaceChildren();
  const groups = [...practiceState.customGroups].sort((a, b) => Number(Boolean(b.isPriority)) - Number(Boolean(a.isPriority)));
  if (!groups.length) {
    dom.groupList.append(emptyNode("No groups."));
    return;
  }

  for (const group of groups) {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "compact-row";
    row.innerHTML = `
      <span class="row-title">${escapeHtml(group.name || "Untitled Group")}</span>
      <span class="row-meta">${group.gameIDs?.length ?? 0} games · ${group.isArchived ? "Archived" : "Current"}${group.isPriority ? " · Priority" : ""}</span>
    `;
    row.addEventListener("click", () => {
      practiceState.practiceSettings.selectedGroupID = group.id ?? null;
      const firstGame = firstGroupGameID(group);
      if (firstGame) selectedGameID = firstGame;
      activeRoute = "group-dashboard";
      persistState();
      render();
    });
    dom.groupList.append(row);
  }
}

function renderSelectedGame() {
  const game = catalog.gamesByPracticeId.get(selectedGameID);
  dom.selectedGameTitle.textContent = selectedGameID ? game?.name ?? selectedGameID : "Import Practice JSON";
  dom.selectedGameMeta.textContent = selectedGameID ? gameMeta(selectedGameID, game) : "Practice workspace";
  renderSummary();
  renderStudy();
  renderJournal();
}

function renderHome() {
  dom.homeContent.replaceChildren();
  if (!hasPracticeData(practiceState)) {
    const empty = document.createElement("div");
    empty.className = "empty-action-state";
    empty.append(
      emptyNode("Import Practice JSON or load the sample from Practice Settings to open Practice Home."),
      dashboardActionButton("Open Settings", () => setActiveRoute("settings"))
    );
    dom.homeContent.append(empty);
    return;
  }

  const home = document.createElement("div");
  home.className = "home-grid";
  const snapshot = selectedGameID ? gameSnapshot(selectedGameID) : null;
  home.append(
    homeHeaderNode(),
    homeResumeNode(snapshot),
    homeQuickEntryNode(),
    homeGroupsNode(),
    homeHubNode()
  );
  dom.homeContent.append(home);
}

function renderSearch() {
  dom.searchContent.replaceChildren();
  const root = document.createElement("div");
  root.className = "practice-search";
  root.append(searchModeNode());

  if (practiceSearchTab === "recent") {
    root.append(searchRecentNode());
  } else {
    root.append(searchFormNode(), searchResultsNode());
  }
  dom.searchContent.append(root);
}

function searchModeNode() {
  const section = document.createElement("section");
  section.className = "practice-search-card practice-search-mode";
  section.append(
    segmentButton("Search", practiceSearchTab === "search", () => {
      practiceSearchTab = "search";
      localStorage.setItem(PRACTICE_SEARCH_TAB_KEY, practiceSearchTab);
      renderSearch();
    }),
    segmentButton("Recent", practiceSearchTab === "recent", () => {
      practiceSearchTab = "recent";
      localStorage.setItem(PRACTICE_SEARCH_TAB_KEY, practiceSearchTab);
      renderSearch();
    })
  );
  return section;
}

function searchFormNode() {
  const section = document.createElement("section");
  section.className = "practice-search-card";

  const primary = document.createElement("div");
  primary.className = "practice-search-primary";

  const nameInput = entryInputNode("practiceSearchName", "search", "Game name");
  nameInput.id = "practice-search-name";
  nameInput.value = practiceSearchQuery;
  nameInput.autocomplete = "off";
  nameInput.addEventListener("input", () => {
    practiceSearchQuery = nameInput.value;
    renderSearchResultsOnly();
  });

  const librarySelect = document.createElement("select");
  librarySelect.setAttribute("aria-label", "Library");
  for (const option of practiceSearchLibraryOptions()) {
    const optionNode = document.createElement("option");
    optionNode.value = option.id;
    optionNode.textContent = option.label;
    librarySelect.append(optionNode);
  }
  librarySelect.value = practiceSearchLibraryOptionID(practiceSearchLibrary);
  librarySelect.addEventListener("change", () => {
    practiceSearchLibrary = practiceSearchLibraryOptionID(librarySelect.value);
    practiceSearchQuery = "";
    practiceSearchManufacturer = "";
    practiceSearchYear = "";
    practiceSearchType = "";
    practiceSearchAdvancedExpanded = false;
    localStorage.setItem(PRACTICE_SEARCH_LIBRARY_KEY, practiceSearchLibrary);
    renderSearch();
  });

  primary.append(
    entryFieldNode("Game name", nameInput),
    entryFieldNode("Library", librarySelect)
  );

  const advanced = document.createElement("details");
  advanced.className = "practice-search-advanced";
  advanced.open = practiceSearchAdvancedExpanded;
  advanced.addEventListener("toggle", () => {
    practiceSearchAdvancedExpanded = advanced.open;
  });

  const summary = document.createElement("summary");
  summary.textContent = "Advanced Filters";

  const filters = document.createElement("div");
  filters.className = "advanced-filter-grid";

  const manufacturerInput = entryInputNode("practiceSearchManufacturer", "search", "Manufacturer");
  manufacturerInput.value = practiceSearchManufacturer;
  manufacturerInput.autocomplete = "off";
  manufacturerInput.addEventListener("input", () => {
    practiceSearchManufacturer = manufacturerInput.value;
    renderSearchResultsOnly();
  });

  const yearInput = entryInputNode("practiceSearchYear", "search", "Year", { inputmode: "numeric" });
  yearInput.value = practiceSearchYear;
  yearInput.autocomplete = "off";
  yearInput.addEventListener("input", () => {
    practiceSearchYear = yearInput.value;
    renderSearchResultsOnly();
  });

  const typeSelect = entrySelectNode("practiceSearchType", practiceSearchTypeOptions());
  typeSelect.value = practiceSearchType;
  typeSelect.addEventListener("change", () => {
    practiceSearchType = typeSelect.value;
    renderSearchResultsOnly();
  });

  filters.append(
    entryFieldNode("Manufacturer", manufacturerInput),
    entryFieldNode("Year", yearInput),
    entryFieldNode("Type", typeSelect)
  );

  const clear = dashboardActionButton("Clear filters", () => {
    practiceSearchQuery = "";
    practiceSearchManufacturer = "";
    practiceSearchYear = "";
    practiceSearchType = "";
    renderSearch();
  }, !hasPracticeSearchFilters());

  advanced.append(summary, filters, clear);
  section.append(primary, advanced);
  return section;
}

function searchResultsNode() {
  const section = document.createElement("section");
  section.className = "practice-search-card";

  const visibleIDs = practiceSearchVisibleGameIDs();
  const totalIDs = practiceSearchCandidateIDs();
  const header = document.createElement("div");
  header.className = "practice-search-results-header";
  header.innerHTML = `
    <div>
      <h3>${escapeHtml(searchResultsTitle(visibleIDs.length))}</h3>
      <p class="row-meta">${escapeHtml(searchResultsSubtitle(totalIDs.length))}</p>
    </div>
  `;
  section.append(header);

  const list = document.createElement("div");
  list.className = "practice-search-results";
  if (!visibleIDs.length) {
    list.append(emptyNode(practiceSearchEmptyText()));
  } else {
    for (const gameID of visibleIDs) {
      list.append(searchResultRowNode(gameID));
    }
  }
  section.append(list);
  return section;
}

function renderSearchResultsOnly() {
  const existing = dom.searchContent.querySelector(".practice-search-card:last-child");
  if (!existing || practiceSearchTab !== "search") {
    renderSearch();
    return;
  }
  existing.replaceWith(searchResultsNode());
}

function searchRecentNode() {
  const section = document.createElement("section");
  section.className = "practice-search-card";
  const list = document.createElement("div");
  list.className = "practice-search-results";
  const recentIDs = practiceSearchRecentGameIDs().slice(0, 60);
  if (!recentIDs.length) {
    list.append(emptyNode("Games opened from search will show up here."));
  } else {
    for (const gameID of recentIDs) {
      list.append(searchResultRowNode(gameID, true));
    }
  }
  section.append(list);
  return section;
}

function searchResultRowNode(gameID, isRecent = false) {
  const game = catalog.gamesByPracticeId.get(gameID);
  const button = document.createElement("button");
  button.type = "button";
  button.className = "practice-search-row";
  button.innerHTML = `
    <span class="row-title">${escapeHtml(game?.name ?? gameID)}</span>
    <span class="row-meta">${escapeHtml(isRecent ? recentSearchMeta(gameID) : gameMeta(gameID, game))}</span>
  `;
  button.addEventListener("click", () => {
    selectedGameID = gameID;
    activeRoute = "game";
    localStorage.setItem(SELECTED_GAME_KEY, selectedGameID);
    localStorage.setItem(ACTIVE_ROUTE_KEY, activeRoute);
    rememberPracticeSearchGame(gameID);
    render();
  });
  return button;
}

function homeHeaderNode() {
  const header = document.createElement("section");
  header.className = "home-header";
  const playerName = normalizedString(practiceState.practiceSettings?.playerName || practiceState.leagueSettings?.playerName);
  const title = document.createElement("div");
  title.className = "home-greeting";
  title.innerHTML = `
    <h3>${escapeHtml(playerName ? `Welcome back, ${firstNameFromPlayerName(playerName)}` : "Welcome back")}</h3>
  `;

  header.append(title);
  return header;
}

function renderGroupDashboard() {
  dom.groupDashboardContent.replaceChildren();
  const groups = [...practiceState.customGroups];
  if (!groups.length) {
    const empty = document.createElement("div");
    empty.className = "empty-action-state";
    empty.append(emptyNode("Create or import groups to populate the dashboard."));
    empty.append(dashboardActionButton("New Group", openGroupEditorForCreate));
    dom.groupDashboardContent.append(empty);
    return;
  }

  const root = document.createElement("div");
  root.className = "group-dashboard";
  root.append(
    groupDashboardGroupListNode(groups),
    groupDashboardSelectedGroupNode(selectedGroup())
  );
  dom.groupDashboardContent.append(root);
}

function groupDashboardGroupListNode(groups) {
  const section = document.createElement("section");
  section.className = "group-dashboard-card";

  const header = document.createElement("div");
  header.className = "group-dashboard-header";
  const title = document.createElement("div");
  title.className = "group-dashboard-title";
  const filtered = groups.filter((group) => groupDashboardFilter === "archived" ? group.isArchived : !group.isArchived);
  title.innerHTML = `
    <h3>Groups</h3>
    <p class="row-meta">${filtered.length} ${groupDashboardFilter === "archived" ? "archived" : "current"} group${filtered.length === 1 ? "" : "s"}</p>
  `;
  const actions = document.createElement("div");
  actions.className = "group-dashboard-actions";
  actions.append(
    segmentButton("Current", groupDashboardFilter === "current", () => {
      groupDashboardFilter = "current";
      localStorage.setItem(GROUP_DASHBOARD_FILTER_KEY, groupDashboardFilter);
      render();
    }),
    segmentButton("Archived", groupDashboardFilter === "archived", () => {
      groupDashboardFilter = "archived";
      localStorage.setItem(GROUP_DASHBOARD_FILTER_KEY, groupDashboardFilter);
      render();
    }),
    dashboardIconButton("plus", "New Group", openGroupEditorForCreate),
    dashboardIconButton("pencil", "Edit Group", openGroupEditorForSelection, !selectedGroup())
  );
  header.append(title, actions);

  const table = document.createElement("div");
  table.className = "group-dashboard-table";
  table.append(groupDashboardHeaderRow());

  if (!filtered.length) {
    table.append(emptyNode(groupDashboardFilter === "archived" ? "No archived groups." : "No current groups."));
  } else {
    for (const group of filtered) {
      table.append(groupDashboardGroupRow(group));
    }
  }

  section.append(header, table);
  return section;
}

function groupDashboardHeaderRow() {
  const row = document.createElement("div");
  row.className = "group-dashboard-row group-dashboard-row-head";
  row.innerHTML = `
    <span>Name</span>
    <span>Priority</span>
    <span>Dates</span>
  `;
  return row;
}

function groupDashboardGroupRow(group) {
  const row = document.createElement("div");
  row.className = "group-dashboard-row group-dashboard-group-card";
  const isSelected = normalizedString(group.id) === normalizedString(selectedGroup()?.id);
  row.classList.toggle("is-selected", isSelected);

  const nameButton = document.createElement("button");
  nameButton.type = "button";
  nameButton.className = "group-name-button";
  const gameCount = group.gameIDs?.length ?? 0;
  const selectedLabel = isSelected
    ? `<span class="group-selected-badge">Selected</span>`
    : "";
  nameButton.innerHTML = `
    <span class="group-card-title-line">
      <span class="row-title">${escapeHtml(group.name || "Untitled Group")}</span>
      ${selectedLabel}
    </span>
    <span class="row-meta">${escapeHtml(`${gameCount} game${gameCount === 1 ? "" : "s"} · ${groupIsActive(group) ? "Active" : "Inactive"} · ${groupTypeLabel(group.type)}`)}</span>
  `;
  nameButton.addEventListener("click", () => {
    practiceState.practiceSettings.selectedGroupID = group.id ?? null;
    const firstGame = firstGroupGameID(group);
    if (firstGame) selectedGameID = firstGame;
    persistState();
    render();
  });

  const priorityButton = document.createElement("button");
  priorityButton.type = "button";
  priorityButton.className = "tiny-button priority-toggle";
  priorityButton.setAttribute("aria-label", `${group.name || "Group"} priority`);
  priorityButton.setAttribute("aria-pressed", String(Boolean(group.isPriority)));
  priorityButton.innerHTML = `
    <span class="priority-check" aria-hidden="true"></span>
    <span class="visually-hidden">${group.isPriority ? "Priority on" : "Priority off"}</span>
  `;
  priorityButton.addEventListener("click", () => {
    updateGroup(group.id, { isPriority: !group.isPriority });
    setStatus(`${group.name || "Group"} priority updated`);
  });

  const startInput = groupDateInput(group, "startDate");
  const endInput = groupDateInput(group, "endDate");
  const dates = document.createElement("div");
  dates.className = "group-date-controls";
  dates.append(
    groupDateFieldNode("Start", startInput),
    groupDateFieldNode("End", endInput)
  );

  row.append(nameButton, priorityButton, dates);
  return row;
}

function groupDateFieldNode(label, inputNode) {
  const field = document.createElement("div");
  field.className = "group-date-field";
  const labelNode = document.createElement("span");
  labelNode.className = "group-date-label";
  labelNode.textContent = label;
  field.append(labelNode, inputNode);
  return field;
}

function groupDateInput(group, field) {
  const picker = document.createElement("label");
  picker.className = "group-date-picker";
  picker.setAttribute("aria-label", `${field === "startDate" ? "Start" : "End"} date`);

  const display = document.createElement("span");
  display.className = "group-date-display";
  display.textContent = shortDateLabel(group[field]);

  const input = document.createElement("input");
  input.className = "group-date-input";
  input.type = "date";
  input.value = dateInputValue(group[field]);
  input.addEventListener("change", () => {
    updateGroup(group.id, { [field]: dateInputTimestamp(input.value) });
    setStatus("Group date updated");
  });
  picker.append(display, input);
  return picker;
}

function groupDashboardSelectedGroupNode(group) {
  const section = document.createElement("section");
  section.className = "group-dashboard-card group-dashboard-selected";
  if (!group) {
    section.append(emptyNode("Create or select a group to populate the dashboard."));
    return section;
  }

  const detail = groupDashboardDetail(group);
  const top = document.createElement("div");
  top.className = "selected-group-top";
  const header = document.createElement("div");
  header.className = "selected-group-header";
  const gameCount = group.gameIDs?.length ?? 0;
  header.innerHTML = `
    <div class="selected-group-title">
      <h3>${escapeHtml(group.name || "Untitled Group")}</h3>
      <p class="row-meta">${escapeHtml(`${gameCount} game${gameCount === 1 ? "" : "s"} in this group`)}</p>
    </div>
  `;
  const chips = document.createElement("div");
  chips.className = "status-chip-row";
  chips.append(
    statusChip(groupIsActive(group) ? "Active" : "Inactive"),
    statusChip(groupTypeLabel(group.type)),
    ...(group.isPriority ? [statusChip("Priority")] : []),
    ...(group.startDate ? [statusChip(shortDateLabel(group.startDate))] : []),
    ...(group.endDate ? [statusChip(shortDateLabel(group.endDate))] : [])
  );
  header.append(chips);

  const actions = document.createElement("div");
  actions.className = "group-dashboard-actions selected-group-actions";
  actions.append(
    dashboardActionButton("Edit Group", openGroupEditorForSelection),
    dashboardActionButton(group.isArchived ? "Restore" : "Archive", () => {
      updateGroup(group.id, group.isArchived
        ? { isArchived: false, isActive: true }
        : { isArchived: true, isActive: false, isPriority: false });
      setStatus(group.isArchived ? "Group restored" : "Group archived");
    }),
    dashboardActionButton("Delete", deleteSelectedGroup, false, true)
  );
  top.append(header, actions);

  const metrics = document.createElement("div");
  metrics.className = "dashboard-metrics";
  metrics.append(
    dashboardMetricNode("Completion", `${detail.score.completionAverage}%`),
    dashboardMetricNode("Stale", detail.score.staleGameCount),
    dashboardMetricNode("Variance Risk", detail.score.weakerGameCount)
  );

  const list = document.createElement("div");
  list.className = "snapshot-list";
  if (!detail.snapshots.length) {
    list.append(emptyNode("No games in this group yet."));
  } else {
    for (const snapshot of detail.snapshots) {
      list.append(groupSnapshotRow(snapshot, group));
    }
  }

  section.append(top, metrics, list);
  return section;
}

function groupSnapshotRow(snapshot, group) {
  const row = document.createElement("div");
  row.className = "snapshot-row";
  row.style.setProperty("--progress", `${snapshot.completionPercent}%`);

  const openButton = document.createElement("button");
  openButton.type = "button";
  openButton.className = "snapshot-open";
  openButton.innerHTML = `
    ${groupProgressWheelMarkup(snapshot.taskProgress, snapshot.completionPercent)}
    <span class="snapshot-main">
      <span class="row-title">${escapeHtml(snapshot.game?.name ?? snapshot.gameID)}</span>
      <span class="row-meta">${escapeHtml(groupProgressSummary(snapshot.taskProgress))}</span>
      <span class="row-meta">${escapeHtml(snapshot.scoreLabel)} · ${escapeHtml(snapshot.resourceLabel)}</span>
    </span>
  `;
  openButton.addEventListener("click", () => {
    selectedGameID = snapshot.gameID;
    activeRoute = "game";
    localStorage.setItem(SELECTED_GAME_KEY, selectedGameID);
    localStorage.setItem(ACTIVE_ROUTE_KEY, activeRoute);
    render();
  });

  const flags = document.createElement("div");
  flags.className = "snapshot-flags";
  if (snapshot.isStale) flags.append(statusChip("Stale"));
  if (snapshot.hasVarianceRisk) flags.append(statusChip("Variance"));
  if (!snapshot.isStale && !snapshot.hasVarianceRisk) flags.append(statusChip("Clear"));

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "tiny-button icon-button is-destructive";
  removeButton.setAttribute("aria-label", `Remove ${snapshot.game?.name ?? snapshot.gameID} from group`);
  removeButton.title = "Remove from group";
  removeButton.innerHTML = `
    <span class="dashboard-action-icon" aria-hidden="true">${dashboardIconSvg("trash")}</span>
    <span class="visually-hidden">Remove</span>
  `;
  removeButton.addEventListener("click", () => {
    if (!window.confirm(`Remove ${snapshot.game?.name ?? snapshot.gameID} from ${group.name || "this group"}?`)) return;
    removeGameFromGroup(snapshot.gameID, group.id);
  });

  const chevron = document.createElement("span");
  chevron.className = "snapshot-chevron";
  chevron.setAttribute("aria-hidden", "true");
  chevron.innerHTML = dashboardIconSvg("chevron-right");

  row.append(openButton, flags, chevron, removeButton);
  return row;
}

function groupDashboardFocusNode(group, detail) {
  const section = document.createElement("div");
  section.className = "focus-panel";

  const focusItems = focusItemsForGroup(group, detail, 5);
  const header = document.createElement("div");
  header.className = "focus-panel-header";
  header.innerHTML = `
    <div>
      <h4>Focus Queue</h4>
      <p class="row-meta">${focusItems.length ? `${focusItems.length} priority game${focusItems.length === 1 ? "" : "s"}` : "No urgent practice gaps"}</p>
    </div>
  `;
  section.append(header);

  const list = document.createElement("div");
  list.className = "focus-list";
  if (!focusItems.length) {
    list.append(emptyNode("This group is current for practice, study coverage, and score consistency."));
  } else {
    for (const snapshot of focusItems) {
      list.append(focusSnapshotRow(snapshot));
    }
  }
  section.append(list);
  return section;
}

function groupProgressWheelMarkup(taskProgress, completionPercent) {
  const radius = 20;
  const center = 24;
  const segment = 360 / STUDY_TASKS.length;
  const gap = 6;
  const colors = {
    playfield: "#68d8ff",
    rulesheet: "#81a7ff",
    tutorialVideo: "#f0a65e",
    gameplayVideo: "#b78cff",
    practice: "#78d7ac",
  };
  const paths = STUDY_TASKS.map((task, index) => {
    const start = -90 + (index * segment) + (gap / 2);
    const end = -90 + ((index + 1) * segment) - (gap / 2);
    const progress = clampPercent(taskProgress[task.id] ?? 0) / 100;
    const fillEnd = start + ((end - start) * progress);
    const track = describeProgressArc(center, center, radius, start, end);
    const fill = describeProgressArc(center, center, radius, start, fillEnd);
    return `
      <path class="progress-wheel-track" d="${track}"></path>
      <path class="progress-wheel-fill" d="${fill}" stroke="${colors[task.id] ?? "#f0c75e"}"></path>
    `;
  }).join("");

  return `
    <span class="progress-wheel" aria-label="${escapeAttribute(`Study progress ${completionPercent}%`)}">
      <svg class="progress-wheel-svg" viewBox="0 0 48 48" aria-hidden="true">${paths}</svg>
      <span class="progress-wheel-text">${escapeHtml(`${completionPercent}%`)}</span>
    </span>
  `;
}

function describeProgressArc(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = Math.abs(endAngle - startAngle) <= 180 ? "0" : "1";
  return `M ${start.x.toFixed(3)} ${start.y.toFixed(3)} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x.toFixed(3)} ${end.y.toFixed(3)}`;
}

function polarToCartesian(cx, cy, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180;
  return {
    x: cx + (radius * Math.cos(angleInRadians)),
    y: cy + (radius * Math.sin(angleInRadians)),
  };
}

function segmentButton(label, isActive, action) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "segment-button";
  button.setAttribute("aria-pressed", String(isActive));
  button.textContent = label;
  button.addEventListener("click", action);
  return button;
}

function dashboardActionButton(label, action, disabled = false, destructive = false, ariaLabel = "") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = destructive ? "tiny-button is-destructive" : "tiny-button";
  button.textContent = label;
  button.disabled = disabled;
  if (ariaLabel) {
    button.setAttribute("aria-label", ariaLabel);
    button.title = ariaLabel;
  }
  button.addEventListener("click", action);
  return button;
}

function dashboardIconButton(icon, ariaLabel, action, disabled = false, destructive = false) {
  const button = dashboardActionButton("", action, disabled, destructive, ariaLabel);
  button.classList.add("icon-button");
  button.innerHTML = `
    <span class="dashboard-action-icon" aria-hidden="true">${dashboardIconSvg(icon)}</span>
    <span class="visually-hidden">${escapeHtml(ariaLabel)}</span>
  `;
  return button;
}

function dashboardIconSvg(icon) {
  switch (icon) {
    case "plus":
      return `<svg viewBox="0 0 24 24"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>`;
    case "pencil":
      return `<svg viewBox="0 0 24 24"><path d="m15 5 4 4"></path><path d="M4 20l4-1 11-11-3-3L5 16z"></path></svg>`;
    case "trash":
      return `<svg viewBox="0 0 24 24"><path d="M4 7h16"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M6 7l1 13h10l1-13"></path><path d="M9 7V4h6v3"></path></svg>`;
    case "x":
      return `<svg viewBox="0 0 24 24"><path d="m6 6 12 12"></path><path d="m18 6-12 12"></path></svg>`;
    case "chevron-right":
      return `<svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"></path></svg>`;
    default:
      return `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"></circle></svg>`;
  }
}

function dashboardMetricNode(label, value) {
  const node = document.createElement("div");
  node.className = "dashboard-metric";
  node.innerHTML = `
    <span>${escapeHtml(label)}</span>
    <strong>${escapeHtml(value)}</strong>
  `;
  return node;
}

function statusChip(label) {
  const chip = document.createElement("span");
  chip.className = "status-chip";
  chip.textContent = label;
  return chip;
}

function openGroupEditorForCreate() {
  groupEditorDraft = newGroupDraft();
  resetGroupEditorTemplates();
  groupEditorSearch = "";
  groupEditorTab = "search";
  activeRoute = "group-editor";
  localStorage.setItem(ACTIVE_ROUTE_KEY, activeRoute);
  render();
}

function openGroupEditorForSelection() {
  const group = selectedGroup();
  if (!group) {
    openGroupEditorForCreate();
    return;
  }
  groupEditorDraft = groupDraftFromGroup(group);
  groupEditorSearch = "";
  groupEditorTab = "search";
  activeRoute = "group-editor";
  localStorage.setItem(ACTIVE_ROUTE_KEY, activeRoute);
  render();
}

function resetGroupEditorDraft() {
  groupEditorDraft = null;
  resetGroupEditorTemplates();
  groupEditorSearch = "";
  groupEditorTab = "search";
}

function renderGroupEditor() {
  dom.groupEditorContent.replaceChildren();
  if (activeRoute !== "group-editor") return;
  if (!hasPracticeData(practiceState)) {
    dom.groupEditorContent.append(emptyNode("Import Practice JSON or load the sample to edit groups."));
    return;
  }

  const draft = ensureGroupEditorDraft();
  if (!draft) {
    dom.groupEditorContent.append(emptyNode("Create or select a group to edit."));
    return;
  }

  const root = document.createElement("div");
  root.className = "group-editor";
  root.append(groupEditorDetailsNode(draft));
  if (draft.mode === "create") root.append(groupEditorTemplatesNode(draft));
  root.append(
    groupEditorSelectedGamesNode(draft),
    groupEditorPickerNode(draft),
    groupEditorSettingsNode(draft)
  );
  dom.groupEditorContent.append(root);
}

function ensureGroupEditorDraft() {
  if (groupEditorDraft) return groupEditorDraft;
  const group = selectedGroup();
  groupEditorDraft = group ? groupDraftFromGroup(group) : newGroupDraft();
  return groupEditorDraft;
}

function newGroupDraft() {
  return {
    mode: "create",
    id: crypto.randomUUID(),
    originalID: null,
    name: "",
    gameIDs: selectedGameID ? [selectedGameID] : [],
    type: "custom",
    isActive: true,
    isArchived: false,
    isPriority: false,
    startDate: Date.now(),
    endDate: null,
    createdAt: Date.now(),
  };
}

function resetGroupEditorTemplates() {
  groupEditorTemplateSource = "none";
  const banks = availableGroupTemplateBanks();
  groupEditorTemplateBank = banks[0] ?? 0;
  groupEditorTemplateDuplicateGroupID = practiceState.customGroups[0]?.id ?? "";
}

function groupDraftFromGroup(group) {
  return {
    mode: "edit",
    id: normalizedString(group.id) || crypto.randomUUID(),
    originalID: normalizedString(group.id) || null,
    name: group.name || "",
    gameIDs: uniqueStrings(group.gameIDs ?? []),
    type: ALLOWED_GROUP_TYPES.has(group.type) ? group.type : "custom",
    isActive: group.isActive !== false,
    isArchived: Boolean(group.isArchived),
    isPriority: Boolean(group.isPriority),
    startDate: timestampValue(group.startDate) || null,
    endDate: timestampValue(group.endDate) || null,
    createdAt: timestampValue(group.createdAt) || Date.now(),
  };
}

function groupEditorDetailsNode(draft) {
  const section = document.createElement("section");
  section.className = "group-editor-card";

  const header = document.createElement("div");
  header.className = "group-editor-header";
  header.innerHTML = `
    <div>
      <h3>${draft.mode === "create" ? "New Group" : "Edit Group"}</h3>
      <p class="row-meta">${escapeHtml(draft.gameIDs.length)} games selected</p>
    </div>
  `;
  const actions = document.createElement("div");
  actions.className = "group-editor-actions";
  actions.append(
    dashboardActionButton("Cancel", cancelGroupEditor),
    dashboardActionButton("Save", saveGroupEditorDraft, !groupEditorCanSave(draft))
  );
  header.append(actions);

  const form = document.createElement("div");
  form.className = "group-editor-form group-editor-name-form";

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.value = draft.name;
  nameInput.autocomplete = "off";
  nameInput.placeholder = "Group name";
  nameInput.addEventListener("input", () => {
    draft.name = nameInput.value;
    updateGroupEditorActionState(section, draft);
  });

  form.append(editorFieldNode("Name", nameInput));

  section.append(header, form);
  return section;
}

function groupEditorSettingsNode(draft) {
  const section = document.createElement("section");
  section.className = "group-editor-card group-editor-settings";
  const header = document.createElement("div");
  header.className = "group-editor-header";
  header.innerHTML = `
    <div>
      <h3>Settings</h3>
      <p class="row-meta">${escapeHtml(groupSettingsSummary(draft))}</p>
    </div>
  `;

  const typeControl = document.createElement("div");
  typeControl.className = "group-type-segments";
  for (const [value, label] of [["custom", "Custom"], ["bank", "Bank"], ["location", "Location"]]) {
    typeControl.append(segmentButton(label, draft.type === value, () => {
      draft.type = value;
      renderGroupEditor();
    }));
  }

  const grid = document.createElement("div");
  grid.className = "group-editor-form group-editor-settings-form";
  grid.append(
    editorFieldNode("Type", typeControl),
    groupEditorDateRowNode("Start Date", "startDate", draft),
    groupEditorDateRowNode("End Date", "endDate", draft),
    editorCheckNode("Active", draft.isActive, (checked) => {
      draft.isActive = checked;
      if (!checked) draft.isPriority = false;
      renderGroupEditor();
    }),
    editorCheckNode("Priority", draft.isPriority, (checked) => {
      draft.isPriority = checked;
      if (checked) draft.isActive = true;
      renderGroupEditor();
    }),
    editorCheckNode("Archived", draft.isArchived, (checked) => {
      draft.isArchived = checked;
      if (checked) {
        draft.isActive = false;
        draft.isPriority = false;
      }
      renderGroupEditor();
    })
  );

  section.append(header, grid);
  return section;
}

function groupEditorTemplatesNode(draft) {
  const section = document.createElement("section");
  section.className = "group-editor-card group-editor-templates";
  const header = document.createElement("div");
  header.className = "group-editor-header";
  header.innerHTML = `
    <div>
      <h3>Templates</h3>
      <p class="row-meta">${escapeHtml(groupTemplateSummary())}</p>
    </div>
  `;

  const sourceControl = document.createElement("div");
  sourceControl.className = "group-template-source";
  for (const [value, label] of [["none", "None"], ["bank", "LPL Bank"], ["duplicate", "Duplicate"]]) {
    sourceControl.append(segmentButton(label, groupEditorTemplateSource === value, () => {
      groupEditorTemplateSource = value;
      renderGroupEditor();
    }));
  }

  const content = document.createElement("div");
  content.className = "group-template-content";
  content.append(editorFieldNode("Template", sourceControl));
  if (groupEditorTemplateSource === "bank") {
    content.append(groupEditorBankTemplateNode(draft));
  } else if (groupEditorTemplateSource === "duplicate") {
    content.append(groupEditorDuplicateTemplateNode(draft));
  }

  section.append(header, content);
  return section;
}

function groupEditorBankTemplateNode(draft) {
  const banks = availableGroupTemplateBanks();
  if (!banks.length) return emptyNode("No LPL bank template data found.");
  if (!banks.includes(groupEditorTemplateBank)) groupEditorTemplateBank = banks[0];

  const bankSelect = document.createElement("select");
  for (const bank of banks) {
    const option = document.createElement("option");
    option.value = String(bank);
    option.textContent = `Bank ${bank}`;
    bankSelect.append(option);
  }
  bankSelect.value = String(groupEditorTemplateBank);
  bankSelect.addEventListener("change", () => {
    groupEditorTemplateBank = Number(bankSelect.value);
    renderGroupEditor();
  });

  const apply = dashboardActionButton("Apply LPL Bank Template", () => applyGroupEditorBankTemplate(draft));
  const row = document.createElement("div");
  row.className = "group-template-apply-row";
  row.append(editorFieldNode("Bank", bankSelect), apply);
  return row;
}

function groupEditorDuplicateTemplateNode(draft) {
  const candidates = groupEditorDuplicateCandidates(draft);
  if (!candidates.length) return emptyNode("No existing groups to duplicate.");
  if (!candidates.some((group) => normalizedString(group.id) === normalizedString(groupEditorTemplateDuplicateGroupID))) {
    groupEditorTemplateDuplicateGroupID = candidates[0].id;
  }

  const groupSelect = document.createElement("select");
  for (const group of candidates) {
    const option = document.createElement("option");
    option.value = group.id;
    option.textContent = group.name || "Untitled Group";
    groupSelect.append(option);
  }
  groupSelect.value = groupEditorTemplateDuplicateGroupID;
  groupSelect.addEventListener("change", () => {
    groupEditorTemplateDuplicateGroupID = groupSelect.value;
    renderGroupEditor();
  });

  const apply = dashboardActionButton("Apply Duplicate Group", () => applyGroupEditorDuplicateTemplate(draft));
  const row = document.createElement("div");
  row.className = "group-template-apply-row";
  row.append(editorFieldNode("Group", groupSelect), apply);
  return row;
}

function groupTemplateSummary() {
  switch (groupEditorTemplateSource) {
    case "bank":
      return "LPL bank";
    case "duplicate":
      return "Existing group";
    default:
      return "No template";
  }
}

function availableGroupTemplateBanks() {
  return [...new Set([...catalog.targetsByPracticeId.values()]
    .map((target) => Number(target?.bank))
    .filter((bank) => Number.isFinite(bank) && bank > 0))]
    .sort((a, b) => a - b);
}

function groupEditorDuplicateCandidates(draft) {
  const originalID = normalizedString(draft.originalID);
  return practiceState.customGroups
    .filter((group) => normalizedString(group.id) !== originalID)
    .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
}

function applyGroupEditorBankTemplate(draft) {
  const bank = Number(groupEditorTemplateBank);
  if (!Number.isFinite(bank) || bank <= 0) return;
  const gameIDs = [...catalog.targetsByPracticeId.entries()]
    .filter(([, target]) => Number(target?.bank) === bank)
    .map(([gameID]) => gameID)
    .sort((a, b) => gameDisplayName(a).localeCompare(gameDisplayName(b)));
  draft.gameIDs = uniqueStrings(gameIDs);
  draft.type = "bank";
  if (!normalizedString(draft.name)) draft.name = `Bank ${bank} Focus`;
  renderGroupEditor();
}

function applyGroupEditorDuplicateTemplate(draft) {
  const sourceID = normalizedString(groupEditorTemplateDuplicateGroupID);
  const source = practiceState.customGroups.find((group) => normalizedString(group.id) === sourceID);
  if (!source) return;
  draft.gameIDs = uniqueStrings(source.gameIDs ?? []);
  draft.type = ALLOWED_GROUP_TYPES.has(source.type) ? source.type : "custom";
  draft.isActive = source.isActive !== false;
  draft.isArchived = Boolean(source.isArchived);
  draft.isPriority = Boolean(source.isPriority);
  draft.startDate = timestampValue(source.startDate) || null;
  draft.endDate = timestampValue(source.endDate) || null;
  if (!normalizedString(draft.name)) draft.name = `Copy of ${source.name || "Group"}`;
  renderGroupEditor();
}

function groupEditorDateRowNode(labelText, field, draft) {
  const row = document.createElement("div");
  row.className = "group-editor-date-row";
  const label = document.createElement("span");
  label.className = "group-editor-date-label";
  label.textContent = labelText;

  const hasDate = Boolean(timestampValue(draft[field]));
  const dateInput = document.createElement("input");
  dateInput.type = "date";
  dateInput.value = hasDate ? dateInputValue(draft[field]) : "";
  dateInput.disabled = !hasDate;
  dateInput.addEventListener("change", () => {
    draft[field] = dateInputTimestamp(dateInput.value);
    updateGroupEditorActionState(dom.groupEditorContent, draft);
  });

  const toggle = document.createElement("input");
  toggle.type = "checkbox";
  toggle.className = "group-editor-switch";
  toggle.checked = hasDate;
  toggle.setAttribute("aria-label", `${labelText} enabled`);
  toggle.addEventListener("change", () => {
    draft[field] = toggle.checked ? (timestampValue(draft[field]) || Date.now()) : null;
    renderGroupEditor();
  });

  row.append(label, dateInput, toggle);
  return row;
}

function groupSettingsSummary(draft) {
  const flags = [
    draft.isActive ? "Active" : "Inactive",
    draft.isPriority ? "Priority" : "",
    draft.isArchived ? "Archived" : "",
    groupTypeLabel(draft.type),
  ].filter(Boolean);
  return flags.join(" · ");
}

function updateGroupEditorActionState(root, draft) {
  root.querySelectorAll(".group-editor-actions button").forEach((button) => {
    if (button.textContent === "Save") button.disabled = !groupEditorCanSave(draft);
  });
}

function editorFieldNode(labelText, control) {
  const label = document.createElement("label");
  label.className = "group-editor-field";
  const span = document.createElement("span");
  span.textContent = labelText;
  label.append(span, control);
  return label;
}

function editorCheckNode(labelText, checked, onChange) {
  const label = document.createElement("label");
  label.className = "group-editor-check";
  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = Boolean(checked);
  input.addEventListener("change", () => onChange(input.checked));
  const span = document.createElement("span");
  span.textContent = labelText;
  label.append(input, span);
  return label;
}

function groupEditorSelectedGamesNode(draft) {
  const section = document.createElement("section");
  section.className = "group-editor-card group-editor-titles";
  const header = document.createElement("div");
  header.className = "group-editor-header";
  header.innerHTML = `
    <div>
      <h3>Titles</h3>
      <p class="row-meta">${escapeHtml(draft.gameIDs.length)} selected</p>
    </div>
  `;
  section.append(header);

  const list = document.createElement("div");
  list.className = "selected-title-list";
  if (!draft.gameIDs.length) {
    list.append(emptyNode("No games selected."));
  } else {
    for (const gameID of draft.gameIDs) {
      list.append(groupEditorSelectedGameRow(gameID, draft));
    }
  }
  section.append(list);
  return section;
}

function groupEditorSelectedGameRow(gameID, draft) {
  const snapshot = gameSnapshot(gameID);
  const image = primaryGameImageForGame(snapshot);
  const row = document.createElement("article");
  row.className = "selected-title-card";
  row.draggable = true;
  row.dataset.gameId = gameID;
  row.innerHTML = `
    <div class="selected-title-art">
      ${image
        ? `<img src="${escapeAttribute(image.url)}" alt="${escapeAttribute(image.label)}">`
        : `<span class="selected-title-empty">No image</span>`
      }
    </div>
    <div class="selected-title-shade" aria-hidden="true"></div>
    <div class="selected-title-copy">
      <span class="selected-title-name">${escapeHtml(snapshot.game?.name ?? gameID)}</span>
      <span class="selected-title-meta">${escapeHtml(gameMeta(gameID, snapshot.game))}</span>
    </div>
  `;
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "selected-title-remove";
  remove.setAttribute("aria-label", `Remove ${snapshot.game?.name ?? gameID}`);
  remove.innerHTML = dashboardIconSvg("x");
  remove.addEventListener("click", () => {
    draft.gameIDs = draft.gameIDs.filter((candidate) => normalizedString(candidate) !== normalizedString(gameID));
    renderGroupEditor();
  });

  row.addEventListener("dragstart", (event) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData("text/plain", gameID);
      event.dataTransfer.effectAllowed = "move";
    }
    row.classList.add("is-dragging");
  });
  row.addEventListener("dragend", () => {
    row.classList.remove("is-dragging");
  });
  row.addEventListener("dragover", (event) => {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
    row.classList.add("is-drag-over");
  });
  row.addEventListener("dragleave", () => {
    row.classList.remove("is-drag-over");
  });
  row.addEventListener("drop", (event) => {
    event.preventDefault();
    row.classList.remove("is-drag-over");
    reorderGroupEditorGame(draft, event.dataTransfer?.getData("text/plain"), gameID);
  });

  row.append(remove);
  return row;
}

function reorderGroupEditorGame(draft, sourceID, targetID) {
  const source = normalizedString(sourceID);
  const target = normalizedString(targetID);
  if (!source || !target || source === target) return;
  const gameIDs = [...draft.gameIDs];
  const sourceIndex = gameIDs.findIndex((candidate) => normalizedString(candidate) === source);
  const targetIndex = gameIDs.findIndex((candidate) => normalizedString(candidate) === target);
  if (sourceIndex < 0 || targetIndex < 0) return;
  const [moved] = gameIDs.splice(sourceIndex, 1);
  const insertIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
  gameIDs.splice(insertIndex, 0, moved);
  draft.gameIDs = gameIDs;
  renderGroupEditor();
}

function groupEditorPickerNode(draft) {
  const section = document.createElement("section");
  section.className = "group-editor-card group-editor-picker";

  const header = document.createElement("div");
  header.className = "group-editor-header";
  const title = document.createElement("h3");
  title.textContent = "Add Games";
  const tabs = document.createElement("div");
  tabs.className = "editor-tabs";
  tabs.append(
    segmentButton("Search", groupEditorTab === "search", () => {
      groupEditorTab = "search";
      renderGroupEditor();
    }),
    segmentButton("Recent", groupEditorTab === "recent", () => {
      groupEditorTab = "recent";
      renderGroupEditor();
    })
  );
  header.append(title, tabs);

  const toolbar = document.createElement("div");
  toolbar.className = "game-picker-toolbar";
  const searchInput = document.createElement("input");
  searchInput.type = "search";
  searchInput.value = groupEditorSearch;
  searchInput.placeholder = groupEditorTab === "recent" ? "Search recent games" : "Search games";
  searchInput.autocomplete = "off";

  const librarySelect = document.createElement("select");
  for (const option of groupEditorLibraryOptions()) {
    const optionNode = document.createElement("option");
    optionNode.value = option.id;
    optionNode.textContent = option.label;
    librarySelect.append(optionNode);
  }
  librarySelect.value = groupEditorLibraryOptionID(groupEditorLibrary);
  librarySelect.addEventListener("change", () => {
    groupEditorLibrary = groupEditorLibraryOptionID(librarySelect.value);
    groupEditorSearch = "";
    localStorage.setItem(GROUP_EDITOR_LIBRARY_KEY, groupEditorLibrary);
    renderGroupEditor();
  });

  const count = document.createElement("span");
  count.className = "row-meta picker-result-count";

  const list = document.createElement("div");
  list.className = "candidate-list";

  const refreshCandidates = () => {
    const visibleIDs = groupEditorVisibleCandidateIDs();
    const totalIDs = groupEditorCandidateIDs();
    count.textContent = `${visibleIDs.length} of ${totalIDs.length}`;
    list.replaceChildren();
    if (!visibleIDs.length) {
      list.append(emptyNode("No games match."));
      return;
    }
    for (const gameID of visibleIDs) {
      list.append(groupEditorCandidateRow(gameID, draft));
    }
  };

  searchInput.addEventListener("input", () => {
    groupEditorSearch = searchInput.value;
    refreshCandidates();
  });

  toolbar.append(searchInput, librarySelect, count);
  refreshCandidates();

  section.append(header, toolbar, list);
  return section;
}

function groupEditorCandidateRow(gameID, draft) {
  const isSelected = draft.gameIDs.some((candidate) => normalizedString(candidate) === normalizedString(gameID));
  const game = catalog.gamesByPracticeId.get(gameID);
  const row = document.createElement("label");
  row.className = "candidate-row";
  row.classList.toggle("is-selected", isSelected);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = isSelected;
  checkbox.addEventListener("change", () => {
    toggleGroupEditorGame(gameID, checkbox.checked);
  });

  const copy = document.createElement("span");
  copy.className = "candidate-copy";
  copy.innerHTML = `
    <span class="row-title">${escapeHtml(game?.name ?? gameID)}</span>
    <span class="row-meta">${escapeHtml(gameMeta(gameID, game))}</span>
  `;
  row.append(checkbox, copy);
  return row;
}

function groupEditorLibraryOptions() {
  return [
    { id: "practice", label: `Practice Games (${practiceGameIDs().length})` },
    { id: "catalog", label: `OPDB Catalog (${catalog.gamesByPracticeId.size})` },
  ];
}

function groupEditorLibraryOptionID(value) {
  return value === "catalog" ? "catalog" : "practice";
}

function groupEditorVisibleCandidateIDs() {
  const query = normalizedString(groupEditorSearch).toLowerCase();
  const ids = groupEditorCandidateIDs().filter((gameID) => {
    if (!query) return true;
    const game = catalog.gamesByPracticeId.get(gameID);
    return [
      gameID,
      game?.name,
      game?.manufacturer,
      game?.year,
      game?.type,
    ].filter(Boolean).join(" ").toLowerCase().includes(query);
  });
  return ids.slice(0, groupEditorTab === "recent" ? 60 : 120);
}

function groupEditorCandidateIDs() {
  if (groupEditorTab === "recent") {
    return recentPracticeGameIDs();
  }
  if (groupEditorLibraryOptionID(groupEditorLibrary) === "catalog" && catalog.gamesByPracticeId.size > 0) {
    return [...catalog.gamesByPracticeId.keys()].sort((a, b) => gameDisplayName(a).localeCompare(gameDisplayName(b)));
  }
  return practiceGameIDs();
}

function recentPracticeGameIDs() {
  const entries = [
    ...practiceState.journalEntries,
    ...practiceState.scoreEntries,
    ...practiceState.studyEvents,
    ...practiceState.videoProgressEntries,
    ...practiceState.noteEntries,
  ].sort((a, b) => timestampValue(b.timestamp) - timestampValue(a.timestamp));
  return uniqueStrings(entries.map((entry) => entry.gameID));
}

function practiceSearchLibraryOptions() {
  return [
    { id: "practice", label: `Practice Games (${practiceGameIDs().length})` },
    { id: "catalog", label: `OPDB Catalog (${catalog.gamesByPracticeId.size})` },
  ];
}

function practiceSearchLibraryOptionID(value) {
  return value === "catalog" ? "catalog" : "practice";
}

function practiceSearchTypeOptions() {
  const types = uniqueStrings(practiceSearchCandidateIDs()
    .map((gameID) => normalizedString(catalog.gamesByPracticeId.get(gameID)?.type))
    .filter(Boolean))
    .sort((a, b) => a.localeCompare(b));
  return [["", "Any type"], ...types.map((type) => [type, type])];
}

function practiceSearchCandidateIDs() {
  if (practiceSearchLibraryOptionID(practiceSearchLibrary) === "catalog" && catalog.gamesByPracticeId.size > 0) {
    return [...catalog.gamesByPracticeId.keys()].sort((a, b) => gameDisplayName(a).localeCompare(gameDisplayName(b)));
  }
  return practiceGameIDs();
}

function practiceSearchVisibleGameIDs() {
  const query = normalizedString(practiceSearchQuery).toLowerCase();
  const manufacturer = normalizedString(practiceSearchManufacturer).toLowerCase();
  const year = normalizedString(practiceSearchYear).toLowerCase();
  const type = normalizedString(practiceSearchType).toLowerCase();
  return practiceSearchCandidateIDs()
    .filter((gameID) => {
      const game = catalog.gamesByPracticeId.get(gameID);
      if (query && ![
        gameID,
        game?.name,
        game?.manufacturer,
        game?.year,
        game?.type,
        game?.opdbID,
      ].filter(Boolean).join(" ").toLowerCase().includes(query)) return false;
      if (manufacturer && !normalizedString(game?.manufacturer).toLowerCase().includes(manufacturer)) return false;
      if (year && !String(game?.year ?? "").includes(year)) return false;
      if (type && normalizedString(game?.type).toLowerCase() !== type) return false;
      return true;
    })
    .slice(0, 160);
}

function hasPracticeSearchFilters() {
  return Boolean(
    normalizedString(practiceSearchQuery)
    || normalizedString(practiceSearchManufacturer)
    || normalizedString(practiceSearchYear)
    || normalizedString(practiceSearchType)
  );
}

function searchResultsTitle(count) {
  if (!hasPracticeSearchFilters()) {
    return practiceSearchLibraryOptionID(practiceSearchLibrary) === "catalog" ? "All Games" : "Practice Games";
  }
  return `${count} Result${count === 1 ? "" : "s"}`;
}

function searchResultsSubtitle(total) {
  const capped = practiceSearchVisibleGameIDs().length >= 160 ? "Showing first 160" : `${practiceSearchVisibleGameIDs().length} shown`;
  return `${capped} of ${total}`;
}

function practiceSearchEmptyText() {
  if (!practiceSearchCandidateIDs().length) {
    return "Import Practice JSON or wait for OPDB catalog data to load.";
  }
  if (!hasPracticeSearchFilters()) {
    return "Search by name or abbreviation. Open Advanced Filters for manufacturer, year, and game type.";
  }
  return "No games matched this search.";
}

function practiceSearchRecentGameIDs() {
  let stored = [];
  try {
    const raw = JSON.parse(localStorage.getItem(PRACTICE_SEARCH_RECENTS_KEY) || "[]");
    if (Array.isArray(raw)) stored = raw.map(normalizedString).filter(Boolean);
  } catch {
    stored = [];
  }
  return uniqueStrings([...stored, ...recentPracticeGameIDs()]);
}

function rememberPracticeSearchGame(gameID) {
  const id = normalizedString(gameID);
  if (!id) return;
  const next = uniqueStrings([id, ...practiceSearchRecentGameIDs()]).slice(0, 40);
  localStorage.setItem(PRACTICE_SEARCH_RECENTS_KEY, JSON.stringify(next));
}

function recentSearchMeta(gameID) {
  const snapshot = gameSnapshot(gameID);
  return snapshot.lastActivity ? `Last ${formatDate(snapshot.lastActivity)}` : gameMeta(gameID, snapshot.game);
}

function toggleGroupEditorGame(gameID, shouldInclude) {
  const draft = ensureGroupEditorDraft();
  const id = normalizedString(gameID);
  if (!id) return;
  const existing = new Set(draft.gameIDs.map(normalizedString).filter(Boolean));
  if (shouldInclude) {
    existing.add(id);
  } else {
    existing.delete(id);
  }
  draft.gameIDs = [...existing];
  renderGroupEditor();
}

function groupEditorCanSave(draft) {
  if (!draft) return false;
  if (!normalizedString(draft.name)) return false;
  if (!uniqueStrings(draft.gameIDs ?? []).length) return false;
  if (draft.startDate && draft.endDate && timestampValue(draft.endDate) < timestampValue(draft.startDate)) return false;
  return true;
}

function saveGroupEditorDraft() {
  const draft = ensureGroupEditorDraft();
  if (!groupEditorCanSave(draft)) {
    setStatus("Group needs a name, at least one game, and a valid date range.", true);
    updateGroupEditorActionState(dom.groupEditorContent, draft);
    return;
  }

  const group = normalizedGroupFromDraft(draft);
  const originalID = normalizedString(draft.originalID);
  const groups = [...practiceState.customGroups];
  const editIndex = originalID
    ? groups.findIndex((candidate) => normalizedString(candidate.id) === originalID)
    : -1;

  if (group.isPriority) {
    for (let i = 0; i < groups.length; i += 1) {
      groups[i] = { ...groups[i], isPriority: false };
    }
  }

  if (editIndex >= 0) {
    groups[editIndex] = { ...groups[editIndex], ...group };
  } else {
    groups.push(group);
  }

  practiceState.customGroups = groups;
  practiceState.practiceSettings.selectedGroupID = group.id;
  selectedGameID = group.gameIDs[0] || selectedGameID;
  activeRoute = "group-dashboard";
  resetGroupEditorDraft();
  persistState();
  setStatus(editIndex >= 0 ? "Group saved" : "Group created");
  render();
}

function normalizedGroupFromDraft(draft) {
  const isArchived = Boolean(draft.isArchived);
  const isActive = isArchived ? false : draft.isActive !== false;
  return {
    id: normalizedString(draft.id) || crypto.randomUUID(),
    name: normalizedString(draft.name),
    gameIDs: uniqueStrings(draft.gameIDs ?? []),
    type: ALLOWED_GROUP_TYPES.has(draft.type) ? draft.type : "custom",
    isActive,
    isArchived,
    isPriority: isArchived ? false : isActive && Boolean(draft.isPriority),
    startDate: timestampValue(draft.startDate) || null,
    endDate: timestampValue(draft.endDate) || null,
    createdAt: timestampValue(draft.createdAt) || Date.now(),
  };
}

function cancelGroupEditor() {
  resetGroupEditorDraft();
  activeRoute = practiceState.customGroups.length ? "group-dashboard" : "home";
  localStorage.setItem(ACTIVE_ROUTE_KEY, activeRoute);
  render();
}

function deleteSelectedGroup() {
  const group = selectedGroup();
  if (!group) return;
  if (!window.confirm(`Delete ${group.name || "this group"}? This removes the group but keeps game scores and journal entries.`)) return;
  const deletedID = normalizedString(group.id);
  practiceState.customGroups = practiceState.customGroups.filter((candidate) => normalizedString(candidate.id) !== deletedID);
  practiceState.practiceSettings.selectedGroupID = practiceState.customGroups[0]?.id ?? null;
  activeRoute = practiceState.customGroups.length ? "group-dashboard" : "home";
  persistState();
  setStatus("Group deleted");
  render();
}

function homeResumeNode(snapshot) {
  const section = document.createElement("section");
  section.className = "home-block home-resume";

  if (!snapshot) {
    section.append(emptyNode("No game selected."));
    return section;
  }

  const image = primaryGameImageForGame(snapshot);
  const body = document.createElement("div");
  body.className = "home-resume-body";

  const resumeButton = document.createElement("button");
  resumeButton.type = "button";
  resumeButton.className = "home-resume-art";
  resumeButton.setAttribute("aria-label", `Resume ${snapshot.game?.name ?? snapshot.gameID}`);
  resumeButton.innerHTML = `
    ${image ? `<img src="${escapeAttribute(image.url)}" alt="${escapeAttribute(image.label)}">` : `<span class="home-resume-empty">No image</span>`}
    <span class="home-resume-title">${escapeHtml(snapshot.game?.name ?? snapshot.gameID)}</span>
  `;
  resumeButton.addEventListener("click", () => {
    selectedGameID = snapshot.gameID;
    activeRoute = "game";
    localStorage.setItem(SELECTED_GAME_KEY, selectedGameID);
    localStorage.setItem(ACTIVE_ROUTE_KEY, activeRoute);
    render();
  });

  const controls = document.createElement("div");
  controls.className = "home-resume-controls";
  controls.append(
    homeLibraryControlNode(),
    homeGameListControlNode()
  );

  body.append(resumeButton, controls);
  section.append(body);
  return section;
}

function homeLibraryControlNode() {
  const label = document.createElement("label");
  label.className = "home-stacked-control";
  const title = document.createElement("span");
  title.textContent = "Library";

  const select = document.createElement("select");
  select.setAttribute("aria-label", "Library");
  for (const option of practiceSearchLibraryOptions()) {
    const optionNode = document.createElement("option");
    optionNode.value = option.id;
    optionNode.textContent = option.label;
    select.append(optionNode);
  }
  select.value = practiceSearchLibraryOptionID(practiceSearchLibrary);
  select.addEventListener("change", () => {
    practiceSearchLibrary = practiceSearchLibraryOptionID(select.value);
    practiceSearchQuery = "";
    practiceSearchManufacturer = "";
    practiceSearchYear = "";
    practiceSearchType = "";
    localStorage.setItem(PRACTICE_SEARCH_LIBRARY_KEY, practiceSearchLibrary);
    const candidates = homeGameListIDs();
    if (candidates.length && !candidates.includes(selectedGameID)) {
      selectedGameID = candidates[0];
      localStorage.setItem(SELECTED_GAME_KEY, selectedGameID);
    }
    render();
  });

  label.append(title, select);
  return label;
}

function homeGameListControlNode() {
  const label = document.createElement("label");
  label.className = "home-stacked-control";
  const title = document.createElement("span");
  title.textContent = "Game List";

  const select = document.createElement("select");
  select.setAttribute("aria-label", "Game List");
  const candidates = homeGameListIDs();
  for (const gameID of candidates) {
    const option = document.createElement("option");
    option.value = gameID;
    option.textContent = gameDisplayName(gameID);
    select.append(option);
  }
  select.value = candidates.includes(selectedGameID) ? selectedGameID : "";
  select.disabled = candidates.length === 0;
  select.addEventListener("change", () => {
    const nextGameID = normalizedString(select.value);
    if (!nextGameID) return;
    selectedGameID = nextGameID;
    activeRoute = "game";
    localStorage.setItem(SELECTED_GAME_KEY, selectedGameID);
    localStorage.setItem(ACTIVE_ROUTE_KEY, activeRoute);
    render();
  });

  label.append(title, select);
  return label;
}

function homeGameListIDs() {
  if (practiceSearchLibraryOptionID(practiceSearchLibrary) === "catalog" && catalog.gamesByPracticeId.size > 0) {
    return [...catalog.gamesByPracticeId.keys()].sort((a, b) => gameDisplayName(a).localeCompare(gameDisplayName(b)));
  }
  return practiceGameIDs();
}

function homeQuickEntryNode() {
  const section = document.createElement("section");
  section.className = "home-block";
  const title = document.createElement("h3");
  title.textContent = "Quick Entry";
  const actions = document.createElement("div");
  actions.className = "quick-action-grid";
  actions.append(
    homeActionButton("Score", "entry", "score"),
    homeActionButton("Study", "entry", "rulesheet"),
    homeActionButton("Practice", "entry", "practice"),
    homeActionButton("Mechanics", "entry", "mechanics")
  );
  section.append(title, actions);
  return section;
}

function homeHubNode() {
  const section = document.createElement("section");
  section.className = "home-block home-hub";
  const title = document.createElement("h3");
  title.textContent = "Practice Hub";
  const grid = document.createElement("div");
  grid.className = "home-hub-grid";
  for (const destination of PRACTICE_HUB_DESTINATIONS) {
    grid.append(homeHubCardNode(destination));
  }
  section.append(title, grid);
  return section;
}

function homeHubCardNode(destination) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "home-hub-card";
  button.innerHTML = `
    <span class="hub-card-heading">
      <span class="hub-icon" aria-hidden="true">${homeActionIconSvg(destination.icon)}</span>
      <span class="row-title">${escapeHtml(destination.label)}</span>
    </span>
    <span class="row-meta">${escapeHtml(destination.subtitle)}</span>
  `;
  button.addEventListener("click", () => setActiveRoute(destination.id));
  return button;
}

function homeFocusQueueNode() {
  const section = document.createElement("section");
  section.className = "home-block";
  const group = selectedGroup();
  const title = document.createElement("div");
  title.className = "home-block-heading";
  title.innerHTML = `
    <h3>Focus Queue</h3>
    <span class="context-chip${group ? "" : " is-muted"}">${escapeHtml(group?.name || "No group")}</span>
  `;
  section.append(title);

  if (!group) {
    section.append(emptyNode("Create or import a group to see practice priorities."));
    return section;
  }

  const list = document.createElement("div");
  list.className = "focus-list";
  const focusItems = focusItemsForGroup(group, null, 4);
  if (!focusItems.length) {
    list.append(emptyNode("No urgent practice gaps in the selected group."));
  } else {
    for (const snapshot of focusItems) {
      list.append(focusSnapshotRow(snapshot, true));
    }
  }
  section.append(list);
  return section;
}

function homeGroupsNode() {
  const section = document.createElement("section");
  section.className = "home-block home-groups";
  const title = document.createElement("h3");
  title.textContent = "Active Groups";
  section.append(title);

  const groups = activeGroups();
  if (!groups.length) {
    section.append(emptyNode("No active groups."));
    return section;
  }

  const list = document.createElement("div");
  list.className = "home-group-list";
  for (const group of groups.slice(0, 8)) {
    list.append(homeGroupNode(group));
  }
  section.append(list);
  return section;
}

function homeGroupNode(group) {
  const selectedGroupID = normalizedString(practiceState.practiceSettings?.selectedGroupID);
  const games = (group.gameIDs ?? []).filter(Boolean).slice(0, 8);
  const card = document.createElement("div");
  card.className = "home-group-card";
  const heading = document.createElement("div");
  heading.className = "home-group-heading";
  heading.innerHTML = `
    <span class="row-title">${escapeHtml(group.name || "Untitled Group")}</span>
    <span class="context-chip${selectedGroupID === normalizedString(group.id) ? "" : " is-muted"}">${selectedGroupID === normalizedString(group.id) ? "Selected" : `${games.length} games`}</span>
  `;
  const rail = document.createElement("div");
  rail.className = "home-game-rail";
  if (!games.length) {
    rail.append(emptyNode("No games in this group."));
  } else {
    for (const gameID of games) {
      rail.append(homeGameMiniCardNode(gameID));
    }
  }
  card.append(heading, rail);
  return card;
}

function homeGameMiniCardNode(gameID) {
  const snapshot = gameSnapshot(gameID);
  const image = primaryGameImageForGame(snapshot);
  const button = document.createElement("button");
  button.type = "button";
  button.className = "home-game-mini-card";
  button.innerHTML = `
    ${image
      ? `<img src="${escapeAttribute(image.url)}" alt="${escapeAttribute(image.label)}">`
      : `<span class="home-game-mini-card-empty">No image</span>`
    }
    <span class="home-game-mini-card-title">${escapeHtml(snapshot.game?.name ?? gameID)}</span>
  `;
  button.addEventListener("click", () => {
    selectedGameID = gameID;
    activeRoute = "game";
    localStorage.setItem(SELECTED_GAME_KEY, selectedGameID);
    localStorage.setItem(ACTIVE_ROUTE_KEY, activeRoute);
    render();
  });
  return button;
}

function homeRecentNode() {
  const section = document.createElement("section");
  section.className = "home-block";
  const title = document.createElement("h3");
  title.textContent = "Recent";
  section.append(title);

  const entries = [...practiceState.journalEntries]
    .sort((a, b) => timestampValue(b.timestamp) - timestampValue(a.timestamp))
    .slice(0, 8);
  if (!entries.length) {
    section.append(emptyNode("No recent activity."));
    return section;
  }

  const list = document.createElement("div");
  list.className = "data-list";
  for (const entry of entries) {
    const gameID = normalizedString(entry.gameID);
    const row = document.createElement("button");
    row.type = "button";
    row.className = "data-row home-recent-row";
    row.innerHTML = `
      <span class="row-title">${escapeHtml(journalSummary(entry))}</span>
      <span class="row-meta">${escapeHtml(gameDisplayName(gameID))} · ${escapeHtml(formatDate(entry.timestamp))}</span>
    `;
    row.addEventListener("click", () => {
      if (gameID) selectedGameID = gameID;
      selectedJournalEntryID = normalizedString(entry.id);
      activeRoute = "journal";
      localStorage.setItem(SELECTED_GAME_KEY, selectedGameID);
      localStorage.setItem(ACTIVE_ROUTE_KEY, activeRoute);
      localStorage.setItem(SELECTED_JOURNAL_KEY, selectedJournalEntryID);
      render();
    });
    list.append(row);
  }
  section.append(list);
  return section;
}

function homeActionButton(label, route, activity = null) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "home-action-button";
  button.setAttribute("aria-label", label);
  const icon = homeActionIconName(label, route, activity);
  button.innerHTML = `
    <span class="home-action-icon" aria-hidden="true">${homeActionIconSvg(icon)}</span>
    <span>${escapeHtml(label)}</span>
  `;
  button.addEventListener("click", () => {
    if (ENTRY_ACTIVITY_IDS.has(activity)) {
      entryActivity = activity;
      localStorage.setItem(ENTRY_ACTIVITY_KEY, entryActivity);
    }
    setActiveRoute(route);
  });
  return button;
}

function disabledHomeActionButton(label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "home-action-button";
  button.setAttribute("aria-label", label);
  button.innerHTML = `
    <span class="home-action-icon" aria-hidden="true">${homeActionIconSvg("circle")}</span>
    <span>${escapeHtml(label)}</span>
  `;
  button.disabled = true;
  return button;
}

function homeActionIconName(label, route, activity) {
  if (activity === "score") return "score";
  if (activity === "rulesheet" || route === "study") return "book";
  if (activity === "practice") return "run";
  if (activity === "mechanics") return "dot";
  if (route === "game") return "open";
  return label.toLowerCase().includes("score") ? "score" : "circle";
}

function homeActionIconSvg(name) {
  switch (name) {
    case "score":
      return `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M8 9h6"></path><path d="M10 12h6"></path><path d="M8 15h6"></path></svg>`;
    case "book":
      return `<svg viewBox="0 0 24 24"><path d="M5 4h8a4 4 0 0 1 4 4v12H9a4 4 0 0 0-4-4z"></path><path d="M17 8h2v12"></path><path d="M9 8h4"></path><path d="M9 12h4"></path></svg>`;
    case "dashboard":
      return `<svg viewBox="0 0 24 24"><path d="M5 14a7 7 0 0 1 14 0"></path><path d="M12 14l4-5"></path><path d="M7 18h10"></path><path d="M8 14h.01"></path><path d="M16 14h.01"></path></svg>`;
    case "grid":
      return `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="6" height="6" rx="1.5"></rect><rect x="14" y="4" width="6" height="6" rx="1.5"></rect><rect x="4" y="14" width="6" height="6" rx="1.5"></rect><rect x="14" y="14" width="6" height="6" rx="1.5"></rect></svg>`;
    case "list":
      return `<svg viewBox="0 0 24 24"><path d="M8 6h12"></path><path d="M8 12h12"></path><path d="M8 18h12"></path><circle cx="4.5" cy="6" r="1"></circle><circle cx="4.5" cy="12" r="1"></circle><circle cx="4.5" cy="18" r="1"></circle></svg>`;
    case "chart":
      return `<svg viewBox="0 0 24 24"><path d="M4 19V5"></path><path d="M4 19h16"></path><path d="m7 15 4-4 3 3 5-7"></path></svg>`;
    case "trend":
      return `<svg viewBox="0 0 24 24"><path d="M4 18h16"></path><path d="M4 18V6"></path><path d="m7 14 4-4 3 3 4-6"></path><circle cx="7" cy="14" r="1"></circle><circle cx="11" cy="10" r="1"></circle><circle cx="14" cy="13" r="1"></circle><circle cx="18" cy="7" r="1"></circle></svg>`;
    case "run":
      return `<svg viewBox="0 0 24 24"><circle cx="13" cy="5" r="2"></circle><path d="m10 9 4 2 3-2"></path><path d="m12 11-2 4-3 3"></path><path d="m13 13 3 3 1 4"></path></svg>`;
    case "photo":
      return `<svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="14" rx="2"></rect><circle cx="9" cy="10" r="1.4"></circle><path d="m7 17 4-4 3 3 2-2 3 3"></path></svg>`;
    case "dot":
      return `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="6"></circle></svg>`;
    case "open":
      return `<svg viewBox="0 0 24 24"><path d="M5 12h12"></path><path d="m13 8 4 4-4 4"></path><path d="M5 5h7"></path><path d="M5 19h7"></path></svg>`;
    default:
      return `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"></circle></svg>`;
  }
}

function renderEntry() {
  dom.entryContent.replaceChildren();
  if (!hasPracticeData(practiceState) || !selectedGameID) {
    dom.entryContent.append(emptyNode("Import Practice JSON or choose a game before saving entries."));
    return;
  }

  const root = document.createElement("div");
  root.className = "quick-entry";
  root.append(
    entrySheetNode(),
    entryRecentNode()
  );
  dom.entryContent.append(root);
}

function entrySheetNode() {
  const form = entryFormNode({
    header: false,
    submitLabel: `Save ${entryActivityLabel(entryActivity)}`,
  });
  form.classList.add("quick-entry-sheet");

  const header = document.createElement("div");
  header.className = "entry-card-header quick-entry-sheet-header";
  header.innerHTML = `
    <div>
      <h3>Quick Entry</h3>
      <p class="row-meta">${escapeHtml(entryActivityLabel(entryActivity))} · ${escapeHtml(gameDisplayName(selectedGameID))}</p>
    </div>
  `;

  const controls = document.createElement("div");
  controls.className = "entry-sheet-controls";
  controls.append(
    entryLibraryControlNode(),
    entryGameControlNode(),
    entryActivityControlNode()
  );

  form.prepend(header, controls);
  return form;
}

function entryGameNode() {
  const section = document.createElement("section");
  section.className = "entry-card";
  const header = document.createElement("div");
  header.className = "entry-card-header";
  header.innerHTML = `
    <div>
      <h3>Game</h3>
      <p class="row-meta">${escapeHtml(gameMeta(selectedGameID, catalog.gamesByPracticeId.get(selectedGameID)))}</p>
    </div>
  `;

  const select = document.createElement("select");
  select.setAttribute("aria-label", "Game");
  for (const gameID of practiceGameIDs()) {
    const option = document.createElement("option");
    option.value = gameID;
    option.textContent = gameDisplayName(gameID);
    option.selected = gameID === selectedGameID;
    select.append(option);
  }
  select.addEventListener("change", () => {
    selectedGameID = select.value;
    localStorage.setItem(SELECTED_GAME_KEY, selectedGameID);
    render();
  });

  section.append(header, entryFieldNode("Selected game", select));
  return section;
}

function entryActivityPickerNode() {
  const section = document.createElement("section");
  section.className = "entry-card";
  const header = document.createElement("div");
  header.className = "entry-card-header";
  header.innerHTML = `
    <div>
      <h3>Activity</h3>
      <p class="row-meta">${escapeHtml(entryActivityLabel(entryActivity))}</p>
    </div>
  `;
  const tabs = document.createElement("div");
  tabs.className = "entry-activity-tabs";
  for (const activity of ENTRY_ACTIVITIES) {
    tabs.append(segmentButton(activity.label, entryActivity === activity.id, () => {
      entryActivity = activity.id;
      localStorage.setItem(ENTRY_ACTIVITY_KEY, entryActivity);
      renderEntry();
    }));
  }
  section.append(header, tabs);
  return section;
}

function entryFormNode(options = {}) {
  const isInline = options.inline === true;
  const showHeader = options.header !== false;
  const form = document.createElement("form");
  form.className = isInline ? "quick-entry-form game-inline-entry-form game-entry-sheet" : "entry-card quick-entry-form";
  form.dataset.activity = entryActivity;
  const title = document.createElement("div");
  title.className = isInline ? "entry-card-header game-entry-sheet-header" : "entry-card-header";
  const subtitle = Object.prototype.hasOwnProperty.call(options, "subtitle") ? options.subtitle : gameDisplayName(selectedGameID);
  title.innerHTML = `
    <div>
      <h3>${escapeHtml(entryActivityLabel(entryActivity))}</h3>
      ${subtitle === false ? "" : `<p class="row-meta">${escapeHtml(subtitle || "")}</p>`}
    </div>
  `;

  const fields = document.createElement("div");
  fields.className = "entry-field-grid";
  fields.append(...entryFieldsForActivity(entryActivity));

  const submit = document.createElement("button");
  submit.type = "submit";
  submit.textContent = options.submitLabel || (isInline ? `Save ${entryActivityLabel(entryActivity)}` : "Save Entry");

  if (showHeader) form.append(title);
  form.append(fields, submit);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    saveQuickEntryFromForm(form);
  });
  return form;
}

function entryLibraryControlNode() {
  const label = document.createElement("label");
  label.className = "home-stacked-control entry-stacked-control";
  const title = document.createElement("span");
  title.textContent = "Library";

  const select = document.createElement("select");
  select.setAttribute("aria-label", "Library");
  for (const option of practiceSearchLibraryOptions()) {
    const optionNode = document.createElement("option");
    optionNode.value = option.id;
    optionNode.textContent = option.label;
    select.append(optionNode);
  }
  select.value = practiceSearchLibraryOptionID(practiceSearchLibrary);
  select.addEventListener("change", () => {
    practiceSearchLibrary = practiceSearchLibraryOptionID(select.value);
    localStorage.setItem(PRACTICE_SEARCH_LIBRARY_KEY, practiceSearchLibrary);
    const candidates = homeGameListIDs();
    if (candidates.length && !candidates.includes(selectedGameID)) {
      selectedGameID = candidates[0];
      localStorage.setItem(SELECTED_GAME_KEY, selectedGameID);
    }
    renderEntry();
  });

  label.append(title, select);
  return label;
}

function entryGameControlNode() {
  const label = document.createElement("label");
  label.className = "home-stacked-control entry-stacked-control";
  const title = document.createElement("span");
  title.textContent = "Game List";

  const select = document.createElement("select");
  select.setAttribute("aria-label", "Game List");
  const candidates = homeGameListIDs();
  for (const gameID of candidates) {
    const option = document.createElement("option");
    option.value = gameID;
    option.textContent = gameDisplayName(gameID);
    select.append(option);
  }
  select.value = candidates.includes(selectedGameID) ? selectedGameID : "";
  select.disabled = candidates.length === 0;
  select.addEventListener("change", () => {
    const nextGameID = normalizedString(select.value);
    if (!nextGameID) return;
    selectedGameID = nextGameID;
    localStorage.setItem(SELECTED_GAME_KEY, selectedGameID);
    renderEntry();
  });

  label.append(title, select);
  return label;
}

function entryActivityControlNode() {
  const label = document.createElement("label");
  label.className = "home-stacked-control entry-stacked-control";
  const title = document.createElement("span");
  title.textContent = "Activity";

  const select = document.createElement("select");
  select.setAttribute("aria-label", "Activity");
  for (const activity of ENTRY_ACTIVITIES) {
    const option = document.createElement("option");
    option.value = activity.id;
    option.textContent = activity.label;
    option.selected = entryActivity === activity.id;
    select.append(option);
  }
  select.addEventListener("change", () => {
    entryActivity = ENTRY_ACTIVITY_IDS.has(select.value) ? select.value : "score";
    localStorage.setItem(ENTRY_ACTIVITY_KEY, entryActivity);
    renderEntry();
  });

  label.append(title, select);
  return label;
}

function entryFieldsForActivity(activity) {
  switch (activity) {
    case "score":
      return [
        entryFieldNode("Score", scoreInputNode()),
        entryFieldNode("Context", entrySelectNode("scoreContext", [
          ["practice", "Practice"],
          ["league", "League"],
          ["tournament", "Tournament"],
        ])),
        entryFieldNode("Tournament", entryInputNode("tournamentName", "text", "Tournament name")),
        entryFieldNode("Optional notes", entryTextareaNode("note", "Optional notes")),
        ...entryMetaFields(),
      ];
    case "rulesheet":
      return [
        entryFieldNode("Rulesheet progress", entryRangeNode("progressPercent", latestTaskProgress(selectedGameID, "rulesheet", null) || 0)),
        entryFieldNode("Optional notes", entryTextareaNode("note", "Optional notes")),
        ...entryMetaFields(),
      ];
    case "tutorialVideo":
    case "gameplayVideo": {
      const task = activity;
      const sourceOptions = videoSourceOptionsForGame(selectedGameID, task);
      return [
        entryFieldNode("Video", entrySelectNode("videoSource", sourceOptions.map((source) => [source, source]))),
        entryFieldNode("Input mode", entrySelectNode("videoKind", [
          ["percent", "Percentage"],
          ["clock", "hh:mm:ss"],
        ])),
        entryFieldNode("Percent watched", entryRangeNode("videoPercent", 100)),
        entryFieldNode("Watched", entryInputNode("watchedTime", "text", "hh:mm:ss")),
        entryFieldNode("Duration", entryInputNode("totalTime", "text", "hh:mm:ss")),
        entryFieldNode("Optional notes", entryTextareaNode("note", "Optional notes")),
        ...entryMetaFields(),
      ];
    }
    case "playfield":
      return [
        entryFieldNode("Optional notes", entryTextareaNode("note", "Reviewed playfield image")),
        ...entryMetaFields(),
      ];
    case "practice":
      return [
        entryFieldNode("Practice type", entrySelectNode("practiceCategory", [
          ["general", "General"],
          ["modes", "Modes"],
          ["multiball", "Multiball"],
          ["shots", "Shots"],
        ])),
        entryFieldNode("Practice minutes", entryInputNode("practiceMinutes", "number", "Optional minutes", { min: "1" })),
        entryFieldNode("Optional notes", entryTextareaNode("note", "Optional notes")),
        ...entryMetaFields(),
      ];
    case "mechanics":
      return [
        entryFieldNode("Skill", entrySelectNode("mechanicsSkill", mechanicsSkillOptions())),
        entryFieldNode("Competency", entryStepRangeNode("mechanicsCompetency", 3, 1, 5, 1, "/5")),
        entryFieldNode("Optional notes", entryTextareaNode("note", "Optional notes")),
        ...entryMetaFields(),
      ];
    case "note":
      return [
        entryFieldNode("Category", entrySelectNode("noteCategory", [
          ["general", "General"],
          ["shots", "Shots"],
          ["modes", "Modes"],
          ["multiball", "Multiball"],
          ["strategy", "Scoring strategy"],
        ])),
        entryFieldNode("Detail", entryInputNode("noteDetail", "text", "Optional detail")),
        entryFieldNode("Note", entryTextareaNode("note", "Note")),
        ...entryMetaFields(),
      ];
    default:
      return [];
  }
}

function entryMetaFields() {
  return [
    entryFieldNode("Logged At", entryInputNode("entryTimestamp", "datetime-local", "", {
      value: datetimeLocalInputValue(Date.now()),
    })),
    entryFieldNode("Active Group", entryGroupSelectNode("entryGroupID")),
  ];
}

function entryFieldNode(labelText, control) {
  const label = document.createElement("label");
  label.className = control.tagName === "TEXTAREA" ? "entry-field entry-field-wide" : "entry-field";
  const span = document.createElement("span");
  span.textContent = labelText;
  label.append(span, control);
  return label;
}

function entryInputNode(name, type, placeholder, attributes = {}) {
  const input = document.createElement("input");
  input.dataset.field = name;
  input.type = type;
  if (placeholder) input.placeholder = placeholder;
  for (const [key, value] of Object.entries(attributes)) {
    input.setAttribute(key, value);
  }
  return input;
}

function scoreInputNode() {
  const input = entryInputNode("score", "text", "0", { inputmode: "numeric" });
  input.addEventListener("input", () => {
    const formatted = formatScoreInputWithCommas(input.value);
    if (formatted !== input.value) input.value = formatted;
  });
  return input;
}

function entrySelectNode(name, options) {
  const select = document.createElement("select");
  select.dataset.field = name;
  for (const [value, label] of options) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    select.append(option);
  }
  return select;
}

function entryGroupSelectNode(name) {
  const select = document.createElement("select");
  select.dataset.field = name;

  const empty = document.createElement("option");
  empty.value = "";
  empty.textContent = "No active group";
  select.append(empty);

  for (const group of activeGroups()) {
    const option = document.createElement("option");
    option.value = normalizedString(group.id);
    option.textContent = group.name || "Untitled Group";
    select.append(option);
  }

  const selected = normalizedString(practiceState.practiceSettings?.selectedGroupID)
    || normalizedString(selectedGroup()?.id);
  select.value = selected;
  return select;
}

function entryTextareaNode(name, placeholder) {
  const textarea = document.createElement("textarea");
  textarea.dataset.field = name;
  textarea.rows = 4;
  textarea.placeholder = placeholder;
  return textarea;
}

function entryRangeNode(name, value) {
  return entryStepRangeNode(name, value, 0, 100, 1, "%");
}

function entryStepRangeNode(name, value, min, max, step, suffix) {
  const wrapper = document.createElement("div");
  wrapper.className = "range-field";
  const output = document.createElement("output");
  const input = document.createElement("input");
  input.dataset.field = name;
  input.type = "range";
  input.min = String(min);
  input.max = String(max);
  input.step = String(step);
  input.value = String(clampNumber(value, min, max));
  output.textContent = `${input.value}${suffix}`;
  input.addEventListener("input", () => {
    output.textContent = `${input.value}${suffix}`;
  });
  wrapper.append(input, output);
  return wrapper;
}

function saveQuickEntryFromForm(form) {
  if (!selectedGameID) {
    setStatus("Choose a game before saving an entry.", true);
    return;
  }

  const activity = form.dataset.activity;
  const timestamp = entryTimestampFromForm(form) ?? Date.now();
  const note = normalizedEntryNote(fieldValue(form, "note"));
  updateSelectedGroupFromForm(form);

  if (activity === "score") {
    const score = parseScoreInput(fieldValue(form, "score"));
    const context = fieldValue(form, "scoreContext") || "practice";
    const tournamentName = fieldValue(form, "tournamentName");
    if (!Number.isFinite(score) || score <= 0) {
      setStatus("Enter a valid score above 0.", true);
      return;
    }
    if (context === "tournament" && !normalizedString(tournamentName)) {
      setStatus("Tournament scores require a tournament name.", true);
      return;
    }
    practiceState.scoreEntries = [
      ...practiceState.scoreEntries,
      {
        id: crypto.randomUUID(),
        gameID: selectedGameID,
        score,
        context,
        tournamentName: context === "tournament" ? tournamentName.trim() : null,
        timestamp,
        leagueImported: false,
      },
    ];
    addJournalEntry({
      gameID: selectedGameID,
      action: "scoreLogged",
      score,
      scoreContext: context,
      tournamentName: context === "tournament" ? tournamentName.trim() : null,
      note,
      timestamp,
    });
  } else if (activity === "rulesheet") {
    const progressPercent = clampPercent(fieldValue(form, "progressPercent"));
    addStudyEvent(selectedGameID, "rulesheet", progressPercent, timestamp);
    addJournalEntry({
      gameID: selectedGameID,
      action: "rulesheetRead",
      task: "rulesheet",
      progressPercent,
      note,
      timestamp,
    });
  } else if (activity === "tutorialVideo" || activity === "gameplayVideo") {
    const videoDraft = buildVideoLogDraft({
      kind: fieldValue(form, "videoKind") || "percent",
      source: fieldValue(form, "videoSource"),
      watchedTime: fieldValue(form, "watchedTime"),
      totalTime: fieldValue(form, "totalTime"),
      percentValue: fieldValue(form, "videoPercent"),
    });
    if (!videoDraft) {
      setStatus("Use valid hh:mm:ss watched/total values, or leave both blank for 100%.", true);
      return;
    }
    const action = activity === "tutorialVideo" ? "tutorialWatch" : "gameplayWatch";
    practiceState.videoProgressEntries = [
      ...practiceState.videoProgressEntries,
      {
        id: crypto.randomUUID(),
        gameID: selectedGameID,
        kind: videoDraft.kind,
        value: videoDraft.value,
        timestamp,
      },
    ];
    addStudyEvent(selectedGameID, activity, videoDraft.progressPercent, timestamp);
    addJournalEntry({
      gameID: selectedGameID,
      action,
      task: activity,
      progressPercent: videoDraft.progressPercent,
      videoKind: videoDraft.kind,
      videoValue: videoDraft.value,
      note,
      timestamp,
    });
  } else if (activity === "playfield") {
    addJournalEntry({
      gameID: selectedGameID,
      action: "playfieldViewed",
      task: "playfield",
      note: note || "Reviewed playfield image",
      timestamp,
    });
  } else if (activity === "practice") {
    const minutes = fieldValue(form, "practiceMinutes");
    const category = fieldValue(form, "practiceCategory") || "general";
    const composedNote = composePracticeSessionNote(minutes, category, note);
    if (!composedNote) return;
    addJournalEntry({
      gameID: selectedGameID,
      action: "practiceSession",
      task: "practice",
      note: composedNote,
      timestamp,
    });
  } else if (activity === "mechanics") {
    const skill = normalizedString(fieldValue(form, "mechanicsSkill"));
    const comfort = clampNumber(fieldValue(form, "mechanicsCompetency"), 1, 5);
    addMechanicsLog({
      gameID: selectedGameID,
      skill,
      comfort,
      note,
      timestamp,
    });
  } else if (activity === "note") {
    const category = fieldValue(form, "noteCategory") || "general";
    const detail = normalizedString(fieldValue(form, "noteDetail")) || null;
    if (!note) {
      setStatus("Enter a note before saving.", true);
      return;
    }
    practiceState.noteEntries = [
      ...practiceState.noteEntries,
      {
        id: crypto.randomUUID(),
        gameID: selectedGameID,
        category,
        detail,
        note,
        timestamp,
      },
    ];
    addJournalEntry({
      gameID: selectedGameID,
      action: "noteAdded",
      noteCategory: category,
      noteDetail: detail,
      note,
      timestamp,
    });
  }

  persistState();
  setStatus(`${entryActivityLabel(activity)} saved`);
  render();
}

function entryRecentNode() {
  const section = document.createElement("section");
  section.className = "entry-card";
  const heading = document.createElement("div");
  heading.className = "entry-card-header";
  heading.innerHTML = `
    <div>
      <h3>Recent Entries</h3>
      <p class="row-meta">${escapeHtml(gameDisplayName(selectedGameID))}</p>
    </div>
  `;
  const list = document.createElement("div");
  list.className = "data-list";
  const entries = practiceState.journalEntries
    .filter((entry) => normalizedString(entry.gameID) === normalizedString(selectedGameID))
    .sort((a, b) => timestampValue(b.timestamp) - timestampValue(a.timestamp))
    .slice(0, 5);
  if (!entries.length) {
    list.append(emptyNode("No entries for this game yet."));
  } else {
    for (const entry of entries) {
      list.append(dataRowNode(journalSummary(entry), formatDate(entry.timestamp)));
    }
  }
  section.append(heading, list);
  return section;
}

function renderInsights() {
  dom.insightsContent.replaceChildren();
  if (!hasPracticeData(practiceState)) {
    dom.insightsContent.append(emptyNode("Import Practice JSON or load the sample to view insights."));
    return;
  }

  const root = document.createElement("div");
  root.className = "insights-grid";
  root.append(
    insightsGamePickerNode(),
    insightsStatsNode(),
    insightsHeadToHeadNode()
  );
  dom.insightsContent.append(root);
}

function insightsGamePickerNode() {
  const section = document.createElement("section");
  section.className = "insights-card insights-picker";
  const header = document.createElement("div");
  header.className = "entry-card-header";
  header.innerHTML = `
    <div>
      <h3>Game</h3>
      <p class="row-meta">Score trend source</p>
    </div>
  `;

  const select = document.createElement("select");
  select.setAttribute("aria-label", "Insights game");
  for (const gameID of practiceGameIDs()) {
    const option = document.createElement("option");
    option.value = gameID;
    option.textContent = gameDisplayName(gameID);
    option.selected = gameID === selectedGameID;
    select.append(option);
  }
  select.addEventListener("change", () => {
    selectedGameID = select.value;
    localStorage.setItem(SELECTED_GAME_KEY, selectedGameID);
    render();
  });

  section.append(header, entryFieldNode("Selected game", select));
  return section;
}

function insightsStatsNode() {
  const section = document.createElement("section");
  section.className = "insights-card insights-stats";
  const header = document.createElement("div");
  header.className = "entry-card-header";
  header.innerHTML = `
    <div>
      <h3>Stats</h3>
      <p class="row-meta">${escapeHtml(gameDisplayName(selectedGameID))}</p>
    </div>
  `;
  section.append(header);

  const summary = selectedGameID ? scoreSummaryForGame(selectedGameID) : null;
  if (!summary) {
    section.append(emptyNode("Log scores to unlock trends and consistency analytics."));
    return section;
  }

  const spreadRatio = summary.median > 0 ? (summary.p75 - summary.floor) / summary.median : 0;
  const metrics = document.createElement("div");
  metrics.className = "insights-metrics";
  metrics.append(
    dashboardMetricNode("Average", formatScore(summary.average)),
    dashboardMetricNode("Median", formatScore(summary.median)),
    dashboardMetricNode("Floor", formatScore(summary.floor)),
    dashboardMetricNode("Consistency", spreadRatio >= 0.6 ? "High Risk" : "Stable")
  );

  const rows = document.createElement("div");
  rows.className = "insights-row-list";
  rows.append(
    dataRowNode("IQR", `${formatScore(summary.p25)} to ${formatScore(summary.p75)}`),
    dataRowNode("Scores", `${summary.count} logged`),
    dataRowNode("Mode", "Raw calendar spacing between score entries")
  );

  section.append(metrics, sparklineNode(scoreTrendValuesForGame(selectedGameID), "score"), rows);
  return section;
}

function insightsHeadToHeadNode() {
  const section = document.createElement("section");
  section.className = "insights-card insights-head-to-head";
  const settings = practiceState.practiceSettings ?? {};
  const yourName = normalizedString(settings.playerName || practiceState.leagueSettings?.playerName);
  const opponentName = normalizedString(settings.comparisonPlayerName);

  const header = document.createElement("div");
  header.className = "entry-card-header";
  header.innerHTML = `
    <div>
      <h3>Head-to-Head</h3>
      <p class="row-meta">${catalog.leagueRows.length ? `${catalog.leaguePlayers.length} league players loaded` : "League CSV not loaded"}</p>
    </div>
  `;

  const playerSelect = entrySelectNode("insightsOpponent", leagueOpponentOptions(opponentName, yourName));
  playerSelect.value = opponentName;
  playerSelect.addEventListener("change", () => {
    practiceState.practiceSettings.comparisonPlayerName = playerSelect.value;
    persistState();
    render();
  });

  section.append(header, entryFieldNode("Opponent", playerSelect));

  if (!yourName) {
    section.append(emptyNode("Set your Practice player name in Settings to compare LPL history."));
    return section;
  }
  if (!opponentName) {
    section.append(emptyNode("Select a player above to enable player-vs-player views."));
    return section;
  }

  const comparison = buildHeadToHeadComparison(yourName, opponentName);
  if (!comparison) {
    section.append(emptyNode(`No shared machine history yet between ${yourName} and ${opponentName}.`));
    return section;
  }

  const metrics = document.createElement("div");
  metrics.className = "insights-metrics";
  metrics.append(
    dashboardMetricNode("Games", comparison.totalGamesCompared),
    dashboardMetricNode("You Lead", comparison.gamesYouLeadByMean),
    dashboardMetricNode("Opponent Leads", comparison.gamesOpponentLeadsByMean),
    dashboardMetricNode("Avg Delta", signedScore(comparison.averageMeanDelta))
  );

  const list = document.createElement("div");
  list.className = "head-to-head-list";
  const visibleGames = comparison.games.slice(0, 8);
  for (const game of visibleGames) {
    list.append(headToHeadGameRowNode(game));
  }
  if (comparison.games.length > 8) {
    list.append(dataRowNode("Showing top 8", `${comparison.games.length} shared games total`));
  }

  section.append(metrics, headToHeadDeltaBarsNode(visibleGames), list);
  return section;
}

function renderMechanics() {
  dom.mechanicsContent.replaceChildren();
  if (!hasPracticeData(practiceState)) {
    dom.mechanicsContent.append(emptyNode("Import Practice JSON or load the sample to track mechanics."));
    return;
  }

  if (mechanicsComfort < 1 || mechanicsComfort > 5) mechanicsComfort = 3;
  const root = document.createElement("div");
  root.className = "mechanics-grid";
  root.append(
    mechanicsLogNode(),
    mechanicsHistoryNode()
  );
  dom.mechanicsContent.append(root);
}

function mechanicsLogNode() {
  const section = document.createElement("section");
  section.className = "mechanics-card";
  const header = document.createElement("div");
  header.className = "entry-card-header";
  header.innerHTML = `
    <div>
      <h3>Mechanics</h3>
      <p class="row-meta">Skills are tracked as tags in your notes.</p>
    </div>
  `;

  const form = document.createElement("form");
  form.className = "mechanics-form";

  const skillSelect = entrySelectNode("mechanicsSkill", mechanicsSkillOptions());
  skillSelect.value = selectedMechanicSkill;
  skillSelect.addEventListener("change", () => {
    selectedMechanicSkill = skillSelect.value;
    localStorage.setItem(MECHANICS_SKILL_KEY, selectedMechanicSkill);
    renderMechanics();
  });

  const comfort = entryStepRangeNode("mechanicsCompetency", mechanicsComfort, 1, 5, 1, "/5");
  const comfortInput = comfort.querySelector("input");
  comfortInput.addEventListener("input", () => {
    mechanicsComfort = clampNumber(comfortInput.value, 1, 5);
    localStorage.setItem(MECHANICS_COMFORT_KEY, String(mechanicsComfort));
  });

  const note = entryTextareaNode("mechanicsNote", "Optional notes");
  const detected = document.createElement("p");
  detected.className = "detected-tags row-meta";
  const updateDetected = () => {
    const tags = detectedMechanicsTags(note.value);
    detected.textContent = tags.length ? `Detected tags: ${tags.join(", ")}` : "Detected tags: none";
  };
  note.addEventListener("input", updateDetected);
  updateDetected();

  const submit = document.createElement("button");
  submit.type = "submit";
  submit.textContent = "Log Mechanics Session";

  form.append(
    entryFieldNode("Skill", skillSelect),
    entryFieldNode("Competency", comfort),
    entryFieldNode("Optional notes", note),
    detected,
    submit
  );
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    addMechanicsLog({
      gameID: "",
      skill: selectedMechanicSkill,
      comfort: mechanicsComfort,
      note: normalizedEntryNote(note.value),
      timestamp: Date.now(),
    });
    persistState();
    setStatus("Mechanics session saved");
    render();
  });

  section.append(header, form);
  return section;
}

function mechanicsHistoryNode() {
  const section = document.createElement("section");
  section.className = "mechanics-card";
  const selectedSkill = normalizedString(selectedMechanicSkill);
  const logs = selectedSkill ? mechanicsLogsForSkill(selectedSkill) : allMechanicsLogs();
  const summary = selectedSkill ? mechanicsSummaryForSkill(selectedSkill) : null;

  const header = document.createElement("div");
  header.className = "entry-card-header";
  header.innerHTML = `
    <div>
      <h3>${escapeHtml(selectedSkill ? `${selectedSkill} History` : "Mechanics History")}</h3>
      <p class="row-meta">${selectedSkill ? "Selected skill" : "All skills"}</p>
    </div>
  `;
  section.append(header);

  const metrics = document.createElement("div");
  metrics.className = "insights-metrics";
  if (summary) {
    metrics.append(
      dashboardMetricNode("Logs", summary.totalLogs),
      dashboardMetricNode("Latest", summary.latestComfort == null ? "-" : `${summary.latestComfort}/5`),
      dashboardMetricNode("Avg", summary.averageComfort == null ? "-" : `${summary.averageComfort.toFixed(1)}/5`),
      dashboardMetricNode("Trend", summary.trendDelta == null ? "-" : signedDecimal(summary.trendDelta))
    );
  } else {
    metrics.append(dashboardMetricNode("Logs", logs.length));
  }
  section.append(metrics);

  if (selectedSkill) {
    section.append(sparklineNode(logs.map((log) => log.comfort).filter((value) => value != null), "mechanics", "Need 2+ comfort logs for trend"));
  }

  const list = document.createElement("div");
  list.className = "mechanics-history-list";
  if (!logs.length) {
    list.append(emptyNode(selectedSkill ? "No sessions logged for this skill yet." : "No mechanics sessions logged yet."));
  } else {
    for (const log of [...logs].reverse().slice(0, 20)) {
      list.append(mechanicsLogRowNode(log));
    }
  }
  section.append(list);
  return section;
}

function fieldValue(root, name) {
  return root.querySelector(`[data-field="${name}"]`)?.value ?? "";
}

function fieldExists(root, name) {
  return Boolean(root.querySelector(`[data-field="${name}"]`));
}

function entryTimestampFromForm(form) {
  if (!fieldExists(form, "entryTimestamp")) return null;
  const raw = fieldValue(form, "entryTimestamp");
  if (!raw) return Date.now();
  const parsed = new Date(raw).getTime();
  return Number.isFinite(parsed) ? parsed : null;
}

function updateSelectedGroupFromForm(form) {
  if (!fieldExists(form, "entryGroupID")) return;
  const groupID = normalizedString(fieldValue(form, "entryGroupID"));
  practiceState.practiceSettings.selectedGroupID = groupID || null;
}

function addStudyEvent(gameID, task, progressPercent, timestamp) {
  practiceState.studyEvents = [
    ...practiceState.studyEvents,
    {
      id: crypto.randomUUID(),
      gameID,
      task,
      progressPercent: clampPercent(progressPercent),
      timestamp,
    },
  ];
}

function videoSourceOptionsForGame(gameID, task) {
  const prefix = task === "tutorialVideo" ? "Tutorial" : "Gameplay";
  const normalizedPrefix = prefix.toLowerCase();
  const resources = catalog.resourcesByPracticeId.get(gameID) ?? emptyResources();
  const videos = resources.videos.filter((video) => {
    const kind = normalizedString(video.kind).toLowerCase();
    const label = normalizedString(video.label).toLowerCase();
    return kind.includes(normalizedPrefix) || label.includes(normalizedPrefix);
  });
  if (!videos.length) return [`${prefix} -`];
  return videos.map((video, index) => normalizedString(video.label) || `${prefix} ${index + 1}`);
}

function buildVideoLogDraft({ kind, source, watchedTime, totalTime, percentValue }) {
  const label = normalizedString(source);
  if (!label) return null;
  if (kind === "clock") {
    const watched = parseHhMmSs(watchedTime);
    const total = parseHhMmSs(totalTime);
    if (watched == null && total == null) {
      return { kind: "clock", progressPercent: 100, value: `${label} • 100%` };
    }
    if (watched === 0 && total === 0) {
      return { kind: "clock", progressPercent: 100, value: `${label} • 100%` };
    }
    if (watched == null || total == null || total <= 0 || watched > total) return null;
    const progressPercent = clampPercent((watched / total) * 100);
    return {
      kind: "clock",
      progressPercent,
      value: `${label} • ${formatHhMmSs(watched)}/${formatHhMmSs(total)} (${progressPercent}%)`,
    };
  }
  const progressPercent = clampPercent(percentValue || 100);
  return { kind: "percent", progressPercent, value: `${label} • ${progressPercent}%` };
}

function parseScoreInput(value) {
  const normalized = normalizedString(value).replaceAll(",", "");
  return Number.parseInt(normalized, 10);
}

function normalizedEntryNote(value) {
  const normalized = String(value ?? "").replaceAll("\r\n", "\n");
  return normalized.trim() ? normalized.trim() : null;
}

function composePracticeSessionNote(rawMinutes, category, note) {
  const trimmedMinutes = normalizedString(rawMinutes);
  if (trimmedMinutes && (!Number.isInteger(Number(trimmedMinutes)) || Number(trimmedMinutes) <= 0)) {
    setStatus("Practice minutes must be a whole number greater than 0 when entered.", true);
    return null;
  }
  const minutes = trimmedMinutes ? Number(trimmedMinutes) : null;
  const focus = category === "general" ? null : `Focus: ${practiceEntryCategoryLabel(category)}`;
  const base = minutes
    ? `Practice session: ${minutes} minute${minutes === 1 ? "" : "s"}`
    : "Practice session";
  const tail = [focus, note].filter(Boolean).join(". ");
  return tail ? `${base}. ${tail}` : base;
}

function practiceEntryCategoryLabel(category) {
  switch (category) {
    case "modes": return "Modes";
    case "multiball": return "Multiball";
    case "shots": return "Shots";
    case "strategy": return "Scoring strategy";
    default: return "General";
  }
}

function entryActivityLabel(activity) {
  return ENTRY_ACTIVITIES.find((candidate) => candidate.id === activity)?.label ?? "Score";
}

function clampPercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(100, Math.round(number)));
}

function clampNumber(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, Math.round(number)));
}

function mechanicsSkillOptions() {
  const tracked = trackedMechanicsSkills();
  return [
    ["", "Select skill"],
    ...tracked.map((skill) => [skill, skill]),
  ];
}

function parseHhMmSs(raw) {
  const value = normalizedString(raw);
  if (!value) return null;
  const match = value.match(/^(\d{1,2}):(\d{2}):(\d{2})$/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3]);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes) || !Number.isInteger(seconds)) return null;
  if (minutes > 59 || seconds > 59) return null;
  return hours * 3600 + minutes * 60 + seconds;
}

function formatHhMmSs(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value) => String(value).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function renderSettings() {
  dom.settingsContent.replaceChildren();
  const settings = practiceState.practiceSettings;
  const league = practiceState.leagueSettings;
  const sync = practiceState.syncSettings;
  const analytics = practiceState.analyticsSettings;
  const importedLeagueScoreCount = practiceState.scoreEntries.filter((entry) => entry.leagueImported).length;
  const report = validatePracticeState(practiceState, catalog);
  const dataStats = practiceDataInspectorStats(practiceState, catalog, report);
  const leaguePlayer = normalizedString(league.playerName || settings.playerName);
  const selectedGroupName = selectedGroup()?.name || "All Practice";

  const grid = document.createElement("div");
  grid.className = "settings-grid";
  grid.append(
    settingsCardNode("Practice Profile", [
      settingsInputNode("Player name", "player-name", settings.playerName || league.playerName || "", "text"),
      settingsInputNode("Comparison player", "comparison-player-name", settings.comparisonPlayerName || "", "text"),
      settingsReadoutNode("Selected group", selectedGroupName),
      settingsActionsNode([
        settingsButtonNode("Save Profile", savePracticeProfileSettings),
      ]),
    ]),
    settingsCardNode("IFPA", [
      settingsInputNode("IFPA number", "ifpa-player-id", settings.ifpaPlayerID || "", "text"),
      settingsHelpNode("Save your IFPA player number to unlock a quick stats profile from the Practice home header."),
      settingsActionsNode([
        settingsButtonNode("Save IFPA ID", saveIfpaSettings),
      ]),
    ]),
    settingsCardNode("PRPA", [
      settingsInputNode("PRPA number", "prpa-player-id", settings.prpaPlayerID || "", "text"),
      settingsHelpNode("Save your Punk Rock Pinball Association player number to add PRPA rankings to the same Practice profile screen."),
      settingsActionsNode([
        settingsButtonNode("Save PRPA ID", savePrpaSettings),
      ]),
    ]),
    settingsCardNode("League Import", [
      settingsLeaguePlayerNode(leaguePlayer),
      settingsHelpNode(PRACTICE_LEAGUE_IMPORT_DESCRIPTION),
      settingsToggleNode("CSV Auto Fill", "csv-auto-fill", Boolean(league.csvAutoFillEnabled)),
      settingsReadoutNode("Imported league scores", importedLeagueScoreCount.toLocaleString()),
      settingsReadoutNode("Last import", league.lastImportAt ? formatDate(league.lastImportAt) : "Never"),
      settingsActionsNode([
        settingsButtonNode("Save League Player", saveLeaguePlayerSettings),
        settingsButtonNode("Import LPL CSV", importLeagueScoresFromHostedCsv, !leaguePlayer || !catalog.leagueRows.length),
      ]),
    ]),
    settingsCardNode("Compatibility", [
      settingsReadoutNode("Import report", `${report.counts.error} errors · ${report.counts.warning} warnings · ${report.counts.info} notes`),
      settingsMetricGridNode([
        { label: "Score Rows", value: dataStats.rowCounts.scoreEntries.toLocaleString() },
        { label: "Study Rows", value: dataStats.rowCounts.studyEvents.toLocaleString() },
        { label: "Video Rows", value: dataStats.rowCounts.videoProgressEntries.toLocaleString() },
        { label: "Note Rows", value: dataStats.rowCounts.noteEntries.toLocaleString() },
        { label: "OPDB", value: coverageFraction(dataStats.gameCoverage.opdbResolved, dataStats.gameCoverage.importedGameIDs, dataStats.gameCoverage.catalogLoaded), caption: "resolved", tone: dataStats.gameCoverage.opdbMissing ? "warning" : "" },
        { label: "Assets", value: coverageFraction(dataStats.gameCoverage.assetMapped, dataStats.gameCoverage.opdbResolved, dataStats.gameCoverage.catalogLoaded), caption: "mapped", tone: dataStats.gameCoverage.assetMissing ? "info" : "" },
      ]),
      settingsReadoutNode("Activity range", activityRangeLabel(dataStats.activityRange)),
      settingsIssuePreviewNode(report),
      settingsHelpNode("The QA report is read-only metadata for testing imports and future sync compatibility."),
      settingsActionsNode([
        settingsButtonNode("Download QA Report", downloadPracticeQaReport),
      ]),
    ]),
    settingsCardNode("Checkpoints", [
      settingsReadoutNode("Latest hash", practiceCheckpoints[0]?.shortHash || "No checkpoint"),
      settingsCheckpointListNode(practiceCheckpoints),
      settingsHelpNode("Checkpoints track imports, samples, manual snapshots, and exports in this browser only. They are not written into exported Practice JSON."),
      settingsActionsNode([
        settingsButtonNode("Save Current Checkpoint", saveCurrentPracticeCheckpoint, !hasPracticeData(practiceState)),
        settingsButtonNode("Clear History", clearPracticeCheckpoints, practiceCheckpoints.length === 0, true),
      ]),
    ]),
    settingsCardNode("Sync", [
      settingsToggleNode("Cloud Sync", "cloud-sync-enabled", Boolean(sync.cloudSyncEnabled)),
      settingsInputNode("Endpoint", "sync-endpoint", sync.endpoint || "pinprof.com", "text"),
      settingsReadoutNode("Phase", sync.phaseLabel || "Phase 1: On-device"),
      settingsReadoutNode("Storage", "Browser local state"),
      settingsHelpNode("The canonical JSON stays portable while account sync and native app sync are being designed."),
      settingsActionsNode([
        settingsButtonNode("Download Sync Seed", downloadPracticeSyncSeed, !hasPracticeData(practiceState)),
      ]),
    ]),
    settingsCardNode("Analytics", [
      settingsSelectNode("Gap mode", "analytics-gap-mode", analytics.gapMode || "compressInactive", [
        ["realTimeline", "Real timeline"],
        ["compressInactive", "Compress inactive"],
        ["activeSessionsOnly", "Active sessions only"],
        ["brokenAxis", "Broken axis"],
      ]),
      settingsToggleNode("Use median", "analytics-use-median", Boolean(analytics.useMedian)),
    ]),
    settingsCardNode("Recovery", [
      settingsHelpNode(importedLeagueScoreSummary(importedLeagueScoreCount)),
      settingsButtonNode(clearImportedLeagueScoresButtonTitle(importedLeagueScoreCount), clearImportedLeagueScores, importedLeagueScoreCount === 0, true),
      settingsHelpNode("Erase the full local Practice log state."),
      settingsButtonNode("Reset Practice Log", resetPracticeLog, !hasPracticeData(practiceState), true),
    ])
  );
  dom.settingsContent.append(grid);
  wireSettingsControls();
}

function settingsCardNode(title, rows) {
  const card = document.createElement("section");
  card.className = "settings-card";
  const header = document.createElement("div");
  header.className = "settings-card-header";
  const heading = document.createElement("h3");
  heading.textContent = title;
  header.append(heading);
  card.append(header, ...rows);
  return card;
}

function settingsInputNode(label, id, value, type) {
  const row = document.createElement("label");
  row.className = "settings-row";
  row.innerHTML = `
    <span>${escapeHtml(label)}</span>
    <input id="${escapeAttribute(id)}" type="${escapeAttribute(type)}" value="${escapeAttribute(value)}">
  `;
  return row;
}

function settingsToggleNode(label, id, checked) {
  const row = document.createElement("label");
  row.className = "settings-row settings-toggle-row";
  row.innerHTML = `
    <span>${escapeHtml(label)}</span>
    <input id="${escapeAttribute(id)}" type="checkbox"${checked ? " checked" : ""}>
  `;
  return row;
}

function settingsSelectNode(label, id, value, options) {
  const row = document.createElement("label");
  row.className = "settings-row";
  const select = document.createElement("select");
  select.id = id;
  for (const [optionValue, optionLabel] of options) {
    const option = document.createElement("option");
    option.value = optionValue;
    option.textContent = optionLabel;
    option.selected = optionValue === value;
    select.append(option);
  }
  const span = document.createElement("span");
  span.textContent = label;
  row.append(span, select);
  return row;
}

function settingsReadoutNode(label, value) {
  const row = document.createElement("div");
  row.className = "settings-row settings-readout";
  row.innerHTML = `
    <span>${escapeHtml(label)}</span>
    <strong>${escapeHtml(value)}</strong>
  `;
  return row;
}

function settingsMetricGridNode(items) {
  const grid = document.createElement("div");
  grid.className = "settings-metric-grid";
  for (const item of items) {
    const metric = document.createElement("div");
    metric.className = "settings-metric";
    if (item.tone) metric.dataset.tone = item.tone;
    metric.innerHTML = `
      <span>${escapeHtml(item.label)}</span>
      <strong>${escapeHtml(item.value)}</strong>
      ${item.caption ? `<small>${escapeHtml(item.caption)}</small>` : ""}
    `;
    grid.append(metric);
  }
  return grid;
}

function settingsIssuePreviewNode(report) {
  const list = document.createElement("div");
  list.className = "settings-issue-list";
  const issues = report.issues.slice(0, 4);
  if (!issues.length) {
    list.append(settingsIssueNode({
      severity: "info",
      title: "No validation issues",
      detail: "Canonical Practice rows, linked journal entries, OPDB identities, and mapped study assets look ready for testing.",
    }));
    return list;
  }

  for (const issue of issues) {
    list.append(settingsIssueNode(issue));
  }
  if (report.issues.length > issues.length) {
    list.append(settingsHelpNode(`${report.issues.length - issues.length} more report items are included in the QA download.`));
  }
  return list;
}

function settingsIssueNode(issue) {
  const row = document.createElement("div");
  row.className = "settings-issue";
  row.dataset.severity = issue.severity;
  row.innerHTML = `
    <span>${escapeHtml(issue.severity)}</span>
    <div>
      <strong>${escapeHtml(issue.title)}</strong>
      <small>${escapeHtml(issue.detail)}</small>
    </div>
  `;
  return row;
}

function settingsCheckpointListNode(checkpoints) {
  const list = document.createElement("div");
  list.className = "settings-checkpoint-list";
  const visible = checkpoints.slice(0, 5);
  if (!visible.length) {
    list.append(settingsIssueNode({
      severity: "info",
      title: "No checkpoints saved",
      detail: "Import, export, load the sample, or save a current checkpoint to create a local compatibility trail.",
    }));
    return list;
  }

  for (const checkpoint of visible) {
    const row = document.createElement("div");
    row.className = "settings-checkpoint";
    const source = checkpoint.source || "Checkpoint";
    const filename = checkpoint.filename || "Practice JSON";
    const counts = checkpoint.validationCounts ?? {};
    const rows = checkpoint.rowCounts ?? {};
    const coverage = checkpoint.gameCoverage ?? {};
    row.innerHTML = `
      <div class="settings-checkpoint-main">
        <strong>${escapeHtml(source)}</strong>
        <span>${escapeHtml(filename)}</span>
        <small>${escapeHtml(formatDate(checkpoint.createdAt))}</small>
      </div>
      <div class="settings-checkpoint-detail">
        <span>${escapeHtml(checkpoint.shortHash || "no hash")}</span>
        <span>${escapeHtml(`${Number(rows.scoreEntries ?? 0).toLocaleString()} scores · ${Number(rows.journalEntries ?? 0).toLocaleString()} journal`)}</span>
        <span>${escapeHtml(`${Number(counts.error ?? 0)} errors · ${Number(counts.warning ?? 0)} warnings`)}</span>
        <span>${escapeHtml(`${Number(coverage.opdbResolved ?? 0).toLocaleString()}/${Number(coverage.importedGameIDs ?? 0).toLocaleString()} OPDB`)}</span>
      </div>
    `;
    list.append(row);
  }
  if (checkpoints.length > visible.length) {
    list.append(settingsHelpNode(`${checkpoints.length - visible.length} older checkpoints stored locally.`));
  }
  return list;
}

function settingsHelpNode(text) {
  const row = document.createElement("p");
  row.className = "settings-help";
  row.textContent = text;
  return row;
}

function settingsActionsNode(buttons) {
  const row = document.createElement("div");
  row.className = "settings-actions";
  row.append(...buttons);
  return row;
}

function settingsLeaguePlayerNode(value) {
  if (!catalog.leaguePlayers.length) {
    return settingsInputNode("League player", "league-player-name", value, "text");
  }
  const options = [
    ["", "Select league player"],
    ...uniqueStrings([value, ...catalog.leaguePlayers]).map((option) => [option, option]),
  ];
  const row = settingsSelectNode("League player", "league-player-name", value, options);
  row.classList.add("settings-league-player-row");
  return row;
}

function settingsButtonNode(label, action, disabled = false, destructive = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = destructive ? "settings-button is-destructive" : "settings-button";
  button.textContent = label;
  button.disabled = disabled;
  button.addEventListener("click", action);
  return button;
}

function coverageFraction(count, total, catalogLoaded) {
  if (!catalogLoaded) return "Catalog pending";
  if (total === 0) return "0";
  return `${count.toLocaleString()}/${total.toLocaleString()}`;
}

function activityRangeLabel(range) {
  if (!range.firstActivityAt || !range.lastActivityAt) return "No activity yet";
  if (range.firstActivityAt === range.lastActivityAt) return formatDate(range.firstActivityAt);
  return `${formatDate(range.firstActivityAt)} to ${formatDate(range.lastActivityAt)}`;
}

function downloadPracticeQaReport() {
  const report = validatePracticeState(practiceState, catalog);
  const stats = practiceDataInspectorStats(practiceState, catalog, report);
  downloadJson(`pinprof-practice-qa-${timestampSlug()}.json`, stats);
  setStatus("Downloaded Practice QA report");
}

async function parsePracticeImportPayload(payload) {
  if (isPracticeSyncSeedEnvelope(payload)) {
    const state = normalizePracticeState(payload.state);
    const expectedHash = normalizedString(payload.base?.canonicalHash).toLowerCase();
    let verifiedHash = false;
    if (expectedHash) {
      const actualHash = await practiceStateHash(state);
      if (actualHash !== expectedHash) {
        throw new Error(`Sync seed hash mismatch. Expected ${expectedHash.slice(0, 12)}, found ${actualHash.slice(0, 12)}.`);
      }
      verifiedHash = true;
    }
    return {
      state,
      label: "sync seed",
      checkpointSource: "Sync Seed Import",
      verifiedHash,
    };
  }

  if (!isCanonicalPracticePayload(payload)) {
    throw new Error("Import must be canonical Practice JSON or a PinProf Practice sync seed.");
  }

  return {
    state: normalizePracticeState(payload),
    label: "Practice JSON",
    checkpointSource: "Import",
    verifiedHash: false,
  };
}

function isPracticeSyncSeedEnvelope(payload) {
  return Boolean(payload)
    && typeof payload === "object"
    && !Array.isArray(payload)
    && payload.payloadType === PRACTICE_SYNC_SEED_PAYLOAD_TYPE
    && payload.state
    && typeof payload.state === "object"
    && !Array.isArray(payload.state);
}

function isCanonicalPracticePayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return false;
  return [
    "schemaVersion",
    "studyEvents",
    "videoProgressEntries",
    "scoreEntries",
    "noteEntries",
    "journalEntries",
    "customGroups",
    "leagueSettings",
    "syncSettings",
    "analyticsSettings",
    "practiceSettings",
    "gameSummaryNotes",
  ].some((key) => Object.hasOwn(payload, key));
}

async function downloadPracticeSyncSeed() {
  if (!hasPracticeData(practiceState)) return;
  const envelope = await buildPracticeSyncSeedEnvelope(practiceState);
  downloadJson(`pinprof-practice-sync-seed-${timestampSlug()}.json`, envelope);
  setStatus("Downloaded Practice sync seed");
}

async function buildPracticeSyncSeedEnvelope(state, catalogState = catalog) {
  const normalized = normalizePracticeState(state);
  const report = validatePracticeState(normalized, catalogState);
  const stats = practiceDataInspectorStats(normalized, catalogState, report);
  const canonicalHash = await practiceStateHash(normalized);
  return {
    envelopeVersion: 1,
    payloadType: PRACTICE_SYNC_SEED_PAYLOAD_TYPE,
    generatedAt: new Date().toISOString(),
    client: {
      platform: "web",
      app: "pinprof.com/practice",
      canonicalSchemaVersion: normalized.schemaVersion,
    },
    base: {
      canonicalHash,
      canonicalSchemaVersion: normalized.schemaVersion,
    },
    state: normalized,
    summary: {
      rowCounts: stats.rowCounts,
      gameCoverage: stats.gameCoverage,
      linkedData: stats.linkedData,
      activityRange: stats.activityRange,
      validation: stats.validation,
    },
    syncDraft: {
      schemaVersion: 5,
      recommendedMode: "local-first",
      recordIdentity: practiceSyncRecordIdentity(),
      transactionGroups: practiceSyncTransactionGroups(),
      tombstones: [],
      notes: [
        "Canonical Practice state remains schema v4 inside this envelope.",
        "Use transactionGroups to keep Journal rows paired with score/study/video/note rows.",
        "Use tombstones for future cross-device deletes instead of silent destructive removal.",
      ],
    },
  };
}

function practiceSyncRecordIdentity() {
  return {
    studyEvents: "id",
    videoProgressEntries: "id",
    scoreEntries: "id",
    noteEntries: "id",
    journalEntries: "id",
    customGroups: "id",
    gameSummaryNotes: "gameID",
    rulesheetResumeOffsets: "gameID",
    videoResumeHints: "gameID",
    leagueSettings: "section",
    syncSettings: "section",
    analyticsSettings: "section",
    practiceSettings: "section",
  };
}

function practiceSyncTransactionGroups() {
  return [
    {
      action: "scoreLogged",
      collections: ["scoreEntries", "journalEntries"],
      match: "gameID + score + context + timestamp",
    },
    {
      action: "rulesheetRead",
      collections: ["studyEvents", "journalEntries"],
      match: "gameID + task + progressPercent + timestamp",
    },
    {
      action: "tutorialWatch",
      collections: ["videoProgressEntries", "studyEvents?", "journalEntries"],
      match: "gameID + videoKind + videoValue + timestamp",
    },
    {
      action: "gameplayWatch",
      collections: ["videoProgressEntries", "studyEvents?", "journalEntries"],
      match: "gameID + videoKind + videoValue + timestamp",
    },
    {
      action: "practiceSession",
      collections: ["noteEntries", "journalEntries"],
      match: "gameID + noteCategory + noteDetail + timestamp",
    },
    {
      action: "noteAdded",
      collections: ["noteEntries", "journalEntries"],
      match: "gameID + noteCategory + noteDetail + timestamp",
    },
  ];
}

async function saveCurrentPracticeCheckpoint() {
  if (!hasPracticeData(practiceState)) return;
  await recordPracticeCheckpoint("Manual", "Current browser state", practiceState);
  setStatus("Saved Practice checkpoint");
  render();
}

function clearPracticeCheckpoints() {
  if (!practiceCheckpoints.length) return;
  if (!window.confirm("Clear local Practice checkpoint history? Exported Practice JSON and current local state stay unchanged.")) return;
  practiceCheckpoints = [];
  savePracticeCheckpoints();
  setStatus("Cleared Practice checkpoint history");
  render();
}

async function recordPracticeCheckpoint(source, filename, state) {
  const normalized = normalizePracticeState(state);
  const report = validatePracticeState(normalized, catalog);
  const stats = practiceDataInspectorStats(normalized, catalog, report);
  const stableHash = await practiceStateHash(normalized);
  const checkpoint = {
    id: crypto.randomUUID(),
    source,
    filename,
    createdAt: Date.now(),
    stableHash,
    shortHash: stableHash.slice(0, 12),
    schemaVersion: normalized.schemaVersion,
    validationCounts: report.counts,
    validationSummary: report.summary,
    rowCounts: stats.rowCounts,
    gameCoverage: stats.gameCoverage,
    activityRange: stats.activityRange,
  };
  practiceCheckpoints = [
    checkpoint,
    ...practiceCheckpoints.filter((item) => item.stableHash !== stableHash || item.source !== source || item.filename !== filename),
  ].slice(0, MAX_PRACTICE_CHECKPOINTS);
  savePracticeCheckpoints();
}

async function practiceStateHash(state) {
  const json = JSON.stringify(normalizePracticeState(state), null, 2);
  if (crypto.subtle?.digest) {
    const bytes = new TextEncoder().encode(json);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  return fallbackStringHash(json);
}

function fallbackStringHash(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function wireSettingsControls() {
  bindTextSetting("sync-endpoint", (value) => {
    practiceState.syncSettings.endpoint = value || "pinprof.com";
  });
  bindToggleSetting("csv-auto-fill", (checked) => {
    practiceState.leagueSettings.csvAutoFillEnabled = checked;
  });
  bindToggleSetting("cloud-sync-enabled", (checked) => {
    practiceState.syncSettings.cloudSyncEnabled = checked;
  });
  bindToggleSetting("analytics-use-median", (checked) => {
    practiceState.analyticsSettings.useMedian = checked;
  });
  const gapMode = document.querySelector("#analytics-gap-mode");
  gapMode?.addEventListener("change", () => {
    practiceState.analyticsSettings.gapMode = gapMode.value;
    persistState();
    setStatus("Analytics settings saved");
  });

  const leaguePlayer = document.querySelector("#league-player-name");
  leaguePlayer?.addEventListener("change", () => {
    saveLeaguePlayerSettings();
  });
}

function bindTextSetting(id, update) {
  const input = document.querySelector(`#${id}`);
  input?.addEventListener("input", () => {
    update(input.value.trim());
    persistState();
    setStatus("Practice settings saved");
  });
}

function bindToggleSetting(id, update) {
  const input = document.querySelector(`#${id}`);
  input?.addEventListener("change", () => {
    update(Boolean(input.checked));
    persistState();
    setStatus("Practice settings saved");
    render();
  });
}

function savePracticeProfileSettings() {
  const playerName = normalizedString(document.querySelector("#player-name")?.value);
  const comparisonPlayerName = normalizedString(document.querySelector("#comparison-player-name")?.value);
  practiceState.practiceSettings.playerName = playerName;
  practiceState.practiceSettings.comparisonPlayerName = comparisonPlayerName;
  if (!normalizedString(practiceState.leagueSettings.playerName)) {
    practiceState.leagueSettings.playerName = playerName;
  }
  syncIfpaFromLeagueIdentity(playerName);
  persistState();
  setStatus("Practice profile saved");
  render();
}

function saveIfpaSettings() {
  practiceState.practiceSettings.ifpaPlayerID = normalizedString(document.querySelector("#ifpa-player-id")?.value);
  persistState();
  setStatus("IFPA ID saved");
  render();
}

function savePrpaSettings() {
  practiceState.practiceSettings.prpaPlayerID = normalizedString(document.querySelector("#prpa-player-id")?.value);
  persistState();
  setStatus("PRPA ID saved");
  render();
}

function saveLeaguePlayerSettings() {
  const value = normalizedString(document.querySelector("#league-player-name")?.value);
  practiceState.leagueSettings.playerName = value;
  practiceState.leagueSettings.csvAutoFillEnabled = true;
  if (!normalizedString(practiceState.practiceSettings.playerName)) {
    practiceState.practiceSettings.playerName = value;
  }
  syncIfpaFromLeagueIdentity(value);
  persistState();
  setStatus(value ? "League player saved" : "League player cleared");
  render();
}

function syncIfpaFromLeagueIdentity(playerName) {
  const normalized = normalizeHumanName(playerName);
  if (!normalized) return;
  const record = catalog.leagueIfpaByPlayer.get(normalized);
  if (record?.ifpaPlayerID) {
    practiceState.practiceSettings.ifpaPlayerID = record.ifpaPlayerID;
  }
}

function importLeagueScoresFromHostedCsv() {
  const playerName = normalizedString(practiceState.leagueSettings.playerName || document.querySelector("#league-player-name")?.value);
  if (!playerName) {
    setStatus("Select a league player before importing LPL scores.", true);
    return;
  }
  if (!catalog.leagueRows.length) {
    setStatus("Hosted LPL stats CSV is not loaded.", true);
    return;
  }

  const normalizedPlayer = normalizeHumanName(playerName);
  const rows = catalog.leagueRows.filter((row) => normalizeHumanName(row.player) === normalizedPlayer);
  let imported = 0;
  let duplicatesSkipped = 0;
  let unmatchedRows = 0;

  for (const row of rows) {
    const gameID = resolveLeagueGameID(row);
    const eventDate = leagueEventTimestamp(row.eventDate);
    if (!gameID || !eventDate || !Number.isFinite(row.rawScore) || row.rawScore <= 0) {
      unmatchedRows += 1;
      continue;
    }
    const draft = {
      gameID,
      score: row.rawScore,
      context: "league",
      timestamp: eventDate,
    };
    if (practiceState.scoreEntries.some((entry) => scoreImportLinkKey(entry) === scoreImportLinkKey(draft))) {
      duplicatesSkipped += 1;
      continue;
    }
    practiceState.scoreEntries.push({
      id: crypto.randomUUID(),
      gameID,
      score: row.rawScore,
      context: "league",
      tournamentName: null,
      timestamp: eventDate,
      leagueImported: true,
    });
    practiceState.journalEntries.push({
      id: crypto.randomUUID(),
      gameID,
      action: "scoreLogged",
      task: null,
      progressPercent: null,
      videoKind: null,
      videoValue: null,
      score: row.rawScore,
      scoreContext: "league",
      tournamentName: null,
      noteCategory: null,
      noteDetail: null,
      note: LEAGUE_IMPORT_NOTE,
      timestamp: eventDate,
    });
    imported += 1;
  }

  practiceState.leagueSettings.playerName = playerName;
  practiceState.leagueSettings.csvAutoFillEnabled = true;
  practiceState.leagueSettings.lastImportAt = Date.now();
  practiceState.leagueSettings.lastRepairVersion = 1;
  syncIfpaFromLeagueIdentity(playerName);
  persistState();
  setStatus(`League import for ${playerName}: ${imported} imported, ${duplicatesSkipped} skipped, ${unmatchedRows} unmatched.`);
  render();
}

function clearImportedLeagueScores() {
  const importedEntries = practiceState.scoreEntries.filter((entry) => entry.leagueImported);
  const count = importedEntries.length;
  if (!count) return;
  if (!window.confirm(clearImportedLeagueScoresAlertMessage(count))) return;
  const importedKeys = new Set(importedEntries.map(scoreImportLinkKey));
  practiceState.scoreEntries = practiceState.scoreEntries.filter((entry) => !entry.leagueImported);
  practiceState.journalEntries = practiceState.journalEntries.filter((entry) => {
    if (entry.action !== "scoreLogged") return true;
    if (normalizedString(entry.note).toLowerCase().includes(LEAGUE_IMPORT_NOTE.toLowerCase())) return false;
    return !importedKeys.has(scoreImportLinkKey(entry));
  });
  practiceState.leagueSettings.lastImportAt = null;
  practiceState.leagueSettings.lastRepairVersion = null;
  persistState();
  setStatus(clearedImportedLeagueScoresStatusMessage(count));
  render();
}

function resetPracticeLog() {
  if (!hasPracticeData(practiceState)) return;
  const confirmation = window.prompt('Type "reset" to clear local Practice JSON.');
  if (confirmation?.trim().toLowerCase() !== "reset") return;
  practiceState = structuredClone(EMPTY_STATE);
  selectedGameID = "";
  activeRoute = "home";
  resetGroupEditorDraft();
  persistState();
  localStorage.removeItem(SELECTED_GAME_KEY);
  localStorage.setItem(ACTIVE_ROUTE_KEY, activeRoute);
  setStatus("Practice log reset");
  render();
}

function parseLeagueRows(text) {
  return csvObjects(text).map((row) => {
    const rawScore = parseScoreInput(row.RawScore || row.Score);
    return {
      player: normalizedString(row.Player),
      machine: normalizedString(row.Machine || row.Game),
      rawScore: Number.isFinite(rawScore) ? rawScore : 0,
      eventDate: normalizedString(row.EventDate || row["Event Date"] || row.Date),
      practiceIdentity: normalizedString(row.PracticeIdentity || row.practice_identity),
      opdbID: normalizedString(row.OPDBID || row["OPDB ID"] || row.opdb_id || row.opdbId),
    };
  }).filter((row) => row.player && row.machine && row.rawScore > 0);
}

function leaguePlayersFromRows(rows) {
  const namesByNormalized = new Map();
  for (const row of rows) {
    const normalized = normalizeHumanName(row.player);
    if (normalized && !namesByNormalized.has(normalized)) {
      namesByNormalized.set(normalized, row.player);
    }
  }
  return [...namesByNormalized.values()].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
}

function parseLeagueIfpaRecords(text) {
  const byPlayer = new Map();
  for (const row of csvObjects(text)) {
    const player = normalizedString(row.player);
    const ifpaPlayerID = normalizedString(row.ifpa_player_id);
    if (!player || !ifpaPlayerID) continue;
    byPlayer.set(normalizeHumanName(player), {
      player,
      ifpaPlayerID,
      ifpaName: normalizedString(row.ifpa_name) || player,
    });
  }
  return byPlayer;
}

function scoreTrendValuesForGame(gameID) {
  return practiceState.scoreEntries
    .filter((entry) => normalizedString(entry.gameID) === normalizedString(gameID) && hasPositiveNumericScore(entry.score))
    .sort((a, b) => timestampValue(a.timestamp) - timestampValue(b.timestamp))
    .map((entry) => Number(entry.score));
}

function leagueOpponentOptions(currentValue, yourName) {
  const yourKey = normalizeHumanName(yourName);
  const players = catalog.leaguePlayers.filter((player) => normalizeHumanName(player) !== yourKey);
  return [
    ["", "Select player"],
    ...uniqueStrings([currentValue, ...players]).filter(Boolean).map((player) => [player, player]),
  ];
}

function buildHeadToHeadComparison(yourName, opponentName) {
  if (!catalog.leagueRows.length) return null;
  const yourKey = normalizeHumanName(yourName);
  const opponentKey = normalizeHumanName(opponentName);
  if (!yourKey || !opponentKey) return null;

  const yourScores = leagueScoresByGameForPlayer(yourKey);
  const opponentScores = leagueScoresByGameForPlayer(opponentKey);
  const sharedGameIDs = [...yourScores.keys()].filter((gameID) => opponentScores.has(gameID));
  if (!sharedGameIDs.length) return null;

  const games = sharedGameIDs.map((gameID) => {
    const yourValues = yourScores.get(gameID);
    const opponentValues = opponentScores.get(gameID);
    const yourMean = averageNumber(yourValues);
    const opponentMean = averageNumber(opponentValues);
    return {
      gameID,
      gameName: gameDisplayName(gameID),
      yourCount: yourValues.length,
      opponentCount: opponentValues.length,
      yourMean,
      opponentMean,
      yourHigh: Math.max(...yourValues),
      opponentHigh: Math.max(...opponentValues),
      yourLow: Math.min(...yourValues),
      opponentLow: Math.min(...opponentValues),
      meanDelta: yourMean - opponentMean,
    };
  }).sort((a, b) => Math.abs(b.meanDelta) - Math.abs(a.meanDelta));

  const averageMeanDelta = averageNumber(games.map((game) => game.meanDelta));
  return {
    yourPlayerName: yourName,
    opponentPlayerName: opponentName,
    totalGamesCompared: games.length,
    gamesYouLeadByMean: games.filter((game) => game.meanDelta > 0).length,
    gamesOpponentLeadsByMean: games.filter((game) => game.meanDelta < 0).length,
    averageMeanDelta,
    games,
  };
}

function leagueScoresByGameForPlayer(normalizedPlayerName) {
  const byGame = new Map();
  for (const row of catalog.leagueRows) {
    if (normalizeHumanName(row.player) !== normalizedPlayerName) continue;
    const gameID = resolveLeagueGameID(row);
    if (!gameID) continue;
    const values = byGame.get(gameID) ?? [];
    values.push(row.rawScore);
    byGame.set(gameID, values);
  }
  return byGame;
}

function headToHeadGameRowNode(game) {
  const row = document.createElement("div");
  row.className = "head-to-head-row";
  row.innerHTML = `
    <span class="row-title">${escapeHtml(game.gameName)}</span>
    <span class="row-meta">Mean ${escapeHtml(formatScore(game.yourMean))} vs ${escapeHtml(formatScore(game.opponentMean))}</span>
    <strong class="${game.meanDelta >= 0 ? "positive-text" : "caution-text"}">${escapeHtml(signedScore(game.meanDelta))}</strong>
  `;
  return row;
}

function headToHeadDeltaBarsNode(games) {
  const panel = document.createElement("div");
  panel.className = "head-to-head-bars";
  const heading = document.createElement("div");
  heading.className = "head-to-head-bars-header";
  heading.innerHTML = `
    <span class="row-title">Mean Delta</span>
    <span class="row-meta">Positive bars favor you; gold bars favor the opponent.</span>
  `;
  panel.append(heading);

  if (!games.length) {
    panel.append(emptyNode("No shared games to chart."));
    return panel;
  }

  const maxDelta = Math.max(...games.map((game) => Math.abs(Number(game.meanDelta) || 0)), 1);
  for (const game of games) {
    panel.append(headToHeadDeltaBarRowNode(game, maxDelta));
  }
  return panel;
}

function headToHeadDeltaBarRowNode(game, maxDelta) {
  const row = document.createElement("div");
  row.className = "head-to-head-bar-row";
  row.dataset.direction = game.meanDelta >= 0 ? "positive" : "negative";
  const width = Math.min(50, (Math.abs(Number(game.meanDelta) || 0) / maxDelta) * 50);
  row.style.setProperty("--delta-width", `${width.toFixed(2)}%`);
  row.innerHTML = `
    <span class="head-to-head-bar-copy">
      <span class="row-title">${escapeHtml(game.gameName)}</span>
      <span class="row-meta">${escapeHtml(formatScore(game.yourMean))} vs ${escapeHtml(formatScore(game.opponentMean))}</span>
    </span>
    <span class="head-to-head-bar-track" aria-label="${escapeAttribute(`${game.gameName} mean delta ${signedScore(game.meanDelta)}`)}">
      <span class="head-to-head-bar-axis"></span>
      <span class="head-to-head-bar-fill"></span>
    </span>
    <strong class="${game.meanDelta >= 0 ? "positive-text" : "caution-text"}">${escapeHtml(signedScore(game.meanDelta))}</strong>
  `;
  return row;
}

function averageNumber(values) {
  const valid = values.filter((value) => Number.isFinite(value));
  if (!valid.length) return 0;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

function signedScore(value) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${formatScore(Math.abs(value))}`;
}

function signedDecimal(value) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}`;
}

function sparklineNode(values, tone = "score", emptyText = "Need 2+ scores for trend") {
  const numericValues = values.map(Number).filter(Number.isFinite);
  const wrapper = document.createElement("div");
  wrapper.className = `sparkline-chart sparkline-${tone}`;
  if (numericValues.length < 2) {
    wrapper.textContent = emptyText;
    return wrapper;
  }

  const min = Math.min(...numericValues);
  const max = Math.max(...numericValues);
  const span = Math.max(1, max - min);
  const points = numericValues.map((value, index) => {
    const x = numericValues.length === 1 ? 50 : (index / (numericValues.length - 1)) * 100;
    const y = 36 - ((value - min) / span) * 30;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 100 40");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `${numericValues.length} value trend`);

  for (const y of [8, 20, 32]) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", "0");
    line.setAttribute("x2", "100");
    line.setAttribute("y1", String(y));
    line.setAttribute("y2", String(y));
    line.setAttribute("class", "sparkline-grid-line");
    svg.append(line);
  }

  const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  polyline.setAttribute("points", points);
  polyline.setAttribute("class", "sparkline-line");
  svg.append(polyline);
  wrapper.append(svg);
  return wrapper;
}

function addMechanicsLog({ gameID = "", skill = "", comfort = 3, note = "", timestamp = Date.now() }) {
  const cleanSkill = normalizedString(skill);
  const value = clampNumber(comfort, 1, 5);
  const rawNote = normalizedEntryNote(note);
  const prefix = cleanSkill ? `#${cleanSkill.replaceAll(" ", "")}` : "#mechanics";
  const composed = rawNote
    ? `${prefix} competency ${value}/5. ${rawNote}`
    : `${prefix} competency ${value}/5.`;

  practiceState.noteEntries = [
    ...practiceState.noteEntries,
    {
      id: crypto.randomUUID(),
      gameID: normalizedString(gameID),
      category: "general",
      detail: cleanSkill || null,
      note: composed,
      timestamp,
    },
  ];
  addJournalEntry({
    gameID: normalizedString(gameID),
    action: "noteAdded",
    noteCategory: "general",
    noteDetail: cleanSkill || null,
    note: composed,
    timestamp,
  });
}

function detectedMechanicsTags(text) {
  const normalized = normalizedString(text).toLowerCase();
  if (!normalized) return [];
  return MECHANICS_SKILLS.filter((skill) => mechanicsAliases(skill).some((alias) => normalized.includes(alias)));
}

function mechanicsAliases(skill) {
  switch (skill) {
    case "Dead Bounce": return ["dead bounce", "deadbounce", "dead flip", "deadflip"];
    case "Post Pass": return ["post pass", "postpass"];
    case "Post Catch": return ["post catch", "postcatch"];
    case "Flick Pass": return ["flick pass", "flickpass"];
    case "Nudge Pass": return ["nudge pass", "nudgepass", "nudge control", "nudgecontrol"];
    case "Drop Catch": return ["drop catch", "dropcatch"];
    case "Live Catch": return ["live catch", "livecatch"];
    case "Shatz": return ["shatz", "shatzing", "alley pass", "alleypass"];
    case "Back Flip": return ["back flip", "backflip", "bang back", "bangback"];
    case "Loop Pass": return ["loop pass", "looppass"];
    case "Slap Save (Single)": return ["slap save", "slap save single", "single slap save"];
    case "Slap Save (Double)": return ["slap save double", "double slap save"];
    case "Air Defense": return ["air defense", "airdefense"];
    case "Cradle Separation": return ["cradle separation", "cradleseparation"];
    case "Over Under": return ["over under", "overunder"];
    case "Tap Pass": return ["tap pass", "tappass"];
    default: return [normalizedString(skill).toLowerCase()];
  }
}

function allMechanicsLogEntries() {
  return practiceState.noteEntries.filter((entry) => {
    const detailTags = detectedMechanicsTags(entry.detail ?? "");
    const noteTags = detectedMechanicsTags(entry.note ?? "");
    const note = normalizedString(entry.note).toLowerCase();
    return detailTags.length > 0 || noteTags.length > 0 || note.includes("#mechanics") || note.includes("competency");
  });
}

function mechanicsLogsForSkill(skill) {
  const cleanSkill = normalizedString(skill);
  if (!cleanSkill) return allMechanicsLogs();
  return allMechanicsLogEntries()
    .filter((entry) => {
      const detailMatch = detectedMechanicsTags(entry.detail ?? "").includes(cleanSkill);
      const tagMatch = normalizedString(entry.note).toLowerCase().includes(`#${cleanSkill.replaceAll(" ", "").toLowerCase()}`);
      const termMatch = detectedMechanicsTags(entry.note ?? "").includes(cleanSkill);
      return detailMatch || tagMatch || termMatch;
    })
    .sort((a, b) => timestampValue(a.timestamp) - timestampValue(b.timestamp))
    .map((entry) => mechanicsLogFromNoteEntry(entry, cleanSkill));
}

function allMechanicsLogs() {
  return allMechanicsLogEntries()
    .sort((a, b) => timestampValue(a.timestamp) - timestampValue(b.timestamp))
    .map((entry) => {
      const inferredSkill = detectedMechanicsTags(`${entry.detail ?? ""} ${entry.note ?? ""}`)[0]
        || normalizedString(entry.detail)
        || "Mechanics";
      return mechanicsLogFromNoteEntry(entry, inferredSkill);
    });
}

function mechanicsLogFromNoteEntry(entry, skill) {
  return {
    id: entry.id,
    skill,
    timestamp: entry.timestamp,
    comfort: parseComfortValue(entry.note ?? ""),
    gameID: normalizedString(entry.gameID),
    note: entry.note ?? "",
  };
}

function mechanicsSummaryForSkill(skill) {
  const logs = mechanicsLogsForSkill(skill);
  const comforts = logs.map((log) => log.comfort).filter((value) => value != null);
  const split = Math.max(1, Math.floor(comforts.length / 2));
  const secondSlice = comforts.slice(split);
  const trendDelta = comforts.length >= 2 && secondSlice.length
    ? averageNumber(secondSlice) - averageNumber(comforts.slice(0, split))
    : null;
  return {
    skill,
    totalLogs: logs.length,
    latestComfort: comforts.length ? comforts[comforts.length - 1] : null,
    averageComfort: comforts.length ? averageNumber(comforts) : null,
    trendDelta,
    latestTimestamp: logs.at(-1)?.timestamp ?? null,
  };
}

function trackedMechanicsSkills() {
  const tracked = new Set(MECHANICS_SKILLS);
  for (const note of practiceState.noteEntries) {
    for (const skill of detectedMechanicsTags(`${note.detail ?? ""} ${note.note ?? ""}`)) {
      tracked.add(skill);
    }
  }
  return MECHANICS_SKILLS.filter((skill) => tracked.has(skill));
}

function parseComfortValue(note) {
  const match = normalizedString(note).match(/(?:comfort|competency)\s+([1-5])(?:\s*\/\s*5)?/i);
  return match ? Number(match[1]) : null;
}

function mechanicsLogRowNode(log) {
  const row = document.createElement("div");
  row.className = "mechanics-log-row";
  row.innerHTML = `
    <span class="row-title">${escapeHtml(log.note)}</span>
    <span class="row-meta">${escapeHtml(formatDate(log.timestamp))} · ${escapeHtml(log.gameID ? gameDisplayName(log.gameID) : "All Practice")}</span>
  `;
  return row;
}

function parseLeagueMachineMappings(payload) {
  const map = new Map();
  for (const item of Array.isArray(payload?.items) ? payload.items : []) {
    const key = normalizeMachineName(item.machine);
    if (!key) continue;
    map.set(key, {
      machine: normalizedString(item.machine),
      practiceIdentity: normalizedString(item.practice_identity),
      opdbID: normalizedString(item.opdb_id),
    });
  }
  return map;
}

function csvObjects(text) {
  const rows = parseCsvRows(text);
  if (!rows.length) return [];
  const headers = rows[0].map((header) => normalizedString(header));
  return rows.slice(1).map((columns) => {
    const row = {};
    headers.forEach((header, index) => {
      if (header) row[header] = columns[index] ?? "";
    });
    return row;
  });
}

function parseCsvRows(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  const source = String(text ?? "");
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];
    if (char === "\"") {
      if (inQuotes && next === "\"") {
        field += "\"";
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  row.push(field);
  rows.push(row);
  return rows.filter((columns) => columns.some((column) => normalizedString(column)));
}

function resolveLeagueGameID(row) {
  for (const candidate of [
    row.practiceIdentity,
    practiceIdForOpdb(catalog.practiceIdByOpdb, row.opdbID),
    opdbGroupID(row.opdbID),
  ]) {
    const gameID = normalizedString(candidate);
    if (gameID && catalog.gamesByPracticeId.has(gameID)) return gameID;
  }

  const mapped = catalog.leagueMachineMappings.get(normalizeMachineName(row.machine));
  if (mapped) {
    for (const candidate of [
      mapped.practiceIdentity,
      practiceIdForOpdb(catalog.practiceIdByOpdb, mapped.opdbID),
      opdbGroupID(mapped.opdbID),
    ]) {
      const gameID = normalizedString(candidate);
      if (gameID && catalog.gamesByPracticeId.has(gameID)) return gameID;
    }
  }

  const machineKey = normalizeMachineName(row.machine);
  if (!machineKey) return "";
  const matches = [...catalog.gamesByPracticeId.values()]
    .filter((game) => normalizeMachineName(game.name) === machineKey)
    .map((game) => game.practiceId);
  return uniqueStrings(matches).length === 1 ? uniqueStrings(matches)[0] : "";
}

function opdbGroupID(raw) {
  const match = normalizedString(raw).match(/\bG[0-9A-Z]{4,}\b/i);
  return match ? match[0] : "";
}

function leagueEventTimestamp(value) {
  const raw = normalizedString(value);
  if (!raw) return null;
  const date = new Date(`${raw}T22:00:00`);
  return Number.isNaN(date.getTime()) ? null : date.getTime();
}

function scoreImportLinkKey(entry) {
  return [
    normalizedString(entry.gameID),
    String(Number(entry.score)),
    timestampBucket(entry.timestamp),
  ].join("|");
}

function normalizeHumanName(value) {
  return normalizedString(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}

function firstNameFromPlayerName(value) {
  return normalizedString(value).split(/\s+/)[0] || value;
}

function normalizeMachineName(value) {
  return normalizedString(value)
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(the|pinball|machine)\b/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function importedLeagueScoreSummary(count) {
  if (count === 0) return "No imported league scores are currently saved.";
  if (count === 1) return "Remove only the 1 imported league score. Manual Practice notes and scores stay.";
  return `Remove only the ${count} imported league scores. Manual Practice notes and scores stay.`;
}

function clearImportedLeagueScoresButtonTitle(count) {
  if (count === 0) return "Clear Imported League Scores";
  if (count === 1) return "Clear 1 Imported League Score";
  return `Clear ${count} Imported League Scores`;
}

function clearImportedLeagueScoresAlertMessage(count) {
  if (count === 0) return "No imported league scores are currently saved.";
  if (count === 1) return "This removes the 1 imported league score and matching journal rows. Manual Practice entries stay.";
  return `This removes the ${count} imported league scores and matching journal rows. Manual Practice entries stay.`;
}

function clearedImportedLeagueScoresStatusMessage(count) {
  if (count === 0) return "No imported league scores to clear.";
  if (count === 1) return "Cleared 1 imported league score.";
  return `Cleared ${count} imported league scores.`;
}

function homeResumeMeta(snapshot) {
  const parts = [
    snapshot.highScore ? `High ${formatScore(snapshot.highScore)}` : "",
    snapshot.scoreEntries.length ? `${snapshot.scoreEntries.length} scores` : "",
    snapshot.lastActivity ? `Last ${formatDate(snapshot.lastActivity)}` : "",
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : "No activity yet";
}

function activeGroups() {
  return [...practiceState.customGroups]
    .filter((group) => !group.isArchived)
    .sort((a, b) => Number(Boolean(b.isPriority)) - Number(Boolean(a.isPriority)));
}

function selectedGroup() {
  const selectedGroupID = normalizedString(practiceState.practiceSettings?.selectedGroupID);
  if (selectedGroupID) {
    const exact = practiceState.customGroups.find((group) => normalizedString(group.id) === selectedGroupID);
    if (exact) return exact;
  }
  return practiceState.customGroups.find((group) => !group.isArchived && group.isActive && group.isPriority)
    || practiceState.customGroups.find((group) => !group.isArchived && group.isActive)
    || practiceState.customGroups.find((group) => !group.isArchived)
    || practiceState.customGroups[0]
    || null;
}

function updateGroup(groupID, patch) {
  const id = normalizedString(groupID);
  const index = practiceState.customGroups.findIndex((group) => normalizedString(group.id) === id);
  if (index < 0) return;

  const groups = [...practiceState.customGroups];
  if (patch.isPriority === true) {
    for (let i = 0; i < groups.length; i += 1) {
      groups[i] = { ...groups[i], isPriority: normalizedString(groups[i].id) === id };
    }
  }

  const current = groups[index];
  groups[index] = {
    ...current,
    ...patch,
  };
  if (patch.isArchived === true) {
    groups[index].isActive = false;
    groups[index].isPriority = false;
  }
  if (patch.isArchived === false && patch.isActive === undefined) {
    groups[index].isActive = true;
  }

  practiceState.customGroups = groups;
  if (practiceState.practiceSettings.selectedGroupID == null) {
    practiceState.practiceSettings.selectedGroupID = groups[index].id ?? null;
  }
  persistState();
  render();
}

function removeGameFromGroup(gameID, groupID) {
  const id = normalizedString(groupID);
  const groups = practiceState.customGroups.map((group) => {
    if (normalizedString(group.id) !== id) return group;
    return {
      ...group,
      gameIDs: (group.gameIDs ?? []).filter((candidate) => normalizedString(candidate) !== normalizedString(gameID)),
    };
  });
  practiceState.customGroups = groups;
  persistState();
  setStatus("Game removed from group");
  render();
}

function groupDashboardDetail(group) {
  const snapshots = uniqueStrings(group.gameIDs ?? [])
    .map((gameID) => groupProgressSnapshot(gameID, group))
    .filter(Boolean);
  return {
    score: groupDashboardScore(snapshots),
    snapshots,
  };
}

function groupProgressSnapshot(gameID, group) {
  const normalizedGameID = normalizedString(gameID);
  if (!normalizedGameID) return null;
  const taskProgress = Object.fromEntries(STUDY_TASKS.map((task) => [
    task.id,
    latestTaskProgress(normalizedGameID, task.id, group),
  ]));
  const values = Object.values(taskProgress);
  const completionPercent = values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
  const summary = scoreSummaryForGame(normalizedGameID);
  const practiceLast = taskLastTimestamp(normalizedGameID, "practice", group);
  const staleDays = practiceLast ? daysBetween(practiceLast, Date.now()) : null;
  const isStale = staleDays === null || staleDays >= 14;
  const varianceRatio = summary?.median ? (summary.p75 - summary.floor) / summary.median : 1;
  const snapshot = {
    gameID: normalizedGameID,
    game: catalog.gamesByPracticeId.get(normalizedGameID),
    target: catalog.targetsByPracticeId.get(normalizedGameID),
    taskProgress,
    completionPercent,
    staleDays,
    scoreCount: summary?.count ?? 0,
    highScore: summary?.high ?? null,
    scoreLabel: summary ? `Median ${formatScore(summary.median)}` : "No scores",
    resourceLabel: resourceCoverageLabel(catalog.resourcesByPracticeId.get(normalizedGameID) ?? emptyResources()),
    isStale,
    hasVarianceRisk: varianceRatio >= 0.6,
  };
  snapshot.focusReasons = focusReasonsForSnapshot(snapshot);
  snapshot.focusScore = focusScoreForSnapshot(snapshot);
  return snapshot;
}

function groupDashboardScore(snapshots) {
  if (!snapshots.length) {
    return { completionAverage: 0, staleGameCount: 0, weakerGameCount: 0 };
  }
  const completionAverage = Math.round(snapshots.reduce((sum, snapshot) => sum + snapshot.completionPercent, 0) / snapshots.length);
  return {
    completionAverage,
    staleGameCount: snapshots.filter((snapshot) => snapshot.isStale).length,
    weakerGameCount: snapshots.filter((snapshot) => snapshot.hasVarianceRisk).length,
  };
}

function focusItemsForGroup(group, detail = null, limit = 5) {
  if (!group) return [];
  const snapshots = detail?.snapshots ?? groupDashboardDetail(group).snapshots;
  return [...snapshots]
    .filter((snapshot) => snapshot.focusScore > 0)
    .sort((a, b) => {
      if (b.focusScore !== a.focusScore) return b.focusScore - a.focusScore;
      if (a.completionPercent !== b.completionPercent) return a.completionPercent - b.completionPercent;
      return gameDisplayName(a.gameID).localeCompare(gameDisplayName(b.gameID));
    })
    .slice(0, limit);
}

function focusReasonsForSnapshot(snapshot) {
  const reasons = [];
  if (snapshot.isStale) {
    reasons.push(snapshot.staleDays == null ? "No practice logged" : `No practice in ${snapshot.staleDays} days`);
  }
  if (snapshot.completionPercent < 45) {
    reasons.push("Study coverage low");
  } else if (snapshot.completionPercent < 80) {
    reasons.push("Study coverage incomplete");
  }
  if (snapshot.scoreCount === 0) {
    reasons.push("No scores logged");
  } else if (snapshot.hasVarianceRisk) {
    reasons.push("Score spread unstable");
  }
  const targetReason = targetFocusReason(snapshot);
  if (targetReason) reasons.push(targetReason);
  return reasons.slice(0, 4);
}

function focusScoreForSnapshot(snapshot) {
  let score = 0;
  if (snapshot.isStale) {
    score += snapshot.staleDays == null ? 42 : Math.min(45, 18 + snapshot.staleDays);
  }
  score += Math.max(0, 100 - snapshot.completionPercent) * 0.35;
  if (snapshot.scoreCount === 0) score += 24;
  if (snapshot.hasVarianceRisk) score += 16;
  const targetGap = targetFocusGap(snapshot);
  if (targetGap) score += targetGap.weight;
  return Math.round(score);
}

function targetFocusReason(snapshot) {
  const gap = targetFocusGap(snapshot);
  if (!gap) return "";
  return `${gap.label} ${formatScore(gap.delta)} short`;
}

function targetFocusGap(snapshot) {
  const high = Number(snapshot.highScore);
  if (!snapshot.target || !Number.isFinite(high)) return null;
  const thresholds = [
    { label: "2nd target", value: Number(snapshot.target.second_highest_avg), weight: 12 },
    { label: "4th target", value: Number(snapshot.target.fourth_highest_avg), weight: 18 },
    { label: "8th target", value: Number(snapshot.target.eighth_highest_avg), weight: 24 },
  ].filter((item) => Number.isFinite(item.value) && item.value > 0);
  const missed = thresholds.filter((item) => high < item.value);
  if (!missed.length) return null;
  const lowestMissed = missed[missed.length - 1];
  return {
    ...lowestMissed,
    delta: Math.round(lowestMissed.value - high),
  };
}

function focusSnapshotRow(snapshot, compact = false) {
  const row = document.createElement("div");
  row.className = compact ? "focus-row is-compact" : "focus-row";

  const openButton = document.createElement("button");
  openButton.type = "button";
  openButton.className = "focus-open";
  openButton.innerHTML = `
    <span class="row-title">${escapeHtml(snapshot.game?.name ?? snapshot.gameID)}</span>
    <span class="row-meta">${escapeHtml(focusSnapshotMeta(snapshot))}</span>
  `;
  openButton.addEventListener("click", () => {
    selectedGameID = snapshot.gameID;
    activeRoute = "game";
    localStorage.setItem(SELECTED_GAME_KEY, selectedGameID);
    localStorage.setItem(ACTIVE_ROUTE_KEY, activeRoute);
    render();
  });

  const reasons = document.createElement("div");
  reasons.className = "focus-reasons";
  for (const reason of snapshot.focusReasons) {
    reasons.append(statusChip(reason));
  }

  const actions = document.createElement("div");
  actions.className = "focus-actions";
  actions.append(
    focusActionButton("Score", snapshot.gameID, "entry", "score"),
    focusActionButton("Study", snapshot.gameID, "entry", "rulesheet")
  );

  row.append(openButton, reasons, actions);
  return row;
}

function focusSnapshotMeta(snapshot) {
  return [
    `${snapshot.completionPercent}% complete`,
    snapshot.scoreLabel,
    snapshot.resourceLabel,
  ].filter(Boolean).join(" · ");
}

function focusActionButton(label, gameID, route, activity = null) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "tiny-button";
  button.textContent = label;
  button.addEventListener("click", () => {
    selectedGameID = gameID;
    localStorage.setItem(SELECTED_GAME_KEY, selectedGameID);
    if (ENTRY_ACTIVITY_IDS.has(activity)) {
      entryActivity = activity;
      localStorage.setItem(ENTRY_ACTIVITY_KEY, entryActivity);
    }
    setActiveRoute(route);
  });
  return button;
}

function latestTaskProgress(gameID, task, group) {
  const explicit = practiceState.studyEvents
    .filter((entry) => normalizedString(entry.gameID) === gameID
      && entry.task === task
      && isTimestampWithinGroupWindow(entry.timestamp, group))
    .sort((a, b) => timestampValue(b.timestamp) - timestampValue(a.timestamp))[0];
  if (explicit) {
    const progress = Number(explicit.progressPercent);
    return Number.isFinite(progress) ? Math.max(0, Math.min(100, Math.round(progress))) : 0;
  }

  if (task === "practice") {
    return practiceState.journalEntries.some((entry) => normalizedString(entry.gameID) === gameID
      && entry.action === "practiceSession"
      && isTimestampWithinGroupWindow(entry.timestamp, group)) ? 100 : 0;
  }
  if (task === "playfield") {
    return practiceState.journalEntries.some((entry) => normalizedString(entry.gameID) === gameID
      && entry.action === "playfieldViewed"
      && isTimestampWithinGroupWindow(entry.timestamp, group)) ? 100 : 0;
  }
  return 0;
}

function taskLastTimestamp(gameID, task, group) {
  const action = actionForStudyTask(task);
  const timestamps = [
    ...practiceState.studyEvents
      .filter((entry) => normalizedString(entry.gameID) === gameID
        && entry.task === task
        && isTimestampWithinGroupWindow(entry.timestamp, group))
      .map((entry) => timestampValue(entry.timestamp)),
    ...practiceState.journalEntries
      .filter((entry) => normalizedString(entry.gameID) === gameID
        && entry.action === action
        && isTimestampWithinGroupWindow(entry.timestamp, group))
      .map((entry) => timestampValue(entry.timestamp)),
  ].filter((value) => value > 0);
  return timestamps.length ? Math.max(...timestamps) : null;
}

function actionForStudyTask(task) {
  switch (task) {
    case "rulesheet": return "rulesheetRead";
    case "tutorialVideo": return "tutorialWatch";
    case "gameplayVideo": return "gameplayWatch";
    case "playfield": return "playfieldViewed";
    case "practice": return "practiceSession";
    default: return "";
  }
}

function isTimestampWithinGroupWindow(timestamp, group) {
  const value = timestampValue(timestamp);
  if (value <= 0) return false;
  const start = timestampValue(group?.startDate);
  if (start > 0 && value < start) return false;
  const end = endOfDayTimestamp(group?.endDate);
  if (end > 0 && value > end) return false;
  return true;
}

function scoreSummaryForGame(gameID) {
  const scores = practiceState.scoreEntries
    .filter((entry) => normalizedString(entry.gameID) === normalizedString(gameID) && hasPositiveNumericScore(entry.score))
    .map((entry) => Number(entry.score))
    .sort((a, b) => a - b);
  if (!scores.length) return null;
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  return {
    count: scores.length,
    high: scores[scores.length - 1],
    average,
    median: percentile(scores, 0.5),
    floor: scores[0],
    p25: percentile(scores, 0.25),
    p75: percentile(scores, 0.75),
  };
}

function percentile(sortedValues, p) {
  if (!sortedValues.length) return 0;
  const index = (sortedValues.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sortedValues[lower];
  const weight = index - lower;
  return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
}

function groupProgressSummary(taskProgress) {
  return STUDY_TASKS.map((task) => `${task.shortLabel}: ${taskProgress[task.id] ?? 0}%`).join("  -  ");
}

function groupIsActive(group) {
  return !group.isArchived && group.isActive !== false;
}

function groupTypeLabel(raw) {
  switch (normalizedString(raw)) {
    case "bank": return "Bank";
    case "location": return "Location";
    case "custom": return "Custom";
    default: return "Custom";
  }
}

function dateInputValue(value) {
  const timestamp = timestampValue(value);
  if (timestamp <= 0) return "";
  const date = new Date(timestamp);
  const pad = (number) => String(number).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function dateInputTimestamp(value) {
  if (!value) return null;
  const timestamp = new Date(`${value}T00:00:00`).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
}

function endOfDayTimestamp(value) {
  const timestamp = timestampValue(value);
  if (timestamp <= 0) return 0;
  const date = new Date(timestamp);
  date.setHours(23, 59, 59, 999);
  return date.getTime();
}

function shortDateLabel(value) {
  const timestamp = timestampValue(value);
  if (timestamp <= 0) return "-";
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });
}

function daysBetween(start, end) {
  return Math.floor((timestampValue(end) - timestampValue(start)) / 86_400_000);
}

function firstGroupGameID(group) {
  return (group?.gameIDs ?? []).find((id) => Boolean(normalizedString(id))) ?? "";
}

function gameDisplayName(gameID) {
  if (!gameID) return "Unknown game";
  return catalog.gamesByPracticeId.get(gameID)?.name ?? gameID;
}

function renderSummary() {
  dom.summaryContent.replaceChildren();
  if (!selectedGameID) {
    dom.summaryContent.append(emptyNode("Import or load Practice JSON to begin."));
    return;
  }
  const snapshot = gameSnapshot(selectedGameID);
  const view = document.createElement("div");
  view.className = "game-view";
  const layout = document.createElement("div");
  layout.className = "game-layout";
  const main = document.createElement("div");
  main.className = "game-main-column";
  main.append(gameWorkspaceNode(snapshot), gameNoteCardNode(snapshot));
  layout.append(gameOverviewNode(snapshot), main);
  view.append(layout);
  dom.summaryContent.append(view);
}

function gameSnapshot(gameID) {
  const scoreEntries = practiceState.scoreEntries
    .filter((entry) => entry.gameID === gameID && hasPositiveNumericScore(entry.score))
    .sort((a, b) => timestampValue(b.timestamp) - timestampValue(a.timestamp));
  const scoreValues = scoreEntries.map((entry) => Number(entry.score));
  const highScore = scoreValues.length ? Math.max(...scoreValues) : null;
  const averageScore = scoreValues.length
    ? Math.round(scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length)
    : null;
  const journalEntries = practiceState.journalEntries
    .filter((entry) => entry.gameID === gameID)
    .sort((a, b) => timestampValue(b.timestamp) - timestampValue(a.timestamp));
  const studyEvents = practiceState.studyEvents
    .filter((entry) => entry.gameID === gameID)
    .sort((a, b) => timestampValue(b.timestamp) - timestampValue(a.timestamp));
  const videoProgressEntries = practiceState.videoProgressEntries
    .filter((entry) => entry.gameID === gameID)
    .sort((a, b) => timestampValue(b.timestamp) - timestampValue(a.timestamp));
  const noteEntries = practiceState.noteEntries
    .filter((entry) => entry.gameID === gameID)
    .sort((a, b) => timestampValue(b.timestamp) - timestampValue(a.timestamp));
  const activityTimestamps = [
    ...scoreEntries.map((entry) => entry.timestamp),
    ...journalEntries.map((entry) => entry.timestamp),
    ...studyEvents.map((entry) => entry.timestamp),
    ...videoProgressEntries.map((entry) => entry.timestamp),
    ...noteEntries.map((entry) => entry.timestamp),
  ].map(timestampValue).filter((value) => value > 0);

  return {
    gameID,
    game: catalog.gamesByPracticeId.get(gameID),
    resources: catalog.resourcesByPracticeId.get(gameID) ?? emptyResources(),
    target: catalog.targetsByPracticeId.get(gameID),
    scoreEntries,
    highScore,
    averageScore,
    journalEntries,
    studyEvents,
    videoProgressEntries,
    noteEntries,
    groups: practiceState.customGroups.filter((group) => (group.gameIDs ?? []).includes(gameID)),
    lastActivity: activityTimestamps.length ? Math.max(...activityTimestamps) : 0,
  };
}

function gameProfileNode(snapshot) {
  const section = document.createElement("section");
  section.className = "game-profile";
  const image = primaryGameImageForGame(snapshot);
  const groupChips = snapshot.groups.length
    ? snapshot.groups.slice(0, 8).map((group) => group.name || "Untitled Group")
    : ["No groups"];
  const chips = [
    snapshot.game?.manufacturer,
    snapshot.game?.year,
    snapshot.game?.type,
    snapshot.gameID,
    ...groupChips,
  ].filter(Boolean);

  const mediaCard = document.createElement("div");
  mediaCard.className = "library-game-card";
  mediaCard.innerHTML = `
    ${image
      ? `<a class="library-card-art" href="${escapeAttribute(image.url)}" target="_blank" rel="noreferrer">
          <img src="${escapeAttribute(image.url)}" alt="${escapeAttribute(image.label)}">
        </a>`
      : `<div class="library-card-art library-card-art-empty">No image</div>`
    }
    <div class="library-card-copy">
      <div class="library-card-title">${escapeHtml(snapshot.game?.name ?? snapshot.gameID)}</div>
      <div class="library-card-meta">${escapeHtml(gameMeta(snapshot.gameID, snapshot.game))}</div>
      <div class="library-card-bank">${escapeHtml(snapshot.groups[0]?.name || "Practice")}</div>
    </div>
  `;

  const resourcePanel = document.createElement("div");
  resourcePanel.className = "library-resource-panel";
  resourcePanel.append(
    libraryResourceRow("Rulesheet", ruleSheetResourceChips(snapshot.resources)),
    libraryResourceRow("Backglass", backglassResourceChips(snapshot.resources)),
    libraryResourceRow("Playfield", playfieldResourceChips(snapshot.resources)),
    libraryResourceRow("Practice", practiceSummaryChips(snapshot)),
    libraryResourceRow("Groups", chips.map((chip) => chipNode(chip)))
  );

  section.append(mediaCard, resourcePanel);
  return section;
}

function gameOverviewNode(snapshot) {
  const section = document.createElement("section");
  section.className = "game-overview-card";
  const image = primaryGameImageForGame(snapshot);
  const groupNames = snapshot.groups.length
    ? snapshot.groups.slice(0, 8).map((group) => group.name || "Untitled Group")
    : ["No groups"];
  const identityChips = [
    snapshot.game?.manufacturer,
    snapshot.game?.year,
    snapshot.game?.type,
    snapshot.gameID,
  ].filter(Boolean);

  const imageWrap = document.createElement("div");
  imageWrap.className = "game-overview-art";
  imageWrap.innerHTML = image
    ? `<a href="${escapeAttribute(image.url)}" target="_blank" rel="noreferrer">
        <img src="${escapeAttribute(image.url)}" alt="${escapeAttribute(image.label)}">
      </a>`
    : `<span>No image</span>`;

  const copy = document.createElement("div");
  copy.className = "game-overview-copy";
  copy.innerHTML = `
    <h2>${escapeHtml(snapshot.game?.name ?? snapshot.gameID)}</h2>
    <p>${escapeHtml(gameMeta(snapshot.gameID, snapshot.game))}</p>
  `;

  const identityRail = document.createElement("div");
  identityRail.className = "game-overview-chip-rail";
  for (const chip of identityChips) {
    identityRail.append(gameOverviewChipNode(chip));
  }

  const groupRail = document.createElement("div");
  groupRail.className = "game-overview-chip-rail";
  for (const group of groupNames) {
    groupRail.append(gameOverviewChipNode(group, "group"));
  }

  const status = document.createElement("div");
  status.className = "game-overview-status";
  status.append(
    gameOverviewStatusNode("High", snapshot.highScore ? formatScore(snapshot.highScore) : "-"),
    gameOverviewStatusNode("Scores", String(snapshot.scoreEntries.length)),
    gameOverviewStatusNode("Last", snapshot.lastActivity ? formatDate(snapshot.lastActivity) : "-")
  );

  copy.append(identityRail, groupRail, status);
  section.append(imageWrap, copy);
  return section;
}

function gameOverviewChipNode(label, variant = "") {
  const chip = document.createElement("span");
  chip.className = `game-overview-chip${variant ? ` is-${variant}` : ""}`;
  chip.textContent = label;
  return chip;
}

function gameOverviewStatusNode(label, value) {
  const node = document.createElement("div");
  node.className = "game-overview-status-item";
  node.innerHTML = `
    <span>${escapeHtml(label)}</span>
    <strong>${escapeHtml(value)}</strong>
  `;
  return node;
}

function practiceSummaryChips(snapshot) {
  const latestScore = snapshot.scoreEntries[0];
  return [
    chipNode(`High ${snapshot.highScore ? formatScore(snapshot.highScore) : "-"}`),
    chipNode(`Latest ${latestScore ? formatScore(latestScore.score) : "-"}`),
    chipNode(`${snapshot.scoreEntries.length} scores`),
    chipNode(`${snapshot.studyEvents.length + snapshot.videoProgressEntries.length} study logs`),
    chipNode(snapshot.lastActivity ? `Last ${formatDate(snapshot.lastActivity)}` : "No activity"),
  ];
}

function gameDetailGridNode(snapshot) {
  const grid = document.createElement("div");
  grid.className = "game-section-grid";
  grid.append(
    gameSectionNode("Practice Scores", scoreHistoryNode(snapshot)),
    gameSectionNode("Videos", videoPanelNode(snapshot)),
    gameSectionNode("Study Resources", studyResourcesNode(snapshot)),
    gameSectionNode("Targets & Activity", targetActivityNode(snapshot))
  );
  return grid;
}

function gameWorkspaceNode(snapshot) {
  const section = document.createElement("section");
  section.className = "game-workspace-card";
  section.append(
    gameSubviewTabsNode(),
    gameSubviewContentNode(snapshot)
  );
  return section;
}

function gameNoteCardNode(snapshot) {
  const section = document.createElement("section");
  section.className = "game-note-card";

  const header = document.createElement("div");
  header.className = "game-note-header";
  header.innerHTML = `
    <div>
      <h3>Game Note</h3>
      <p class="row-meta">${escapeHtml(snapshot.game?.name ?? snapshot.gameID)}</p>
    </div>
  `;

  const textarea = document.createElement("textarea");
  textarea.rows = 5;
  textarea.placeholder = "Game note";
  textarea.value = practiceState.gameSummaryNotes?.[snapshot.gameID] ?? "";

  const actions = document.createElement("div");
  actions.className = "game-note-actions";
  const save = document.createElement("button");
  save.type = "button";
  save.textContent = "Save Note";
  save.disabled = !snapshot.gameID;
  save.addEventListener("click", () => {
    saveGameSummaryNote(snapshot.gameID, textarea.value);
  });
  actions.append(save);

  section.append(header, textarea, actions);
  return section;
}

function saveGameSummaryNote(gameID, rawValue) {
  const normalizedGameID = normalizedString(gameID);
  if (!normalizedGameID) return;
  const value = normalizedString(rawValue);
  const notes = { ...(practiceState.gameSummaryNotes ?? {}) };
  if (value) {
    notes[normalizedGameID] = value;
  } else {
    delete notes[normalizedGameID];
  }
  practiceState.gameSummaryNotes = notes;
  addJournalEntry({
    gameID: normalizedGameID,
    action: "noteAdded",
    noteCategory: "general",
    noteDetail: "Game Note",
    note: value || "Cleared game note",
  });
  persistState();
  setStatus("Game note saved");
  render();
}

function gameSubviewTabsNode() {
  const tabs = document.createElement("div");
  tabs.className = "game-subview-tabs";
  tabs.setAttribute("aria-label", "Game workspace mode");
  for (const subview of GAME_SUBVIEWS) {
    tabs.append(segmentButton(subview.label, gameSubview === subview.id, () => {
      gameSubview = subview.id;
      localStorage.setItem(GAME_SUBVIEW_KEY, gameSubview);
      renderSummary();
      syncRouteToUrl();
    }));
  }
  return tabs;
}

function gameSubviewContentNode(snapshot) {
  const panel = document.createElement("div");
  panel.className = "game-subview-panel";
  switch (gameSubview) {
    case "input":
      panel.append(gameInputPanelNode(snapshot));
      break;
    case "study":
      panel.append(gameStudyPanelNode(snapshot));
      break;
    case "log":
      panel.append(gameLogPanelNode(snapshot));
      break;
    case "summary":
    default:
      panel.append(gameSummaryPanelNode(snapshot));
      break;
  }
  return panel;
}

function gameSummaryPanelNode(snapshot) {
  const panel = document.createElement("div");
  panel.className = "game-summary-panel";
  const activeGroup = snapshot.groups.find(groupIsActive) ?? snapshot.groups[0] ?? null;
  const progressSnapshot = activeGroup ? groupProgressSnapshot(snapshot.gameID, activeGroup) : null;

  if (activeGroup && progressSnapshot) {
    const row = document.createElement("div");
    row.className = "game-progress-row";
    row.innerHTML = `
      ${groupProgressWheelMarkup(progressSnapshot.taskProgress, progressSnapshot.completionPercent)}
      <span class="snapshot-main">
        <span class="row-title">${escapeHtml(activeGroup.name || "Practice Group")}</span>
        <span class="row-meta">${escapeHtml(groupProgressSummary(progressSnapshot.taskProgress))}</span>
      </span>
    `;
    panel.append(row);
  }

  panel.append(
    gameSummaryDashboardNode(snapshot, progressSnapshot),
    gameStatsGridNode(snapshot)
  );
  return panel;
}

function gameSummaryDashboardNode(snapshot, progressSnapshot) {
  const dashboard = document.createElement("div");
  dashboard.className = "game-summary-dashboard";
  dashboard.append(
    gameGuidancePanelNode(snapshot, progressSnapshot),
    scoreOverviewPanelNode(snapshot)
  );
  return dashboard;
}

function gameGuidancePanelNode(snapshot, progressSnapshot) {
  const panel = document.createElement("section");
  panel.className = "game-summary-card game-guidance-panel";
  const heading = document.createElement("h3");
  heading.textContent = "Practice Plan";
  panel.append(
    heading,
    gameGuidanceBlockNode("Next Action", nextGameAction(snapshot, progressSnapshot)),
    gameGuidanceBlockNode("Alerts", gameAlertText(snapshot, progressSnapshot)),
    gameGuidanceBlockNode("Consistency", gameConsistencyText(snapshot))
  );
  return panel;
}

function gameGuidanceBlockNode(title, text) {
  const block = document.createElement("div");
  block.className = "game-guidance-block";
  block.innerHTML = `
    <span class="row-title">${escapeHtml(title)}</span>
    <span class="row-meta">${escapeHtml(text)}</span>
  `;
  return block;
}

function scoreOverviewPanelNode(snapshot) {
  const panel = document.createElement("section");
  panel.className = "game-summary-card game-score-panel";
  const stats = scoreStatsForSnapshot(snapshot);
  const latest = snapshot.scoreEntries[0];

  const heading = document.createElement("div");
  heading.className = "game-score-heading";
  heading.innerHTML = `
    <h3>Score Summary</h3>
    <p class="row-meta">${escapeHtml(stats ? `${stats.count} score${stats.count === 1 ? "" : "s"} logged` : "No scores logged yet")}</p>
  `;
  panel.append(heading);

  if (!stats) {
    panel.append(emptyNode("Log scores to unlock trends and consistency analytics."));
    return panel;
  }

  const hero = document.createElement("div");
  hero.className = "game-score-hero";
  hero.innerHTML = `
    <span>High Score</span>
    <strong>${escapeHtml(formatScore(stats.high))}</strong>
    <em>${escapeHtml(latest ? `Latest ${formatScore(latest.score)} - ${formatDate(latest.timestamp)}` : "No recent score")}</em>
  `;

  const grid = document.createElement("div");
  grid.className = "score-summary-grid";
  grid.append(
    scoreSummaryTileNode("Median", formatScore(stats.median), "Middle result", "median"),
    scoreSummaryTileNode("Mean", formatScore(stats.mean), "Average", "mean"),
    scoreSummaryTileNode("Floor", formatScore(stats.low), "Lowest saved", "floor"),
    scoreSummaryTileNode("Range", formatScore(stats.range), "High minus floor", "range"),
    scoreSummaryTileNode("St Dev", formatScore(stats.stdev), "Spread", "stdev")
  );

  panel.append(hero, grid);
  return panel;
}

function scoreSummaryTileNode(label, value, detail, tone = "") {
  const tile = document.createElement("div");
  tile.className = `score-summary-tile${tone ? ` is-${tone}` : ""}`;
  tile.innerHTML = `
    <span>${escapeHtml(label)}</span>
    <strong>${escapeHtml(value || "-")}</strong>
    <em>${escapeHtml(detail || "")}</em>
  `;
  return tile;
}

function gameStatsGridNode(snapshot) {
  const grid = document.createElement("div");
  grid.className = "game-support-grid";
  grid.append(
    gameSectionNode("Target Scores", targetBreakdownNode(snapshot)),
    gameSectionNode("Recent Scores", scoreHistoryNode(snapshot))
  );
  return grid;
}

function scoreStatsNode(snapshot) {
  const list = document.createElement("div");
  list.className = "metric-tile-grid";
  const stats = scoreStatsForSnapshot(snapshot);
  if (!stats) {
    list.append(emptyNode("Log scores to unlock."));
    return list;
  }
  list.append(
    metricTileNode("High", formatScore(stats.high), "high"),
    metricTileNode("Low", formatScore(stats.low), "low"),
    metricTileNode("Mean", formatScore(stats.mean), "mean"),
    metricTileNode("Median", formatScore(stats.median), "median"),
    metricTileNode("St Dev", formatScore(stats.stdev), "stdev")
  );
  return list;
}

function scoreStatsForSnapshot(snapshot) {
  const values = snapshot.scoreEntries
    .map((entry) => Number(entry.score))
    .filter((value) => Number.isFinite(value) && value > 0)
    .sort((a, b) => a - b);
  if (!values.length) return null;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const median = percentile(values, 0.5);
  const variance = values.reduce((sum, value) => {
    const delta = value - mean;
    return sum + delta * delta;
  }, 0) / values.length;
  return {
    count: values.length,
    high: values[values.length - 1],
    low: values[0],
    mean,
    median,
    stdev: Math.sqrt(variance),
    range: values[values.length - 1] - values[0],
  };
}

function nextGameAction(snapshot, progressSnapshot) {
  if (progressSnapshot) {
    const missingTask = STUDY_TASKS.find((task) => (progressSnapshot.taskProgress[task.id] ?? 0) === 0);
    if (missingTask) return `Start with ${missingTask.label.toLowerCase()} for this game.`;
    if (progressSnapshot.isStale) {
      return progressSnapshot.staleDays == null
        ? "Log a practice session for this game."
        : `Refresh practice - last update was ${progressSnapshot.staleDays} days ago.`;
    }
  }
  if (!snapshot.scoreEntries.length) return "Add a fresh score to start tracking trends.";
  return "Continue practice and add a fresh score to track trend changes.";
}

function gameAlertText(snapshot, progressSnapshot) {
  const alerts = progressSnapshot?.focusReasons ?? [];
  if (alerts.length) return alerts.join(" - ");
  if (!snapshot.scoreEntries.length) return "No scores logged yet.";
  return "No immediate alerts for this game.";
}

function gameConsistencyText(snapshot) {
  const summary = scoreSummaryForGame(snapshot.gameID);
  if (!summary || summary.median <= 0) return "Log more scores to unlock floor and variance guidance.";
  const spreadRatio = (summary.p75 - summary.floor) / summary.median;
  if (spreadRatio >= 0.6) return "High variance: raise floor through repeatable safe scoring paths.";
  return "Stable spread: keep pressure on median improvements.";
}

function gameInputPanelNode(snapshot) {
  ensureGameInputActivity();
  const panel = document.createElement("div");
  panel.className = "game-input-panel";

  const layout = document.createElement("div");
  layout.className = "game-input-layout";

  const taskPanel = document.createElement("section");
  taskPanel.className = "game-input-task-panel";
  const taskHeader = document.createElement("div");
  taskHeader.className = "game-input-task-header";
  taskHeader.innerHTML = `
    <span class="row-title">Task</span>
    <span class="context-chip">${escapeHtml(entryActivityLabel(entryActivity))}</span>
  `;
  const grid = document.createElement("div");
  grid.className = "game-input-grid";
  for (const shortcut of GAME_INPUT_SHORTCUTS) {
    grid.append(gameInputShortcutNode(shortcut.label, shortcut.icon, shortcut.activity, snapshot));
  }
  taskPanel.append(taskHeader, grid);

  const formPanel = document.createElement("div");
  formPanel.className = "game-input-form-panel";
  formPanel.append(
    gameInputStatusNode(snapshot),
    entryFormNode({
      inline: true,
      subtitle: gameInputFormSubtitle(snapshot),
      submitLabel: `Save ${entryActivityLabel(entryActivity)}`,
    }),
    gameInputRecentNode(snapshot)
  );

  layout.append(taskPanel, formPanel);
  panel.append(layout);
  return panel;
}

function ensureGameInputActivity() {
  if (GAME_INPUT_ACTIVITY_IDS.has(entryActivity)) return;
  entryActivity = "score";
  localStorage.setItem(ENTRY_ACTIVITY_KEY, entryActivity);
}

function gameInputShortcutNode(label, icon, activity, snapshot) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "game-input-shortcut";
  button.setAttribute("aria-label", label);
  button.setAttribute("aria-pressed", String(entryActivity === activity));
  button.innerHTML = `
    <span class="home-action-icon" aria-hidden="true">${homeActionIconSvg(icon)}</span>
    <span class="game-input-shortcut-copy">
      <strong>${escapeHtml(label)}</strong>
      <em>${escapeHtml(gameInputShortcutMeta(snapshot, activity))}</em>
    </span>
  `;
  button.addEventListener("click", () => {
    if (ENTRY_ACTIVITY_IDS.has(activity)) {
      entryActivity = activity;
      localStorage.setItem(ENTRY_ACTIVITY_KEY, entryActivity);
    }
    renderSummary();
  });
  return button;
}

function gameInputShortcutMeta(snapshot, activity) {
  switch (activity) {
    case "score":
      return snapshot.scoreEntries.length ? `${snapshot.scoreEntries.length} saved` : "No scores";
    case "rulesheet":
      return `${latestTaskProgress(snapshot.gameID, "rulesheet", null)}%`;
    case "tutorialVideo":
      return `${latestTaskProgress(snapshot.gameID, "tutorialVideo", null)}%`;
    case "gameplayVideo":
      return `${latestTaskProgress(snapshot.gameID, "gameplayVideo", null)}%`;
    case "playfield":
      return latestTaskProgress(snapshot.gameID, "playfield", null) ? "Viewed" : "Not viewed";
    case "practice":
      return `${gameJournalActionCount(snapshot, "practiceSession")} sessions`;
    default:
      return "";
  }
}

function gameInputStatusNode(snapshot) {
  const status = document.createElement("div");
  status.className = "game-input-status";
  for (const item of gameInputStatusItems(snapshot, entryActivity)) {
    status.append(gameInputStatusTileNode(item.label, item.value));
  }
  return status;
}

function gameInputStatusTileNode(label, value) {
  const tile = document.createElement("div");
  tile.className = "game-input-status-tile";
  tile.innerHTML = `
    <span>${escapeHtml(label)}</span>
    <strong>${escapeHtml(value || "-")}</strong>
  `;
  return tile;
}

function gameInputRecentNode(snapshot) {
  const action = journalActionForEntryActivity(entryActivity);
  const label = entryActivityLabel(entryActivity);
  const entries = snapshot.journalEntries
    .filter((entry) => !action || entry.action === action)
    .slice(0, 4);

  const section = document.createElement("section");
  section.className = "game-input-recent-panel";
  const header = document.createElement("div");
  header.className = "entry-card-header";
  header.innerHTML = `
    <div>
      <h3>Recent</h3>
      <p class="row-meta">${escapeHtml(label)} · ${escapeHtml(snapshot.game?.name ?? snapshot.gameID)}</p>
    </div>
  `;

  const list = document.createElement("div");
  list.className = "data-list game-input-recent-list";
  if (!entries.length) {
    list.append(emptyNode(`No ${label.toLowerCase()} entries yet.`));
  } else {
    for (const entry of entries) {
      list.append(dataRowNode(journalSummary(entry), formatDate(entry.timestamp)));
    }
  }
  section.append(header, list);
  return section;
}

function gameInputStatusItems(snapshot, activity) {
  const lastTask = (task) => {
    const timestamp = taskLastTimestamp(snapshot.gameID, task, null);
    return timestamp ? formatDate(timestamp) : "-";
  };
  switch (activity) {
    case "score":
      return [
        { label: "High", value: snapshot.highScore ? formatScore(snapshot.highScore) : "-" },
        { label: "Latest", value: snapshot.scoreEntries[0] ? formatScore(snapshot.scoreEntries[0].score) : "-" },
        { label: "Rows", value: String(snapshot.scoreEntries.length) },
      ];
    case "rulesheet":
      return [
        { label: "Progress", value: `${latestTaskProgress(snapshot.gameID, "rulesheet", null)}%` },
        { label: "Resume", value: resumeOffsetLabel(snapshot.gameID) },
        { label: "Last", value: lastTask("rulesheet") },
      ];
    case "tutorialVideo":
      return videoInputStatusItems(snapshot, "tutorialVideo", "Tutorial");
    case "gameplayVideo":
      return videoInputStatusItems(snapshot, "gameplayVideo", "Gameplay");
    case "playfield":
      return [
        { label: "Status", value: latestTaskProgress(snapshot.gameID, "playfield", null) ? "Viewed" : "Not viewed" },
        { label: "Assets", value: String(snapshot.resources.playfields.length) },
        { label: "Last", value: lastTask("playfield") },
      ];
    case "practice":
      return [
        { label: "Sessions", value: String(gameJournalActionCount(snapshot, "practiceSession")) },
        { label: "Last", value: lastTask("practice") },
        { label: "Group", value: gameInputFormSubtitle(snapshot) },
      ];
    default:
      return [
        { label: "Activity", value: entryActivityLabel(activity) },
        { label: "Last", value: snapshot.lastActivity ? formatDate(snapshot.lastActivity) : "-" },
      ];
  }
}

function videoInputStatusItems(snapshot, activity, label) {
  const latest = latestVideoProgressForTask(snapshot, activity);
  const timestamp = latest
    ? Math.max(
      timestampValue(latest.journal?.timestamp),
      timestampValue(latest.study?.timestamp),
      timestampValue(latest.video?.timestamp)
    )
    : taskLastTimestamp(snapshot.gameID, activity, null);
  return [
    { label, value: `${latestTaskProgress(snapshot.gameID, activity, null)}%` },
    { label: "Resume", value: latestVideoProgressLabel(latest, label) },
    { label: "Last", value: timestamp ? formatDate(timestamp) : "-" },
  ];
}

function latestVideoProgressForTask(snapshot, activity) {
  const action = actionForStudyTask(activity);
  const latestJournal = snapshot.journalEntries.find((entry) => entry.task === activity || entry.action === action) ?? null;
  const latestStudy = snapshot.studyEvents.find((entry) => entry.task === activity) ?? null;
  const journalTime = timestampValue(latestJournal?.timestamp);
  const studyTime = timestampValue(latestStudy?.timestamp);
  const journalVideo = latestJournal
    ? snapshot.videoProgressEntries.find((entry) => {
      if (journalTime > 0 && !timestampsAreClose(entry.timestamp, journalTime)) return false;
      const expectedKind = normalizedString(latestJournal.videoKind);
      const expectedValue = normalizedString(latestJournal.videoValue);
      if (expectedKind && normalizedString(entry.kind) !== expectedKind) return false;
      if (expectedValue && normalizedString(entry.value) !== expectedValue) return false;
      return true;
    })
    : null;
  const studyVideo = latestStudy
    ? snapshot.videoProgressEntries.find((entry) => studyTime > 0 && timestampsAreClose(entry.timestamp, studyTime))
    : null;
  if (!latestJournal && !latestStudy && !journalVideo && !studyVideo) return null;
  return {
    journal: latestJournal,
    study: latestStudy,
    video: journalVideo ?? studyVideo ?? null,
  };
}

function timestampsAreClose(timestamp, targetValue) {
  const value = timestampValue(timestamp);
  return value > 0 && Math.abs(value - targetValue) <= 1000;
}

function latestVideoProgressLabel(latest, label) {
  if (latest?.journal?.videoValue) {
    return `${normalizedString(latest.journal.videoKind) || "video"} · ${latest.journal.videoValue}`;
  }
  if (latest?.video) return videoProgressLabel(latest.video);
  return `No ${label.toLowerCase()} progress`;
}

function gameJournalActionCount(snapshot, action) {
  return snapshot.journalEntries.filter((entry) => entry.action === action).length;
}

function gameInputFormSubtitle(snapshot) {
  const activeGroup = snapshot.groups.find(groupIsActive) ?? snapshot.groups[0] ?? null;
  return activeGroup ? activeGroup.name || "Practice Group" : "No active group";
}

function gameStudyPanelNode(snapshot) {
  const panel = document.createElement("div");
  panel.className = "game-study-panel";

  const resourcePanel = document.createElement("section");
  resourcePanel.className = "game-study-resource-panel";
  resourcePanel.append(
    gameStudyHeaderNode(snapshot),
    studyResourcesNode(snapshot),
    studyProgressGridNode(snapshot)
  );

  const videoPanel = document.createElement("section");
  videoPanel.className = "game-study-video-panel";
  const videoHeading = document.createElement("h3");
  videoHeading.textContent = "Videos";
  videoPanel.append(videoHeading, videoPanelNode(snapshot));

  panel.append(resourcePanel, videoPanel);
  return panel;
}

function gameLogPanelNode(snapshot) {
  const panel = document.createElement("div");
  panel.className = "game-log-panel";
  panel.append(gameLogSummaryNode(snapshot), recentActivityNode(snapshot));
  return panel;
}

function gameStudyHeaderNode(snapshot) {
  const header = document.createElement("div");
  header.className = "game-study-header";
  header.innerHTML = `
    <div>
      <h3>Study Resources</h3>
      <p class="row-meta">${escapeHtml(gameMeta(snapshot.gameID, snapshot.game) || "Practice resources")}</p>
    </div>
    <span class="game-study-coverage-chip">${escapeHtml(resourceCoverageLabel(snapshot.resources))}</span>
  `;
  return header;
}

function studyProgressGridNode(snapshot) {
  const grid = document.createElement("div");
  grid.className = "study-progress-grid";
  for (const task of STUDY_TASKS) {
    const progress = latestTaskProgress(snapshot.gameID, task.id, null);
    const timestamp = taskLastTimestamp(snapshot.gameID, task.id, null);
    grid.append(studyProgressTileNode(task.label, `${progress}%`, timestamp ? formatDate(timestamp) : "Not logged"));
  }
  return grid;
}

function studyProgressTileNode(label, value, detail) {
  const tile = document.createElement("div");
  tile.className = "study-progress-tile";
  tile.innerHTML = `
    <span>${escapeHtml(label)}</span>
    <strong>${escapeHtml(value)}</strong>
    <em>${escapeHtml(detail)}</em>
  `;
  return tile;
}

function gameLogSummaryNode(snapshot) {
  const summary = document.createElement("div");
  summary.className = "game-log-summary";
  const studyCount = snapshot.journalEntries.filter((entry) => [
    "rulesheetRead",
    "tutorialWatch",
    "gameplayWatch",
    "playfieldViewed",
  ].includes(entry.action)).length;
  summary.append(
    gameLogSummaryTileNode("Entries", String(snapshot.journalEntries.length)),
    gameLogSummaryTileNode("Scores", String(snapshot.scoreEntries.length)),
    gameLogSummaryTileNode("Study", String(studyCount)),
    gameLogSummaryTileNode("Notes", String(snapshot.noteEntries.length))
  );
  return summary;
}

function gameLogSummaryTileNode(label, value) {
  const tile = document.createElement("div");
  tile.className = "game-log-summary-tile";
  tile.innerHTML = `
    <span>${escapeHtml(label)}</span>
    <strong>${escapeHtml(value)}</strong>
  `;
  return tile;
}

function gameSectionNode(title, content) {
  const section = document.createElement("section");
  section.className = "game-section";
  const heading = document.createElement("h3");
  heading.textContent = title;
  section.append(heading, content);
  return section;
}

function libraryResourceRow(title, nodes) {
  const row = document.createElement("div");
  row.className = "library-resource-row";
  const label = document.createElement("span");
  label.className = "library-resource-label";
  label.textContent = `${title}:`;
  const rail = document.createElement("div");
  rail.className = "library-resource-rail";
  if (nodes.length) {
    rail.append(...nodes);
  } else {
    rail.append(unavailableChip());
  }
  row.append(label, rail);
  return row;
}

function ruleSheetResourceChips(resources) {
  return resources.rulesheets.slice(0, 5).map((item) => resourceChipNode(
    shortProviderLabel(item.provider, item.label, "Rulesheet"),
    item.localPath || item.url || item.sourceUrl
  ));
}

function playfieldResourceChips(resources) {
  return resources.playfields.slice(0, 3).map((item) => resourceChipNode(
    playfieldChipLabel(item),
    item.playfieldLocalPath || item.playfieldSourceUrl
  ));
}

function backglassResourceChips(resources) {
  return resources.backglasses.slice(0, 2).map((item) => resourceChipNode(
    "Backglass",
    item.backglassLocalPath || item.backglassSourceUrl
  ));
}

function studyResourceChips(resources) {
  return [
    ...resources.gameinfo.slice(0, 3).map((item) => resourceChipNode("Game Info", item.localPath)),
    ...ruleSheetResourceChips(resources),
    ...backglassResourceChips(resources),
    ...playfieldResourceChips(resources),
  ];
}

function chipNode(label) {
  const chip = document.createElement("span");
  chip.className = "library-resource-chip";
  chip.textContent = label;
  return chip;
}

function unavailableChip() {
  const chip = chipNode("Unavailable");
  chip.classList.add("is-muted");
  return chip;
}

function resourceChipNode(label, url) {
  const href = normalizedString(url);
  if (!href) return unavailableChip();
  const chip = document.createElement("a");
  chip.className = "library-resource-chip";
  chip.href = href;
  chip.target = "_blank";
  chip.rel = "noreferrer";
  chip.textContent = label;
  return chip;
}

function resourceActionChipNode(label, onClick) {
  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = "library-resource-chip library-resource-chip-button";
  chip.textContent = label;
  chip.addEventListener("click", onClick);
  return chip;
}

function ruleSheetActionChips(snapshot) {
  return snapshot.resources.rulesheets.slice(0, 5).map((item) => resourceActionChipNode(
    shortProviderLabel(item.provider, item.label, "Rulesheet"),
    () => openRulesheetResource(snapshot, item)
  ));
}

function playfieldActionChips(snapshot) {
  return snapshot.resources.playfields.slice(0, 3).map((item) => resourceActionChipNode(
    playfieldChipLabel(item),
    () => openPlayfieldResource(snapshot, item)
  ));
}

function openRulesheetResource(snapshot, item) {
  selectedGameID = snapshot.gameID;
  selectedRulesheetResource = { ...normalizeRulesheetResource(item), gameID: snapshot.gameID };
  activeRoute = "rulesheet";
  localStorage.setItem(SELECTED_GAME_KEY, selectedGameID);
  localStorage.setItem(ACTIVE_ROUTE_KEY, activeRoute);
  render();
}

function openPlayfieldResource(snapshot, item) {
  selectedGameID = snapshot.gameID;
  selectedPlayfieldResource = { ...normalizePlayfieldResource(item), gameID: snapshot.gameID };
  activeRoute = "playfield";
  localStorage.setItem(SELECTED_GAME_KEY, selectedGameID);
  localStorage.setItem(ACTIVE_ROUTE_KEY, activeRoute);
  render();
}

function normalizeRulesheetResource(item) {
  return {
    kind: "rulesheet",
    label: shortProviderLabel(item?.provider, item?.label, "Rulesheet"),
    title: normalizedString(item?.label) || "Rulesheet",
    url: normalizedString(item?.localPath || item?.url || item?.sourceUrl),
    provider: normalizedString(item?.provider),
    note: normalizedString(item?.note),
  };
}

function normalizePlayfieldResource(item) {
  return {
    kind: "playfield",
    label: playfieldChipLabel(item ?? {}),
    title: normalizedString(item?.playfieldSourceNote) || "Playfield",
    url: normalizedString(item?.playfieldLocalPath || item?.playfieldSourceUrl),
    sourceUrl: normalizedString(item?.playfieldSourceUrl),
    note: normalizedString(item?.playfieldSourceNote),
  };
}

function firstRulesheetResource(snapshot) {
  const item = snapshot?.resources?.rulesheets?.[0];
  return item ? normalizeRulesheetResource(item) : null;
}

function firstPlayfieldResource(snapshot) {
  const item = snapshot?.resources?.playfields?.[0];
  return item ? normalizePlayfieldResource(item) : null;
}

function shortProviderLabel(provider, label, fallback) {
  switch (normalizedString(provider).toLowerCase()) {
    case "tf": return "TF";
    case "pp": return "PP";
    case "papa": return "PAPA";
    case "bob": return "Bob";
    case "pinprof":
    case "local":
      return "PinProf";
    default:
      return normalizedString(label).replace(/^Rulesheet\s*/i, "").replace(/[()]/g, "").trim() || fallback;
  }
}

function playfieldChipLabel(item) {
  const note = normalizedString(item.playfieldSourceNote);
  if (note.toLowerCase().includes("manufacturer")) return "Manufacturer";
  if (note.toLowerCase().includes("opdb")) return "OPDB";
  return "Playfield";
}

function youtubeId(url) {
  const href = normalizedString(url);
  if (!href) return "";
  try {
    const parsed = new URL(href, window.location.origin);
    if (parsed.hostname.includes("youtu.be")) return parsed.pathname.replace("/", "");
    if (parsed.hostname.includes("youtube.com")) return parsed.searchParams.get("v") || "";
  } catch {
    return "";
  }
  return "";
}

function scoreHistoryNode(snapshot) {
  const list = document.createElement("div");
  list.className = "data-list";
  if (!snapshot.scoreEntries.length) {
    list.append(emptyNode("No scores logged for this game."));
    return list;
  }
  for (const entry of snapshot.scoreEntries.slice(0, 10)) {
    list.append(dataRowNode(
      formatScore(entry.score),
      [
        scoreContextLabel(entry),
        entry.leagueImported ? "Imported" : "",
        formatDate(entry.timestamp),
      ].filter(Boolean).join(" · ")
    ));
  }
  return list;
}

function targetBreakdownNode(snapshot) {
  const list = document.createElement("div");
  list.className = "metric-tile-grid";
  if (!snapshot.target) {
    list.append(emptyNode("No league targets mapped for this game."));
    return list;
  }
  const targetRows = [
    ["2nd", snapshot.target.second_highest_avg, "great"],
    ["4th", snapshot.target.fourth_highest_avg, "main"],
    ["8th", snapshot.target.eighth_highest_avg, "floor"],
  ];
  for (const [label, value, tone] of targetRows) {
    list.append(metricTileNode(
      label,
      formatScore(value),
      tone,
      snapshot.highScore ? targetDeltaLabel(snapshot.highScore, value) : ""
    ));
  }
  list.append(metricTileNode("Location", targetLocationLabel(snapshot.target), "location"));
  return list;
}

function metricTileNode(label, value, tone = "", detail = "") {
  const tile = document.createElement("div");
  tile.className = `metric-tile${tone ? ` is-${tone}` : ""}`;
  tile.innerHTML = `
    <span>${escapeHtml(label)}</span>
    <strong>${escapeHtml(value || "-")}</strong>
    ${detail ? `<em>${escapeHtml(detail)}</em>` : ""}
  `;
  return tile;
}

function videoPanelNode(snapshot) {
  const videos = snapshot.resources.videos
    .map((item) => ({
      id: youtubeId(item.url),
      label: normalizedString(item.label) || normalizedString(item.kind) || "Video",
      kind: normalizedString(item.kind) || "video",
      url: normalizedString(item.url),
    }))
    .filter((item) => item.id || item.url);
  const panel = document.createElement("div");
  panel.className = "video-panel";
  if (!videos.length) {
    panel.append(emptyNode("No videos listed."));
    return panel;
  }

  const launch = document.createElement("div");
  launch.className = "video-launch-panel";
  const embed = document.createElement("div");
  embed.className = "video-embed";
  const iframe = document.createElement("iframe");
  iframe.title = "Practice video";
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
  iframe.allowFullscreen = true;
  embed.append(iframe);

  const launchMeta = document.createElement("div");
  launchMeta.className = "video-launch-meta";
  const selectedLabel = document.createElement("div");
  selectedLabel.className = "video-launch-copy";
  const openLink = document.createElement("a");
  openLink.className = "library-resource-chip video-open-link";
  openLink.target = "_blank";
  openLink.rel = "noreferrer";
  openLink.textContent = "Open Video";
  launchMeta.append(selectedLabel, openLink);
  launch.append(embed, launchMeta);
  panel.append(launch);

  const thumbButtons = [];
  const setActiveVideo = (video) => {
    const videoKey = video.id || video.url;
    activeVideoByGame[snapshot.gameID] = videoKey;
    saveActiveVideoState();
    if (video.id) {
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.id)}`;
      iframe.hidden = false;
    } else {
      iframe.removeAttribute("src");
      iframe.hidden = true;
    }
    selectedLabel.innerHTML = `
      <span class="row-title">${escapeHtml(video.label)}</span>
      <span class="row-meta">${escapeHtml(video.kind)}</span>
    `;
    openLink.href = video.url || `https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}`;
    openLink.hidden = !openLink.href;
    for (const item of thumbButtons) {
      const isSelected = (item.video.id || item.video.url) === videoKey;
      item.button.setAttribute("aria-pressed", String(isSelected));
    }
  };

  const thumbs = document.createElement("div");
  thumbs.className = "video-thumb-grid";
  for (const video of videos.slice(0, 8)) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "video-thumb";
    button.setAttribute("aria-pressed", "false");
    button.innerHTML = `
      ${video.id ? `<img src="https://img.youtube.com/vi/${escapeAttribute(video.id)}/hqdefault.jpg" alt="">` : ""}
      <span class="row-title">${escapeHtml(video.label)}</span>
      <span class="row-meta">${escapeHtml(video.kind)}</span>
    `;
    button.addEventListener("click", () => setActiveVideo(video));
    thumbButtons.push({ button, video });
    thumbs.append(button);
  }
  panel.append(thumbs);
  const activeKey = normalizedString(activeVideoByGame[snapshot.gameID]);
  const activeVideo = videos.find((video) => (video.id || video.url) === activeKey) ?? videos[0];
  setActiveVideo(activeVideo);
  return panel;
}

function studyStateNode(snapshot) {
  const list = document.createElement("div");
  list.className = "data-list";
  const latestStudy = snapshot.studyEvents[0];
  const latestVideo = snapshot.videoProgressEntries[0];
  list.append(
    dataRowNode("Assets", resourceCoverageLabel(snapshot.resources)),
    dataRowNode("Rulesheet", latestStudy ? studyProgressLabel(latestStudy) : resumeOffsetLabel(snapshot.gameID)),
    dataRowNode("Video", latestVideo ? videoProgressLabel(latestVideo) : videoResumeLabel(snapshot.gameID)),
    dataRowNode("Notes", `${snapshot.noteEntries.length} note entries`)
  );
  return list;
}

function studyResourcesNode(snapshot) {
  const list = document.createElement("div");
  list.className = "study-resource-panel";
  list.append(
    libraryResourceRow("Game Info", snapshot.resources.gameinfo.slice(0, 3).map((item) => resourceChipNode("PinProf", item.localPath))),
    libraryResourceRow("Rulesheet", ruleSheetActionChips(snapshot)),
    libraryResourceRow("Backglass", backglassResourceChips(snapshot.resources)),
    libraryResourceRow("Playfield", playfieldActionChips(snapshot)),
    libraryResourceRow("Practice", [
      chipNode(studyStateLabel(snapshot)),
      chipNode(resumeOffsetLabel(snapshot.gameID)),
      chipNode(videoResumeLabel(snapshot.gameID)),
    ])
  );
  return list;
}

function targetActivityNode(snapshot) {
  const list = document.createElement("div");
  list.className = "data-list";
  if (snapshot.target) {
    const targetRows = [
      ["2nd", snapshot.target.second_highest_avg],
      ["4th", snapshot.target.fourth_highest_avg],
      ["8th", snapshot.target.eighth_highest_avg],
    ];
    for (const [label, value] of targetRows) {
      list.append(dataRowNode(
        `${label} target ${formatScore(value)}`,
        snapshot.highScore ? targetDeltaLabel(snapshot.highScore, value) : targetLocationLabel(snapshot.target)
      ));
    }
  } else {
    list.append(emptyNode("No league targets mapped for this game."));
  }
  for (const entry of snapshot.journalEntries.slice(0, 4)) {
    list.append(dataRowNode(journalSummary(entry), formatDate(entry.timestamp)));
  }
  return list;
}

function studyStateLabel(snapshot) {
  const total = snapshot.studyEvents.length + snapshot.videoProgressEntries.length;
  if (!total) return "No study logs";
  return `${total} study log${total === 1 ? "" : "s"}`;
}

function recentActivityNode(snapshot) {
  const list = document.createElement("div");
  list.className = "data-list game-log-list";
  if (!snapshot.journalEntries.length) {
    list.append(emptyNode("No recent activity for this game."));
    return list;
  }
  for (const entry of snapshot.journalEntries.slice(0, 8)) {
    const entryID = normalizedString(entry.id);
    const item = document.createElement("div");
    item.className = "game-log-item";
    item.dataset.action = normalizedString(entry.action);
    const icon = document.createElement("span");
    icon.className = "game-log-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = homeActionIconSvg(journalActionIconName(entry.action));
    const row = document.createElement("button");
    row.type = "button";
    row.className = "game-log-row";
    row.innerHTML = `
      <span class="row-kicker">${escapeHtml(journalActionLabel(entry.action))}</span>
      <span class="row-title">${escapeHtml(journalSummary(entry))}</span>
      <span class="row-meta">${escapeHtml(formatDate(entry.timestamp))}${journalActionSupportsEditing(entry.action) ? " · Editable" : " · Read only"}</span>
    `;
    row.addEventListener("click", () => {
      selectedJournalEntryID = entryID;
      activeRoute = "journal";
      localStorage.setItem(SELECTED_JOURNAL_KEY, selectedJournalEntryID);
      localStorage.setItem(ACTIVE_ROUTE_KEY, activeRoute);
      render();
    });

    item.append(icon, row);
    if (journalActionSupportsEditing(entry.action)) {
      const actions = document.createElement("div");
      actions.className = "game-log-actions";
      const editButton = dashboardIconButton("pencil", "Edit journal entry", () => {
        selectedJournalEntryID = entryID;
        activeRoute = "journal";
        localStorage.setItem(SELECTED_JOURNAL_KEY, selectedJournalEntryID);
        localStorage.setItem(ACTIVE_ROUTE_KEY, activeRoute);
        render();
      });

      const deleteButton = dashboardIconButton("trash", "Delete journal entry", () => {
        deleteJournalEntry(entryID);
      }, false, true);
      actions.append(editButton, deleteButton);
      item.append(actions);
    }
    list.append(item);
  }
  return list;
}

function dataRowNode(title, meta) {
  const row = document.createElement("div");
  row.className = "data-row";
  row.innerHTML = `
    <span class="row-title">${escapeHtml(title)}</span>
    <span class="row-meta">${escapeHtml(meta || "-")}</span>
  `;
  return row;
}

function renderStudy() {
  dom.studyContent.replaceChildren();
  if (!selectedGameID) {
    dom.studyContent.append(emptyNode("No game selected."));
    return;
  }
  const resources = catalog.resourcesByPracticeId.get(selectedGameID) ?? emptyResources();
  const imageStrip = primaryImagePreviewStrip(gameSnapshot(selectedGameID));
  if (imageStrip) {
    dom.studyContent.append(imageStrip);
  }
  const rows = [];
  for (const item of resources.gameinfo.slice(0, 3)) {
    rows.push(resourceRow("Game Info", item.label, item.localPath));
  }
  for (const item of resources.rulesheets.slice(0, 4)) {
    rows.push(resourceRow("Rulesheet", item.label, item.localPath || item.url || item.sourceUrl));
  }
  for (const item of resources.playfields.slice(0, 2)) {
    rows.push(resourceRow("Playfield", item.playfieldSourceNote || "Playfield image", item.playfieldLocalPath || item.playfieldSourceUrl));
  }
  for (const item of resources.videos.slice(0, 6)) {
    rows.push(resourceRow(item.kind || "Video", item.label, item.url));
  }
  if (!rows.length) {
    dom.studyContent.append(emptyNode("No study resources found for this game."));
    return;
  }
  dom.studyContent.append(...rows);
}

function renderRulesheet() {
  dom.rulesheetContent.replaceChildren();
  if (!selectedGameID) {
    dom.rulesheetContent.append(emptyNode("Select a game to open a rulesheet."));
    return;
  }
  const snapshot = gameSnapshot(selectedGameID);
  const selected = selectedRulesheetResource?.gameID === selectedGameID ? selectedRulesheetResource : null;
  const resource = selected ?? firstRulesheetResource(snapshot);
  if (!resource?.url) {
    dom.rulesheetContent.append(resourceEmptyViewNode("Rulesheet", "No rulesheet resource is mapped for this game."));
    return;
  }
  dom.rulesheetContent.append(resourceViewerNode("Rulesheet", snapshot, resource, "rulesheet"));
}

function renderPlayfield() {
  dom.playfieldContent.replaceChildren();
  if (!selectedGameID) {
    dom.playfieldContent.append(emptyNode("Select a game to open a playfield."));
    return;
  }
  const snapshot = gameSnapshot(selectedGameID);
  const selected = selectedPlayfieldResource?.gameID === selectedGameID ? selectedPlayfieldResource : null;
  const resource = selected ?? firstPlayfieldResource(snapshot);
  if (!resource?.url) {
    dom.playfieldContent.append(resourceEmptyViewNode("Playfield", "No playfield image is mapped for this game."));
    return;
  }
  dom.playfieldContent.append(resourceViewerNode("Playfield", snapshot, resource, "playfield"));
}

function resourceEmptyViewNode(title, message) {
  const section = document.createElement("section");
  section.className = "resource-viewer";
  section.append(
    resourceViewerHeaderNode(title, null),
    emptyNode(message)
  );
  return section;
}

function resourceViewerNode(title, snapshot, resource, mode) {
  const section = document.createElement("section");
  section.className = `resource-viewer is-${mode}`;
  section.append(resourceViewerHeaderNode(title, resource, snapshot));

  if (mode === "playfield") {
    const imageWrap = document.createElement("div");
    imageWrap.className = "playfield-viewer";
    imageWrap.innerHTML = `<img src="${escapeAttribute(resource.url)}" alt="${escapeAttribute(`${snapshot.game?.name ?? snapshot.gameID} playfield`)}">`;
    section.append(imageWrap);
    return section;
  }

  if (resourceIsInlinePreviewable(resource.url)) {
    const frame = document.createElement("iframe");
    frame.className = "resource-frame";
    frame.title = `${snapshot.game?.name ?? snapshot.gameID} rulesheet`;
    frame.src = resource.url;
    section.append(frame);
  } else {
    const card = document.createElement("div");
    card.className = "resource-external-card";
    card.innerHTML = `
      <span class="row-title">External rulesheet</span>
      <span class="row-meta">${escapeHtml(resource.url)}</span>
      <p class="panel-subtitle">This source opens outside the web app when the site does not allow embedded viewing.</p>
    `;
    section.append(card);
  }
  return section;
}

function resourceViewerHeaderNode(title, resource, snapshot = null) {
  const header = document.createElement("div");
  header.className = "resource-viewer-header";
  const copy = document.createElement("div");
  copy.innerHTML = `
    <h3>${escapeHtml(title)}</h3>
    <p class="row-meta">${escapeHtml([
      snapshot?.game?.name ?? snapshot?.gameID,
      resource?.title,
      resource?.label,
    ].filter(Boolean).join(" · ") || "Study resource")}</p>
  `;

  const actions = document.createElement("div");
  actions.className = "resource-viewer-actions";
  actions.append(dashboardActionButton("Back to Game", () => setActiveRoute("game")));
  if (resource?.url) {
    const open = document.createElement("a");
    open.className = "library-resource-chip";
    open.href = resource.url;
    open.target = "_blank";
    open.rel = "noreferrer";
    open.textContent = resource.kind === "playfield" ? "Open Image" : "Open Rulesheet";
    actions.append(open);
  }
  header.append(copy, actions);
  return header;
}

function resourceIsInlinePreviewable(url) {
  const href = normalizedString(url);
  if (!href) return false;
  if (href.startsWith("/") || href.startsWith("./") || href.startsWith("../")) return true;
  try {
    return new URL(href, window.location.href).origin === window.location.origin;
  } catch {
    return false;
  }
}

function renderJournal() {
  dom.journalContent.replaceChildren();
  const entries = journalEntriesForJournalView();
  pruneJournalSelection(entries);
  if (!entries.length) {
    selectedJournalEntryID = "";
    journalSelectionMode = false;
    selectedJournalEntryIDs.clear();
    localStorage.removeItem(SELECTED_JOURNAL_KEY);
    dom.journalContent.append(journalEmptyStateNode());
    return;
  }

  if (journalSelectionMode && !entries.some((entry) => journalActionSupportsEditing(entry.action))) {
    journalSelectionMode = false;
    selectedJournalEntryIDs.clear();
  }

  if (!entries.some((entry) => normalizedString(entry.id) === selectedJournalEntryID)) {
    selectedJournalEntryID = normalizedString(entries[0].id);
    localStorage.setItem(SELECTED_JOURNAL_KEY, selectedJournalEntryID);
  }

  const selectedEntry = entries.find((entry) => normalizedString(entry.id) === selectedJournalEntryID) ?? entries[0];
  const view = document.createElement("div");
  view.className = "journal-view";
  view.append(
    journalListPanelNode(entries),
    journalSelectionMode ? journalSelectionPanelNode(entries) : journalDetailPanelNode(selectedEntry)
  );
  dom.journalContent.append(view);
}

function journalEntriesForJournalView() {
  return filteredJournalEntries(practiceState.journalEntries, journalFilter)
    .sort((a, b) => timestampValue(b.timestamp) - timestampValue(a.timestamp))
    .slice(0, 200);
}

function journalEmptyStateNode() {
  const filterLabel = journalFilterLabel(journalFilter).toLowerCase();
  return emptyNode(`No ${filterLabel === "all" ? "" : `${filterLabel} `}journal events yet.`);
}

function filteredJournalEntries(entries, filter) {
  switch (filter) {
    case "study":
      return entries.filter((entry) => ["rulesheetRead", "tutorialWatch", "gameplayWatch", "playfieldViewed"].includes(entry.action));
    case "practice":
      return entries.filter((entry) => entry.action === "practiceSession");
    case "score":
      return entries.filter((entry) => entry.action === "scoreLogged");
    case "notes":
      return entries.filter((entry) => entry.action === "noteAdded");
    case "league":
      return entries.filter((entry) => entry.action === "scoreLogged"
        && (entry.scoreContext === "league" || normalizedString(entry.note).toLowerCase().includes("league import")));
    case "all":
    default:
      return [...entries];
  }
}

function journalFilterLabel(filterID) {
  return JOURNAL_FILTERS.find((filter) => filter.id === filterID)?.label ?? "All";
}

function journalListPanelNode(entries) {
  const section = document.createElement("section");
  section.className = "journal-list-panel";
  const header = document.createElement("div");
  header.className = "journal-list-header";
  const headerRow = document.createElement("div");
  headerRow.className = "journal-list-header-row";
  headerRow.innerHTML = `
    <div>
      <h3>Timeline</h3>
      <p class="row-meta">${entries.length} entr${entries.length === 1 ? "y" : "ies"} · ${escapeHtml(journalFilterLabel(journalFilter))}${journalSelectionMode ? ` · ${selectedJournalEntryIDs.size} selected` : ""}</p>
    </div>
  `;
  headerRow.append(journalSelectionActionsNode(entries));
  header.append(headerRow, journalFilterPickerNode());

  const list = document.createElement("div");
  list.className = "journal-list";
  for (const section of journalDaySections(entries)) {
    const group = document.createElement("section");
    group.className = "journal-day-section";
    const dayHeader = document.createElement("div");
    dayHeader.className = "journal-day-header";
    dayHeader.textContent = section.label;
    group.append(dayHeader);
    for (const entry of section.entries) {
      group.append(journalRowNode(entry));
    }
    list.append(group);
  }
  section.append(header, list);
  return section;
}

function journalSelectionActionsNode(entries) {
  const actions = document.createElement("div");
  actions.className = "journal-list-header-actions";
  const editableCount = entries.filter((entry) => journalActionSupportsEditing(entry.action)).length;

  if (!journalSelectionMode) {
    actions.append(dashboardActionButton("Select", () => {
      journalSelectionMode = true;
      selectedJournalEntryIDs.clear();
      renderJournal();
    }, editableCount === 0, false, editableCount === 0 ? "No editable journal entries in this view" : "Select journal entries"));
    return actions;
  }

  const deleteButton = dashboardActionButton(
    selectedJournalEntryIDs.size ? `Delete ${selectedJournalEntryIDs.size}` : "Delete",
    deleteSelectedJournalEntries,
    selectedJournalEntryIDs.size === 0,
    true,
    "Delete selected journal entries"
  );
  const doneButton = dashboardActionButton("Done", () => {
    journalSelectionMode = false;
    selectedJournalEntryIDs.clear();
    renderJournal();
  });
  actions.append(deleteButton, doneButton);
  return actions;
}

function journalFilterPickerNode() {
  const tabs = document.createElement("div");
  tabs.className = "journal-filter-tabs";
  tabs.setAttribute("aria-label", "Journal filter");
  for (const filter of JOURNAL_FILTERS) {
    tabs.append(segmentButton(filter.label, journalFilter === filter.id, () => {
      journalFilter = filter.id;
      localStorage.setItem(JOURNAL_FILTER_KEY, journalFilter);
      selectedJournalEntryID = "";
      selectedJournalEntryIDs.clear();
      journalSelectionMode = false;
      localStorage.removeItem(SELECTED_JOURNAL_KEY);
      renderJournal();
    }));
  }
  return tabs;
}

function journalDaySections(entries) {
  const sections = new Map();
  for (const entry of entries) {
    const key = journalDayKey(entry.timestamp);
    if (!sections.has(key.value)) {
      sections.set(key.value, { label: key.label, entries: [] });
    }
    sections.get(key.value).entries.push(entry);
  }
  return [...sections.values()];
}

function journalDayKey(timestamp) {
  const value = timestampValue(timestamp);
  if (!value) return { value: "unknown", label: "Unknown Date" };
  const date = new Date(value);
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return {
    value: day.toISOString(),
    label: day.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
  };
}

function journalRowNode(entry) {
  const entryID = normalizedString(entry.id);
  const isEditable = journalActionSupportsEditing(entry.action);
  const isSelectedForDelete = selectedJournalEntryIDs.has(entryID);
  const row = document.createElement("button");
  row.type = "button";
  row.className = "journal-row";
  if (journalSelectionMode) row.classList.add("is-selecting");
  if (journalSelectionMode && isSelectedForDelete) row.classList.add("is-selected");
  if (journalSelectionMode && !isEditable) row.classList.add("is-readonly");
  row.dataset.action = entry.action || "";
  row.setAttribute("aria-pressed", String(journalSelectionMode ? isSelectedForDelete : entryID === selectedJournalEntryID));
  if (journalSelectionMode && !isEditable) row.setAttribute("aria-disabled", "true");
  row.innerHTML = `
    ${journalSelectionMode ? `<span class="journal-row-select" aria-hidden="true">${isSelectedForDelete ? `<svg viewBox="0 0 24 24"><path d="m5 12 4 4 10-10"></path></svg>` : ""}</span>` : ""}
    <span class="journal-row-icon" aria-hidden="true">${homeActionIconSvg(journalActionIconName(entry.action))}</span>
    <span class="journal-row-copy">
      <span class="row-title">${escapeHtml(journalSummary(entry))}</span>
      <span class="row-meta">${escapeHtml(journalRowMeta(entry))}</span>
    </span>
  `;
  row.addEventListener("click", () => {
    if (journalSelectionMode) {
      if (!isEditable) {
        setStatus("This journal entry is read only.", true);
        return;
      }
      if (isSelectedForDelete) {
        selectedJournalEntryIDs.delete(entryID);
      } else {
        selectedJournalEntryIDs.add(entryID);
      }
      renderJournal();
      return;
    }
    selectedJournalEntryID = entryID;
    if (entry.gameID) {
      selectedGameID = entry.gameID;
      localStorage.setItem(SELECTED_GAME_KEY, selectedGameID);
    }
    localStorage.setItem(SELECTED_JOURNAL_KEY, selectedJournalEntryID);
    renderJournal();
  });
  return row;
}

function pruneJournalSelection(entries) {
  if (!selectedJournalEntryIDs.size) return;
  const visibleEditableIDs = new Set(entries
    .filter((entry) => journalActionSupportsEditing(entry.action))
    .map((entry) => normalizedString(entry.id)));
  selectedJournalEntryIDs = new Set([...selectedJournalEntryIDs].filter((entryID) => visibleEditableIDs.has(entryID)));
}

function journalRowMeta(entry) {
  const pieces = [
    formatTime(entry.timestamp),
    gameDisplayName(entry.gameID),
    journalActionLabel(entry.action),
  ].filter(Boolean);
  return pieces.join(" · ");
}

function journalSelectionPanelNode(entries) {
  const selectedEntries = entries.filter((entry) => selectedJournalEntryIDs.has(normalizedString(entry.id)));
  const editableCount = entries.filter((entry) => journalActionSupportsEditing(entry.action)).length;
  const section = document.createElement("section");
  section.className = "journal-detail-panel journal-selection-panel";

  const header = document.createElement("div");
  header.className = "journal-detail-header";
  header.innerHTML = `
    <div>
      <h3>Selected</h3>
      <p class="row-meta">${selectedEntries.length} of ${editableCount} editable entr${editableCount === 1 ? "y" : "ies"}</p>
    </div>
  `;
  const actions = document.createElement("div");
  actions.className = "journal-detail-actions";
  actions.append(
    dashboardActionButton(
      selectedEntries.length ? `Delete ${selectedEntries.length}` : "Delete",
      deleteSelectedJournalEntries,
      selectedEntries.length === 0,
      true,
      "Delete selected journal entries"
    ),
    dashboardActionButton("Done", () => {
      journalSelectionMode = false;
      selectedJournalEntryIDs.clear();
      renderJournal();
    })
  );
  header.append(actions);
  section.append(header);

  if (!selectedEntries.length) {
    section.append(emptyNode("Select entries from the timeline."));
    return section;
  }

  const timestamps = selectedEntries.map((entry) => timestampValue(entry.timestamp)).filter(Boolean).sort((a, b) => a - b);
  const gameCount = new Set(selectedEntries.map((entry) => normalizedString(entry.gameID)).filter(Boolean)).size;
  const list = document.createElement("div");
  list.className = "data-list";
  list.append(
    dataRowNode("Entries", String(selectedEntries.length)),
    dataRowNode("Games", String(gameCount)),
    dataRowNode("Oldest", timestamps.length ? formatDate(timestamps[0]) : "Unknown"),
    dataRowNode("Newest", timestamps.length ? formatDate(timestamps[timestamps.length - 1]) : "Unknown")
  );
  section.append(list, journalSelectionBreakdownNode(selectedEntries));
  return section;
}

function journalSelectionBreakdownNode(entries) {
  const wrap = document.createElement("div");
  wrap.className = "journal-selection-breakdown";
  const counts = new Map();
  for (const entry of entries) {
    const label = journalActionLabel(entry.action);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  for (const [label, count] of counts) {
    const chip = document.createElement("span");
    chip.className = "context-chip";
    chip.textContent = `${label}: ${count}`;
    wrap.append(chip);
  }
  return wrap;
}

function journalDetailPanelNode(entry) {
  const section = document.createElement("section");
  section.className = "journal-detail-panel";
  if (!entry) {
    section.append(emptyNode("Select an entry."));
    return section;
  }

  const canEdit = journalActionSupportsEditing(entry.action);
  const header = document.createElement("div");
  header.className = "journal-detail-header";
  header.innerHTML = `
    <div>
      <h3>${escapeHtml(journalActionLabel(entry.action))}</h3>
      <p class="row-meta">${escapeHtml(formatDate(entry.timestamp))}</p>
    </div>
  `;
  const detailActions = document.createElement("div");
  detailActions.className = "journal-detail-actions";
  const openGame = document.createElement("button");
  openGame.type = "button";
  openGame.className = "tiny-button";
  openGame.textContent = "Open Game";
  openGame.addEventListener("click", () => {
    selectedGameID = entry.gameID;
    activeRoute = "game";
    localStorage.setItem(SELECTED_GAME_KEY, selectedGameID);
    localStorage.setItem(ACTIVE_ROUTE_KEY, activeRoute);
    render();
  });
  detailActions.innerHTML = `<span class="context-chip${canEdit ? "" : " is-muted"}">${canEdit ? "Editable" : "Read only"}</span>`;
  detailActions.prepend(openGame);
  header.append(detailActions);

  section.append(header);
  if (!canEdit) {
    section.append(journalReadOnlyNode(entry));
    return section;
  }
  section.append(journalEditorFormNode(entry));
  return section;
}

function journalReadOnlyNode(entry) {
  const list = document.createElement("div");
  list.className = "data-list";
  list.append(
    dataRowNode("Game", gameDisplayName(entry.gameID)),
    dataRowNode("Action", journalActionLabel(entry.action)),
    dataRowNode("Logged", formatDate(entry.timestamp))
  );
  if (entry.note) {
    list.append(dataRowNode("Note", entry.note));
  }
  return list;
}

function journalEditorFormNode(entry) {
  const form = document.createElement("form");
  form.className = "journal-editor-form";
  form.dataset.entryId = normalizedString(entry.id);

  const fields = document.createElement("div");
  fields.className = "journal-editor-grid";
  fields.append(
    journalGameFieldNode(entry),
    ...journalFieldsForEntry(entry)
  );

  const actions = document.createElement("div");
  actions.className = "journal-editor-actions";
  const save = document.createElement("button");
  save.type = "submit";
  save.textContent = "Save";
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "tiny-button is-destructive";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deleteJournalEntry(normalizedString(entry.id)));
  actions.append(deleteButton, save);

  form.append(fields, actions);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    saveJournalEntryFromForm(form);
  });
  return form;
}

function journalGameFieldNode(entry) {
  const options = uniqueStrings([entry.gameID, ...practiceGameIDs()])
    .filter(Boolean)
    .map((gameID) => [gameID, gameDisplayName(gameID)]);
  const select = entrySelectNode("gameID", options);
  select.value = normalizedString(entry.gameID);
  return entryFieldNode("Game", select);
}

function journalFieldsForEntry(entry) {
  switch (entry.action) {
    case "scoreLogged": {
      const score = entryInputNode("score", "text", "Score", { inputmode: "numeric" });
      score.value = hasPositiveNumericScore(entry.score) ? formatScore(entry.score) : "";
      const context = entrySelectNode("scoreContext", [
        ["practice", "Practice"],
        ["league", "League"],
        ["tournament", "Tournament"],
      ]);
      context.value = ALLOWED_SCORE_CONTEXTS.has(entry.scoreContext) ? entry.scoreContext : "practice";
      const tournament = entryInputNode("tournamentName", "text", "Tournament name");
      tournament.value = entry.tournamentName ?? "";
      return [
        entryFieldNode("Score", score),
        entryFieldNode("Context", context),
        entryFieldNode("Tournament", tournament),
      ];
    }
    case "noteAdded": {
      const category = entrySelectNode("noteCategory", [
        ["general", "General practice"],
        ["shots", "Shots"],
        ["modes", "Modes"],
        ["multiball", "Multiball"],
        ["strategy", "Scoring strategy"],
      ]);
      category.value = ALLOWED_NOTE_CATEGORIES.has(entry.noteCategory) ? entry.noteCategory : "general";
      const detail = entryInputNode("noteDetail", "text", "Optional detail");
      detail.value = entry.noteDetail ?? "";
      const note = entryTextareaNode("note", "Note");
      note.value = entry.note ?? "";
      return [
        entryFieldNode("Category", category),
        entryFieldNode("Detail", detail),
        entryFieldNode("Note", note),
      ];
    }
    case "rulesheetRead":
    case "playfieldViewed":
    case "practiceSession": {
      const progress = entryInputNode("progressPercent", "number", "Optional", { min: "0", max: "100", step: "1" });
      progress.value = entry.progressPercent == null ? "" : String(clampPercent(entry.progressPercent));
      const note = entryTextareaNode("note", "Optional note");
      note.value = entry.note ?? "";
      return [
        entryFieldNode("Progress %", progress),
        entryFieldNode("Note", note),
      ];
    }
    case "tutorialWatch":
    case "gameplayWatch": {
      const kind = entrySelectNode("videoKind", [
        ["percent", "%"],
        ["clock", "hh:mm:ss"],
      ]);
      kind.value = ALLOWED_VIDEO_INPUTS.has(entry.videoKind) ? entry.videoKind : "percent";
      const value = entryInputNode("videoValue", "text", "Progress value");
      value.value = entry.videoValue ?? "";
      const progress = entryInputNode("progressPercent", "number", "Optional", { min: "0", max: "100", step: "1" });
      progress.value = entry.progressPercent == null ? "" : String(clampPercent(entry.progressPercent));
      const note = entryTextareaNode("note", "Optional note");
      note.value = entry.note ?? "";
      return [
        entryFieldNode("Format", kind),
        entryFieldNode("Value", value),
        entryFieldNode("Progress %", progress),
        entryFieldNode("Note", note),
      ];
    }
    default:
      return [];
  }
}

function saveJournalEntryFromForm(form) {
  const entryID = normalizedString(form.dataset.entryId);
  const original = practiceState.journalEntries.find((entry) => normalizedString(entry.id) === entryID);
  if (!original) {
    setStatus("Journal entry was not found.", true);
    render();
    return;
  }

  const draft = journalDraftFromForm(original, form);
  if (!draft.ok) {
    setStatus(draft.message, true);
    render();
    return;
  }

  if (!updateJournalEntry(original, draft.entry)) {
    setStatus("Editing is not supported for this entry type.", true);
    render();
    return;
  }

  selectedGameID = draft.entry.gameID;
  selectedJournalEntryID = normalizedString(draft.entry.id);
  localStorage.setItem(SELECTED_GAME_KEY, selectedGameID);
  localStorage.setItem(SELECTED_JOURNAL_KEY, selectedJournalEntryID);
  persistState();
  setStatus("Journal entry saved");
  render();
}

function journalDraftFromForm(original, form) {
  const gameID = normalizedString(fieldValue(form, "gameID"));
  if (!gameID) {
    return { ok: false, message: "Select a game." };
  }

  const base = {
    ...original,
    id: original.id,
    gameID,
    action: original.action,
    timestamp: original.timestamp,
  };

  switch (original.action) {
    case "scoreLogged": {
      const score = parseScoreInput(fieldValue(form, "score"));
      const context = ALLOWED_SCORE_CONTEXTS.has(fieldValue(form, "scoreContext"))
        ? fieldValue(form, "scoreContext")
        : "practice";
      const tournamentName = normalizedString(fieldValue(form, "tournamentName"));
      if (!Number.isFinite(score) || score <= 0) {
        return { ok: false, message: "Enter a valid score above 0." };
      }
      if (context === "tournament" && !tournamentName) {
        return { ok: false, message: "Enter a tournament name." };
      }
      return {
        ok: true,
        entry: {
          ...base,
          score,
          scoreContext: context,
          tournamentName: context === "tournament" ? tournamentName : null,
        },
      };
    }
    case "noteAdded": {
      const note = normalizedEntryNote(fieldValue(form, "note"));
      const category = ALLOWED_NOTE_CATEGORIES.has(fieldValue(form, "noteCategory"))
        ? fieldValue(form, "noteCategory")
        : "general";
      if (!note) {
        return { ok: false, message: "Note cannot be empty." };
      }
      return {
        ok: true,
        entry: {
          ...base,
          noteCategory: category,
          noteDetail: normalizedString(fieldValue(form, "noteDetail")) || null,
          note,
        },
      };
    }
    case "rulesheetRead":
    case "playfieldViewed":
    case "practiceSession": {
      const progress = optionalProgressPercent(fieldValue(form, "progressPercent"));
      if (!progress.ok) return progress;
      return {
        ok: true,
        entry: {
          ...base,
          task: original.task ?? taskForJournalAction(original.action),
          progressPercent: progress.value,
          note: normalizedEntryNote(fieldValue(form, "note")) || null,
        },
      };
    }
    case "tutorialWatch":
    case "gameplayWatch": {
      const progress = optionalProgressPercent(fieldValue(form, "progressPercent"));
      if (!progress.ok) return progress;
      const videoKind = ALLOWED_VIDEO_INPUTS.has(fieldValue(form, "videoKind"))
        ? fieldValue(form, "videoKind")
        : "percent";
      const videoValue = normalizedString(fieldValue(form, "videoValue"));
      if (!videoValue) {
        return { ok: false, message: "Enter a video progress value." };
      }
      return {
        ok: true,
        entry: {
          ...base,
          task: original.task ?? taskForJournalAction(original.action),
          progressPercent: progress.value,
          videoKind,
          videoValue,
          note: normalizedEntryNote(fieldValue(form, "note")) || null,
        },
      };
    }
    default:
      return { ok: false, message: "Editing is not supported for this entry type." };
  }
}

function updateJournalEntry(original, updated) {
  const journalIndex = practiceState.journalEntries.findIndex((entry) => normalizedString(entry.id) === normalizedString(original.id));
  if (journalIndex < 0 || !journalActionSupportsEditing(original.action)) return false;

  switch (original.action) {
    case "rulesheetRead":
    case "playfieldViewed":
    case "practiceSession":
      reconcileStudyEvent(original, updated, updated.task ?? taskForJournalAction(original.action));
      break;
    case "tutorialWatch":
    case "gameplayWatch":
      syncVideoProgressForJournalEdit(original, updated);
      reconcileStudyEvent(original, updated, updated.task ?? taskForJournalAction(original.action));
      break;
    case "scoreLogged":
      syncScoreEntryForJournalEdit(original, updated);
      break;
    case "noteAdded":
      syncNoteEntryForJournalEdit(original, updated);
      break;
    default:
      return false;
  }

  practiceState.journalEntries[journalIndex] = updated;
  return true;
}

function deleteJournalEntry(entryID) {
  const entry = practiceState.journalEntries.find((candidate) => normalizedString(candidate.id) === normalizedString(entryID));
  if (!entry) return;
  if (!journalActionSupportsEditing(entry.action)) {
    setStatus("Deleting is not supported for this entry type.", true);
    render();
    return;
  }
  if (!window.confirm("Delete this journal entry? This will remove the selected journal entry and linked practice data.")) return;

  removeLinkedRowsForJournalEntry(entry);
  practiceState.journalEntries = practiceState.journalEntries.filter((candidate) => normalizedString(candidate.id) !== normalizedString(entryID));
  selectedJournalEntryID = "";
  localStorage.removeItem(SELECTED_JOURNAL_KEY);
  persistState();
  setStatus("Journal entry deleted");
  render();
}

function deleteSelectedJournalEntries() {
  const selectedIDs = new Set([...selectedJournalEntryIDs].map((entryID) => normalizedString(entryID)));
  const entries = practiceState.journalEntries.filter((entry) => selectedIDs.has(normalizedString(entry.id)) && journalActionSupportsEditing(entry.action));
  if (!entries.length) {
    setStatus("Select at least one editable journal entry.", true);
    renderJournal();
    return;
  }
  const label = entries.length === 1 ? "journal entry" : "journal entries";
  if (!window.confirm(`Delete ${entries.length} selected ${label}? This will remove linked practice data for each entry.`)) return;

  const deleteIDs = new Set(entries.map((entry) => normalizedString(entry.id)));
  for (const entry of entries) {
    removeLinkedRowsForJournalEntry(entry);
  }
  practiceState.journalEntries = practiceState.journalEntries.filter((entry) => !deleteIDs.has(normalizedString(entry.id)));
  if (deleteIDs.has(selectedJournalEntryID)) {
    selectedJournalEntryID = "";
    localStorage.removeItem(SELECTED_JOURNAL_KEY);
  }
  journalSelectionMode = false;
  selectedJournalEntryIDs.clear();
  persistState();
  setStatus(`${entries.length} ${label} deleted`);
  render();
}

function removeLinkedRowsForJournalEntry(entry) {
  switch (entry.action) {
    case "rulesheetRead":
    case "playfieldViewed":
    case "practiceSession": {
      const index = matchingStudyEventIndexForJournal(entry, entry.task ?? taskForJournalAction(entry.action));
      if (index >= 0) practiceState.studyEvents.splice(index, 1);
      break;
    }
    case "tutorialWatch":
    case "gameplayWatch": {
      const videoIndex = matchingVideoProgressEntryIndexForJournal(entry);
      if (videoIndex >= 0) practiceState.videoProgressEntries.splice(videoIndex, 1);
      const studyIndex = matchingStudyEventIndexForJournal(entry, entry.task ?? taskForJournalAction(entry.action));
      if (studyIndex >= 0) practiceState.studyEvents.splice(studyIndex, 1);
      break;
    }
    case "scoreLogged": {
      const index = matchingScoreEntryIndexForJournal(entry);
      if (index >= 0) practiceState.scoreEntries.splice(index, 1);
      break;
    }
    case "noteAdded": {
      const index = matchingNoteEntryIndexForJournal(entry);
      if (index >= 0) practiceState.noteEntries.splice(index, 1);
      break;
    }
    default:
      break;
  }
}

function syncScoreEntryForJournalEdit(original, updated) {
  if (!hasPositiveNumericScore(updated.score)) return;
  const index = matchingScoreEntryIndexForJournal(original);
  const existing = index >= 0 ? practiceState.scoreEntries[index] : null;
  const row = {
    id: existing?.id ?? crypto.randomUUID(),
    gameID: updated.gameID,
    score: Number(updated.score),
    context: updated.scoreContext || "practice",
    tournamentName: updated.scoreContext === "tournament" ? normalizedString(updated.tournamentName) : null,
    timestamp: existing?.timestamp ?? updated.timestamp,
    leagueImported: Boolean(existing?.leagueImported),
  };
  if (index >= 0) {
    practiceState.scoreEntries[index] = row;
  } else {
    practiceState.scoreEntries.push(row);
  }
}

function syncVideoProgressForJournalEdit(original, updated) {
  const index = matchingVideoProgressEntryIndexForJournal(original);
  const value = normalizedString(updated.videoValue);
  if (!value || !updated.videoKind) {
    if (index >= 0) practiceState.videoProgressEntries.splice(index, 1);
    return;
  }
  const existing = index >= 0 ? practiceState.videoProgressEntries[index] : null;
  const row = {
    id: existing?.id ?? crypto.randomUUID(),
    gameID: updated.gameID,
    kind: updated.videoKind,
    value,
    timestamp: existing?.timestamp ?? updated.timestamp,
  };
  if (index >= 0) {
    practiceState.videoProgressEntries[index] = row;
  } else {
    practiceState.videoProgressEntries.push(row);
  }
}

function syncNoteEntryForJournalEdit(original, updated) {
  const note = normalizedEntryNote(updated.note);
  if (!note) return;
  const index = matchingNoteEntryIndexForJournal(original);
  const existing = index >= 0 ? practiceState.noteEntries[index] : null;
  const row = {
    id: existing?.id ?? crypto.randomUUID(),
    gameID: updated.gameID,
    category: updated.noteCategory || "general",
    detail: normalizedString(updated.noteDetail) || null,
    note,
    timestamp: existing?.timestamp ?? updated.timestamp,
  };
  if (index >= 0) {
    practiceState.noteEntries[index] = row;
  } else {
    practiceState.noteEntries.push(row);
  }
}

function reconcileStudyEvent(original, updated, task) {
  const normalizedTask = normalizedString(task);
  if (!normalizedTask) return;
  const index = matchingStudyEventIndexForJournal(original, normalizedTask);
  if (updated.progressPercent == null) {
    if (index >= 0) practiceState.studyEvents.splice(index, 1);
    return;
  }
  const row = {
    id: index >= 0 ? practiceState.studyEvents[index].id : crypto.randomUUID(),
    gameID: updated.gameID,
    task: normalizedTask,
    progressPercent: clampPercent(updated.progressPercent),
    timestamp: index >= 0 ? practiceState.studyEvents[index].timestamp : updated.timestamp,
  };
  if (index >= 0) {
    practiceState.studyEvents[index] = row;
  } else {
    practiceState.studyEvents.push(row);
  }
}

function matchingScoreEntryIndexForJournal(journal) {
  const gameID = normalizedString(journal.gameID);
  const expectedScore = Number(journal.score);
  const hasScore = Number.isFinite(expectedScore);
  const expectedContext = normalizedString(journal.scoreContext);
  const expectedTournament = normalizedString(journal.tournamentName).toLowerCase();
  return closestEntryIndex(practiceState.scoreEntries, journal.timestamp, (entry) => {
    if (normalizedString(entry.gameID) !== gameID) return false;
    if (expectedContext && normalizedString(entry.context) !== expectedContext) return false;
    if (hasScore && Math.abs(Number(entry.score) - expectedScore) > 0.5) return false;
    const tournament = normalizedString(entry.tournamentName).toLowerCase();
    if (expectedTournament || tournament) return tournament === expectedTournament;
    return true;
  });
}

function matchingStudyEventIndexForJournal(journal, task) {
  const gameID = normalizedString(journal.gameID);
  const normalizedTask = normalizedString(task);
  const expectedProgress = journal.progressPercent == null ? null : Number(journal.progressPercent);
  return closestEntryIndex(practiceState.studyEvents, journal.timestamp, (entry) => {
    if (normalizedString(entry.gameID) !== gameID) return false;
    if (normalizedString(entry.task) !== normalizedTask) return false;
    if (expectedProgress != null && Number(entry.progressPercent) !== expectedProgress) return false;
    return true;
  });
}

function matchingVideoProgressEntryIndexForJournal(journal) {
  const gameID = normalizedString(journal.gameID);
  const expectedKind = normalizedString(journal.videoKind);
  const expectedValue = normalizedString(journal.videoValue);
  return closestEntryIndex(practiceState.videoProgressEntries, journal.timestamp, (entry) => {
    if (normalizedString(entry.gameID) !== gameID) return false;
    if (expectedKind && normalizedString(entry.kind) !== expectedKind) return false;
    if (expectedValue && normalizedString(entry.value) !== expectedValue) return false;
    return true;
  });
}

function matchingNoteEntryIndexForJournal(journal) {
  const gameID = normalizedString(journal.gameID);
  const expectedCategory = normalizedString(journal.noteCategory);
  const expectedDetail = normalizedString(journal.noteDetail).toLowerCase();
  const expectedNote = normalizedEntryNote(journal.note);
  return closestEntryIndex(practiceState.noteEntries, journal.timestamp, (entry) => {
    if (normalizedString(entry.gameID) !== gameID) return false;
    if (expectedCategory && normalizedString(entry.category) !== expectedCategory) return false;
    const detail = normalizedString(entry.detail).toLowerCase();
    if ((expectedDetail || detail) && detail !== expectedDetail) return false;
    if (expectedNote && normalizedEntryNote(entry.note) !== expectedNote) return false;
    return true;
  });
}

function closestEntryIndex(entries, timestamp, predicate) {
  let bestIndex = -1;
  let bestDistance = Number.POSITIVE_INFINITY;
  const expectedTimestamp = timestampValue(timestamp);
  entries.forEach((entry, index) => {
    if (!predicate(entry)) return;
    const distance = Math.abs(timestampValue(entry.timestamp) - expectedTimestamp);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });
  return bestIndex;
}

function taskForJournalAction(action) {
  switch (action) {
    case "rulesheetRead": return "rulesheet";
    case "tutorialWatch": return "tutorialVideo";
    case "gameplayWatch": return "gameplayVideo";
    case "playfieldViewed": return "playfield";
    case "practiceSession": return "practice";
    default: return null;
  }
}

function journalActionForEntryActivity(activity) {
  switch (activity) {
    case "score": return "scoreLogged";
    case "rulesheet": return "rulesheetRead";
    case "tutorialVideo": return "tutorialWatch";
    case "gameplayVideo": return "gameplayWatch";
    case "playfield": return "playfieldViewed";
    case "practice": return "practiceSession";
    case "note": return "noteAdded";
    default: return "";
  }
}

function optionalProgressPercent(raw) {
  const text = normalizedString(raw);
  if (!text) return { ok: true, value: null };
  const progress = Number(text);
  if (!Number.isFinite(progress) || progress < 0 || progress > 100) {
    return { ok: false, message: "Progress must be between 0 and 100." };
  }
  return { ok: true, value: clampPercent(progress) };
}

function journalActionSupportsEditing(action) {
  return action !== "gameBrowse" && ALLOWED_JOURNAL_ACTIONS.has(action);
}

function journalActionLabel(action) {
  switch (action) {
    case "rulesheetRead": return "Rulesheet";
    case "tutorialWatch": return "Tutorial";
    case "gameplayWatch": return "Gameplay";
    case "playfieldViewed": return "Playfield";
    case "gameBrowse": return "Game page";
    case "practiceSession": return "Practice";
    case "scoreLogged": return "Score";
    case "noteAdded": return "Note";
    default: return "Journal entry";
  }
}

function journalActionIconName(action) {
  switch (action) {
    case "scoreLogged": return "score";
    case "rulesheetRead": return "book";
    case "tutorialWatch": return "book";
    case "gameplayWatch": return "dot";
    case "playfieldViewed": return "photo";
    case "practiceSession": return "run";
    case "noteAdded": return "list";
    case "gameBrowse": return "open";
    default: return "circle";
  }
}

function renderRoutes() {
  const currentGroup = selectedGroup();
  const activeSidebarRoute = sidebarRouteForActiveRoute(activeRoute);
  dom.routeButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.route === activeSidebarRoute));
  });
  dom.settingsButton.setAttribute("aria-pressed", String(activeRoute === "settings"));
  dom.searchButton.setAttribute("aria-pressed", String(activeRoute === "search"));
  Object.entries(dom.routePanels).forEach(([name, panel]) => {
    panel.hidden = name !== activeRoute;
  });
  dom.selectedRouteLabel.textContent = routeLabel(activeRoute);
  dom.selectedGroupLabel.textContent = currentGroup?.name || "All Practice";
  dom.selectedGroupLabel.classList.toggle("is-muted", !currentGroup);
  if (activeRoute === "home") {
    dom.selectedGameMeta.textContent = "Practice workspace";
    dom.selectedGameTitle.textContent = "Practice";
  } else if (activeRoute === "settings") {
    dom.selectedGameMeta.textContent = "Practice workspace";
    dom.selectedGameTitle.textContent = "Practice Settings";
    dom.selectedGroupLabel.textContent = "Data & sync";
    dom.selectedGroupLabel.classList.remove("is-muted");
  } else if (activeRoute === "search") {
    dom.selectedGameMeta.textContent = "Practice workspace";
    dom.selectedGameTitle.textContent = "Find Game";
    dom.selectedGroupLabel.textContent = practiceSearchLibraryOptionID(practiceSearchLibrary) === "catalog" ? "OPDB Catalog" : "Practice Games";
    dom.selectedGroupLabel.classList.remove("is-muted");
  } else if (activeRoute === "group-dashboard") {
    dom.selectedGameMeta.textContent = "Practice groups";
    dom.selectedGameTitle.textContent = "Group Dashboard";
  } else if (activeRoute === "group-editor") {
    dom.selectedGameMeta.textContent = "Practice groups";
    dom.selectedGameTitle.textContent = "Group Editor";
  } else if (activeRoute === "journal") {
    dom.selectedGameMeta.textContent = "Practice workspace";
    dom.selectedGameTitle.textContent = "Journal Timeline";
    dom.selectedGroupLabel.textContent = selectedGameID
      ? catalog.gamesByPracticeId.get(selectedGameID)?.name ?? selectedGameID
      : "All Games";
    dom.selectedGroupLabel.classList.remove("is-muted");
  } else if (activeRoute === "rulesheet") {
    dom.selectedGameMeta.textContent = selectedGameID
      ? gameMeta(selectedGameID, catalog.gamesByPracticeId.get(selectedGameID))
      : "Study resource";
    dom.selectedGameTitle.textContent = "Rulesheet";
    dom.selectedGroupLabel.textContent = selectedGameID
      ? catalog.gamesByPracticeId.get(selectedGameID)?.name ?? selectedGameID
      : "No game";
    dom.selectedGroupLabel.classList.remove("is-muted");
  } else if (activeRoute === "playfield") {
    dom.selectedGameMeta.textContent = selectedGameID
      ? gameMeta(selectedGameID, catalog.gamesByPracticeId.get(selectedGameID))
      : "Study resource";
    dom.selectedGameTitle.textContent = "Playfield";
    dom.selectedGroupLabel.textContent = selectedGameID
      ? catalog.gamesByPracticeId.get(selectedGameID)?.name ?? selectedGameID
      : "No game";
    dom.selectedGroupLabel.classList.remove("is-muted");
  } else if (activeRoute === "insights") {
    dom.selectedGameMeta.textContent = "Practice workspace";
    dom.selectedGameTitle.textContent = "Insights";
    dom.selectedGroupLabel.textContent = "Scores & trends";
    dom.selectedGroupLabel.classList.remove("is-muted");
  } else if (activeRoute === "mechanics") {
    dom.selectedGameMeta.textContent = "Practice workspace";
    dom.selectedGameTitle.textContent = "Mechanics";
    dom.selectedGroupLabel.textContent = "Skills";
    dom.selectedGroupLabel.classList.remove("is-muted");
  }
  renderGameHeaderToolbar();
}

function renderGameHeaderToolbar() {
  const isGameRoute = activeRoute === "game";
  dom.selectedContextStack?.querySelector(".game-header-toolbar")?.remove();
  if (dom.selectedRouteLabel) dom.selectedRouteLabel.hidden = isGameRoute;
  if (dom.selectedGroupLabel) dom.selectedGroupLabel.hidden = isGameRoute;
  if (dom.gamePanelToolbar) {
    dom.gamePanelToolbar.replaceChildren();
    dom.gamePanelToolbar.hidden = !isGameRoute;
    if (isGameRoute) {
      dom.gamePanelToolbar.append(gameHeaderToolbarNode());
    }
    return;
  }
  if (isGameRoute && dom.selectedContextStack) {
    dom.selectedContextStack.append(gameHeaderToolbarNode());
  }
}

function gameHeaderToolbarNode() {
  const toolbar = document.createElement("div");
  toolbar.className = "game-header-toolbar";
  toolbar.setAttribute("aria-label", "Game toolbar");

  const sourceSelect = document.createElement("select");
  sourceSelect.id = "game-toolbar-source";
  sourceSelect.setAttribute("aria-label", "Game library source");
  for (const option of practiceSearchLibraryOptions()) {
    const optionNode = document.createElement("option");
    optionNode.value = option.id;
    optionNode.textContent = option.label;
    sourceSelect.append(optionNode);
  }
  sourceSelect.value = gameToolbarLibraryValue();
  sourceSelect.addEventListener("change", () => {
    practiceSearchLibrary = practiceSearchLibraryOptionID(sourceSelect.value);
    practiceSearchQuery = "";
    practiceSearchManufacturer = "";
    practiceSearchYear = "";
    practiceSearchType = "";
    localStorage.setItem(PRACTICE_SEARCH_LIBRARY_KEY, practiceSearchLibrary);
    const candidates = gameToolbarGameIDs(practiceSearchLibrary);
    if (candidates.length && !candidates.includes(selectedGameID)) {
      selectedGameID = candidates[0];
      localStorage.setItem(SELECTED_GAME_KEY, selectedGameID);
    }
    activeRoute = "game";
    localStorage.setItem(ACTIVE_ROUTE_KEY, activeRoute);
    render();
  });

  const gameSelect = document.createElement("select");
  gameSelect.id = "game-toolbar-game";
  gameSelect.setAttribute("aria-label", "Game");
  const gameIDs = gameToolbarGameIDs(sourceSelect.value);
  for (const gameID of gameIDs) {
    const option = document.createElement("option");
    option.value = gameID;
    option.textContent = gameDisplayName(gameID);
    gameSelect.append(option);
  }
  gameSelect.value = gameIDs.includes(selectedGameID) ? selectedGameID : "";
  gameSelect.disabled = gameIDs.length === 0;
  gameSelect.addEventListener("change", () => {
    const nextGameID = normalizedString(gameSelect.value);
    if (!nextGameID) return;
    selectedGameID = nextGameID;
    activeRoute = "game";
    localStorage.setItem(SELECTED_GAME_KEY, selectedGameID);
    localStorage.setItem(ACTIVE_ROUTE_KEY, activeRoute);
    rememberPracticeSearchGame(nextGameID);
    render();
  });

  toolbar.append(
    gameToolbarControlNode("Library", sourceSelect),
    gameToolbarControlNode("Game", gameSelect, true)
  );
  return toolbar;
}

function gameToolbarControlNode(labelText, control, isWide = false) {
  const label = document.createElement("label");
  label.className = `game-toolbar-control${isWide ? " is-wide" : ""}`;
  const title = document.createElement("span");
  title.textContent = labelText;
  label.append(title, control);
  return label;
}

function gameToolbarLibraryValue() {
  const selected = normalizedString(selectedGameID);
  if (selected && !practiceGameIDs().includes(selected) && catalog.gamesByPracticeId.has(selected)) {
    return "catalog";
  }
  return practiceSearchLibraryOptionID(practiceSearchLibrary);
}

function gameToolbarGameIDs(libraryValue = gameToolbarLibraryValue()) {
  if (practiceSearchLibraryOptionID(libraryValue) === "catalog" && catalog.gamesByPracticeId.size > 0) {
    return [...catalog.gamesByPracticeId.keys()].sort((a, b) => gameDisplayName(a).localeCompare(gameDisplayName(b)));
  }
  return practiceGameIDs();
}

function sidebarRouteForActiveRoute(route) {
  switch (route) {
    case "home":
    case "group-dashboard":
    case "journal":
    case "insights":
    case "mechanics":
      return route;
    case "group-editor":
      return "group-dashboard";
    default:
      return "";
  }
}

function routeLabel(route) {
  switch (route) {
    case "home": return "Home";
    case "search": return "Find Game";
    case "group-dashboard": return "Group Dashboard";
    case "group-editor": return "Group Editor";
    case "game": return "Game";
    case "entry": return "Entry";
    case "study": return "Study";
    case "rulesheet": return "Rulesheet";
    case "playfield": return "Playfield";
    case "journal": return "Journal";
    case "insights": return "Insights";
    case "mechanics": return "Mechanics";
    case "settings": return "Settings";
    default: return "Home";
  }
}

function setStatus(message, isError = false) {
  statusMessage = message;
  statusIsError = isError;
  dom.stateStatus.textContent = statusMessage;
  dom.stateStatus.classList.toggle("danger-text", statusIsError);
}

function normalizePracticeState(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("Practice JSON must be an object.");
  }
  return {
    ...structuredClone(EMPTY_STATE),
    ...raw,
    schemaVersion: Number.isFinite(Number(raw.schemaVersion)) ? Number(raw.schemaVersion) : 4,
    studyEvents: Array.isArray(raw.studyEvents) ? raw.studyEvents : [],
    videoProgressEntries: Array.isArray(raw.videoProgressEntries) ? raw.videoProgressEntries : [],
    scoreEntries: Array.isArray(raw.scoreEntries) ? raw.scoreEntries : [],
    noteEntries: Array.isArray(raw.noteEntries) ? raw.noteEntries : [],
    journalEntries: Array.isArray(raw.journalEntries) ? raw.journalEntries : [],
    customGroups: Array.isArray(raw.customGroups) ? raw.customGroups : [],
    rulesheetResumeOffsets: objectOrEmpty(raw.rulesheetResumeOffsets),
    videoResumeHints: objectOrEmpty(raw.videoResumeHints),
    gameSummaryNotes: objectOrEmpty(raw.gameSummaryNotes),
    leagueSettings: { ...EMPTY_STATE.leagueSettings, ...objectOrEmpty(raw.leagueSettings) },
    syncSettings: { ...EMPTY_STATE.syncSettings, ...objectOrEmpty(raw.syncSettings) },
    analyticsSettings: { ...EMPTY_STATE.analyticsSettings, ...objectOrEmpty(raw.analyticsSettings) },
    practiceSettings: { ...EMPTY_STATE.practiceSettings, ...objectOrEmpty(raw.practiceSettings) },
  };
}

function addJournalEntry(entry) {
  practiceState.journalEntries = [
    ...practiceState.journalEntries,
    {
      id: crypto.randomUUID(),
      gameID: entry.gameID,
      action: entry.action,
      task: entry.task ?? null,
      progressPercent: entry.progressPercent ?? null,
      videoKind: entry.videoKind ?? null,
      videoValue: entry.videoValue ?? null,
      score: entry.score ?? null,
      scoreContext: entry.scoreContext ?? null,
      tournamentName: entry.tournamentName ?? null,
      noteCategory: entry.noteCategory ?? null,
      noteDetail: entry.noteDetail ?? null,
      note: entry.note ?? null,
      timestamp: entry.timestamp ?? Date.now(),
    },
  ];
}

function persistState() {
  practiceState = normalizePracticeState(practiceState);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(practiceState));
}

function loadStoredState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? normalizePracticeState(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

function loadPracticeCheckpoints() {
  try {
    const raw = JSON.parse(localStorage.getItem(PRACTICE_CHECKPOINTS_KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    return raw.map(normalizePracticeCheckpoint).filter(Boolean).slice(0, MAX_PRACTICE_CHECKPOINTS);
  } catch {
    return [];
  }
}

function normalizePracticeCheckpoint(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const stableHash = normalizedString(raw.stableHash);
  return {
    id: normalizedString(raw.id) || stableHash || crypto.randomUUID(),
    source: normalizedString(raw.source) || "Checkpoint",
    filename: normalizedString(raw.filename) || "Practice JSON",
    createdAt: Number(raw.createdAt) || Date.now(),
    stableHash,
    shortHash: normalizedString(raw.shortHash) || stableHash.slice(0, 12),
    schemaVersion: Number(raw.schemaVersion) || EXPECTED_SCHEMA_VERSION,
    validationCounts: {
      error: Number(raw.validationCounts?.error) || 0,
      warning: Number(raw.validationCounts?.warning) || 0,
      info: Number(raw.validationCounts?.info) || 0,
    },
    validationSummary: normalizedString(raw.validationSummary),
    rowCounts: objectOrEmpty(raw.rowCounts),
    gameCoverage: objectOrEmpty(raw.gameCoverage),
    activityRange: objectOrEmpty(raw.activityRange),
  };
}

function savePracticeCheckpoints() {
  localStorage.setItem(PRACTICE_CHECKPOINTS_KEY, JSON.stringify(practiceCheckpoints));
}

function loadActiveVideoState() {
  try {
    return objectOrEmpty(JSON.parse(localStorage.getItem(ACTIVE_VIDEO_KEY) || "{}"));
  } catch {
    return {};
  }
}

function saveActiveVideoState() {
  localStorage.setItem(ACTIVE_VIDEO_KEY, JSON.stringify(activeVideoByGame));
}

function practiceGameIDs() {
  const ids = new Set();
  for (const group of practiceState.customGroups) {
    for (const id of group.gameIDs ?? []) ids.add(id);
  }
  for (const entry of practiceState.scoreEntries) ids.add(entry.gameID);
  for (const entry of practiceState.studyEvents) ids.add(entry.gameID);
  for (const entry of practiceState.videoProgressEntries) ids.add(entry.gameID);
  for (const entry of practiceState.noteEntries) ids.add(entry.gameID);
  for (const entry of practiceState.journalEntries) ids.add(entry.gameID);
  for (const id of Object.keys(practiceState.gameSummaryNotes ?? {})) ids.add(id);
  return [...ids].filter(Boolean).sort((a, b) => {
    const left = catalog.gamesByPracticeId.get(a)?.name ?? a;
    const right = catalog.gamesByPracticeId.get(b)?.name ?? b;
    return left.localeCompare(right);
  });
}

function firstPracticeGameID() {
  return practiceGameIDs()[0] ?? "";
}

function trackGroupFallback(map, groupId, row, fallbackSource) {
  const practiceId = normalizedString(groupId);
  if (!practiceId || map.has(practiceId)) return;
  map.set(practiceId, {
    ...fallbackSource,
    practiceId,
    opdbId: practiceId,
    name: normalizedString(row.common_name) || normalizedString(row.name) || fallbackSource.name || practiceId,
  });
}

function parsePracticeIdentityCurations(raw) {
  const practiceIdentityByOpdb = new Map();
  const groupAssetTargets = new Map();
  for (const split of raw?.splits ?? []) {
    const groupId = normalizedString(split?.opdbGroupId);
    for (const [kind, practiceIdentity] of Object.entries(split?.groupAssetTargets ?? {})) {
      const assetKind = normalizedString(kind);
      const target = normalizedString(practiceIdentity);
      if (groupId && assetKind && target) groupAssetTargets.set(`${groupId}|${assetKind}`, target);
    }
    for (const entry of split?.practiceEntries ?? []) {
      const practiceId = normalizedString(entry?.practiceIdentity);
      if (!practiceId) continue;
      for (const memberId of entry?.memberOpdbIds ?? []) {
        const opdbId = normalizedString(memberId);
        if (opdbId) practiceIdentityByOpdb.set(opdbId, practiceId);
      }
    }
  }
  return { practiceIdentityByOpdb, groupAssetTargets };
}

function registerOpdbPracticeIdentity(map, opdbId, practiceId) {
  const parts = parseOpdbId(opdbId);
  for (const key of [parts.fullId, parts.machineId, parts.groupId]) {
    if (key && !map.has(key)) map.set(key, practiceId);
  }
}

function practiceIdForOpdb(map, raw) {
  const parts = parseOpdbId(raw);
  return map.get(parts.fullId) || map.get(parts.machineId) || map.get(parts.groupId) || parts.groupId;
}

function practiceIdsForOpdb(map, raw, record, assetKind, curationIndex) {
  const parts = parseOpdbId(raw);
  const recordIds = opdbIdsInRecord(record)
    .map((id) => parseOpdbId(id))
    .filter((recordParts) => recordParts.groupId && recordParts.groupId === parts.groupId)
    .map((recordParts) => practiceIdForOpdb(map, recordParts.fullId));
  return uniqueStrings([
    curationIndex?.groupAssetTargets?.get(`${parts.groupId}|${normalizedString(assetKind)}`),
    ...recordIds,
    parts.machineId !== parts.groupId ? practiceIdForOpdb(map, raw) : "",
    parts.groupId,
  ]);
}

function practiceIdsForIdentity(raw) {
  const id = normalizedString(raw);
  const parts = parseOpdbId(id);
  return uniqueStrings([id, parts.groupId]);
}

function uniqueStrings(values) {
  return [...new Set(values.map(normalizedString).filter(Boolean))];
}

function opdbIdsInRecord(record) {
  const raw = JSON.stringify(record ?? {});
  return [...new Set(raw.match(/\bG[A-Za-z0-9]{4,6}-M[A-Za-z0-9]{4,6}(?:-A[A-Za-z0-9]{4,6})?\b/g) ?? [])];
}

function parseOpdbId(raw) {
  const fullId = normalizedString(raw);
  const parts = fullId ? fullId.split("-").filter(Boolean) : [];
  const groupId = parts[0] || "";
  const machineToken = parts.find((part) => part.startsWith("M")) || "";
  const machineId = groupId && machineToken ? `${groupId}-${machineToken}` : groupId;
  return { fullId, groupId, machineId };
}

function records(payload) {
  return Array.isArray(payload?.records) ? payload.records : [];
}

function ensureResources(map, practiceId) {
  if (!map.has(practiceId)) map.set(practiceId, emptyResources());
  return map.get(practiceId);
}

function emptyResources() {
  return { rulesheets: [], playfields: [], videos: [], gameinfo: [], backglasses: [] };
}

function primaryGameImageForGame(snapshot) {
  const backglass = snapshot.resources.backglasses.find((item) => normalizedString(item.backglassLocalPath || item.backglassSourceUrl));
  if (backglass) {
    return {
      label: "Backglass",
      url: backglass.backglassLocalPath || backglass.backglassSourceUrl,
      note: backglass.backglassSourceNote || "Backglass art",
    };
  }
  if (snapshot.game?.imageUrl) {
    return {
      label: snapshot.game.name || "Game image",
      url: snapshot.game.imageUrl,
      note: "OPDB primary image",
    };
  }
  return null;
}

function resourceCoverageLabel(resources) {
  const groups = [
    ["rulesheet", resources.rulesheets.length],
    ["playfield", resources.playfields.length],
    ["video", resources.videos.length],
    ["game info", resources.gameinfo.length],
    ["backglass", resources.backglasses.length],
  ].filter(([, count]) => count > 0);
  const total = groups.reduce((sum, [, count]) => sum + count, 0);
  if (!total) return "No study assets";
  const labels = groups.map(([label, count]) => `${count} ${label}${count === 1 ? "" : "s"}`);
  return `${total} asset${total === 1 ? "" : "s"} · ${labels.join(", ")}`;
}

function scoreContextLabel(entry) {
  const context = normalizedString(entry.context) || "practice";
  const tournament = normalizedString(entry.tournamentName);
  return tournament ? `${context}: ${tournament}` : context;
}

function targetDeltaLabel(highScore, targetValue) {
  const high = Number(highScore);
  const target = Number(targetValue);
  if (!Number.isFinite(high) || !Number.isFinite(target) || target <= 0) return "";
  const delta = Math.round(high - target);
  if (delta >= 0) return `${formatScore(delta)} over target`;
  return `${formatScore(Math.abs(delta))} short of target`;
}

function targetLocationLabel(target) {
  const parts = [
    target.area ? `Area ${target.area}` : "",
    target.bank ? `Bank ${target.bank}` : "",
    target.position ? `Position ${target.position}` : "",
    target.group ? `Group ${target.group}` : "",
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : "Mapped target row";
}

function studyProgressLabel(entry) {
  const task = normalizedString(entry.task) || "study";
  const progress = Number(entry.progressPercent);
  const progressLabel = Number.isFinite(progress) ? `${Math.round(progress)}%` : "logged";
  return `${taskLabel(task)} · ${progressLabel}`;
}

function resumeOffsetLabel(gameID) {
  const offset = practiceState.rulesheetResumeOffsets?.[gameID];
  if (offset === undefined || offset === null) return "No rulesheet progress";
  return `Resume ${formatProgressLike(offset)}`;
}

function videoProgressLabel(entry) {
  return `${normalizedString(entry.kind) || "video"} · ${normalizedString(entry.value) || "logged"}`;
}

function videoResumeLabel(gameID) {
  const hint = normalizedString(practiceState.videoResumeHints?.[gameID]);
  return hint ? `Resume ${hint}` : "No video progress";
}

function taskLabel(task) {
  switch (task) {
    case "rulesheet": return "Rulesheet";
    case "playfield": return "Playfield";
    case "tutorialVideo": return "Tutorial";
    case "gameplayVideo": return "Gameplay";
    case "practice": return "Practice";
    default: return task || "Study";
  }
}

function formatProgressLike(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return normalizedString(value) || "-";
  if (number > 0 && number <= 1) return `${Math.round(number * 100)}%`;
  return `${Math.round(number)}%`;
}

function primaryImagePreviewStrip(snapshot) {
  const image = primaryGameImageForGame(snapshot);
  if (!image) return null;

  const strip = document.createElement("div");
  strip.className = "image-strip";
  const card = document.createElement("a");
  card.className = "image-card";
  card.href = image.url;
  card.target = "_blank";
  card.rel = "noreferrer";
  card.innerHTML = `
    <img src="${escapeAttribute(image.url)}" alt="${escapeAttribute(image.label)}">
    <span class="row-title">${escapeHtml(image.label)}</span>
    <span class="row-meta">${escapeHtml(image.note || "Primary game art")}</span>
  `;
  strip.append(card);
  return strip;
}

function resourceRow(kind, label, url) {
  const row = document.createElement("div");
  row.className = "resource-row";
  const href = normalizedString(url);
  row.innerHTML = `
    <span class="row-title">${escapeHtml(kind)} · ${escapeHtml(label || "Resource")}</span>
    ${href ? `<a href="${escapeAttribute(href)}" target="_blank" rel="noreferrer">${escapeHtml(href)}</a>` : `<span class="row-meta">No link</span>`}
  `;
  return row;
}

function gameMeta(gameID, game) {
  const parts = [
    game?.manufacturer,
    game?.year,
    game?.type,
    gameID,
  ].filter(Boolean);
  return parts.join(" · ");
}

function journalSummary(entry) {
  switch (entry.action) {
    case "scoreLogged":
      if (hasPositiveNumericScore(entry.score)) {
        return `Score ${formatScore(entry.score)}${entry.scoreContext ? ` · ${entry.scoreContext}` : ""}`;
      }
      return entry.note || "Logged score";
    case "rulesheetRead":
      return `Rulesheet ${entry.progressPercent ?? 0}%`;
    case "tutorialWatch":
      return `Tutorial ${entry.videoValue ?? ""}`.trim();
    case "gameplayWatch":
      return `Gameplay ${entry.videoValue ?? ""}`.trim();
    case "playfieldViewed":
      return "Reviewed playfield";
    case "practiceSession":
      return entry.noteDetail ? `Practice · ${entry.noteDetail}` : "Practice session";
    case "noteAdded":
      return entry.noteDetail ? `Note · ${entry.noteDetail}` : "Note";
    case "gameBrowse":
      return "Opened game";
    default:
      return entry.action || "Journal entry";
  }
}

function manufacturerName(raw) {
  if (!raw) return "";
  if (typeof raw === "string") return raw;
  return normalizedString(raw.name) || normalizedString(raw.full_name) || "";
}

function parseYear(value) {
  const raw = normalizedString(value);
  if (!raw) return "";
  const year = Number.parseInt(raw.slice(0, 4), 10);
  return Number.isFinite(year) ? String(year) : "";
}

function primaryImageUrl(images) {
  if (!Array.isArray(images)) return "";
  const image = images.find((item) => item?.primary) || images[0];
  return image?.urls?.medium || image?.urls?.large || image?.urls?.small || "";
}

function normalizedString(value) {
  const text = String(value ?? "").trim();
  return text && text.toLowerCase() !== "null" ? text : "";
}

function objectOrEmpty(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function emptyNode(text) {
  const node = document.createElement("p");
  node.className = "empty";
  node.textContent = text;
  return node;
}

function formatScore(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number).toLocaleString() : "-";
}

function formatScoreInputWithCommas(value) {
  const digits = normalizedString(value).replace(/[^\d]/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString();
}

function formatDate(value) {
  const date = new Date(timestampValue(value));
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatTime(value) {
  const date = new Date(timestampValue(value));
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function datetimeLocalInputValue(value) {
  const date = new Date(timestampValue(value));
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
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

function timestampSlug() {
  const date = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

function downloadJson(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error ?? "unknown error");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#96;");
}
