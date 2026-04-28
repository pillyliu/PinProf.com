# Practice Web Port Audit

Status: draft reference for the PinProf.com web app port
Date: 2026-04-26

This document inventories the current Practice tab using iOS as the reference implementation, compares the iOS and Android Practice data contracts, and calls out the sync decisions needed before Practice can become a cross-platform web/native feature.

## Direction

- Start with Practice as the first real web-app surface on `pinprof.com`.
- Use iOS Practice as the source of truth for behavior and interaction design.
- Build Practice first, then use its patterns for GameRoom.
- Keep camera OCR native-only.
- Treat media attachments as v2 and only as a possible future ported feature.
- Treat Pinside browser import as a likely web-compatible feature, but not a prerequisite for Practice v1.
- Design cloud sync and native app sync around one canonical Practice schema shared by iOS, Android, and web.

## Current Web Build Snapshot

As of the local `practice/` web app build on 2026-04-26, the web port has moved beyond a static audit into a working local-first Practice prototype.

Implemented local surfaces:

- Practice shell with app-style left navigation and top-right search/settings buttons.
- Browser URL state for Practice route, selected game, game subview, selected journal row, selected group, and search library.
- Home with resume context, library/game dropdowns, quick entry launch buttons, active groups, and hub cards.
- Settings page containing import, export, sample data, data/schema validation, profile, league settings, and local recovery tools.
- OPDB catalog loading and mirrored asset database loading for rulesheets, playfields, videos, game info, and backglass images.
- Game workspace with `Summary`, `Input`, `Study`, and `Log` segments.
- Game cards and mini cards using backglass/primary art, reserving playfields for explicit playfield views.
- Game Summary with active group progress wheel, practice plan, score summary, target scores, and recent scores.
- Game Input with task-specific logging shortcuts, activity status tiles, linked entry forms, and scoped recent entries.
- Study view with resource chips, rulesheet/playfield drill-ins, video launch panel, thumbnails, and progress tiles.
- Log view with per-game journal rows, summary tiles, and editable entry actions.
- Group Dashboard with current/archived filtering, priority/date controls, selected group metrics, game rows, segmented progress wheels, and group game removal.
- Group Editor with create/edit, templates, source-aware search/recent selection, order controls, and validation.
- Journal Timeline with filters, day sections, detail/editor panel, linked-row reconciliation, and select/delete batch mode.
- Insights with score metrics, sparkline trend, league opponent selection, top-row comparison, and delta bars.
- Mechanics with skill vocabulary, competency logging, detected tags, history, stats, and tutorial links.

Known unported or intentionally deferred surfaces:

- Camera OCR score scanning remains native-only.
- Cloud sync and native/web sync are not implemented yet.
- Pinside browser import is not implemented yet.
- Media attachments remain v2.
- GameRoom has not started; Practice is still the reference foundation.
- Ranking profile is documented but not yet ported as a full web surface.

## Source Map

- iOS Practice feature: `/Users/pillyliu/Documents/Codex/Pinball App/Pinball App 2/Pinball App 2/practice`
- iOS Practice modernization spec: `/Users/pillyliu/Documents/Codex/Pinball App/docs/modernization/features/practice/spec.md`
- iOS codebase inventory: `/Users/pillyliu/Documents/Codex/Pinball App/docs/codebase/README.md`
- Android Practice feature: `/Users/pillyliu/Documents/Codex/Pinball App/android/app/src/main/java/com/pinprof/pinballapp/practice`
- Website shared data contract: `/Users/pillyliu/Documents/Codex/Pillyliu Pinball Website/SHARED_DATA_CONTRACT.md`
- Website library loaders/cache: `/Users/pillyliu/Documents/Codex/Pillyliu Pinball Website/shared/ui`
- PinProf.com static site: `/Users/pillyliu/Documents/Codex/PinProf.com`

## Existing Web Data Context

The current web ecosystem already has pieces Practice can reuse:

- `pillyliu.com` hosts league stats, standings, targets, and the library.
- `/Users/pillyliu/Documents/Codex/Pillyliu Pinball Website` builds the current web apps.
- `PinProf Admin/workspace` is the source of truth for hosted pinball data.
- Deployed website apps consume generated runtime payloads under `/pinball/...`.
- App preload bundles are built from the same source data.

Important deploy detail: the current deploy script uploads `/pinball` runtime payloads to `pillyliu.com`, then separately deploys the static `PinProf.com` workspace to the PinProf site root. A Practice web app on `pinprof.com` will need one of these:

- mirror the needed `/pinball/...` runtime payloads to `pinprof.com`,
- fetch absolute URLs from `https://pillyliu.com/pinball/...` with a CORS-safe contract,
- or move the shared runtime payload behind a domain-neutral API.

## Practice Surface Inventory

### Home

The Practice home is not just a launch screen. It is the main dashboard.

Current iOS behavior:

- Shows a loading/refreshing state while Practice data and library resources initialize.
- Header says `Welcome back` or `Welcome back, {name}`.
- Tapping the player name opens the ranking profile.
- Search button opens Practice game search.
- Settings button opens Practice settings.
- Resume card returns to the most recent Practice game context.
- Library menu controls the active library source.
- Game List menu controls the visible game list scope.
- Quick Entry row exposes:
  - `Score`
  - `Study`
  - `Practice`
  - `Mechanics`
- Active groups panel shows active Practice groups.
- Hub cards navigate to:
  - `Group Dashboard`
  - `Journal Timeline`
  - `Insights`
  - `Mechanics`
- First-run overlay prompts for player setup:
  - player name
  - `Import LPL stats` toggle
  - save or skip action
  - explanation of Group Dashboard, Insights, Mechanics, and Journal Timeline

Web v1 should recreate this as the landing screen of the signed-in or local Practice web app, not as marketing copy.

### Game Search And Selection

iOS has two related selection surfaces:

- general Practice search
- group title selection

Group title selection is the richer reference for web filtering:

- full-page selector
- `Search` and `Recent` tabs
- library source dropdown
- advanced filters:
  - name
  - manufacturer
  - year
  - type: `EM`, `SS`, `LCD`
- `All games` reset
- selected games preserve order
- selected games can be removed
- selected games can be drag reordered
- recent games come from the Practice recent store
- venue/library source choices preserve source-scoped IDs where needed

Sync implication: the selected game identity must use the same canonical Practice game ID rules as iOS/Android. Venue-specific source IDs are UI/library context and should not accidentally replace canonical Practice game IDs in synced records.

### Game Workspace

The iOS game route is the core Practice workspace.

Route shape:

- `game(gameID, sourceID?, sourceLabel)`

Primary content:

- screenshot/playfield image preview
- segmented workspace:
  - `Summary`
  - `Input`
  - `Study`
  - `Log`
- game note card
- keyboard-aware layout
- save banner feedback

Lifecycle behavior:

- sync selected game on appear/change
- initialize game summary draft
- schedule a `gameBrowse` journal entry after a short delay
- initialize active video/resource state

Web v1 should preserve the route shape conceptually. The page URL should be deep-linkable by game ID, and source context should be explicit enough to return to the same library scope.

### Game Summary

The Summary segment aggregates active practice context.

Current iOS cards/sections:

- active group progress wheel
- next action
- alerts
- consistency status
- score stats:
  - high
  - low
  - mean
  - median
  - standard deviation
- target scores:
  - 2nd
  - 4th
  - 8th
- league target integration

Web v1 should calculate these from the canonical Practice state plus hosted league target data.

### Game Input

The Input segment is task logging for the selected game.

Actions:

- `Rulesheet`
- `Playfield`
- `Score`
- `Tutorial`
- `Practice`
- `Gameplay`

These open task-specific entry flows, then write both the domain record and the Journal entry.

Camera score scanning is native-only and should not be included in the web version.

### Study Resources

The Study segment exposes current learning resources.

Current iOS behavior:

- rulesheet chips for local, remote, or external rulesheets
- playfield chips and live playfield availability
- tutorial video launch panel
- gameplay video launch panel
- video tiles/thumbnails
- progress entry for rulesheet and video study

Web v1 should reuse the existing website library/rulesheet/playfield/video data where possible instead of duplicating lookup logic.

### Log

The Log segment shows game-scoped journal history.

Current iOS behavior:

- rows grouped for the selected game
- empty state: `No actions logged yet.`
- app-created editable rows support edit/delete
- library events are visible in the broader timeline but are not editable Practice entries
- `gameBrowse` entries are not editable

Web v1 should clearly separate synced Practice journal entries from derived library activity.

### Game Notes

Each game can have a persistent summary note.

Current state field:

- `gameSummaryNotes: [gameID: String]`

Sync implication: game summary notes are scalar map values. For cloud sync they need either per-game updated metadata or a last-write-wins rule.

### Quick Entry

Quick Entry logs activity without first opening a full game workspace.

Entry kinds:

- `score`
- `study`
- `practice`
- `mechanics`

Available activities by kind:

- Score:
  - score only
- Study:
  - rulesheet
  - tutorial video
  - gameplay video
  - playfield
- Practice:
  - practice session
- Mechanics:
  - mechanics session

Common Quick Entry fields:

- library filter
- game menu
- activity menu for Study
- optional notes

Score fields:

- score value
- context:
  - `practice`
  - `league`
  - `tournament`
- tournament name when applicable
- scanner button in iOS only

Study fields:

- rulesheet progress slider
- video progress mode:
  - clock
  - percent
- watched/duration value
- percent value

Practice fields:

- minutes
- category/focus:
  - general
  - shots
  - modes
  - multiball
  - strategy

Mechanics fields:

- skill
- competency 1-5
- note

Validation/write behavior:

- score requires a positive score
- video clock/percent must parse into a valid draft
- playfield review creates a note if no richer progress exists
- practice minutes are optional but must be positive if supplied
- mechanics writes a tagged note with a competency marker

### Score Entry

The in-game Score entry sheet is stricter than Quick Entry.

Current iOS behavior:

- score must be greater than zero
- context is segmented:
  - practice
  - league
  - tournament
- tournament name is required when context is tournament
- scanner is available in iOS only

Web v1 should keep the same validation except scanner.

### Task Entry

The in-game task entry sheet writes study/practice activity.

Supported tasks:

- rulesheet progress
- tutorial video progress
- gameplay video progress
- playfield review
- practice session

Task writes are linked:

- `StudyProgressEvent` and Journal entry for rulesheet
- `VideoProgressEntry`, optional study progress, and Journal entry for video
- Journal entry for playfield review
- `PracticeNoteEntry` and Journal entry for practice session

Sync implication: these related writes need to be treated as one transaction or operation in the cloud layer, otherwise cross-device merges can create orphaned rows.

### Settings

Settings are part of the Practice feature, not a global app afterthought.

Current iOS sections:

- Practice Profile:
  - player name
  - `Save Profile`
- IFPA:
  - IFPA number
  - helper text
  - `Save IFPA ID`
- PRPA:
  - PRPA number
  - helper text
  - `Save PRPA ID`
- League Import:
  - player menu
  - import explanation
  - `Import LPL CSV`
  - import status
- Recovery:
  - imported league score summary
  - `Clear Imported League Scores`
  - `Reset Practice Log`
  - reset confirmation requires typing `reset`

Web v1 should include settings early because they affect import identity, ranking profile links, and sync account mapping.

### Group Dashboard

The Group Dashboard manages sets of games for focused practice.

Current iOS behavior:

- segmented picker:
  - `Current`
  - `Archived`
- add group
- edit selected group
- table columns:
  - Name
  - Priority
  - Start
  - End
- rows support:
  - select
  - priority toggle
  - start date edit
  - end date edit
  - archive/unarchive
  - delete
- selected group detail card shows status and metrics
- group games can be opened
- group games can be removed

Web v1 should treat groups as a first-class dashboard. This is likely the bridge to GameRoom because GameRoom borrows the same grouped-game mental model.

### Group Editor

The Group Editor creates and edits custom groups.

Fields:

- name
- game IDs
- type:
  - bank
  - location
  - custom
- active flag
- archived flag
- priority flag
- start date
- end date
- created date

Create templates:

- none
- LPL Bank Template
- Duplicate Group

Template behavior:

- Bank template selects bank games and suggests a `Bank {bank} Focus` name.
- Duplicate template copies the source group's game IDs, type, priority/archive state, and dates.
- Duplicate template suggests `Copy of ...`.

Validation:

- name is required
- at least one game is required
- end date cannot be before start date

Ordering:

- new group position can be chosen
- existing groups can move up/down

### Journal Timeline

The Journal Timeline is the durable activity log for Practice.

Filters:

- `all`
- `study`
- `practice`
- `score`
- `notes`
- `league`

Sources:

- synced/local Practice `journalEntries`
- derived library activity events

Current iOS behavior:

- entries are sectioned by day
- rows show icon, summary, and time
- app-created entries can be edited/deleted
- library events are read-only
- `gameBrowse` entries are read-only
- editing a row reconciles linked score/study/video/note arrays

Web v1 should preserve row edit/delete behavior for user-created Practice entries.

### Journal Entry Editor

Editable entry types:

- score
- note
- study progress
- video progress

Unsupported:

- `gameBrowse`

Editor behavior:

- game can be changed
- score/context/tournament fields can be edited
- note category/detail/body can be edited
- study progress can be enabled and adjusted
- video format/value/note can be edited

Validation:

- game is required
- score entries require score greater than zero
- tournament score entries require tournament name
- note entries require non-empty note body
- video entries require non-empty value

### Insights

Insights summarize score and comparison trends.

Current iOS behavior:

- game dropdown scoped by library source
- Stats card:
  - average
  - median
  - floor
  - IQR
  - trend sparkline
  - consistency risk/stable status
  - metric pills
- Head-to-Head card:
  - opponent dropdown
  - refresh
  - loading state
  - comparison metrics
  - top 8 rows
  - delta bars

Web v1 can start with local/user score insights and defer richer opponent comparison if the supporting hosted data is not already available on `pinprof.com`.

### Mechanics

Mechanics tracks skill practice through tagged notes.

Skills:

- Dead Bounce
- Post Pass
- Post Catch
- Flick Pass
- Nudge Pass
- Drop Catch
- Live Catch
- Shatz
- Back Flip
- Loop Pass
- Slap Save (Single)
- Slap Save (Double)
- Air Defense
- Cradle Separation
- Over Under
- Tap Pass

Current iOS behavior:

- skill menu
- competency slider 1-5
- optional notes
- detected tags
- `Log Mechanics Session`
- history for all skills or selected skill
- logs/latest/average/trend/sparkline
- external Dead Flip tutorials

Storage behavior:

- mechanics sessions are Practice notes with recognizable skill tags/details
- competency is encoded in the note/detail pattern

Web v1 should preserve the exact skill vocabulary to keep native/web analytics aligned.

### Ranking Profile

The ranking profile is reached from Practice and settings identity.

Current iOS context:

- player name
- IFPA ID
- PRPA ID
- source toggle behavior exists in the app

Web v1 should decide whether ranking profile is part of Practice v1 or a linked profile surface. It matters for account identity and sync, but not for the first logging loop.

## iOS Reference State Model

iOS canonical storage is `PracticePersistedState` schema version 4.

Storage keys:

- current key: `practice-state-json`
- legacy key: `practice-upgrade-state-v1`

Date encoding:

- canonical JSON uses milliseconds since Unix epoch
- decoder still supports legacy Foundation date encoding

Top-level fields:

- `studyEvents`
- `videoProgressEntries`
- `scoreEntries`
- `noteEntries`
- `journalEntries`
- `customGroups`
- `leagueSettings`
- `syncSettings`
- `analyticsSettings`
- `rulesheetResumeOffsets`
- `videoResumeHints`
- `gameSummaryNotes`
- `practiceSettings`

Core enums:

- `StudyTaskKind`
  - `playfield`
  - `rulesheet`
  - `tutorialVideo`
  - `gameplayVideo`
  - `practice`
- `JournalActionType`
  - `rulesheetRead`
  - `tutorialWatch`
  - `gameplayWatch`
  - `playfieldViewed`
  - `gameBrowse`
  - `practiceSession`
  - `scoreLogged`
  - `noteAdded`
- `ScoreContext`
  - `practice`
  - `league`
  - `tournament`
- `PracticeCategory`
  - `general`
  - `shots`
  - `modes`
  - `multiball`
  - `strategy`
- `VideoProgressInputKind`
  - `clock`
  - `percent`
- `ChartGapMode`
  - `realTimeline`
  - `compressInactive`
  - `activeSessionsOnly`
  - `brokenAxis`

Core records:

```text
StudyProgressEvent
- id
- gameID
- task
- progressPercent
- timestamp

VideoProgressEntry
- id
- gameID
- kind
- value
- timestamp

ScoreLogEntry
- id
- gameID
- score
- context
- tournamentName
- timestamp
- leagueImported

PracticeNoteEntry
- id
- gameID
- category
- detail
- note
- timestamp

JournalEntry
- id
- gameID
- action
- task
- progressPercent
- videoKind
- videoValue
- score
- scoreContext
- tournamentName
- noteCategory
- noteDetail
- note
- timestamp

CustomGameGroup
- id
- name
- gameIDs
- type
- isActive
- isArchived
- isPriority
- startDate
- endDate
- createdAt

PracticeSettings
- playerName
- comparisonPlayerName
- ifpaPlayerID
- prpaPlayerID
- selectedGroupID

LeagueLinkSettings
- playerName
- csvAutoFillEnabled
- lastImportAt
- lastRepairVersion

SyncSettings
- cloudSyncEnabled
- endpoint
- phaseLabel

AnalyticsSettings
- gapMode
- useMedian
```

## Android Compatibility Finding

Short answer: Android and iOS Practice runtime structures are not the same, but Android now saves a canonical Practice schema intended to match iOS schema version 4.

Android has two relevant layers:

- runtime store shape used by Compose state and legacy migration
- canonical persistence shape used for saved JSON

The runtime shape is different from iOS and should not become the web/cloud contract.

The canonical Android persistence model mirrors iOS:

- same schema version: `4`
- same top-level persisted fields
- same event/group/settings concepts
- same timestamp field names in JSON
- same storage key: `practice-state-json`
- flexible parsing for old timestamp formats

Android canonical JSON writes fields like:

- `timestamp`
- `startDate`
- `endDate`
- `createdAt`
- `lastImportAt`

This matches what iOS expects in canonical JSON.

Existing tests support this:

- iOS has Practice state codec tests for canonical milliseconds and legacy Foundation dates.
- Android has canonical persistence tests for legacy migration and canonical fixture parsing.

Practical conclusion: use the iOS `PracticePersistedState` and Android `CanonicalPracticePersistedState` schema as the shared wire format for web and cloud sync. Do not use Android's runtime `PracticePersistedState` as the contract.

## Cloud Sync Implications

The current canonical schema is a good local persistence format, but it is not yet a complete cloud sync protocol.

Sync-friendly pieces:

- core mutable rows have stable IDs
- core mutable rows have timestamps
- score/study/video/note/journal arrays can merge by ID
- custom groups have stable IDs
- schema version is explicit

Risky pieces:

- deletions are destructive array removals
- groups do not have `updatedAt` or `deletedAt`
- scalar maps do not have per-key update metadata:
  - `gameSummaryNotes`
  - `rulesheetResumeOffsets`
  - `videoResumeHints`
- settings do not have per-field update metadata:
  - `practiceSettings`
  - `leagueSettings`
  - `analyticsSettings`
  - `syncSettings`
- journal rows and linked domain rows must stay consistent
- `gameBrowse` rows are automatically generated and may be noisy across devices
- imported league scores can duplicate if multiple devices import the same source data independently
- library activity events are derived and should not be blindly synced as Practice journal data

Recommended cloud additions before real multi-device sync:

- `deviceId` for every writer
- `updatedAt` for mutable rows
- tombstones or deleted records for removals
- operation IDs for multi-record writes
- deterministic import IDs or import provenance for league-imported scores
- explicit local-only handling for volatile UI state
- field-level or map-entry-level conflict policy for scalar maps/settings

Proposed sync stance:

- Sync user-authored Practice rows and custom groups.
- Sync game summary notes with per-game update metadata.
- Sync settings only after classifying each field as account-level, profile-level, or device-local.
- Keep recent searches, selected library filter, temporary sheet state, and scanner state device-local.
- Consider keeping `gameBrowse` local-only or deduping it aggressively.
- Treat hosted library and league data as shared reference data, not user sync payload.

## Web V1 Scope

Practice web v1 should recreate the native Practice logging loop before adding heavier features.

Recommended v1:

- Practice Home dashboard
- Game Search
- Game Workspace:
  - Summary
  - Input
  - Study
  - Log
  - Game Note
- Quick Entry:
  - Score
  - Study
  - Practice
  - Mechanics
- Settings:
  - profile
  - IFPA/PRPA IDs
  - league import linkage
  - recovery/reset controls
- Group Dashboard
- Group Editor
- Journal Timeline
- Journal Entry Editor
- Mechanics tracker
- local persistence using the canonical schema
- import/export of canonical Practice JSON for early cross-device testing
- iOS Settings export path for producing real `practice-state-json` files from the reference app

Recommended v1 defer:

- camera OCR
- media attachments
- full cloud sync UI if the backend contract is not ready
- advanced native-specific ranking profile behaviors
- GameRoom

## Web Data Architecture Recommendation

Build the web app around three data layers:

1. Hosted reference data

   Catalog/library/rulesheet/playfield/video/league-target data fetched from the existing website/Admin pipeline.

2. Canonical Practice state

   User-owned Practice JSON using the iOS/Android canonical schema.

3. Sync envelope

   A cloud wrapper around canonical state changes that adds writer, update, deletion, conflict, and revision metadata.

The web app should not invent a third Practice domain model. It can have UI view models, but the persisted user model should round-trip through the canonical schema.

## Open Questions

- What account/auth system should own Practice cloud sync on `pinprof.com`?
- Should cloud sync be local-first with manual enablement, matching current `cloudSyncEnabled` settings?
- Should the first web version store only in browser local storage/IndexedDB, then add account sync?
- Should `gameBrowse` journal events sync, stay local-only, or sync only after dedupe?
- Should imported LPL scores sync as user data, or should each client derive them from hosted league stats?
- Should game summary notes be converted from a map to per-game note records before cloud sync?
- Should group deletions become tombstones in schema v5?
- Should the same cloud schema also cover GameRoom, or should GameRoom share only the identity/catalog layer?
- Should `pinprof.com` host its own `/pinball` data payloads or consume from `pillyliu.com`?

## Next Work

1. Create a shared canonical Practice fixture used by iOS, Android, and web tests.
2. Add encode/decode golden tests on both native platforms that compare the same fixture semantically.
3. Draft schema v5 sync metadata before building the cloud backend.
4. Build a web Practice data package that can load, validate, mutate, and export canonical Practice state.
5. Prototype the Practice Home and Game Workspace on `pinprof.com`.
6. Add local import/export before account sync so cross-platform compatibility can be tested with real user data.
7. Use the Practice group model as the reference when designing GameRoom's web data shape.

## Implementation Checkpoint

2026-04-25:

- Added `/practice/` as a static PinProf.com web app route.
- Added canonical Practice JSON import/export with local browser persistence.
- Added a sample schema v4 Practice JSON file for smoke testing.
- Added score logging into canonical `scoreEntries` plus `journalEntries`.
- Added OPDB/catalog loading from mirrored `/pinball/data/opdb_export.json`.
- Added asset loading from mirrored rulesheet, playfield, video, gameinfo, and backglass payloads.
- Added a local `/pinball` mirror helper that links Admin app-preload data and Admin asset folders without committing generated payloads.
- Updated the Pillyliu deploy flow so PinProf.com preserves and refreshes its own `/pinball/` mirror.

2026-04-26:

- Added `npm run practice:roundtrip` as a web Practice JSON guardrail.
- The harness imports the current web normalizer/validator/catalog loader, normalizes a Practice JSON file, exports canonical JSON, re-imports it, and compares canonical JSON, record counts, linked journal/domain rows, and validation counts.
- By default, the harness reads the local mirrored `/pinball` OPDB, asset, target, league, and mapping payloads from disk so command-line validation matches the browser app's catalog-aware checks.
- The default sample fixture passes the catalog-aware round-trip with no validation errors; `--no-catalog` keeps the command usable without a local `/pinball` mirror and reports catalog coverage as info-only.
- Added local browser-only Practice checkpoints for import/sample/manual/export events, with stable hashes, validation counts, row counts, OPDB coverage, asset coverage, and activity range shown in Settings.
- Drafted `docs/practice-sync-envelope-v5.md` and added a Settings `Download Sync Seed` action that wraps canonical schema v4 Practice JSON with sync metadata, hashes, validation, coverage, record identity, transaction-group hints, and empty tombstone space for cloud-sync experiments.
- Updated import handling so the web app accepts plain canonical Practice JSON or a Practice sync seed envelope, verifies the embedded canonical hash when present, and rejects unsupported JSON instead of silently normalizing it to an empty Practice state.
- Expanded `npm run practice:roundtrip` to cover sync seed export/import stability, canonical hash matching, tamper rejection, and unsupported import rejection.
- Added `npm run practice:writepaths` as a mutation guardrail for the web Practice write paths. It can run against the bundled sample or a real exported Practice JSON file, adds/edits/deletes representative score, study, video, note, mechanics, practice-session, playfield, group, journal, and summary-note rows in memory, then verifies linked rows, canonical re-import stability, and sync seed re-import stability.
- The write-path harness treats pre-existing catalog or orphan warnings as reportable data rather than immediate failure, so known real-export warnings do not hide whether newly written rows are linked correctly.
