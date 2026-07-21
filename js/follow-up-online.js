(function () {
  "use strict";
  window.WNMU_FOLLOW_UP_MODULES = window.WNMU_FOLLOW_UP_MODULES || [];
  window.WNMU_FOLLOW_UP_MODULES.push({
  "id": "online-viewing",
  "title": "Online viewing, PBS App, and Passport",
  "time": "4–6 minutes",
  "intro": "Help us understand how viewers use online services, where they get stuck, and what would make WNMU-TV and PBS easier to watch.",
  "pages": [
    {
      "id": "online-habits",
      "title": "How you watch online",
      "questions": [
        {
          "id": "online_devices",
          "type": "checkbox",
          "max": 4,
          "exclusiveValues": ["none"],
          "label": "Which devices do you use, or would you consider using, to watch WNMU-TV or PBS online?",
          "help": "Choose up to four.",
          "resultsSection": "audience",
          "analyticsUse": "Device support",
          "options": [
            {"value": "smart_tv", "label": "Smart TV or streaming device such as Roku, Fire TV, or Apple TV"},
            {"value": "phone", "label": "Phone"},
            {"value": "tablet", "label": "Tablet"},
            {"value": "computer", "label": "Desktop or laptop computer"},
            {"value": "game_console", "label": "Game console"},
            {"value": "none", "label": "I do not currently watch online"}
          ]
        },
        {
          "id": "online_primary_service",
          "type": "radio",
          "label": "Which online service do you use most often for WNMU-TV or PBS programming?",
          "resultsSection": "audience",
          "analyticsUse": "Primary online path",
          "options": [
            {"value": "wnmu_site", "label": "WNMU-TV website or livestream"},
            {"value": "pbs_org", "label": "PBS.org website"},
            {"value": "pbs_app", "label": "PBS App"},
            {"value": "passport", "label": "PBS Passport"},
            {"value": "pbs_kids", "label": "PBS KIDS app or website"},
            {"value": "youtube", "label": "YouTube"},
            {"value": "none", "label": "I do not currently watch WNMU-TV or PBS online"}
          ]
        },
        {
          "id": "online_frequency",
          "type": "radio",
          "label": "How often do you watch WNMU-TV or PBS programming online?",
          "resultsSection": "audience",
          "analyticsUse": "Online engagement",
          "options": [
            {"value": "daily", "label": "Daily or almost daily"},
            {"value": "weekly", "label": "About weekly"},
            {"value": "monthly", "label": "Several times a month"},
            {"value": "few_times", "label": "A few times a year"},
            {"value": "tried_once", "label": "I have tried it once or twice"},
            {"value": "never", "label": "Never"}
          ]
        },
        {
          "id": "online_barriers",
          "type": "checkbox",
          "max": 4,
          "exclusiveValues": ["none"],
          "label": "What has made online viewing difficult or less appealing?",
          "help": "Choose up to four.",
          "resultsSection": "audience",
          "analyticsUse": "Support and product barriers",
          "options": [
            {"value": "where_to_start", "label": "I do not know which website or app to use"},
            {"value": "sign_in_activation", "label": "Signing in or activating a device is confusing"},
            {"value": "find_local", "label": "It is hard to find WNMU-TV or local programs"},
            {"value": "search", "label": "Search and browsing do not work the way I expect"},
            {"value": "internet", "label": "My internet is too slow or unreliable"},
            {"value": "device_setup", "label": "Setting up a television or streaming device is difficult"},
            {"value": "captions_accessibility", "label": "Captioning or accessibility features do not meet my needs"},
            {"value": "passport_confusion", "label": "I do not understand Passport eligibility or activation"},
            {"value": "prefer_broadcast", "label": "I prefer regular television"},
            {"value": "none", "label": "I have not had meaningful problems"}
          ]
        }
      ]
    },
    {
      "id": "online-improvements",
      "title": "What would make online viewing better?",
      "questions": [
        {
          "id": "passport_status",
          "type": "radio",
          "label": "Which best describes your experience with PBS Passport?",
          "resultsSection": "audience",
          "analyticsUse": "Passport education and activation",
          "options": [
            {"value": "active", "label": "I currently use Passport"},
            {"value": "eligible_not_active", "label": "I believe I am eligible but have not activated it"},
            {"value": "not_sure_what", "label": "I am not sure what Passport is"},
            {"value": "not_eligible", "label": "I do not believe I am eligible"},
            {"value": "not_interested", "label": "I know what it is but am not interested"},
            {"value": "prefer_not", "label": "Prefer not to answer"}
          ]
        },
        {
          "id": "online_help_formats",
          "type": "checkbox",
          "max": 3,
          "exclusiveValues": ["none"],
          "label": "What kind of help would be most useful?",
          "help": "Choose up to three.",
          "resultsSection": "audience",
          "analyticsUse": "Support-channel planning",
          "options": [
            {"value": "web_steps", "label": "Simple step-by-step instructions on the WNMU-TV website"},
            {"value": "short_video", "label": "A short setup video"},
            {"value": "phone_help", "label": "Someone to call for help"},
            {"value": "printed_guide", "label": "A printable or mailed setup guide"},
            {"value": "community_help", "label": "In-person help at a community location or event"},
            {"value": "email_chat", "label": "Help by email or chat"},
            {"value": "none", "label": "I do not need setup help"}
          ]
        },
        {
          "id": "online_features",
          "type": "checkbox",
          "max": 4,
          "label": "Which online improvements would matter most to you?",
          "help": "Choose up to four.",
          "resultsSection": "audience",
          "analyticsUse": "Digital roadmap",
          "options": [
            {"value": "clear_local_section", "label": "A clearer WNMU-TV and local-program section"},
            {"value": "easier_livestream", "label": "Easier access to the WNMU-TV livestream"},
            {"value": "better_search", "label": "Better search and browsing"},
            {"value": "watchlist", "label": "An easier watchlist or saved-program feature"},
            {"value": "reminders", "label": "Program reminders and notifications"},
            {"value": "local_archive", "label": "More local and regional programs available on demand"},
            {"value": "device_setup", "label": "Clearer television and device setup instructions"},
            {"value": "accessibility", "label": "Better captioning and accessibility information"}
          ]
        },
        {
          "id": "online_comments",
          "type": "textarea",
          "label": "What else should WNMU-TV know about your experience watching online?",
          "resultsSection": "voices",
          "analyticsUse": "Qualitative barriers and ideas"
        }
      ]
    }
  ]
});
})();
