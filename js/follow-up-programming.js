(function () {
  "use strict";
  window.WNMU_FOLLOW_UP_MODULES = window.WNMU_FOLLOW_UP_MODULES || [];
  window.WNMU_FOLLOW_UP_MODULES.push({
  "id": "programming-ideas",
  "title": "Programming interests and ideas",
  "time": "5–7 minutes",
  "intro": "Use the priorities from your main questionnaire as a starting point, then tell us what subjects, qualities, formats, and program ideas would be most useful.",
  "pages": [
    {
      "id": "content-details",
      "title": "Go deeper on content",
      "context": {"type": "core_priorities"},
      "questions": [
        {
          "id": "specific_program_subjects",
          "type": "textarea",
          "label": "Within the priorities shown above, what subjects, stories, or kinds of programs would you most like WNMU-TV to explore?",
          "resultsSection": "voices",
          "analyticsUse": "Topic development linked to core priorities"
        },
        {
          "id": "regional_music_performance_interest",
          "type": "checkbox",
          "max": 4,
          "exclusiveValues": ["not_interested"],
          "label": "WNMU-TV is considering whether a regional music-performance series would be useful. Which styles would you be most likely to watch in a 30- or 60-minute program?",
          "help": "Choose up to four, or select that you would not be interested.",
          "resultsSection": "programming",
          "analyticsUse": "Demand and genre direction for a regional music-performance concept",
          "options": [
            {"value": "country", "label": "Country"},
            {"value": "rock", "label": "Rock"},
            {"value": "pop", "label": "Pop"},
            {"value": "folk_acoustic", "label": "Folk, acoustic, and singer-songwriter"},
            {"value": "jazz_blues", "label": "Jazz and blues"},
            {"value": "classical", "label": "Classical"},
            {"value": "traditional_indigenous_regional", "label": "Traditional, Indigenous, and regional music"},
            {"value": "mixed_genre", "label": "Mixed-genre showcases"},
            {"value": "not_interested", "label": "I would not be interested in this kind of series"}
          ]
        },
        {
          "id": "program_characteristics",
          "type": "checkbox",
          "max": 5,
          "label": "What qualities make a program especially valuable to you?",
          "help": "Choose up to five.",
          "resultsSection": "programming",
          "analyticsUse": "Editorial tone and quality expectations",
          "options": [
            {"value": "practical", "label": "Practical and useful"},
            {"value": "investigative", "label": "Investigative and willing to ask difficult questions"},
            {"value": "in_depth", "label": "In-depth and carefully researched"},
            {"value": "inspiring", "label": "Inspiring and hopeful"},
            {"value": "entertaining", "label": "Entertaining and enjoyable"},
            {"value": "family_friendly", "label": "Appropriate for family viewing"},
            {"value": "locally_relevant", "label": "Relevant to life in this region"},
            {"value": "diverse_voices", "label": "Includes people and perspectives I do not usually hear"},
            {"value": "visual_quality", "label": "Visually strong and well produced"},
            {"value": "calm_reflective", "label": "Calm, thoughtful, and not sensationalized"}
          ]
        },
        {
          "id": "program_length_preferences",
          "type": "checkbox",
          "max": 3,
          "exclusiveValues": ["no_preference"],
          "label": "Which program lengths do you prefer?",
          "help": "Choose up to three.",
          "resultsSection": "programming",
          "analyticsUse": "Format and scheduling",
          "options": [
            {"value": "under_10", "label": "Short programs or clips under 10 minutes"},
            {"value": "half_hour", "label": "Half-hour programs"},
            {"value": "hour", "label": "One-hour programs"},
            {"value": "feature", "label": "Feature-length programs"},
            {"value": "series", "label": "Multi-part series"},
            {"value": "no_preference", "label": "No strong preference"}
          ]
        }
      ]
    },
    {
      "id": "schedule-shape",
      "title": "How WNMU-TV should shape its programming",
      "questions": [
        {
          "id": "program_origin_mix",
          "type": "checkbox",
          "max": 3,
          "label": "Which sources of programming should be most visible on WNMU-TV?",
          "help": "Choose up to three.",
          "resultsSection": "programming",
          "analyticsUse": "Content-source balance",
          "options": [
            {"value": "up_local", "label": "Upper Peninsula and local programs"},
            {"value": "great_lakes_regional", "label": "Great Lakes and regional programs"},
            {"value": "national_pbs", "label": "National PBS programs"},
            {"value": "independent_us", "label": "Independent programs from elsewhere in the United States"},
            {"value": "international", "label": "International programs"}
          ]
        },
        {
          "id": "new_vs_familiar",
          "type": "radio",
          "label": "How should WNMU-TV balance new programs with familiar favorites and older programs?",
          "resultsSection": "programming",
          "analyticsUse": "Acquisitions and repeat strategy",
          "options": [
            {"value": "mostly_new", "label": "Put most attention on new programs"},
            {"value": "more_new", "label": "Lean toward new programs while keeping selected favorites"},
            {"value": "balanced", "label": "Keep a balanced mix"},
            {"value": "more_favorites", "label": "Bring back more favorites and worthwhile older programs"},
            {"value": "no_preference", "label": "No preference"}
          ]
        },
        {
          "id": "special_programming_interest",
          "type": "checkbox",
          "max": 3,
          "exclusiveValues": ["none"],
          "label": "Which special programming approaches interest you?",
          "help": "Choose up to three.",
          "resultsSection": "programming",
          "analyticsUse": "Packaging and engagement formats",
          "options": [
            {"value": "themed_nights", "label": "Themed evenings around one subject"},
            {"value": "seasonal_series", "label": "Seasonal series tied to life in the region"},
            {"value": "marathons", "label": "Marathons of related programs"},
            {"value": "community_screenings", "label": "Community screenings and discussions"},
            {"value": "live_events", "label": "Live or same-day regional events"},
            {"value": "curated_collections", "label": "Streaming collections available on demand, so viewers can watch whenever they choose"},
            {"value": "none", "label": "None of these"}
          ]
        },
        {
          "id": "program_development_ideas",
          "type": "textarea",
          "label": "What additional program idea, subject, format, audience need, or regional opportunity should WNMU-TV consider?",
          "resultsSection": "voices",
          "analyticsUse": "Developable programming ideas"
        }
      ]
    }
  ]
});
})();
