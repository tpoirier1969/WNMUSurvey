(function () {
  "use strict";

  window.WNMU_REBUILD_CONFIG = Object.freeze({
    schemaVersion: "wnmu-viewer-questionnaire-v6",
    buildVersion: "rebuild-0.1.0",
    releaseDate: "2026-07-22",
    mode: "test",
    campaign: "viewer-questionnaire-2026",
    surveyPart: "core",
    storageKeys: Object.freeze({
      draft: "wnmuStandaloneRebuildDraft:v6",
      responses: "wnmuStandaloneRebuildResponses:v1",
      respondentId: "wnmuStandaloneRebuildRespondentId:v1"
    }),
    test: Object.freeze({
      allowBlankNavigation: true,
      allowBlankSubmission: false,
      showAllConditionalQuestions: false
    })
  });
})();
