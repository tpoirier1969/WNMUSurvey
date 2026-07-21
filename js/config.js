(function () {
  "use strict";

  window.WNMU_CONFIG = Object.freeze({
    schemaVersion: "wnmu-viewer-questionnaire-v6",
    buildVersion: "6.3.3-test",
    releaseDate: "2026-07-21",
    mode: "test",
    modeLabel: "Test Mode",
    campaign: "viewer-questionnaire-2026",
    surveyPart: "core",
    storageKeys: Object.freeze({
      draft: "wnmuViewerSurveyDraft:v6",
      legacyDrafts: Object.freeze([]),
      responses: "wnmuViewerSurveyResponses:v3",
      thankYouPreview: "wnmuViewerThankYouPreview:v1",
      respondentId: "wnmuViewerRespondentId:v1",
      sound: "wnmuViewerSound:v1",
      followUpAccess: "wnmuViewerFollowUpAccess:v1",
      followUpDrafts: "wnmuViewerFollowUpDrafts:v2",
      followUpResponses: "wnmuViewerFollowUpResponses:v2",
      contactRequests: "wnmuViewerContactRequests:v1"
    }),
    followUp: Object.freeze({
      enabled: true,
      placeholderPath: "follow-up.html",
      schemaVersion: "wnmu-viewer-follow-ups-v2",
      sameBrowserOnly: true,
      retiredDraftKey: "wnmuViewerFollowUpDrafts:v1",
      retiredResponseKey: "wnmuViewerFollowUpResponses:v1"
    }),
    contact: Object.freeze({
      enabled: true,
      schemaVersion: "wnmu-viewer-contact-v1",
      sameBrowserOnly: true
    }),
    test: Object.freeze({
      allowBlankNavigation: true,
      allowBlankSubmission: false,
      showAllConditionalQuestions: false,
      useSyntheticResults: true
    })
  });
})();
