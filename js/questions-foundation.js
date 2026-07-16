(function () {
  "use strict";
  if (!window.WNMU_CONFIG) throw new Error("WNMU configuration must load before questionnaire definitions.");
  window.WNMU_QUESTIONNAIRE_PARTS = {
    scales: {
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
    stages: []
  };
})();

(function () {
  "use strict";
  const parts = window.WNMU_QUESTIONNAIRE_PARTS;
  if (!parts) throw new Error("WNMU questionnaire data must load before stage definitions.");
  parts.stages.push({
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
});
})();
