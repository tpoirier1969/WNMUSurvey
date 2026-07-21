# RESULTS_COVERAGE_LEDGER.md — WNMU-TV Questionnaire Results Coverage

## 1. Purpose and governing rule

This ledger maps every live core and follow-up question to its current results treatment and its intended place in the decision-oriented results system.

**Coverage rule:** every collected question must appear in **All Data & Export** or be explicitly classified as operational-only, contact-only, retired, or not yet reportable. A finding does not have to appear in the Decision Brief, but its underlying result must remain reviewable with an honest denominator.

This ledger reflects the live questionnaire definitions on `main` at:

- core schema: `wnmu-viewer-questionnaire-v6`
- follow-up schema: `wnmu-viewer-follow-ups-v1`
- interface build: `6.1.2-test`
- audit date: 2026-07-21

Primary files audited:

- `QUESTIONNAIRE_SPEC.md`
- `FOLLOW_UP_QUESTIONNAIRE_SPEC.md`
- `results.html`
- `js/results-summary-render.js`
- `js/results-gap-render.js`
- `js/results-export.js`
- `js/follow-up-app.js`

## 2. Results-section model

The planned results interface uses six top-level sections:

1. **Decision Brief** — strongest findings, evidence, implications, and practical options
2. **Audience & Access** — audience relationship, geography, access, channels, online use, and communication/discovery
3. **Programming Priorities** — interests, forced priorities, local formats, children’s needs, content sources, and programming ideas
4. **Performance & Opportunities** — trust, reflection, importance, delivery, gaps, barriers, and opportunities to regain viewers
5. **Viewer Voices** — organized qualitative themes plus original comments
6. **All Data & Export** — every question, denominator, skipped/applicable counts, detailed tables, filters, and exports

The **Primary future section** column below identifies the main narrative home for each result. Every row also belongs in **All Data & Export**.

## 3. Coverage status

- **Full:** a dedicated chart or table currently exists.
- **Partial:** some form of the result appears, but not the complete distribution, denominator context, or analysis needed.
- **Not shown:** collected and exported, but absent from the visible dashboard.
- **Export only:** retained in a downloadable response file, with no aggregate results view.
- **Brief? Yes:** normally a strong candidate for the Decision Brief when the result is meaningful.
- **Brief? Conditional:** include only when the result is unusually strong, actionable, or relevant to a current decision.
- **Brief? No:** useful context or segmentation, but not normally a headline finding.

## 4. Current coverage summary

### Core questionnaire

- 9 questions have a dedicated visible chart/table, although the online-method headline derived from `viewing_methods` currently uses a retired combined value and is inaccurate.
- 7 questions are partially surfaced.
- 12 questions are collected but not shown on the dashboard.
- All 28 core questions remain in raw JSON.
- The summary CSV iterates all 28 core questions. Open text is represented by an answered count, while full text remains in raw JSON.

### Follow-up questionnaires

- All 40 questions are stored and available in per-linked-respondent JSON.
- None currently has an aggregate dashboard.
- None currently has a stable-label CSV export.
- Follow-up results must use follow-up-specific denominators because participation is voluntary and self-selected.

## 5. Core questionnaire ledger

| Stage / module | Question ID | Measures | Current results | Primary future section | Planned presentation | Brief? | Current export | Notes |
|---|---|---|---|---|---|---|---|---|
| About You | county_region | Respondent geography | Full: location bars and filter | Audience & Access | Bar distribution; filter; cross-tabs | Conditional | JSON + summary CSV | Question denominator; prefer-not excluded from ranked findings |
| About You | community_type | City, town, or rural setting | Not shown | Audience & Access | Bar distribution; cross-tab with access and viewing | Conditional | JSON + summary CSV | Currently collected but absent from dashboard |
| About You | age_range | Age group | Full: age bars and filter | Audience & Access | Bar distribution; filter; cross-tabs | No | JSON + summary CSV | Use for segmentation, not as a finding by itself |
| About You | internet_streaming_quality | Ability to stream video at home | Not shown | Audience & Access | Access-barrier distribution; rural/geographic cross-tabs | Yes | JSON + summary CSV | Potentially central to broadcast-versus-streaming strategy |
| About You | children_role | Household/educator responsibility for children’s content | Partial: headline metric and filter only | Audience & Access | Segment distribution and eligibility base | Conditional | JSON + summary CSV | Denominator for children’s findings |
| WNMU & You | station_awareness | Pre-questionnaire awareness of WNMU-TV and PBS relationship | Not shown | Audience & Access | Awareness funnel | Yes | JSON + summary CSV | Useful for brand and outreach decisions |
| WNMU & You | viewer_status | Current, former, or non-viewer relationship | Full: bars, filter, and headline metric | Audience & Access | Relationship distribution; filter | Yes | JSON + summary CSV | Core audience context |
| WNMU & You | viewing_methods | Ways respondents watch WNMU-TV/PBS | Full chart; online headline metric is inaccurate | Audience & Access | Multi-select distribution and online/broadcast grouping | Yes | JSON + summary CSV | Current online metric still checks retired `pbs_app_web` instead of `pbs_app` and `pbs_org` |
| WNMU & You | channel_awareness | Awareness of the four broadcast channels | Full: channel table | Audience & Access | Awareness/receive/watch funnel by channel | Yes | JSON + summary CSV | Question-specific denominator |
| WNMU & You | channels_received | Channels respondents can receive | Full: channel table | Audience & Access | Awareness/receive/watch funnel by channel | Yes | JSON + summary CSV | Applicable access methods only |
| WNMU & You | online_awareness | Awareness of WNMU/PBS online services | Not shown | Audience & Access | Service-awareness distribution | Yes | JSON + summary CSV | Keep PBS.org and PBS App separate |
| What You Watch | channels_watched | Channels watched, even occasionally | Full: channel table | Audience & Access | Awareness/receive/watch funnel by channel | Yes | JSON + summary CSV | Former/never routing respected |
| What You Watch | watch_preference | Scheduled, recorded, on-demand, livestream, or clips | Not shown | Audience & Access | Viewing-mode distribution | Yes | JSON + summary CSV | Clarifies linear versus on-demand strategy |
| What You Watch | program_category_interest | Interest ratings across 17 categories | Full: ranked averages | Programming Priorities | Ranked averages plus response distributions | Yes | JSON + summary CSV | Current dashboard shows averages only |
| What You Watch | valued_programs | Programs respondents found valuable or memorable | Partial: raw comments only | Viewer Voices | Theme groups, counts, and original comments | Yes | JSON + summary CSV answered count | Do not present automated themes as quotations |
| What You Watch | kids_use | How children’s programming/resources are used | Not shown | Audience & Access | Method distribution within eligible segment | Conditional | JSON + summary CSV | Child-role denominator |
| What You Want | program_category_priorities | Five categories respondents want emphasized | Full: ranked counts | Programming Priorities | Ranked selections and comparison with interest ratings | Yes | JSON + summary CSV | High-value decision input |
| What You Want | local_formats | Preferred local/regional program formats | Not shown | Programming Priorities | Ranked selections | Yes | JSON + summary CSV | Useful for production format decisions |
| What You Want | online_improvements | Desired online improvements | Not shown | Audience & Access | Ranked digital improvements | Yes | JSON + summary CSV | Potential action list |
| What You Want | learn_preferred | Preferred ways to learn about programs | Not shown | Audience & Access | Communication-channel ranking | Yes | JSON + summary CSV | Primary communication planning input |
| What You Want | kids_needs | Children’s, family, classroom, or educator needs | Partial: raw comments only | Viewer Voices | Theme groups and original comments | Conditional | JSON + summary CSV answered count | Also informs Programming Priorities |
| How We’re Doing | station_role_importance | Importance of nine station roles | Partial: paired averages/gaps only | Performance & Opportunities | Importance distribution, paired gap, and role ranking | Yes | JSON + summary CSV | Unpaired importance ratings should remain visible |
| How We’re Doing | station_role_performance | Viewer-rated delivery on nine station roles | Partial: paired averages/gaps only | Performance & Opportunities | Performance distribution, paired gap, and role ranking | Yes | JSON + summary CSV | Only applicable viewers; unpaired performance ratings should remain visible |
| How We’re Doing | reflects_me | How well WNMU-TV reflects people like the respondent | Not shown | Performance & Opportunities | Score distribution and segment comparisons | Yes | JSON + summary CSV | Former/never routing |
| How We’re Doing | trust_station | Trust in WNMU-TV programming and information | Not shown | Performance & Opportunities | Score distribution and segment comparisons | Yes | JSON + summary CSV | Strong candidate for headline finding |
| How We’re Doing | nonviewer_reasons | Reasons former/non-viewers do not watch more | Not shown | Performance & Opportunities | Ranked barriers | Yes | JSON + summary CSV | Applicable former/never/unsure respondents only |
| How We’re Doing | nonviewer_return | Changes that could attract or regain viewers | Partial: raw comments only | Viewer Voices | Theme groups, counts, and original comments | Yes | JSON + summary CSV answered count | Also informs Performance & Opportunities |
| How We’re Doing | final_feedback | What WNMU does well, should improve, or should know | Partial: raw comments only | Viewer Voices | Separate strengths, improvements, and other themes | Yes | JSON + summary CSV answered count | Question currently combines three prompts in one field |

## 6. Follow-up questionnaire ledger

| Stage / module | Question ID | Measures | Current results | Primary future section | Planned presentation | Brief? | Current export | Notes |
|---|---|---|---|---|---|---|---|---|
| Local and Upper Peninsula programming | local_subjects | Regional subjects needing attention | Export only | Programming Priorities | Ranked selections | Yes | Linked JSON only | Follow-up-specific denominator; no aggregate dashboard or CSV |
| Local and Upper Peninsula programming | local_areas | Parts of the region needing more attention | Export only | Programming Priorities | Geographic/community representation ranking | Yes | Linked JSON only | Live wording still says places or communities; revision pending |
| Local and Upper Peninsula programming | local_formats_followup | Formats likely to attract viewing | Export only | Programming Priorities | Ranked selections | Yes | Linked JSON only | Compare with core `local_formats` without merging denominators |
| Local and Upper Peninsula programming | local_voices | Voices that should be heard more often | Export only | Programming Priorities | Ranked representation priorities | Yes | Linked JSON only | Inclusivity review requested |
| Local and Upper Peninsula programming | original_up_production_importance | Demand for renewed WNMU original U.P. production | Export only | Performance & Opportunities | Importance distribution | Yes | Linked JSON only | Distinct from demand for regional content generally |
| Local and Upper Peninsula programming | regional_source_balance | Preferred balance of WNMU and outside productions | Export only | Programming Priorities | Distribution | Yes | Linked JSON only | Supports produce/license/acquire decisions |
| Local and Upper Peninsula programming | outside_producer_partnerships | Preferred ways WNMU should work with outside producers | Export only | Performance & Opportunities | Ranked partnership options | Yes | Linked JSON only | Needs public-facing explanation of licensing workflow |
| Local and Upper Peninsula programming | local_program_idea | Regional story, person, place, organization, producer, or idea | Export only | Viewer Voices | Theme groups and original comments | Yes | Linked JSON only | Qualitative; avoid implying acquisition commitment |
| Programming interests and ideas | deeper_priority_categories | Which linked core priorities need elaboration | Export only | Programming Priorities | Context banner rather than a repeated question | No | Linked JSON only | User requested replacing checkbox question with linked-priority statement |
| Programming interests and ideas | specific_program_subjects | Specific subjects and kinds of programs within priorities | Export only | Viewer Voices | Theme groups linked to core priorities | Yes | Linked JSON only | Music-performance series needs a visible path |
| Programming interests and ideas | program_characteristics | Qualities that make programming valuable | Export only | Programming Priorities | Ranked selections | Yes | Linked JSON only | Live max 4; revision requested to max 5 |
| Programming interests and ideas | program_length_preferences | Preferred lengths and series formats | Export only | Programming Priorities | Ranked selections | Conditional | Linked JSON only | Useful for production and scheduling |
| Programming interests and ideas | program_origin_mix | Preferred sources of programming | Export only | Programming Priorities | Ranked selections | Yes | Linked JSON only | Live max 4; revision requested to max 3 |
| Programming interests and ideas | new_vs_familiar | Preferred balance of new and familiar programs | Export only | Programming Priorities | Distribution | Yes | Linked JSON only | Acquisition/repeat strategy |
| Programming interests and ideas | special_programming_interest | Interest in themed, event, and curated approaches | Export only | Programming Priorities | Ranked selections | Yes | Linked JSON only | Live max 4; revision requested to max 3; clarify on-demand wording |
| Programming interests and ideas | program_recommendations | Viewer program/producer/series recommendations and ideas | Export only | Viewer Voices | Theme groups and original comments | Conditional | Linked JSON only | Revision requested to remove specific programs/series and focus on developable ideas |
| Online viewing, PBS App, and Passport | online_devices | Devices used or considered for online viewing | Export only | Audience & Access | Device distribution | Yes | Linked JSON only | Follow-up-specific denominator |
| Online viewing, PBS App, and Passport | online_primary_service | Primary WNMU/PBS online service | Export only | Audience & Access | Service distribution | Yes | Linked JSON only | Keep PBS.org and PBS App separate |
| Online viewing, PBS App, and Passport | online_frequency | Frequency of online viewing | Export only | Audience & Access | Frequency distribution | Yes | Linked JSON only | Segment by primary service/device |
| Online viewing, PBS App, and Passport | online_barriers | Barriers to online viewing | Export only | Audience & Access | Ranked barriers | Yes | Linked JSON only | Action-oriented support findings |
| Online viewing, PBS App, and Passport | passport_status | Passport experience/status | Export only | Audience & Access | Status funnel | Yes | Linked JSON only | Education/activation opportunity |
| Online viewing, PBS App, and Passport | online_help_formats | Preferred forms of online help | Export only | Audience & Access | Ranked help channels | Yes | Linked JSON only | Action list |
| Online viewing, PBS App, and Passport | online_features | Desired online features | Export only | Audience & Access | Ranked improvements | Yes | Linked JSON only | Digital roadmap input |
| Online viewing, PBS App, and Passport | online_comments | Other online-viewing experiences | Export only | Viewer Voices | Theme groups and original comments | Conditional | Linked JSON only | Qualitative barriers and ideas |
| Children's programming and education | children_age_groups | Age groups served | Export only | Audience & Access | Eligible-segment distribution | No | Linked JSON only | Children-module respondents only |
| Children's programming and education | children_settings | Home, classroom, library, childcare, and other settings | Export only | Audience & Access | Setting distribution | Conditional | Linked JSON only | Children-module respondents only |
| Children's programming and education | children_learning_goals | Learning goals to support | Export only | Programming Priorities | Ranked selections | Yes | Linked JSON only | Live max 5; revision requested to max 4 |
| Children's programming and education | children_local_importance | Importance of U.P./Great Lakes learning content | Export only | Programming Priorities | Importance distribution | Yes | Linked JSON only | Potential local-production case |
| Children's programming and education | children_local_topics | Useful local/regional topics for children | Export only | Programming Priorities | Ranked selections | Yes | Linked JSON only | Content development |
| Children's programming and education | educator_resources | Useful educational resources | Export only | Programming Priorities | Ranked selections | Yes | Linked JSON only | Resource-development decisions |
| Children's programming and education | children_access_barriers | Barriers to using children’s resources | Export only | Audience & Access | Ranked barriers | Yes | Linked JSON only | Distribution/support decisions |
| Children's programming and education | children_comments | Other needs of families, educators, and organizations | Export only | Viewer Voices | Theme groups and original comments | Conditional | Linked JSON only | Possible performance question still under review |
| Communication and finding programs | planning_horizon | How far ahead viewing decisions are made | Export only | Audience & Access | Distribution | Yes | Linked JSON only | Promotion timing |
| Communication and finding programs | program_information_needed | Information needed to decide whether to watch | Export only | Audience & Access | Ranked selections split by broadcast/streaming relevance | Yes | Linked JSON only | Live wording mixes broadcast and streaming; clarification requested |
| Communication and finding programs | schedule_format | Useful schedule formats | Export only | Audience & Access | Ranked schedule products | Yes | Linked JSON only | Product roadmap |
| Communication and finding programs | message_frequency | Desired communication frequency | Export only | Audience & Access | Distribution | Yes | Linked JSON only | Contact cadence |
| Communication and finding programs | reminder_preferences | Reminder methods respondents would consider | Export only | Audience & Access | Ranked channels | Yes | Linked JSON only | Does not authorize contact by itself |
| Communication and finding programs | social_content_interest | Useful post/message types | Export only | Audience & Access | Ranked content types | Yes | Linked JSON only | Content marketing |
| Communication and finding programs | communication_barriers | Barriers to knowing what WNMU offers | Export only | Audience & Access | Ranked barriers | Yes | Linked JSON only | Action-oriented communication findings |
| Communication and finding programs | communication_comments | How WNMU can inform without becoming intrusive | Export only | Viewer Voices | Theme groups and original comments | Conditional | Linked JSON only | Qualitative communication guidance |

## 7. Operational and contact records

The requested optional email address must not become a questionnaire answer or linkage key.

| Record | Current state | Intended storage | Results treatment | Access |
|---|---|---|---|---|
| Optional email/contact opt-in | Not yet collected | Separate contact table keyed by a limited operational reference, not inside core or follow-up answers | Show only aggregate counts such as “requested future information”; exclude from research filters, charts, raw questionnaire exports, and the Decision Brief | Restricted operational access only |

The contact form must explain what information the respondent is requesting, how the address will be used, and that the email address is stored separately from questionnaire answers.

## 8. Highest-priority coverage defects

1. `viewing_methods`: the current online-use headline checks the retired `pbs_app_web` value and therefore does not count the separate `pbs_app` and `pbs_org` choices correctly.
2. Twelve live core questions are absent from the visible dashboard.
3. Importance and performance are shown only through paired averages and gaps. Unpaired importance and performance distributions are not visible.
4. Open responses are presented as a single comment stream rather than organized strengths, improvements, barriers, ideas, and return opportunities.
5. Follow-up responses have no aggregate analysis or CSV export.
6. Skipped and not-applicable counts are not consistently visible beside dashboard results, although the summary CSV preserves question-specific answered denominators.

## 9. Maintenance procedure

Update this ledger whenever a question, option, scale, routing rule, results renderer, export, or schema changes.

For each change:

1. confirm the question still has a unique stable ID;
2. update its current coverage status;
3. identify its primary future section and planned display;
4. verify denominator and routing notes;
5. verify raw JSON and summary/CSV treatment;
6. review whether it may contribute to the Decision Brief;
7. keep missing and not-applicable responses distinct from negative answers.

A questionnaire revision is not analytically complete until its ledger row is current.
