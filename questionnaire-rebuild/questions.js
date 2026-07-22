(function () {
  "use strict";

  // Canonical questionnaire content for the standalone rebuild.
  // IDs, labels, stored values, routing, and scale meanings match schema v6.
  window.WNMU_REBUILD_SURVEY = {
  "scales": {
    "importance": [
      {
        "value": 1,
        "label": "Not important",
        "shortLabel": "1"
      },
      {
        "value": 2,
        "label": "Slightly important",
        "shortLabel": "2"
      },
      {
        "value": 3,
        "label": "Moderately important",
        "shortLabel": "3"
      },
      {
        "value": 4,
        "label": "Very important",
        "shortLabel": "4"
      },
      {
        "value": 5,
        "label": "Essential",
        "shortLabel": "5"
      },
      {
        "value": "na",
        "label": "Not sure",
        "shortLabel": "Not sure"
      }
    ],
    "performance": [
      {
        "value": 1,
        "label": "Poor",
        "shortLabel": "1"
      },
      {
        "value": 2,
        "label": "Weak",
        "shortLabel": "2"
      },
      {
        "value": 3,
        "label": "Adequate",
        "shortLabel": "3"
      },
      {
        "value": 4,
        "label": "Good",
        "shortLabel": "4"
      },
      {
        "value": 5,
        "label": "Excellent",
        "shortLabel": "5"
      },
      {
        "value": "na",
        "label": "Not familiar enough to rate",
        "shortLabel": "Not familiar"
      }
    ],
    "interest": [
      {
        "value": 1,
        "label": "Not interested"
      },
      {
        "value": 2,
        "label": "Slightly interested"
      },
      {
        "value": 3,
        "label": "Moderately interested"
      },
      {
        "value": 4,
        "label": "Very interested"
      },
      {
        "value": 5,
        "label": "Extremely interested"
      },
      {
        "value": "na",
        "label": "Not sure"
      }
    ]
  },
  "stages": [
    {
      "id": "about_you",
      "number": 1,
      "title": "About You",
      "shortTitle": "About You",
      "intro": "A few optional details help us understand whether needs differ across communities and households.",
      "pages": [
        {
          "id": "about_profile",
          "title": "Your community and household",
          "questions": [
            {
              "id": "county_region",
              "type": "select",
              "inlineControl": true,
              "label": "What county or area do you live in?",
              "optionalLabel": true,
              "options": [
                {
                  "value": "alger",
                  "label": "Alger County"
                },
                {
                  "value": "baraga",
                  "label": "Baraga County"
                },
                {
                  "value": "chippewa",
                  "label": "Chippewa County"
                },
                {
                  "value": "delta",
                  "label": "Delta County"
                },
                {
                  "value": "dickinson",
                  "label": "Dickinson County"
                },
                {
                  "value": "gogebic",
                  "label": "Gogebic County"
                },
                {
                  "value": "houghton",
                  "label": "Houghton County"
                },
                {
                  "value": "iron",
                  "label": "Iron County"
                },
                {
                  "value": "keweenaw",
                  "label": "Keweenaw County"
                },
                {
                  "value": "luce",
                  "label": "Luce County"
                },
                {
                  "value": "mackinac",
                  "label": "Mackinac County"
                },
                {
                  "value": "marquette",
                  "label": "Marquette County"
                },
                {
                  "value": "menominee",
                  "label": "Menominee County"
                },
                {
                  "value": "ontonagon",
                  "label": "Ontonagon County"
                },
                {
                  "value": "schoolcraft",
                  "label": "Schoolcraft County"
                },
                {
                  "value": "northern_wi",
                  "label": "Northern Wisconsin"
                },
                {
                  "value": "other_mi",
                  "label": "Another Michigan county"
                },
                {
                  "value": "other_state",
                  "label": "Another state"
                },
                {
                  "value": "canada",
                  "label": "Canada"
                },
                {
                  "value": "prefer_not",
                  "label": "Prefer not to answer"
                }
              ]
            },
            {
              "id": "community_type",
              "type": "radio",
              "layout": "compact",
              "label": "Which best describes where you live?",
              "optionalLabel": true,
              "options": [
                {
                  "value": "city",
                  "label": "City"
                },
                {
                  "value": "town",
                  "label": "Town"
                },
                {
                  "value": "rural",
                  "label": "Rural"
                },
                {
                  "value": "prefer_not",
                  "label": "Prefer not to answer"
                }
              ]
            },
            {
              "id": "age_range",
              "type": "radio",
              "layout": "compact",
              "label": "Age range",
              "optionalLabel": true,
              "options": [
                {
                  "value": "under_18",
                  "label": "Under 18"
                },
                {
                  "value": "18_24",
                  "label": "18–24"
                },
                {
                  "value": "25_34",
                  "label": "25–34"
                },
                {
                  "value": "35_44",
                  "label": "35–44"
                },
                {
                  "value": "45_54",
                  "label": "45–54"
                },
                {
                  "value": "55_64",
                  "label": "55–64"
                },
                {
                  "value": "65_74",
                  "label": "65–74"
                },
                {
                  "value": "75_84",
                  "label": "75–84"
                },
                {
                  "value": "85_plus",
                  "label": "85 or older"
                },
                {
                  "value": "prefer_not",
                  "label": "Prefer not to answer"
                }
              ]
            },
            {
              "id": "internet_streaming_quality",
              "type": "radio",
              "label": "How well does your home internet support streaming WNMU-TV, PBS, or other video?",
              "optionalLabel": true,
              "options": [
                {
                  "value": "works_well",
                  "label": "Works well for streaming video"
                },
                {
                  "value": "adequate",
                  "label": "Adequate for streaming, with occasional buffering or interruptions"
                },
                {
                  "value": "slow",
                  "label": "Often too slow for comfortable streaming"
                },
                {
                  "value": "unreliable",
                  "label": "Unreliable for streaming or frequently unavailable"
                },
                {
                  "value": "none",
                  "label": "No home internet service"
                },
                {
                  "value": "not_tried",
                  "label": "I have not tried streaming video at home"
                },
                {
                  "value": "prefer_not",
                  "label": "Prefer not to answer"
                }
              ]
            },
            {
              "id": "children_role",
              "store": "profile",
              "type": "radio",
              "required": true,
              "label": "Do you select or recommend programming for children?",
              "options": [
                {
                  "value": "household",
                  "label": "Yes, for children in my household or family"
                },
                {
                  "value": "educator",
                  "label": "Yes, as an educator, librarian, or childcare provider"
                },
                {
                  "value": "both",
                  "label": "Both"
                },
                {
                  "value": "neither",
                  "label": "I do not select or recommend programming for children"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "wnmu_you",
      "number": 2,
      "title": "WNMU & You",
      "shortTitle": "WNMU & You",
      "intro": "Tell us what you knew about WNMU-TV and how you watch or receive its programming.",
      "pages": [
        {
          "id": "wnmu_relationship",
          "title": "Your relationship with WNMU-TV",
          "questions": [
            {
              "id": "station_awareness",
              "type": "radio",
              "label": "Before today, which best describes what you knew about WNMU-TV?",
              "options": [
                {
                  "value": "local_pbs",
                  "label": "I knew WNMU-TV was my local PBS station"
                },
                {
                  "value": "station_not_pbs",
                  "label": "I knew it was a television station, but not that it was the local PBS station"
                },
                {
                  "value": "name_only",
                  "label": "I recognized the name but was not sure what it was"
                },
                {
                  "value": "not_heard",
                  "label": "I had not heard of WNMU-TV"
                }
              ]
            },
            {
              "id": "viewer_status",
              "store": "profile",
              "type": "radio",
              "required": true,
              "label": "During the past 12 months, how often have you knowingly watched WNMU-TV or WNMU-TV programming?",
              "options": [
                {
                  "value": "regular",
                  "label": "Daily or several times a week"
                },
                {
                  "value": "occasional",
                  "label": "Several times a month or about weekly"
                },
                {
                  "value": "once_twice",
                  "label": "Once or twice"
                },
                {
                  "value": "former",
                  "label": "Not in the past year, but I watched in the past"
                },
                {
                  "value": "never",
                  "label": "I have never knowingly watched WNMU-TV"
                },
                {
                  "value": "unsure",
                  "label": "I may have watched, but I am not sure it came from WNMU-TV"
                }
              ]
            }
          ]
        },
        {
          "id": "wnmu_access",
          "title": "Access, channels, and online services",
          "questions": [
            {
              "id": "viewing_methods",
              "store": "profile",
              "type": "checkbox",
              "required": true,
              "label": "How have you watched WNMU-TV or PBS programming during the past 12 months?",
              "help": "Select every method that applies.",
              "exclusiveValues": [
                "not_watched"
              ],
              "options": [
                {
                  "value": "antenna",
                  "label": "Over the air with an antenna"
                },
                {
                  "value": "cable_satellite",
                  "label": "Cable or satellite television"
                },
                {
                  "value": "wnmu_livestream",
                  "label": "WNMU-TV livestream"
                },
                {
                  "value": "pbs_app",
                  "label": "PBS App"
                },
                {
                  "value": "pbs_org",
                  "label": "PBS.org website"
                },
                {
                  "value": "pbs_passport",
                  "label": "PBS Passport through WNMU-TV"
                },
                {
                  "value": "youtube_tv",
                  "label": "YouTube TV"
                },
                {
                  "value": "youtube",
                  "label": "YouTube"
                },
                {
                  "value": "not_watched",
                  "label": "I have not watched WNMU-TV or PBS programming during the past 12 months"
                }
              ]
            },
            {
              "id": "channel_awareness",
              "type": "checkbox",
              "label": "WNMU-TV broadcasts four channels. Before this questionnaire, which were you aware of?",
              "exclusiveValues": [
                "none"
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
                  "label": "I was not aware of any of them"
                }
              ]
            },
            {
              "id": "channels_received",
              "type": "checkbox",
              "when": {
                "hasAnyMethod": [
                  "antenna",
                  "cable_satellite",
                  "youtube_tv"
                ]
              },
              "label": "Which of the four WNMU-TV channels are you able to receive?",
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
                  "label": "None of them"
                },
                {
                  "value": "not_sure",
                  "label": "I am not sure"
                }
              ]
            },
            {
              "id": "online_awareness",
              "type": "checkbox",
              "label": "Before today, which WNMU-TV or PBS online services were you aware of?",
              "exclusiveValues": [
                "none"
              ],
              "options": [
                {
                  "value": "wnmu_site",
                  "label": "WNMU-TV website"
                },
                {
                  "value": "wnmu_livestream",
                  "label": "WNMU-TV livestream"
                },
                {
                  "value": "pbs_org",
                  "label": "PBS.org website"
                },
                {
                  "value": "pbs_app",
                  "label": "PBS App"
                },
                {
                  "value": "pbs_passport",
                  "label": "PBS Passport through WNMU-TV"
                },
                {
                  "value": "pbs_kids_app",
                  "label": "PBS KIDS app"
                },
                {
                  "value": "youtube",
                  "label": "WNMU-TV or PBS on YouTube"
                },
                {
                  "value": "social",
                  "label": "WNMU-TV social media"
                },
                {
                  "value": "none",
                  "label": "I was not aware of any of these"
                }
              ]
            }
          ]
        }
      ]
    },
    {
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
    },
    {
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
    },
    {
      "id": "how_doing",
      "number": 5,
      "title": "How We're Doing",
      "shortTitle": "How We're Doing",
      "intro": "Rate the station roles that matter to you and, when you can, how well WNMU-TV is doing.",
      "pages": [
        {
          "id": "station_performance",
          "title": "Priorities and performance",
          "questions": [
            {
              "id": "station_role_importance",
              "type": "matrix",
              "scale": "importance",
              "pairWith": "station_role_performance",
              "presentation": "flat_pair",
              "label": "Please rate each WNMU-TV role.",
              "help": "Some programs are produced by WNMU-TV; others are selected from PBS, regional, independent, and other producers.",
              "rows": [
                {
                  "id": "trusted_public_media",
                  "label": "Select and provide trusted national and regional public-television programming"
                },
                {
                  "id": "up_programming",
                  "label": "Provide programs about the Upper Peninsula, whether produced by WNMU-TV or by other producers"
                },
                {
                  "id": "regional_issues",
                  "label": "Cover important regional issues and public affairs"
                },
                {
                  "id": "reflect_region",
                  "label": "Reflect the people, places, communities, and cultures of the region"
                },
                {
                  "id": "children_families",
                  "label": "Provide educational programming for children and families"
                },
                {
                  "id": "science_nature",
                  "label": "Provide science, nature, and environmental programming"
                },
                {
                  "id": "arts_culture",
                  "label": "Provide arts, music, and cultural programming"
                },
                {
                  "id": "online_access",
                  "label": "Make programs easy to find online and on demand"
                },
                {
                  "id": "access_for_all",
                  "label": "Serve people with disabilities or limited and unreliable internet access"
                }
              ]
            },
            {
              "id": "station_role_performance",
              "type": "matrix",
              "scale": "performance",
              "when": {
                "viewerStatusNotIn": [
                  "never",
                  "former"
                ]
              },
              "renderedBy": "station_role_importance",
              "label": "How well is WNMU-TV performing in each area?",
              "rows": [
                {
                  "id": "trusted_public_media",
                  "label": "Select and provide trusted national and regional public-television programming"
                },
                {
                  "id": "up_programming",
                  "label": "Provide programs about the Upper Peninsula, whether produced by WNMU-TV or by other producers"
                },
                {
                  "id": "regional_issues",
                  "label": "Cover important regional issues and public affairs"
                },
                {
                  "id": "reflect_region",
                  "label": "Reflect the people, places, communities, and cultures of the region"
                },
                {
                  "id": "children_families",
                  "label": "Provide educational programming for children and families"
                },
                {
                  "id": "science_nature",
                  "label": "Provide science, nature, and environmental programming"
                },
                {
                  "id": "arts_culture",
                  "label": "Provide arts, music, and cultural programming"
                },
                {
                  "id": "online_access",
                  "label": "Make programs easy to find online and on demand"
                },
                {
                  "id": "access_for_all",
                  "label": "Serve people with disabilities or limited and unreliable internet access"
                }
              ]
            },
            {
              "id": "reflects_me",
              "type": "radio",
              "when": {
                "viewerStatusNotIn": [
                  "never",
                  "former"
                ]
              },
              "label": "How well does WNMU-TV reflect the interests and needs of people like you?",
              "options": [
                {
                  "value": "not_at_all",
                  "label": "Not at all"
                },
                {
                  "value": "little",
                  "label": "A little"
                },
                {
                  "value": "somewhat",
                  "label": "Somewhat"
                },
                {
                  "value": "well",
                  "label": "Well"
                },
                {
                  "value": "very_well",
                  "label": "Very well"
                },
                {
                  "value": "not_familiar",
                  "label": "Not familiar enough to answer"
                }
              ]
            },
            {
              "id": "trust_station",
              "type": "radio",
              "when": {
                "viewerStatusNotIn": [
                  "never",
                  "former"
                ]
              },
              "label": "How much do you trust WNMU-TV as a source of programming and information?",
              "options": [
                {
                  "value": "none",
                  "label": "Not at all"
                },
                {
                  "value": "little",
                  "label": "A little"
                },
                {
                  "value": "some",
                  "label": "Somewhat"
                },
                {
                  "value": "quite",
                  "label": "Quite a bit"
                },
                {
                  "value": "great",
                  "label": "A great deal"
                },
                {
                  "value": "not_familiar",
                  "label": "Not familiar enough to answer"
                }
              ]
            },
            {
              "id": "nonviewer_reasons",
              "type": "checkbox",
              "when": {
                "viewerStatusIn": [
                  "former",
                  "never",
                  "unsure"
                ]
              },
              "label": "Which reasons best explain why you do not watch WNMU-TV more often?",
              "options": [
                {
                  "value": "unaware",
                  "label": "I was not aware of WNMU-TV or what it offers"
                },
                {
                  "value": "channel",
                  "label": "I do not know where to find it"
                },
                {
                  "value": "signal",
                  "label": "I cannot receive a reliable signal"
                },
                {
                  "value": "provider",
                  "label": "It is not available through my provider"
                },
                {
                  "value": "schedule",
                  "label": "The schedule does not fit my viewing habits"
                },
                {
                  "value": "online",
                  "label": "I do not know how to watch online"
                },
                {
                  "value": "content",
                  "label": "The programming has not interested me"
                },
                {
                  "value": "other_services",
                  "label": "Other services already meet my needs"
                },
                {
                  "value": "little_tv",
                  "label": "I watch very little television or long-form video"
                },
                {
                  "value": "past_change",
                  "label": "My habits or household changed"
                },
                {
                  "value": "not_local",
                  "label": "The station does not feel relevant to my community"
                }
              ]
            },
            {
              "id": "nonviewer_return",
              "type": "textarea",
              "when": {
                "viewerStatusIn": [
                  "former",
                  "never",
                  "unsure"
                ]
              },
              "label": "What program, service, or change would make you most likely to try or return to WNMU-TV?",
              "optionalLabel": true
            },
            {
              "id": "final_feedback",
              "type": "textarea",
              "label": "What is WNMU-TV doing well? Where could WNMU-TV improve? What else would you like us to know?",
              "optionalLabel": true
            }
          ]
        }
      ]
    }
  ],
  "gapPairs": {
    "importanceQuestion": "station_role_importance",
    "performanceQuestion": "station_role_performance"
  }
};
})();
