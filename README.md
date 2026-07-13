# WNMU-TV Viewer Questionnaire — Local Test

This package has two separate entry points so the public questionnaire stays clean.

## Open the questionnaire

Double-click **`OPEN-QUESTIONNAIRE.bat`**.

This opens the respondent-facing questionnaire. The first few answers quietly control which later questions appear. Respondents are not asked to build or select a questionnaire.

## Open the results preview

Double-click **`OPEN-RESULTS.bat`**.

No login is required in this test version. The results page automatically opens with **25 synthetic Upper Peninsula PBS audience responses**. The sample is weighted toward:

- viewers over age 50
- a 60/40 woman-to-man split
- college or technical education
- rural and small-town Upper Peninsula households
- antenna, cable, satellite, PBS app, Passport, and online viewing
- strong interest in Upper Peninsula history, Great Lakes, outdoors, nature, documentaries, public affairs, arts, and British programming

The synthetic responses are marked as test data. Use **Use submitted browser responses** to switch to questionnaires completed on that browser.

## Addresses while the local server is running

- Questionnaire: `http://localhost:8765/index.html`
- Results: `http://localhost:8765/results.html`

## Future deployment

The public questionnaire and results page are separate now. Before launch, the results page should be placed behind an admin login and local browser storage should be replaced with the approved database, such as Supabase.
