(function () {
  "use strict";

  const parts = window.WNMU_QUESTIONNAIRE_PARTS;
  if (!parts) throw new Error("WNMU questionnaire data must load before stage definitions.");

  const stationRoles = [
    { id: "trusted_public_media", label: "Select and provide trusted national and regional public-television programming" },
    { id: "up_programming", label: "Provide programs about the Upper Peninsula, whether produced by WNMU-TV or by other producers" },
    { id: "regional_issues", label: "Cover important regional issues and public affairs" },
    { id: "reflect_region", label: "Reflect the people, places, communities, and cultures of the region" },
    { id: "children_families", label: "Provide educational programming for children and families" },
    { id: "science_nature", label: "Provide science, nature, and environmental programming" },
    { id: "arts_culture", label: "Provide arts, music, and cultural programming" },
    { id: "online_access", label: "Make programs easy to find online and on demand" },
    { id: "access_for_all", label: "Serve people with disabilities or limited and unreliable internet access" }
  ];

  parts.stages.push({
    id: "how_doing",
    number: 5,
    title: "How We're Doing",
    shortTitle: "How We're Doing",
    intro: "Rate the station roles that matter to you and, when you can, how well WNMU-TV is doing.",
    pages: [
      {
        id: "station_performance",
        title: "Priorities and performance",
        questions: [
          {
            id: "station_role_importance",
            type: "matrix",
            scale: "importance",
            pairWith: "station_role_performance",
            presentation: "flat_pair",
            label: "Please rate each WNMU-TV role.",
            help: "Some programs are produced by WNMU-TV; others are selected from PBS, regional, independent, and other producers.",
            rows: stationRoles
          },
          {
            id: "station_role_performance",
            type: "matrix",
            scale: "performance",
            when: { viewerStatusNotIn: ["never", "former"] },
            renderedBy: "station_role_importance",
            label: "How well is WNMU-TV performing in each area?",
            rows: stationRoles
          },
          {
            id: "reflects_me",
            type: "radio",
            when: { viewerStatusNotIn: ["never", "former"] },
            label: "How well does WNMU-TV reflect the interests and needs of people like you?",
            options: [
              { value: "not_at_all", label: "Not at all" },
              { value: "little", label: "A little" },
              { value: "somewhat", label: "Somewhat" },
              { value: "well", label: "Well" },
              { value: "very_well", label: "Very well" },
              { value: "not_familiar", label: "Not familiar enough to answer" }
            ]
          },
          {
            id: "trust_station",
            type: "radio",
            when: { viewerStatusNotIn: ["never", "former"] },
            label: "How much do you trust WNMU-TV as a source of programming and information?",
            options: [
              { value: "none", label: "Not at all" },
              { value: "little", label: "A little" },
              { value: "some", label: "Somewhat" },
              { value: "quite", label: "Quite a bit" },
              { value: "great", label: "A great deal" },
              { value: "not_familiar", label: "Not familiar enough to answer" }
            ]
          },
          {
            id: "nonviewer_reasons",
            type: "checkbox",
            when: { viewerStatusIn: ["former", "never", "unsure"] },
            label: "Which reasons best explain why you do not watch WNMU-TV more often?",
            options: [
              { value: "unaware", label: "I was not aware of WNMU-TV or what it offers" },
              { value: "channel", label: "I do not know where to find it" },
              { value: "signal", label: "I cannot receive a reliable signal" },
              { value: "provider", label: "It is not available through my provider" },
              { value: "schedule", label: "The schedule does not fit my viewing habits" },
              { value: "online", label: "I do not know how to watch online" },
              { value: "content", label: "The programming has not interested me" },
              { value: "other_services", label: "Other services already meet my needs" },
              { value: "little_tv", label: "I watch very little television or long-form video" },
              { value: "past_change", label: "My habits or household changed" },
              { value: "not_local", label: "The station does not feel relevant to my community" }
            ]
          },
          {
            id: "nonviewer_return",
            type: "textarea",
            when: { viewerStatusIn: ["former", "never", "unsure"] },
            label: "What program, service, or change would make you most likely to try or return to WNMU-TV?",
            optionalLabel: true
          },
          {
            id: "final_feedback",
            type: "textarea",
            label: "What is WNMU-TV doing well? Where could WNMU-TV improve? What else would you like us to know?",
            optionalLabel: true
          }
        ]
      }
    ]
  });
})();

(function () {
  "use strict";

  const config = window.WNMU_CONFIG;
  const parts = window.WNMU_QUESTIONNAIRE_PARTS;
  if (!config || !parts || parts.stages.length !== 5) throw new Error("WNMU questionnaire stage files loaded in the wrong order.");

  window.WNMU_SURVEY = {
    config,
    version: config.schemaVersion,
    storageKeys: config.storageKeys,
    scales: parts.scales,
    stages: parts.stages,
    gapPairs: {
      importanceQuestion: "station_role_importance",
      performanceQuestion: "station_role_performance"
    },
    followUpModules: [
      { id: "local-programming", label: "Local and Upper Peninsula programming", time: "5–7 minutes" },
      { id: "programming-ideas", label: "Programming interests and ideas", time: "5–7 minutes" },
      { id: "online-viewing", label: "Online viewing, PBS App, and Passport", time: "4–6 minutes" },
      {
        id: "children-education",
        label: "Children's programming and education",
        time: "4–6 minutes",
        when: { childrenRoleIn: ["household", "educator", "both"] }
      },
      { id: "communication", label: "Communication and finding programs", time: "3–5 minutes" }
    ],
    preproductionReset: {
      previousSchema: "wnmu-viewer-questionnaire-v5",
      previousDraftKey: "wnmuViewerSurveyDraft:v5",
      previousResponseKey: "wnmuViewerSurveyResponses:v2",
      retiredKeys: [
        "wnmuViewerSurveyDraft:v5",
        "wnmuViewerSurveyDraft:v4",
        "wnmuViewerSurveyDraft:v1",
        "wnmuViewerSurveyResponses:v2",
        "wnmuViewerSurveyResponses:v1"
      ],
      note: "Prototype drafts and responses are intentionally cleared rather than migrated into schema v6."
    }
  };

  delete window.WNMU_QUESTIONNAIRE_PARTS;
})();
