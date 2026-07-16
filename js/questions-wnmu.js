(function () {
  "use strict";
  const parts = window.WNMU_QUESTIONNAIRE_PARTS;
  if (!parts) throw new Error("WNMU questionnaire data must load before stage definitions.");
  parts.stages.push({
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
              "value": "pbs_app_web",
              "label": "PBS App or PBS.org"
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
              "value": "pbs_app_web",
              "label": "PBS.org or the PBS App"
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
});
})();
