# WNMU-TV Viewer Questionnaire — Local Test

This repository contains the five-stage WNMU-TV core viewer questionnaire, a local results preview, and a placeholder landing page for optional follow-up questionnaires.

## Questionnaire structure

The respondent starts from a stage hub:

1. About You
2. WNMU & You
3. What You Watch
4. What You Want
5. How We're Doing

The core questionnaire targets approximately 6–8 minutes. Drafts save automatically in the current browser, and stages may be completed in any order.

Every stage uses **Complete stage**. Finishing the numerically final stage does not submit the questionnaire. After all five stages are complete, the stage hub displays **Submit questionnaire**. The thank-you screen appears only after the response has been stored successfully.

## Landing page and brand

The landing page uses the official WNMU-TV logo referenced by WNMU Home from the WNMU Programming Library. `css/brand.css` is the canonical questionnaire branding layer and aligns the app with the WNMU Home navy, blue, green, background, and border palette.

The current test page references the logo through the Programming Library raw-file URL. Before public production, copy that logo into the production asset set so the questionnaire does not depend on another repository at runtime.

## Optional follow-up questionnaires

After core submission, respondents may choose optional topic modules about:

- local and Upper Peninsula programming
- programming interests and ideas
- online viewing, the PBS App, and Passport
- children's programming and education, when applicable
- communication and finding programs

The current module buttons open `follow-up.html`, a temporary landing page that does not collect answers. The completion screen also offers a copyable follow-up-page link and an **I'm done now** action.

Future production follow-ups will use a random pseudonymous respondent ID and private continuation tokens. Email delivery of a private link will be optional and separate from answer records.

## Open locally

Run `OPEN-QUESTIONNAIRE.bat`, then open:

```text
http://localhost:8765/index.html
```

Run `OPEN-RESULTS.bat`, then open:

```text
http://localhost:8765/results.html
```

The results page begins with 25 clearly marked synthetic responses aligned with the v6 schema. **Use submitted browser responses** loads v6 questionnaires submitted in that browser.

## Active mode and versions

The authoritative configuration is `js/config.js`.

- schema: `wnmu-viewer-questionnaire-v6`
- build: `6.0.0-test`
- mode: Test
- release date: 2026-07-16

Test mode allows blank page navigation. It does not allow submission until all stages are explicitly complete and all applicable required questions are answered.

## Clean pre-production reset

No Supabase database or production response collection is active. Prototype v5 drafts and responses do not count as research data and are intentionally cleared rather than migrated into v6.

Current browser-storage keys:

- draft: `wnmuViewerSurveyDraft:v6`
- responses: `wnmuViewerSurveyResponses:v3`
- respondent ID: `wnmuViewerRespondentId:v1`

## Canonical files

- `js/config.js`: mode, versions, campaign, follow-up configuration, and storage keys
- `js/questions-foundation.js`: shared scales and About You definitions
- `js/questions-wnmu.js`: WNMU & You definitions, including separate PBS.org and PBS App values
- `js/questions-programming.js`: What You Watch and What You Want definitions
- `js/questions-final.js`: How We're Doing, shared roles, follow-up modules, and final survey assembly
- `js/app-core.js`: shared application state, routing helpers, status, save, and sound
- `js/app-question-render.js`: ordinary question rendering
- `js/app-matrix-render.js`: programming matrices and compact paired importance/performance rendering
- `js/app-navigation.js`: stage/page navigation, validation, completion, and hub submission
- `js/app-completion.js`: input handling and thank-you/follow-up actions
- `js/app.js`: DOM initialization and event wiring
- `js/storage.js`: current-schema browser storage and pseudonymous respondent ID
- `js/results-controller.js`: results state, loading, filters, and shared helpers
- `js/results-summary-render.js`: audience, channel, programming, and comment summaries
- `js/results-gap-render.js`: paired importance/performance analysis
- `js/results-export.js`: JSON and CSV export
- `js/results-data.js`: synthetic v6 responses and results initialization
- `css/brand.css`: official logo treatment and WNMU Home-aligned visual palette
- `QUESTIONNAIRE_SPEC.md`: living questionnaire blueprint and analytics contract
- `follow-up.html`: temporary landing page for future optional modules

## Local-test privacy and production work

Drafts and submitted test responses are stored only in browser local storage. A random pseudonymous respondent ID is stored separately so future questionnaires can be linked without putting a name or email address in answer records.

The placeholder follow-up page does not collect additional information. No email address is requested because no approved mail or database workflow exists yet.

Before public launch:

- copy the official logo into the production asset set
- connect the approved production database
- protect the results dashboard
- publish the approved privacy disclosure
- implement secure continuation tokens
- implement optional email delivery separately from answer records
- disable blank test navigation
- prevent synthetic data from becoming the live source
- verify official station, channel, PBS.org, PBS App, and Passport wording
