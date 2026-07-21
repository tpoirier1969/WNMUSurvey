(function () {
  "use strict";
  window.WNMU_FOLLOW_UP_MODULES = window.WNMU_FOLLOW_UP_MODULES || [];
  window.WNMU_FOLLOW_UP_MODULES.push({
  "id": "communication",
  "title": "Communication and finding programs",
  "time": "3–5 minutes",
  "intro": "Tell us when and where program information is useful, how much detail you need, and what makes WNMU-TV difficult to find or follow.",
  "pages": [
    {
      "id": "planning-information",
      "title": "Planning and program information",
      "intro": "Think about both programs airing on WNMU-TV channels and programs available through streaming.",
      "questions": [
        {
          "id": "planning_horizon",
          "type": "radio",
          "label": "When deciding what to watch on television or through streaming, how far ahead do you usually plan?",
          "resultsSection": "audience",
          "analyticsUse": "Timing of promotion",
          "options": [
            {"value": "same_day", "label": "The same day"},
            {"value": "few_days", "label": "A few days ahead"},
            {"value": "one_week", "label": "About a week ahead"},
            {"value": "month", "label": "Several weeks or a month ahead"},
            {"value": "no_planning", "label": "I usually browse without planning"}
          ]
        },
        {
          "id": "program_information_needed",
          "type": "checkbox",
          "max": 5,
          "label": "For programs airing on WNMU-TV channels or available through streaming, what information helps you decide whether to watch?",
          "help": "Choose up to five.",
          "resultsSection": "audience",
          "analyticsUse": "Metadata and promotion requirements",
          "options": [
            {"value": "title_time", "label": "Title, date, and time"},
            {"value": "short_description", "label": "A short description"},
            {"value": "episode_details", "label": "Episode-specific details"},
            {"value": "repeat_times", "label": "Repeat dates and times"},
            {"value": "online_availability", "label": "Where and how long it will be available online"},
            {"value": "passport_status", "label": "Whether Passport is required"},
            {"value": "local_relevance", "label": "Why it matters to this region"},
            {"value": "family_guidance", "label": "Age or family-viewing guidance"},
            {"value": "accessibility", "label": "Captioning, audio description, or accessibility information"},
            {"value": "event_info", "label": "Related local events, screenings, or discussions"}
          ]
        },
        {
          "id": "schedule_format",
          "type": "checkbox",
          "max": 3,
          "label": "Which schedule formats would be most useful?",
          "help": "Choose up to three.",
          "resultsSection": "audience",
          "analyticsUse": "Schedule-product priorities",
          "options": [
            {"value": "daily_list", "label": "Simple daily list"},
            {"value": "weekly_grid", "label": "Weekly channel grid"},
            {"value": "searchable_web", "label": "Searchable website schedule"},
            {"value": "printable_pdf", "label": "Printable PDF schedule"},
            {"value": "weekly_email", "label": "Weekly email of highlights and schedules"},
            {"value": "app_calendar", "label": "Calendar inside an app"},
            {"value": "calendar_add", "label": "Add selected programs to my personal calendar"}
          ]
        },
        {
          "id": "message_frequency",
          "type": "radio",
          "label": "How often would you want WNMU-TV to send programming information?",
          "resultsSection": "audience",
          "analyticsUse": "Contact cadence",
          "options": [
            {"value": "major_only", "label": "Only for major programs or changes"},
            {"value": "weekly", "label": "About once a week"},
            {"value": "several_week", "label": "Two or three times a week"},
            {"value": "daily", "label": "Daily"},
            {"value": "topic_choice", "label": "Let me choose topics and frequency"},
            {"value": "none", "label": "I do not want messages sent to me"}
          ]
        }
      ]
    },
    {
      "id": "reminders-reach",
      "title": "Reminders and reaching viewers",
      "questions": [
        {
          "id": "reminder_preferences",
          "type": "checkbox",
          "max": 3,
          "exclusiveValues": ["none"],
          "label": "Which reminder methods would you consider using?",
          "help": "Choose up to three.",
          "resultsSection": "audience",
          "analyticsUse": "Reminder-channel planning",
          "options": [
            {"value": "email", "label": "Email"},
            {"value": "text", "label": "Text message"},
            {"value": "app_push", "label": "App notification"},
            {"value": "social", "label": "Social-media reminder"},
            {"value": "calendar", "label": "Personal calendar reminder"},
            {"value": "none", "label": "I do not want program reminders"}
          ]
        },
        {
          "id": "social_content_interest",
          "type": "checkbox",
          "max": 4,
          "exclusiveValues": ["none"],
          "label": "What kinds of WNMU-TV posts or messages would be useful?",
          "help": "Choose up to four.",
          "resultsSection": "audience",
          "analyticsUse": "Content marketing",
          "options": [
            {"value": "previews", "label": "Program previews and highlights"},
            {"value": "behind_scenes", "label": "Behind-the-scenes material"},
            {"value": "local_stories", "label": "Short local and regional stories"},
            {"value": "clips", "label": "Short clips from programs"},
            {"value": "staff_picks", "label": "Staff recommendations"},
            {"value": "schedule_changes", "label": "Schedule changes and special airings"},
            {"value": "community_events", "label": "Community events and screenings"},
            {"value": "station_support", "label": "Station news, membership, and support information"},
            {"value": "none", "label": "None of these"}
          ]
        },
        {
          "id": "communication_barriers",
          "type": "checkbox",
          "max": 4,
          "exclusiveValues": ["none"],
          "label": "What makes it difficult to know what WNMU-TV is offering?",
          "help": "Choose up to four.",
          "resultsSection": "audience",
          "analyticsUse": "Communication problems",
          "options": [
            {"value": "where_to_look", "label": "I do not know where to look"},
            {"value": "too_many_places", "label": "Information is spread across too many places"},
            {"value": "too_late", "label": "Information arrives too late"},
            {"value": "not_enough_detail", "label": "Program descriptions do not include enough detail"},
            {"value": "schedule_hard", "label": "The schedule is difficult to read or search"},
            {"value": "does_not_reach", "label": "WNMU-TV's messages do not reach the places I use"},
            {"value": "too_promotional", "label": "Messages feel too promotional"},
            {"value": "none", "label": "I generally find what I need"}
          ]
        },
        {
          "id": "communication_comments",
          "type": "textarea",
          "label": "What is the best way for WNMU-TV to keep you informed without becoming intrusive?",
          "resultsSection": "voices",
          "analyticsUse": "Qualitative communication guidance"
        }
      ]
    }
  ]
});
})();
