(function () {
  "use strict";
  window.WNMU_FOLLOW_UP_MODULES = window.WNMU_FOLLOW_UP_MODULES || [];
  window.WNMU_FOLLOW_UP_MODULES.push({
  "id": "children-education",
  "title": "Children's programming and education",
  "time": "4–6 minutes",
  "intro": "Tell us how children, families, educators, libraries, and childcare providers use WNMU-TV and PBS educational resources.",
  "eligibility": {"coreChildrenRoleIn": ["household", "educator", "both"]},
  "pages": [
    {
      "id": "children-use",
      "title": "Children and learning needs",
      "questions": [
        {
          "id": "children_age_groups",
          "type": "checkbox",
          "label": "Which age groups do you select or recommend programming for?",
          "resultsSection": "audience",
          "analyticsUse": "Age segmentation",
          "options": [
            {"value": "under_3", "label": "Under age 3"},
            {"value": "3_5", "label": "Ages 3–5"},
            {"value": "6_8", "label": "Ages 6–8"},
            {"value": "9_12", "label": "Ages 9–12"},
            {"value": "13_17", "label": "Ages 13–17"},
            {"value": "mixed", "label": "Mixed-age groups"}
          ]
        },
        {
          "id": "children_settings",
          "type": "checkbox",
          "label": "Where are these programs or resources used?",
          "resultsSection": "audience",
          "analyticsUse": "Household and institutional use",
          "options": [
            {"value": "home", "label": "At home"},
            {"value": "classroom", "label": "School classroom"},
            {"value": "library", "label": "Library"},
            {"value": "childcare", "label": "Childcare or preschool"},
            {"value": "homeschool", "label": "Homeschool setting"},
            {"value": "community", "label": "Community or youth program"},
            {"value": "other", "label": "Another setting"}
          ]
        },
        {
          "id": "children_learning_goals",
          "type": "checkbox",
          "max": 4,
          "label": "Which learning goals should WNMU-TV and PBS support most strongly?",
          "help": "Choose up to four.",
          "resultsSection": "programming",
          "analyticsUse": "Educational priorities",
          "options": [
            {"value": "literacy", "label": "Reading, language, and literacy"},
            {"value": "stem", "label": "Science, technology, engineering, and math"},
            {"value": "social_emotional", "label": "Social and emotional learning"},
            {"value": "history_civics", "label": "History and civics"},
            {"value": "arts", "label": "Arts, music, and creativity"},
            {"value": "nature_outdoors", "label": "Nature, wildlife, and the outdoors"},
            {"value": "health", "label": "Health and well-being"},
            {"value": "careers", "label": "Careers and workplace awareness"},
            {"value": "world_cultures", "label": "World cultures and languages"},
            {"value": "entertainment", "label": "Safe, enjoyable entertainment"}
          ]
        },
        {
          "id": "children_local_importance",
          "type": "radio",
          "label": "How important is programming that helps children learn about the Upper Peninsula and Great Lakes region?",
          "resultsSection": "programming",
          "analyticsUse": "Demand for regional children's content",
          "options": [
            {"value": "1", "label": "Not important"},
            {"value": "2", "label": "Slightly important"},
            {"value": "3", "label": "Moderately important"},
            {"value": "4", "label": "Very important"},
            {"value": "5", "label": "Essential"},
            {"value": "not_sure", "label": "Not sure"}
          ]
        }
      ]
    },
    {
      "id": "children-resources",
      "title": "Local topics, resources, and access",
      "questions": [
        {
          "id": "children_local_topics",
          "type": "checkbox",
          "max": 4,
          "label": "Which local or regional topics would be most useful for children?",
          "help": "Choose up to four.",
          "resultsSection": "programming",
          "analyticsUse": "Local-content development",
          "options": [
            {"value": "nature_great_lakes", "label": "Regional nature, wildlife, and the Great Lakes"},
            {"value": "history_culture", "label": "Upper Peninsula history and cultures"},
            {"value": "indigenous", "label": "Indigenous history, cultures, and contemporary communities"},
            {"value": "science", "label": "Regional science and environmental issues"},
            {"value": "careers", "label": "Local careers and workplaces"},
            {"value": "arts", "label": "Regional arts, music, and storytelling"},
            {"value": "outdoor_safety", "label": "Outdoor skills and safety"},
            {"value": "community_helpers", "label": "Community helpers and public services"}
          ]
        },
        {
          "id": "educator_resources",
          "type": "checkbox",
          "max": 4,
          "exclusiveValues": ["none"],
          "label": "Which educational resources would be most useful?",
          "help": "Choose up to four.",
          "resultsSection": "programming",
          "analyticsUse": "Resource development",
          "options": [
            {"value": "lesson_plans", "label": "Lesson plans and teaching guides"},
            {"value": "short_clips", "label": "Short classroom-ready video clips"},
            {"value": "full_programs", "label": "Full programs for classroom or group use"},
            {"value": "printables", "label": "Printable activities and discussion sheets"},
            {"value": "standards", "label": "Clear links to learning standards"},
            {"value": "professional_development", "label": "Professional development for educators"},
            {"value": "event_kits", "label": "Materials for family or community learning events"},
            {"value": "none", "label": "I do not need additional educational resources"}
          ]
        },
        {
          "id": "children_access_barriers",
          "type": "checkbox",
          "max": 4,
          "exclusiveValues": ["none"],
          "label": "What makes it harder to use children's programming or educational resources?",
          "help": "Choose up to four.",
          "resultsSection": "audience",
          "analyticsUse": "Distribution and support barriers",
          "options": [
            {"value": "schedule", "label": "Programs air at inconvenient times"},
            {"value": "internet", "label": "Internet access is limited or unreliable"},
            {"value": "devices", "label": "The needed devices are not available"},
            {"value": "awareness", "label": "People do not know the resources exist"},
            {"value": "finding_age", "label": "It is hard to find the right program for an age or learning goal"},
            {"value": "accessibility", "label": "Captioning, language, or accessibility needs are not met"},
            {"value": "classroom_rights", "label": "It is unclear what may be shown in a classroom or group setting"},
            {"value": "none", "label": "I have not encountered meaningful barriers"}
          ]
        },
        {
          "id": "children_comments",
          "type": "textarea",
          "label": "What else should WNMU-TV know about the needs of children, families, educators, or learning organizations?",
          "resultsSection": "voices",
          "analyticsUse": "Qualitative needs"
        }
      ]
    }
  ]
});
})();
