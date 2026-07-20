(function () {
  "use strict";

  const survey = window.WNMU_SURVEY;
  const config = window.WNMU_CONFIG;
  if (!survey || !config) throw new Error("Questionnaire configuration must load before storage.");

  function safeParse(raw, fallback) {
    try {
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.warn("Could not parse stored WNMU questionnaire data.", error);
      return fallback;
    }
  }

  function makeId(prefix) {
    if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
    return `${prefix || "wnmu"}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function makeContinuationToken() {
    const first = makeId("continue").replace(/[^a-zA-Z0-9]/g, "");
    const second = makeId("private").replace(/[^a-zA-Z0-9]/g, "");
    return `${first}${second}`;
  }

  function clearRetiredPrototypeData() {
    const retired = survey.preproductionReset?.retiredKeys || [];
    retired.forEach((key) => {
      if (key && !Object.values(config.storageKeys).includes(key)) localStorage.removeItem(key);
    });
  }

  clearRetiredPrototypeData();

  function getRespondentId() {
    let id = localStorage.getItem(config.storageKeys.respondentId);
    if (!id) {
      id = makeId("respondent");
      localStorage.setItem(config.storageKeys.respondentId, id);
    }
    return id;
  }

  function getFollowUpAccessRecords() {
    const records = safeParse(localStorage.getItem(config.storageKeys.followUpAccess), []);
    return Array.isArray(records) ? records : [];
  }

  function saveFollowUpAccessRecords(records) {
    localStorage.setItem(config.storageKeys.followUpAccess, JSON.stringify(records));
    return records;
  }

  function getFollowUpDraftMap() {
    const drafts = safeParse(localStorage.getItem(config.storageKeys.followUpDrafts), {});
    return drafts && typeof drafts === "object" && !Array.isArray(drafts) ? drafts : {};
  }

  function getFollowUpResponses() {
    const responses = safeParse(localStorage.getItem(config.storageKeys.followUpResponses), []);
    return Array.isArray(responses) ? responses : [];
  }

  const storage = {
    getRespondentId,

    loadDraft() {
      const current = safeParse(localStorage.getItem(config.storageKeys.draft), null);
      if (!current || current.schemaVersion !== config.schemaVersion) return null;
      return current;
    },

    saveDraft(draft) {
      const payload = {
        ...draft,
        schemaVersion: config.schemaVersion,
        buildVersion: config.buildVersion,
        releaseDate: config.releaseDate,
        mode: config.mode,
        campaign: config.campaign,
        surveyPart: config.surveyPart,
        respondentId: draft.respondentId || getRespondentId(),
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(config.storageKeys.draft, JSON.stringify(payload));
      return payload;
    },

    clearDraft() {
      localStorage.removeItem(config.storageKeys.draft);
    },

    getResponses() {
      const responses = safeParse(localStorage.getItem(config.storageKeys.responses), []);
      return Array.isArray(responses) ? responses : [];
    },

    getResponse(responseId) {
      return this.getResponses().find((response) =>
        response.responseId === responseId || response.id === responseId
      ) || null;
    },

    saveResponse(payload) {
      const responses = this.getResponses();
      const now = new Date().toISOString();
      const response = {
        responseId: makeId("response"),
        id: makeId("response"),
        respondentId: payload.respondentId || getRespondentId(),
        schemaVersion: config.schemaVersion,
        surveyVersion: config.schemaVersion,
        buildVersion: config.buildVersion,
        releaseDate: config.releaseDate,
        mode: config.mode,
        campaign: config.campaign,
        surveyPart: config.surveyPart,
        source: config.mode === "test" ? "local-browser-test" : "local-browser",
        status: "submitted",
        startedAt: payload.startedAt || now,
        submittedAt: now,
        createdAt: now,
        routeProfile: payload.routeProfile || {},
        answers: payload.answers || {},
        visibleQuestionIds: payload.visibleQuestionIds || [],
        completedStageIds: payload.completedStageIds || [],
        followUpOffered: Boolean(config.followUp?.enabled)
      };
      responses.push(response);
      localStorage.setItem(config.storageKeys.responses, JSON.stringify(responses));
      return response;
    },

    replaceResponses(responses) {
      if (!Array.isArray(responses)) throw new Error("Imported responses must be an array.");
      localStorage.setItem(config.storageKeys.responses, JSON.stringify(responses));
      return responses.length;
    },

    clearResponses() {
      localStorage.removeItem(config.storageKeys.responses);
    },

    getOrCreateFollowUpAccess(coreResponse) {
      if (!coreResponse?.respondentId || !coreResponse?.responseId) {
        throw new Error("A submitted core response is required before creating a follow-up link.");
      }
      const records = getFollowUpAccessRecords();
      let record = records.find((item) =>
        item.respondentId === coreResponse.respondentId
        && item.coreResponseId === coreResponse.responseId
      );
      if (record) return record;

      const now = new Date().toISOString();
      record = {
        accessId: makeId("followup-access"),
        token: makeContinuationToken(),
        respondentId: coreResponse.respondentId,
        coreResponseId: coreResponse.responseId,
        coreSchemaVersion: coreResponse.schemaVersion || coreResponse.surveyVersion || config.schemaVersion,
        createdAt: now,
        updatedAt: now
      };
      records.push(record);
      saveFollowUpAccessRecords(records);
      return record;
    },

    resolveFollowUpAccess(token) {
      if (!token) return null;
      return getFollowUpAccessRecords().find((record) => record.token === token) || null;
    },

    getLatestFollowUpAccess() {
      const respondentId = getRespondentId();
      return getFollowUpAccessRecords()
        .filter((record) => record.respondentId === respondentId)
        .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0] || null;
    },

    getFollowUpAccessRecords,

    loadFollowUpDraft(accessId, moduleId) {
      return getFollowUpDraftMap()[`${accessId}:${moduleId}`] || null;
    },

    saveFollowUpDraft(access, moduleId, payload) {
      const drafts = getFollowUpDraftMap();
      const key = `${access.accessId}:${moduleId}`;
      drafts[key] = {
        ...payload,
        accessId: access.accessId,
        respondentId: access.respondentId,
        coreResponseId: access.coreResponseId,
        coreSchemaVersion: access.coreSchemaVersion,
        followUpSchemaVersion: config.followUp?.schemaVersion,
        moduleId,
        status: "draft",
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(config.storageKeys.followUpDrafts, JSON.stringify(drafts));
      return drafts[key];
    },

    clearFollowUpDraft(accessId, moduleId) {
      const drafts = getFollowUpDraftMap();
      delete drafts[`${accessId}:${moduleId}`];
      localStorage.setItem(config.storageKeys.followUpDrafts, JSON.stringify(drafts));
    },

    getFollowUpResponses,

    getFollowUpResponse(accessId, moduleId) {
      return getFollowUpResponses().find((response) =>
        response.accessId === accessId && response.moduleId === moduleId
      ) || null;
    },

    saveFollowUpResponse(access, moduleId, payload) {
      const responses = getFollowUpResponses();
      const now = new Date().toISOString();
      const existingIndex = responses.findIndex((response) =>
        response.accessId === access.accessId && response.moduleId === moduleId
      );
      const existing = existingIndex >= 0 ? responses[existingIndex] : null;
      const response = {
        responseId: existing?.responseId || makeId("followup-response"),
        id: existing?.id || makeId("followup-response"),
        accessId: access.accessId,
        respondentId: access.respondentId,
        coreResponseId: access.coreResponseId,
        coreSchemaVersion: access.coreSchemaVersion,
        followUpSchemaVersion: config.followUp?.schemaVersion,
        buildVersion: config.buildVersion,
        releaseDate: config.releaseDate,
        mode: config.mode,
        campaign: config.campaign,
        surveyPart: moduleId,
        moduleId,
        source: config.mode === "test" ? "local-browser-followup-test" : "local-browser-followup",
        status: "submitted",
        startedAt: payload.startedAt || existing?.startedAt || now,
        submittedAt: now,
        createdAt: existing?.createdAt || now,
        answers: payload.answers || {}
      };
      if (existingIndex >= 0) responses[existingIndex] = response;
      else responses.push(response);
      localStorage.setItem(config.storageKeys.followUpResponses, JSON.stringify(responses));
      this.clearFollowUpDraft(access.accessId, moduleId);
      return response;
    },

    clearFollowUpResponses() {
      localStorage.removeItem(config.storageKeys.followUpResponses);
    },

    getSoundEnabled() {
      const value = localStorage.getItem(config.storageKeys.sound);
      return value === null ? true : value === "true";
    },

    setSoundEnabled(enabled) {
      localStorage.setItem(config.storageKeys.sound, String(Boolean(enabled)));
      return Boolean(enabled);
    },

    downloadJson(filename, data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }
  };

  window.WNMUStorage = storage;
})();
