(function () {
  "use strict";

  const config = window.WNMU_REBUILD_CONFIG;
  if (!config) throw new Error("Standalone questionnaire configuration did not load.");

  function parse(raw, fallback) {
    if (!raw) return fallback;
    try { return JSON.parse(raw); } catch (_error) { return fallback; }
  }

  function makeId(prefix) {
    const value = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    return `${prefix}-${value}`;
  }

  function getRespondentId() {
    let id = localStorage.getItem(config.storageKeys.respondentId);
    if (!id) {
      id = makeId("respondent");
      localStorage.setItem(config.storageKeys.respondentId, id);
    }
    return id;
  }

  window.WNMU_REBUILD_STORAGE = Object.freeze({
    getRespondentId,

    getDraft() {
      const draft = parse(localStorage.getItem(config.storageKeys.draft), null);
      return draft?.schemaVersion === config.schemaVersion ? draft : null;
    },

    saveDraft(draft) {
      const payload = {
        schemaVersion: config.schemaVersion,
        buildVersion: config.buildVersion,
        mode: config.mode,
        campaign: config.campaign,
        surveyPart: config.surveyPart,
        status: "draft",
        respondentId: draft.respondentId || getRespondentId(),
        startedAt: draft.startedAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        answers: draft.answers || {},
        routeProfile: draft.routeProfile || {},
        completedStageIds: draft.completedStageIds || [],
        activeStageId: draft.activeStageId || null,
        activePageIndex: Number.isInteger(draft.activePageIndex) ? draft.activePageIndex : 0
      };
      localStorage.setItem(config.storageKeys.draft, JSON.stringify(payload));
      return payload;
    },

    clearDraft() {
      localStorage.removeItem(config.storageKeys.draft);
    },

    getResponses() {
      const responses = parse(localStorage.getItem(config.storageKeys.responses), []);
      return Array.isArray(responses) ? responses : [];
    },

    submit(payload) {
      const now = new Date().toISOString();
      const response = {
        responseId: makeId("response"),
        respondentId: payload.respondentId || getRespondentId(),
        schemaVersion: config.schemaVersion,
        buildVersion: config.buildVersion,
        mode: config.mode,
        campaign: config.campaign,
        surveyPart: config.surveyPart,
        source: "standalone-rebuild-browser",
        status: "submitted",
        startedAt: payload.startedAt || now,
        submittedAt: now,
        routeProfile: payload.routeProfile || {},
        answers: payload.answers || {},
        completedStageIds: payload.completedStageIds || []
      };
      const responses = this.getResponses();
      responses.push(response);
      localStorage.setItem(config.storageKeys.responses, JSON.stringify(responses));
      this.clearDraft();
      return response;
    }
  });
})();
