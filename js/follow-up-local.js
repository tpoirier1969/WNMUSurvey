(function () {
  "use strict";
  window.WNMU_FOLLOW_UP_MODULES = window.WNMU_FOLLOW_UP_MODULES || [];
  window.WNMU_FOLLOW_UP_MODULES.push({
  "id": "local-programming",
  "title": "Local and Upper Peninsula programming",
  "time": "5–7 minutes",
  "intro": "Tell us which regional stories matter, whose experiences should be represented, and how WNMU-TV should balance original production with programs from regional independent producers.",
  "pages": [
    {
      "id": "regional-stories",
      "title": "Regional stories and voices",
      "intro": "Think about the full WNMU-TV service area, including communities that may receive less regular attention.",
      "questions": [
        {
          "id": "local_subjects",
          "type": "checkbox",
          "max": 5,
          "label": "Which Upper Peninsula or regional subjects should receive the most attention?",
          "help": "Choose up to five.",
          "resultsSection": "programming",
          "analyticsUse": "Subject priorities",
          "options": [
            {"value": "history_heritage", "label": "History, heritage, and historic places"},
            {"value": "current_issues", "label": "Current issues and public affairs"},
            {"value": "indigenous_communities", "label": "Indigenous communities, cultures, and history"},
            {"value": "environment_great_lakes", "label": "Environment, wildlife, and the Great Lakes"},
            {"value": "outdoor_recreation", "label": "Outdoor recreation and outdoor safety"},
            {"value": "arts_culture", "label": "Arts, music, and culture"},
            {"value": "food_agriculture", "label": "Food, agriculture, and regional traditions"},
            {"value": "business_workforce", "label": "Business, jobs, and the regional economy"},
            {"value": "health_wellbeing", "label": "Health and community well-being"},
            {"value": "schools_youth", "label": "Schools, young people, and education"},
            {"value": "people_places", "label": "Local people, communities, and places"},
            {"value": "travel_tourism", "label": "Regional travel and tourism"}
          ]
        },
        {
          "id": "local_areas",
          "type": "checkbox",
          "max": 4,
          "label": "Which parts of the region deserve more attention in regional programming?",
          "help": "Choose up to four areas or community types.",
          "resultsSection": "programming",
          "analyticsUse": "Geographic representation gaps",
          "options": [
            {"value": "western_up", "label": "Western Upper Peninsula"},
            {"value": "central_up", "label": "Central Upper Peninsula"},
            {"value": "eastern_up", "label": "Eastern Upper Peninsula"},
            {"value": "great_lakes", "label": "Lake Superior, Lake Michigan, and Great Lakes communities"},
            {"value": "northern_wisconsin", "label": "Northern Wisconsin communities in WNMU-TV's service area"},
            {"value": "tribal_communities", "label": "Tribal communities"},
            {"value": "rural_remote", "label": "Rural, remote, and unincorporated communities"},
            {"value": "outside_marquette", "label": "Communities outside the Marquette area"},
            {"value": "whole_region", "label": "The whole region, without favoring one area"}
          ]
        },
        {
          "id": "local_formats_followup",
          "type": "checkbox",
          "max": 3,
          "label": "Which formats would make you most likely to watch regional programming?",
          "help": "Choose up to three.",
          "resultsSection": "programming",
          "analyticsUse": "Format development",
          "options": [
            {"value": "short_features", "label": "Short features under 10 minutes"},
            {"value": "half_hour_series", "label": "Half-hour recurring series"},
            {"value": "documentaries", "label": "Full-length documentaries"},
            {"value": "forums", "label": "Public forums and issue discussions"},
            {"value": "interviews", "label": "Interviews and conversations"},
            {"value": "events_performances", "label": "Local events and performances"},
            {"value": "digital_shorts", "label": "Online and social-media shorts"},
            {"value": "archive_programs", "label": "Restored or revisited programs from WNMU-TV's archive"}
          ]
        },
        {
          "id": "local_voices",
          "type": "checkbox",
          "max": 4,
          "label": "Whose voices and experiences should be heard more often?",
          "help": "Choose up to four.",
          "resultsSection": "programming",
          "analyticsUse": "Source and representation planning",
          "options": [
            {"value": "residents", "label": "Residents sharing firsthand experiences, including elders and longtime residents"},
            {"value": "historians", "label": "Historians, cultural experts, and community storytellers"},
            {"value": "tribal_voices", "label": "Tribal members and Indigenous knowledge holders"},
            {"value": "students_youth", "label": "Children, students, and young adults"},
            {"value": "educators", "label": "Teachers, librarians, and educators"},
            {"value": "artists", "label": "Artists, musicians, and performers"},
            {"value": "workers_business", "label": "Workers, labor representatives, small-business owners, and employers"},
            {"value": "science_conservation", "label": "Scientists, natural-resource professionals, and conservationists"},
            {"value": "public_officials", "label": "Public officials, nonprofit leaders, and community organizers"},
            {"value": "independent_producers", "label": "Independent filmmakers and regional producers"},
            {"value": "health_human_services", "label": "Health-care, social-service, and public-safety workers"},
            {"value": "underrepresented_residents", "label": "Residents whose experiences are often overlooked, including people with disabilities, caregivers, newcomers, and people facing economic hardship"}
          ]
        }
      ]
    },
    {
      "id": "production-partnerships",
      "title": "Production and partnerships",
      "intro": "WNMU-TV cannot produce every regional program itself. Public television stations may also license finished work from independent producers, meaning the station pays for permission to broadcast or stream a program that meets its standards.",
      "questions": [
        {
          "id": "original_up_production_importance",
          "type": "radio",
          "label": "How important is it for WNMU-TV to return to producing more original programs about the Upper Peninsula?",
          "resultsSection": "performance",
          "analyticsUse": "Direct measure of original-production demand",
          "options": [
            {"value": "1", "label": "Not important"},
            {"value": "2", "label": "Slightly important"},
            {"value": "3", "label": "Moderately important"},
            {"value": "4", "label": "Very important"},
            {"value": "5", "label": "Essential"},
            {"value": "not_sure", "label": "Not sure"}
          ]
        },
        {
          "id": "regional_source_balance",
          "type": "radio",
          "label": "Which approach would best serve viewers who want more Upper Peninsula programming?",
          "resultsSection": "programming",
          "analyticsUse": "Acquisition-versus-production strategy",
          "options": [
            {"value": "mostly_wnmu", "label": "Mostly original WNMU-TV productions"},
            {"value": "balanced_mix", "label": "A balanced mix of WNMU-TV productions and programs from other producers"},
            {"value": "best_available", "label": "Use the strongest available programs, regardless of who produced them"},
            {"value": "mostly_outside", "label": "Primarily programs from independent and other regional producers"},
            {"value": "source_not_important", "label": "The source is not important to me as long as the program is relevant and well made"},
            {"value": "not_sure", "label": "Not sure"}
          ]
        },
        {
          "id": "outside_producer_partnerships",
          "type": "checkbox",
          "max": 3,
          "exclusiveValues": ["not_priority"],
          "label": "How should WNMU-TV work with regional independent producers?",
          "help": "Choose up to three.",
          "resultsSection": "performance",
          "analyticsUse": "Partnership workflow priorities",
          "options": [
            {"value": "license_finished", "label": "License finished programs that meet station standards"},
            {"value": "regular_submissions", "label": "Offer a clear, regular process for submitting programs"},
            {"value": "coproduce", "label": "Co-produce selected regional projects"},
            {"value": "technical_guidance", "label": "Provide technical and editorial guidance before submission"},
            {"value": "short_showcase", "label": "Create a showcase for short films and local features"},
            {"value": "community_partners", "label": "Develop programs with museums, schools, Tribes, and community organizations"},
            {"value": "not_priority", "label": "This should not be a major priority"}
          ]
        },
        {
          "id": "local_program_idea",
          "type": "textarea",
          "label": "What Upper Peninsula story, person, place, organization, producer, or program idea should WNMU-TV consider?",
          "resultsSection": "voices",
          "analyticsUse": "Regional idea and producer discovery"
        }
      ]
    }
  ]
});
})();
