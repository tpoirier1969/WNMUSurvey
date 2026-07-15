(function () {
  "use strict";

  const config = window.WNMU_CONFIG;
  if (!config) throw new Error("WNMU configuration must load before questionnaire definitions.");

  const channels = [
    { value: "wnmu_13_1", label: "WNMU-TV (13.1)" },
    { value: "pbs_kids_13_2", label: "PBS KIDS 24/7 (13.2)" },
    { value: "wnmu_plus_13_3", label: "WNMU-TV Plus (13.3)" },
    { value: "mlc_13_4", label: "Michigan Learning Channel (13.4)" }
  ];

  const programRows = [
    { id: "up_history_heritage", label: "Upper Peninsula history and cultural heritage" },
    { id: "great_lakes_nature", label: "Great Lakes, environment, nature, and wildlife" },
    { id: "outdoor_recreation", label: "Fishing, hunting, camping, hiking, and outdoor recreation" },
    { id: "local_people", label: "Local people, communities, and regional documentaries" },
    { id: "news_public_affairs", label: "Local news, public affairs, and civil discussion" },
    { id: "health_practical", label: "Health, aging, practical living, home, and gardening" },
    { id: "arts_performance", label: "Arts, music, theatre, and performance" },
    { id: "children_education", label: "Children's programming and education" },
    { id: "science_technology", label: "Science and technology" },
    { id: "national_documentaries", label: "National PBS documentaries, history, and current affairs" },
    { id: "drama_film", label: "Drama, mysteries, comedy, and independent film" },
    { id: "food_travel", label: "Food, cooking, and travel" }
  ];

  const stationRoleRows = [
    { id: "trusted_pbs", label: "Select and provide trusted national and regional public-television programming" },
    { id: "local_programs", label: "Produce programs specifically about the Upper Peninsula" },
    { id: "regional_issues", label: "Cover important regional issues and public affairs" },
    { id: "preserve_history", label: "Preserve and share Upper Peninsula and Great Lakes history" },
    { id: "reflect_region", label: "Reflect the people, places, communities, and cultures of the region" },
    { id: "children", label: "Provide educational programming for children and families" },
    { id: "science_nature", label: "Provide science, nature, and environmental programming" },
    { id: "arts_culture", label: "Provide arts, music, and cultural programming" },
    { id: "online_access", label: "Make programs easy to find online and on demand" },
    { id: "access_for_all", label: "Serve people with disabilities or limited and unreliable internet access" }
  ];

  window.WNMU_SURVEY = {
    config,
    version: config.schemaVersion,
    storageKeys: config.storageKeys,
    scales: {
      importance: [
        { value: 1, label: "Not important" },
        { value: 2, label: "Slightly important" },
        { value: 3, label: "Moderately important" },
        { value: 4, label: "Very important" },
        { value: 5, label: "Essential" },
        { value: "na", label: "Not sure" }
      ],
      performance: [
        { value: 1, label: "Poor" },
        { value: 2, label: "Weak" },
        { value: 3, label: "Adequate" },
        { value: 4, label: "Good" },
        { value: 5, label: "Excellent" },
        { value: "na", label: "Not familiar enough to rate" }
      ],
      interest: [
        { value: 1, label: "Not interested" },
        { value: 2, label: "Slightly interested" },
        { value: 3, label: "Moderately interested" },
        { value: 4, label: "Very interested" },
        { value: 5, label: "Extremely interested" },
        { value: "na", label: "Not sure" }
      ]
    },
    stages: [
      {
        id: "about_you",
        number: 1,
        title: "About You",
        shortTitle: "About You",
        intro: "A few optional details help us understand whether needs differ across communities and households.",
        pages: [
          {
            id: "about_profile",
            title: "Your community and household",
            questions: [
              {
                id: "county_region",
                type: "radio",
                layout: "compact",
                label: "Where do you live?",
                optionalLabel: true,
                options: [
                  { value: "alger", label: "Alger County" },
                  { value: "baraga", label: "Baraga County" },
                  { value: "chippewa", label: "Chippewa County" },
                  { value: "delta", label: "Delta County" },
                  { value: "dickinson", label: "Dickinson County" },
                  { value: "gogebic", label: "Gogebic County" },
                  { value: "houghton", label: "Houghton County" },
                  { value: "iron", label: "Iron County" },
                  { value: "keweenaw", label: "Keweenaw County" },
                  { value: "luce", label: "Luce County" },
                  { value: "mackinac", label: "Mackinac County" },
                  { value: "marquette", label: "Marquette County" },
                  { value: "menominee", label: "Menominee County" },
                  { value: "ontonagon", label: "Ontonagon County" },
                  { value: "schoolcraft", label: "Schoolcraft County" },
                  { value: "northern_wi", label: "Northern Wisconsin" },
                  { value: "other_mi", label: "Another Michigan county" },
                  { value: "other_state", label: "Another state" },
                  { value: "canada", label: "Canada" },
                  { value: "prefer_not", label: "Prefer not to answer" }
                ]
              },
              {
                id: "community_type",
                type: "radio",
                label: "Which best describes where you live?",
                optionalLabel: true,
                options: [
                  { value: "city", label: "City" },
                  { value: "small_town", label: "Small city or town" },
                  { value: "village", label: "Village" },
                  { value: "rural", label: "Rural area outside a town" },
                  { value: "remote", label: "Remote or isolated rural area" },
                  { value: "prefer_not", label: "Prefer not to answer" }
                ]
              },
              {
                id: "age_range",
                type: "radio",
                layout: "compact",
                label: "Age range",
                optionalLabel: true,
                options: [
                  { value: "under_18", label: "Under 18" },
                  { value: "18_24", label: "18–24" },
                  { value: "25_34", label: "25–34" },
                  { value: "35_44", label: "35–44" },
                  { value: "45_54", label: "45–54" },
                  { value: "55_64", label: "55–64" },
                  { value: "65_74", label: "65–74" },
                  { value: "75_84", label: "75–84" },
                  { value: "85_plus", label: "85 or older" },
                  { value: "prefer_not", label: "Prefer not to answer" }
                ]
              },
              {
                id: "internet_quality",
                type: "radio",
                label: "How would you describe the internet service available at your home?",
                optionalLabel: true,
                options: [
                  { value: "fast", label: "Fast and reliable" },
                  { value: "adequate", label: "Usually adequate" },
                  { value: "slow", label: "Slow" },
                  { value: "unreliable", label: "Unreliable" },
                  { value: "expensive", label: "Available but too expensive" },
                  { value: "cell_sat", label: "Only cellular or satellite service is practical" },
                  { value: "none", label: "No home internet service" },
                  { value: "prefer_not", label: "Prefer not to answer" }
                ]
              },
              {
                id: "children_role",
                store: "profile",
                type: "radio",
                required: true,
                label: "Do you select or recommend programming for children?",
                options: [
                  { value: "household", label: "Yes, for children in my household or family" },
                  { value: "educator", label: "Yes, as an educator, librarian, or childcare provider" },
                  { value: "both", label: "Both" },
                  { value: "neither", label: "I do not select or recommend programming for children" }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "wnmu_you",
        number: 2,
        title: "WNMU & You",
        shortTitle: "WNMU & You",
        intro: "Tell us what you know about WNMU-TV and how you currently receive it.",
        pages: [
          {
            id: "wnmu_relationship",
            title: "Your relationship with WNMU-TV",
            questions: [
              {
                id: "viewer_status",
                store: "profile",
                type: "radio",
                required: true,
                label: "During the past 12 months, how often have you knowingly watched WNMU-TV or WNMU-TV programming?",
                options: [
                  { value: "regular", label: "Daily or several times a week" },
                  { value: "occasional", label: "Several times a month or about weekly" },
                  { value: "once_twice", label: "Once or twice" },
                  { value: "former", label: "Not in the past year, but I watched in the past" },
                  { value: "never", label: "I have never knowingly watched WNMU-TV" },
                  { value: "unsure", label: "I may have watched, but I am not sure it came from WNMU-TV" }
                ]
              },
              {
                id: "station_awareness",
                type: "radio",
                label: "Before taking this questionnaire, did you know WNMU-TV is the local PBS station serving Upper Michigan and portions of northern Wisconsin?",
                options: [
                  { value: "yes", label: "Yes" },
                  { value: "station_not_pbs", label: "I knew it was a station, but not that it was the local PBS station" },
                  { value: "name_only", label: "I recognized the name but was not sure what it was" },
                  { value: "no", label: "No" }
                ]
              }
            ]
          },
          {
            id: "wnmu_access",
            title: "Access, channels, and online services",
            questions: [
              {
                id: "viewing_methods",
                store: "profile",
                type: "checkbox",
                required: true,
                label: "How have you watched WNMU-TV or PBS programming during the past 12 months?",
                help: "Select every method that applies.",
                exclusiveValues: ["not_watched"],
                options: [
                  { value: "antenna", label: "Over the air with an antenna" },
                  { value: "cable", label: "Cable television" },
                  { value: "satellite", label: "Satellite television" },
                  { value: "livestream", label: "WNMU-TV livestream" },
                  { value: "pbs_site", label: "PBS.org" },
                  { value: "pbs_app", label: "PBS App" },
                  { value: "passport", label: "WNMU Passport through the PBS App or PBS.org" },
                  { value: "youtube_social", label: "YouTube or social media" },
                  { value: "public_location", label: "At a school, library, senior facility, or other public location" },
                  { value: "not_watched", label: "I have not watched WNMU-TV or PBS during the past 12 months" }
                ]
              },
              {
                id: "channel_awareness",
                type: "checkbox",
                label: "Before taking this questionnaire, which WNMU-TV channels did you know existed?",
                exclusiveValues: ["none"],
                options: [...channels, { value: "none", label: "I was not aware of any of these channels" }]
              },
              {
                id: "channels_received",
                type: "checkbox",
                when: { hasAnyMethod: ["antenna", "cable", "satellite", "public_location"] },
                label: "Which WNMU-TV channels can you currently receive through an antenna or television provider?",
                exclusiveValues: ["none", "not_sure"],
                options: [
                  ...channels,
                  { value: "none", label: "I do not receive any of these channels" },
                  { value: "not_sure", label: "I am not sure which channels I receive" }
                ]
              },
              {
                id: "ota_reception",
                type: "radio",
                when: { hasAnyMethod: ["antenna"] },
                label: "How would you describe your ability to receive WNMU-TV over the air?",
                options: [
                  { value: "excellent", label: "Excellent and reliable" },
                  { value: "usually", label: "Usually reliable" },
                  { value: "inconsistent", label: "Inconsistent" },
                  { value: "poor", label: "Poor" },
                  { value: "cannot", label: "I cannot receive it" },
                  { value: "not_sure", label: "Not sure" }
                ]
              },
              {
                id: "online_awareness",
                type: "checkbox",
                label: "Before today, which WNMU-TV or PBS online services were you aware of?",
                exclusiveValues: ["none"],
                options: [
                  { value: "wnmu_site", label: "WNMU-TV website" },
                  { value: "livestream", label: "WNMU-TV livestream" },
                  { value: "pbs_site", label: "PBS.org" },
                  { value: "pbs_app", label: "PBS App" },
                  { value: "passport", label: "WNMU Passport" },
                  { value: "kids_app", label: "PBS KIDS app" },
                  { value: "youtube", label: "WNMU-TV or PBS on YouTube" },
                  { value: "social", label: "WNMU-TV social media" },
                  { value: "none", label: "I was not aware of any of these" }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "what_watch",
        number: 3,
        title: "What You Watch",
        shortTitle: "What You Watch",
        intro: "Tell us what you actually watch and how you prefer to watch it.",
        pages: [
          {
            id: "watching_habits",
            title: "Your viewing habits",
            questions: [
              {
                id: "channels_watched",
                type: "checkbox",
                when: { viewerStatusNotIn: ["never"] },
                label: "Which WNMU-TV channels do you watch, even occasionally?",
                exclusiveValues: ["none", "not_sure"],
                options: [
                  ...channels,
                  { value: "none", label: "I do not watch any of these channels" },
                  { value: "not_sure", label: "I am not sure which channel I watch" }
                ]
              },
              {
                id: "watch_preference",
                type: "radio",
                label: "When you find a program that interests you, how do you generally prefer to watch it?",
                options: [
                  { value: "scheduled", label: "At the scheduled broadcast time" },
                  { value: "recorded", label: "Recorded and watched later" },
                  { value: "on_demand", label: "Streamed on demand" },
                  { value: "livestream", label: "Through a livestream" },
                  { value: "short_clips", label: "As short clips or highlights" },
                  { value: "depends", label: "It depends on the program" },
                  { value: "none", label: "No strong preference" }
                ]
              }
            ]
          },
          {
            id: "watching_interests",
            title: "Programming you watch or value",
            questions: [
              {
                id: "program_interest_v2",
                type: "matrix",
                scale: "interest",
                label: "How interested are you in watching each type of programming?",
                rows: programRows
              },
              {
                id: "valued_programs",
                type: "textarea",
                label: "Which current or past programs you've watched on WNMU-TV or PBS have been especially valuable or memorable to you?",
                optionalLabel: true
              },
              {
                id: "kids_use",
                type: "checkbox",
                when: { childrenRoleIn: ["household", "educator", "both"] },
                label: "How is PBS KIDS or other children's public-media content used?",
                exclusiveValues: ["not_used"],
                options: [
                  { value: "broadcast", label: "Scheduled television broadcast" },
                  { value: "kids_app", label: "PBS KIDS app" },
                  { value: "pbs_app", label: "PBS app or website" },
                  { value: "youtube", label: "YouTube" },
                  { value: "classroom", label: "Classroom, library, or childcare setting" },
                  { value: "not_used", label: "It is not currently used" }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "what_want",
        number: 4,
        title: "What You Want",
        shortTitle: "What You Want",
        intro: "Choose the programming, local formats, access improvements, and communication methods that matter most to you.",
        pages: [
          {
            id: "future_priorities",
            title: "Programming priorities",
            questions: [
              {
                id: "top_program_priorities_v2",
                type: "checkbox",
                max: 5,
                label: "Which five programming categories should receive the greatest attention from WNMU-TV?",
                optionsFromMatrix: "program_interest_v2"
              },
              {
                id: "local_formats",
                type: "checkbox",
                max: 3,
                label: "Which locally produced formats would you be most likely to watch? Choose up to three.",
                options: [
                  { value: "documentaries", label: "Documentaries and local history series" },
                  { value: "news_magazine", label: "Weekly local news or public-affairs magazine" },
                  { value: "interviews", label: "Interviews and profiles of regional people" },
                  { value: "roundtables", label: "Roundtables, forums, and town halls" },
                  { value: "outdoor", label: "Outdoor, nature, and Great Lakes series" },
                  { value: "arts", label: "Arts and performance programs" },
                  { value: "events", label: "Community events and student productions" },
                  { value: "short_online", label: "Short online videos or podcasts" }
                ]
              }
            ]
          },
          {
            id: "future_access",
            title: "Access and communication",
            questions: [
              {
                id: "online_improvements",
                type: "checkbox",
                max: 3,
                label: "What would make you more likely to use WNMU-TV online? Choose up to three.",
                options: [
                  { value: "clear_where", label: "A clearer explanation of where to watch" },
                  { value: "local_access", label: "Easier access to local programs" },
                  { value: "search", label: "Better search and browsing" },
                  { value: "more_full", label: "More full episodes" },
                  { value: "archive", label: "A larger local-program archive" },
                  { value: "notifications", label: "Notifications about new programs" },
                  { value: "tv_compat", label: "Better television and streaming-device compatibility" },
                  { value: "help", label: "Help installing or using the PBS App" },
                  { value: "passport_clear", label: "Clearer information about Passport" },
                  { value: "nothing", label: "Nothing would make me more likely" }
                ],
                exclusiveValues: ["nothing"]
              },
              {
                id: "learn_preferred",
                type: "checkbox",
                max: 3,
                label: "How would you prefer to learn about WNMU-TV programming? Choose up to three.",
                options: [
                  { value: "on_air", label: "On-air announcements" },
                  { value: "tv_guide", label: "Television program guide" },
                  { value: "printed", label: "Printed program guide" },
                  { value: "wnmu_site", label: "WNMU-TV website" },
                  { value: "pbs_app", label: "PBS website or app" },
                  { value: "email", label: "Email newsletter" },
                  { value: "facebook", label: "Facebook" },
                  { value: "instagram", label: "Instagram" },
                  { value: "youtube", label: "YouTube" },
                  { value: "newspaper_radio", label: "Newspaper or radio" },
                  { value: "community", label: "Community organizations" },
                  { value: "text_push", label: "Text or app notifications" }
                ]
              },
              {
                id: "kids_needs",
                type: "textarea",
                when: { childrenRoleIn: ["household", "educator", "both"] },
                label: "What children's, family, classroom, or educator resources should WNMU-TV provide more of?",
                optionalLabel: true
              }
            ]
          }
        ]
      },
      {
        id: "how_doing",
        number: 5,
        title: "How We're Doing",
        shortTitle: "How We're Doing",
        intro: "Tell us which station roles matter most. If you know WNMU-TV well enough, rate its performance in the same place.",
        pages: [
          {
            id: "station_performance",
            title: "Priorities and performance",
            questions: [
              {
                id: "importance_roles",
                type: "matrix",
                scale: "importance",
                pairWith: "performance_roles",
                label: "For each role, tell us how important it should be and, when you can, how well WNMU-TV is doing.",
                help: "WNMU-TV selects and schedules most of the programming it carries, while regional and national producers create most of the programs themselves.",
                rows: stationRoleRows
              },
              {
                id: "performance_roles",
                type: "matrix",
                scale: "performance",
                when: { viewerStatusNotIn: ["never", "former"] },
                renderedBy: "importance_roles",
                label: "Based on what you have seen or experienced, how well is WNMU-TV performing in each area?",
                help: "Rate WNMU-TV's selection, scheduling, access, local production, and community service, not production decisions made by outside producers.",
                rows: stationRoleRows
              },
              {
                id: "reflects_me",
                type: "radio",
                when: { viewerStatusNotIn: ["never", "former"] },
                label: "How well does WNMU-TV reflect the interests and needs of people like you?",
                options: [
                  { value: "not_at_all", label: "Not at all" },
                  { value: "little", label: "A little" },
                  { value: "somewhat", label: "Somewhat" },
                  { value: "well", label: "Well" },
                  { value: "very_well", label: "Very well" },
                  { value: "not_familiar", label: "Not familiar enough to answer" }
                ]
              },
              {
                id: "trust_station",
                type: "radio",
                when: { viewerStatusNotIn: ["never", "former"] },
                label: "How much do you trust WNMU-TV as a source of programming and information?",
                options: [
                  { value: "none", label: "Not at all" },
                  { value: "little", label: "A little" },
                  { value: "some", label: "Somewhat" },
                  { value: "quite", label: "Quite a bit" },
                  { value: "great", label: "A great deal" },
                  { value: "not_familiar", label: "Not familiar enough to answer" }
                ]
              },
              {
                id: "nonviewer_reasons",
                type: "checkbox",
                when: { viewerStatusIn: ["former", "never", "unsure"] },
                label: "Which reasons best explain why you do not watch WNMU-TV more often?",
                options: [
                  { value: "unaware", label: "I was not aware of WNMU-TV or what it offers" },
                  { value: "channel", label: "I do not know where to find it" },
                  { value: "signal", label: "I cannot receive a reliable signal" },
                  { value: "provider", label: "It is not available through my provider" },
                  { value: "schedule", label: "The schedule does not fit my viewing habits" },
                  { value: "online", label: "I do not know how to watch online" },
                  { value: "content", label: "The programming has not interested me" },
                  { value: "other_services", label: "Other services already meet my needs" },
                  { value: "little_tv", label: "I watch very little television or long-form video" },
                  { value: "past_change", label: "My habits or household changed" },
                  { value: "not_local", label: "The station does not feel relevant to my community" }
                ]
              },
              {
                id: "nonviewer_return",
                type: "textarea",
                when: { viewerStatusIn: ["former", "never", "unsure"] },
                label: "What program, service, or change would make you most likely to try or return to WNMU-TV?",
                optionalLabel: true
              },
              {
                id: "station_feedback_v2",
                type: "textarea",
                when: { viewerStatusNotIn: ["never", "former"] },
                label: "What is WNMU-TV doing well, and where should it improve?",
                optionalLabel: true
              }
            ]
          }
        ]
      }
    ],
    gapPairs: {
      importanceQuestion: "importance_roles",
      performanceQuestion: "performance_roles"
    },
    compatibility: {
      retainedQuestionIds: [
        "county_region", "community_type", "age_range", "internet_quality",
        "children_role", "viewer_status", "station_awareness", "viewing_methods",
        "channel_awareness", "channels_received", "ota_reception", "online_awareness",
        "channels_watched", "watch_preference", "valued_programs", "kids_use",
        "importance_roles", "local_formats", "online_improvements", "learn_preferred", "kids_needs",
        "performance_roles", "reflects_me", "trust_station",
        "nonviewer_reasons", "nonviewer_return"
      ],
      redesignedQuestionIds: {
        program_interest: "program_interest_v2",
        top_program_priorities: "top_program_priorities_v2",
        does_well_falls_short_underrepresented: "station_feedback_v2"
      },
      retiredQuestionIds: [
        "source_awareness", "tv_services", "devices", "viewing_times", "discovery_methods", "broadcast_barriers",
        "broadcast_improvement", "online_find_ease", "online_content", "online_barriers", "nonviewer_return_old",
        "most_important_responsibility", "never_lose", "preferred_length", "missing_subject", "child_ages",
        "kids_value", "kids_times", "learn_currently", "station_connection", "connection_activities",
        "financial_support", "support_factors", "zip_code", "household_size", "employment", "household_income",
        "context_note", "station_relationships", "gender", "education_level", "personal_value", "viewing_frequency",
        "online_services_used", "one_program_change", "recommend", "final_comment"
      ]
    }
  };
})();
