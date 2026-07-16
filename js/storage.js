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
