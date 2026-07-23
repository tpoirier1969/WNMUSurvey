(function () {
  "use strict";

  const config = Object.freeze({
    schemaVersion: "wnmu-viewer-questionnaire-v7",
    buildVersion: "rebuild-0.3.0",
    releaseDate: "2026-07-23",
    mode: "test",
    modeLabel: "Test Mode",
    campaign: "viewer-questionnaire-2026",
    surveyPart: "core",
    storageKeys: Object.freeze({
      draft: "wnmuStandaloneRebuildDraft:v7",
      responses: "wnmuStandaloneRebuildResponses:v2",
      respondentId: "wnmuStandaloneRebuildRespondentId:v1",
      thankYouPreview: "wnmuStandaloneRebuildThankYouPreview:v2",
      followUpAccess: "wnmuStandaloneRebuildFollowUpAccess:v2",
      followUpDrafts: "wnmuStandaloneRebuildFollowUpDrafts:v3",
      followUpResponses: "wnmuStandaloneRebuildFollowUpResponses:v3"
    }),
    followUp: Object.freeze({
      enabled: true,
      path: "follow-up.html",
      schemaVersion: "wnmu-viewer-follow-ups-v3",
      sameBrowserOnly: true
    }),
    results: Object.freeze({ path: "results.html" }),
    test: Object.freeze({
      allowBlankNavigation: true,
      allowBlankSubmission: false,
      showAllConditionalQuestions: false
    })
  });

  window.WNMU_REBUILD_CONFIG = config;
  window.WNMU_CONFIG = config;
})();
