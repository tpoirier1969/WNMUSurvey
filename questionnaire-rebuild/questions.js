(function () {
  "use strict";

  const interestScale = [
    { value: 1, label: "Not interested", shortLabel: "NI" },
    { value: 2, label: "Slightly interested", shortLabel: "SI" },
    { value: 3, label: "Moderately interested", shortLabel: "MI" },
    { value: 4, label: "Very interested", shortLabel: "VI" },
    { value: 5, label: "Extremely interested", shortLabel: "EI" },
    { value: "na", label: "Not sure", shortLabel: "NS" }
  ];
  const importanceScale = [
    { value: 1, label: "Not important", shortLabel: "1" },
    { value: 2, label: "Slightly important", shortLabel: "2" },
    { value: 3, label: "Moderately important", shortLabel: "3" },
    { value: 4, label: "Very important", shortLabel: "4" },
    { value: 5, label: "Essential", shortLabel: "5" },
    { value: "na", label: "Not sure", shortLabel: "Not sure" }
  ];
  const performanceScale = [
    { value: 1, label: "Poor", shortLabel: "1" },
    { value: 2, label: "Weak", shortLabel: "2" },
    { value: 3, label: "Adequate", shortLabel: "3" },
    { value: 4, label: "Good", shortLabel: "4" },
    { value: 5, label: "Excellent", shortLabel: "5" },
    { value: "na", label: "Not familiar enough to rate", shortLabel: "Not familiar" }
  ];
  const categories = [
    ["history_biography", "History and biography"],
    ["environment_nature", "Environment, nature, and wildlife"],
    ["outdoor_recreation", "Outdoor recreation"],
    ["regional_documentaries", "Upper Peninsula and regional documentaries"],
    ["local_news_public_affairs", "Local news and public affairs"],
    ["health_wellness", "Health and wellness"],
    ["home_garden", "Home and garden"],
    ["arts_performance", "Arts, culture, theater, dance, and performance"],
    ["children_education", "Children's programming and education"],
    ["science_technology", "Science and technology"],
    ["national_pbs_documentaries", "National PBS documentaries"],
    ["national_international_news", "National and international news"],
    ["drama_mysteries", "Drama and mysteries"],
    ["food_cooking", "Food and cooking"],
    ["regional_travel", "Regional travel and exploration"],
    ["world_travel", "U.S. and world travel"],
    ["independent_film", "Independent film"]
  ].map(([id, label]) => ({ id, label }));
  const categoryOptions = categories.map(({ id: value, label }) => ({ value, label }));
  const televisionMethods = ["antenna", "cable_satellite", "youtube_tv"];
  const onlineMethods = ["wnmu_livestream", "pbs_app", "pbs_org", "pbs_passport", "youtube"];
  const stationRoles = [
    ["trusted_public_media", "Select and provide trusted national and regional public-television programming"],
    ["up_programming", "Provide programs about the Upper Peninsula, whether produced by WNMU-TV or by other producers"],
    ["regional_issues", "Cover important regional issues and public affairs"],
    ["reflect_region", "Reflect the people, places, communities, and cultures of the region"],
    ["children_families", "Provide educational programming for children and families"],
    ["science_nature", "Provide science, nature, and environmental programming"],
    ["arts_culture", "Provide arts, music, and cultural programming"],
    ["online_access", "Make programs easy to find online and on demand"],
    ["access_for_all", "Serve people with disabilities or limited and unreliable internet access"]
  ].map(([id, label]) => ({ id, label }));

  window.WNMU_REBUILD_SURVEY = {
    scales: { interest: interestScale, importance: importanceScale, performance: performanceScale },
    stages: [
      {
        id: "about_you", number: 1, title: "About You", shortTitle: "About You",
        intro: "A few optional details help us understand whether needs differ across communities and households.",
        pages: [{
          id: "about_profile", title: "Your community and household", questions: [
            { id: "county_region", type: "select", inlineControl: true, optionalLabel: true, label: "What county or area do you live in?", options: [
              ["alger","Alger County"],["baraga","Baraga County"],["chippewa","Chippewa County"],["delta","Delta County"],["dickinson","Dickinson County"],["gogebic","Gogebic County"],["houghton","Houghton County"],["iron","Iron County"],["keweenaw","Keweenaw County"],["luce","Luce County"],["mackinac","Mackinac County"],["marquette","Marquette County"],["menominee","Menominee County"],["ontonagon","Ontonagon County"],["schoolcraft","Schoolcraft County"],["northern_wi","Northern Wisconsin"],["other_mi","Another Michigan county"],["other_state","Another state"],["canada","Canada"],["prefer_not","Prefer not to answer"]
            ].map(([value,label])=>({value,label})) },
            { id: "community_type", type: "radio", layout: "compact", optionalLabel: true, label: "Which best describes where you live?", options: [["city","City"],["town","Town"],["rural","Rural"],["prefer_not","Prefer not to answer"]].map(([value,label])=>({value,label})) },
            { id: "age_range", type: "radio", layout: "compact", optionalLabel: true, label: "Age range", options: [["under_18","Under 18"],["18_24","18–24"],["25_34","25–34"],["35_44","35–44"],["45_54","45–54"],["55_64","55–64"],["65_74","65–74"],["75_84","75–84"],["85_plus","85 or older"],["prefer_not","Prefer not to answer"]].map(([value,label])=>({value,label})) },
            { id: "internet_streaming_quality", type: "radio", optionalLabel: true, label: "How well does your home internet support streaming WNMU-TV, PBS, or other video?", options: [["works_well","Works well for streaming video"],["adequate","Adequate, with occasional buffering or interruptions"],["slow","Often too slow for comfortable streaming"],["unreliable","Unreliable or frequently unavailable"],["none","No home internet service"],["not_tried","I have not tried streaming video at home"],["prefer_not","Prefer not to answer"]].map(([value,label])=>({value,label})) },
            { id: "children_role", store: "profile", type: "radio", required: true, label: "Do you select or recommend programming for children?", options: [["household","Yes, for children in my household or family"],["educator","Yes, as an educator, librarian, or childcare provider"],["both","Both"],["neither","I do not select or recommend programming for children"]].map(([value,label])=>({value,label})) }
          ]
        }]
      },
      {
        id: "wnmu_you", number: 2, title: "WNMU & You", shortTitle: "WNMU & You",
        intro: "Tell us what you knew about WNMU-TV and how you watch or receive its programming.",
        pages: [
          { id: "wnmu_relationship", title: "Your relationship with WNMU-TV", questions: [
            { id: "station_awareness", type: "radio", label: "Before today, which best describes what you knew about WNMU-TV?", options: [["local_pbs","I knew WNMU-TV was my local PBS station"],["station_not_pbs","I knew it was a television station, but not that it was the local PBS station"],["name_only","I recognized the name but was not sure what it was"],["not_heard","I had not heard of WNMU-TV"]].map(([value,label])=>({value,label})) },
            { id: "viewer_status", store: "profile", type: "radio", required: true, label: "During the past 12 months, how often have you knowingly watched WNMU-TV or WNMU-TV programming?", options: [["regular","Daily or several times a week"],["occasional","Several times a month or about weekly"],["once_twice","Once or twice"],["former","Not in the past year, but I watched in the past"],["never","I have never knowingly watched WNMU-TV"],["unsure","I may have watched, but I am not sure it came from WNMU-TV"]].map(([value,label])=>({value,label})) }
          ]},
          { id: "wnmu_access", title: "Access, channels, and online services", questions: [
            { id: "viewing_methods", store: "profile", type: "checkbox", required: true, exclusiveValues: ["not_watched"], label: "How have you watched WNMU-TV or PBS programming during the past 12 months?", help: "Select every method that applies.", options: [["antenna","Over the air with an antenna"],["cable_satellite","Cable or satellite television"],["wnmu_livestream","WNMU-TV livestream"],["pbs_app","PBS App"],["pbs_org","PBS.org website"],["pbs_passport","PBS Passport through WNMU-TV"],["youtube_tv","YouTube TV"],["youtube","YouTube"],["not_watched","I have not watched WNMU-TV or PBS programming during the past 12 months"]].map(([value,label])=>({value,label})) },
            { id: "channel_awareness", type: "checkbox", exclusiveValues: ["none"], label: "WNMU-TV broadcasts four channels. Before this questionnaire, which were you aware of?", options: [["wnmu_13_1","WNMU-TV (13.1)"],["pbs_kids_13_2","PBS KIDS 24/7 (13.2)"],["wnmu_plus_13_3","WNMU-TV Plus (13.3)"],["mlc_13_4","Michigan Learning Channel (13.4)"],["none","I was not aware of any of them"]].map(([value,label])=>({value,label})) },
            { id: "channels_received", type: "checkbox", when: { hasAnyMethod: televisionMethods }, exclusiveValues: ["none","not_sure"], label: "Which of the four WNMU-TV channels are you able to receive?", options: [["wnmu_13_1","WNMU-TV (13.1)"],["pbs_kids_13_2","PBS KIDS 24/7 (13.2)"],["wnmu_plus_13_3","WNMU-TV Plus (13.3)"],["mlc_13_4","Michigan Learning Channel (13.4)"],["none","None of them"],["not_sure","I am not sure"]].map(([value,label])=>({value,label})) },
            { id: "online_awareness", type: "checkbox", exclusiveValues: ["none"], label: "Before today, which WNMU-TV or PBS online services were you aware of?", options: [["wnmu_site","WNMU-TV website"],["wnmu_livestream","WNMU-TV livestream"],["pbs_org","PBS.org website"],["pbs_app","PBS App"],["pbs_passport","PBS Passport through WNMU-TV"],["pbs_kids_app","PBS KIDS app"],["youtube","WNMU-TV or PBS on YouTube"],["social","WNMU-TV social media"],["none","I was not aware of any of these"]].map(([value,label])=>({value,label})) }
          ]}
        ]
      },
      {
        id: "what_watch", number: 3, title: "What You Watch", shortTitle: "What You Watch",
        intro: "Television and online viewing are asked about separately because people may want different programming from each.",
        pages: [
          { id: "watching_habits", title: "Your viewing habits", questions: [
            { id: "channels_watched", type: "checkbox", when: { viewerStatusNotIn: ["never"] }, exclusiveValues: ["none","not_sure"], label: "Which WNMU-TV channels do you watch, even occasionally?", options: [["wnmu_13_1","WNMU-TV (13.1)"],["pbs_kids_13_2","PBS KIDS 24/7 (13.2)"],["wnmu_plus_13_3","WNMU-TV Plus (13.3)"],["mlc_13_4","Michigan Learning Channel (13.4)"],["none","I do not watch any of these channels"],["not_sure","I am not sure which channel I watch"]].map(([value,label])=>({value,label})) },
            { id: "watch_preference", type: "radio", label: "When you find a program that interests you, how do you generally prefer to watch it?", options: [["scheduled","At the scheduled broadcast time"],["recorded","Recorded and watched later"],["on_demand","Streamed on demand"],["livestream","Through a livestream"],["short_clips","As short clips or highlights"],["depends","It depends on the program"],["none","No strong preference"]].map(([value,label])=>({value,label})) },
            { id: "television_categories_watched", type: "checkbox", max: 8, when: { hasAnyMethod: televisionMethods }, label: "During the past 12 months, which types of programming have you watched most often on WNMU-TV television channels? Choose up to eight.", options: categoryOptions },
            { id: "online_categories_watched", type: "checkbox", max: 8, when: { hasAnyMethod: onlineMethods }, label: "During the past 12 months, which types of WNMU-TV or PBS programming have you watched most often online? Choose up to eight.", help: "Include online services where WNMU-TV programming is available, such as the WNMU-TV livestream or website, PBS App, Passport, PBS.org, or YouTube.", options: categoryOptions }
          ]},
          { id: "watching_interests", title: "Programming that interests you", questions: [
            { id: "television_program_interest", type: "matrix", scale: "interest", when: { hasAnyMethod: televisionMethods }, label: "Whether or not you currently watch them, how interested would you be in seeing each type of programming on WNMU-TV television channels?", rows: categories },
            { id: "online_program_interest", type: "matrix", scale: "interest", when: { hasAnyMethod: onlineMethods }, label: "Whether or not you currently watch them, how interested would you be in each type of programming WNMU-TV makes available online?", rows: categories },
            { id: "valued_programs", type: "textarea", optionalLabel: true, label: "Which current or past programs you have watched through WNMU-TV or PBS have been especially valuable or memorable to you?" }
          ]}
        ]
      },
      {
        id: "what_want", number: 4, title: "What You Want", shortTitle: "What You Want",
        intro: "Tell us what WNMU-TV should emphasize on television and online, and how we can make programs easier to find.",
        pages: [
          { id: "future_priorities", title: "Programming priorities", questions: [
            { id: "television_program_priorities", type: "checkbox", max: 5, when: { hasAnyMethod: televisionMethods }, label: "Which five programming categories should receive the greatest attention on WNMU-TV television channels?", optionsFromMatrix: "television_program_interest" },
            { id: "online_program_priorities", type: "checkbox", max: 5, when: { hasAnyMethod: onlineMethods }, label: "Which five programming categories should receive the greatest attention in the programming WNMU-TV makes available online?", optionsFromMatrix: "online_program_interest" },
            { id: "local_formats", type: "checkbox", max: 3, label: "Which local or regional program formats would you be most likely to watch? Choose up to three.", help: "Some formats may be suited mainly to television, mainly to online viewing, or to both.", options: [["documentaries","Full-length regional documentaries for television and online viewing"],["series","Half-hour or hour-long regional series"],["interviews","Interviews and profiles for television or online viewing"],["forums","Forums and public-affairs programs"],["events","Community events and performances"],["online_shorts","Short local videos for online viewing"],["online_archives","Online access to past regional programs"],["podcasts","Regional audio or video podcasts online"]].map(([value,label])=>({value,label})) }
          ]},
          { id: "future_access", title: "Access and communication", questions: [
            { id: "online_improvements", type: "checkbox", max: 3, exclusiveValues: ["not_applicable","nothing"], label: "What could WNMU-TV do to make online viewing more useful or appealing to you? Choose up to three.", options: [["local_easier","Make local WNMU-TV programs easier to find"],["explain_where_how","Explain more clearly where and how to watch online"],["signin_help","Provide clearer sign-in or device-activation instructions"],["livestream_easier","Make the WNMU-TV livestream easier to locate"],["availability_info","Show more clearly which programs are available online"],["more_local_online","Provide more local programs and short videos online"],["viewer_help","Offer help using WNMU-TV's online viewing options"],["accessibility_info","Provide clearer captioning and accessibility information"],["not_applicable","Not applicable — I do not watch online"],["nothing","Nothing additional would make me more likely to watch online"]].map(([value,label])=>({value,label})) },
            { id: "learn_preferred", type: "checkbox", max: 3, label: "How would you prefer to learn about WNMU-TV programming? Choose up to three.", options: [["on_air","On-air announcements"],["tv_guide","Television program guide"],["printed","Printed program guide"],["web","WNMU-TV or PBS website"],["pbs_app","PBS App"],["email","Email newsletter"],["facebook","Facebook"],["instagram","Instagram"],["youtube","YouTube"],["radio","Radio"],["text_push","Text or app notifications"]].map(([value,label])=>({value,label})) },
            { id: "kids_needs", type: "textarea", optionalLabel: true, when: { childrenRoleIn: ["household","educator","both"] }, label: "What children's, family, classroom, or educator resources should WNMU-TV provide more of?" }
          ]}
        ]
      },
      {
        id: "how_doing", number: 5, title: "How We're Doing", shortTitle: "How We're Doing",
        intro: "Rate the station roles that matter to you and, when you can, how well WNMU-TV is doing.",
        pages: [{ id: "station_performance", title: "Priorities and performance", questions: [
          { id: "station_role_importance", type: "matrix", scale: "importance", pairWith: "station_role_performance", presentation: "flat_pair", label: "Please rate how important each WNMU-TV role is.", help: "Some programs are produced by WNMU-TV; others are selected from PBS, regional, independent, and other producers.", rows: stationRoles },
          { id: "station_role_performance", type: "matrix", scale: "performance", when: { viewerStatusNotIn: ["never","former"] }, renderedBy: "station_role_importance", label: "How well is WNMU-TV performing in each area?", rows: stationRoles },
          { id: "reflects_me", type: "radio", when: { viewerStatusNotIn: ["never","former"] }, label: "How well does WNMU-TV reflect the interests and needs of people like you?", options: [["not_at_all","Not at all"],["little","A little"],["somewhat","Somewhat"],["well","Well"],["very_well","Very well"],["not_familiar","Not familiar enough to answer"]].map(([value,label])=>({value,label})) },
          { id: "trust_station", type: "radio", when: { viewerStatusNotIn: ["never","former"] }, label: "How much do you trust WNMU-TV as a source of programming and information?", options: [["none","Not at all"],["little","A little"],["some","Somewhat"],["quite","Quite a bit"],["great","A great deal"],["not_familiar","Not familiar enough to answer"]].map(([value,label])=>({value,label})) },
          { id: "nonviewer_reasons", type: "checkbox", when: { viewerStatusIn: ["once_twice","former","never","unsure"] }, label: "Which reasons best explain why you do not watch WNMU-TV more often?", options: [["unaware","I was not aware of WNMU-TV or what it offers"],["channel","I do not know where to find it"],["signal","I cannot receive a reliable signal"],["provider","It is not available through my provider"],["schedule","The schedule does not fit my viewing habits"],["online","I do not know how to watch online"],["content","The programming has not interested me"],["other_services","Other services already meet my needs"],["little_tv","I watch very little television or long-form video"],["past_change","My habits or household changed"],["not_local","The station does not feel relevant to my community"]].map(([value,label])=>({value,label})) },
          { id: "nonviewer_return", type: "textarea", optionalLabel: true, when: { viewerStatusIn: ["once_twice","former","never","unsure"] }, label: "What program, service, or change would make you more likely to watch WNMU-TV more often?" },
          { id: "final_feedback", type: "textarea", optionalLabel: true, label: "What is WNMU-TV doing well? Where could WNMU-TV improve? What else would you like us to know?" }
        ]}]
      }
    ],
    gapPairs: { importanceQuestion: "station_role_importance", performanceQuestion: "station_role_performance" }
  };
})();
