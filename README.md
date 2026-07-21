# WNMU-TV Viewer Questionnaire - Local Test

This repository contains the five-stage WNMU-TV core viewer questionnaire, five linked optional follow-up modules, and a local results dashboard for testing the complete questionnaire and reporting workflow.

## Active test contract

- core schema: `wnmu-viewer-questionnaire-v6`
- follow-up schema: `wnmu-viewer-follow-ups-v2`
- build: `6.2.0-test`
- release date: 2026-07-21
- mode: Test
- campaign: `viewer-questionnaire-2026`

No Supabase database or production response collection is active. Browser and synthetic responses are prototype test data and do not count as research data.

## Core questionnaire

The respondent starts from a five-stage hub:

1. About You
2. WNMU & You
3. What You Watch
4. What You Want
5. How We're Doing

The core targets about 6-8 minutes. Drafts save automatically in the current browser, stages may be completed in any order, and the questionnaire can be submitted only after all five stages are explicitly complete and all applicable required questions are answered.

Required core questions are `children_role`, `viewer_status`, and `viewing_methods`. Optional blanks do not block submission.

## Optional follow-up questionnaires

After a successful core submission, the Thank You screen offers five linked modules:

- Local and Upper Peninsula programming, 5-7 minutes
- Programming interests and ideas, 5-7 minutes
- Online viewing, PBS App, and Passport, 4-6 minutes
- Children's programming and education, 4-6 minutes, when eligible
- Communication and finding programs, 3-5 minutes

Each module has two pages and eight optional questions. The live follow-up specification contains 40 stable v2 question IDs.

### Follow-up v2 changes

Version 2:

- clarifies regional-area wording and expands representation choices
- explains how WNMU-TV may license qualifying work from independent producers
- displays the respondent's core programming priorities as read-only context instead of asking them to select the same priorities again
- adds `regional_music_performance_interest` for a possible 30- or 60-minute regional music-performance concept
- adds `program_development_ideas` for developable subjects, formats, audiences, and opportunities
- updates selection limits for program qualities, programming sources, special programming, and children's learning goals
- clarifies streaming/on-demand and broadcast-versus-streaming wording
- does not duplicate the broad children-and-families performance question already measured in the core

Retired v1 IDs are `deeper_priority_categories` and `program_recommendations`. They are not reused for new meanings.

### Continuing later

The Thank You page creates or reuses a private access record linked to the core response through a pseudonymous respondent ID and core response ID. The long continuation token appears in the URL fragment and separate access record, not inside answer records.

Current test limitation: the private link works only under the same browser origin. Production must store the token mapping in the approved database so the link works across devices.

## Results dashboard

Open `results.html` to review the six result sections:

1. Decision Brief foundation
2. Audience & Access
3. Programming Priorities
4. Performance & Opportunities
5. Viewer Voices
6. All Data & Export

The default Test dataset combines:

- 25 synthetic core responses
- valid v6 core responses submitted in the current browser
- 60 synthetic follow-up module responses
- valid v2 follow-up responses submitted in the current browser

Synthetic and browser-submitted records remain separately labeled. Older-schema records are excluded rather than reinterpreted.

Synthetic follow-up module counts:

- Local and Upper Peninsula programming: 14
- Programming interests and ideas: 13
- Online viewing: 12
- Children's programming and education: 7 eligible respondents
- Communication and finding programs: 14

Every live core and follow-up question appears in All Data & Export. Follow-up results use module-specific, self-selected denominators and are filtered through their linked core response IDs.

Exports:

- combined raw JSON for loaded core and follow-up records
- core summary CSV
- follow-up summary CSV with stable stored values, labels, module counts, answered/skipped counts, linkage fields, and schema versions

## Open locally

Run:

```text
OPEN-QUESTIONNAIRE.bat
```

Then open:

```text
http://localhost:8765/index.html
```

Results:

```text
http://localhost:8765/results.html
```

Use the same protocol, hostname, and port for the questionnaire, follow-up modules, and results. Browser local storage is separated by origin.

## Browser-storage keys

Core:

- draft: `wnmuViewerSurveyDraft:v6`
- responses: `wnmuViewerSurveyResponses:v3`
- respondent ID: `wnmuViewerRespondentId:v1`

Follow-up v2:

- access records: `wnmuViewerFollowUpAccess:v1`
- drafts: `wnmuViewerFollowUpDrafts:v2`
- responses: `wnmuViewerFollowUpResponses:v2`

Retired follow-up prototype history:

- `wnmuViewerFollowUpDrafts:v1`
- `wnmuViewerFollowUpResponses:v1`

The old v1 drafts and submissions are not loaded or migrated into v2. The access-record key remains unchanged so existing same-browser continuation links can still resolve to the linked core response.

## Canonical files

Configuration and storage:

- `js/config.js`: mode, versions, campaign, follow-up schema, and storage keys
- `js/storage.js`: core and follow-up browser storage, pseudonymous IDs, and continuation records

Core questionnaire:

- `js/questions-foundation.js`
- `js/questions-wnmu.js`
- `js/questions-programming.js`
- `js/questions-final.js`
- `js/app-core.js`
- `js/app-question-render.js`
- `js/app-matrix-render.js`
- `js/app-navigation.js`
- `js/app-completion.js`
- `js/app.js`

Follow-up questionnaires:

- `follow-up.html`: hub, two-page module shell, and completion view
- `js/follow-up-local.js`, `js/follow-up-programming.js`, `js/follow-up-online.js`, `js/follow-up-children.js`, and `js/follow-up-communication.js`: durable module definitions
- `js/follow-up-definitions.js`: assembles the five modules and publishes the 40 v2 question IDs
- `js/follow-up-app.js`: linkage, dynamic core-priority context, drafts, navigation, limits, submission, and linked JSON export
- `css/follow-up.css`: responsive follow-up interface
- `FOLLOW_UP_QUESTIONNAIRE_SPEC.md`: follow-up blueprint, stored values, compatibility, results, and exports

Results:

- `results.html`: six-section results interface
- `js/results-controller.js`: core/follow-up loading, filters, import, source counts, and controls
- `js/results-summary-render.js`: core summary rendering
- `js/results-detail-render.js`: complete core question rendering
- `js/results-gap-render.js`: paired importance-performance analysis
- `js/results-followup-data.js`: synthetic v2 follow-up responses
- `js/results-followup-render.js`: aggregate follow-up results and qualitative display
- `js/results-export.js`: combined raw JSON, core CSV, and follow-up CSV
- `js/results-data.js`: synthetic v6 core responses
- `css/results-sections.css`: results sections and All Data layout
- `RESULTS_COVERAGE_LEDGER.md`: canonical question-to-results inventory

Specifications and governance:

- `PROJECT_RULES.md`: controlling workflow and integrity rules
- `QUESTIONNAIRE_SPEC.md`: living core blueprint and linked-results contract
- `FOLLOW_UP_QUESTIONNAIRE_SPEC.md`: living follow-up blueprint

## Production work still required

Before public launch:

- connect and approve Supabase response storage
- use Supabase responses only in production results
- protect core and follow-up results
- make private continuation links work across devices
- define token expiration, revocation, editing, withdrawal, and retention
- publish final privacy and linkage information
- implement optional email delivery in a separate protected contact system
- remove test-only controls and synthetic data
- disable blank test navigation
- copy the WNMU-TV logo into the application asset set
- verify WNMU channel and PBS service wording against governing sources
- complete desktop, phone, keyboard, screen-reader, focus, reduced-motion, routing, save/resume, linkage, submission, filters, import, JSON, and CSV QA
