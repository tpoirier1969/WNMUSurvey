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

  function migrateStoredThankYouPreview() {
    const responses = safeParse(localStorage.getItem(config.storageKeys.responses), []);
    if (!Array.isArray(responses)) return;
    const previews = responses.filter((response) => response?.isTestPreview);
    if (!previews.length) return;
    const latest = previews.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))[0];
    localStorage.setItem(config.storageKeys.thankYouPreview, JSON.stringify(latest));
    localStorage.setItem(config.storageKeys.responses, JSON.stringify(responses.filter((response) => !response?.isTestPreview)));
  }

  clearRetiredPrototypeData();
  migrateStoredThankYouPreview();

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

  function getContactRequests() {
    const requests = safeParse(localStorage.getItem(config.storageKeys.contactRequests), []);
    return Array.isArray(requests) ? requests : [];
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
      const submitted = this.getResponses().find((response) =>
        response.responseId === responseId || response.id === responseId
      );
      if (submitted) return submitted;
      const preview = safeParse(localStorage.getItem(config.storageKeys.thankYouPreview), null);
      return preview && (preview.responseId === responseId || preview.id === responseId) ? preview : null;
    },

    getTestThankYouPreview() {
      return safeParse(localStorage.getItem(config.storageKeys.thankYouPreview), null);
    },

    saveTestThankYouPreview(preview) {
      localStorage.setItem(config.storageKeys.thankYouPreview, JSON.stringify(preview));
      return preview;
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

    getContactRequests,

    getContactRequestForResponse(coreResponseId) {
      return getContactRequests().find((request) => request.coreResponseId === coreResponseId) || null;
    },

    saveContactRequest(coreResponse, payload) {
      if (!config.contact?.enabled) throw new Error("Contact requests are not enabled.");
      if (!coreResponse?.responseId || !coreResponse?.respondentId) {
        throw new Error("A submitted core response is required before saving a contact request.");
      }

      const email = String(payload.email || "").trim();
      const name = String(payload.name || "").trim();
      const allowedReasons = new Set(["response_followup", "programming_idea", "future_research"]);
      const reasons = Array.from(new Set(Array.isArray(payload.reasons) ? payload.reasons : [])).filter((reason) => allowedReasons.has(reason));
      if (!payload.consent) throw new Error("Contact consent is required.");
      if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("A valid email address is required.");
      if (!reasons.length) throw new Error("At least one contact reason is required.");
      if (name.length > 100) throw new Error("The contact name is too long.");

      const requests = getContactRequests();
      const existingIndex = requests.findIndex((request) => request.coreResponseId === coreResponse.responseId);
      const existing = existingIndex >= 0 ? requests[existingIndex] : null;
      const now = new Date().toISOString();
      const request = {
        contactRequestId: existing?.contactRequestId || makeId("contact-request"),
        contactSchemaVersion: config.contact.schemaVersion,
        respondentId: coreResponse.respondentId,
        coreResponseId: coreResponse.responseId,
        coreSchemaVersion: coreResponse.schemaVersion || coreResponse.surveyVersion || config.schemaVersion,
        buildVersion: config.buildVersion,
        mode: config.mode,
        source: config.mode === "test" ? "local-browser-contact-test" : "local-browser-contact",
        status: "contact_requested",
        isTestPreview: Boolean(coreResponse.isTestPreview),
        name,
        email,
        reasons,
        consentGiven: true,
        consentVersion: "contact-opt-in-v1",
        createdAt: existing?.createdAt || now,
        updatedAt: now
      };

      if (existingIndex >= 0) requests[existingIndex] = request;
      else requests.push(request);
      localStorage.setItem(config.storageKeys.contactRequests, JSON.stringify(requests));
      return request;
    },

    removeContactRequestForResponse(coreResponseId) {
      const requests = getContactRequests().filter((request) => request.coreResponseId !== coreResponseId);
      localStorage.setItem(config.storageKeys.contactRequests, JSON.stringify(requests));
      return requests.length;
    },

    clearContactRequests() {
      localStorage.removeItem(config.storageKeys.contactRequests);
    },

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
