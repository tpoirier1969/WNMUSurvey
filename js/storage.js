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

  function allQuestions() {
    return survey.stages.flatMap((stage) => stage.pages.flatMap((page) => page.questions));
  }

  function questionMap() {
    return allQuestions().reduce((map, question) => {
      map[question.id] = question;
      return map;
    }, {});
  }

  function filterValue(question, value) {
    if (value === undefined || value === null) return undefined;
    if (question.type === "matrix") {
      if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
      const rowIds = new Set((question.rows || []).map((row) => row.id));
      return Object.fromEntries(Object.entries(value).filter(([rowId]) => rowIds.has(rowId)));
    }
    if (question.type === "checkbox") {
      if (!Array.isArray(value)) return undefined;
      const options = resolveOptions(question);
      const allowed = new Set(options.map((option) => String(option.value)));
      return value.filter((item) => allowed.has(String(item)));
    }
    return value;
  }

  function resolveOptions(question) {
    if (question.options) return question.options;
    if (question.optionsFromMatrix) {
      const matrix = questionMap()[question.optionsFromMatrix];
      return (matrix?.rows || []).map((row) => ({ value: row.id, label: row.label }));
    }
    return [];
  }

  function migrateDraft(legacy) {
    const questions = questionMap();
    const routeProfile = {};
    const answers = {};

    Object.entries(legacy?.routeProfile || {}).forEach(([id, value]) => {
      const question = questions[id];
      if (!question || question.store !== "profile") return;
      const filtered = filterValue(question, value);
      if (filtered !== undefined) routeProfile[id] = filtered;
    });

    Object.entries(legacy?.answers || {}).forEach(([id, value]) => {
      const question = questions[id];
      if (!question || question.store === "profile") return;
      const filtered = filterValue(question, value);
      if (filtered !== undefined) answers[id] = filtered;
    });

    return {
      schemaVersion: config.schemaVersion,
      buildVersion: config.buildVersion,
      mode: config.mode,
      campaign: config.campaign,
      surveyPart: config.surveyPart,
      respondentId: getRespondentId(),
      stage: "hub",
      currentStageId: null,
      currentPageIndex: 0,
      visitedStageIds: [],
      completedStageIds: [],
      stageProgress: {},
      routeProfile,
      answers,
      startedAt: legacy?.startedAt || new Date().toISOString(),
      migratedFrom: legacy?.surveyVersion || "legacy-draft"
    };
  }

  function getRespondentId() {
    let id = localStorage.getItem(config.storageKeys.respondentId);
    if (!id) {
      id = makeId("respondent");
      localStorage.setItem(config.storageKeys.respondentId, id);
    }
    return id;
  }

  const storage = {
    getRespondentId,

    loadDraft() {
      const current = safeParse(localStorage.getItem(config.storageKeys.draft), null);
      if (current) return current;
      for (const legacyKey of config.storageKeys.legacyDrafts || []) {
        const legacy = safeParse(localStorage.getItem(legacyKey), null);
        if (legacy) return migrateDraft(legacy);
      }
      return null;
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
      (config.storageKeys.legacyDrafts || []).forEach((key) => localStorage.removeItem(key));
      return payload;
    },

    clearDraft() {
      localStorage.removeItem(config.storageKeys.draft);
      (config.storageKeys.legacyDrafts || []).forEach((key) => localStorage.removeItem(key));
    },

    getResponses() {
      const responses = safeParse(localStorage.getItem(config.storageKeys.responses), []);
      return Array.isArray(responses) ? responses : [];
    },

    saveResponse(payload) {
      const responses = this.getResponses();
      const now = new Date().toISOString();
      const response = {
        responseId: makeId("response"),
        id: makeId("response-legacy"),
        respondentId: payload.respondentId || getRespondentId(),
        schemaVersion: config.schemaVersion,
        surveyVersion: config.schemaVersion,
        buildVersion: config.buildVersion,
        releaseDate: config.releaseDate,
        mode: config.mode,
        campaign: config.campaign,
        surveyPart: config.surveyPart,
        source: config.mode === "test" ? "local-browser-test" : "local-browser",
        startedAt: payload.startedAt || now,
        submittedAt: now,
        createdAt: now,
        routeProfile: payload.routeProfile || {},
        answers: payload.answers || {},
        visibleQuestionIds: payload.visibleQuestionIds || [],
        completedStageIds: payload.completedStageIds || [],
        routeSectionIds: payload.completedStageIds || []
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
