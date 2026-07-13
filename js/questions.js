window.WNMU_SURVEY = {
  version: "wnmu-viewer-questionnaire-v2-local",
  storageKeys: {
    draft: "wnmuViewerSurveyDraft:v1",
    responses: "wnmuViewerSurveyResponses:v1"
  },
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
      { value: 5, label: "Extremely interested" }
    ]
  },

  routingQuestions: [
    {
      id: "viewer_status",
      type: "radio",
      required: true,
      label: "During the past 12 months, how often have you knowingly watched WNMU-TV or WNMU-TV programming?",
      help: "Choose the answer that best describes the past year.",
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
      id: "viewing_methods",
      type: "checkbox",
      required: true,
      label: "How have you watched WNMU-TV or PBS programming during the past 12 months?",
      help: "Select every method that applies. Choose the final option if none apply.",
      exclusiveValues: ["not_watched"],
      options: [
        { value: "antenna", label: "Over the air with an antenna" },
        { value: "cable", label: "Cable television" },
        { value: "satellite", label: "Satellite television" },
        { value: "livestream", label: "WNMU-TV livestream" },
        { value: "pbs_site", label: "PBS website" },
        { value: "pbs_app", label: "PBS app" },
        { value: "passport", label: "WNMU Passport" },
        { value: "youtube_social", label: "YouTube or social media" },
        { value: "public_location", label: "At a school, library, senior facility, or other public location" },
        { value: "not_watched", label: "I have not watched WNMU-TV or PBS during the past 12 months" }
      ]
    },
    {
      id: "children_role",
      type: "radio",
      required: true,
      label: "Do you select or recommend programming for children?",
      options: [
        { value: "household", label: "Yes, for children in my household or family" },
        { value: "educator", label: "Yes, as an educator, librarian, or childcare provider" },
        { value: "both", label: "Both" },
        { value: "neither", label: "No" }
      ]
    },
    {
      id: "station_relationships",
      type: "checkbox",
      required: false,
      label: "Do any of these describe your relationship with WNMU-TV or NMU?",
      exclusiveValues: ["none"],
      options: [
        { value: "donor", label: "Current or former WNMU-TV donor" },
        { value: "passport_user", label: "WNMU Passport user" },
        { value: "nmu_affiliation", label: "NMU student, employee, alumnus, or household member" },
        { value: "educator", label: "Educator or school employee" },
        { value: "community_partner", label: "Community organization or production partner" },
        { value: "none", label: "None of these" }
      ]
    }
  ],

  sections: [
    {
      id: "connection",
      shortTitle: "Connection",
      eyebrow: "Your connection",
      title: "Your relationship with WNMU-TV",
      intro: "A few questions about awareness, frequency, and the role WNMU-TV currently plays in your household.",
      questions: [
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
        },
        {
          id: "viewing_frequency",
          type: "radio",
          when: { viewerStatusNotIn: ["never"] },
          label: "How often do you currently watch WNMU-TV programming?",
          options: [
            { value: "daily", label: "Daily or nearly daily" },
            { value: "several_week", label: "Several times a week" },
            { value: "weekly", label: "About once a week" },
            { value: "several_month", label: "Several times a month" },
            { value: "monthly", label: "About once a month" },
            { value: "less", label: "Less often" },
            { value: "not_currently", label: "I do not currently watch" },
            { value: "unsure", label: "I am not sure whether what I watch comes from WNMU-TV" }
          ]
        },
        {
          id: "source_awareness",
          type: "radio",
          when: { viewerStatusNotIn: ["never"] },
          label: "When you watch PBS programming, how often do you know whether it came from WNMU-TV, another PBS station, or PBS nationally?",
          options: [
            { value: "always", label: "Almost always" },
            { value: "usually", label: "Usually" },
            { value: "sometimes", label: "Sometimes" },
            { value: "rarely", label: "Rarely" },
            { value: "never", label: "Never" },
            { value: "no_pbs", label: "I do not watch PBS programming" }
          ]
        },
        {
          id: "personal_value",
          type: "scale",
          scale: "importance",
          when: { viewerStatusNotIn: ["never"] },
          label: "How valuable is WNMU-TV to you or your household personally?"
        }
      ]
    },

    {
      id: "general_habits",
      shortTitle: "Viewing habits",
      eyebrow: "How you watch",
      title: "Your television and video habits",
      intro: "Tell us how television and longer-form video fit into your household.",
      questions: [
        {
          id: "tv_services",
          type: "checkbox",
          label: "How do you receive television or longer-form video in your home?",
          options: [
            { value: "antenna", label: "Antenna or over-the-air television" },
            { value: "cable", label: "Cable television" },
            { value: "satellite", label: "Satellite television" },
            { value: "live_streaming", label: "Live television streaming service" },
            { value: "streaming_services", label: "Individual streaming services" },
            { value: "web_video", label: "Websites or online video" },
            { value: "physical_media", label: "DVDs or other physical media" },
            { value: "rarely", label: "I rarely or never watch television or longer-form video" }
          ]
        },
        {
          id: "devices",
          type: "checkbox",
          label: "Which devices do you use to watch television or video?",
          options: [
            { value: "traditional_tv", label: "Traditional television" },
            { value: "smart_tv", label: "Smart television" },
            { value: "roku", label: "Roku" },
            { value: "fire_tv", label: "Amazon Fire TV" },
            { value: "apple_tv", label: "Apple TV" },
            { value: "other_streamer", label: "Another streaming device" },
            { value: "computer", label: "Desktop or laptop computer" },
            { value: "tablet", label: "Tablet" },
            { value: "phone", label: "Smartphone" },
            { value: "none", label: "None of these" }
          ]
        },
        {
          id: "viewing_times",
          type: "checkbox",
          max: 3,
          label: "When do you most often watch television or longer-form video? Select up to three.",
          options: [
            { value: "early_morning", label: "Before 9 a.m." },
            { value: "late_morning", label: "9 a.m.–noon" },
            { value: "afternoon", label: "Noon–6 p.m." },
            { value: "early_evening", label: "6–8 p.m." },
            { value: "prime", label: "8–10 p.m." },
            { value: "late", label: "After 10 p.m." },
            { value: "weekend_morning", label: "Weekend mornings" },
            { value: "weekend_afternoon", label: "Weekend afternoons" },
            { value: "varies", label: "My viewing varies too much to identify a usual time" }
          ]
        },
        {
          id: "discovery_methods",
          type: "checkbox",
          label: "How do you usually decide what to watch?",
          options: [
            { value: "scheduled", label: "I watch at the scheduled broadcast time" },
            { value: "guide", label: "I browse a television program guide" },
            { value: "app_browse", label: "I browse a streaming app" },
            { value: "search_topic", label: "I search for a program or subject" },
            { value: "record", label: "I record programs to watch later" },
            { value: "recommendations", label: "Friends or family recommend programs" },
            { value: "social", label: "Social media" },
            { value: "email", label: "Email newsletters or reminders" },
            { value: "on_air", label: "On-air promotions" },
            { value: "web_search", label: "Online search" },
            { value: "whatever_on", label: "I watch whatever happens to be on" }
          ]
        },
        {
          id: "watch_preference",
          type: "radio",
          label: "When you find a program that interests you, which option do you generally prefer?",
          options: [
            { value: "scheduled", label: "Watch at the scheduled broadcast time" },
            { value: "recorded", label: "Record it and watch later" },
            { value: "on_demand", label: "Stream it on demand" },
            { value: "livestream", label: "Watch a livestream" },
            { value: "short_clips", label: "Watch short clips or highlights" },
            { value: "depends", label: "It depends on the program" },
            { value: "none", label: "No strong preference" }
          ]
        }
      ]
    },

    {
      id: "broadcast",
      shortTitle: "Broadcast",
      eyebrow: "Broadcast viewers",
      title: "Receiving WNMU-TV on television",
      intro: "Tell us about your television reception and any problems that make WNMU-TV difficult to watch.",
      when: { hasAnyMethod: ["antenna", "cable", "satellite", "public_location"] },
      questions: [
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
          id: "broadcast_barriers",
          type: "checkbox",
          label: "Have any of these made it difficult to watch WNMU-TV on television?",
          exclusiveValues: ["none"],
          options: [
            { value: "signal", label: "Weak or unreliable over-the-air signal" },
            { value: "provider", label: "WNMU-TV is not available through my provider" },
            { value: "channel_unknown", label: "I do not know what channel it is on" },
            { value: "schedule_unknown", label: "I cannot find the schedule" },
            { value: "times", label: "Programs air at inconvenient times" },
            { value: "miss_promos", label: "I do not know when programs are airing" },
            { value: "equipment", label: "I do not own the necessary equipment" },
            { value: "interest", label: "The programming does not interest me" },
            { value: "too_many", label: "I already have too many viewing choices" },
            { value: "none", label: "Nothing has made it difficult" }
          ]
        },
        {
          id: "broadcast_improvement",
          type: "textarea",
          label: "What would make WNMU-TV easier or more useful to watch on traditional television?"
        }
      ]
    },

    {
      id: "online",
      shortTitle: "Online access",
      eyebrow: "Streaming and online",
      title: "Finding WNMU-TV beyond the broadcast signal",
      intro: "Tell us what you know about WNMU-TV and PBS online options, even if you do not currently use them.",
      questions: [
        {
          id: "online_awareness",
          type: "checkbox",
          label: "Before today, which WNMU-TV or PBS online services were you aware of?",
          exclusiveValues: ["none"],
          options: [
            { value: "wnmu_site", label: "WNMU-TV website" },
            { value: "livestream", label: "WNMU-TV livestream" },
            { value: "pbs_site", label: "PBS.org" },
            { value: "pbs_app", label: "PBS app" },
            { value: "passport", label: "WNMU Passport" },
            { value: "kids_app", label: "PBS KIDS app" },
            { value: "youtube", label: "WNMU-TV or PBS on YouTube" },
            { value: "social", label: "WNMU-TV social media" },
            { value: "none", label: "I was not aware of any of these" }
          ]
        },
        {
          id: "online_services_used",
          type: "checkbox",
          when: { viewerStatusNotIn: ["never"] },
          label: "Which online services have you personally used?",
          exclusiveValues: ["none"],
          options: [
            { value: "wnmu_site", label: "WNMU-TV website" },
            { value: "livestream", label: "WNMU-TV livestream" },
            { value: "pbs_site", label: "PBS.org" },
            { value: "pbs_app", label: "PBS app" },
            { value: "passport", label: "WNMU Passport" },
            { value: "kids_app", label: "PBS KIDS app" },
            { value: "youtube", label: "YouTube" },
            { value: "social", label: "Social media" },
            { value: "none", label: "None of these" }
          ]
        },
        {
          id: "online_find_ease",
          type: "radio",
          when: { hasAnyMethod: ["livestream", "pbs_site", "pbs_app", "passport", "youtube_social"] },
          label: "How easy or difficult is it to find WNMU-TV programs online?",
          options: [
            { value: "very_easy", label: "Very easy" },
            { value: "easy", label: "Somewhat easy" },
            { value: "neutral", label: "Neither easy nor difficult" },
            { value: "difficult", label: "Somewhat difficult" },
            { value: "very_difficult", label: "Very difficult" },
            { value: "not_tried", label: "I have not tried" }
          ]
        },
        {
          id: "online_content",
          type: "checkbox",
          label: "Which types of WNMU-TV online content would you be most likely to use?",
          options: [
            { value: "live", label: "Live WNMU-TV programming" },
            { value: "local_full", label: "Full episodes of local programs" },
            { value: "pbs_full", label: "Full episodes of national PBS programs" },
            { value: "local_clips", label: "Short clips from local programs" },
            { value: "public_affairs", label: "Local news and public affairs segments" },
            { value: "history", label: "Local history documentaries" },
            { value: "arts", label: "Arts and cultural performances" },
            { value: "education", label: "Educational videos" },
            { value: "kids", label: "Children's programming" },
            { value: "archive", label: "Archived local programs" },
            { value: "events", label: "Community event coverage" },
            { value: "podcast", label: "Podcasts or audio versions" }
          ]
        },
        {
          id: "online_barriers",
          type: "checkbox",
          label: "What usually prevents you from watching more WNMU-TV programming online?",
          exclusiveValues: ["nothing", "not_interested"],
          options: [
            { value: "unknown_available", label: "I do not know what is available" },
            { value: "unknown_where", label: "I do not know where to find it" },
            { value: "navigation", label: "The website or app is difficult to navigate" },
            { value: "account", label: "I do not want to create another account" },
            { value: "signin", label: "I have trouble signing in" },
            { value: "passport_confusion", label: "I do not understand which programs require Passport" },
            { value: "internet", label: "My internet is too slow or unreliable" },
            { value: "prefer_tv", label: "I prefer traditional television" },
            { value: "prefer_other", label: "I prefer other streaming services" },
            { value: "availability", label: "The programs I want are not available" },
            { value: "local_hard", label: "Local programs are difficult to find" },
            { value: "device", label: "I do not have a compatible device" },
            { value: "not_interested", label: "I am not interested in watching more" },
            { value: "nothing", label: "Nothing prevents me" }
          ]
        },
        {
          id: "online_improvements",
          type: "checkbox",
          max: 3,
          label: "What would make you more likely to use WNMU-TV online? Select up to three.",
          options: [
            { value: "clear_where", label: "A clearer explanation of where to watch" },
            { value: "local_access", label: "Easier access to local programs" },
            { value: "search", label: "Better search and browsing" },
            { value: "more_full", label: "More full episodes" },
            { value: "recent", label: "More recent episodes" },
            { value: "archive", label: "A larger local-program archive" },
            { value: "short", label: "More short videos" },
            { value: "notifications", label: "Notifications about new programs" },
            { value: "tv_compat", label: "Better television and streaming-device compatibility" },
            { value: "help", label: "Help installing or using the PBS app" },
            { value: "passport_clear", label: "Clearer information about Passport" },
            { value: "better_internet", label: "Faster or more reliable internet service" },
            { value: "nothing", label: "Nothing would make me more likely" }
          ]
        }
      ]
    },

    {
      id: "nonviewer",
      shortTitle: "Why not watch?",
      eyebrow: "Former and non-viewers",
      title: "What is keeping WNMU-TV out of your viewing routine?",
      intro: "Tell us what has kept you from watching and what might make WNMU-TV more useful or relevant to you.",
      when: { viewerStatusIn: ["former", "never", "unsure"] },
      questions: [
        {
          id: "nonviewer_reasons",
          type: "checkbox",
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
          label: "What program, service, or change would make you most likely to try—or return to—WNMU-TV?"
        }
      ]
    },

    {
      id: "expectations",
      shortTitle: "Expectations",
      eyebrow: "What WNMU-TV should do",
      title: "Define the station's job before grading it",
      intro: "Rate how important each role should be for WNMU-TV. These ratings can later be compared with performance ratings from viewers.",
      questions: [
        {
          id: "importance_roles",
          type: "matrix",
          scale: "importance",
          label: "How important should each role be for WNMU-TV?",
          rows: [
            { id: "trusted_pbs", label: "Provide trusted national PBS programming" },
            { id: "local_programs", label: "Produce programs specifically about the Upper Peninsula" },
            { id: "regional_issues", label: "Cover important regional issues and public affairs" },
            { id: "preserve_history", label: "Preserve and share Upper Peninsula and Great Lakes history" },
            { id: "reflect_region", label: "Reflect the people, places, communities, and cultures of the region" },
            { id: "children", label: "Provide educational programming for children and families" },
            { id: "science_nature", label: "Provide science, nature, and environmental programming" },
            { id: "arts_culture", label: "Provide arts, music, and cultural programming" },
            { id: "health_practical", label: "Provide useful health, wellness, and practical information" },
            { id: "thoughtful_forum", label: "Provide thoughtful discussion of difficult or controversial issues" },
            { id: "online_access", label: "Make programs easy to find online and on demand" },
            { id: "limited_internet", label: "Serve viewers with limited or unreliable internet access" },
            { id: "accessibility", label: "Make programming accessible to people with disabilities" },
            { id: "local_partnerships", label: "Partner with local schools, organizations, artists, and producers" },
            { id: "student_experience", label: "Give NMU students meaningful broadcasting and production experience" }
          ]
        },
        {
          id: "most_important_responsibility",
          type: "textarea",
          label: "In your own words, what should be WNMU-TV's most important responsibility to the region?"
        },
        {
          id: "never_lose",
          type: "textarea",
          label: "What is one thing WNMU-TV should make sure it never loses?"
        }
      ]
    },

    {
      id: "performance",
      shortTitle: "Performance",
      eyebrow: "How WNMU-TV is doing",
      title: "How well is WNMU-TV meeting those expectations?",
      intro: "Please rate only the areas you know enough about. Choose “Not familiar enough” whenever appropriate.",
      when: { viewerStatusNotIn: ["never"] },
      questions: [
        {
          id: "performance_roles",
          type: "matrix",
          scale: "performance",
          label: "Based on what you have seen or experienced, how well is WNMU-TV performing in each area?",
          rows: [
            { id: "trusted_pbs", label: "Provide trusted national PBS programming" },
            { id: "local_programs", label: "Produce programs specifically about the Upper Peninsula" },
            { id: "regional_issues", label: "Cover important regional issues and public affairs" },
            { id: "preserve_history", label: "Preserve and share Upper Peninsula and Great Lakes history" },
            { id: "reflect_region", label: "Reflect the people, places, communities, and cultures of the region" },
            { id: "children", label: "Provide educational programming for children and families" },
            { id: "science_nature", label: "Provide science, nature, and environmental programming" },
            { id: "arts_culture", label: "Provide arts, music, and cultural programming" },
            { id: "health_practical", label: "Provide useful health, wellness, and practical information" },
            { id: "thoughtful_forum", label: "Provide thoughtful discussion of difficult or controversial issues" },
            { id: "online_access", label: "Make programs easy to find online and on demand" },
            { id: "limited_internet", label: "Serve viewers with limited or unreliable internet access" },
            { id: "accessibility", label: "Make programming accessible to people with disabilities" },
            { id: "local_partnerships", label: "Partner with local schools, organizations, artists, and producers" },
            { id: "student_experience", label: "Give NMU students meaningful broadcasting and production experience" }
          ]
        },
        {
          id: "reflects_me",
          type: "radio",
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
          id: "does_well",
          type: "textarea",
          label: "What is WNMU-TV doing especially well?"
        },
        {
          id: "falls_short",
          type: "textarea",
          label: "Where is WNMU-TV falling short?"
        },
        {
          id: "underrepresented",
          type: "textarea",
          label: "Is there a group, community, subject, or part of the region WNMU-TV does not represent well enough?"
        }
      ]
    },

    {
      id: "programming",
      shortTitle: "Programming",
      eyebrow: "What you would watch",
      title: "Programming interests and priorities",
      intro: "First rate your interest in each category, then choose the five you believe deserve the most attention.",
      questions: [
        {
          id: "program_interest",
          type: "matrix",
          scale: "interest",
          label: "How interested are you in watching each type of programming?",
          rows: [
            { id: "up_history", label: "Upper Peninsula history" },
            { id: "great_lakes", label: "Lake Superior and Great Lakes history, science, and issues" },
            { id: "native", label: "Native American history, culture, and contemporary life" },
            { id: "heritage", label: "Finnish-American and other regional cultural heritage" },
            { id: "local_people", label: "Local communities, people, and regional documentaries" },
            { id: "local_news", label: "Local news and regional public affairs" },
            { id: "state_policy", label: "State government, elections, and public policy" },
            { id: "civil_discussion", label: "Civil discussions involving different viewpoints" },
            { id: "economy", label: "The regional economy, jobs, and workforce" },
            { id: "health", label: "Rural health care, wellness, aging, and senior issues" },
            { id: "education", label: "Education, schools, NMU research, and student life" },
            { id: "kids", label: "Children's educational programming" },
            { id: "science", label: "Science and technology" },
            { id: "nature", label: "Nature, wildlife, conservation, climate, and weather" },
            { id: "outdoors", label: "Fishing, hunting, camping, hiking, and outdoor recreation" },
            { id: "resources", label: "Agriculture, forestry, mining, and natural resources" },
            { id: "local_arts", label: "Local arts, artists, music, theatre, and performance" },
            { id: "books_food", label: "Books, regional authors, cooking, and regional food" },
            { id: "home_garden", label: "Home improvement and gardening" },
            { id: "travel", label: "Travel within the Upper Peninsula and Great Lakes" },
            { id: "national_docs", label: "National PBS documentaries and history" },
            { id: "british_drama", label: "British drama and mysteries" },
            { id: "american_drama", label: "American drama, comedy, and independent film" },
            { id: "how_to", label: "How-to and instructional programs" },
            { id: "veterans", label: "Veterans and military history" },
            { id: "community_events", label: "Community events, performances, and student productions" }
          ]
        },
        {
          id: "top_program_priorities",
          type: "checkbox",
          max: 5,
          label: "Which five categories should receive the greatest attention from WNMU-TV?",
          optionsFromMatrix: "program_interest"
        },
        {
          id: "local_formats",
          type: "checkbox",
          label: "Which types of locally produced programs would you be most likely to watch?",
          options: [
            { value: "interviews", label: "Half-hour studio interviews" },
            { value: "roundtables", label: "Roundtable discussions" },
            { value: "explainers", label: "Investigative or explanatory reports" },
            { value: "documentaries", label: "Full-length or short documentaries" },
            { value: "news_magazine", label: "Weekly local news magazine" },
            { value: "updates", label: "Frequent local news updates" },
            { value: "elections", label: "Candidate forums and election coverage" },
            { value: "town_halls", label: "Community town halls" },
            { value: "call_in", label: "Call-in or viewer-question programs" },
            { value: "history", label: "Local history series" },
            { value: "outdoor", label: "Outdoor and nature series" },
            { value: "arts", label: "Arts and performance programs" },
            { value: "schools", label: "Programs produced with local schools" },
            { value: "students", label: "Programs produced by NMU students" },
            { value: "profiles", label: "Profiles of interesting regional people" },
            { value: "events", label: "Coverage of festivals and community events" },
            { value: "short_online", label: "Short online-only videos" },
            { value: "podcasts", label: "Podcasts" }
          ]
        },
        {
          id: "preferred_length",
          type: "radio",
          label: "What length do you generally prefer for locally produced programs?",
          options: [
            { value: "under_10", label: "Less than 10 minutes" },
            { value: "10_20", label: "10–20 minutes" },
            { value: "30", label: "About 30 minutes" },
            { value: "60", label: "About 60 minutes" },
            { value: "over_60", label: "Longer than one hour" },
            { value: "depends", label: "It depends on the subject" },
            { value: "none", label: "No preference" }
          ]
        },
        {
          id: "valued_programs",
          type: "textarea",
          label: "Which current or past WNMU-TV or PBS programs do you especially value or remember?"
        },
        {
          id: "missing_subject",
          type: "textarea",
          label: "What subject should WNMU-TV cover that it currently does not cover—or does not cover often enough?"
        },
        {
          id: "one_program_change",
          type: "textarea",
          label: "What one programming change would make you more likely to watch?"
        }
      ]
    },

    {
      id: "children",
      shortTitle: "Children",
      eyebrow: "PBS KIDS and education",
      title: "Children, families, and classroom use",
      intro: "Tell us how children’s public-media programming is used in your household, classroom, library, or childcare setting.",
      when: { childrenRoleIn: ["household", "educator", "both"] },
      questions: [
        {
          id: "child_ages",
          type: "checkbox",
          label: "Which age groups do you select or recommend programming for?",
          options: [
            { value: "under_2", label: "Under age 2" },
            { value: "2_5", label: "Ages 2–5" },
            { value: "6_8", label: "Ages 6–8" },
            { value: "9_11", label: "Ages 9–11" },
            { value: "12_17", label: "Ages 12–17" }
          ]
        },
        {
          id: "kids_use",
          type: "checkbox",
          label: "How is PBS KIDS or other children's public-media content used?",
          options: [
            { value: "broadcast", label: "Scheduled television broadcast" },
            { value: "kids_app", label: "PBS KIDS app" },
            { value: "pbs_app", label: "PBS app or website" },
            { value: "youtube", label: "YouTube" },
            { value: "classroom", label: "Classroom, library, or childcare setting" },
            { value: "not_used", label: "It is not currently used" }
          ]
        },
        {
          id: "kids_value",
          type: "scale",
          scale: "importance",
          label: "How valuable is trusted, noncommercial children's programming to the children you serve?"
        },
        {
          id: "kids_times",
          type: "checkbox",
          max: 3,
          label: "When is children's programming most useful? Select up to three.",
          options: [
            { value: "weekday_early", label: "Weekday early mornings" },
            { value: "weekday_day", label: "Weekday daytime" },
            { value: "weekday_after", label: "After school" },
            { value: "weekday_evening", label: "Weekday evenings" },
            { value: "weekend_morning", label: "Weekend mornings" },
            { value: "weekend_day", label: "Weekend afternoons" },
            { value: "on_demand", label: "On demand whenever needed" }
          ]
        },
        {
          id: "kids_needs",
          type: "textarea",
          label: "What children's, family, classroom, or educator resources should WNMU-TV provide more of?"
        }
      ]
    },

    {
      id: "communication",
      shortTitle: "Community",
      eyebrow: "Finding and supporting the station",
      title: "Communication and community connection",
      intro: "Tell us how you currently learn about programs and how WNMU-TV could communicate with you more effectively.",
      questions: [
        {
          id: "learn_currently",
          type: "checkbox",
          label: "How do you currently learn what is airing or available from WNMU-TV?",
          exclusiveValues: ["dont_know"],
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
            { value: "friends", label: "Friends, family, or community organizations" },
            { value: "search", label: "Online search" },
            { value: "dont_know", label: "I generally do not know what is airing" }
          ]
        },
        {
          id: "learn_preferred",
          type: "checkbox",
          max: 3,
          label: "How would you prefer to learn about WNMU-TV programming? Select up to three.",
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
          id: "station_connection",
          type: "radio",
          label: "How connected do you currently feel to WNMU-TV as your local public television station?",
          options: [
            { value: "not", label: "Not at all connected" },
            { value: "slightly", label: "Slightly connected" },
            { value: "somewhat", label: "Somewhat connected" },
            { value: "very", label: "Very connected" },
            { value: "strongly", label: "Strongly connected" },
            { value: "not_local_before", label: "I did not previously think of it as my local station" }
          ]
        },
        {
          id: "connection_activities",
          type: "checkbox",
          label: "Which activities would help you feel more connected to WNMU-TV?",
          options: [
            { value: "more_area", label: "More programs from my part of the region" },
            { value: "suggestions", label: "More opportunities to suggest program topics" },
            { value: "polls", label: "Viewer polls and questionnaires" },
            { value: "tours", label: "Public station tours" },
            { value: "screenings", label: "Community screenings" },
            { value: "town_halls", label: "Town halls and public discussions" },
            { value: "events", label: "Live events" },
            { value: "partnerships", label: "School and library partnerships" },
            { value: "community_presence", label: "Greater visibility at community events" },
            { value: "selection_transparency", label: "More explanation of how programs are selected" },
            { value: "behind_scenes", label: "Behind-the-scenes content" },
            { value: "meet_people", label: "Opportunities to meet hosts and producers" },
            { value: "none", label: "None of these" }
          ]
        },
        {
          id: "recommend",
          type: "radio",
          when: { viewerStatusNotIn: ["never"] },
          label: "How likely are you to recommend WNMU-TV programming to someone else?",
          options: [
            { value: "very_unlikely", label: "Very unlikely" },
            { value: "unlikely", label: "Unlikely" },
            { value: "neutral", label: "Neither likely nor unlikely" },
            { value: "likely", label: "Likely" },
            { value: "very_likely", label: "Very likely" },
            { value: "not_familiar", label: "Not familiar enough to answer" }
          ]
        },
        {
          id: "financial_support",
          type: "radio",
          label: "Do you currently financially support WNMU-TV?",
          options: [
            { value: "monthly", label: "Yes, as an ongoing monthly donor" },
            { value: "periodic", label: "Yes, I donate periodically" },
            { value: "past", label: "I have donated in the past" },
            { value: "might", label: "No, but I might consider it" },
            { value: "no", label: "No" },
            { value: "prefer_not", label: "Prefer not to answer" }
          ]
        },
        {
          id: "support_factors",
          type: "checkbox",
          when: { answerNotIn: { id: "financial_support", values: ["monthly", "periodic", "prefer_not"] } },
          label: "Which factors would make you more likely to support WNMU-TV financially?",
          options: [
            { value: "local", label: "More local programming" },
            { value: "docs", label: "More regional documentaries" },
            { value: "kids", label: "More children's and educational programming" },
            { value: "online", label: "More online access" },
            { value: "impact", label: "Clearer information about what donations support" },
            { value: "transparency", label: "Greater transparency about station priorities" },
            { value: "passport", label: "Passport access" },
            { value: "topic", label: "A particular program or subject area" },
            { value: "matching", label: "Matching-gift opportunities" },
            { value: "events", label: "Community events" },
            { value: "easy", label: "Easier donation options" },
            { value: "nothing", label: "Nothing would make me more likely" }
          ]
        }
      ]
    },

    {
      id: "demographics",
      shortTitle: "About you",
      eyebrow: "About your household",
      title: "A little about you and your household",
      intro: "These questions are optional and help WNMU-TV understand whether needs differ across communities and households.",
      questions: [
        {
          id: "county_region",
          type: "select",
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
          id: "zip_code",
          type: "text",
          label: "ZIP or postal code",
          optionalLabel: true,
          help: "Useful for identifying reception and access patterns. Leave blank if you prefer."
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
            { value: "unsure", label: "Not sure" },
            { value: "prefer_not", label: "Prefer not to answer" }
          ]
        },
        {
          id: "age_range",
          type: "select",
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
          id: "gender",
          type: "radio",
          label: "How do you describe your gender?",
          optionalLabel: true,
          options: [
            { value: "woman", label: "Woman" },
            { value: "man", label: "Man" },
            { value: "nonbinary", label: "Nonbinary" },
            { value: "self", label: "Prefer to self-describe" },
            { value: "prefer_not", label: "Prefer not to answer" }
          ]
        },
        {
          id: "household_size",
          type: "select",
          label: "How many people live in your household?",
          optionalLabel: true,
          options: [
            { value: "1", label: "One" },
            { value: "2", label: "Two" },
            { value: "3", label: "Three" },
            { value: "4", label: "Four" },
            { value: "5_plus", label: "Five or more" },
            { value: "prefer_not", label: "Prefer not to answer" }
          ]
        },
        {
          id: "education_level",
          type: "select",
          label: "Highest level of education completed",
          optionalLabel: true,
          options: [
            { value: "some_high", label: "Some high school" },
            { value: "high", label: "High school diploma or equivalent" },
            { value: "some_college", label: "Some college or technical training" },
            { value: "associate", label: "Associate degree" },
            { value: "bachelor", label: "Bachelor's degree" },
            { value: "graduate", label: "Graduate or professional degree" },
            { value: "prefer_not", label: "Prefer not to answer" }
          ]
        },
        {
          id: "employment",
          type: "checkbox",
          label: "Which describe your current employment status?",
          optionalLabel: true,
          options: [
            { value: "full", label: "Employed full time" },
            { value: "part", label: "Employed part time" },
            { value: "self", label: "Self-employed" },
            { value: "seasonal", label: "Seasonal employment" },
            { value: "student", label: "Student" },
            { value: "retired", label: "Retired" },
            { value: "not_employed", label: "Not currently employed" },
            { value: "caregiver", label: "Full-time caregiver" },
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
            { value: "unsure", label: "Not sure" },
            { value: "prefer_not", label: "Prefer not to answer" }
          ]
        },
        {
          id: "household_income",
          type: "select",
          label: "Annual household income range",
          optionalLabel: true,
          options: [
            { value: "under_25", label: "Under $25,000" },
            { value: "25_49", label: "$25,000–$49,999" },
            { value: "50_74", label: "$50,000–$74,999" },
            { value: "75_99", label: "$75,000–$99,999" },
            { value: "100_149", label: "$100,000–$149,999" },
            { value: "150_plus", label: "$150,000 or more" },
            { value: "prefer_not", label: "Prefer not to answer" }
          ]
        },
        {
          id: "context_note",
          type: "textarea",
          label: "Is there anything about your household, community, or viewing situation that would help WNMU-TV understand your answers?",
          optionalLabel: true
        },
        {
          id: "final_comment",
          type: "textarea",
          label: "Is there anything else you would like WNMU-TV to know?",
          optionalLabel: true
        }
      ]
    }
  ],

  gapPairs: {
    importanceQuestion: "importance_roles",
    performanceQuestion: "performance_roles"
  }
};
