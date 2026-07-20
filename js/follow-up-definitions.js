(function () {
  "use strict";

  const commonNotSure = { value: "not_sure", label: "Not sure" };

  const modules = [
    {
      id: "local-programming",
      title: "Local and Upper Peninsula programming",
      time: "5–7 minutes",
      intro: "Tell us which regional stories matter, how WNMU-TV should work with outside producers, and whether the station should produce more original Upper Peninsula programs.",
      pages: [
        {
          id: "regional-stories",
          title: "Regional stories and voices",
          questions: [
            {
              id: "local_subjects",
              type: "checkbox",
              max: 5,
              label: "Which Upper Peninsula or regional subjects should receive the most attention?",
              help: "Choose up to five.",
              options: [
                { value: "history_heritage", label: "History, heritage, and historic places" },
                { value: "current_issues", label: "Current issues and public affairs" },
                { value: "indigenous_communities", label: "Indigenous communities, cultures, and history" },
                { value: "environment_great_lakes", label: "Environment, wildlife, and the Great Lakes" },
                { value: "outdoor_recreation", label: "Outdoor recreation and outdoor safety" },
                { value: "arts_culture", label: "Arts, music, and culture" },
                { value: "food_agriculture", label: "Food, agriculture, and regional traditions" },
                { value: "business_workforce", label: "Business, jobs, and the regional economy" },
                { value: "health_wellbeing", label: "Health and community well-being" },
                { value: "schools_youth", label: "Schools, young people, and education" },
                { value: "people_places", label: "Local people, communities, and places" },
                { value: "travel_tourism", label: "Regional travel and tourism" }
              ]
            },
            {
              id: "local_areas",
              type: "checkbox",
              max: 4,
              label: "Which places or communities deserve more attention in regional programming?",
              help: "Choose up to four.",
              options: [
                { value: "western_up", label: "Western Upper Peninsula" },
                { value: "central_up", label: "Central Upper Peninsula" },
                { value: "eastern_up", label: "Eastern Upper Peninsula" },
                { value: "great_lakes", label: "Lake Superior, Lake Michigan, and Great Lakes communities" },
                { value: "northern_wisconsin", label: "Northern Wisconsin communities in WNMU-TV's service area" },
                { value: "tribal_communities", label: "Tribal communities and Indigenous voices" },
                { value: "rural_remote", label: "Rural, remote, and unincorporated communities" },
                { value: "outside_marquette", label: "Communities outside the Marquette area" },
                { value: "whole_region", label: "The whole region, without favoring one area" }
              ]
            },
            {
              id: "local_formats_followup",
              type: "checkbox",
              max: 3,
              label: "Which formats would make you most likely to watch regional programming?",
              help: "Choose up to three.",
              options: [
                { value: "short_features", label: "Short features under 10 minutes" },
                { value: "half_hour_series", label: "Half-hour recurring series" },
                { value: "documentaries", label: "Full-length documentaries" },
                { value: "forums", label: "Public forums and issue discussions" },
                { value: "interviews", label: "Interviews and conversations" },
                { value: "events_performances", label: "Local events and performances" },
                { value: "digital_shorts", label: "Online and social-media shorts" },
                { value: "archive_programs", label: "Restored or revisited programs from WNMU-TV's archive" }
              ]
            },
            {
              id: "local_voices",
              type: "checkbox",
              max: 4,
              label: "Whose voices should be heard more often?",
              help: "Choose up to four.",
              options: [
                { value: "residents", label: "Residents sharing firsthand experiences" },
                { value: "historians", label: "Historians and cultural experts" },
                { value: "tribal_voices", label: "Tribal members and Indigenous knowledge holders" },
                { value: "students_youth", label: "Students and young people" },
                { value: "educators", label: "Teachers and educators" },
                { value: "artists", label: "Artists, musicians, and performers" },
                { value: "workers_business", label: "Workers, business owners, and employers" },
                { value: "science_conservation", label: "Scientists, natural-resource professionals, and conservationists" },
                { value: "public_officials", label: "Public officials and community leaders" },
                { value: "independent_producers", label: "Independent filmmakers and regional producers" }
              ]
            }
          ]
        },
        {
          id: "production-partnerships",
          title: "Production and partnerships",
          questions: [
            {
              id: "original_up_production_importance",
              type: "radio",
              label: "How important is it for WNMU-TV to return to producing more original programs about the Upper Peninsula?",
              options: [
                { value: "1", label: "Not important" },
                { value: "2", label: "Slightly important" },
                { value: "3", label: "Moderately important" },
                { value: "4", label: "Very important" },
                { value: "5", label: "Essential" },
                commonNotSure
              ]
            },
            {
              id: "regional_source_balance",
              type: "radio",
              label: "Which approach would best serve viewers who want more Upper Peninsula programming?",
              options: [
                { value: "mostly_wnmu", label: "Mostly original WNMU-TV productions" },
                { value: "balanced_mix", label: "A balanced mix of WNMU-TV productions and programs from other producers" },
                { value: "best_available", label: "Use the strongest available programs, regardless of who produced them" },
                { value: "mostly_outside", label: "Primarily programs from independent and other regional producers" },
                { value: "source_not_important", label: "The source is not important to me as long as the program is relevant and well made" },
                commonNotSure
              ]
            },
            {
              id: "outside_producer_partnerships",
              type: "checkbox",
              max: 3,
              exclusiveValues: ["not_priority"],
              label: "How should WNMU-TV work with independent and outside producers?",
              help: "Choose up to three.",
              options: [
                { value: "license_finished", label: "License finished programs that meet station standards" },
                { value: "regular_submissions", label: "Offer a clear, regular process for submitting programs" },
                { value: "coproduce", label: "Co-produce selected regional projects" },
                { value: "technical_guidance", label: "Provide technical and editorial guidance before submission" },
                { value: "short_showcase", label: "Create a showcase for short films and local features" },
                { value: "community_partners", label: "Develop programs with museums, schools, Tribes, and community organizations" },
                { value: "not_priority", label: "This should not be a major priority" }
              ]
            },
            {
              id: "local_program_idea",
              type: "textarea",
              label: "What Upper Peninsula story, person, place, organization, or program idea should WNMU-TV consider?",
              help: "Names of regional producers or existing programs are also welcome."
            }
          ]
        }
      ]
    },
    {
      id: "programming-ideas",
      title: "Programming interests and ideas",
      time: "5–7 minutes",
      intro: "Go beyond the broad categories in the main questionnaire and tell us what kinds of programs, subjects, and viewing experiences you want.",
      pages: [
        {
          id: "content-details",
          title: "Go deeper on content",
          questions: [
            {
              id: "deeper_priority_categories",
              type: "checkbox",
              max: 3,
              optionsFromCorePriorities: true,
              label: "Which of your programming priorities would you most like to explain in more detail?",
              help: "Choose up to three. When available, this list uses the priorities from your main questionnaire."
            },
            {
              id: "specific_program_subjects",
              type: "textarea",
              label: "What specific subjects, stories, or kinds of programs would you like to see within those priorities?"
            },
            {
              id: "program_characteristics",
              type: "checkbox",
              max: 4,
              label: "What qualities make a program especially valuable to you?",
              help: "Choose up to four.",
              options: [
                { value: "practical", label: "Practical and useful" },
                { value: "investigative", label: "Investigative and willing to ask difficult questions" },
                { value: "in_depth", label: "In-depth and carefully researched" },
                { value: "inspiring", label: "Inspiring and hopeful" },
                { value: "entertaining", label: "Entertaining and enjoyable" },
                { value: "family_friendly", label: "Appropriate for family viewing" },
                { value: "locally_relevant", label: "Relevant to life in this region" },
                { value: "diverse_voices", label: "Includes people and perspectives I do not usually hear" },
                { value: "visual_quality", label: "Visually strong and well produced" },
                { value: "calm_reflective", label: "Calm, thoughtful, and not sensationalized" }
              ]
            },
            {
              id: "program_length_preferences",
              type: "checkbox",
              max: 3,
              exclusiveValues: ["no_preference"],
              label: "Which program lengths do you prefer?",
              help: "Choose up to three.",
              options: [
                { value: "under_10", label: "Short programs or clips under 10 minutes" },
                { value: "half_hour", label: "Half-hour programs" },
                { value: "hour", label: "One-hour programs" },
                { value: "feature", label: "Feature-length programs" },
                { value: "series", label: "Multi-part series" },
                { value: "no_preference", label: "No strong preference" }
              ]
            }
          ]
        },
        {
          id: "schedule-shape",
          title: "How WNMU-TV should shape its programming",
          questions: [
            {
              id: "program_origin_mix",
              type: "checkbox",
              max: 4,
              label: "Which sources of programming should be most visible on WNMU-TV?",
              help: "Choose up to four.",
              options: [
                { value: "up_local", label: "Upper Peninsula and local programs" },
                { value: "great_lakes_regional", label: "Great Lakes and regional programs" },
                { value: "national_pbs", label: "National PBS programs" },
                { value: "independent_us", label: "Independent programs from elsewhere in the United States" },
                { value: "international", label: "International programs" }
              ]
            },
            {
              id: "new_vs_familiar",
              type: "radio",
              label: "How should WNMU-TV balance new programs with familiar favorites and older programs?",
              options: [
                { value: "mostly_new", label: "Put most attention on new programs" },
                { value: "more_new", label: "Lean toward new programs while keeping selected favorites" },
                { value: "balanced", label: "Keep a balanced mix" },
                { value: "more_favorites", label: "Bring back more favorites and worthwhile older programs" },
                { value: "no_preference", label: "No preference" }
              ]
            },
            {
              id: "special_programming_interest",
              type: "checkbox",
              max: 4,
              exclusiveValues: ["none"],
              label: "Which special programming approaches interest you?",
              help: "Choose up to four.",
              options: [
                { value: "themed_nights", label: "Themed evenings around one subject" },
                { value: "seasonal_series", label: "Seasonal series tied to life in the region" },
                { value: "marathons", label: "Marathons of related programs or series" },
                { value: "community_screenings", label: "Community screenings and discussions" },
                { value: "live_events", label: "Live or same-day regional events" },
                { value: "curated_collections", label: "On-demand collections assembled by WNMU-TV staff" },
                { value: "none", label: "None of these" }
              ]
            },
            {
              id: "program_recommendations",
              type: "textarea",
              label: "Are there specific programs, producers, series, or program ideas you would recommend to WNMU-TV?"
            }
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
          id: "online-habits",
          title: "How you watch online",
          questions: [
            {
              id: "online_devices",
              type: "checkbox",
              max: 4,
              exclusiveValues: ["none"],
              label: "Which devices do you use, or would you consider using, to watch WNMU-TV or PBS online?",
              help: "Choose up to four.",
              options: [
                { value: "smart_tv", label: "Smart TV or streaming device such as Roku, Fire TV, or Apple TV" },
                { value: "phone", label: "Phone" },
                { value: "tablet", label: "Tablet" },
                { value: "computer", label: "Desktop or laptop computer" },
                { value: "game_console", label: "Game console" },
                { value: "none", label: "I do not currently watch online" }
              ]
            },
            {
              id: "online_primary_service",
              type: "radio",
              label: "Which online service do you use most often for WNMU-TV or PBS programming?",
              options: [
                { value: "wnmu_site", label: "WNMU-TV website or livestream" },
                { value: "pbs_org", label: "PBS.org website" },
                { value: "pbs_app", label: "PBS App" },
                { value: "passport", label: "PBS Passport" },
                { value: "pbs_kids", label: "PBS KIDS app or website" },
                { value: "youtube", label: "YouTube" },
                { value: "none", label: "I do not currently watch WNMU-TV or PBS online" }
              ]
            },
            {
              id: "online_frequency",
              type: "radio",
              label: "How often do you watch WNMU-TV or PBS programming online?",
              options: [
                { value: "daily", label: "Daily or almost daily" },
                { value: "weekly", label: "About weekly" },
                { value: "monthly", label: "Several times a month" },
                { value: "few_times", label: "A few times a year" },
                { value: "tried_once", label: "I have tried it once or twice" },
                { value: "never", label: "Never" }
              ]
            },
            {
              id: "online_barriers",
              type: "checkbox",
              max: 4,
              exclusiveValues: ["none"],
              label: "What has made online viewing difficult or less appealing?",
              help: "Choose up to four.",
              options: [
                { value: "where_to_start", label: "I do not know which website or app to use" },
                { value: "sign_in_activation", label: "Signing in or activating a device is confusing" },
                { value: "find_local", label: "It is hard to find WNMU-TV or local programs" },
                { value: "search", label: "Search and browsing do not work the way I expect" },
                { value: "internet", label: "My internet is too slow or unreliable" },
                { value: "device_setup", label: "Setting up a television or streaming device is difficult" },
                { value: "captions_accessibility", label: "Captioning or accessibility features do not meet my needs" },
                { value: "passport_confusion", label: "I do not understand Passport eligibility or activation" },
                { value: "prefer_broadcast", label: "I prefer regular television" },
                { value: "none", label: "I have not had meaningful problems" }
              ]
            }
          ]
        },
        {
          id: "online-improvements",
          title: "What would make online viewing better?",
          questions: [
            {
              id: "passport_status",
              type: "radio",
              label: "Which best describes your experience with PBS Passport?",
              options: [
                { value: "active", label: "I currently use Passport" },
                { value: "eligible_not_active", label: "I believe I am eligible but have not activated it" },
                { value: "not_sure_what", label: "I am not sure what Passport is" },
                { value: "not_eligible", label: "I do not believe I am eligible" },
                { value: "not_interested", label: "I know what it is but am not interested" },
                { value: "prefer_not", label: "Prefer not to answer" }
              ]
            },
            {
              id: "online_help_formats",
              type: "checkbox",
              max: 3,
              exclusiveValues: ["none"],
              label: "What kind of help would be most useful?",
              help: "Choose up to three.",
              options: [
                { value: "web_steps", label: "Simple step-by-step instructions on the WNMU-TV website" },
                { value: "short_video", label: "A short setup video" },
                { value: "phone_help", label: "Someone to call for help" },
                { value: "printed_guide", label: "A printable or mailed setup guide" },
                { value: "community_help", label: "In-person help at a community location or event" },
                { value: "email_chat", label: "Help by email or chat" },
                { value: "none", label: "I do not need setup help" }
              ]
            },
            {
              id: "online_features",
              type: "checkbox",
              max: 4,
              label: "Which online improvements would matter most to you?",
              help: "Choose up to four.",
              options: [
                { value: "clear_local_section", label: "A clearer WNMU-TV and local-program section" },
                { value: "easier_livestream", label: "Easier access to the WNMU-TV livestream" },
                { value: "better_search", label: "Better search and browsing" },
                { value: "watchlist", label: "An easier watchlist or saved-program feature" },
                { value: "reminders", label: "Program reminders and notifications" },
                { value: "local_archive", label: "More local and regional programs available on demand" },
                { value: "device_setup", label: "Clearer television and device setup instructions" },
                { value: "accessibility", label: "Better captioning and accessibility information" }
              ]
            },
            {
              id: "online_comments",
              type: "textarea",
              label: "What else should WNMU-TV know about your experience watching online?"
            }
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
          id: "children-use",
          title: "Children and learning needs",
          questions: [
            {
              id: "children_age_groups",
              type: "checkbox",
              label: "Which age groups do you select or recommend programming for?",
              options: [
                { value: "under_3", label: "Under age 3" },
                { value: "3_5", label: "Ages 3–5" },
                { value: "6_8", label: "Ages 6–8" },
                { value: "9_12", label: "Ages 9–12" },
                { value: "13_17", label: "Ages 13–17" },
                { value: "mixed", label: "Mixed-age groups" }
              ]
            },
            {
              id: "children_settings",
              type: "checkbox",
              label: "Where are these programs or resources used?",
              options: [
                { value: "home", label: "At home" },
                { value: "classroom", label: "School classroom" },
                { value: "library", label: "Library" },
                { value: "childcare", label: "Childcare or preschool" },
                { value: "homeschool", label: "Homeschool setting" },
                { value: "community", label: "Community or youth program" },
                { value: "other", label: "Another setting" }
              ]
            },
            {
              id: "children_learning_goals",
              type: "checkbox",
              max: 5,
              label: "Which learning goals should WNMU-TV and PBS support most strongly?",
              help: "Choose up to five.",
              options: [
                { value: "literacy", label: "Reading, language, and literacy" },
                { value: "stem", label: "Science, technology, engineering, and math" },
                { value: "social_emotional", label: "Social and emotional learning" },
                { value: "history_civics", label: "History and civics" },
                { value: "arts", label: "Arts, music, and creativity" },
                { value: "nature_outdoors", label: "Nature, wildlife, and the outdoors" },
                { value: "health", label: "Health and well-being" },
                { value: "careers", label: "Careers and workplace awareness" },
                { value: "world_cultures", label: "World cultures and languages" },
                { value: "entertainment", label: "Safe, enjoyable entertainment" }
              ]
            },
            {
              id: "children_local_importance",
              type: "radio",
              label: "How important is programming that helps children learn about the Upper Peninsula and Great Lakes region?",
              options: [
                { value: "1", label: "Not important" },
                { value: "2", label: "Slightly important" },
                { value: "3", label: "Moderately important" },
                { value: "4", label: "Very important" },
                { value: "5", label: "Essential" },
                commonNotSure
              ]
            }
          ]
        },
        {
          id: "children-resources",
          title: "Local topics, resources, and access",
          questions: [
            {
              id: "children_local_topics",
              type: "checkbox",
              max: 4,
              label: "Which local or regional topics would be most useful for children?",
              help: "Choose up to four.",
              options: [
                { value: "nature_great_lakes", label: "Regional nature, wildlife, and the Great Lakes" },
                { value: "history_culture", label: "Upper Peninsula history and cultures" },
                { value: "indigenous", label: "Indigenous history, cultures, and contemporary communities" },
                { value: "science", label: "Regional science and environmental issues" },
                { value: "careers", label: "Local careers and workplaces" },
                { value: "arts", label: "Regional arts, music, and storytelling" },
                { value: "outdoor_safety", label: "Outdoor skills and safety" },
                { value: "community_helpers", label: "Community helpers and public services" }
              ]
            },
            {
              id: "educator_resources",
              type: "checkbox",
              max: 4,
              exclusiveValues: ["none"],
              label: "Which educational resources would be most useful?",
              help: "Choose up to four.",
              options: [
                { value: "lesson_plans", label: "Lesson plans and teaching guides" },
                { value: "short_clips", label: "Short classroom-ready video clips" },
                { value: "full_programs", label: "Full programs for classroom or group use" },
                { value: "printables", label: "Printable activities and discussion sheets" },
                { value: "standards", label: "Clear links to learning standards" },
                { value: "professional_development", label: "Professional development for educators" },
                { value: "event_kits", label: "Materials for family or community learning events" },
                { value: "none", label: "I do not need additional educational resources" }
              ]
            },
            {
              id: "children_access_barriers",
              type: "checkbox",
              max: 4,
              exclusiveValues: ["none"],
              label: "What makes it harder to use children's programming or educational resources?",
              help: "Choose up to four.",
              options: [
                { value: "schedule", label: "Programs air at inconvenient times" },
                { value: "internet", label: "Internet access is limited or unreliable" },
                { value: "devices", label: "The needed devices are not available" },
                { value: "awareness", label: "People do not know the resources exist" },
                { value: "finding_age", label: "It is hard to find the right program for an age or learning goal" },
                { value: "accessibility", label: "Captioning, language, or accessibility needs are not met" },
                { value: "classroom_rights", label: "It is unclear what may be shown in a classroom or group setting" },
                { value: "none", label: "I have not encountered meaningful barriers" }
              ]
            },
            {
              id: "children_comments",
              type: "textarea",
              label: "What else should WNMU-TV know about the needs of children, families, educators, or learning organizations?"
            }
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
          id: "planning-information",
          title: "Planning and program information",
          questions: [
            {
              id: "planning_horizon",
              type: "radio",
              label: "How far ahead do you usually decide what television or streaming programs to watch?",
              options: [
                { value: "same_day", label: "The same day" },
                { value: "few_days", label: "A few days ahead" },
                { value: "one_week", label: "About a week ahead" },
                { value: "month", label: "Several weeks or a month ahead" },
                { value: "no_planning", label: "I usually browse without planning" }
              ]
            },
            {
              id: "program_information_needed",
              type: "checkbox",
              max: 5,
              label: "What information helps you decide whether to watch a program?",
              help: "Choose up to five.",
              options: [
                { value: "title_time", label: "Title, date, and time" },
                { value: "short_description", label: "A short description" },
                { value: "episode_details", label: "Episode-specific details" },
                { value: "repeat_times", label: "Repeat dates and times" },
                { value: "online_availability", label: "Where and how long it will be available online" },
                { value: "passport_status", label: "Whether Passport is required" },
                { value: "local_relevance", label: "Why it matters to this region" },
                { value: "family_guidance", label: "Age or family-viewing guidance" },
                { value: "accessibility", label: "Captioning, audio description, or accessibility information" },
                { value: "event_info", label: "Related local events, screenings, or discussions" }
              ]
            },
            {
              id: "schedule_format",
              type: "checkbox",
              max: 3,
              label: "Which schedule formats would be most useful?",
              help: "Choose up to three.",
              options: [
                { value: "daily_list", label: "Simple daily list" },
                { value: "weekly_grid", label: "Weekly channel grid" },
                { value: "searchable_web", label: "Searchable website schedule" },
                { value: "printable_pdf", label: "Printable PDF schedule" },
                { value: "weekly_email", label: "Weekly email of highlights and schedules" },
                { value: "app_calendar", label: "Calendar inside an app" },
                { value: "calendar_add", label: "Add selected programs to my personal calendar" }
              ]
            },
            {
              id: "message_frequency",
              type: "radio",
              label: "How often would you want WNMU-TV to send programming information?",
              options: [
                { value: "major_only", label: "Only for major programs or changes" },
                { value: "weekly", label: "About once a week" },
                { value: "several_week", label: "Two or three times a week" },
                { value: "daily", label: "Daily" },
                { value: "topic_choice", label: "Let me choose topics and frequency" },
                { value: "none", label: "I do not want messages sent to me" }
              ]
            }
          ]
        },
        {
          id: "reminders-reach",
          title: "Reminders and reaching viewers",
          questions: [
            {
              id: "reminder_preferences",
              type: "checkbox",
              max: 3,
              exclusiveValues: ["none"],
              label: "Which reminder methods would you consider using?",
              help: "Choose up to three.",
              options: [
                { value: "email", label: "Email" },
                { value: "text", label: "Text message" },
                { value: "app_push", label: "App notification" },
                { value: "social", label: "Social-media reminder" },
                { value: "calendar", label: "Personal calendar reminder" },
                { value: "none", label: "I do not want program reminders" }
              ]
            },
            {
              id: "social_content_interest",
              type: "checkbox",
              max: 4,
              exclusiveValues: ["none"],
              label: "What kinds of WNMU-TV posts or messages would be useful?",
              help: "Choose up to four.",
              options: [
                { value: "previews", label: "Program previews and highlights" },
                { value: "behind_scenes", label: "Behind-the-scenes material" },
                { value: "local_stories", label: "Short local and regional stories" },
                { value: "clips", label: "Short clips from programs" },
                { value: "staff_picks", label: "Staff recommendations" },
                { value: "schedule_changes", label: "Schedule changes and special airings" },
                { value: "community_events", label: "Community events and screenings" },
                { value: "station_support", label: "Station news, membership, and support information" },
                { value: "none", label: "None of these" }
              ]
            },
            {
              id: "communication_barriers",
              type: "checkbox",
              max: 4,
              exclusiveValues: ["none"],
              label: "What makes it difficult to know what WNMU-TV is offering?",
              help: "Choose up to four.",
              options: [
                { value: "where_to_look", label: "I do not know where to look" },
                { value: "too_many_places", label: "Information is spread across too many places" },
                { value: "too_late", label: "Information arrives too late" },
                { value: "not_enough_detail", label: "Program descriptions do not include enough detail" },
                { value: "schedule_hard", label: "The schedule is difficult to read or search" },
                { value: "does_not_reach", label: "WNMU-TV's messages do not reach the places I use" },
                { value: "too_promotional", label: "Messages feel too promotional" },
                { value: "none", label: "I generally find what I need" }
              ]
            },
            {
              id: "communication_comments",
              type: "textarea",
              label: "What is the best way for WNMU-TV to keep you informed without becoming intrusive?"
            }
          ]
        }
      ]
    }
  ];

  window.WNMU_FOLLOW_UPS = Object.freeze({
    schemaVersion: "wnmu-viewer-follow-ups-v1",
    modules
  });
})();
