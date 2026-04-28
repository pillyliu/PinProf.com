# Practice Sync Envelope Draft

Status: draft contract for cloud/native sync
Date: 2026-04-26

This document defines the first sync wrapper for Practice. It intentionally keeps the current canonical Practice JSON intact so iOS, Android, and web can continue reading and writing the same saved payload while cloud sync is designed.

## Goals

- Keep canonical Practice state portable across iOS, Android, and web.
- Add cloud/native sync metadata outside the canonical row arrays.
- Preserve the existing normal export as plain Practice JSON.
- Provide a separate sync seed/envelope export for backend and cross-client testing.
- Make linked writes recoverable as transactions so score/study/video/note rows do not drift from Journal rows.
- Support deletes without requiring immediate destructive removal on every device.

## Current Canonical Payload

The current canonical Practice state is schema v4 and remains the user data source of truth:

```json
{
  "schemaVersion": 4,
  "studyEvents": [],
  "videoProgressEntries": [],
  "scoreEntries": [],
  "noteEntries": [],
  "journalEntries": [],
  "customGroups": [],
  "leagueSettings": {},
  "syncSettings": {},
  "analyticsSettings": {},
  "rulesheetResumeOffsets": {},
  "videoResumeHints": {},
  "gameSummaryNotes": {},
  "practiceSettings": {}
}
```

The web app must keep exporting this shape from `Export JSON`. Sync metadata belongs in a separate envelope until native clients are ready to decode it.

## Draft Envelope

```json
{
  "envelopeVersion": 1,
  "payloadType": "pinprof.practice.sync-seed",
  "generatedAt": "2026-04-26T00:00:00.000Z",
  "client": {
    "platform": "web",
    "app": "pinprof.com/practice",
    "canonicalSchemaVersion": 4
  },
  "base": {
    "canonicalHash": "sha256-of-normalized-practice-json",
    "canonicalSchemaVersion": 4
  },
  "state": {
    "schemaVersion": 4
  },
  "summary": {
    "rowCounts": {},
    "gameCoverage": {},
    "linkedData": {},
    "activityRange": {},
    "validation": {}
  },
  "syncDraft": {
    "schemaVersion": 5,
    "recommendedMode": "local-first",
    "recordIdentity": {},
    "transactionGroups": [],
    "tombstones": []
  }
}
```

## Record Identity

Cloud sync should treat these collections as independently mergeable records:

- `studyEvents` by `id`
- `videoProgressEntries` by `id`
- `scoreEntries` by `id`
- `noteEntries` by `id`
- `journalEntries` by `id`
- `customGroups` by `id`

Map-like fields need synthetic record keys:

- `gameSummaryNotes.{gameID}` by canonical Practice `gameID`
- `rulesheetResumeOffsets.{gameID}` by canonical Practice `gameID`
- `videoResumeHints.{gameID}` by canonical Practice `gameID`
- settings sections by section name: `leagueSettings`, `syncSettings`, `analyticsSettings`, `practiceSettings`

All game IDs inside synced records must be canonical Practice identities, not venue/source-specific row IDs.

## Transaction Groups

Some UI actions write multiple records and must be synced as one operation:

- score entry: `scoreEntries` row plus `journalEntries` row
- rulesheet progress: `studyEvents` row plus `journalEntries` row
- video progress: `videoProgressEntries`, optional `studyEvents`, plus `journalEntries`
- practice note/session: `noteEntries` row plus `journalEntries` row
- mechanics session: `noteEntries` row plus `journalEntries` row
- league CSV import: batch of imported `scoreEntries` plus matching `journalEntries`

The backend should store an operation or transaction ID when possible. If older exports lack that ID, clients can still reconcile linked rows by game, value, context/task, and timestamp tolerance, matching the current web validator.

## Tombstones

Deletes should become tombstones in the sync layer before any schema-v5 native persistence change:

```json
{
  "collection": "journalEntries",
  "id": "record-id",
  "deletedAt": "2026-04-26T00:00:00.000Z",
  "deletedByDeviceID": "device-id",
  "linkedRecords": [
    { "collection": "scoreEntries", "id": "linked-score-id" }
  ]
}
```

Tombstones are required for group deletes, journal deletes, and linked-row deletes. Archive/unarchive is not a tombstone; it stays as group state.

## Conflict Rules

- Append-only activity rows with distinct IDs are merged by union.
- Same ID edited on multiple devices uses latest valid `updatedAt` once schema v5 adds per-record metadata.
- Until per-record metadata exists, same-ID conflicts should prefer the server row with the latest activity timestamp and flag the conflict in a review report.
- Linked Journal/domain rows should be repaired together. Do not keep a deleted Journal row with an orphaned linked score/study/video/note row unless the row is explicitly marked journal-only.
- Settings use last-write-wins by section.
- `gameSummaryNotes` use last-write-wins by game ID unless converted to note records later.

## Backend Shape

Recommended v1 backend entities:

- user account
- sync profile
- device registration
- canonical Practice snapshot
- operation log
- tombstone log
- validation report

The backend can start snapshot-first: upload the full canonical state plus envelope metadata, validate it, then return a new server revision. Operation-level sync can come after the clients agree on transaction IDs.

## Web Implementation

The web app has two exports:

- `Export JSON`: plain canonical Practice state, suitable for iOS/Android import tests.
- `Download Sync Seed`: wrapper envelope for backend/cloud-sync experiments.

The web app import flow accepts both payloads:

- plain canonical Practice JSON is imported directly,
- sync seed JSON is unwrapped from `state`,
- `base.canonicalHash` is verified when present,
- unsupported JSON fails with an import error instead of replacing local Practice state with an empty normalized object.

`npm run practice:roundtrip` covers the same path in command-line validation: canonical JSON export/import stability, sync seed hash stability, sync seed import stability, tamper rejection, and unsupported import rejection.

The sync seed is not a commitment that schema v5 native persistence is final. It is a test harness around the current schema v4 state.
