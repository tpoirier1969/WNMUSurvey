# WNMU-TV Questionnaire Rebuild

This folder is a fully isolated rebuild of the WNMU-TV viewer questionnaire application. It must not import or share runtime files or storage keys with the root application.

## Required application scope

The rebuild is not complete if it contains only the five-stage core questionnaire. Its required application boundary includes:

1. the five-stage main questionnaire
2. successful core submission and a real Thank You experience
3. five optional follow-up questionnaires offered from the Thank You page
4. children and education follow-up eligibility based on the submitted `children_role`
5. private same-browser continuation links in test mode
6. pseudonymous linkage through `respondentId`, `coreResponseId`, and a separate access record
7. separate per-module drafts and submitted follow-up records
8. rebuild-native results that keep core and follow-up denominators honest

The active follow-up schema remains `wnmu-viewer-follow-ups-v2`, with 40 live question IDs, eight in each module. The canonical question meanings and stored values remain governed by the root `QUESTIONNAIRE_SPEC.md` and `FOLLOW_UP_QUESTIONNAIRE_SPEC.md`.

## Shared layout contract

The main questionnaire sets the visual scale for the entire rebuild. The Thank You, follow-up, and results pages must use the same responsive frame and panel constraints:

- outer frame no wider than 1,316 pixels
- primary content panel no wider than 1,160 pixels
- compact 20–22 pixel desktop panel padding
- 44-pixel minimum interactive controls
- the same 900-pixel and 680-pixel responsive breakpoints used by the main survey
- no horizontal scrolling, overlapping controls, or oversized secondary-page headings

Secondary pages may contain more data, but they must not introduce a larger visual scale than the questionnaire.

## Canonical rebuild files

- `index.html`, `app.js`, `questions.js`: core questionnaire
- `thank-you.js`: submission completion and optional follow-up offer
- `follow-up.html`, `follow-up-app.js`, `follow-up-definitions.js`: follow-up hub and modules
- `results.html`, `results.js`: linked rebuild results
- `config.js`: mode, schema, paths, and isolated storage keys
- `storage.js`: core submissions, access records, follow-up drafts, and follow-up submissions
- `styles.css`, `thank-you.css`, `follow-up.css`, `results.css`: interface styling by durable responsibility

## Current mode and limitation

The rebuild is currently in test mode and uses browser local storage. Private continuation links therefore work only in the browser and origin where the core questionnaire was submitted. Public production still requires approved protected server-side storage, protected results access, and production privacy language.