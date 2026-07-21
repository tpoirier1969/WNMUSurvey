# RESULTS_COVERAGE_LEDGER.md — WNMU-TV Questionnaire Results Coverage

## 1. Purpose and governing rule

This ledger maps every live core and follow-up question to its current results treatment and intended place in the decision-oriented results system.

**Coverage rule:** every collected question must appear in **All Data & Export** or be explicitly classified as operational-only, contact-only, retired, or not yet reportable. A finding does not have to appear in the Decision Brief, but its underlying result must remain reviewable with an honest denominator.

This ledger reflects `main` at:

- core schema: `wnmu-viewer-questionnaire-v6`
- follow-up schema: `wnmu-viewer-follow-ups-v1`
- interface build: `6.1.3-test`
- audit date: 2026-07-21

Primary files audited:

- `QUESTIONNAIRE_SPEC.md`
- `FOLLOW_UP_QUESTIONNAIRE_SPEC.md`
- `results.html`
- `js/results-controller.js`
- `js/results-summary-render.js`
- `js/results-detail-render.js`
- `js/results-gap-render.js`
- `js/results-export.js`
- `js/results-data.js`
- `js/follow-up-app.js`

## 2. Results-section model

The results interface uses six top-level sections:

1. **Decision Brief** — strongest findings, evidence, implications, practical options, and cautions; interpretation rules remain pending
2. **Audience & Access** — audience relationship, geography, access, channels, online use, and communication/discovery
3. **Programming Priorities** — interests, forced priorities, local formats, children’s needs, content sources, and programming ideas
4. **Performance & Opportunities** — trust, reflection, importance, delivery, gaps, barriers, and opportunities to regain viewers
5. **Viewer Voices** — original comments grouped by question; theme synthesis remains pending
6. **All Data & Export** — every question, answered/skipped/not-applicable counts, detailed distributions, filters, and exports

The **Primary section** column identifies the main narrative home for each result. Every core row also appears in **All Data & Export**.

## 3. Coverage status

- **Full:** the result is visibly reviewable with its current denominator and routing context.
- **Export only:** retained in a downloadable response file, with no aggregate results view.
- **Brief? Yes:** normally a strong candidate for the Decision Brief when meaningful.
- **Brief? Conditional:** include only when unusually strong, actionable, or relevant to a current decision.
- **Brief? No:** useful context or segmentation, but not normally a headline finding.

## 4. Current coverage summary

### Core questionnaire

- All 28 live core questions are visibly represented in the dashboard.
- All 28 appear in **All Data & Export** with answered, skipped, and not-applicable counts.
- Major audience, programming, performance, and qualitative results also appear in their primary sections.
- Standalone importance and performance results are visible in addition to paired-gap analysis.
- The online-use headline correctly counts separate `pbs_app` and `pbs_org` values.
- Raw JSON retains all loaded answer records.
- The summary CSV iterates all 28 questions and includes source category, applicable, answered, skipped, not-applicable, and filtered counts.

### Test-data sources

- The default Test dataset combines the 25 synthetic responses with all valid current-schema browser submissions.
- Synthetic and browser-submitted records remain visibly counted as separate sources.
- Preview, older-schema, and other non-v6 browser records are excluded and the excluded count is shown.
- The synthetic dataset exercises all 28 core questions and includes several Michigan Learning Channel viewers.
- Production will use approved Supabase responses only.

### Follow-up questionnaires

- All 40 follow-up questions are stored and available in per-linked-respondent JSON.
- None currently has an aggregate dashboard.
- None currently has a stable-label CSV export.
- Follow-up results must use follow-up-specific denominators because participation is voluntary and self-selected.

## 5. Core questionnaire ledger

| Stage | Question ID | Measures | Current results | Primary section | Planned/active presentation | Brief? | Current export | Notes |
|---|---|---|---|---|---|---|---|---|
| About You | `county_region` | Respondent geography | Full | Audience & Access | Location bars, filter, detailed distribution | Conditional | JSON + summary CSV | Question denominator; prefer-not retained but excluded from ranked findings |
| About You | `community_type` | City, town, or rural setting | Full | Audience & Access | Distribution and All Data | Conditional | JSON + summary CSV | Available for later access cross-tabs |
| About You | `age_range` | Age group | Full | Audience & Access | Age bars, filter, detailed distribution | No | JSON + summary CSV | Segmentation rather than a finding by itself |
| About You | `internet_streaming_quality` | Ability to stream video at home | Full | Audience & Access | Access distribution with answered/skipped counts | Yes | JSON + summary CSV | Candidate for broadcast-versus-streaming strategy |
| About You | `children_role` | Household/educator responsibility | Full | Audience & Access | Headline, filter, and full distribution | Conditional | JSON + summary CSV | Eligibility base for children’s results |
| WNMU & You | `station_awareness` | Pre-questionnaire awareness | Full | Audience & Access | Awareness distribution | Yes | JSON + summary CSV | Brand and outreach decisions |
| WNMU & You | `viewer_status` | Current, former, or non-viewer relationship | Full | Audience & Access | Headline, bars, filter, and full distribution | Yes | JSON + summary CSV | Core audience context |
| WNMU & You | `viewing_methods` | Ways respondents watch | Full | Audience & Access | Multi-select distribution, filter, online-use headline | Yes | JSON + summary CSV | Online grouping counts `pbs_app` and `pbs_org` separately |
| WNMU & You | `channel_awareness` | Awareness of four channels | Full | Audience & Access | Channel awareness/receive/watch table and All Data | Yes | JSON + summary CSV | Question-specific denominator |
| WNMU & You | `channels_received` | Channels respondents can receive | Full | Audience & Access | Channel funnel and All Data | Yes | JSON + summary CSV | Applicable access methods only |
| WNMU & You | `online_awareness` | Awareness of online services | Full | Audience & Access | Multi-select service distribution | Yes | JSON + summary CSV | PBS.org and PBS App remain separate |
| What You Watch | `channels_watched` | Channels watched | Full | Audience & Access | Channel funnel and All Data | Yes | JSON + summary CSV | Never-viewer routing respected; synthetic MLC viewing present |
| What You Watch | `watch_preference` | Scheduled, recorded, on-demand, livestream, or clips | Full | Audience & Access | Viewing-mode distribution | Yes | JSON + summary CSV | Clarifies linear versus on-demand strategy |
| What You Watch | `program_category_interest` | Interest ratings across 17 categories | Full | Programming Priorities | Ranked averages plus detailed 1–5 distributions | Yes | JSON + summary CSV | `na` and missing excluded from averages |
| What You Watch | `valued_programs` | Valuable or memorable programs | Full | Viewer Voices | Original comments grouped by question; answered count in All Data | Yes | JSON + summary CSV answered count | Theme synthesis remains pending |
| What You Watch | `kids_use` | How children’s content is used | Full | Audience & Access | Eligible-segment distribution | Conditional | JSON + summary CSV | Child-role routing and not-applicable count visible |
| What You Want | `program_category_priorities` | Five categories to emphasize | Full | Programming Priorities | Ranked selections plus All Data | Yes | JSON + summary CSV | High-value decision input |
| What You Want | `local_formats` | Preferred local/regional formats | Full | Programming Priorities | Ranked selections | Yes | JSON + summary CSV | Production-format input |
| What You Want | `online_improvements` | Desired online improvements | Full | Audience & Access | Ranked digital improvements | Yes | JSON + summary CSV | Potential action list |
| What You Want | `learn_preferred` | Preferred programming-information channels | Full | Audience & Access | Ranked communication channels | Yes | JSON + summary CSV | Communication-planning input |
| What You Want | `kids_needs` | Children’s/family/educator needs | Full | Viewer Voices | Original comments and answered count | Conditional | JSON + summary CSV answered count | Also informs Programming Priorities |
| How We’re Doing | `station_role_importance` | Importance of nine roles | Full | Performance & Opportunities | Standalone ranked averages, detailed distributions, and paired gap | Yes | JSON + summary CSV | Unpaired importance ratings remain visible |
| How We’re Doing | `station_role_performance` | Viewer-rated delivery on nine roles | Full | Performance & Opportunities | Standalone ranked averages, detailed distributions, and paired gap | Yes | JSON + summary CSV | Applicable viewers only; unpaired ratings remain visible |
| How We’re Doing | `reflects_me` | How well WNMU reflects respondent | Full | Performance & Opportunities | Distribution with routing counts | Yes | JSON + summary CSV | Former/never not applicable |
| How We’re Doing | `trust_station` | Trust in WNMU programming/information | Full | Performance & Opportunities | Distribution with routing counts | Yes | JSON + summary CSV | Strong candidate for headline finding |
| How We’re Doing | `nonviewer_reasons` | Reasons for not watching more | Full | Performance & Opportunities | Ranked barriers with routing counts | Yes | JSON + summary CSV | Former/never/unsure only |
| How We’re Doing | `nonviewer_return` | Changes that could attract/regain viewers | Full | Viewer Voices | Original comments and answered count | Yes | JSON + summary CSV answered count | Also informs Performance & Opportunities |
| How We’re Doing | `final_feedback` | Strengths, improvements, and other feedback | Full | Viewer Voices | Original comments and answered count | Yes | JSON + summary CSV answered count | One field contains three prompts; theme synthesis pending |

## 6. Follow-up questionnaire ledger

| Module | Question ID | Measures | Current results | Primary future section | Planned presentation | Brief? | Current export | Notes |
|---|---|---|---|---|---|---|---|---|
| Local and Upper Peninsula programming | `local_subjects` | Regional subjects needing attention | Export only | Programming Priorities | Ranked selections | Yes | Linked JSON only | Follow-up-specific denominator |
| Local and Upper Peninsula programming | `local_areas` | Parts of region needing attention | Export only | Programming Priorities | Geographic/community ranking | Yes | Linked JSON only | Wording revision pending |
| Local and Upper Peninsula programming | `local_formats_followup` | Formats likely to attract viewing | Export only | Programming Priorities | Ranked selections | Yes | Linked JSON only | Compare with core without merging denominators |
| Local and Upper Peninsula programming | `local_voices` | Voices needing more representation | Export only | Programming Priorities | Ranked representation priorities | Yes | Linked JSON only | Inclusivity review pending |
| Local and Upper Peninsula programming | `original_up_production_importance` | Demand for WNMU original U.P. production | Export only | Performance & Opportunities | Importance distribution | Yes | Linked JSON only | Distinct from regional-content demand generally |
| Local and Upper Peninsula programming | `regional_source_balance` | Preferred WNMU/outside-production balance | Export only | Programming Priorities | Distribution | Yes | Linked JSON only | Produce/license/acquire decision |
| Local and Upper Peninsula programming | `outside_producer_partnerships` | Preferred outside-producer relationships | Export only | Performance & Opportunities | Ranked options | Yes | Linked JSON only | Public explanation pending |
| Local and Upper Peninsula programming | `local_program_idea` | Regional ideas and producer discovery | Export only | Viewer Voices | Themes and original comments | Yes | Linked JSON only | Qualitative |
| Programming interests and ideas | `deeper_priority_categories` | Linked priorities needing elaboration | Export only | Programming Priorities | Replace with linked-priority context | No | Linked JSON only | Retirement/redesign pending |
| Programming interests and ideas | `specific_program_subjects` | Subjects and program types | Export only | Viewer Voices | Themes linked to core priorities | Yes | Linked JSON only | Music-series path pending |
| Programming interests and ideas | `program_characteristics` | Valuable program qualities | Export only | Programming Priorities | Ranked selections | Yes | Linked JSON only | Max-change pending |
| Programming interests and ideas | `program_length_preferences` | Preferred lengths | Export only | Programming Priorities | Ranked selections | Conditional | Linked JSON only | Format/scheduling |
| Programming interests and ideas | `program_origin_mix` | Preferred programming sources | Export only | Programming Priorities | Ranked selections | Yes | Linked JSON only | Max-change pending |
| Programming interests and ideas | `new_vs_familiar` | New-versus-familiar balance | Export only | Programming Priorities | Distribution | Yes | Linked JSON only | Acquisition/repeat strategy |
| Programming interests and ideas | `special_programming_interest` | Themed/event/curated approaches | Export only | Programming Priorities | Ranked selections | Yes | Linked JSON only | Max and on-demand clarification pending |
| Programming interests and ideas | `program_recommendations` | Programming ideas/recommendations | Export only | Viewer Voices | Themes and original comments | Conditional | Linked JSON only | Prompt revision pending |
| Online viewing, PBS App, and Passport | `online_devices` | Devices used or considered | Export only | Audience & Access | Device distribution | Yes | Linked JSON only | Follow-up-specific denominator |
| Online viewing, PBS App, and Passport | `online_primary_service` | Primary online service | Export only | Audience & Access | Service distribution | Yes | Linked JSON only | PBS.org/App separate |
| Online viewing, PBS App, and Passport | `online_frequency` | Online-viewing frequency | Export only | Audience & Access | Frequency distribution | Yes | Linked JSON only | Segment by service/device |
| Online viewing, PBS App, and Passport | `online_barriers` | Online-viewing barriers | Export only | Audience & Access | Ranked barriers | Yes | Linked JSON only | Action-oriented |
| Online viewing, PBS App, and Passport | `passport_status` | Passport experience/status | Export only | Audience & Access | Status funnel | Yes | Linked JSON only | Education/activation opportunity |
| Online viewing, PBS App, and Passport | `online_help_formats` | Preferred help formats | Export only | Audience & Access | Ranked help channels | Yes | Linked JSON only | Action list |
| Online viewing, PBS App, and Passport | `online_features` | Desired online features | Export only | Audience & Access | Ranked improvements | Yes | Linked JSON only | Digital roadmap |
| Online viewing, PBS App, and Passport | `online_comments` | Other online experiences | Export only | Viewer Voices | Themes and original comments | Conditional | Linked JSON only | Qualitative |
| Children's programming and education | `children_age_groups` | Age groups served | Export only | Audience & Access | Eligible-segment distribution | No | Linked JSON only | Module respondents only |
| Children's programming and education | `children_settings` | Use settings | Export only | Audience & Access | Setting distribution | Conditional | Linked JSON only | Module respondents only |
| Children's programming and education | `children_learning_goals` | Learning goals | Export only | Programming Priorities | Ranked selections | Yes | Linked JSON only | Max-change pending |
| Children's programming and education | `children_local_importance` | Importance of regional learning content | Export only | Programming Priorities | Importance distribution | Yes | Linked JSON only | Local-production case |
| Children's programming and education | `children_local_topics` | Useful regional topics | Export only | Programming Priorities | Ranked selections | Yes | Linked JSON only | Content development |
| Children's programming and education | `educator_resources` | Useful educational resources | Export only | Programming Priorities | Ranked selections | Yes | Linked JSON only | Resource decisions |
| Children's programming and education | `children_access_barriers` | Barriers to children’s resources | Export only | Audience & Access | Ranked barriers | Yes | Linked JSON only | Distribution/support |
| Children's programming and education | `children_comments` | Other family/educator needs | Export only | Viewer Voices | Themes and original comments | Conditional | Linked JSON only | Performance question under review |
| Communication and finding programs | `planning_horizon` | Promotion-planning horizon | Export only | Audience & Access | Distribution | Yes | Linked JSON only | Promotion timing |
| Communication and finding programs | `program_information_needed` | Information needed to choose programs | Export only | Audience & Access | Ranked selections | Yes | Linked JSON only | Broadcast/streaming clarification pending |
| Communication and finding programs | `schedule_format` | Useful schedule formats | Export only | Audience & Access | Ranked products | Yes | Linked JSON only | Product roadmap |
| Communication and finding programs | `message_frequency` | Desired message frequency | Export only | Audience & Access | Distribution | Yes | Linked JSON only | Contact cadence |
| Communication and finding programs | `reminder_preferences` | Reminder methods considered | Export only | Audience & Access | Ranked channels | Yes | Linked JSON only | Does not authorize contact |
| Communication and finding programs | `social_content_interest` | Useful post/message types | Export only | Audience & Access | Ranked content types | Yes | Linked JSON only | Content marketing |
| Communication and finding programs | `communication_barriers` | Barriers to knowing WNMU offerings | Export only | Audience & Access | Ranked barriers | Yes | Linked JSON only | Action-oriented |
| Communication and finding programs | `communication_comments` | Informing viewers without intrusion | Export only | Viewer Voices | Themes and original comments | Conditional | Linked JSON only | Qualitative |

## 7. Operational and contact records

The requested optional email address must not become a questionnaire answer or linkage key.

| Record | Current state | Intended storage | Results treatment | Access |
|---|---|---|---|---|
| Optional email/contact opt-in | Not yet collected | Separate protected contact table, not inside core or follow-up answers | Aggregate count only; exclude from research filters, raw questionnaire exports, and Decision Brief | Restricted operational access only |

The contact form must explain what information is requested, how the address will be used, and that it is stored separately from questionnaire answers.

## 8. Remaining coverage work

1. Build the actual Decision Brief findings, evidence, implications, options, and cautions.
2. Build aggregate follow-up analysis and stable-label follow-up CSV export.
3. Add qualitative theme coding while retaining and clearly separating original comments.
4. Apply the pending follow-up wording and limit revisions with ID and compatibility review.
5. Implement the separate optional contact system.
6. Replace all Test data sources with approved Supabase-only production loading before launch.

## 9. Maintenance procedure

Update this ledger whenever a question, option, scale, routing rule, results renderer, export, or schema changes.

For each change:

1. confirm the question still has a unique stable ID;
2. update its current coverage status;
3. identify its primary section and planned display;
4. verify denominator and routing notes;
5. verify raw JSON and CSV treatment;
6. review whether it may contribute to the Decision Brief;
7. keep missing and not-applicable responses distinct from negative answers.

A questionnaire revision is not analytically complete until its ledger row is current.
