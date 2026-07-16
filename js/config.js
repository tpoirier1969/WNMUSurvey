(function () {
  "use strict";

  window.WNMU_CONFIG = Object.freeze({
    schemaVersion: "wnmu-viewer-questionnaire-v4",
    buildVersion: "4.3.0-test",
    releaseDate: "2026-07-16",
    mode: "test",
    modeLabel: "Test Mode",
    campaign: "viewer-questionnaire-2026",
    surveyPart: "core",
    storageKeys: Object.freeze({
      draft: "wnmuViewerSurveyDraft:v4",
      legacyDrafts: Object.freeze(["wnmuViewerSurveyDraft:v1"]),
      responses: "wnmuViewerSurveyResponses:v1",
      respondentId: "wnmuViewerRespondentId:v1",
      sound: "wnmuViewerSound:v1"
    }),
    test: Object.freeze({
      allowBlankNavigation: true,
      allowBlankSubmission: true,
      showAllConditionalQuestions: false,
      useSyntheticResults: true
    })
  });
})();
