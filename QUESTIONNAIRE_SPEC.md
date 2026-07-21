# QUESTIONNAIRE_SPEC.md — WNMU-TV Viewer Questionnaire

## 1. Release contract

- Schema: `wnmu-viewer-questionnaire-v6`
- Build: `6.1.2-test`
- Release date: 2026-07-20
- Mode: Test
- Campaign: `viewer-questionnaire-2026`
- Survey part: `core`
- Primary stages: About You; WNMU & You; What You Watch; What You Want; How We're Doing
- Target core time: approximately 6–8 minutes
- Follow-up schema: `wnmu-viewer-follow-ups-v1`

This remains a clean pre-production revision. No Supabase database or production responses exist. Prototype responses do not count as research data.

## 2. Landing page and branding

The landing page uses the official WNMU-TV logo already used by the WNMU Home project. The current source is `WNMU-TV-logo-head2019.png` in `tpoirier1969/WNMU-Programming-library`.

The canonical questionnaire brand layer is `css/brand.css`. Its primary palette follows the WNMU Home visual system:

- navy: `#17345f`
- blue: `#315f8c`
- green: `#376d5c`
- page background: `#edf2f7`
- border: `#d9e2ec`

The landing introduction explains that WNMU-TV is beginning an ongoing process to understand viewers, earn their support, and change with their needs and viewing habits. It also tells respondents that the five stages may be completed in any order.

On screens wider than 900 pixels, the stage cards must begin below the complete landing introduction with visible separation. The cards, saved-draft panel, ready-to-submit panel, questionnaire facts, and footer must not overlap. At 900 pixels and below, those elements remain in document flow and the ready-to-submit panel occupies its own grid row.

## 3. Stage completion and submission

A stage is **Not started** with no saved answers and no explicit completion, **In progress** after at least one stored answer, and **Complete** only after the respondent selects **Complete stage** and all applicable required questions are answered.

Opening pages does not complete a stage. All five stages use the same completion behavior. When every stage is complete, the hub shows **Submit questionnaire**. Submission is not tied to Stage 5 or to completing stages in order. The thank-you screen appears only after successful storage. Optional blanks do not block submission.

Required questions:

- `children_role`
- `viewer_status`
- `viewing_methods`

Hidden answers may remain in a draft so they can reappear if routing changes, but hidden answers are excluded from submission and analytics.

## 4. Rating scales and presentation

- Interest: `1` Not interested, `2` Slightly, `3` Moderately, `4` Very, `5` Extremely, `na` Not sure
- Shared importance/performance scale: `1` Very low, `2` Low, `3` Moderate, `4` High, `5` Very high, `na` Unable to rate

`na` and missing answers are excluded from numeric averages.

Rating pages use one scale key before the first rated item. Each item appears as a compact flat row with 1–5 and the unable-to-rate option. Importance and performance use the same user-facing scale and share one role row when both apply. The role statements in Priorities and Performance use slightly larger type than other compact labels so they remain visually prominent without increasing the section footprint. The layout must not create horizontal page scrolling.

## 5. Active core questionnaire

### Stage 1 — About You

| ID | Wording / values | Required | Routing / analytics |
|---|---|---:|---|
| `county_region` | What county or area do you live in? U.P. counties, northern Wisconsin, other Michigan, other state, Canada, prefer not | No | Geography filter |
| `community_type` | Which best describes where you live? `city`, `town`, `rural`, `prefer_not` | No | Community comparison |
| `age_range` | Under 18 through 85+, prefer not | No | Age filter |
| `internet_streaming_quality` | How well does home internet support streaming WNMU-TV, PBS, or other video? `works_well`, `adequate`, `slow`, `unreliable`, `none`, `not_tried`, `prefer_not` | No | Streaming access |
| `children_role` | Do you select or recommend programming for children? `household`, `educator`, `both`, `neither` | Yes | Child-detail and follow-up routing |

“Slow” means video is often too slow for comfortable streaming. “Unreliable” means service is frequently unavailable or unpredictable. Respondents choosing `neither` do not see detailed children-use, children-needs, or the optional children's follow-up questionnaire, but the broad children's-programming category remains available.

### Stage 2 — WNMU & You

| ID | Wording / values | Required | Routing / analytics |
|---|---|---:|---|
| `station_awareness` | Before today, what did you know about WNMU-TV? `local_pbs`, `station_not_pbs`, `name_only`, `not_heard` | No | Awareness |
| `viewer_status` | Past-12-month WNMU viewing: `regular`, `occasional`, `once_twice`, `former`, `never`, `unsure` | Yes | Viewer filter and performance routing |
| `viewing_methods` | Antenna, cable/satellite, WNMU livestream, `pbs_app`, `pbs_org`, PBS Passport through WNMU-TV, YouTube TV, YouTube, not watched | Yes | Method filter; not watched is exclusive |
| `channel_awareness` | “WNMU-TV broadcasts four channels. Before this questionnaire, which were you aware of?” | No | Channel awareness |
| `channels_received` | Which four WNMU-TV channels can you receive? | No | Antenna, cable/satellite, or YouTube TV users only |
| `online_awareness` | Awareness of WNMU website/livestream, `pbs_org`, `pbs_app`, Passport, PBS KIDS app, YouTube, and social media | No | Online awareness |

`pbs_org` and `pbs_app` are separate stored values. The PBS.org website and PBS App must never be combined into one response choice in the Access, Channels, and Online Services section.

Viewer-facing channels are WNMU-TV 13.1, PBS KIDS 24/7 13.2, WNMU-TV Plus 13.3, and Michigan Learning Channel 13.4. The over-the-air reception-quality question is retired from the core.

### Stage 3 — What You Watch

| ID | Wording / values | Required | Routing / analytics |
|---|---|---:|---|
| `channels_watched` | Which WNMU-TV channels do you watch, even occasionally? | No | Hidden for never-viewers |
| `watch_preference` | Scheduled, recorded, on demand, livestream, short clips, depends, no preference | No | Viewing preference |
| `program_category_interest` | Interest in the 17 shared categories, presented as one compact flat 1–5 list with a single scale key | No | Average interest by category |
| `valued_programs` | Current or past WNMU-TV/PBS programs that were valuable or memorable | No | Open response |
| `kids_use` | Broadcast, PBS KIDS app, PBS App/PBS.org, YouTube, classroom/library/childcare, not used | No | Child-programming roles only |

### Shared programming categories

Both `program_category_interest` and `program_category_priorities` use:

1. `history_biography` — History and biography
2. `environment_nature` — Environment, nature, and wildlife
3. `outdoor_recreation` — Outdoor recreation
4. `regional_documentaries` — Upper Peninsula and regional documentaries
5. `local_news_public_affairs` — Local news and public affairs
6. `health_wellness` — Health and wellness
7. `home_garden` — Home and garden
8. `arts_performance` — Arts, music, and performance
9. `children_education` — Children's programming and education
10. `science_technology` — Science and technology
11. `national_pbs_documentaries` — National PBS documentaries
12. `national_international_news` — National and international news
13. `drama_mysteries` — Drama and mysteries
14. `food_cooking` — Food and cooking
15. `regional_travel` — Regional travel and exploration
16. `world_travel` — U.S. and world travel
17. `independent_film` — Independent film

### Stage 4 — What You Want

| ID | Wording / values | Required | Routing / analytics |
|---|---|---:|---|
| `program_category_priorities` | Choose five categories for greatest WNMU-TV attention | No | Top-five counts and linked follow-up context |
| `local_formats` | Choose up to three local/regional formats | No | Format preference |
| `online_improvements` | Clear how/where to watch, local access, search, notifications, app help, Passport clarity, nothing | No | Choose up to three; nothing exclusive |
| `learn_preferred` | On-air, TV guide, printed guide, WNMU/PBS website, PBS App, email, Facebook, Instagram, YouTube, radio, text/app notification | No | Choose up to three |
| `kids_needs` | Children's, family, classroom, or educator resources WNMU-TV should provide more of | No | Child-programming roles only |

The online list excludes more full episodes, larger local archive, and device compatibility. The communication list excludes community organizations and newspapers.

### Stage 5 — How We're Doing

Importance and performance appear together in a compact flat list. One shared key appears before the first role: `1` Very low through `5` Very high, plus Unable to rate. Each role contains the role statement, an **Importance** control, and, when applicable, a **Performance** control. The controls appear side by side on wider screens and wrap when necessary to protect phone readability. Performance is hidden after a respondent explicitly identifies as a former or never viewer. When Stage 5 is opened before viewer status has been answered, performance remains visible provisionally.

| ID | Wording / values | Required | Routing / analytics |
|---|---|---:|---|
| `station_role_importance` | Importance of nine station roles | No | All; paired gap analysis |
| `station_role_performance` | Performance on the same roles | No | Hidden for explicitly never/former viewers; paired gap analysis |
| `reflects_me` | How well WNMU-TV reflects people like the respondent | No | Hidden for never/former |
| `trust_station` | Trust in WNMU-TV programming and information | No | Hidden for never/former |
| `nonviewer_reasons` | Reasons for not watching more often | No | Former, never, unsure |
| `nonviewer_return` | Program, service, or change likely to attract or regain respondent | No | Former, never, unsure |
| `final_feedback` | What is WNMU-TV doing well? Where could WNMU-TV improve? What else would you like us to know? | No | All; open response |

Station roles:

1. `trusted_public_media` — Select and provide trusted national and regional public-television programming
2. `up_programming` — Provide programs about the Upper Peninsula, whether produced by WNMU-TV or by other producers
3. `regional_issues` — Cover important regional issues and public affairs
4. `reflect_region` — Reflect the people, places, communities, and cultures of the region
5. `children_families` — Provide educational programming for children and families
6. `science_nature` — Provide science, nature, and environmental programming
7. `arts_culture` — Provide arts, music, and cultural programming
8. `online_access` — Make programs easy to find online and on demand
9. `access_for_all` — Serve people with disabilities or limited and unreliable internet access

The former separate history role is removed. The Local and Upper Peninsula follow-up separately measures demand for original WNMU-TV production.

## 6. Optional follow-up questionnaires

After successful core submission, the thank-you screen offers five working test-mode modules:

- Local and Upper Peninsula programming, 5–7 minutes
- Programming interests and ideas, 5–7 minutes
- Online viewing, PBS App, and Passport, 4–6 minutes
- Children's programming and education, 4–6 minutes, only when applicable
- Communication and finding programs, 3–5 minutes

Each module has two pages and eight optional questions. The detailed question IDs, values, purposes, and analytics are maintained in `FOLLOW_UP_QUESTIONNAIRE_SPEC.md`.

The core thank-you page creates a random private continuation token and offers:

- direct private links to each eligible module
- a copyable private link to the follow-up hub
- an option to open the respondent's own email application with the link
- **I'm done now**

The test-only landing-page shortcut may create an internal non-v6 preview response when no completed v6 response exists. That record is excluded from v6 results. The Thank You page always uses the same respondent-facing wording and controls, without preview labels, test limitations, or test-response controls.

The follow-up hub states that the core questionnaire is complete and does not ask the respondent to repeat it. It displays a limited summary of linked core information and shows each module as Not started, Saved for later, or Completed.

Follow-up drafts and responses use the same pseudonymous `respondentId` and the submitted `coreResponseId`. The continuation token is stored in a separate access record and appears in the URL fragment rather than in the ordinary query string or answer record.

Current test limitation: without Supabase or another approved database, the private link works later only in the browser where the core questionnaire was submitted. Production must store the token mapping server-side so the same link can work across devices.

Follow-up respondents are self-selected and must be reported with their own denominators.

## 7. Storage and analytics

Core drafts and responses record schema/build/mode, respondent ID, campaign, survey part, timestamps, route profile, answers, visible question IDs, and completed stages. Core answer records contain no name or email address.

Core storage keys:

- draft: `wnmuViewerSurveyDraft:v6`
- responses: `wnmuViewerSurveyResponses:v3`
- respondent ID: `wnmuViewerRespondentId:v1`

Follow-up storage keys:

- access records: `wnmuViewerFollowUpAccess:v1`
- module drafts: `wnmuViewerFollowUpDrafts:v1`
- module responses: `wnmuViewerFollowUpResponses:v1`

Analytics rules:

- Use only respondents who answered each question as its denominator.
- Exclude skipped and hidden answers.
- Keep `na`, unable-to-rate, not sure, and prefer not distinct from numeric or negative responses.
- Calculate each respondent's importance-performance gap first, then average paired gaps.
- Keep synthetic responses visibly marked and separate from real responses.
- Load only v6 records into the v6 core results dashboard.
- Never combine voluntary follow-up denominators with all core respondents without explicit labeling.
- Join future follow-up results to the core through `respondentId` and `coreResponseId`.
- Do not use the continuation token as an analytics field.

The current follow-up hub provides linked JSON export for test review. Protected aggregate and qualitative follow-up results remain production work.

## 8. Production checklist

Before public release:

- switch the authoritative mode to production
- disable blank navigation
- confirm required/optional policy
- verify station, channel, PBS.org, PBS App, and Passport facts
- connect the approved database
- make continuation links work across devices
- define token expiration, revocation, and withdrawal handling
- protect core and follow-up results
- build aggregate and qualitative follow-up results and CSV exports
- publish privacy, linkage, retention, and withdrawal information
- implement optional server-side email delivery separately from answer records
- prevent synthetic data from becoming the live source
- copy the official logo into the production asset set rather than relying on an external raw-file URL
- complete phone/desktop, portrait/landscape, keyboard, screen-reader, focus, reduced-motion, routing, draft, submission, continuation-link, follow-up, results, import, and export QA
