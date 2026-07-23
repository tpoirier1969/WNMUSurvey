# QUESTIONNAIRE_SPEC.md - WNMU-TV Viewer Questionnaire

## 1. Active rebuild contract

- Core schema: `wnmu-viewer-questionnaire-v7`
- Follow-up schema: `wnmu-viewer-follow-ups-v3`
- Rebuild interface: `rebuild-0.3.0`
- Release date: 2026-07-23
- Mode: Test
- Campaign: `viewer-questionnaire-2026`
- Primary stages: About You; WNMU & You; What You Watch; What You Want; How We're Doing
- Target core time: approximately 6–8 minutes, subject to timed QA after this revision
- Live core question IDs: 31

The rebuild remains a pre-production browser-storage prototype. Version 7 creates a clean response boundary because question meanings, routing, and programming measures changed. Version 6 drafts and submissions are not reinterpreted as version 7 data.

## 2. Governing design decisions

1. Television-channel viewing and online viewing are measured separately for current category use, interest, and WNMU priorities.
2. Online questions may name services where WNMU-TV programming is available, including PBS App, Passport, PBS.org, and YouTube, but never ask what PBS should change. Questions ask only what WNMU-TV can provide, explain, promote, organize, or make easier to find.
3. Viewers are asked about the importance and appeal of regional programming, not internal production, acquisition, licensing, or independent-producer workflows.
4. Regional music and live performance is a regional subject option, not a concept test for a proposed series.
5. Upper Peninsula, Great Lakes, Michigan, and northern Wisconsin programming are measured separately because geographic subject interest and service-area interest are not interchangeable.
6. Household-only children's respondents do not receive institutional-setting or educator-resource questions.
7. Low-frequency viewers who watched once or twice receive the same barrier and re-engagement questions as former, never, and unsure viewers.

## 3. Required questions and routing controllers

Required:

- `children_role`
- `viewer_status`
- `viewing_methods`

Routing controllers:

- `children_role`
- `viewer_status`
- `viewing_methods`

Television-channel methods used for routing:

- antenna
- cable or satellite
- YouTube TV

Online methods used for routing:

- WNMU-TV livestream
- PBS App
- PBS.org
- PBS Passport through WNMU-TV
- YouTube

Hidden draft answers may remain temporarily but are excluded from submitted answers and results.

## 4. Scales

Interest: 1 Not interested; 2 Slightly interested; 3 Moderately interested; 4 Very interested; 5 Extremely interested; `na` Not sure.

Importance: 1 Not important; 2 Slightly important; 3 Moderately important; 4 Very important; 5 Essential; `na` Not sure.

Performance: 1 Poor; 2 Weak; 3 Adequate; 4 Good; 5 Excellent; `na` Not familiar enough to rate.

Missing and `na` answers are excluded from numeric averages. Skipped and routed-not-applicable answers remain distinct.

## 5. Shared programming categories

1. `history_biography` - History and biography
2. `environment_nature` - Environment, nature, and wildlife
3. `outdoor_recreation` - Outdoor recreation
4. `regional_documentaries` - Upper Peninsula and regional documentaries
5. `local_news_public_affairs` - Local news and public affairs
6. `health_wellness` - Health and wellness
7. `home_garden` - Home and garden
8. `arts_performance` - Arts, culture, theater, dance, and performance
9. `children_education` - Children's programming and education
10. `science_technology` - Science and technology
11. `national_pbs_documentaries` - National PBS documentaries
12. `national_international_news` - National and international news
13. `drama_mysteries` - Drama and mysteries
14. `food_cooking` - Food and cooking
15. `regional_travel` - Regional travel and exploration
16. `world_travel` - U.S. and world travel
17. `independent_film` - Independent film

The arts label is intentionally clarified so viewers do not have to infer whether it means only prestige staged productions. Regional rock, country, folk, jazz, blues, traditional music, and concert-style programming is separately named in the local-programming follow-up.

## 6. Active core questionnaire

### Stage 1 - About You

| ID | Wording / purpose | Type | Required | Routing |
|---|---|---|---:|---|
| `county_region` | County or area; geography and filters | Select | No | All |
| `community_type` | City, town, or rural; community comparison | Radio | No | All |
| `age_range` | Age range; segmentation | Radio | No | All |
| `internet_streaming_quality` | Home internet support for streaming; access context | Radio | No | All |
| `children_role` | Household or professional role selecting children's programming | Radio | Yes | All; controls children routing |

### Stage 2 - WNMU & You

| ID | Wording / purpose | Type | Required | Routing |
|---|---|---|---:|---|
| `station_awareness` | Pre-questionnaire knowledge of WNMU-TV | Radio | No | All |
| `viewer_status` | Frequency and current/former/nonviewer relationship | Radio | Yes | All; controls performance and barrier routing |
| `viewing_methods` | Ways WNMU-TV or PBS programming was watched in past 12 months | Checkbox | Yes | All; controls television/online question sets |
| `channel_awareness` | Awareness of WNMU-TV's four channels | Checkbox | No | All |
| `channels_received` | Channels available to respondent | Checkbox | No | Television-method respondents |
| `online_awareness` | Awareness of WNMU-TV and PBS online services | Checkbox | No | All |

### Stage 3 - What You Watch

The stage introduction explains that television and online viewing are asked separately because a respondent may want different programming from each.

| ID | Wording / purpose | Type | Required | Routing |
|---|---|---|---:|---|
| `channels_watched` | WNMU-TV channels watched | Checkbox | No | Hidden for never-viewers |
| `watch_preference` | Scheduled, recorded, on-demand, livestream, clips, or variable preference | Radio | No | All |
| `television_categories_watched` | Up to five categories watched most often on WNMU-TV television channels | Checkbox max 5 | No | Television-method respondents |
| `online_categories_watched` | Up to five categories watched most often online | Checkbox max 5 | No | Online-method respondents |
| `television_program_interest` | Potential interest in each category on WNMU-TV television channels | Matrix | No | Television-method respondents |
| `online_program_interest` | Potential interest in each category WNMU-TV makes available online | Matrix | No | Online-method respondents |
| `valued_programs` | Valuable or memorable programs | Text | No | All |

### Stage 4 - What You Want

| ID | Wording / purpose | Type | Required | Routing |
|---|---|---|---:|---|
| `television_program_priorities` | Five categories WNMU-TV should emphasize on television channels | Checkbox max 5 | No | Television-method respondents |
| `online_program_priorities` | Five categories WNMU-TV should emphasize in online offerings | Checkbox max 5 | No | Online-method respondents |
| `local_formats` | Preferred local/regional formats, with medium-specific wording | Checkbox max 3 | No | All |
| `online_improvements` | Positive WNMU-controlled actions that could improve online appeal; includes separate nonuser and no-change options | Checkbox max 3 | No | All |
| `learn_preferred` | Preferred ways to learn about programming | Checkbox max 3 | No | All |
| `kids_needs` | Open children's, family, classroom, or educator needs | Text | No | Household, educator, or both |

The three programming layers are analytically distinct:

- watched = recent behavior
- interest = potential personal appeal whether or not currently watched
- priority = what WNMU-TV should emphasize on that medium

### Stage 5 - How We're Doing

| ID | Wording / purpose | Type | Required | Routing |
|---|---|---|---:|---|
| `station_role_importance` | Importance of nine station roles | Matrix | No | All |
| `station_role_performance` | Performance on the same roles | Matrix | No | Hidden for former and never-viewers |
| `reflects_me` | Whether WNMU-TV reflects people like the respondent | Radio | No | Hidden for former and never-viewers |
| `trust_station` | Trust in WNMU-TV programming and information | Radio | No | Hidden for former and never-viewers |
| `nonviewer_reasons` | Reasons respondent does not watch more often | Checkbox | No | Once/twice, former, never, or unsure |
| `nonviewer_return` | Program, service, or change that could increase viewing | Text | No | Once/twice, former, never, or unsure |
| `final_feedback` | Strengths, improvements, and other feedback | Text | No | All |

Station roles remain:

1. trusted national and regional public-television programming
2. Upper Peninsula programming regardless of producer
3. regional issues and public affairs
4. regional reflection
5. children and families
6. science, nature, and environment
7. arts, music, and culture
8. online and on-demand access
9. access for people with disabilities or limited internet

## 7. Retired or replaced core IDs

| ID | Treatment |
|---|---|
| `program_category_interest` | Retired; replaced by separate `television_program_interest` and `online_program_interest` |
| `program_category_priorities` | Retired; replaced by separate `television_program_priorities` and `online_program_priorities` |
| `kids_use` | Retired; children's use detail removed from core |

New behavior IDs:

- `television_categories_watched`
- `online_categories_watched`
- `television_program_interest`
- `online_program_interest`
- `television_program_priorities`
- `online_program_priorities`

Older answers are not mapped into these new IDs.

## 8. Results, exports, and privacy

Every active question appears in the rebuild results and linked JSON export. Results distinguish answered, skipped, and routed-not-applicable populations. Follow-up percentages use module or applicable-question denominators and are labeled voluntary and self-selected.

Core and follow-up answers are linked with random pseudonymous respondent and response IDs. Names and email addresses are not part of the research answer records.
