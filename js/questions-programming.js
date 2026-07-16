(function () {
  "use strict";
  const parts = window.WNMU_QUESTIONNAIRE_PARTS;
  if (!parts) throw new Error("WNMU questionnaire data must load before stage definitions.");
  parts.stages.push({
  "id": "what_watch",
  "number": 3,
  "title": "What You Watch",
  "shortTitle": "What You Watch",
  "intro": "Tell us what you watch and the kinds of programming that interest you.",
  "pages": [
    {
      "id": "watching_habits",
      "title": "Your viewing habits",
      "questions": [
        {
          "id": "channels_watched",
          "type": "checkbox",
          "when": {
            "viewerStatusNotIn": [
              "never"
            ]
          },
          "label": "Which WNMU-TV channels do you watch, even occasionally?",
          "exclusiveValues": [
            "none",
            "not_sure"
          ],
          "options": [
            {
              "value": "wnmu_13_1",
              "label": "WNMU-TV (13.1)"
            },
            {
              "value": "pbs_kids_13_2",
              "label": "PBS KIDS 24/7 (13.2)"
            },
            {
              "value": "wnmu_plus_13_3",
              "label": "WNMU-TV Plus (13.3)"
            },
            {
              "value": "mlc_13_4",
              "label": "Michigan Learning Channel (13.4)"
            },
            {
              "value": "none",
              "label": "I do not watch any of these channels"
            },
            {
              "value": "not_sure",
              "label": "I am not sure which channel I watch"
            }
          ]
        },
        {
          "id": "watch_preference",
          "type": "radio",
          "label": "When you find a program that interests you, how do you generally prefer to watch it?",
          "options": [
            {
              "value": "scheduled",
              "label": "At the scheduled broadcast time"
            },
            {
              "value": "recorded",
              "label": "Recorded and watched later"
            },
            {
              "value": "on_demand",
              "label": "Streamed on demand"
            },
            {
              "value": "livestream",
              "label": "Through a livestream"
            },
            {
              "value": "short_clips",
              "label": "As short clips or highlights"
            },
            {
              "value": "depends",
              "label": "It depends on the program"
            },
            {
              "value": "none",
              "label": "No strong preference"
            }
          ]
        }
      ]
    },
    {
      "id": "watching_interests",
      "title": "Programming you watch or value",
      "questions": [
        {
          "id": "program_category_interest",
          "type": "matrix",
          "scale": "interest",
          "label": "How interested are you in watching each type of programming?",
          "rows": [
            {
              "id": "history_biography",
              "label": "History and biography"
            },
            {
              "id": "environment_nature",
              "label": "Environment, nature, and wildlife"
            },
            {
              "id": "outdoor_recreation",
              "label": "Outdoor recreation"
            },
            {
              "id": "regional_documentaries",
              "label": "Upper Peninsula and regional documentaries"
            },
            {
              "id": "local_news_public_affairs",
              "label": "Local news and public affairs"
            },
            {
              "id": "health_wellness",
              "label": "Health and wellness"
            },
            {
              "id": "home_garden",
              "label": "Home and garden"
            },
            {
              "id": "arts_performance",
              "label": "Arts, music, and performance"
            },
            {
              "id": "children_education",
              "label": "Children's programming and education"
            },
            {
              "id": "science_technology",
              "label": "Science and technology"
            },
            {
              "id": "national_pbs_documentaries",
              "label": "National PBS documentaries"
            },
            {
              "id": "national_international_news",
              "label": "National and international news"
            },
            {
              "id": "drama_mysteries",
              "label": "Drama and mysteries"
            },
            {
              "id": "food_cooking",
              "label": "Food and cooking"
            },
            {
              "id": "regional_travel",
              "label": "Regional travel and exploration"
            },
            {
              "id": "world_travel",
              "label": "U.S. and world travel"
            },
            {
              "id": "independent_film",
              "label": "Independent film"
            }
          ]
        },
        {
          "id": "valued_programs",
          "type": "textarea",
          "label": "Which current or past programs you have watched on WNMU-TV or PBS have been especially valuable or memorable to you?",
          "optionalLabel": true
        },
        {
          "id": "kids_use",
          "type": "checkbox",
          "when": {
            "childrenRoleIn": [
              "household",
              "educator",
              "both"
            ]
          },
          "label": "How is PBS KIDS or other children's public-media content used?",
          "exclusiveValues": [
            "not_used"
          ],
          "options": [
            {
              "value": "broadcast",
              "label": "Scheduled television broadcast"
            },
            {
              "value": "pbs_kids_app",
              "label": "PBS KIDS app"
            },
            {
              "value": "pbs_app_web",
              "label": "PBS App or PBS.org"
            },
            {
              "value": "youtube",
              "label": "YouTube"
            },
            {
              "value": "classroom",
              "label": "Classroom, library, or childcare setting"
            },
            {
              "value": "not_used",
              "label": "It is not currently used"
            }
          ]
        }
      ]
    }
  ]
});
})();

(function () {
  "use strict";
  const parts = window.WNMU_QUESTIONNAIRE_PARTS;
  if (!parts) throw new Error("WNMU questionnaire data must load before stage definitions.");
  parts.stages.push({
  "id": "what_want",
  "number": 4,
  "title": "What You Want",
  "shortTitle": "What You Want",
  "intro": "Choose the programming, local formats, access improvements, and communication methods that matter most to you.",
  "pages": [
    {
      "id": "future_priorities",
      "title": "Programming priorities",
      "questions": [
        {
          "id": "program_category_priorities",
          "type": "checkbox",
          "max": 5,
          "label": "Which five programming categories should receive the greatest attention from WNMU-TV?",
          "optionsFromMatrix": "program_category_interest"
        },
        {
          "id": "local_formats",
          "type": "checkbox",
          "max": 3,
          "label": "Which local or regional program formats would you be most likely to watch? Choose up to three.",
          "options": [
            {
              "value": "documentaries",
              "label": "Documentaries and local history series"
            },
            {
              "value": "news_magazine",
              "label": "Weekly local news or public-affairs magazine"
            },
            {
              "value": "interviews",
              "label": "Interviews and profiles of regional people"
            },
            {
              "value": "roundtables",
              "label": "Roundtables, forums, and town halls"
            },
            {
              "value": "outdoor",
              "label": "Outdoor, nature, and Great Lakes series"
            },
            {
              "value": "arts",
              "label": "Arts and performance programs"
            },
            {
              "value": "events",
              "label": "Community events and student productions"
            },
            {
              "value": "short_online",
              "label": "Short online videos or podcasts"
            }
          ]
        }
      ]
    },
    {
      "id": "future_access",
      "title": "Access and communication",
      "questions": [
        {
          "id": "online_improvements",
          "type": "checkbox",
          "max": 3,
          "label": "What would make you more likely to use WNMU-TV online? Choose up to three.",
          "options": [
            {
              "value": "clear_how_where",
              "label": "A clearer explanation of how and where to watch"
            },
            {
              "value": "local_access",
              "label": "Easier access to WNMU-TV local programs"
            },
            {
              "value": "search",
              "label": "Better search and browsing"
            },
            {
              "value": "notifications",
              "label": "Notifications when programs I might like are available"
            },
            {
              "value": "help",
              "label": "Help setting up or using the PBS App"
            },
            {
              "value": "passport_clear",
              "label": "Clearer information about PBS Passport"
            },
            {
              "value": "nothing",
              "label": "Nothing would make me more likely"
            }
          ],
          "exclusiveValues": [
            "nothing"
          ]
        },
        {
          "id": "learn_preferred",
          "type": "checkbox",
          "max": 3,
          "label": "How would you prefer to learn about WNMU-TV programming? Choose up to three.",
          "options": [
            {
              "value": "on_air",
              "label": "On-air announcements"
            },
            {
              "value": "tv_guide",
              "label": "Television program guide"
            },
            {
              "value": "printed",
              "label": "Printed program guide"
            },
            {
              "value": "web",
              "label": "WNMU-TV or PBS website"
            },
            {
              "value": "pbs_app",
              "label": "PBS App"
            },
            {
              "value": "email",
              "label": "Email newsletter"
            },
            {
              "value": "facebook",
              "label": "Facebook"
            },
            {
              "value": "instagram",
              "label": "Instagram"
            },
            {
              "value": "youtube",
              "label": "YouTube"
            },
            {
              "value": "radio",
              "label": "Radio"
            },
            {
              "value": "text_push",
              "label": "Text or app notifications"
            }
          ]
        },
        {
          "id": "kids_needs",
          "type": "textarea",
          "when": {
            "childrenRoleIn": [
              "household",
              "educator",
              "both"
            ]
          },
          "label": "What children's, family, classroom, or educator resources should WNMU-TV provide more of?",
          "optionalLabel": true
        }
      ]
    }
  ]
});
})();
