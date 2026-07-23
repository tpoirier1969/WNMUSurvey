# FOLLOW_UP_QUESTIONNAIRE_SPEC.md - Optional WNMU-TV Viewer Follow-ups

## 1. Active test contract

- Follow-up schema: `wnmu-viewer-follow-ups-v3`
- Linked core schema: `wnmu-viewer-questionnaire-v7`
- Rebuild interface: `rebuild-0.3.0`
- Release date: 2026-07-23
- Mode: Test
- Modules: 5
- Questions required: none
- Live follow-up IDs: 35
- Storage: isolated browser local storage

Version 3 creates a clean response boundary. Version 2 drafts and submissions remain historical prototype data and are not loaded or reinterpreted.

## 2. Common rules

- Follow-ups are voluntary and self-selected.
- Each response links to a submitted core response through pseudonymous IDs.
- No name or email is stored in answer records.
- Question-level routing may depend on the submitted core `children_role`.
- Results show answered, skipped, and not-applicable counts.
- Percentages use submitted-module or applicable-question denominators, never all core respondents unless explicitly labeled.
- Questions may refer to PBS App, Passport, or PBS.org as places where WNMU-TV programming is available, but ask only what WNMU-TV can do.

## 3. Local and regional programming

Purpose: Learn which regional subjects, voices, geographic areas, and ideas matter. Do not ask viewers to design WNMU-TV production, acquisition, licensing, or partnership workflows.

| ID | Measure | Type |
|---|---|---|
| `local_subjects` | Up to five regional subject priorities, including a distinct regional music and live-performance option | Checkbox |
| `local_voices` | Voices and experiences needing greater representation | Checkbox |
| `up_programming_importance` | Importance of Upper Peninsula programming | Radio 1–5 + not sure |
| `great_lakes_programming_importance` | Importance of Great Lakes regional programming | Radio 1–5 + not sure |
| `michigan_programming_importance` | Importance of Michigan programming | Radio 1–5 + not sure |
| `northern_wisconsin_programming_importance` | Importance of northern Wisconsin and nearby-community programming | Radio 1–5 + not sure |
| `local_program_idea` | Regional story, person, place, organization, performance, or idea | Text |

Regional music is phrased neutrally as one subject among many. It is not presented as a proposed series and does not ask respondents to design a program.

Retired from v2:

- `local_areas`
- `local_formats_followup`
- `original_up_production_importance`
- `regional_source_balance`
- `outside_producer_partnerships`

`original_up_production_importance` is replaced by `up_programming_importance` because the research need is the importance of U.P. programming, not who produces it.

## 4. Programming interests and ideas

The context card combines distinct television and online core priorities without asking respondents to select them again.

| ID | Measure | Type |
|---|---|---|
| `specific_program_subjects` | Subjects and stories within core priorities | Text |
| `program_characteristics` | Qualities that make programming valuable | Checkbox |
| `program_length_preferences` | Preferred lengths | Checkbox |
| `new_vs_familiar` | New programming versus familiar favorites | Radio |
| `special_programming_interest` | Themed, seasonal, live, community, marathon, or curated approaches | Checkbox |
| `program_development_ideas` | Additional program, format, audience, or regional ideas | Text |

Retired from v2:

- `regional_music_performance_interest`, because regional music is now a neutral regional-subject option
- `program_origin_mix`, because viewers should not be asked to decide internal source or acquisition strategy

## 5. Online viewing, PBS App, and Passport

Purpose: Learn how WNMU-TV can explain, support, organize, promote, and make its online programming easier to find. The module never asks what PBS should change.

| ID | Measure | Type |
|---|---|---|
| `online_primary_service` | Service used most often | Radio |
| `online_frequency` | Online viewing frequency | Radio |
| `passport_status` | Current Passport awareness/use status through WNMU-TV | Radio |
| `wnmu_online_appeal` | Positive WNMU-controlled actions that could improve online appeal | Checkbox |
| `online_help_formats` | Preferred help from WNMU-TV | Checkbox |
| `online_comments` | Open online guidance | Text |

`wnmu_online_appeal` contains separate exclusive answers for:

- Not applicable — respondent does not watch online
- Nothing additional would make respondent more likely to watch online

Retired from v2:

- `online_devices`
- `online_barriers`
- `online_features`

The broad internet-quality limitation remains measured in the core and is not repeated here as a problem WNMU-TV can fix.

## 6. Children's programming and education

Eligibility: core `children_role` is household, educator, or both.

| ID | Measure | Routing |
|---|---|---|
| `children_age_groups` | Ages served | All eligible |
| `children_settings` | Institutional and non-home settings | Educator or both only |
| `children_learning_goals` | Learning priorities | All eligible |
| `children_local_importance` | Importance of U.P./Great Lakes children's content | All eligible |
| `children_local_topics` | Useful regional topics | All eligible |
| `educator_resources` | Resources useful in professional work | Educator or both only |
| `children_access_barriers` | Access and use barriers | All eligible |
| `children_comments` | Open needs | All eligible |

Household-only respondents do not see institutional-setting or educator-resource questions.

## 7. Communication and finding programs

| ID | Measure |
|---|---|
| `planning_horizon` | How far ahead viewers plan |
| `program_information_needed` | Information needed to decide whether to watch |
| `schedule_format` | Preferred schedule products |
| `message_frequency` | Desired communication frequency |
| `reminder_preferences` | Reminder methods |
| `social_content_interest` | Useful social content |
| `communication_barriers` | Problems finding WNMU-TV information |
| `communication_comments` | How to stay informative without becoming intrusive |

The introduction asks respondents to consider both WNMU-TV channels and programs WNMU-TV makes available online.

## 8. Storage and compatibility

- access records: `wnmuStandaloneRebuildFollowUpAccess:v2`
- v3 module drafts: `wnmuStandaloneRebuildFollowUpDrafts:v3`
- v3 submitted modules: `wnmuStandaloneRebuildFollowUpResponses:v3`

No v2 question is reinterpreted under a new meaning. Removed IDs remain retired.
