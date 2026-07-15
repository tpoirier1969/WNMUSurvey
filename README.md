# WNMU-TV Viewer Questionnaire — Local Test

This repository contains the five-stage WNMU-TV viewer questionnaire and its local results preview.

## Questionnaire structure

The respondent starts from a stage hub:

1. About You
2. WNMU & You
3. What You Watch
4. What You Want
5. How We're Doing

The core questionnaire is designed for approximately 6–8 minutes. Stage cards show Not started, In progress, or Complete. Drafts save automatically in the current browser, and respondents may return to the stage hub at any time.

## Open the questionnaire

Double-click **`OPEN-QUESTIONNAIRE.bat`**.

Local address:

```text
http://localhost:8765/index.html
```

## Open the results preview

Double-click **`OPEN-RESULTS.bat`**.

Local address:

```text
http://localhost:8765/results.html
```

The results page opens with 25 clearly marked synthetic Upper Peninsula PBS audience responses. Use **Use submitted browser responses** to review questionnaires submitted in that browser.

## Active mode and versions

The authoritative mode and version configuration is in `js/config.js`.

Current release:

- schema: `wnmu-viewer-questionnaire-v4`
- build: `4.0.0-test`
- mode: Test
- release date: 2026-07-15

Test mode allows blank navigation and blank submission. It does not delete or mutate canonical routing rules.

## Canonical files

- `js/config.js` — mode, versions, campaign, and storage keys
- `js/questions.js` — five-stage questionnaire definition, IDs, stored values, and routing
- `js/app.js` — stage hub, rendering, validation, routing, sound, save/resume, and submission
- `js/storage.js` — browser draft/response storage, pseudonymous respondent ID, and legacy draft migration
- `js/results.js` — synthetic data, filters, calculations, denominators, channel analytics, gap analytics, and exports
- `QUESTIONNAIRE_SPEC.md` — living questionnaire blueprint and compatibility record

## Local-test privacy

Drafts and submitted test responses are stored only in browser local storage. A random pseudonymous respondent ID is stored separately so future questionnaires can be linked without putting a name or email address in answer records.

This is not a production deployment. Before public launch:

- connect the approved response database
- protect the results dashboard
- publish the approved privacy disclosure
- disable blank test navigation and submission
- prevent synthetic data from becoming the live source
- verify official station and channel information

## Data compatibility

Older saved responses remain readable. Missing older answers remain missing and are not counted as no, none, zero, unaware, or uninterested.

The current viewer-facing programming categories use new IDs:

- `program_interest_v2`
- `top_program_priorities_v2`

Older internal Programming Library topic answers are not silently remapped into those categories.
