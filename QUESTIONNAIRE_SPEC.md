# QUESTIONNAIRE_SPEC.md — WNMU-TV Viewer Questionnaire

## 1. Current release contract

- **Questionnaire/schema version:** `wnmu-viewer-questionnaire-v4`
- **Interface/build version:** `4.2.0-test`
- **Release date:** 2026-07-16
- **Active mode:** Test
- **Campaign:** `viewer-questionnaire-2026`
- **Survey part:** `core`
- **Primary stages:** About You; WNMU & You; What You Watch; What You Want; How We're Doing
- **Target completion time:** approximately 6–8 minutes for the core path
- **Canonical runtime definition:** `js/questions.js`
- **Canonical mode/version configuration:** `js/config.js`

Test mode allows blank page navigation and blank submission, but it does not delete or mutate routing conditions. Test-mode navigation does not itself mark a stage in progress or complete. Production mode must disable blank navigation and blank submission before public release.

## 2. Stage and completion behavior

A stage is **Not started** when it contains no saved answers and has not been explicitly completed. Merely opening a stage or visiting its pages does not change that status.

A stage is **In progress** after at least one currently stored answer exists in that stage.

A stage is **Complete** only after the respondent explicitly uses the stage-completion control and all currently applicable required questions in that stage are answered. Test mode may permit blank navigation, but it does not waive required answers for explicit stage completion. The final stage is explicitly completed by submitting the questionnaire.

Drafts store explicit stage completion separately from page visits. Older test drafts that were automatically marked complete by page visits do not retain that false completion state.

Changing an earlier routing answer may hide later questions. Hidden answers may remain in a draft so they can reappear if the respondent changes back, but hidden answers are excluded from the submitted response and from analytics.

Only these questions are required in the current core questionnaire:

- `children_role`
- `viewer_status`
- `viewing_methods`

All other questions are optional.

### Current interaction decisions

- `county_region` uses a compact dropdown labeled “What county or area do you live in?” The dropdown remains on the question line when space permits and stacks below on narrow screens.
- Dropdowns are reserved for long single-choice lists. Short single-choice questions remain visible radio choices; multiple-choice questions remain checkboxes; rating scales remain visible.
- Age range remains a visible radio-choice group.
- Routine stage-page navigation, Previous/Next controls, routing rerenders, and page tabs preserve the overall working-page position instead of forcing the questionnaire panel to the top of the viewport.
- Automatic scrolling remains appropriate for validation errors that must bring a missing required answer into view.
- Importance and performance are presented together by station role in How We're Doing.
- The paired presentation continues to store importance under `importance_roles` and performance under `performance_roles`.
- Respondents who are not eligible for performance routing see the importance rating only.
- The paired display is stacked by role on phones and must not require horizontal scrolling.

## 3. Scales

### Interest scale

Stored values: `1`, `2`, `3`, `4`, `5`, `na`

Labels: Not interested; Slightly interested; Moderately interested; Very interested; Extremely interested; Not sure.

### Importance scale

Stored values: `1`, `2`, `3`, `4`, `5`, `na`

Labels: Not important; Slightly important; Moderately important; Very important; Essential; Not sure.

### Performance scale

Stored values: `1`, `2`, `3`, `4`, `5`, `na`

Labels: Poor; Weak; Adequate; Good; Excellent; Not familiar enough to rate.

`na` is excluded from numeric averages. Missing answers remain missing.

## 4. Active question specification

### Stage 1 — About You

#### Page: Your community and household

| ID | Wording / purpose | Type and stored values | Required | Routing | Results / compatibility |
|---|---|---|---|---|---|
| `county_region` | What county or area do you live in? Identifies broad service geography without requiring a precise address. | Select dropdown: `alger`, `baraga`, `chippewa`, `delta`, `dickinson`, `gogebic`, `houghton`, `iron`, `keweenaw`, `luce`, `mackinac`, `marquette`, `menominee`, `ontonagon`, `schoolcraft`, `northern_wi`, `other_mi`, `other_state`, `canada`, `prefer_not` | No | All | Geography filter and location distribution. Retained meaning, ID, and stored values. Display changed back to a dropdown. |
| `community_type` | Which best describes where you live? Separates urban, town, rural, and remote needs. | Radio: `city`, `small_town`, `village`, `rural`, `remote`, `prefer_not` | No | All | Access and rural comparison. Retained meaning and ID. |
| `age_range` | Age range. | Visible radio-choice cards: `under_18`, `18_24`, `25_34`, `35_44`, `45_54`, `55_64`, `65_74`, `75_84`, `85_plus`, `prefer_not` | No | All | Demographic filter and distribution. Retained meaning, ID, and stored values. |
| `internet_quality` | How would you describe home internet service? Measures practical online access. | Radio: `fast`, `adequate`, `slow`, `unreliable`, `expensive`, `cell_sat`, `none`, `prefer_not` | No | All | Access analysis and online-barrier comparisons. Retained meaning. |
| `children_role` | Do you select or recommend programming for children? Controls child-content questions. | Profile radio: `household`, `educator`, `both`, `neither` | **Yes** | All | Children-role filter and routing. Retained ID and meaning. |

### Stage 2 — WNMU & You

#### Page: Your relationship with WNMU-TV

| ID | Wording / purpose | Type and stored values | Required | Routing | Results / compatibility |
|---|---|---|---|---|---|
| `viewer_status` | During the past 12 months, how often have you knowingly watched WNMU-TV or WNMU-TV programming? Establishes viewer relationship and routes performance/non-viewer questions. | Profile radio: `regular`, `occasional`, `once_twice`, `former`, `never`, `unsure` | **Yes** | All | Primary audience filter and current-viewer metric. Retained. |
| `station_awareness` | Awareness that WNMU-TV is the local PBS station serving Upper Michigan and portions of northern Wisconsin. | Radio: `yes`, `station_not_pbs`, `name_only`, `no` | No | All | Station-awareness result. Retained. Factual service-area wording must be verified before production. |

#### Page: Access, channels, and online services

| ID | Wording / purpose | Type and stored values | Required | Routing | Results / compatibility |
|---|---|---|---|---|---|
| `viewing_methods` | Methods used to watch WNMU-TV or PBS during the past year. | Profile checkbox: `antenna`, `cable`, `satellite`, `livestream`, `pbs_site`, `pbs_app`, `passport`, `youtube_social`, `public_location`, `not_watched`; `not_watched` exclusive | **Yes** | All | Access filter, method distribution, online-use metric, and routing. Retained. |
| `channel_awareness` | WNMU-TV channels known before the questionnaire. | Checkbox: `wnmu_13_1`, `pbs_kids_13_2`, `wnmu_plus_13_3`, `mlc_13_4`, `none`; `none` exclusive | No | All | Channel awareness with answered-only denominator. Retained. |
| `channels_received` | WNMU-TV channels currently receivable through antenna or a provider. | Checkbox: four channel values plus `none`, `not_sure`; final two exclusive | No | Shown for `antenna`, `cable`, `satellite`, or `public_location` methods | Channel access with answered-only denominator. Retained. |
| `ota_reception` | Reliability of over-the-air WNMU-TV reception. | Radio: `excellent`, `usually`, `inconsistent`, `poor`, `cannot`, `not_sure` | No | Antenna users only | Reception analysis. Retained. |
| `online_awareness` | Awareness of WNMU-TV/PBS online services. | Checkbox: `wnmu_site`, `livestream`, `pbs_site`, `pbs_app`, `passport`, `kids_app`, `youtube`, `social`, `none`; `none` exclusive | No | All | Online-service awareness. Retained. |

Viewer-facing channel names are WNMU-TV 13.1, PBS KIDS 24/7 13.2, WNMU-TV Plus 13.3, and Michigan Learning Channel 13.4. Current channel descriptions and carriage claims must be checked against official WNMU-TV information before production.

### Stage 3 — What You Watch

#### Page: Your viewing habits

| ID | Wording / purpose | Type and stored values | Required | Routing | Results / compatibility |
|---|---|---|---|---|---|
| `channels_watched` | WNMU-TV channels watched, even occasionally. | Checkbox: four channel values plus `none`, `not_sure`; final two exclusive | No | Hidden only for never-viewers | Channel viewing with answered-only denominator. Retained. |
| `watch_preference` | Preferred way to watch an interesting program. | Radio: `scheduled`, `recorded`, `on_demand`, `livestream`, `short_clips`, `depends`, `none` | No | All | Viewing-mode preference. Retained. |

#### Page: Programming you watch or value

| ID | Wording / purpose | Type and stored values | Required | Routing | Results / compatibility |
|---|---|---|---|---|---|
| `program_interest_v2` | Interest in twelve viewer-facing programming categories. | Interest matrix; rows listed below | No | All | Average interest by row. **New ID.** Old `program_interest` values are not remapped. |
| `valued_programs` | Current or past WNMU-TV/PBS programs that were valuable or memorable. | Textarea | No | All | Open-comment results. Retained meaning and ID. |
| `kids_use` | How PBS KIDS or children's public-media content is used. | Checkbox: `broadcast`, `kids_app`, `pbs_app`, `youtube`, `classroom`, `not_used`; `not_used` exclusive | No | `children_role` is `household`, `educator`, or `both` | Children-use analysis. Retained. |

`program_interest_v2` row IDs:

- `up_history_heritage`
- `great_lakes_nature`
- `outdoor_recreation`
- `local_people`
- `news_public_affairs`
- `health_practical`
- `arts_performance`
- `children_education`
- `science_technology`
- `national_documentaries`
- `drama_film`
- `food_travel`

These categories are viewer-facing research groups, not direct Programming Library Primary Topics. They must not be presented as a one-to-one historical continuation of the retired internal-topic matrix.

### Stage 4 — What You Want

#### Page: Programming priorities

| ID | Wording / purpose | Type and stored values | Required | Routing | Results / compatibility |
|---|---|---|---|---|---|
| `top_program_priorities_v2` | Which five viewer-facing programming categories deserve the greatest attention? | Checkbox, maximum 5; values are the `program_interest_v2` row IDs | No | All | Priority counts using respondents who answered. **New ID.** Old `top_program_priorities` is not remapped. |
| `local_formats` | Locally produced formats the respondent would be most likely to watch. | Checkbox, maximum 3: `documentaries`, `news_magazine`, `interviews`, `roundtables`, `outdoor`, `arts`, `events`, `short_online` | No | All | Format preference. Retained question meaning with shortened options. |

#### Page: Access and communication

| ID | Wording / purpose | Type and stored values | Required | Routing | Results / compatibility |
|---|---|---|---|---|---|
| `online_improvements` | Changes that would make online use more likely. | Checkbox, maximum 3: `clear_where`, `local_access`, `search`, `more_full`, `archive`, `notifications`, `tv_compat`, `help`, `passport_clear`, `nothing`; `nothing` exclusive | No | All | Online-improvement priorities. Retained ID with reduced option set; historical option-specific comparisons must use matching values only. |
| `learn_preferred` | Preferred ways to learn about WNMU-TV programming. | Checkbox, maximum 3: `on_air`, `tv_guide`, `printed`, `wnmu_site`, `pbs_app`, `email`, `facebook`, `instagram`, `youtube`, `newspaper_radio`, `community`, `text_push` | No | All | Communication preferences. Retained. Printed guide is a preference, not a claim of current availability. |
| `kids_needs` | Children's, family, classroom, or educator resources WNMU-TV should provide more of. | Textarea | No | Child-programming roles only | Open-comment results. Retained. |

### Stage 5 — How We're Doing

#### Page: Priorities and performance

Importance and performance are displayed together inside each station-role card. They remain separate stored questions so older responses, results calculations, exports, and paired denominators retain their established meanings.

| ID | Wording / purpose | Type and stored values | Required | Routing | Results / compatibility |
|---|---|---|---|---|---|
| `importance_roles` | How important each station role should be. Displayed first inside each paired role card. | Importance matrix using the ten role rows below | No | All | Paired expectation-gap analysis. Retained ID and meaning. Moved from Stage 4 to Stage 5 without changing stored values. |
| `performance_roles` | How well WNMU-TV performs in the same station roles. Displayed immediately after importance within the same role card. | Performance matrix using the ten role rows below | No | Hidden for `viewer_status=never` or `former` | Paired expectation-gap analysis. Retained ID, meaning, scale, and routing. |
| `reflects_me` | How well WNMU-TV reflects the interests and needs of people like the respondent. | Radio: `not_at_all`, `little`, `somewhat`, `well`, `very_well`, `not_familiar` | No | Hidden for never/former viewers | Station relevance analysis. Retained. |
| `trust_station` | Trust in WNMU-TV as a source of programming and information. | Radio: `none`, `little`, `some`, `quite`, `great`, `not_familiar` | No | Hidden for never/former viewers | Trust analysis. Retained. |
| `nonviewer_reasons` | Reasons for not watching WNMU-TV more often. | Checkbox: `unaware`, `channel`, `signal`, `provider`, `schedule`, `online`, `content`, `other_services`, `little_tv`, `past_change`, `not_local` | No | `viewer_status` is `former`, `never`, or `unsure` | Non-viewer barrier analysis. Retained. |
| `nonviewer_return` | Program, service, or change most likely to attract or regain the respondent. | Textarea | No | Former, never, or unsure viewers | Open-comment results. Retained. |
| `station_feedback_v2` | What WNMU-TV is doing well and where it should improve. | Textarea | No | Hidden for never/former viewers | Open-comment results. **New ID** combining the retired `does_well`, `falls_short`, and `underrepresented` prompts. |

Station-role row IDs used identically by `importance_roles` and `performance_roles`:

- `trusted_pbs`
- `local_programs`
- `regional_issues`
- `preserve_history`
- `reflect_region`
- `children`
- `science_nature`
- `arts_culture`
- `online_access`
- `access_for_all` — new combined row; older `limited_internet` and `accessibility` answers are not silently combined

## 5. Retired or deferred questions

The following questions are not part of the v4 core questionnaire. Their historical answers remain in old response records and are not converted to negative or missing-current answers:

- `source_awareness`
- `station_relationships`
- `tv_services`
- `devices`
- `viewing_times`
- `discovery_methods`
- `broadcast_barriers`
- `broadcast_improvement`
- `online_find_ease`
- `online_content`
- `online_barriers`
- `most_important_responsibility`
- `never_lose`
- `program_interest`
- `top_program_priorities`
- `preferred_length`
- `missing_subject`
- `child_ages`
- `kids_value`
- `kids_times`
- `learn_currently`
- `station_connection`
- `connection_activities`
- `financial_support`
- `support_factors`
- `zip_code`
- `household_size`
- `employment`
- `household_income`
- `context_note`
- `does_well`
- `falls_short`
- `underrepresented`
- `gender`
- `education_level`
- `personal_value`
- `viewing_frequency`
- `online_services_used`
- `one_program_change`
- `recommend`
- `final_comment`

Fundraising motivation, detailed household economics, device inventories, and other secondary topics are deferred to later linked questionnaires unless explicitly reapproved.

## 6. Draft, response, and linkage schema

Drafts record:

- schema and build version
- mode, campaign, and survey part
- random pseudonymous respondent ID
- current stage and page
- visited stages
- explicitly completed stages
- per-stage progress, including page visits, last page, and explicit-completion state
- route profile
- answers
- started and updated timestamps

Submitted responses record:

- response ID
- pseudonymous respondent ID
- schema and build version
- release date and mode
- campaign and survey part
- source
- started and submitted timestamps
- route profile
- visible question IDs
- completed stage IDs
- answers

The browser respondent ID is not a name or email address. Public production requires an approved database, protected results access, final privacy wording, retention rules, and a documented deletion/withdrawal process.

## 7. Analytics rules

- Percentages use respondents who answered the specific question, not all filtered responses.
- Skipped and historically missing answers are excluded from denominators.
- `prefer_not`, `na`, and `not_familiar` remain distinct stored responses and are excluded from numeric averages where appropriate.
- Channel awareness, reception, and viewing each use their own answered denominator.
- Expectation gaps use only respondents who rated both importance and performance for the same row. Each respondent's gap is calculated first, then paired gaps are averaged.
- Combining the two ratings visually does not combine their stored objects or denominators.
- `program_interest_v2` and `top_program_priorities_v2` are current-schema results. The retired internal-topic questions are not remapped.
- Synthetic responses are marked with source `synthetic-up-pbs-sample` and must never be mixed invisibly with real responses.

## 8. Test-to-production checklist

Before public release:

1. Set the authoritative mode in `js/config.js` to production.
2. Disable blank navigation and blank submission.
3. Verify all station facts and channel descriptions against official WNMU-TV sources.
4. Connect the approved response database.
5. Protect results access.
6. Replace the test privacy text with the approved disclosure.
7. Confirm synthetic data cannot become the live source.
8. Verify phone, desktop, keyboard, focus, reduced-motion, sound, routing, save/resume, submission, results, imports, exports, and historical compatibility.
