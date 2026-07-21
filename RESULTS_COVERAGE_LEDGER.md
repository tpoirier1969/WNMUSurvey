# RESULTS_COVERAGE_LEDGER.md - WNMU-TV Questionnaire Results Coverage

## 1. Governing rule

Every collected live question must appear in **All Data & Export** or be explicitly classified as operational-only, contact-only, or retired. Every percentage must use an honest question or module denominator. Missing, skipped, not-applicable, not-sure, and negative answers remain distinct.

Current contract:

- core schema: `wnmu-viewer-questionnaire-v6`
- follow-up schema: `wnmu-viewer-follow-ups-v2`
- build: `6.3.2-test`
- audit date: 2026-07-21

## 2. Results structure

1. Decision Brief with denominator-safe core and voluntary self-selected follow-up findings
2. Audience & Access
3. Programming Priorities
4. Performance & Opportunities
5. Viewer Voices
6. All Data & Export

Core and follow-up results share these sections, but follow-up findings retain module-specific self-selected denominators.

## 3. Coverage summary

- All 28 live core questions are visible in primary sections and All Data & Export.
- All 40 live follow-up questions are visible in primary sections and All Data & Export.
- Core results load 25 synthetic core responses plus valid v6 browser submissions in Test Mode.
- Follow-up results load 60 synthetic v2 module submissions plus valid v2 browser submissions.
- Core filters affect follow-up reporting through linked core response IDs.
- Raw JSON contains both core and follow-up records.
- Core and follow-up stable-label CSV exports are separate.
- `deeper_priority_categories` and `program_recommendations` are retired and not reused.
- Open responses are organized into transparent keyword themes while original comments remain unchanged under their source questions.
- Optional contact details remain outside research results and exports; only an aggregate linked-request count appears.

## 4. Core questionnaire ledger

| Stage | Question ID | Measures | Current results | Primary section | Active presentation | Brief? | Export | Notes |
|---|---|---|---|---|---|---|---|---|
| About You | `county_region` | Respondent geography | Full | Audience & Access | Location distribution and filter; answered/skipped/not-applicable in All Data | Conditional | JSON + core CSV | Question denominator; prefer-not retained |
| About You | `community_type` | City, town, or rural setting | Full | Audience & Access | Distribution; answered/skipped/not-applicable in All Data | Conditional | JSON + core CSV | Available for access cross-tabs |
| About You | `age_range` | Age group | Full | Audience & Access | Distribution and filter; answered/skipped/not-applicable in All Data | No | JSON + core CSV | Segmentation only |
| About You | `internet_streaming_quality` | Ability to stream video at home | Full | Audience & Access | Access distribution; answered/skipped/not-applicable in All Data | Yes | JSON + core CSV | Broadcast-versus-streaming strategy |
| About You | `children_role` | Household or educator responsibility | Full | Audience & Access | Headline, distribution, filter; answered/skipped/not-applicable in All Data | Conditional | JSON + core CSV | Children eligibility base |
| WNMU & You | `station_awareness` | Pre-questionnaire station awareness | Full | Audience & Access | Awareness distribution; answered/skipped/not-applicable in All Data | Yes | JSON + core CSV | Brand/outreach |
| WNMU & You | `viewer_status` | Current/former/non-viewer relationship | Full | Audience & Access | Headline, distribution, filter; answered/skipped/not-applicable in All Data | Yes | JSON + core CSV | Core audience context |
| WNMU & You | `viewing_methods` | Ways respondents watch | Full | Audience & Access | Multi-select distribution, filter, online headline; answered/skipped/not-applicable in All Data | Yes | JSON + core CSV | PBS App and PBS.org separate |
| WNMU & You | `channel_awareness` | Awareness of four channels | Full | Audience & Access | Channel funnel; answered/skipped/not-applicable in All Data | Yes | JSON + core CSV | Question-specific denominator |
| WNMU & You | `channels_received` | Channels respondents can receive | Full | Audience & Access | Channel funnel; answered/skipped/not-applicable in All Data | Yes | JSON + core CSV | Applicable access methods only |
| WNMU & You | `online_awareness` | Awareness of online services | Full | Audience & Access | Service distribution; answered/skipped/not-applicable in All Data | Yes | JSON + core CSV | PBS App and PBS.org separate |
| What You Watch | `channels_watched` | Channels watched | Full | Audience & Access | Channel funnel; answered/skipped/not-applicable in All Data | Yes | JSON + core CSV | Never-viewer routing |
| What You Watch | `watch_preference` | Scheduled, recorded, and online preference | Full | Audience & Access | Distribution; answered/skipped/not-applicable in All Data | Yes | JSON + core CSV | Linear versus on-demand |
| What You Watch | `program_category_interest` | Interest ratings across 17 categories | Full | Programming Priorities | Ranked averages and detailed distributions; answered/skipped/not-applicable in All Data | Yes | JSON + core CSV | Missing and na excluded |
| What You Watch | `valued_programs` | Valuable or memorable programs | Full | Viewer Voices | Themed review aid plus unchanged original comments and answered count; answered/skipped/not-applicable in All Data | Yes | JSON + core CSV answered count | Theme matching may place one original comment in multiple themes |
| What You Watch | `kids_use` | How children content is used | Full | Audience & Access | Eligible-segment distribution; answered/skipped/not-applicable in All Data | Conditional | JSON + core CSV | Child-role routing |
| What You Want | `program_category_priorities` | Five categories to emphasize | Full | Programming Priorities | Ranked selections; answered/skipped/not-applicable in All Data | Yes | JSON + core CSV | Linked follow-up context |
| What You Want | `local_formats` | Preferred local/regional formats | Full | Programming Priorities | Ranked selections; answered/skipped/not-applicable in All Data | Yes | JSON + core CSV | Production format input |
| What You Want | `online_improvements` | Desired online improvements | Full | Audience & Access | Ranked selections; answered/skipped/not-applicable in All Data | Yes | JSON + core CSV | Digital roadmap |
| What You Want | `learn_preferred` | Preferred programming-information channels | Full | Audience & Access | Ranked selections; answered/skipped/not-applicable in All Data | Yes | JSON + core CSV | Communication planning |
| What You Want | `kids_needs` | Children/family/educator needs | Full | Viewer Voices | Original comments and answered count; answered/skipped/not-applicable in All Data | Conditional | JSON + core CSV answered count | Also programming input |
| How We're Doing | `station_role_importance` | Importance of nine station roles | Full | Performance & Opportunities | Standalone averages/distributions and paired gap; answered/skipped/not-applicable in All Data | Yes | JSON + core CSV | Unpaired ratings visible |
| How We're Doing | `station_role_performance` | Viewer-rated delivery on nine roles | Full | Performance & Opportunities | Standalone averages/distributions and paired gap; answered/skipped/not-applicable in All Data | Yes | JSON + core CSV | Applicable viewers only |
| How We're Doing | `reflects_me` | Regional reflection | Full | Performance & Opportunities | Distribution; answered/skipped/not-applicable in All Data | Yes | JSON + core CSV | Former/never not applicable |
| How We're Doing | `trust_station` | Trust in WNMU-TV | Full | Performance & Opportunities | Distribution; answered/skipped/not-applicable in All Data | Yes | JSON + core CSV | Headline candidate |
| How We're Doing | `nonviewer_reasons` | Reasons for not watching more | Full | Performance & Opportunities | Ranked barriers; answered/skipped/not-applicable in All Data | Yes | JSON + core CSV | Former/never/unsure only |
| How We're Doing | `nonviewer_return` | Changes that could attract/regain viewers | Full | Viewer Voices | Original comments and answered count; answered/skipped/not-applicable in All Data | Yes | JSON + core CSV answered count | Also opportunity input |
| How We're Doing | `final_feedback` | Strengths, improvements, and other feedback | Full | Viewer Voices | Themed review aid plus unchanged original comments and answered count; answered/skipped/not-applicable in All Data | Yes | JSON + core CSV answered count | Theme matching may place one original comment in multiple themes |

## 5. Follow-up questionnaire ledger

| Module | Question ID | Measures | Current results | Primary section | Active presentation | Brief? | Export | Denominator / compatibility |
|---|---|---|---|---|---|---|---|---|
| Local and Upper Peninsula programming | `local_subjects` | Subject priorities | Full | Programming Priorities | Ranked multi-select distribution; answered/skipped/module n in All Data | Yes | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Local and Upper Peninsula programming | `local_areas` | Geographic representation gaps | Full | Programming Priorities | Ranked multi-select distribution; answered/skipped/module n in All Data | Yes | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Local and Upper Peninsula programming | `local_formats_followup` | Format development | Full | Programming Priorities | Ranked multi-select distribution; answered/skipped/module n in All Data | Yes | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Local and Upper Peninsula programming | `local_voices` | Source and representation planning | Full | Programming Priorities | Ranked multi-select distribution; answered/skipped/module n in All Data | Yes | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Local and Upper Peninsula programming | `original_up_production_importance` | Direct measure of original-production demand | Full | Performance & Opportunities | Distribution; answered/skipped/module n in All Data | Yes | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Local and Upper Peninsula programming | `regional_source_balance` | Acquisition-versus-production strategy | Full | Programming Priorities | Distribution; answered/skipped/module n in All Data | Yes | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Local and Upper Peninsula programming | `outside_producer_partnerships` | Partnership workflow priorities | Full | Performance & Opportunities | Ranked multi-select distribution; answered/skipped/module n in All Data | Yes | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Local and Upper Peninsula programming | `local_program_idea` | Regional idea and producer discovery | Full | Viewer Voices | Original comments; answered/skipped/module n in All Data | Conditional | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Programming interests and ideas | `specific_program_subjects` | Topic development linked to core priorities | Full | Viewer Voices | Original comments; answered/skipped/module n in All Data | Conditional | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Programming interests and ideas | `regional_music_performance_interest` | Demand and genre direction for a regional music-performance concept | Full | Programming Priorities | Ranked multi-select distribution; answered/skipped/module n in All Data | Yes | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2; new ID |
| Programming interests and ideas | `program_characteristics` | Editorial tone and quality expectations | Full | Programming Priorities | Ranked multi-select distribution; answered/skipped/module n in All Data | Yes | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2; updated selection limit |
| Programming interests and ideas | `program_length_preferences` | Format and scheduling | Full | Programming Priorities | Ranked multi-select distribution; answered/skipped/module n in All Data | Conditional | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Programming interests and ideas | `program_origin_mix` | Content-source balance | Full | Programming Priorities | Ranked multi-select distribution; answered/skipped/module n in All Data | Yes | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2; updated selection limit |
| Programming interests and ideas | `new_vs_familiar` | Acquisitions and repeat strategy | Full | Programming Priorities | Distribution; answered/skipped/module n in All Data | Yes | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Programming interests and ideas | `special_programming_interest` | Packaging and engagement formats | Full | Programming Priorities | Ranked multi-select distribution; answered/skipped/module n in All Data | Yes | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2; updated selection limit |
| Programming interests and ideas | `program_development_ideas` | Developable programming ideas | Full | Viewer Voices | Original comments; answered/skipped/module n in All Data | Conditional | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2; new ID replacing retired prompt |
| Online viewing, PBS App, and Passport | `online_devices` | Device support | Full | Audience & Access | Ranked multi-select distribution; answered/skipped/module n in All Data | Yes | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Online viewing, PBS App, and Passport | `online_primary_service` | Primary online path | Full | Audience & Access | Distribution; answered/skipped/module n in All Data | Yes | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Online viewing, PBS App, and Passport | `online_frequency` | Online engagement | Full | Audience & Access | Distribution; answered/skipped/module n in All Data | Yes | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Online viewing, PBS App, and Passport | `online_barriers` | Support and product barriers | Full | Audience & Access | Ranked multi-select distribution; answered/skipped/module n in All Data | Yes | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Online viewing, PBS App, and Passport | `passport_status` | Passport education and activation | Full | Audience & Access | Distribution; answered/skipped/module n in All Data | Yes | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Online viewing, PBS App, and Passport | `online_help_formats` | Support-channel planning | Full | Audience & Access | Ranked multi-select distribution; answered/skipped/module n in All Data | Yes | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Online viewing, PBS App, and Passport | `online_features` | Digital roadmap | Full | Audience & Access | Ranked multi-select distribution; answered/skipped/module n in All Data | Yes | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Online viewing, PBS App, and Passport | `online_comments` | Qualitative barriers and ideas | Full | Viewer Voices | Original comments; answered/skipped/module n in All Data | Conditional | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Children's programming and education | `children_age_groups` | Age segmentation | Full | Audience & Access | Ranked multi-select distribution; answered/skipped/module n in All Data | No | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Children's programming and education | `children_settings` | Household and institutional use | Full | Audience & Access | Ranked multi-select distribution; answered/skipped/module n in All Data | Conditional | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Children's programming and education | `children_learning_goals` | Educational priorities | Full | Programming Priorities | Ranked multi-select distribution; answered/skipped/module n in All Data | Yes | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2; updated selection limit |
| Children's programming and education | `children_local_importance` | Demand for regional children's content | Full | Programming Priorities | Distribution; answered/skipped/module n in All Data | Yes | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Children's programming and education | `children_local_topics` | Local-content development | Full | Programming Priorities | Ranked multi-select distribution; answered/skipped/module n in All Data | Yes | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Children's programming and education | `educator_resources` | Resource development | Full | Programming Priorities | Ranked multi-select distribution; answered/skipped/module n in All Data | Yes | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Children's programming and education | `children_access_barriers` | Distribution and support barriers | Full | Audience & Access | Ranked multi-select distribution; answered/skipped/module n in All Data | Yes | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Children's programming and education | `children_comments` | Qualitative needs | Full | Viewer Voices | Original comments; answered/skipped/module n in All Data | Conditional | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Communication and finding programs | `planning_horizon` | Timing of promotion | Full | Audience & Access | Distribution; answered/skipped/module n in All Data | Yes | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Communication and finding programs | `program_information_needed` | Metadata and promotion requirements | Full | Audience & Access | Ranked multi-select distribution; answered/skipped/module n in All Data | Yes | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Communication and finding programs | `schedule_format` | Schedule-product priorities | Full | Audience & Access | Ranked multi-select distribution; answered/skipped/module n in All Data | Yes | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Communication and finding programs | `message_frequency` | Contact cadence | Full | Audience & Access | Distribution; answered/skipped/module n in All Data | Yes | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Communication and finding programs | `reminder_preferences` | Reminder-channel planning | Full | Audience & Access | Ranked multi-select distribution; answered/skipped/module n in All Data | Yes | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Communication and finding programs | `social_content_interest` | Content marketing | Full | Audience & Access | Ranked multi-select distribution; answered/skipped/module n in All Data | Yes | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Communication and finding programs | `communication_barriers` | Communication problems | Full | Audience & Access | Ranked multi-select distribution; answered/skipped/module n in All Data | Yes | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |
| Communication and finding programs | `communication_comments` | Qualitative communication guidance | Full | Viewer Voices | Original comments; answered/skipped/module n in All Data | Conditional | Combined JSON + follow-up CSV | Module-specific self-selected denominator; v2 |

## 6. Informational context and retired IDs

| Item | Treatment | Results treatment |
|---|---|---|
| Programming priority context | Read-only display of linked core `program_category_priorities` | Not an answer and not reported as a follow-up question |
| Local-production licensing explanation | Page introduction explaining licensing of qualifying finished independent work | Not an answer and not reported |
| Broadcast/streaming communication introduction | Page introduction clarifying that questions cover channel airings and streaming | Not an answer and not reported |
| `deeper_priority_categories` | Retired v1 ID | Historical prototype data only; not loaded into v2 |
| `program_recommendations` | Retired v1 ID | Historical prototype data only; replaced by new `program_development_ideas` |

## 7. Operational and contact records

| Record | Current state | Intended storage | Results treatment |
|---|---|---|---|
| Optional email/contact opt-in | Active in Test after core submission; name optional, email and consent required, one or more contact reasons required | `wnmu-viewer-contact-v1`; separate browser key in Test and separate protected contact table required for production | Aggregate valid linked-request count only; no contact details or records in research results, raw JSON, or CSV exports |

## 8. Maintenance procedure

Update this ledger whenever a question, option, scale, routing rule, result renderer, export, storage boundary, or schema changes. For each affected row, verify the stable ID, primary section, display, denominator, routing, export treatment, older-data handling, and Decision Brief eligibility. A questionnaire revision is not analytically complete until the affected ledger rows are current.
