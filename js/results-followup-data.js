"use strict";

function makeDemoFollowUpData(coreResponses) {
  const syntheticCore = coreResponses.filter((response) => responseSourceCategory(response) === "synthetic");
  const byIndex = (indexes) => indexes.map((index) => syntheticCore[index]).filter(Boolean);
  const records = [];

  addModule("local-programming", byIndex([0,1,2,3,4,5,6,7,8,9,10,11,12,13]), (core, index) => ({
    local_subjects: pickMany(["history_heritage","environment_great_lakes","current_issues","indigenous_communities","arts_culture","outdoor_recreation","schools_youth","business_workforce"], index, 4),
    local_areas: pickMany(["western_up","central_up","eastern_up","great_lakes","northern_wisconsin","tribal_communities","rural_remote","outside_marquette","whole_region"], index + 1, 3),
    local_formats_followup: pickMany(["documentaries","half_hour_series","interviews","events_performances","archive_programs","short_features","forums"], index, 3),
    local_voices: pickMany(["residents","tribal_voices","students_youth","artists","workers_business","science_conservation","independent_producers","health_human_services","underrepresented_residents"], index + 2, 4),
    original_up_production_importance: String(3 + (index % 3)),
    regional_source_balance: ["balanced_mix","best_available","mostly_wnmu","source_not_important"][index % 4],
    outside_producer_partnerships: pickMany(["license_finished","regular_submissions","coproduce","technical_guidance","short_showcase","community_partners"], index, 3),
    local_program_idea: index % 4 === 0 ? "A recurring series about small communities, local history, and Great Lakes work." : ""
  }));

  addModule("programming-ideas", byIndex([0,1,2,4,5,7,8,9,10,12,13,15,18]), (core, index) => ({
    specific_program_subjects: index % 3 === 0 ? "More regional history, nature, music, and practical programs tied to life in the Upper Peninsula." : "",
    regional_music_performance_interest: index % 6 === 5
      ? ["not_interested"]
      : pickMany(["country","rock","pop","folk_acoustic","jazz_blues","classical","traditional_indigenous_regional","mixed_genre"], index, 3),
    program_characteristics: pickMany(["practical","investigative","in_depth","inspiring","entertaining","family_friendly","locally_relevant","diverse_voices","visual_quality","calm_reflective"], index, 5),
    program_length_preferences: pickMany(["under_10","half_hour","hour","feature","series"], index + 1, 2),
    program_origin_mix: pickMany(["up_local","great_lakes_regional","national_pbs","independent_us","international"], index, 3),
    new_vs_familiar: ["mostly_new","more_new","balanced","more_favorites","no_preference"][index % 5],
    special_programming_interest: pickMany(["themed_nights","seasonal_series","marathons","community_screenings","live_events","curated_collections"], index + 1, 3),
    program_development_ideas: index % 4 === 1 ? "A seasonal regional music showcase and short profiles of working artists." : ""
  }));

  addModule("online-viewing", byIndex([0,1,4,6,7,9,11,13,15,17,18,19]), (core, index) => ({
    online_devices: pickMany(["smart_tv","phone","tablet","computer","game_console"], index, 3),
    online_primary_service: ["pbs_app","pbs_org","passport","wnmu_site","youtube","pbs_kids"][index % 6],
    online_frequency: ["daily","weekly","monthly","few_times","tried_once"][index % 5],
    online_barriers: index % 5 === 0 ? ["none"] : pickMany(["where_to_start","sign_in_activation","find_local","search","internet","device_setup","captions_accessibility","passport_confusion","prefer_broadcast"], index, 3),
    passport_status: ["active","eligible_not_active","not_sure_what","not_eligible","not_interested"][index % 5],
    online_help_formats: index % 4 === 0 ? ["none"] : pickMany(["web_steps","short_video","phone_help","printed_guide","community_help","email_chat"], index, 2),
    online_features: pickMany(["clear_local_section","easier_livestream","better_search","watchlist","reminders","local_archive","device_setup","accessibility"], index, 4),
    online_comments: index % 4 === 2 ? "Local programs and the livestream should be easier to find from a television." : ""
  }));

  const eligibleChildren = syntheticCore.filter((response) =>
    ["household","educator","both"].includes(response.routeProfile?.children_role)
  );
  addModule("children-education", eligibleChildren, (core, index) => ({
    children_age_groups: pickMany(["under_3","3_5","6_8","9_12","13_17","mixed"], index, 2),
    children_settings: pickMany(["home","classroom","library","childcare","homeschool","community"], index + 1, 2),
    children_learning_goals: pickMany(["literacy","stem","social_emotional","history_civics","arts","nature_outdoors","health","careers","world_cultures","entertainment"], index, 4),
    children_local_importance: String(3 + (index % 3)),
    children_local_topics: pickMany(["nature_great_lakes","history_culture","indigenous","science","careers","arts","outdoor_safety","community_helpers"], index + 1, 4),
    educator_resources: index % 5 === 4 ? ["none"] : pickMany(["lesson_plans","short_clips","full_programs","printables","standards","professional_development","event_kits"], index, 3),
    children_access_barriers: index % 4 === 3 ? ["none"] : pickMany(["schedule","internet","devices","awareness","finding_age","accessibility","classroom_rights"], index, 2),
    children_comments: index % 3 === 0 ? "Short regional science clips and clearer classroom-use information would help." : ""
  }));

  addModule("communication", byIndex([0,1,2,3,5,6,8,9,11,12,14,16,18,20]), (core, index) => ({
    planning_horizon: ["same_day","few_days","one_week","month","no_planning"][index % 5],
    program_information_needed: pickMany(["title_time","short_description","episode_details","repeat_times","online_availability","passport_status","local_relevance","family_guidance","accessibility","event_info"], index, 5),
    schedule_format: pickMany(["daily_list","weekly_grid","searchable_web","printable_pdf","weekly_email","app_calendar","calendar_add"], index + 1, 3),
    message_frequency: ["major_only","weekly","several_week","daily","topic_choice","none"][index % 6],
    reminder_preferences: index % 6 === 5 ? ["none"] : pickMany(["email","text","app_push","social","calendar"], index, 2),
    social_content_interest: index % 7 === 6 ? ["none"] : pickMany(["previews","behind_scenes","local_stories","clips","staff_picks","schedule_changes","community_events","station_support"], index, 4),
    communication_barriers: index % 5 === 4 ? ["none"] : pickMany(["where_to_look","too_many_places","too_late","not_enough_detail","schedule_hard","does_not_reach","too_promotional"], index + 2, 3),
    communication_comments: index % 4 === 0 ? "A weekly email with clear broadcast times and streaming links would be useful." : ""
  }));

  return records;

  function addModule(moduleId, cores, answerFactory) {
    cores.forEach((core, index) => {
      const now = new Date(Date.now() - (index + records.length) * 7200000).toISOString();
      records.push({
        responseId: `synthetic-followup-${moduleId}-${String(index + 1).padStart(2, "0")}`,
        id: `synthetic-followup-${moduleId}-${String(index + 1).padStart(2, "0")}`,
        accessId: `synthetic-access-${core.responseId}`,
        respondentId: core.respondentId,
        coreResponseId: core.responseId,
        coreSchemaVersion: config.schemaVersion,
        followUpSchemaVersion: config.followUp.schemaVersion,
        buildVersion: config.buildVersion,
        releaseDate: config.releaseDate,
        mode: "test",
        campaign: config.campaign,
        surveyPart: moduleId,
        moduleId,
        source: "synthetic-followup-sample",
        status: "submitted",
        startedAt: now,
        submittedAt: now,
        createdAt: now,
        answers: answerFactory(core, index)
      });
    });
  }
}

function pickMany(values, offset, count) {
  const result = [];
  for (let index = 0; index < Math.min(count, values.length); index += 1) {
    const value = values[(offset + index * 2) % values.length];
    if (!result.includes(value)) result.push(value);
  }
  return result;
}
