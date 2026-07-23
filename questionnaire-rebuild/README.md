# WNMU-TV Questionnaire Rebuild

This folder is a fully isolated rebuild of the WNMU-TV viewer questionnaire application. It must not import or share runtime files or storage keys with the root application.

## Required application scope

1. five-stage main questionnaire
2. successful submission and Thank You experience
3. five optional follow-up questionnaires
4. children follow-up eligibility and question-level professional-role routing
5. private same-browser continuation links in Test Mode
6. pseudonymous linkage through respondent, core response, and access IDs
7. separate per-module drafts and submissions
8. rebuild-native results with honest core, module, answered, skipped, and not-applicable denominators

Active schemas:

- core `wnmu-viewer-questionnaire-v7`, 31 live IDs
- follow-up `wnmu-viewer-follow-ups-v3`, 35 live IDs
- interface `rebuild-0.3.0`

Version 7 separates television and online measures for current category viewing, interest, and WNMU programming priorities. Version 3 removes internal production and partnership questions, treats regional music neutrally as one regional subject, narrows online questions to WNMU-controlled actions, and routes institutional children's questions only to professional or mixed-role respondents.

## Shared layout contract

- outer frame no wider than 1,316 pixels
- primary panel no wider than 1,160 pixels
- compact 20–22 pixel desktop panel padding
- 44-pixel minimum interactive controls
- 900-pixel and 680-pixel responsive breakpoints
- no horizontal scrolling, overlapping controls, or oversized secondary-page headings

## Canonical rebuild files

- `index.html`, `app.js`, `questions.js`: core questionnaire
- `thank-you.js`: completion and follow-up offer
- `follow-up.html`, `follow-up-app.js`, `follow-up-definitions.js`: follow-up hub and modules
- `results.html`, `results.js`: linked results
- `config.js`: mode, schemas, paths, and isolated storage keys
- `storage.js`: core and follow-up browser records
- CSS files: interface styling by durable responsibility

## Current mode and limitation

The rebuild is in Test Mode and uses browser local storage. Private links work only in the browser and origin where the core questionnaire was submitted. Public production requires approved protected server-side storage, protected results access, and final privacy language.
