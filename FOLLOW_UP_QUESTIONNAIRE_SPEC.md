# FOLLOW_UP_QUESTIONNAIRE_SPEC.md - Optional WNMU-TV Viewer Follow-ups

## 1. Active test contract

- Follow-up schema: `wnmu-viewer-follow-ups-v2`
- Core schema linked: `wnmu-viewer-questionnaire-v6`
- Interface build: `6.3.3-test`
- Release date: 2026-07-21
- Mode: Test
- Campaign: `viewer-questionnaire-2026`
- Modules: 5
- Pages per module: 2
- Live questions per module: 8
- Live follow-up question IDs: 40
- Questions required: none
- Storage: browser local storage only
- Aggregate review: integrated into `results.html` with module-specific denominators
- Exports: linked JSON from the follow-up hub, combined raw JSON from results, and stable-label follow-up summary CSV

Version 2 is a deliberate prototype reset. The previous v1 follow-up drafts and submissions are not migrated or reinterpreted because question IDs, meanings, and selection limits changed. Core v6 submissions and pseudonymous linkage remain unchanged.

## 2. Linkage, privacy, and denominators

After a successful core submission, the app creates or reuses a separate access record with a random access ID, long continuation token, pseudonymous respondent ID, core response ID, core schema version, and timestamps. The continuation token remains in the URL fragment and in the separate access record. It is not copied into answer records.

Follow-up answer records contain `accessId`, `respondentId`, `coreResponseId`, core and follow-up schema versions, module ID, timestamps, status, build version, source, and answers. They contain no name or email address.

Participation is voluntary and self-selected. Every follow-up percentage must use the submitted module population or the answered question population as its denominator. It must not be described as a percentage of all core respondents unless that denominator is explicitly intended and labeled. Core filters apply to follow-up results through `coreResponseId`.

Current test limitation: the access record and linked submissions exist only in the same browser origin. Production requires approved server-side token resolution and response storage.

## 3. Common interaction contract

- Each module has two pages with Previous, Next, Save and return to topics, and Submit controls.
- All questions remain optional.
- Drafts save separately for each access record and module.
- The hub shows Not started, Saved for later, or Completed.
- One submitted response is maintained per access record and module in the test prototype. Resubmission replaces the earlier v2 module response.
- The children module is offered only when core `children_role` is `household`, `educator`, or `both`.
- Checkbox limits and exclusive values are enforced in the interface.
- Page introductions and linked core-priority context are informational and do not create answer fields.

## 4. Local and Upper Peninsula programming

Purpose and introduction: Tell us which regional stories matter, whose experiences should be represented, and how WNMU-TV should balance original production with programs from regional independent producers.

Estimated time: 5–7 minutes.

| Page | ID | Wording / type | Stored values / limits | Analytics purpose | Results location | Status / compatibility |
|---|---|---|---|---|---|---|
| Regional stories and voices | *(page introduction)* | Think about the full WNMU-TV service area, including communities that may receive less regular attention. | No stored answer | Respondent context | Not reported | Informational only |
| Regional stories and voices | `local_subjects` | Which Upper Peninsula or regional subjects should receive the most attention? / checkbox | `history_heritage`, `current_issues`, `indigenous_communities`, `environment_great_lakes`, `outdoor_recreation`, `arts_culture`, `food_agriculture`, `business_workforce`, `health_wellbeing`, `schools_youth`, `people_places`, `travel_tourism`; max 5 | Subject priorities | Programming Priorities; All Data & Export | Retained in v2 |
| Regional stories and voices | `local_areas` | Which parts of the region deserve more attention in regional programming? / checkbox | `western_up`, `central_up`, `eastern_up`, `great_lakes`, `northern_wisconsin`, `tribal_communities`, `rural_remote`, `outside_marquette`, `whole_region`; max 4 | Geographic representation gaps | Programming Priorities; All Data & Export | Retained ID; wording clarified without changing underlying meaning |
| Regional stories and voices | `local_formats_followup` | Which formats would make you most likely to watch regional programming? / checkbox | `short_features`, `half_hour_series`, `documentaries`, `forums`, `interviews`, `events_performances`, `digital_shorts`, `archive_programs`; max 3 | Format development | Programming Priorities; All Data & Export | Retained in v2 |
| Regional stories and voices | `local_voices` | Whose voices and experiences should be heard more often? / checkbox | `residents`, `historians`, `tribal_voices`, `students_youth`, `educators`, `artists`, `workers_business`, `science_conservation`, `public_officials`, `independent_producers`, `health_human_services`, `underrepresented_residents`; max 4 | Source and representation planning | Programming Priorities; All Data & Export | Retained ID; wording clarified without changing underlying meaning |
| Production and partnerships | *(page introduction)* | WNMU-TV cannot produce every regional program itself. Public television stations may also license finished work from independent producers, meaning the station pays for permission to broadcast or stream a program that meets its standards. | No stored answer | Respondent context | Not reported | Informational only |
| Production and partnerships | `original_up_production_importance` | How important is it for WNMU-TV to return to producing more original programs about the Upper Peninsula? / radio | `1`, `2`, `3`, `4`, `5`, `not_sure` | Direct measure of original-production demand | Performance & Opportunities; All Data & Export | Retained in v2 |
| Production and partnerships | `regional_source_balance` | Which approach would best serve viewers who want more Upper Peninsula programming? / radio | `mostly_wnmu`, `balanced_mix`, `best_available`, `mostly_outside`, `source_not_important`, `not_sure` | Acquisition-versus-production strategy | Programming Priorities; All Data & Export | Retained in v2 |
| Production and partnerships | `outside_producer_partnerships` | How should WNMU-TV work with regional independent producers? / checkbox | `license_finished`, `regular_submissions`, `coproduce`, `technical_guidance`, `short_showcase`, `community_partners`, `not_priority`; max 3; exclusive: `not_priority` | Partnership workflow priorities | Performance & Opportunities; All Data & Export | Retained ID; wording clarified without changing underlying meaning |
| Production and partnerships | `local_program_idea` | What Upper Peninsula story, person, place, organization, producer, or program idea should WNMU-TV consider? / textarea | Free text | Regional idea and producer discovery | Viewer Voices; All Data & Export | Retained in v2 |

## 5. Programming interests and ideas

Purpose and introduction: Use the priorities from your main questionnaire as a starting point, then tell us what subjects, qualities, formats, and program ideas would be most useful.

Estimated time: 5–7 minutes.

| Page | ID | Wording / type | Stored values / limits | Analytics purpose | Results location | Status / compatibility |
|---|---|---|---|---|---|---|
| Go deeper on content | *(linked core context)* | Displays the respondent's selected core programming priorities | No stored answer | Orient detailed programming answers to core priorities | Not reported | Replaces retired `deeper_priority_categories`; no new answer field |
| Go deeper on content | `specific_program_subjects` | Within the priorities shown above, what subjects, stories, or kinds of programs would you most like WNMU-TV to explore? / textarea | Free text | Topic development linked to core priorities | Viewer Voices; All Data & Export | Retained ID; wording clarified without changing underlying meaning |
| Go deeper on content | `regional_music_performance_interest` | WNMU-TV is considering whether a regional music-performance series would be useful. Which styles would you be most likely to watch in a 30- or 60-minute program? / checkbox | `country`, `rock`, `pop`, `folk_acoustic`, `jazz_blues`, `classical`, `traditional_indigenous_regional`, `mixed_genre`, `not_interested`; max 4; exclusive: `not_interested` | Demand and genre direction for a regional music-performance concept | Programming Priorities; All Data & Export | New v2 ID and meaning |
| Go deeper on content | `program_characteristics` | What qualities make a program especially valuable to you? / checkbox | `practical`, `investigative`, `in_depth`, `inspiring`, `entertaining`, `family_friendly`, `locally_relevant`, `diverse_voices`, `visual_quality`, `calm_reflective`; max 5 | Editorial tone and quality expectations | Programming Priorities; All Data & Export | Retained ID; same meaning; maximum increased from 4 to 5 |
| Go deeper on content | `program_length_preferences` | Which program lengths do you prefer? / checkbox | `under_10`, `half_hour`, `hour`, `feature`, `series`, `no_preference`; max 3; exclusive: `no_preference` | Format and scheduling | Programming Priorities; All Data & Export | Retained in v2 |
| How WNMU-TV should shape its programming | `program_origin_mix` | Which sources of programming should be most visible on WNMU-TV? / checkbox | `up_local`, `great_lakes_regional`, `national_pbs`, `independent_us`, `international`; max 3 | Content-source balance | Programming Priorities; All Data & Export | Retained ID; same meaning; maximum reduced from 4 to 3 |
| How WNMU-TV should shape its programming | `new_vs_familiar` | How should WNMU-TV balance new programs with familiar favorites and older programs? / radio | `mostly_new`, `more_new`, `balanced`, `more_favorites`, `no_preference` | Acquisitions and repeat strategy | Programming Priorities; All Data & Export | Retained in v2 |
| How WNMU-TV should shape its programming | `special_programming_interest` | Which special programming approaches interest you? / checkbox | `themed_nights`, `seasonal_series`, `marathons`, `community_screenings`, `live_events`, `curated_collections`, `none`; max 3; exclusive: `none` | Packaging and engagement formats | Programming Priorities; All Data & Export | Retained ID; same meaning; maximum reduced from 4 to 3; on-demand label clarified |
| How WNMU-TV should shape its programming | `program_development_ideas` | What additional program idea, subject, format, audience need, or regional opportunity should WNMU-TV consider? / textarea | Free text | Developable programming ideas | Viewer Voices; All Data & Export | New v2 ID replacing retired `program_recommendations` |

## 6. Online viewing, PBS App, and Passport

Purpose and introduction: Help us understand how viewers use online services, where they get stuck, and what would make WNMU-TV and PBS easier to watch.

Estimated time: 4–6 minutes.

| Page | ID | Wording / type | Stored values / limits | Analytics purpose | Results location | Status / compatibility |
|---|---|---|---|---|---|---|
| How you watch online | `online_devices` | Which devices do you use, or would you consider using, to watch WNMU-TV or PBS online? / checkbox | `smart_tv`, `phone`, `tablet`, `computer`, `game_console`, `none`; max 4; exclusive: `none` | Device support | Audience & Access; All Data & Export | Retained in v2 |
| How you watch online | `online_primary_service` | Which online service do you use most often for WNMU-TV or PBS programming? / radio | `wnmu_site`, `pbs_org`, `pbs_app`, `passport`, `pbs_kids`, `youtube`, `none` | Primary online path | Audience & Access; All Data & Export | Retained in v2 |
| How you watch online | `online_frequency` | How often do you watch WNMU-TV or PBS programming online? / radio | `daily`, `weekly`, `monthly`, `few_times`, `tried_once`, `never` | Online engagement | Audience & Access; All Data & Export | Retained in v2 |
| How you watch online | `online_barriers` | What has made online viewing difficult or less appealing? / checkbox | `where_to_start`, `sign_in_activation`, `find_local`, `search`, `internet`, `device_setup`, `captions_accessibility`, `passport_confusion`, `prefer_broadcast`, `none`; max 4; exclusive: `none` | Support and product barriers | Audience & Access; All Data & Export | Retained in v2 |
| What would make online viewing better? | `passport_status` | Which best describes your experience with PBS Passport? / radio | `active`, `eligible_not_active`, `not_sure_what`, `not_eligible`, `not_interested`, `prefer_not` | Passport education and activation | Audience & Access; All Data & Export | Retained in v2 |
| What would make online viewing better? | `online_help_formats` | What kind of help would be most useful? / checkbox | `web_steps`, `short_video`, `phone_help`, `printed_guide`, `community_help`, `email_chat`, `none`; max 3; exclusive: `none` | Support-channel planning | Audience & Access; All Data & Export | Retained in v2 |
| What would make online viewing better? | `online_features` | Which online improvements would matter most to you? / checkbox | `clear_local_section`, `easier_livestream`, `better_search`, `watchlist`, `reminders`, `local_archive`, `device_setup`, `accessibility`; max 4 | Digital roadmap | Audience & Access; All Data & Export | Retained in v2 |
| What would make online viewing better? | `online_comments` | What else should WNMU-TV know about your experience watching online? / textarea | Free text | Qualitative barriers and ideas | Viewer Voices; All Data & Export | Retained in v2 |

## 7. Children's programming and education

Purpose and introduction: Tell us how children, families, educators, libraries, and childcare providers use WNMU-TV and PBS educational resources.

Estimated time: 4–6 minutes.

Eligibility: linked core `children_role` in `household`, `educator`, `both`.

| Page | ID | Wording / type | Stored values / limits | Analytics purpose | Results location | Status / compatibility |
|---|---|---|---|---|---|---|
| Children and learning needs | `children_age_groups` | Which age groups do you select or recommend programming for? / checkbox | `under_3`, `3_5`, `6_8`, `9_12`, `13_17`, `mixed` | Age segmentation | Audience & Access; All Data & Export | Retained in v2 |
| Children and learning needs | `children_settings` | Where are these programs or resources used? / checkbox | `home`, `classroom`, `library`, `childcare`, `homeschool`, `community`, `other` | Household and institutional use | Audience & Access; All Data & Export | Retained in v2 |
| Children and learning needs | `children_learning_goals` | Which learning goals should WNMU-TV and PBS support most strongly? / checkbox | `literacy`, `stem`, `social_emotional`, `history_civics`, `arts`, `nature_outdoors`, `health`, `careers`, `world_cultures`, `entertainment`; max 4 | Educational priorities | Programming Priorities; All Data & Export | Retained ID; same meaning; maximum reduced from 5 to 4 |
| Children and learning needs | `children_local_importance` | How important is programming that helps children learn about the Upper Peninsula and Great Lakes region? / radio | `1`, `2`, `3`, `4`, `5`, `not_sure` | Demand for regional children's content | Programming Priorities; All Data & Export | Retained in v2 |
| Local topics, resources, and access | `children_local_topics` | Which local or regional topics would be most useful for children? / checkbox | `nature_great_lakes`, `history_culture`, `indigenous`, `science`, `careers`, `arts`, `outdoor_safety`, `community_helpers`; max 4 | Local-content development | Programming Priorities; All Data & Export | Retained in v2 |
| Local topics, resources, and access | `educator_resources` | Which educational resources would be most useful? / checkbox | `lesson_plans`, `short_clips`, `full_programs`, `printables`, `standards`, `professional_development`, `event_kits`, `none`; max 4; exclusive: `none` | Resource development | Programming Priorities; All Data & Export | Retained in v2 |
| Local topics, resources, and access | `children_access_barriers` | What makes it harder to use children's programming or educational resources? / checkbox | `schedule`, `internet`, `devices`, `awareness`, `finding_age`, `accessibility`, `classroom_rights`, `none`; max 4; exclusive: `none` | Distribution and support barriers | Audience & Access; All Data & Export | Retained in v2 |
| Local topics, resources, and access | `children_comments` | What else should WNMU-TV know about the needs of children, families, educators, or learning organizations? / textarea | Free text | Qualitative needs | Viewer Voices; All Data & Export | Retained in v2 |

## 8. Communication and finding programs

Purpose and introduction: Tell us when and where program information is useful, how much detail you need, and what makes WNMU-TV difficult to find or follow.

Estimated time: 3–5 minutes.

| Page | ID | Wording / type | Stored values / limits | Analytics purpose | Results location | Status / compatibility |
|---|---|---|---|---|---|---|
| Planning and program information | *(page introduction)* | Think about both programs airing on WNMU-TV channels and programs available through streaming. | No stored answer | Respondent context | Not reported | Informational only |
| Planning and program information | `planning_horizon` | When deciding what to watch on television or through streaming, how far ahead do you usually plan? / radio | `same_day`, `few_days`, `one_week`, `month`, `no_planning` | Timing of promotion | Audience & Access; All Data & Export | Retained ID; wording clarified without changing underlying meaning |
| Planning and program information | `program_information_needed` | For programs airing on WNMU-TV channels or available through streaming, what information helps you decide whether to watch? / checkbox | `title_time`, `short_description`, `episode_details`, `repeat_times`, `online_availability`, `passport_status`, `local_relevance`, `family_guidance`, `accessibility`, `event_info`; max 5 | Metadata and promotion requirements | Audience & Access; All Data & Export | Retained ID; wording clarified without changing underlying meaning |
| Planning and program information | `schedule_format` | Which schedule formats would be most useful? / checkbox | `daily_list`, `weekly_grid`, `searchable_web`, `printable_pdf`, `weekly_email`, `app_calendar`, `calendar_add`; max 3 | Schedule-product priorities | Audience & Access; All Data & Export | Retained in v2 |
| Planning and program information | `message_frequency` | How often would you want WNMU-TV to send programming information? / radio | `major_only`, `weekly`, `several_week`, `daily`, `topic_choice`, `none` | Contact cadence | Audience & Access; All Data & Export | Retained in v2 |
| Reminders and reaching viewers | `reminder_preferences` | Which reminder methods would you consider using? / checkbox | `email`, `text`, `app_push`, `social`, `calendar`, `none`; max 3; exclusive: `none` | Reminder-channel planning | Audience & Access; All Data & Export | Retained in v2 |
| Reminders and reaching viewers | `social_content_interest` | What kinds of WNMU-TV posts or messages would be useful? / checkbox | `previews`, `behind_scenes`, `local_stories`, `clips`, `staff_picks`, `schedule_changes`, `community_events`, `station_support`, `none`; max 4; exclusive: `none` | Content marketing | Audience & Access; All Data & Export | Retained in v2 |
| Reminders and reaching viewers | `communication_barriers` | What makes it difficult to know what WNMU-TV is offering? / checkbox | `where_to_look`, `too_many_places`, `too_late`, `not_enough_detail`, `schedule_hard`, `does_not_reach`, `too_promotional`, `none`; max 4; exclusive: `none` | Communication problems | Audience & Access; All Data & Export | Retained in v2 |
| Reminders and reaching viewers | `communication_comments` | What is the best way for WNMU-TV to keep you informed without becoming intrusive? / textarea | Free text | Qualitative communication guidance | Viewer Voices; All Data & Export | Retained in v2 |

## 9. Retired v1 question IDs

| Retired ID | Previous meaning | Replacement / treatment | Compatibility |
|---|---|---|---|
| `deeper_priority_categories` | Asked respondents to select up to three priorities already selected in the core questionnaire | Replaced by a read-only linked-priority context block | v1 answers remain historical prototype data and are not reinterpreted as v2 answers |
| `program_recommendations` | Asked for specific programs, producers, series, or ideas | Replaced by new `program_development_ideas`, focused on developable ideas, subjects, formats, audiences, and opportunities | Meaning changed; old ID is not reused |

## 10. Children performance decision

No new broad children-performance question is added. The core questionnaire already measures the importance and viewer-rated performance of the `children_families` station role. The follow-up remains focused on age groups, settings, learning goals, regional content, useful resources, barriers, and open needs. This avoids duplicate burden and keeps the follow-up analytically distinct.

## 11. Storage keys and response shape

- access records: `wnmuViewerFollowUpAccess:v1`
- v2 module drafts: `wnmuViewerFollowUpDrafts:v2`
- v2 submitted module responses: `wnmuViewerFollowUpResponses:v2`
- retired v1 drafts: `wnmuViewerFollowUpDrafts:v1`
- retired v1 responses: `wnmuViewerFollowUpResponses:v1`

The v1 draft and response keys are left untouched as historical prototype data but are not loaded into the v2 questionnaire or results. The v1 access key remains active so existing private continuation links can still resolve to the same core response in the same browser.

## 12. Aggregate results and export contract

- The results dashboard loads 60 clearly marked synthetic v2 module responses plus valid v2 browser-submitted follow-up responses.
- Synthetic module counts are: Local 14, Programming 13, Online 12, Children 7, Communication 14.
- Children synthetic responses are linked only to eligible core respondents.
- Core audience filters affect follow-up results through linked core response IDs.
- Each module heading displays module n and source breakdown.
- Each question displays answered n, skipped n, and module n.
- Open responses appear in Viewer Voices and raw JSON.
- All 40 live questions appear in All Data & Export.
- The follow-up CSV includes module, question ID, item ID, stable stored value, viewer-facing label, count or answered count, module n, answered n, skipped n, linked core response IDs, core schema version, follow-up schema version, and denominator notes.
- The Decision Brief may generate a follow-up finding only when the named question has at least five usable answers. Every such finding states answered n and module n and identifies participation as voluntary and self-selected.
- Follow-up open responses participate in transparent qualitative theme organization while remaining unchanged under their original module and question.

## 13. Production work still required

- replace local token resolution with approved database-backed continuation records
- make private links work across devices
- decide production editing and withdrawal behavior
- protect aggregate and qualitative results
- replace synthetic and browser test data with approved Supabase data only
- publish privacy, linkage, retention, and withdrawal language
- implement optional server-side email delivery separately from answer records
- verify PBS service wording against official PBS sources
- complete screen-reader, keyboard, touch, phone portrait/landscape, reduced-motion, save/resume, token-failure, submission, results, filters, and export QA
