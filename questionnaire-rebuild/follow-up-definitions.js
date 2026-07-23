(function () {
  "use strict";

  const importance = [
    ["1", "Not important"], ["2", "Slightly important"], ["3", "Moderately important"],
    ["4", "Very important"], ["5", "Essential"], ["not_sure", "Not sure"]
  ].map(([value, label]) => ({ value, label }));

  window.WNMU_FOLLOW_UPS = {
    schemaVersion: "wnmu-viewer-follow-ups-v3",
    modules: [
      {
        id: "local-programming",
        title: "Local and regional programming",
        intro: "Tell us which regional subjects, voices, places, and program ideas matter most.",
        time: "3–5 minutes",
        pages: [
          {
            id: "regional-priorities",
            title: "Regional subjects and voices",
            intro: "Think about the Upper Peninsula, Great Lakes region, Michigan, and nearby communities.",
            questions: [
              {
                id: "regional_program_interest", type: "checkbox", max: 5,
                label: "Which types of local or regional programming would you be most interested in watching? Choose up to five.",
                options: [
                  ["history_heritage", "History and heritage"],
                  ["current_issues", "Current issues and public affairs"],
                  ["indigenous_communities", "Indigenous communities and cultures"],
                  ["environment_great_lakes", "Environment and the Great Lakes"],
                  ["outdoor_recreation", "Outdoor recreation"],
                  ["arts_culture", "Arts, culture, theater, and dance"],
                  ["regional_music_live", "Regional music and live performances, including rock, country, folk, jazz, blues, traditional music, and concerts"],
                  ["food_agriculture", "Food and agriculture"],
                  ["business_workforce", "Business, jobs, and the workforce"],
                  ["health_wellbeing", "Health and wellbeing"],
                  ["schools_youth", "Schools and young people"],
                  ["people_places", "Regional people, places, and communities"],
                  ["travel_tourism", "Travel and tourism"]
                ].map(([value, label]) => ({ value, label }))
              },
              {
                id: "local_voices", type: "checkbox", max: 4,
                label: "Whose voices and experiences should be heard more often? Choose up to four.",
                options: [
                  ["residents", "Residents from across the region"],
                  ["historians", "Historians and local experts"],
                  ["tribal_voices", "Tribal voices"],
                  ["students_youth", "Students and young people"],
                  ["educators", "Educators"],
                  ["artists", "Artists and performers"],
                  ["workers_business", "Workers and business owners"],
                  ["science_conservation", "Scientists and conservation voices"],
                  ["public_officials", "Public officials"],
                  ["health_human_services", "Health and human-service workers"],
                  ["underrepresented_residents", "Residents whose experiences are not often represented"]
                ].map(([value, label]) => ({ value, label }))
              }
            ]
          },
          {
            id: "regional-importance",
            title: "Geographic importance and ideas",
            questions: [
              { id: "up_programming_importance", type: "radio", label: "How important is it for WNMU-TV to provide programming specifically about the Upper Peninsula?", options: importance },
              { id: "great_lakes_programming_importance", type: "radio", label: "How important is it for WNMU-TV to provide programming about the Great Lakes region?", options: importance },
              { id: "michigan_programming_importance", type: "radio", label: "How important is it for WNMU-TV to provide programming about Michigan more broadly?", options: importance },
              { id: "northern_wisconsin_programming_importance", type: "radio", label: "How important is it for WNMU-TV to provide programming about northern Wisconsin and nearby communities?", options: importance },
              { id: "local_program_idea", type: "textarea", label: "What regional story, person, place, organization, performance, or program idea should WNMU-TV consider?" }
            ]
          }
        ]
      },
      {
        id: "programming-ideas",
        title: "Programming interests and ideas",
        intro: "Use your television and online priorities as a starting point, then tell us what would make programs valuable to you.",
        time: "4–6 minutes",
        pages: [
          {
            id: "program-details", title: "Subjects and qualities", context: { type: "core_priorities" }, questions: [
              { id: "specific_program_subjects", type: "textarea", label: "Within the priorities shown above, what subjects, stories, or kinds of programs would you most like WNMU-TV to explore?" },
              { id: "program_characteristics", type: "checkbox", max: 5, label: "What qualities make a program especially valuable to you? Choose up to five.", options: [["practical","Practical or useful"],["investigative","Investigative"],["in_depth","In-depth"],["inspiring","Inspiring"],["entertaining","Entertaining"],["family_friendly","Family-friendly"],["locally_relevant","Locally relevant"],["diverse_voices","Includes a range of voices"],["visual_quality","Strong visual quality"],["calm_reflective","Calm and reflective"]].map(([value,label])=>({value,label})) },
              { id: "program_length_preferences", type: "checkbox", max: 3, exclusiveValues: ["no_preference"], label: "Which program lengths do you prefer? Choose up to three.", options: [["under_10","Under 10 minutes"],["half_hour","About 30 minutes"],["hour","About one hour"],["feature","Feature length"],["series","A multi-part series"],["no_preference","No preference"]].map(([value,label])=>({value,label})) }
            ]
          },
          {
            id: "program-shaping", title: "How WNMU-TV should shape programming", questions: [
              { id: "new_vs_familiar", type: "radio", label: "How should WNMU-TV balance new programs with familiar favorites and older programs?", options: [["mostly_new","Mostly new programs"],["more_new","More new programs than familiar favorites"],["balanced","A balanced mix"],["more_favorites","More familiar favorites and older programs"],["no_preference","No preference"]].map(([value,label])=>({value,label})) },
              { id: "special_programming_interest", type: "checkbox", max: 3, exclusiveValues: ["none"], label: "Which special programming approaches interest you? Choose up to three.", options: [["themed_nights","Themed nights"],["seasonal_series","Seasonal series"],["marathons","Program marathons"],["community_screenings","Community screenings"],["live_events","Live events"],["curated_collections","Curated online collections"],["none","None of these"]].map(([value,label])=>({value,label})) },
              { id: "program_development_ideas", type: "textarea", label: "What additional program idea, subject, format, audience need, or regional opportunity should WNMU-TV consider?" }
            ]
          }
        ]
      },
      {
        id: "online-viewing",
        title: "Online viewing, PBS App, and Passport",
        intro: "Tell us what WNMU-TV can provide, explain, or make easier to find for online viewers.",
        time: "3–5 minutes",
        pages: [
          {
            id: "online-use", title: "How you watch online", questions: [
              { id: "online_primary_service", type: "radio", label: "Which online service do you use most often for WNMU-TV or PBS programming?", options: [["wnmu_site","WNMU-TV website"],["pbs_org","PBS.org"],["pbs_app","PBS App"],["passport","PBS Passport through WNMU-TV"],["pbs_kids","PBS KIDS"],["youtube","YouTube"],["none","I do not watch online"]].map(([value,label])=>({value,label})) },
              { id: "online_frequency", type: "radio", label: "How often do you watch WNMU-TV or PBS programming online?", options: [["daily","Daily"],["weekly","Weekly"],["monthly","Monthly"],["few_times","A few times a year"],["tried_once","I have tried it once"],["never","Never"]].map(([value,label])=>({value,label})) },
              { id: "passport_status", type: "radio", label: "Which best describes your current experience with PBS Passport through WNMU-TV?", options: [["active","I use Passport"],["eligible_not_active","I believe I am eligible but have not activated it"],["not_sure_what","I am not sure what Passport is"],["not_eligible","I am not eligible"],["not_interested","I am not interested"],["prefer_not","Prefer not to answer"]].map(([value,label])=>({value,label})) }
            ]
          },
          {
            id: "online-improvement", title: "What WNMU-TV can do", questions: [
              { id: "wnmu_online_appeal", type: "checkbox", max: 4, exclusiveValues: ["not_applicable","nothing"], label: "What could WNMU-TV do to make online viewing easier or more appealing to you? Choose up to four.", options: [["where_to_start","Explain more clearly where to begin"],["signin_activation","Provide clearer sign-in and activation instructions"],["find_local","Make local WNMU-TV programs easier to find"],["search_guidance","Provide better guidance for finding programs"],["livestream","Make the WNMU-TV livestream easier to locate"],["availability","Explain which programs are available online"],["passport_explanation","Explain Passport more clearly"],["accessibility","Provide clearer captioning and accessibility information"],["local_shorts","Offer more local programs and short videos online"],["not_applicable","Not applicable — I do not watch online"],["nothing","Nothing additional would make me more likely to watch online"]].map(([value,label])=>({value,label})) },
              { id: "online_help_formats", type: "checkbox", max: 3, exclusiveValues: ["none"], label: "What kind of help from WNMU-TV would be most useful? Choose up to three.", options: [["web_steps","Step-by-step instructions on the WNMU-TV website"],["short_video","A short how-to video"],["phone_help","Help by phone"],["printed_guide","A printed guide"],["community_help","In-person help at a community event"],["email_chat","Help by email or online message"],["none","No help needed"]].map(([value,label])=>({value,label})) },
              { id: "online_comments", type: "textarea", label: "What else should WNMU-TV know about making its programming useful and easy to find online?" }
            ]
          }
        ]
      },
      {
        id: "children-education",
        title: "Children's programming and education",
        intro: "Tell us about children's learning needs and the resources WNMU-TV could provide.",
        time: "4–6 minutes",
        eligibility: { coreChildrenRoleIn: ["household", "educator", "both"] },
        pages: [
          {
            id: "children-needs", title: "Children and learning needs", questions: [
              { id: "children_age_groups", type: "checkbox", label: "Which age groups do you select or recommend programming for?", options: [["under_3","Under 3"],["3_5","Ages 3–5"],["6_8","Ages 6–8"],["9_12","Ages 9–12"],["13_17","Ages 13–17"],["mixed","Mixed ages"]].map(([value,label])=>({value,label})) },
              { id: "children_settings", type: "checkbox", when: { coreChildrenRoleIn: ["educator","both"] }, label: "Outside the home, where are children's programs or educational resources used?", options: [["classroom","Classroom"],["library","Library"],["childcare","Childcare setting"],["homeschool","Homeschool setting"],["community","Community program"],["other","Another setting"]].map(([value,label])=>({value,label})) },
              { id: "children_learning_goals", type: "checkbox", max: 4, label: "Which learning goals should WNMU-TV support most strongly? Choose up to four.", options: [["literacy","Literacy"],["stem","Science, technology, engineering, and math"],["social_emotional","Social and emotional learning"],["history_civics","History and civics"],["arts","Arts"],["nature_outdoors","Nature and outdoor learning"],["health","Health"],["careers","Careers"],["world_cultures","World cultures"],["entertainment","Entertainment"]].map(([value,label])=>({value,label})) },
              { id: "children_local_importance", type: "radio", label: "How important is programming that helps children learn about the Upper Peninsula and Great Lakes region?", options: importance }
            ]
          },
          {
            id: "children-resources", title: "Local topics, resources, and access", questions: [
              { id: "children_local_topics", type: "checkbox", max: 4, label: "Which local or regional topics would be most useful for children? Choose up to four.", options: [["nature_great_lakes","Nature and the Great Lakes"],["history_culture","Regional history and culture"],["indigenous","Indigenous communities and cultures"],["science","Regional science"],["careers","Regional careers"],["arts","Regional arts and music"],["outdoor_safety","Outdoor safety"],["community_helpers","Community helpers"]].map(([value,label])=>({value,label})) },
              { id: "educator_resources", type: "checkbox", max: 4, exclusiveValues: ["none"], when: { coreChildrenRoleIn: ["educator","both"] }, label: "Which educational resources would be most useful in your work? Choose up to four.", options: [["lesson_plans","Lesson plans"],["short_clips","Short classroom clips"],["full_programs","Full programs"],["printables","Printable activities"],["standards","Standards-aligned materials"],["professional_development","Professional development"],["event_kits","Event or activity kits"],["none","None of these"]].map(([value,label])=>({value,label})) },
              { id: "children_access_barriers", type: "checkbox", max: 4, exclusiveValues: ["none"], label: "What makes it harder to use children's programming or educational resources? Choose up to four.", options: [["schedule","Program schedules"],["internet","Internet access"],["devices","Device access"],["awareness","Not knowing what is available"],["finding_age","Difficulty finding age-appropriate material"],["accessibility","Accessibility needs"],["classroom_rights","Uncertainty about classroom use"],["none","None of these"]].map(([value,label])=>({value,label})) },
              { id: "children_comments", type: "textarea", label: "What else should WNMU-TV know about the needs of children, families, educators, or learning organizations?" }
            ]
          }
        ]
      },
      {
        id: "communication",
        title: "Communication and finding programs",
        intro: "Tell us when and where program information is useful and how WNMU-TV can keep viewers informed without becoming intrusive.",
        time: "3–5 minutes",
        pages: [
          {
            id: "planning-information", title: "Planning and program information", intro: "Think about both WNMU-TV channels and programs WNMU-TV makes available online.", questions: [
              { id: "planning_horizon", type: "radio", label: "When deciding what to watch, how far ahead do you usually plan?", options: [["same_day","The same day"],["few_days","A few days ahead"],["one_week","About a week ahead"],["month","Several weeks or a month ahead"],["no_planning","I usually do not plan ahead"]].map(([value,label])=>({value,label})) },
              { id: "program_information_needed", type: "checkbox", max: 5, label: "What information helps you decide whether to watch? Choose up to five.", options: [["title_time","Title, date, and time"],["short_description","Short description"],["episode_details","Episode details"],["repeat_times","Repeat times"],["online_availability","Whether it is available online"],["passport_status","Whether Passport is required"],["local_relevance","Why it is locally relevant"],["family_guidance","Family or age guidance"],["accessibility","Captioning or accessibility information"],["event_info","Related event information"]].map(([value,label])=>({value,label})) },
              { id: "schedule_format", type: "checkbox", max: 3, label: "Which schedule formats would be most useful? Choose up to three.", options: [["daily_list","Daily list"],["weekly_grid","Weekly grid"],["searchable_web","Searchable web schedule"],["printable_pdf","Printable PDF"],["weekly_email","Weekly email"],["app_calendar","Schedule in an app"],["calendar_add","Add programs to a personal calendar"]].map(([value,label])=>({value,label})) },
              { id: "message_frequency", type: "radio", label: "How often would you want WNMU-TV to send programming information?", options: [["major_only","Only for major programs or changes"],["weekly","Weekly"],["several_week","Several times a week"],["daily","Daily"],["topic_choice","Only for topics I choose"],["none","I do not want messages"]].map(([value,label])=>({value,label})) }
            ]
          },
          {
            id: "reminders-reaching", title: "Reminders and reaching viewers", questions: [
              { id: "reminder_preferences", type: "checkbox", max: 3, exclusiveValues: ["none"], label: "Which reminder methods would you consider using? Choose up to three.", options: [["email","Email"],["text","Text message"],["app_push","App notification"],["social","Social media"],["calendar","Personal calendar reminder"],["none","None"]].map(([value,label])=>({value,label})) },
              { id: "social_content_interest", type: "checkbox", max: 4, exclusiveValues: ["none"], label: "What kinds of WNMU-TV posts or messages would be useful? Choose up to four.", options: [["previews","Program previews"],["behind_scenes","Behind-the-scenes material"],["local_stories","Local stories"],["clips","Short clips"],["staff_picks","Staff recommendations"],["schedule_changes","Schedule changes"],["community_events","Community events"],["station_support","Ways to support WNMU-TV"],["none","None"]].map(([value,label])=>({value,label})) },
              { id: "communication_barriers", type: "checkbox", max: 4, exclusiveValues: ["none"], label: "What makes it difficult to know what WNMU-TV is offering? Choose up to four.", options: [["where_to_look","I do not know where to look"],["too_many_places","Information is spread across too many places"],["too_late","I learn about programs too late"],["not_enough_detail","There is not enough detail"],["schedule_hard","The schedule is difficult to use"],["does_not_reach","WNMU-TV information does not reach me"],["too_promotional","Messages feel too promotional"],["none","None of these"]].map(([value,label])=>({value,label})) },
              { id: "communication_comments", type: "textarea", label: "What is the best way for WNMU-TV to keep you informed without becoming intrusive?" }
            ]
          }
        ]
      }
    ]
  };
})();
