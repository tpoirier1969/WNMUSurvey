# RESULTS_COVERAGE_LEDGER.md - WNMU Questionnaire Results Coverage

## 1. Active contract

- Core schema: `wnmu-viewer-questionnaire-v7`
- Follow-up schema: `wnmu-viewer-follow-ups-v3`
- Rebuild interface: `rebuild-0.3.0`
- Audit date: 2026-07-23

All 31 core and 35 follow-up IDs appear in rebuild results and linked JSON exports. Results distinguish answered, skipped, and routed-not-applicable records. Follow-up questions use applicable module-response denominators.

## 2. Results structure

1. Audience and access
2. Television viewing and priorities
3. Online viewing and priorities
4. Local and regional programming
5. Station performance and opportunities
6. Children and education
7. Communication
8. Viewer comments
9. All linked JSON data

The current rebuild renderer displays questions by stage and module rather than these editorial headings, but every measure remains visible and exportable.

## 3. Core ledger

| Stage | ID | Primary measure | Routing / denominator note |
|---|---|---|---|
| About You | `county_region` | Geography | Answered core respondents |
| About You | `community_type` | City/town/rural | Answered core respondents |
| About You | `age_range` | Age segment | Answered core respondents |
| About You | `internet_streaming_quality` | Home streaming access | Answered core respondents |
| About You | `children_role` | Household/professional children's role | All core; routing controller |
| WNMU & You | `station_awareness` | WNMU/PBS awareness | Answered core respondents |
| WNMU & You | `viewer_status` | Viewer relationship | All core; routing controller |
| WNMU & You | `viewing_methods` | Viewing methods | All core; routing controller |
| WNMU & You | `channel_awareness` | Channel awareness | Answered core respondents |
| WNMU & You | `channels_received` | Channel availability | Television-method respondents |
| WNMU & You | `online_awareness` | Online-service awareness | Answered core respondents |
| What You Watch | `channels_watched` | Channels watched | Excludes never-viewers |
| What You Watch | `watch_preference` | General viewing preference | Answered core respondents |
| What You Watch | `television_categories_watched` | Current television category use | Television-method respondents |
| What You Watch | `online_categories_watched` | Current online category use | Online-method respondents |
| What You Watch | `television_program_interest` | Potential television interest | Television-method respondents; row answered n |
| What You Watch | `online_program_interest` | Potential online interest | Online-method respondents; row answered n |
| What You Watch | `valued_programs` | Memorable programs | Answered comments |
| What You Want | `television_program_priorities` | Television emphasis | Television-method respondents |
| What You Want | `online_program_priorities` | Online emphasis | Online-method respondents |
| What You Want | `local_formats` | Regional format preferences | Answered core respondents |
| What You Want | `online_improvements` | WNMU online actions | Answered core; nonuser and no-change distinct |
| What You Want | `learn_preferred` | Information channels | Answered core respondents |
| What You Want | `kids_needs` | Children's needs | Child-role respondents |
| How We're Doing | `station_role_importance` | Importance of station roles | Row-specific answered n |
| How We're Doing | `station_role_performance` | Performance of station roles | Current/uncertain viewers; row-specific answered n |
| How We're Doing | `reflects_me` | Personal/regional reflection | Excludes former/never |
| How We're Doing | `trust_station` | Trust | Excludes former/never |
| How We're Doing | `nonviewer_reasons` | Low-use/nonviewer barriers | Once/twice, former, never, unsure |
| How We're Doing | `nonviewer_return` | Re-engagement opportunity | Once/twice, former, never, unsure |
| How We're Doing | `final_feedback` | Strengths and improvements | Answered comments |

## 4. Follow-up ledger

| Module | IDs | Denominator note |
|---|---|---|
| Local and regional programming | `regional_program_interest`, `local_voices`, `up_programming_importance`, `great_lakes_programming_importance`, `michigan_programming_importance`, `northern_wisconsin_programming_importance`, `local_program_idea` | Submitted local module; answered question n |
| Programming interests and ideas | `specific_program_subjects`, `program_characteristics`, `program_length_preferences`, `new_vs_familiar`, `special_programming_interest`, `program_development_ideas` | Submitted programming module; answered question n |
| Online viewing | `online_primary_service`, `online_frequency`, `passport_status`, `wnmu_online_appeal`, `online_help_formats`, `online_comments` | Submitted online module; answered question n |
| Children and education | `children_age_groups`, `children_settings`, `children_learning_goals`, `children_local_importance`, `children_local_topics`, `educator_resources`, `children_access_barriers`, `children_comments` | Submitted eligible module; `children_settings` and `educator_resources` apply only to educator/both roles |
| Communication | `planning_horizon`, `program_information_needed`, `schedule_format`, `message_frequency`, `reminder_preferences`, `social_content_interest`, `communication_barriers`, `communication_comments` | Submitted communication module; answered question n |

## 5. Retired IDs

Core retired in v7:

- `program_category_interest`
- `program_category_priorities`
- `kids_use`

Follow-up retired in v3:

- `local_subjects`
- `local_areas`
- `local_formats_followup`
- `original_up_production_importance`
- `regional_source_balance`
- `outside_producer_partnerships`
- `regional_music_performance_interest`
- `program_origin_mix`
- `online_devices`
- `online_barriers`
- `online_features`

Retired prototype answers remain historical and are not mapped into new IDs.
