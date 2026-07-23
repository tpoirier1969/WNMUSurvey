(function () {
  "use strict";

  const config = Object.freeze({
    schemaVersion: "wnmu-viewer-questionnaire-v6",
    buildVersion: "rebuild-0.2.1",
    releaseDate: "2026-07-23",
    mode: "test",
    modeLabel: "Test Mode",
    campaign: "viewer-questionnaire-2026",
    surveyPart: "core",
    storageKeys: Object.freeze({
      draft: "wnmuStandaloneRebuildDraft:v6",
      responses: "wnmuStandaloneRebuildResponses:v1",
      respondentId: "wnmuStandaloneRebuildRespondentId:v1",
      thankYouPreview: "wnmuStandaloneRebuildThankYouPreview:v1",
      followUpAccess: "wnmuStandaloneRebuildFollowUpAccess:v1",
      followUpDrafts: "wnmuStandaloneRebuildFollowUpDrafts:v2",
      followUpResponses: "wnmuStandaloneRebuildFollowUpResponses:v2"
    }),
    followUp: Object.freeze({
      enabled: true,
      path: "follow-up.html",
      schemaVersion: "wnmu-viewer-follow-ups-v2",
      sameBrowserOnly: true
    }),
    results: Object.freeze({
      path: "results.html"
    }),
    test: Object.freeze({
      allowBlankNavigation: true,
      allowBlankSubmission: false,
      showAllConditionalQuestions: false
    })
  });

  window.WNMU_REBUILD_CONFIG = config;
  window.WNMU_CONFIG = config;
})();