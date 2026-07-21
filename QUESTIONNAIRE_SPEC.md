# QUESTIONNAIRE_SPEC.md - WNMU-TV Viewer Questionnaire

## 1. Release contract

- Core schema: `wnmu-viewer-questionnaire-v6`
- Follow-up schema: `wnmu-viewer-follow-ups-v2`
- Build: `6.3.2-test`
- Release date: 2026-07-21
- Mode: Test
- Campaign: `viewer-questionnaire-2026`
- Core survey part: `core`
- Primary stages: About You; WNMU & You; What You Watch; What You Want; How We're Doing
- Target core time: approximately 6-8 minutes

This remains a pre-production test revision. No Supabase response collection is active. Browser and synthetic responses are prototype test data and do not count as research data.

## 2. Landing page and branding

The landing page uses the official WNMU-TV logo referenced from the WNMU Programming Library. `css/brand.css` is the canonical core-questionnaire branding layer. Before production, the logo must be copied into this application's asset set so the public questionnaire does not depend on another repository at runtime.

The landing page explains that the questionnaire begins an ongoing process to understand viewers and that the five stages may be completed in any order. The common phone layout must avoid horizontal scrolling, overlapping panels, and oversized introductory content.

## 3. Stage completion and submission

A stage is:

- **Not started** when it has no saved answers and has not been explicitly completed.
- **In progress** after at least one answer is saved.
- **Complete** only after the respondent selects **Complete stage** and all applicable required questions are answered.

Opening a page does not complete a stage. All five stages use the same completion behavior. When every stage is complete, the hub displays **Submit questionnaire**. Submission is not tied to Stage 5 or to completing stages in numerical order. The Thank You screen appears only after successful storage.

Required core questions:

- `children_role`
- `viewer_status`
- `viewing_methods`

Hidden answers may remain in a draft so they can reappear if routing changes, but hidden answers are excluded from submission and analytics.

## 4. Rating scales and presentation

Interest scale:

- `1` Not interested
- `2` Slightly interested
- `3` Moderately interested
- `4` Very interested
- `5` Extremely interested
- `na` Not sure

Importance scale:

- `1` Not important
- `2` Slightly important
- `3` Moderately important
- `4` Very important
- `5` Essential
- `na` Not sure

Performance scale:

- `1` Poor
- `2` Weak
- `3` Adequate
- `4` Good
- `5` Excellent
- `na` Not familiar enough to rate

`na` and missing values are excluded from numeric averages. Importance and performance use aligned role rows but retain separate meanings and stored answers. The results system displays standalone importance, standalone performance, and paired importance-performance gaps.

## 5. Active core questionnaire

### Stage 1 - About You

| ID | Viewer-facing wording / values | Type | Required | Routing | Analytics purpose | Results location | Status / compatibility |
|---|---|---|---:|---|---|---|---|
| `county_region` | What county or area do you live in? U.P. counties, northern Wisconsin, other Michigan, another state, Canada, prefer not | Select | No | All | Geography and filtering | Audience & Access; All Data & Export | Retained v6 |
| `community_type` | Which best describes where you live? `city`, `town`, `rural`, `prefer_not` | Radio | No | All | Community comparison | Audience & Access; All Data & Export | Retained v6 |
| `age_range` | Age range from under 18 through 85 or older, plus prefer not | Radio | No | All | Age filtering and segmentation | Audience & Access; All Data & Export | Retained v6 |
| `internet_streaming_quality` | How well does home internet support streaming video? `works_well`, `adequate`, `slow`, `unreliable`, `none`, `not_tried`, `prefer_not` | Radio | No | All | Streaming access | Audience & Access; All Data & Export | Retained v6 |
| `children_role` | Do you select or recommend programming for children? `household`, `educator`, `both`, `neither` | Radio | Yes | All | Children detail and follow-up eligibility | Audience & Access; All Data & Export | Retained v6 |

Respondents choosing `neither` do not see `kids_use`, `kids_needs`, or the optional children's follow-up. The broad children-and-education programming category remains available to everyone.

### Stage 2 - WNMU & You

| ID | Viewer-facing wording / values | Type | Required | Routing | Analytics purpose | Results location | Status / compatibility |
|---|---|---|---:|---|---|---|---|
| `station_awareness` | Before today, what did you know about WNMU-TV? | Radio | No | All | Station/PBS awareness | Audience & Access; All Data & Export | Retained v6 |
| `viewer_status` | During the past 12 months, how often have you knowingly watched WNMU-TV or its programming? | Radio, stored in route profile | Yes | All | Viewer relationship and routing | Audience & Access; filter; All Data & Export | Retained v6 |
| `viewing_methods` | Antenna, cable/satellite, WNMU livestream, PBS App, PBS.org, Passport, YouTube TV, YouTube, or not watched | Checkbox, stored in route profile | Yes | All | Access and viewing method | Audience & Access; filter; All Data & Export | `pbs_app` and `pbs_org` remain separate; not watched exclusive |
| `channel_awareness` | Which of WNMU-TV's four broadcast channels were you aware of? | Checkbox | No | All | Channel awareness | Audience & Access; All Data & Export | Retained v6 |
| `channels_received` | Which WNMU-TV channels can you receive? | Checkbox | No | Antenna, cable/satellite, or YouTube TV methods | Channel availability | Audience & Access; All Data & Export | Retained v6 |
| `online_awareness` | Which WNMU-TV or PBS online services were you aware of? | Checkbox | No | All | Digital-service awareness | Audience & Access; All Data & Export | PBS App and PBS.org separate |

Viewer-facing channel names are WNMU-TV 13.1, PBS KIDS 24/7 13.2, WNMU-TV Plus 13.3, and Michigan Learning Channel 13.4. Current channel and PBS service wording must be reverified against governing sources before production.

### Stage 3 - What You Watch

| ID | Viewer-facing wording / values | Type | Required | Routing | Analytics purpose | Results location | Status / compatibility |
|---|---|---|---:|---|---|---|---|
| `channels_watched` | Which WNMU-TV channels do you watch, even occasionally? | Checkbox | No | Hidden for `never` | Channel use | Audience & Access; All Data & Export | Retained v6 |
| `watch_preference` | Scheduled broadcast, recorded, on demand, livestream, short clips, depends, or no strong preference | Radio | No | All | Linear/on-demand preference | Audience & Access; All Data & Export | Retained v6 |
| `program_category_interest` | Interest in 17 shared programming categories | Matrix 1-5 plus `na` | No | All | Category interest | Programming Priorities; All Data & Export | Retained v6 |
| `valued_programs` | Current or past WNMU-TV or PBS programs that were valuable or memorable | Textarea | No | All | Qualitative program value | Viewer Voices; All Data & Export | Retained v6 |
| `kids_use` | How PBS KIDS or other children's public-media content is used | Checkbox | No | Child-role respondents | Children's viewing methods | Audience & Access; All Data & Export | Retained v6 |

Shared programming categories:

1. `history_biography` - History and biography
2. `environment_nature` - Environment, nature, and wildlife
3. `outdoor_recreation` - Outdoor recreation
4. `regional_documentaries` - Upper Peninsula and regional documentaries
5. `local_news_public_affairs` - Local news and public affairs
6. `health_wellness` - Health and wellness
7. `home_garden` - Home and garden
8. `arts_performance` - Arts, music, and performance
9. `children_education` - Children's programming and education
10. `science_technology` - Science and technology
11. `national_pbs_documentaries` - National PBS documentaries
12. `national_international_news` - National and international news
13. `drama_mysteries` - Drama and mysteries
14. `food_cooking` - Food and cooking
15. `regional_travel` - Regional travel and exploration
16. `world_travel` - U.S. and world travel
17. `independent_film` - Independent film

### Stage 4 - What You Want

| ID | Viewer-facing wording / values | Type | Required | Routing | Analytics purpose | Results location | Status / compatibility |
|---|---|---|---:|---|---|---|---|
| `program_category_priorities` | Choose five programming categories that should receive greatest attention | Checkbox, max 5 | No | All | Forced programming priorities and follow-up context | Programming Priorities; All Data & Export | Retained v6 |
| `local_formats` | Choose up to three local or regional formats | Checkbox, max 3 | No | All | Regional format preference | Programming Priorities; All Data & Export | Retained v6 |
| `online_improvements` | Choose up to three improvements that could encourage online use | Checkbox, max 3; `nothing` exclusive | No | All | Digital improvement priorities | Audience & Access; All Data & Export | Retained v6 |
| `learn_preferred` | Choose up to three ways to learn about WNMU-TV programming | Checkbox, max 3 | No | All | Communication-channel preference | Audience & Access; All Data & Export | Retained v6 |
| `kids_needs` | What children's, family, classroom, or educator resources should WNMU-TV provide more of? | Textarea | No | Child-role respondents | Qualitative educational needs | Viewer Voices; All Data & Export | Retained v6 |

### Stage 5 - How We're Doing

| ID | Viewer-facing wording / values | Type | Required | Routing | Analytics purpose | Results location | Status / compatibility |
|---|---|---|---:|---|---|---|---|
| `station_role_importance` | Importance of nine station roles | Matrix | No | All | Role priorities and paired gaps | Performance & Opportunities; All Data & Export | Retained v6 |
| `station_role_performance` | How well WNMU-TV performs the same nine roles | Matrix | No | Hidden for explicit former/never viewers | Viewer-rated delivery and paired gaps | Performance & Opportunities; All Data & Export | Retained v6 |
| `reflects_me` | How well WNMU-TV reflects the interests and needs of people like the respondent | Radio | No | Hidden for explicit former/never viewers | Regional reflection | Performance & Opportunities; All Data & Export | Retained v6 |
| `trust_station` | How much the respondent trusts WNMU-TV as a source of programming and information | Radio | No | Hidden for explicit former/never viewers | Trust | Performance & Opportunities; All Data & Export | Retained v6 |
| `nonviewer_reasons` | Reasons for not watching WNMU-TV more often | Checkbox | No | Former, never, or unsure | Barriers | Performance & Opportunities; All Data & Export | Retained v6 |
| `nonviewer_return` | Program, service, or change that could attract or regain the respondent | Textarea | No | Former, never, or unsure | Return opportunities | Viewer Voices; All Data & Export | Retained v6 |
| `final_feedback` | What WNMU-TV is doing well, where it could improve, and anything else to know | Textarea | No | All | General qualitative feedback | Viewer Voices; All Data & Export | Retained v6 |

Station roles:

1. `trusted_public_media` - Select and provide trusted national and regional public-television programming
2. `up_programming` - Provide programs about the Upper Peninsula, whether produced by WNMU-TV or other producers
3. `regional_issues` - Cover important regional issues and public affairs
4. `reflect_region` - Reflect the people, places, communities, and cultures of the region
5. `children_families` - Provide educational programming for children and families
6. `science_nature` - Provide science, nature, and environmental programming
7. `arts_culture` - Provide arts, music, and cultural programming
8. `online_access` - Make programs easy to find online and on demand
9. `access_for_all` - Serve people with disabilities or limited and unreliable internet access

The broad `children_families` role is the canonical core measure of importance and performance for children and families. Follow-up v2 does not duplicate this broad performance question.

## 6. Optional follow-up questionnaires

After a successful core submission, the Thank You page offers five optional modules:

- Local and Upper Peninsula programming
- Programming interests and ideas
- Online viewing, PBS App, and Passport
- Children's programming and education, when eligible
- Communication and finding programs

The follow-up blueprint is maintained in `FOLLOW_UP_QUESTIONNAIRE_SPEC.md`. Version 2 contains 40 live question IDs, eight per module. It retires `deeper_priority_categories` and `program_recommendations`, adds `regional_music_performance_interest` and `program_development_ideas`, and creates a clean v2 draft/response boundary.

Core selected programming priorities are displayed as read-only context in the Programming Interests module rather than being asked again.

## 7. Linkage and privacy

The core Thank You page creates or reuses a random access record containing:

- access ID
- long continuation token
- pseudonymous respondent ID
- core response ID
- core schema version
- timestamps

The continuation token appears in the URL fragment and separate access record. It is not stored inside core or follow-up answer records. Follow-up responses link to core through `respondentId` and `coreResponseId`, not names or email addresses.

Current test limitation: links resolve only under the same browser origin because no production database is connected. Public production requires approved server-side token resolution and protected response storage.

After core submission, a respondent may separately ask WNMU-TV to contact them about their response, a programming idea, or future research. The form collects an optional name, required email address, one or more approved contact reasons, and explicit consent. The contact record uses `wnmu-viewer-contact-v1` and contains pseudonymous respondent and core response IDs, but it is stored separately from core and follow-up answers.

Research results show only the aggregate number of valid contact requests linked to responses in the filtered view. Names, email addresses, contact reasons, and contact records are excluded from research JSON and CSV exports. The Test version stores contact requests only in the current browser; production requires a separate protected contact system.

## 8. Storage keys

Core:

- draft: `wnmuViewerSurveyDraft:v6`
- responses: `wnmuViewerSurveyResponses:v3`
- Test Thank You preview: `wnmuViewerThankYouPreview:v1`
- respondent ID: `wnmuViewerRespondentId:v1`

Follow-up v2:

- access records: `wnmuViewerFollowUpAccess:v1`
- drafts: `wnmuViewerFollowUpDrafts:v2`
- responses: `wnmuViewerFollowUpResponses:v2`

Operational contact:

- contact requests: `wnmuViewerContactRequests:v1`

Test Thank You previews use their own storage key and are not submitted core responses. Older preview objects that were previously placed in the shared response array are moved to the preview key so they no longer appear as excluded questionnaire records.

Retired follow-up prototype history:

- `wnmuViewerFollowUpDrafts:v1`
- `wnmuViewerFollowUpResponses:v1`

The v1 draft and response records are not migrated or loaded into v2. The access key remains v1 so existing same-browser private links can continue to resolve to their core response.

## 9. Results and analytics contract

Core analytics rules:

- Use only respondents who answered each question as its percentage denominator.
- Exclude skipped and hidden answers.
- Keep missing, `na`, not sure, prefer not, and not applicable distinct from negative answers.
- Calculate each respondent's importance-performance gap first, then average paired gaps.
- Preserve standalone importance and performance distributions.
- Load only v6 records into the v6 core dashboard.
- Diagnose excluded browser records by pseudonymous record ID, schema, and rejection reason without displaying their answers.

Test data behavior:

- The default results view combines 25 synthetic core responses with valid v6 browser-submitted core responses.
- It combines 60 synthetic v2 follow-up module responses with valid v2 browser-submitted follow-up responses.
- Synthetic and browser sources remain visibly labeled and separately counted.
- Older-schema browser records remain excluded and are not silently reinterpreted.

Follow-up analytics rules:

- Follow-up results use module-specific, self-selected denominators.
- Core filters apply through linked core response IDs.
- Every follow-up question displays answered, skipped, and module counts.
- Children follow-up responses must link only to eligible core respondents.
- Follow-up percentages must not be described as percentages of all core respondents unless explicitly calculated and labeled that way.

Decision Brief rules:

- Every finding states the denominator used.
- Automated findings require at least five usable answers for the stated measure.
- Follow-up findings explicitly identify the voluntary, self-selected module population and module n.
- Synthetic findings display a test-data warning and must not be used for station decisions.
- Implications are tentative and recommended responses are practical options, not directives.
- Audience filters recalculate both evidence and findings.

Qualitative organization:

- Open responses are organized by transparent keyword themes as a review aid.
- A comment may appear in more than one theme.
- Original text remains unchanged and continues to appear under its source question.
- Theme counts are comment counts, not audience percentages or representative conclusions.

Results sections:

1. Decision Brief with denominator-safe core and self-selected follow-up findings
2. Audience & Access
3. Programming Priorities
4. Performance & Opportunities
5. Viewer Voices
6. All Data & Export

Exports:

- combined raw JSON containing core and follow-up records
- core summary CSV
- follow-up summary CSV with stable stored values, labels, module n, answered/skipped counts, linkage fields, and schema versions

## 10. Production checklist

Build 6.3.0 Test QA completed: JavaScript syntax, loaded-asset references, duplicate HTML IDs, Test Thank You preview migration, valid and invalid browser-record handling, combined 25-core/60-follow-up synthetic loading, browser-core inclusion, contact-record separation and aggregate counting, denominator-bearing core and follow-up findings, audience-filter recalculation, small-sample suppression, and original-comment preservation in the theme renderer. The available remote browser could not open the local test origin, so a hands-on desktop and phone visual/interaction pass remains required before production.

Build 6.3.1 Test makes the results dashboard summary-first: the hero distinguishes core responses, linked follow-up respondents, and completed optional modules; filters and test/export utilities are collapsed; ordinary categorical charts show percentages without repeated selection counts; denominators remain available in disclosures, the Decision Brief, All Data, and exports; and Audience, Programming, Performance, and Viewer Voices begin with rules-based section snapshots. “Meeting expectations” and “Exceeding expectations” are reserved for paired importance-versus-delivery evidence. Other sections use descriptive audience-signal and opportunity language.

Build 6.3.2 Test shortens the results interpretation copy, promotes each results section name above its conclusion, makes result panels collapsible, consolidates children's results into one Audience panel, and adds visual gauges to the section takeaways. The online Decision Brief now uses `online_primary_service` to report the most-used online path. No question, ID, route, stored value, schema, or denominator changed.

Before public release:

- switch the authoritative mode to production
- disable blank test navigation
- remove synthetic and browser test data as live sources
- connect and approve Supabase response storage
- protect core and follow-up results
- make continuation links work across devices
- define token expiration, revocation, response editing, withdrawal, and retention
- publish final privacy and linkage language
- implement optional email delivery in a separate protected contact system
- replace local contact-request storage with a protected operational contact table
- verify current WNMU channel and PBS service wording against governing sources
- copy the logo into the application asset set
- complete desktop, phone portrait/landscape, keyboard, screen-reader, focus, reduced-motion, routing, draft, submission, linkage, filters, import, JSON, and CSV QA
