# FOLLOW_UP_QUESTIONNAIRE_SPEC.md — Optional WNMU-TV Viewer Follow-ups

## 1. Prototype contract

- Follow-up schema: `wnmu-viewer-follow-ups-v1`
- Interface build: `6.1.0-test`
- Release date: 2026-07-20
- Mode: Test
- Campaign: `viewer-questionnaire-2026`
- Core schema linked: `wnmu-viewer-questionnaire-v6`
- Questions required: none
- Pages per module: 2
- Questions per module: 8
- Current storage: browser local storage only
- Current review/export: per-linked-respondent JSON download in the follow-up hub

The five follow-up questionnaires are optional modules offered only after the core questionnaire has been submitted. They do not require the respondent to repeat the core questionnaire.

## 2. Linkage and continuation

After successful core submission, the app creates a separate access record containing:

- a random `accessId`
- a long random continuation token
- the existing pseudonymous `respondentId`
- the submitted `coreResponseId`
- the core schema version
- creation and update dates

The continuation token appears in the URL fragment (`#continue=...`), not in the ordinary query string. The token is used only to resolve the separate access record. Follow-up answer records store `accessId`, `respondentId`, and `coreResponseId`; they do not use an email address as the linkage key.

The thank-you page offers:

- direct private links to each eligible module
- a copyable private link to the follow-up hub
- a `mailto:` action that opens the respondent's own email app with the private link
- an **I'm done now** action

Current test limitation: because no database exists, the private link resolves only in the browser where the core questionnaire was submitted. Production must store the token-to-respondent mapping in the approved database so the same private link can work across devices without repeating the core questionnaire.

The follow-up hub displays a limited linked-core summary: submission date, viewer-status label, and selected programming priorities. It does not ask those questions again.

## 3. Common module behavior

- All questions are optional.
- Each module has two pages with Previous, Next, Save and return to topics, and Submit controls.
- A draft is stored separately for each `accessId` and module.
- The hub shows **Not started**, **Saved for later**, or **Completed**.
- One submitted response is maintained per linked respondent/module in the test prototype. Re-submitting replaces that module's earlier test response.
- The children's module is offered only when the linked core response has `children_role` equal to `household`, `educator`, or `both`.
- Self-selected follow-up respondents must be reported with follow-up-specific denominators. Follow-up percentages must never be presented as percentages of all core respondents unless the denominator is explicitly all core respondents.
- The production results system must join follow-up responses to the core through `respondentId` and `coreResponseId`.

## 4. Local and Upper Peninsula programming

Purpose: identify regional subjects, underrepresented places and voices, preferred formats, demand for renewed WNMU-TV production, and acceptable use of outside producers.

Estimated time: 5–7 minutes.

| Page | ID | Wording / type | Stored values / limits | Analytics use |
|---|---|---|---|---|
| Regional stories and voices | `local_subjects` | Which U.P. or regional subjects should receive the most attention? Checkbox | `history_heritage`, `current_issues`, `indigenous_communities`, `environment_great_lakes`, `outdoor_recreation`, `arts_culture`, `food_agriculture`, `business_workforce`, `health_wellbeing`, `schools_youth`, `people_places`, `travel_tourism`; max 5 | Subject priorities |
| Regional stories and voices | `local_areas` | Which places or communities deserve more attention? Checkbox | `western_up`, `central_up`, `eastern_up`, `great_lakes`, `northern_wisconsin`, `tribal_communities`, `rural_remote`, `outside_marquette`, `whole_region`; max 4 | Geographic representation gaps |
| Regional stories and voices | `local_formats_followup` | Which formats would make the respondent most likely to watch? Checkbox | `short_features`, `half_hour_series`, `documentaries`, `forums`, `interviews`, `events_performances`, `digital_shorts`, `archive_programs`; max 3 | Format development |
| Regional stories and voices | `local_voices` | Whose voices should be heard more often? Checkbox | `residents`, `historians`, `tribal_voices`, `students_youth`, `educators`, `artists`, `workers_business`, `science_conservation`, `public_officials`, `independent_producers`; max 4 | Source and representation planning |
| Production and partnerships | `original_up_production_importance` | Importance of WNMU-TV returning to more original U.P. production. Radio | `1`–`5`, `not_sure` | Direct measure of production demand |
| Production and partnerships | `regional_source_balance` | Best balance of WNMU originals and programs from other producers. Radio | `mostly_wnmu`, `balanced_mix`, `best_available`, `mostly_outside`, `source_not_important`, `not_sure` | Acquisition-versus-production strategy |
| Production and partnerships | `outside_producer_partnerships` | How WNMU-TV should work with independent/outside producers. Checkbox | `license_finished`, `regular_submissions`, `coproduce`, `technical_guidance`, `short_showcase`, `community_partners`, `not_priority`; max 3; `not_priority` exclusive | Partnership workflow priorities |
| Production and partnerships | `local_program_idea` | Regional story, person, place, organization, producer, or program idea. Textarea | Free text | Idea and producer discovery |

## 5. Programming interests and ideas

Purpose: use the respondent's linked core priorities as the starting point, then gather specific subjects, desired program qualities, lengths, sources, and recommendations without repeating the core category-selection task.

Estimated time: 5–7 minutes.

| Page | ID | Wording / type | Stored values / limits | Analytics use |
|---|---|---|---|---|
| Go deeper on content | `deeper_priority_categories` | Which core programming priorities should be explained in more detail? Checkbox | Uses linked `program_category_priorities`; falls back to all 17 core categories when none were selected; max 3 | Connect detailed comments to core priorities |
| Go deeper on content | `specific_program_subjects` | Specific subjects, stories, or programs within those priorities. Textarea | Free text | Topic development |
| Go deeper on content | `program_characteristics` | Qualities that make a program valuable. Checkbox | `practical`, `investigative`, `in_depth`, `inspiring`, `entertaining`, `family_friendly`, `locally_relevant`, `diverse_voices`, `visual_quality`, `calm_reflective`; max 4 | Editorial tone and quality expectations |
| Go deeper on content | `program_length_preferences` | Preferred program lengths. Checkbox | `under_10`, `half_hour`, `hour`, `feature`, `series`, `no_preference`; max 3; `no_preference` exclusive | Format and scheduling |
| Shape programming | `program_origin_mix` | Programming sources that should be most visible. Checkbox | `up_local`, `great_lakes_regional`, `national_pbs`, `independent_us`, `international`; max 4 | Content-source balance |
| Shape programming | `new_vs_familiar` | Balance of new programs, favorites, and older programs. Radio | `mostly_new`, `more_new`, `balanced`, `more_favorites`, `no_preference` | Acquisitions and repeat strategy |
| Shape programming | `special_programming_interest` | Interest in themed or special programming approaches. Checkbox | `themed_nights`, `seasonal_series`, `marathons`, `community_screenings`, `live_events`, `curated_collections`, `none`; max 4; `none` exclusive | Packaging and engagement formats |
| Shape programming | `program_recommendations` | Specific programs, producers, series, or ideas. Textarea | Free text | Acquisition leads and viewer ideas |

## 6. Online viewing, PBS App, and Passport

Purpose: distinguish devices and services, measure online frequency and barriers, understand Passport status, and prioritize help and product improvements. PBS.org and the PBS App remain separate stored choices.

Estimated time: 4–6 minutes.

| Page | ID | Wording / type | Stored values / limits | Analytics use |
|---|---|---|---|---|
| How you watch online | `online_devices` | Devices used or considered for WNMU/PBS online viewing. Checkbox | `smart_tv`, `phone`, `tablet`, `computer`, `game_console`, `none`; max 4; `none` exclusive | Device support |
| How you watch online | `online_primary_service` | Online service used most often. Radio | `wnmu_site`, `pbs_org`, `pbs_app`, `passport`, `pbs_kids`, `youtube`, `none` | Primary online path |
| How you watch online | `online_frequency` | Frequency of online WNMU/PBS viewing. Radio | `daily`, `weekly`, `monthly`, `few_times`, `tried_once`, `never` | Online engagement |
| How you watch online | `online_barriers` | Barriers to online viewing. Checkbox | `where_to_start`, `sign_in_activation`, `find_local`, `search`, `internet`, `device_setup`, `captions_accessibility`, `passport_confusion`, `prefer_broadcast`, `none`; max 4; `none` exclusive | Support and product barriers |
| What would help | `passport_status` | Experience with PBS Passport. Radio | `active`, `eligible_not_active`, `not_sure_what`, `not_eligible`, `not_interested`, `prefer_not` | Passport education and activation |
| What would help | `online_help_formats` | Preferred forms of help. Checkbox | `web_steps`, `short_video`, `phone_help`, `printed_guide`, `community_help`, `email_chat`, `none`; max 3; `none` exclusive | Support-channel planning |
| What would help | `online_features` | Online improvements that matter most. Checkbox | `clear_local_section`, `easier_livestream`, `better_search`, `watchlist`, `reminders`, `local_archive`, `device_setup`, `accessibility`; max 4 | Digital roadmap |
| What would help | `online_comments` | Other online-viewing comments. Textarea | Free text | Qualitative barriers and ideas |

## 7. Children's programming and education

Purpose: understand age groups, settings, learning goals, regional content needs, resource formats, and access barriers for respondents who select or recommend children's programming.

Estimated time: 4–6 minutes.

Eligibility: linked core `children_role` is `household`, `educator`, or `both`.

| Page | ID | Wording / type | Stored values / limits | Analytics use |
|---|---|---|---|---|
| Children and learning needs | `children_age_groups` | Age groups served. Checkbox | `under_3`, `3_5`, `6_8`, `9_12`, `13_17`, `mixed` | Age segmentation |
| Children and learning needs | `children_settings` | Settings where programming/resources are used. Checkbox | `home`, `classroom`, `library`, `childcare`, `homeschool`, `community`, `other` | Household and institutional use |
| Children and learning needs | `children_learning_goals` | Learning goals to support. Checkbox | `literacy`, `stem`, `social_emotional`, `history_civics`, `arts`, `nature_outdoors`, `health`, `careers`, `world_cultures`, `entertainment`; max 5 | Educational priorities |
| Children and learning needs | `children_local_importance` | Importance of U.P./Great Lakes learning content. Radio | `1`–`5`, `not_sure` | Demand for regional children's content |
| Local topics/resources/access | `children_local_topics` | Useful local or regional topics. Checkbox | `nature_great_lakes`, `history_culture`, `indigenous`, `science`, `careers`, `arts`, `outdoor_safety`, `community_helpers`; max 4 | Local-content development |
| Local topics/resources/access | `educator_resources` | Useful educational resources. Checkbox | `lesson_plans`, `short_clips`, `full_programs`, `printables`, `standards`, `professional_development`, `event_kits`, `none`; max 4; `none` exclusive | Resource development |
| Local topics/resources/access | `children_access_barriers` | Barriers to use. Checkbox | `schedule`, `internet`, `devices`, `awareness`, `finding_age`, `accessibility`, `classroom_rights`, `none`; max 4; `none` exclusive | Distribution and support barriers |
| Local topics/resources/access | `children_comments` | Other needs of children, families, educators, or organizations. Textarea | Free text | Qualitative needs |

## 8. Communication and finding programs

Purpose: determine planning horizon, information detail, schedule formats, acceptable message frequency, reminder methods, useful social content, and communication barriers.

Estimated time: 3–5 minutes.

| Page | ID | Wording / type | Stored values / limits | Analytics use |
|---|---|---|---|---|
| Planning and information | `planning_horizon` | How far ahead viewing decisions are made. Radio | `same_day`, `few_days`, `one_week`, `month`, `no_planning` | Timing of promotion |
| Planning and information | `program_information_needed` | Information needed to decide whether to watch. Checkbox | `title_time`, `short_description`, `episode_details`, `repeat_times`, `online_availability`, `passport_status`, `local_relevance`, `family_guidance`, `accessibility`, `event_info`; max 5 | Metadata and promotion requirements |
| Planning and information | `schedule_format` | Useful schedule formats. Checkbox | `daily_list`, `weekly_grid`, `searchable_web`, `printable_pdf`, `weekly_email`, `app_calendar`, `calendar_add`; max 3 | Schedule-product priorities |
| Planning and information | `message_frequency` | Desired frequency of programming messages. Radio | `major_only`, `weekly`, `several_week`, `daily`, `topic_choice`, `none` | Contact cadence |
| Reminders and reach | `reminder_preferences` | Reminder methods considered. Checkbox | `email`, `text`, `app_push`, `social`, `calendar`, `none`; max 3; `none` exclusive | Reminder-channel planning |
| Reminders and reach | `social_content_interest` | Useful post/message types. Checkbox | `previews`, `behind_scenes`, `local_stories`, `clips`, `staff_picks`, `schedule_changes`, `community_events`, `station_support`, `none`; max 4; `none` exclusive | Content marketing |
| Reminders and reach | `communication_barriers` | Barriers to knowing what WNMU offers. Checkbox | `where_to_look`, `too_many_places`, `too_late`, `not_enough_detail`, `schedule_hard`, `does_not_reach`, `too_promotional`, `none`; max 4; `none` exclusive | Communication problems |
| Reminders and reach | `communication_comments` | Best way to inform without becoming intrusive. Textarea | Free text | Qualitative communication guidance |

## 9. Storage keys and response shape

Test storage keys:

- access records: `wnmuViewerFollowUpAccess:v1`
- module drafts: `wnmuViewerFollowUpDrafts:v1`
- submitted module responses: `wnmuViewerFollowUpResponses:v1`

Each submitted follow-up response records:

- `responseId`
- `accessId`
- `respondentId`
- `coreResponseId`
- `coreSchemaVersion`
- `followUpSchemaVersion`
- `buildVersion`
- campaign
- module/survey part
- status
- start, creation, and submission dates
- answers

The continuation token is stored in the separate access record and is not copied into the follow-up answer record.

## 10. Production work still required

Before public release:

- replace local token resolution with approved database-backed continuation records
- make the private link work across devices
- decide whether submitted follow-up responses may be edited
- add protected aggregate and qualitative results views
- add CSV export with stable labels and honest denominators
- add optional server-side email delivery without storing email in answer records
- publish privacy and linkage language
- define token expiration/revocation and response withdrawal
- verify all PBS service wording against official PBS sources
- test screen readers, keyboard, touch, phone portrait/landscape, reduced motion, save/resume, token failure, and linked submission
