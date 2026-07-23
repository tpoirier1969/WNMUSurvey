(function () {
  "use strict";

  const config = window.WNMU_REBUILD_CONFIG;
  if (!config) throw new Error("Standalone questionnaire configuration did not load.");

  function parse(raw, fallback) {
    if (!raw) return fallback;
    try { return JSON.parse(raw); } catch (error) {
      console.warn("Could not parse stored rebuild data.", error);
      return fallback;
    }
  }
  function makeId(prefix) {
    const value = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    return `${prefix}-${value}`;
  }
  function makeToken() { return `${makeId("continue")}${makeId("private")}`.replace(/[^a-zA-Z0-9]/g, ""); }
  function getArray(key) { const value = parse(localStorage.getItem(key), []); return Array.isArray(value) ? value : []; }
  function getObject(key) { const value = parse(localStorage.getItem(key), {}); return value && typeof value === "object" && !Array.isArray(value) ? value : {}; }
  function getRespondentId() {
    let id = localStorage.getItem(config.storageKeys.respondentId);
    if (!id) {
      id = makeId("respondent");
      localStorage.setItem(config.storageKeys.respondentId, id);
    }
    return id;
  }
  function normalizeRouteProfile(profile) {
    const source = profile || {};
    return {
      children_role: source.children_role ?? source.childrenRole ?? null,
      viewer_status: source.viewer_status ?? source.viewerStatus ?? null,
      viewing_methods: Array.isArray(source.viewing_methods)
        ? [...source.viewing_methods]
        : Array.isArray(source.viewingMethods) ? [...source.viewingMethods] : []
    };
  }

  const storage = {
    getRespondentId,

    getDraft() {
      const draft = parse(localStorage.getItem(config.storageKeys.draft), null);
      return draft?.schemaVersion === config.schemaVersion ? draft : null;
    },
    loadDraft() { return this.getDraft(); },
    saveDraft(draft) {
      const payload = {
        schemaVersion: config.schemaVersion,
        buildVersion: config.buildVersion,
        releaseDate: config.releaseDate,
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
    clearDraft() { localStorage.removeItem(config.storageKeys.draft); },

    getResponses() { return getArray(config.storageKeys.responses).filter((response) => !response?.isTestPreview); },
    getResponse(responseId) {
      const submitted = this.getResponses().find((response) => response.responseId === responseId || response.id === responseId);
      if (submitted) return submitted;
      const preview = this.getTestThankYouPreview();
      return preview && (preview.responseId === responseId || preview.id === responseId) ? preview : null;
    },
    getLatestResponse() {
      return this.getResponses().filter((response) => response.status === "submitted")
        .sort((a, b) => String(b.submittedAt || b.createdAt || "").localeCompare(String(a.submittedAt || a.createdAt || "")))[0] || null;
    },
    submit(payload) {
      const now = new Date().toISOString();
      const responseId = makeId("response");
      const response = {
        responseId,
        id: responseId,
        respondentId: payload.respondentId || getRespondentId(),
        schemaVersion: config.schemaVersion,
        surveyVersion: config.schemaVersion,
        buildVersion: config.buildVersion,
        releaseDate: config.releaseDate,
        mode: config.mode,
        campaign: config.campaign,
        surveyPart: config.surveyPart,
        source: "standalone-rebuild-browser",
        status: "submitted",
        startedAt: payload.startedAt || now,
        submittedAt: now,
        createdAt: now,
        routeProfile: normalizeRouteProfile(payload.routeProfile),
        answers: payload.answers || {},
        completedStageIds: payload.completedStageIds || [],
        followUpOffered: Boolean(config.followUp?.enabled)
      };
      const responses = this.getResponses();
      responses.push(response);
      localStorage.setItem(config.storageKeys.responses, JSON.stringify(responses));
      this.clearDraft();
      return response;
    },

    getTestThankYouPreview() { return parse(localStorage.getItem(config.storageKeys.thankYouPreview), null); },
    saveTestThankYouPreview(preview) {
      localStorage.setItem(config.storageKeys.thankYouPreview, JSON.stringify(preview));
      return preview;
    },
    getOrCreateTestThankYouPreview() {
      const existing = this.getTestThankYouPreview();
      if (existing?.previewForSchema === config.schemaVersion) return existing;
      const now = new Date().toISOString();
      const responseId = makeId("thank-you-preview");
      return this.saveTestThankYouPreview({
        responseId,
        id: responseId,
        respondentId: getRespondentId(),
        schemaVersion: `${config.schemaVersion}-thank-you-preview`,
        surveyVersion: `${config.schemaVersion}-thank-you-preview`,
        previewForSchema: config.schemaVersion,
        isTestPreview: true,
        buildVersion: config.buildVersion,
        releaseDate: config.releaseDate,
        mode: config.mode,
        campaign: config.campaign,
        surveyPart: config.surveyPart,
        source: "standalone-rebuild-thank-you-preview",
        status: "submitted",
        startedAt: now,
        submittedAt: now,
        createdAt: now,
        routeProfile: {
          children_role: "both",
          viewer_status: "regular",
          viewing_methods: ["antenna", "pbs_app"]
        },
        answers: {
          television_program_priorities: ["regional_documentaries", "local_news_public_affairs"],
          online_program_priorities: ["environment_nature", "regional_documentaries"]
        },
        completedStageIds: ["about_you", "wnmu_you", "what_watch", "what_want", "how_doing"],
        followUpOffered: true
      });
    },

    getFollowUpAccessRecords() { return getArray(config.storageKeys.followUpAccess); },
    getOrCreateFollowUpAccess(coreResponse) {
      if (!coreResponse?.respondentId || !coreResponse?.responseId) throw new Error("A submitted core response is required before creating a follow-up link.");
      const records = this.getFollowUpAccessRecords();
      let record = records.find((item) => item.respondentId === coreResponse.respondentId && item.coreResponseId === coreResponse.responseId);
      if (record) return record;
      const now = new Date().toISOString();
      record = {
        accessId: makeId("followup-access"),
        token: makeToken(),
        respondentId: coreResponse.respondentId,
        coreResponseId: coreResponse.responseId,
        coreSchemaVersion: coreResponse.schemaVersion || coreResponse.surveyVersion || config.schemaVersion,
        isTestPreview: Boolean(coreResponse.isTestPreview),
        createdAt: now,
        updatedAt: now
      };
      records.push(record);
      localStorage.setItem(config.storageKeys.followUpAccess, JSON.stringify(records));
      return record;
    },
    resolveFollowUpAccess(token) { return token ? this.getFollowUpAccessRecords().find((record) => record.token === token) || null : null; },
    getLatestFollowUpAccess() {
      const respondentId = getRespondentId();
      return this.getFollowUpAccessRecords().filter((record) => record.respondentId === respondentId)
        .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))[0] || null;
    },

    loadFollowUpDraft(accessId, moduleId) { return getObject(config.storageKeys.followUpDrafts)[`${accessId}:${moduleId}`] || null; },
    saveFollowUpDraft(access, moduleId, payload) {
      const drafts = getObject(config.storageKeys.followUpDrafts);
      const key = `${access.accessId}:${moduleId}`;
      drafts[key] = {
        ...payload,
        accessId: access.accessId,
        respondentId: access.respondentId,
        coreResponseId: access.coreResponseId,
        coreSchemaVersion: access.coreSchemaVersion,
        followUpSchemaVersion: config.followUp.schemaVersion,
        moduleId,
        status: "draft",
        isTestPreview: Boolean(access.isTestPreview),
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(config.storageKeys.followUpDrafts, JSON.stringify(drafts));
      return drafts[key];
    },
    clearFollowUpDraft(accessId, moduleId) {
      const drafts = getObject(config.storageKeys.followUpDrafts);
      delete drafts[`${accessId}:${moduleId}`];
      localStorage.setItem(config.storageKeys.followUpDrafts, JSON.stringify(drafts));
    },
    getFollowUpResponses(includePreviews = false) {
      const responses = getArray(config.storageKeys.followUpResponses);
      return includePreviews ? responses : responses.filter((response) => !response?.isTestPreview);
    },
    getFollowUpResponse(accessId, moduleId) {
      return this.getFollowUpResponses(true).find((response) => response.accessId === accessId && response.moduleId === moduleId) || null;
    },
    saveFollowUpResponse(access, moduleId, payload) {
      const responses = this.getFollowUpResponses(true);
      const now = new Date().toISOString();
      const existingIndex = responses.findIndex((response) => response.accessId === access.accessId && response.moduleId === moduleId);
      const existing = existingIndex >= 0 ? responses[existingIndex] : null;
      const responseId = existing?.responseId || makeId("followup-response");
      const response = {
        responseId,
        id: responseId,
        accessId: access.accessId,
        respondentId: access.respondentId,
        coreResponseId: access.coreResponseId,
        coreSchemaVersion: access.coreSchemaVersion,
        followUpSchemaVersion: config.followUp.schemaVersion,
        buildVersion: config.buildVersion,
        releaseDate: config.releaseDate,
        mode: config.mode,
        campaign: config.campaign,
        surveyPart: moduleId,
        moduleId,
        source: "standalone-rebuild-followup-browser",
        status: "submitted",
        isTestPreview: Boolean(access.isTestPreview),
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

  window.WNMU_REBUILD_STORAGE = Object.freeze(storage);
  window.WNMUStorage = window.WNMU_REBUILD_STORAGE;
})();
