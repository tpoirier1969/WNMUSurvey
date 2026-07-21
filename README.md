# WNMU-TV Viewer Questionnaire — Local Test

This repository contains the five-stage WNMU-TV core viewer questionnaire, the core-results test dashboard, and five optional follow-up questionnaires linked to a completed core response.

## Core questionnaire

The respondent starts from a five-stage hub:

1. About You
2. WNMU & You
3. What You Watch
4. What You Want
5. How We're Doing

The core questionnaire targets approximately 6–8 minutes. Drafts save automatically in the current browser, and stages may be completed in any order.

Every stage uses **Complete stage**. Finishing Stage 5 does not submit the questionnaire by itself. After all five stages are complete, the hub displays **Submit questionnaire**. The thank-you screen appears only after the response has been stored successfully.

## Landing page and brand

The landing page uses the official WNMU-TV logo referenced by WNMU Home from the WNMU Programming Library. `css/brand.css` is the canonical core-questionnaire branding layer.

The current test page references the logo through the Programming Library raw-file URL. Before production, copy the logo into the questionnaire asset set so the public application does not depend on another repository at runtime.

The desktop landing layout reserves space for the complete introduction before the stage cards. At 900 pixels and below, the landing elements remain in document flow.

## Linked optional follow-up questionnaires

After the core response is submitted, the thank-you page offers five test modules:

- Local and Upper Peninsula programming, 5–7 minutes
- Programming interests and ideas, 5–7 minutes
- Online viewing, PBS App, and Passport, 4–6 minutes
- Children's programming and education, 4–6 minutes, when applicable
- Communication and finding programs, 3–5 minutes

Each module has two pages and eight optional questions. The detailed IDs, values, purposes, and analytics contract are in `FOLLOW_UP_QUESTIONNAIRE_SPEC.md`.

### Continuing later without repeating the core

The thank-you page creates a private continuation record linked to the existing pseudonymous respondent ID, submitted core response ID, core schema version, and a separate long random token.

Respondents may open a module immediately, copy a private link, open their email application with the link already in a message, return later to a saved draft, and complete one, several, or none of the modules.

The continuation token appears in the URL fragment and is not stored inside follow-up answer records.

**Current test limitation:** no database is connected, so the private link works later only in the browser where the core questionnaire was submitted. Production must store the token mapping in the approved database so the same link works across devices.

The follow-up hub can download that linked respondent's follow-up responses as JSON. Aggregate follow-up results and CSV export remain later work.

## Core results dashboard

Run `OPEN-RESULTS.bat`, then open:

```text
http://localhost:8765/results.html
```

In Test mode, the dashboard automatically combines:

- 25 synthetic v6 responses
- every valid current-schema response submitted in the same browser

The dashboard shows separate synthetic and browser-submitted counts. Older, preview, and non-v6 browser records are excluded with the excluded count shown. Importing a JSON file temporarily replaces the loaded dataset until **Reload combined test responses** is selected.

The six result sections are:

1. **Decision Brief** — foundation only in build 6.1.3; interpretation rules remain later work
2. **Audience & Access**
3. **Programming Priorities**
4. **Performance & Opportunities**
5. **Viewer Voices**
6. **All Data & Export**

All 28 core questions appear in **All Data & Export**, with answered, skipped, and not-applicable counts. Standalone importance and performance results appear in addition to the paired-gap analysis. Viewer Voices groups original comments by their source question.

The synthetic records now exercise every core question and include several Michigan Learning Channel viewers. The online-use headline separately recognizes PBS App and PBS.org as valid online methods.

Raw JSON exports every loaded response. The summary CSV includes stable IDs and labels, source category, answered count, applicable count, skipped count, not-applicable count, filtered count, and calculation notes.

Production will remove synthetic and browser aggregation and load only approved Supabase responses.

## Open locally

Run `OPEN-QUESTIONNAIRE.bat`, then open:

```text
http://localhost:8765/index.html
```

After submitting a test core response, use the private links on the thank-you screen to open the follow-up hub.

While the authoritative mode is Test, the landing-page footer also shows **Test Thank You page**. It opens the normal respondent-facing Thank You screen using the latest completed v6 response in that browser. When none exists, the app may create a clearly marked internal non-v6 preview record solely to support linked-page testing. Preview records are excluded from v6 questionnaire results.

## Active mode and versions

The authoritative configuration is `js/config.js`.

- core schema: `wnmu-viewer-questionnaire-v6`
- follow-up schema: `wnmu-viewer-follow-ups-v1`
- build: `6.1.3-test`
- mode: Test
- release date: 2026-07-21

Test mode allows blank page navigation in the core. It does not allow core submission until all stages are explicitly complete and all applicable required questions are answered. All follow-up questions are optional.

## Browser-storage keys

Core:

- draft: `wnmuViewerSurveyDraft:v6`
- responses: `wnmuViewerSurveyResponses:v3`
- respondent ID: `wnmuViewerRespondentId:v1`

Follow-ups:

- continuation/access records: `wnmuViewerFollowUpAccess:v1`
- module drafts: `wnmuViewerFollowUpDrafts:v1`
- module responses: `wnmuViewerFollowUpResponses:v1`

No Supabase database or production response collection is active. Current browser data is prototype test data and does not count as research data.

## Canonical files

Core questionnaire:

- `js/config.js`: mode, versions, campaign, follow-up configuration, and storage keys
- `js/questions-foundation.js`: shared scales and About You definitions
- `js/questions-wnmu.js`: WNMU & You definitions
- `js/questions-programming.js`: What You Watch and What You Want definitions
- `js/questions-final.js`: How We're Doing and final core assembly
- `js/app-core.js`: state, routing helpers, status, save, and sound
- `js/app-question-render.js`: ordinary question rendering
- `js/app-matrix-render.js`: matrices and paired importance/performance rendering
- `js/app-navigation.js`: navigation, validation, completion, and submission
- `js/app-completion.js`: input handling and linked thank-you/follow-up actions
- `js/app.js`: DOM initialization and event wiring
- `js/storage.js`: core and follow-up browser storage and linkage records
- `css/brand.css`: core brand treatment and landing-page spacing

Follow-up questionnaires:

- `follow-up.html`: linked hub, questionnaire shell, and completion view
- `js/follow-up-definitions.js`: five modules and 40 stable question IDs
- `js/follow-up-app.js`: token resolution, linked context, drafts, navigation, submission, and JSON export
- `css/follow-up.css`: responsive follow-up interface
- `FOLLOW_UP_QUESTIONNAIRE_SPEC.md`: follow-up blueprint and analytics purposes

Results and documentation:

- `results.html`: six-section dashboard shell
- `js/results-controller.js`: combined loading, filters, source counts, and section navigation
- `js/results-summary-render.js`: headline and primary section summaries
- `js/results-detail-render.js`: routing-aware complete core coverage and Viewer Voices
- `js/results-gap-render.js`: paired importance/performance analysis
- `js/results-export.js`: raw JSON and coverage-aware summary CSV
- `js/results-data.js`: synthetic v6 test responses
- `css/results-sections.css`: dashboard section and responsive layout
- `QUESTIONNAIRE_SPEC.md`: living core blueprint and results contract
- `RESULTS_COVERAGE_LEDGER.md`: canonical question-to-results inventory

## Production work still required

Before public launch:

- remove the test-only Thank You shortcut
- copy the official logo into the production asset set
- connect the approved Supabase database
- replace combined test loading with Supabase-only responses
- protect results access
- make private continuation links work across devices
- define token expiration, revocation, and withdrawal behavior
- complete the Decision Brief interpretation layer
- build aggregate follow-up results and CSV export
- publish privacy, linkage, retention, and withdrawal information
- implement optional server-side email delivery separately from answer records
- disable blank test navigation
- prevent synthetic data from becoming a live source
- verify official station, channel, PBS.org, PBS App, and Passport wording
- complete phone/desktop, portrait/landscape, keyboard, screen-reader, focus, reduced-motion, routing, save/resume, continuation-link, submission, results, import, and export QA
