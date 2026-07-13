(function () {
  "use strict";

  const config = window.WNMU_SURVEY;

  function safeParse(raw, fallback) {
    try {
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.warn("Could not parse stored WNMU survey data.", error);
      return fallback;
    }
  }

  function makeId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return `wnmu-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  const storage = {
    loadDraft() {
      return safeParse(localStorage.getItem(config.storageKeys.draft), null);
    },

    saveDraft(draft) {
      const payload = {
        ...draft,
        surveyVersion: config.version,
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

    saveResponse(draft) {
      const responses = this.getResponses();
      const response = {
        id: makeId(),
        createdAt: new Date().toISOString(),
        surveyVersion: config.version,
        source: "local-browser",
        routeProfile: draft.routeProfile || {},
        answers: draft.answers || {},
        routeSectionIds: draft.routeSectionIds || []
      };
      responses.push(response);
      localStorage.setItem(config.storageKeys.responses, JSON.stringify(responses));
      return response;
    },

    replaceResponses(responses) {
      if (!Array.isArray(responses)) {
        throw new Error("Imported responses must be an array.");
      }
      localStorage.setItem(config.storageKeys.responses, JSON.stringify(responses));
      return responses.length;
    },

    clearResponses() {
      localStorage.removeItem(config.storageKeys.responses);
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
