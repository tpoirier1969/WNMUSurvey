# WNMU-TV Viewer Direction Questionnaire — Local Prototype

A standalone adaptive viewer questionnaire and local response analyzer.

## What is included

- `index.html` — adaptive questionnaire.
- `results.html` — local analyzer with demographic and viewing-method filters.
- `js/questions.js` — questionnaire wording, options, routing rules, and expectation/performance pairs.
- `js/app.js` — routing, section rendering, slide transitions, autosave, export, and local submission.
- `js/storage.js` — isolated local storage adapter. This is the seam to replace or extend with Supabase later.
- `js/results.js` — local/imported JSON analysis, filters, gap calculation, comments, and CSV export.
- `css/styles.css` — responsive layout and questionnaire styling.
- `start-local.bat` — Windows launcher using Python's local web server.
- `start-local.sh` — macOS/Linux launcher.

## Run it on Windows

1. Extract the ZIP.
2. Double-click `start-local.bat`.
3. A browser should open to `http://localhost:8765`.
4. Keep the command window open while using the site.

If Python is not installed, opening `index.html` directly may still work, but a local server is more reliable for browser storage and file behavior.

## Data behavior

- Drafts save to browser local storage as the respondent works.
- Submitted responses also save only to browser local storage.
- Responses can be exported from `results.html` as JSON.
- Summary statistics can be exported as CSV.
- Imported JSON is analyzed in memory and is not automatically added to browser storage.
- Demonstration data is synthetic and is never stored unless manually exported.

## Adaptive routing

The first four answers determine the route:

- Viewer status controls whether station-performance questions appear.
- Broadcast/cable/satellite methods add the reception and traditional-TV section.
- Online methods add usability-specific questions inside the online section.
- Former viewers, non-viewers, and uncertain viewers receive a barrier/re-entry section.
- Households, educators, and caregivers who select children's content receive the PBS KIDS/education section.
- Everyone receives expectations, programming interests, communication, and optional demographics.

## Analyzer filters

All results recalculate when filtered by:

- Viewer type
- Viewing method
- Age range
- County/region
- Children's-programming role

The expectation gap is calculated as:

`importance average - performance average`

A larger positive result means respondents rate that role as important but rate WNMU-TV's delivery lower.

## Editing the questionnaire

Most wording is in `js/questions.js`.

Keep existing question IDs stable after real responses begin. Changing labels is generally safe; changing IDs will split old and new answers during analysis.

Question types currently supported:

- `radio`
- `checkbox`
- `select`
- `text`
- `textarea`
- `scale`
- `matrix`

Routing conditions currently supported:

- `viewerStatusIn`
- `viewerStatusNotIn`
- `hasAnyMethod`
- `hasAnyRelationship`
- `childrenRoleIn`
- `answerIn`
- `answerNotIn`
- nested `all` and `any`

## Future Supabase conversion

Do not scatter database calls through `app.js`. Extend `js/storage.js` with a remote submission method while preserving the current response object:

```js
{
  id,
  createdAt,
  surveyVersion,
  source,
  routeProfile,
  answers,
  routeSectionIds
}
```

Recommended public deployment behavior:

- Anonymous users may insert responses.
- Public users should not be allowed to select/read all responses.
- Results should be analyzed through a private admin path or exported data.
- Use a WNMU-specific table name rather than sharing another project's table.

## Before management or public distribution

1. Review every question and remove anything management will not actually analyze.
2. Decide whether household income has a defined use; remove it if not.
3. Confirm the preferred service area/county list.
4. Replace draft branding with approved WNMU-TV assets.
5. Test antenna, online, non-viewer, and children's paths on phone and desktop.
6. Decide how non-digital viewers will be included so the sample is not merely “people who saw an online survey.”
