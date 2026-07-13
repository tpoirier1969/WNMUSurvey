# WNMU-TV Viewer Questionnaire — Local Prototype v2

This package contains two separate experiences:

- `index.html` — the public-facing viewer questionnaire
- `admin.html` — the local administrative results dashboard

The public page does not show administrative controls or explain the internal branching. A viewer answers four initial questions about viewing behavior, then the site quietly includes or skips later sections as appropriate.

## Start the local site

On Windows, double-click:

`start-local.bat`

Then open:

- Questionnaire: `http://localhost:8765/index.html`
- Admin results: `http://localhost:8765/admin.html`

## Current data behavior

- Drafts save automatically in the browser.
- Submitted responses are stored in browser local storage.
- No information is sent to WNMU, Supabase, or any external service.
- The admin page opens with 25 synthetic test respondents.
- The synthetic sample is weighted toward older, educated Upper Peninsula PBS viewers, with a 60/40 woman-to-man split and strong interest in local history, Great Lakes topics, nature, outdoor recreation, documentaries, public affairs, and arts programming.
- Religion and race are not displayed because the questionnaire does not currently collect those fields.

## Admin access

Authentication is intentionally disabled for this local prototype. Before any public deployment, `admin.html` should be protected by an approved login system and the local storage adapter should be replaced with the approved response database.

## Files

- `index.html` — questionnaire
- `admin.html` — results dashboard
- `results.html` — redirects old bookmarks to `admin.html`
- `js/questions.js` — questions and conditional rules
- `js/app.js` — questionnaire flow and browser draft handling
- `js/results.js` — dashboard calculations and synthetic sample
- `js/storage.js` — replaceable local storage adapter
- `css/styles.css` — shared visual styling
