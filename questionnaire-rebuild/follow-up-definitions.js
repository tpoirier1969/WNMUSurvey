(function () {
  "use strict";

  const config = window.WNMU_REBUILD_CONFIG;
  if (!config) throw new Error("Rebuild configuration must load before follow-up definitions.");

  const importance = [
    ["1", "Not important"], ["2", "Slightly important"], ["3", "Moderately important"],
    ["4", "Very important"], ["5", "Essential"], ["not_sure", "Not sure"]
  ].map(([value, label]) => ({ value, label }));

  const modules = [
    {
      id: "local-programming",
      title: "Local and Upper Peninsula programming",
      time: "5–7 minutes",
      intro: "Tell us which regional stories matter, whose experiences should be represented, and how WNMU-TV should balance original production with programs from regional independent producers.",
      pages: [
        {
          id: "regional-stories",
          title: "Regional stories and voices",
          intro: "Think about the full WNMU-TV service area, including communities that may receive less regular attention.",
          questions: [
            {
              id: "local_subjects", type: "checkbox", max: 5,
              label: "Which Upper Peninsula or regional subjects should receive the most attention?", help: "Choose up to five.",
              options: [
                ["history_heritage", "History, heritage, and historic places"],
                ["current_issues", "Current issues and public affairs"],
                ["indigenous_communities", "Indigenous communities, cultures, and history"],
                ["environment_great_lakes", "Environment, wildlife, and the Great Lakes"],
                ["outdoor_recreation", "Outdoor recreation and outdoor safety"],
                ["arts_culture", "Arts, music, and culture"],
                ["food_agriculture", "Food, agriculture, and regional traditions"],
                ["business_workforce", "Business, jobs, and the regional economy"],
                ["health_wellbeing", "Health and community well-being"],
                ["schools_youth", "Schools, young people, and education"],
                ["people_places", "Local people, communities, and places"],
                ["travel_tourism", "Regional travel and tourism"]
              ]
            },
            {
              id: "local_areas", type: "checkbox", max: 4,
              label: "Which parts of the region deserve more attention in regional programming?", help: "Choose up to four areas or community types.",
              options: [
                ["western_up", "Western Upper Peninsula"], ["central_up", "Central Upper Peninsula"],
                ["eastern_up", "Eastern Upper Peninsula"], ["great_lakes", "Lake Superior, Lake Michigan, and Great Lakes communities"],
                ["northern_wisconsin", "Northern Wisconsin communities in WNMU-TV's service area"],
                ["tribal_communities", "Tribal communities"], ["rural_remote", "Rural, remote, and unincorporated communities"],
                ["outside_marquette", "Communities outside the Marquette area"],
                ["whole_region", "The whole region, without favoring one area"]
              ]
            },
            {
              id: "local_formats_followup", type: "checkbox", max: 3,
              label: "Which formats would make you most likely to watch regional programming?", help: "Choose up to three.",
              options: [
                ["short_features", "Short features under 10 minutes"], ["half_hour_series", "Half-hour recurring series"],
                ["documentaries", "Full-length documentaries"], ["forums", "Public forums and issue discussions"],
                ["interviews", "Interviews and conversations"], ["events_performances", "Local events and performances"],
                ["digital_shorts", "Online and social-media shorts"], ["archive_programs", "Restored or revisited programs from WNMU-TV's archive"]
              ]
            },
            {
              id: "local_voices", type: "checkbox", max: 4,
              label: "Whose voices and experiences should be heard more often?", help: "Choose up to four.",
              options: [
                ["residents", "Residents sharing firsthand experiences, including elders and longtime residents"],
                ["historians", "Historians, cultural experts, and community storytellers"],
                ["tribal_voices", "Tribal members and Indigenous knowledge holders"], ["students_youth", "Children, students, and young adults"],
                ["educators", "Teachers, librarians, and educators"], ["artists", "Artists, musicians, and performers"],
                ["workers_business", "Workers, labor representatives, small-business owners, and employers"],
                ["science_conservation", "Scientists, natural-resource professionals, and conservationists"],
                ["public_officials", "Public officials, nonprofit leaders, and community organizers"],
                ["independent_producers", "Independent filmmakers and regional producers"],
                ["health_human_services", "Health-care, social-service, and public-safety workers"],
                ["underrepresented_residents", "Residents whose experiences are often overlooked, including people with disabilities, caregivers, newcomers, and people facing economic hardship"]
              ]
            }
          ]
        },
        {
          id: "production-partnerships",
          title: "Production and partnerships",
          intro: "WNMU-TV cannot produce every regional program itself. Public television stations may also license finished work from independent producers, meaning the station pays for permission to broadcast or stream a program that meets its standards.",
          questions: [
            { id: "original_up_production_importance", type: "radio", label: "How important is it for WNMU-TV to return to producing more original programs about the Upper Peninsula?", options: importance },
            {
              id: "regional_source_balance", type: "radio",
              label: "Which approach would best serve viewers who want more Upper Peninsula programming?",
              options: [
                ["mostly_wnmu", "Mostly original WNMU-TV productions"],
                ["balanced_mix", "A balanced mix of WNMU-TV productions and programs from other producers"],
                ["best_available", "Use the strongest available programs, regardless of who produced them"],
                ["mostly_outside", "Primarily programs from independent and other regional producers"],
                ["source_not_important", "The source is not important to me as long as the program is relevant and well made"],
                ["not_sure", "Not sure"]
              ]
            },
            {
              id: "outside_producer_partnerships", type: "checkbox", max: 3, exclusiveValues: ["not_priority"],
              label: "How should WNMU-TV work with regional independent producers?", help: "Choose up to three.",
              options: [
                ["license_finished", "License finished programs that meet station standards"],
                ["regular_submissions", "Offer a clear, regular process for submitting programs"],
                ["coproduce", "Co-produce selected regional projects"],
                ["technical_guidance", "Provide technical and editorial guidance before submission"],
                ["short_showcase", "Create a showcase for short films and local features"],
                ["community_partners", "Develop programs with museums, schools, Tribes, and community organizations"],
                ["not_priority", "This should not be a major priority"]
              ]
            },
            { id: "local_program_idea", type: "textarea", label: "What Upper Peninsula story, person, place, organization, producer, or program idea should WNMU-TV consider?" }
          ]
        }
      ]
    },
    {
      id: "programming-ideas",
      title: "Programming interests and ideas",
      time: "5–7 minutes",
      intro: "Use the priorities from your main questionnaire as a starting point, then tell us what subjects, qualities, formats, and program ideas would be most useful.",
      pages: [
        {
          id: "content-details", title: "Go deeper on content", context: { type: "core_priorities" },
          questions: [
            { id: "specific_program_subjects", type: "textarea", label: "Within the priorities shown above, what subjects, stories, or kinds of programs would you most like WNMU-TV to explore?" },
            {
              id: "regional_music_performance_interest", type: "checkbox", max: 4, exclusiveValues: ["not_interested"],
              label: "WNMU-TV is considering whether a regional music-performance series would be useful. Which styles would you be most likely to watch in a 30- or 60-minute program?",
              help: "Choose up to four, or select that you would not be interested.",
              options: [
                ["country", "Country"], ["rock", "Rock"], ["pop", "Pop"],
                ["folk_acoustic", "Folk, acoustic, and singer-songwriter"], ["jazz_blues", "Jazz and blues"],
                ["classical", "Classical"], ["traditional_indigenous_regional", "Traditional, Indigenous, and regional music"],
                ["mixed_genre", "Mixed-genre showcases"], ["not_interested", "I would not be interested in this kind of series"]
              ]
            },
            {
              id: "program_characteristics", type: "checkbox", max: 5,
              label: "What qualities make a program especially valuable to you?", help: "Choose up to five.",
              options: [
                ["practical", "Practical and useful"], ["investigative", "Investigative and willing to ask difficult questions"],
                ["in_depth", "In-depth and carefully researched"], ["inspiring", "Inspiring and hopeful"],
                ["entertaining", "Entertaining and enjoyable"], ["family_friendly", "Appropriate for family viewing"],
                ["locally_relevant", "Relevant to life in this region"], ["diverse_voices", "Includes people and perspectives I do not usually hear"],
                ["visual_quality", "Visually strong and well produced"], ["calm_reflective", "Calm, thoughtful, and not sensationalized"]
              ]
            },
            {
              id: "program_length_preferences", type: "checkbox", max: 3, exclusiveValues: ["no_preference"],
              label: "Which program lengths do you prefer?", help: "Choose up to three.",
              options: [
                ["under_10", "Short programs or clips under 10 minutes"], ["half_hour", "Half-hour programs"],
                ["hour", "One-hour programs"], ["feature", "Feature-length programs"], ["series", "Multi-part series"],
                ["no_preference", "No strong preference"]
              ]
            }
          ]
        },
        {
          id: "schedule-shape", title: "How WNMU-TV should shape its programming",
          questions: [
            {
              id: "program_origin_mix", type: "checkbox", max: 3,
              label: "Which sources of programming should be most visible on WNMU-TV?", help: "Choose up to three.",
              options: [
                ["up_local", "Upper Peninsula and local programs"], ["great_lakes_regional", "Great Lakes and regional programs"],
                ["national_pbs", "National PBS programs"], ["independent_us", "Independent programs from elsewhere in the United States"],
                ["international", "International programs"]
              ]
            },
            {
              id: "new_vs_familiar", type: "radio",
              label: "How should WNMU-TV balance new programs with familiar favorites and older programs?",
              options: [
                ["mostly_new", "Put most attention on new programs"], ["more_new", "Lean toward new programs while keeping selected favorites"],
                ["balanced", "Keep a balanced mix"], ["more_favorites", "Bring back more favorites and worthwhile older programs"],
                ["no_preference", "No preference"]
              ]
            },
            {
              id: "special_programming_interest", type: "checkbox", max: 3, exclusiveValues: ["none"],
              label: "Which special programming approaches interest you?", help: "Choose up to three.",
              options: [
                ["themed_nights", "Themed evenings around one subject"], ["seasonal_series", "Seasonal series tied to life in the region"],
                ["marathons", "Marathons of related programs"], ["community_screenings", "Community screenings and discussions"],
                ["live_events", "Live or same-day regional events"],
                ["curated_collections", "Streaming collections available on demand, so viewers can watch whenever they choose"],
                ["none", "None of these"]
              ]
            },
            { id: "program_development_ideas", type: "textarea", label: "What additional program idea, subject, format, audience need, or regional opportunity should WNMU-TV consider?" }
          ]
        }
      ]
    },
    {
      id: "online-viewing",
      title: "Online viewing, PBS App, and Passport",
      time: "4–6 minutes",
      intro: "Help us understand how viewers use online services, where they get stuck, and what would make WNMU-TV and PBS easier to watch.",
      pages: [
        {
          id: "online-habits", title: "How you watch online",
          questions: [
            {
              id: "online_devices", type: "checkbox", max: 4, exclusiveValues: ["none"],
              label: "Which devices do you use, or would you consider using, to watch WNMU-TV or PBS online?", help: "Choose up to four.",
              options: [
                ["smart_tv", "Smart TV or streaming device such as Roku, Fire TV, or Apple TV"], ["phone", "Phone"],
                ["tablet", "Tablet"], ["computer", "Desktop or laptop computer"], ["game_console", "Game console"],
                ["none", "I do not currently watch online"]
              ]
            },
            {
              id: "online_primary_service", type: "radio",
              label: "Which online service do you use most often for WNMU-TV or PBS programming?",
              options: [
                ["wnmu_site", "WNMU-TV website or livestream"], ["pbs_org", "PBS.org website"], ["pbs_app", "PBS App"],
                ["passport", "PBS Passport"], ["pbs_kids", "PBS KIDS app or website"], ["youtube", "YouTube"],
                ["none", "I do not currently watch WNMU-TV or PBS online"]
              ]
            },
            {
              id: "online_frequency", type: "radio", label: "How often do you watch WNMU-TV or PBS programming online?",
              options: [
                ["daily", "Daily or almost daily"], ["weekly", "About weekly"], ["monthly", "Several times a month"],
                ["few_times", "A few times a year"], ["tried_once", "I have tried it once or twice"], ["never", "Never"]
              ]
            },
            {
              id: "online_barriers", type: "checkbox", max: 4, exclusiveValues: ["none"],
              label: "What has made online viewing difficult or less appealing?", help: "Choose up to four.",
              options: [
                ["where_to_start", "I do not know which website or app to use"], ["sign_in_activation", "Signing in or activating a device is confusing"],
                ["find_local", "It is hard to find WNMU-TV or local programs"], ["search", "Search and browsing do not work the way I expect"],
                ["internet", "My internet is too slow or unreliable"], ["device_setup", "Setting up a television or streaming device is difficult"],
                ["captions_accessibility", "Captioning or accessibility features do not meet my needs"],
                ["passport_confusion", "I do not understand Passport eligibility or activation"], ["prefer_broadcast", "I prefer regular television"],
                ["none", "I have not had meaningful problems"]
              ]
            }
          ]
        },
        {
          id: "online-improvements", title: "What would make online viewing better?",
          questions: [
            {
              id: "passport_status", type: "radio", label: "Which best describes your experience with PBS Passport?",
              options: [
                ["active", "I currently use Passport"], ["eligible_not_active", "I believe I am eligible but have not activated it"],
                ["not_sure_what", "I am not sure what Passport is"], ["not_eligible", "I do not believe I am eligible"],
                ["not_interested", "I know what it is but am not interested"], ["prefer_not", "Prefer not to answer"]
              ]
            },
            {
              id: "online_help_formats", type: "checkbox", max: 3, exclusiveValues: ["none"],
              label: "What kind of help would be most useful?", help: "Choose up to three.",
              options: [
                ["web_steps", "Simple step-by-step instructions on the WNMU-TV website"], ["short_video", "A short setup video"],
                ["phone_help", "Someone to call for help"], ["printed_guide", "A printable or mailed setup guide"],
                ["community_help", "In-person help at a community location or event"], ["email_chat", "Help by email or chat"],
                ["none", "I do not need setup help"]
              ]
            },
            {
              id: "online_features", type: "checkbox", max: 4,
              label: "Which online improvements would matter most to you?", help: "Choose up to four.",
              options: [
                ["clear_local_section", "A clearer WNMU-TV and local-program section"], ["easier_livestream", "Easier access to the WNMU-TV livestream"],
                ["better_search", "Better search and browsing"], ["watchlist", "An easier watchlist or saved-program feature"],
                ["reminders", "Program reminders and notifications"], ["local_archive", "More local and regional programs available on demand"],
                ["device_setup", "Clearer television and device setup instructions"], ["accessibility", "Better captioning and accessibility information"]
              ]
            },
            { id: "online_comments", type: "textarea", label: "What else should WNMU-TV know about your experience watching online?" }
          ]
        }
      ]
    },
    {
      id: "children-education",
      title: "Children's programming and education",
      time: "4–6 minutes",
      intro: "Tell us how children, families, educators, libraries, and childcare providers use WNMU-TV and PBS educational resources.",
      eligibility: { coreChildrenRoleIn: ["household", "educator", "both"] },
      pages: [
        {
          id: "children-use", title: "Children and learning needs",
          questions: [
            {
              id: "children_age_groups", type: "checkbox", label: "Which age groups do you select or recommend programming for?",
              options: [["under_3", "Under age 3"], ["3_5", "Ages 3–5"], ["6_8", "Ages 6–8"], ["9_12", "Ages 9–12"], ["13_17", "Ages 13–17"], ["mixed", "Mixed-age groups"]]
            },
            {
              id: "children_settings", type: "checkbox", label: "Where are these programs or resources used?",
              options: [["home", "At home"], ["classroom", "School classroom"], ["library", "Library"], ["childcare", "Childcare or preschool"], ["homeschool", "Homeschool setting"], ["community", "Community or youth program"], ["other", "Another setting"]]
            },
            {
              id: "children_learning_goals", type: "checkbox", max: 4,
              label: "Which learning goals should WNMU-TV and PBS support most strongly?", help: "Choose up to four.",
              options: [
                ["literacy", "Reading, language, and literacy"], ["stem", "Science, technology, engineering, and math"],
                ["social_emotional", "Social and emotional learning"], ["history_civics", "History and civics"],
                ["arts", "Arts, music, and creativity"], ["nature_outdoors", "Nature, wildlife, and the outdoors"],
                ["health", "Health and well-being"], ["careers", "Careers and workplace awareness"],
                ["world_cultures", "World cultures and languages"], ["entertainment", "Safe, enjoyable entertainment"]
              ]
            },
            { id: "children_local_importance", type: "radio", label: "How important is programming that helps children learn about the Upper Peninsula and Great Lakes region?", options: importance }
          ]
        },
        {
          id: "children-resources", title: "Local topics, resources, and access",
          questions: [
            {
              id: "children_local_topics", type: "checkbox", max: 4,
              label: "Which local or regional topics would be most useful for children?", help: "Choose up to four.",
              options: [
                ["nature_great_lakes", "Regional nature, wildlife, and the Great Lakes"], ["history_culture", "Upper Peninsula history and cultures"],
                ["indigenous", "Indigenous history, cultures, and contemporary communities"], ["science", "Regional science and environmental issues"],
                ["careers", "Local careers and workplaces"], ["arts", "Regional arts, music, and storytelling"],
                ["outdoor_safety", "Outdoor skills and safety"], ["community_helpers", "Community helpers and public services"]
              ]
            },
            {
              id: "educator_resources", type: "checkbox", max: 4, exclusiveValues: ["none"],
              label: "Which educational resources would be most useful?", help: "Choose up to four.",
              options: [
                ["lesson_plans", "Lesson plans and teaching guides"], ["short_clips", "Short classroom-ready video clips"],
                ["full_programs", "Full programs for classroom or group use"], ["printables", "Printable activities and discussion sheets"],
                ["standards", "Clear links to learning standards"], ["professional_development", "Professional development for educators"],
                ["event_kits", "Materials for family or community learning events"], ["none", "I do not need additional educational resources"]
              ]
            },
            {
              id: "children_access_barriers", type: "checkbox", max: 4, exclusiveValues: ["none"],
              label: "What makes it harder to use children's programming or educational resources?", help: "Choose up to four.",
              options: [
                ["schedule", "Programs air at inconvenient times"], ["internet", "Internet access is limited or unreliable"],
                ["devices", "The needed devices are not available"], ["awareness", "People do not know the resources exist"],
                ["finding_age", "It is hard to find the right program for an age or learning goal"],
                ["accessibility", "Captioning, language, or accessibility needs are not met"],
                ["classroom_rights", "It is unclear what may be shown in a classroom or group setting"],
                ["none", "I have not encountered meaningful barriers"]
              ]
            },
            { id: "children_comments", type: "textarea", label: "What else should WNMU-TV know about the needs of children, families, educators, or learning organizations?" }
          ]
        }
      ]
    },
    {
      id: "communication",
      title: "Communication and finding programs",
      time: "3–5 minutes",
      intro: "Tell us when and where program information is useful, how much detail you need, and what makes WNMU-TV difficult to find or follow.",
      pages: [
        {
          id: "planning-information", title: "Planning and program information",
          intro: "Think about both programs airing on WNMU-TV channels and programs available through streaming.",
          questions: [
            {
              id: "planning_horizon", type: "radio",
              label: "When deciding what to watch on television or through streaming, how far ahead do you usually plan?",
              options: [["same_day", "The same day"], ["few_days", "A few days ahead"], ["one_week", "About a week ahead"], ["month", "Several weeks or a month ahead"], ["no_planning", "I usually browse without planning"]]
            },
            {
              id: "program_information_needed", type: "checkbox", max: 5,
              label: "For programs airing on WNMU-TV channels or available through streaming, what information helps you decide whether to watch?", help: "Choose up to five.",
              options: [
                ["title_time", "Title, date, and time"], ["short_description", "A short description"], ["episode_details", "Episode-specific details"],
                ["repeat_times", "Repeat dates and times"], ["online_availability", "Where and how long it will be available online"],
                ["passport_status", "Whether Passport is required"], ["local_relevance", "Why it matters to this region"],
                ["family_guidance", "Age or family-viewing guidance"], ["accessibility", "Captioning, audio description, or accessibility information"],
                ["event_info", "Related local events, screenings, or discussions"]
              ]
            },
            {
              id: "schedule_format", type: "checkbox", max: 3,
              label: "Which schedule formats would be most useful?", help: "Choose up to three.",
              options: [
                ["daily_list", "Simple daily list"], ["weekly_grid", "Weekly channel grid"], ["searchable_web", "Searchable website schedule"],
                ["printable_pdf", "Printable PDF schedule"], ["weekly_email", "Weekly email of highlights and schedules"],
                ["app_calendar", "Calendar inside an app"], ["calendar_add", "Add selected programs to my personal calendar"]
              ]
            },
            {
              id: "message_frequency", type: "radio", label: "How often would you want WNMU-TV to send programming information?",
              options: [["major_only", "Only for major programs or changes"], ["weekly", "About once a week"], ["several_week", "Two or three times a week"], ["daily", "Daily"], ["topic_choice", "Let me choose topics and frequency"], ["none", "I do not want messages sent to me"]]
            }
          ]
        },
        {
          id: "reminders-reach", title: "Reminders and reaching viewers",
          questions: [
            {
              id: "reminder_preferences", type: "checkbox", max: 3, exclusiveValues: ["none"],
              label: "Which reminder methods would you consider using?", help: "Choose up to three.",
              options: [["email", "Email"], ["text", "Text message"], ["app_push", "App notification"], ["social", "Social-media reminder"], ["calendar", "Personal calendar reminder"], ["none", "I do not want program reminders"]]
            },
            {
              id: "social_content_interest", type: "checkbox", max: 4, exclusiveValues: ["none"],
              label: "What kinds of WNMU-TV posts or messages would be useful?", help: "Choose up to four.",
              options: [
                ["previews", "Program previews and highlights"], ["behind_scenes", "Behind-the-scenes material"],
                ["local_stories", "Short local and regional stories"], ["clips", "Short clips from programs"],
                ["staff_picks", "Staff recommendations"], ["schedule_changes", "Schedule changes and special airings"],
                ["community_events", "Community events and screenings"], ["station_support", "Station news, membership, and support information"],
                ["none", "None of these"]
              ]
            },
            {
              id: "communication_barriers", type: "checkbox", max: 4, exclusiveValues: ["none"],
              label: "What makes it difficult to know what WNMU-TV is offering?", help: "Choose up to four.",
              options: [
                ["where_to_look", "I do not know where to look"], ["too_many_places", "Information is spread across too many places"],
                ["too_late", "Information arrives too late"], ["not_enough_detail", "Program descriptions do not include enough detail"],
                ["schedule_hard", "The schedule is difficult to read or search"], ["does_not_reach", "WNMU-TV's messages do not reach the places I use"],
                ["too_promotional", "Messages feel too promotional"], ["none", "I generally find what I need"]
              ]
            },
            { id: "communication_comments", type: "textarea", label: "What is the best way for WNMU-TV to keep you informed without becoming intrusive?" }
          ]
        }
      ]
    }
  ];

  modules.forEach((module) => module.pages.forEach((page) => page.questions.forEach((question) => {
    if (Array.isArray(question.options)) {
      question.options = question.options.map((option) => Array.isArray(option) ? { value: option[0], label: option[1] } : option);
    }
  })));

  window.WNMU_FOLLOW_UPS = Object.freeze({
    schemaVersion: config.followUp.schemaVersion,
    retiredQuestionIds: Object.freeze(["deeper_priority_categories", "program_recommendations"]),
    modules: Object.freeze(modules)
  });
})();
