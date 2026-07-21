# WNMU-TV Viewer Questionnaire — Local Test

This repository contains the five-stage WNMU-TV core viewer questionnaire, the local core-results preview, and five optional follow-up questionnaire mockups linked to a completed core response.

## Core questionnaire

The respondent starts from a five-stage hub:

1. About You
2. WNMU & You
3. What You Watch
4. What You Want
5. How We're Doing

The core questionnaire targets approximately 6–8 minutes. Drafts save automatically in the current browser, and stages may be completed in any order.

Every stage uses **Complete stage**. Finishing the numerically final stage does not submit the questionnaire. After all five stages are complete, the hub displays **Submit questionnaire**. The thank-you screen appears only after the response has been stored successfully.

## Landing page and brand

The landing page uses the official WNMU-TV logo referenced by WNMU Home from the WNMU Programming Library. `css/brand.css` is the canonical core-questionnaire branding layer and follows the WNMU Home navy, blue, green, background, and border palette.

The current test page references the logo through the Programming Library raw-file URL. Before public production, copy that logo into the questionnaire asset set so the public application does not depend on another repository at runtime.

The desktop landing layout reserves measured vertical space for the full introduction before the stage cards. Saved-draft and ready-to-submit panels sit below the cards, and the questionnaire facts and footer remain below those panels. At 900 pixels and below, those elements use document flow and named grid rows rather than fixed vertical positions.

## Linked optional follow-up questionnaires

After the core response is submitted, the thank-you page offers five working test modules:

- Local and Upper Peninsula programming, 5–7 minutes
- Programming interests and ideas, 5–7 minutes
- Online viewing, PBS App, and Passport, 4–6 minutes
- Children's programming and education, 4–6 minutes, when applicable
- Communication and finding programs, 3–5 minutes

Each module has two pages and eight optional questions. The detailed question IDs, values, purposes, and analytics contract are in `FOLLOW_UP_QUESTIONNAIRE_SPEC.md`.

### Continuing later without repeating the core

The thank-you page creates a private continuation record linked to:

- the existing pseudonymous respondent ID
- the submitted core response ID
- the core questionnaire schema version
- a separate long random continuation token

Respondents may:

- open a module immediately
- copy a private link to the follow-up hub
- open their own email application with the private link already in the message
- return later and continue saved module drafts
- complete one, several, or none of the modules

The follow-up hub confirms that the core questionnaire is already complete and does not ask the respondent to repeat it. It uses selected core information, such as programming priorities, as context where useful.

The continuation token is kept in a separate access record and appears in the URL fragment. It is not stored inside follow-up answer records.

**Current test limitation:** no database is connected, so the private link works later only in the browser where the core questionnaire was submitted. Production must store the token mapping in the approved database so the same link works across devices.

### Follow-up test review

The follow-up hub shows each module as:

- Not started
- Saved for later
- Completed

Its Test tools section downloads the follow-up responses linked to that core response as JSON. Aggregate and qualitative follow-up dashboards and CSV exports remain production work.

## Open locally

Run `OPEN-QUESTIONNAIRE.bat`, then open:

```text
http://localhost:8765/index.html
```

After submitting a test core response, use the private links on the thank-you screen to open the follow-up hub.

While the authoritative mode is Test, the landing-page footer also shows **Test Thank You page**. It opens the normal respondent-facing Thank You screen using the latest completed v6 response in that browser. When none exists, the app creates a clearly marked internal preview record solely to support linked-page testing; that record uses a non-v6 preview schema and is excluded from v6 questionnaire results. The Thank You page itself does not display preview or test commentary. The shortcut is hidden outside Test Mode and must be removed before public release.

Run `OPEN-RESULTS.bat`, then open:

```text
http://localhost:8765/results.html
```

The core results page begins with 25 clearly marked synthetic responses aligned with the v6 core schema. **Use submitted browser responses** loads v6 core questionnaires submitted in that browser.

## Active mode and versions

The authoritative configuration is `js/config.js`.

- core schema: `wnmu-viewer-questionnaire-v6`
- follow-up schema: `wnmu-viewer-follow-ups-v1`
- build: `6.1.2-test`
- mode: Test
- release date: 2026-07-20

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
- `js/questions-final.js`: How We're Doing, follow-up menu labels, and final core assembly
- `js/app-core.js`: shared application state, routing helpers, status, save, and sound
- `js/app-question-render.js`: ordinary core-question rendering
- `js/app-matrix-render.js`: core matrices and paired importance/performance rendering
- `js/app-navigation.js`: core stage/page navigation, validation, completion, and submission
- `js/app-completion.js`: core input handling and linked thank-you/follow-up actions
- `js/app.js`: core DOM initialization and event wiring
- `js/storage.js`: core and follow-up browser storage, respondent IDs, and continuation records
- `css/brand.css`: core brand treatment and landing-page spacing

Follow-up questionnaires:

- `follow-up.html`: linked follow-up hub, questionnaire shell, and completion view
- `js/follow-up-definitions.js`: five module definitions and 40 stable follow-up question IDs
- `js/follow-up-app.js`: token resolution, linked-core context, drafts, module navigation, submission, and JSON review export
- `css/follow-up.css`: responsive follow-up interface
- `FOLLOW_UP_QUESTIONNAIRE_SPEC.md`: follow-up blueprint, stored values, linkage, and analytics purposes

Results and documentation:

- `js/results-controller.js`: core-results state, loading, filters, and shared helpers
- `js/results-summary-render.js`: core audience, channel, programming, and comment summaries
- `js/results-gap-render.js`: paired core importance/performance analysis
- `js/results-export.js`: core JSON and CSV export
- `js/results-data.js`: synthetic v6 core responses and results initialization
- `QUESTIONNAIRE_SPEC.md`: living core blueprint and linkage contract

## Production work still required

Before public launch:

- remove the test-only **Test Thank You page** shortcut from the landing page
- copy the official logo into the production asset set
- connect the approved production database
- make private continuation links work across devices
- define continuation-token expiration, revocation, and withdrawal behavior
- protect core and follow-up results
- build aggregate and qualitative follow-up results and CSV exports
- publish privacy, linkage, retention, and withdrawal information
- implement optional server-side email delivery separately from answer records
- disable blank test navigation
- prevent synthetic data from becoming the live source
- verify official station, channel, PBS.org, PBS App, and Passport wording
- complete phone/desktop, portrait/landscape, keyboard, screen-reader, focus, reduced-motion, routing, save/resume, continuation-link, submission, results, import, and export QA
