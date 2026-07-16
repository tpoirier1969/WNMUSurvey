"use strict";

  const survey = window.WNMU_SURVEY;
  const config = window.WNMU_CONFIG;
  const storage = window.WNMUStorage;
  if (!survey || !config || !storage) throw new Error("WNMU questionnaire scripts loaded in the wrong order.");

  const els = {};
  let saveTimer = null;
  let transitionTimer = null;
  let soundEnabled = storage.getSoundEnabled();
  let state = blankState();

  function blankState() {
    return {
      stage: "hub",
      respondentId: storage.getRespondentId(),
      currentStageId: null,
      currentPageIndex: 0,
      visitedStageIds: [],
      completedStageIds: [],
      stageProgress: {},
      routeProfile: {},
      answers: {},
      startedAt: null
    };
  }


  function currentPage() {
    return findStage(state.currentStageId)?.pages[state.currentPageIndex] || null;
  }

  function findStage(id) {
    return survey.stages.find((stage) => stage.id === id) || null;
  }

  function allQuestions() {
    return survey.stages.flatMap((stage) => stage.pages.flatMap((page) => page.questions));
  }

  function findQuestion(id) {
    return allQuestions().find((question) => question.id === id) || null;
  }

  function resolveOptions(question) {
    if (question.options) return question.options;
    if (question.optionsFromMatrix) {
      return (findQuestion(question.optionsFromMatrix)?.rows || []).map((row) => ({
        value: row.id,
        label: row.label
      }));
    }
    return [];
  }

  function getQuestionValue(question, candidateState = state) {
    return (question.store === "profile" ? candidateState.routeProfile : candidateState.answers)[question.id];
  }

  function isQuestionVisible(question, candidateState = state) {
    if (config.mode === "test" && config.test.showAllConditionalQuestions) return true;
    return matchesCondition(question.when, candidateState);
  }

  function matchesCondition(condition, candidateState = state) {
    if (!condition) return true;
    const profile = candidateState.routeProfile || {};
    const answers = candidateState.answers || {};
    if (condition.all && !condition.all.every((item) => matchesCondition(item, candidateState))) return false;
    if (condition.any && !condition.any.some((item) => matchesCondition(item, candidateState))) return false;
    if (condition.viewerStatusIn && !condition.viewerStatusIn.includes(profile.viewer_status)) return false;
    if (condition.viewerStatusNotIn && (!hasValue(profile.viewer_status) || condition.viewerStatusNotIn.includes(profile.viewer_status))) return false;
    if (condition.childrenRoleIn && !condition.childrenRoleIn.includes(profile.children_role)) return false;
    if (condition.hasAnyMethod && !condition.hasAnyMethod.some((value) => (profile.viewing_methods || []).includes(value))) return false;
    if (condition.answerIn && !condition.answerIn.values.includes(answers[condition.answerIn.id])) return false;
    if (condition.answerNotIn && condition.answerNotIn.values.includes(answers[condition.answerNotIn.id])) return false;
    return true;
  }

  function stageRequirementsMet(stage, candidateState) {
    return !stage.pages.some((page) => page.questions.some((question) =>
      question.required && isQuestionVisible(question, candidateState) && !hasValue(getQuestionValue(question, candidateState))
    ));
  }

  function stageIsComplete(stage, candidateState) {
    return Boolean(
      candidateState.stageProgress?.[stage.id]?.explicitlyCompleted
      && stageRequirementsMet(stage, candidateState)
    );
  }

  function markStageExplicitlyComplete(stage) {
    const progress = state.stageProgress[stage.id] || { visitedPageIds: [], lastPageIndex: 0 };
    progress.explicitlyCompleted = true;
    state.stageProgress[stage.id] = progress;
  }

  function refreshCompletedStages(candidateState) {
    survey.stages.forEach((stage) => {
      const progress = candidateState.stageProgress?.[stage.id];
      if (progress?.explicitlyCompleted && !stageRequirementsMet(stage, candidateState)) {
        progress.explicitlyCompleted = false;
      }
    });
    candidateState.completedStageIds = survey.stages
      .filter((stage) => stageIsComplete(stage, candidateState))
      .map((stage) => stage.id);
  }

  function getStageStatus(stage) {
    if (stageIsComplete(stage, state)) return "complete";
    if (stageHasAnswers(stage)) return "in_progress";
    return "not_started";
  }

  function stageHasAnswers(stage) {
    return stage.pages.some((page) =>
      page.questions.some((question) => hasValue(getQuestionValue(question)))
    );
  }

  function readyToSubmit() {
    refreshCompletedStages(state);
    return survey.stages.every((stage) => stageIsComplete(stage, state));
  }

  function updateHubStatuses() {
    refreshCompletedStages(state);
    survey.stages.forEach((stage) => {
      const status = getStageStatus(stage);
      const text = status === "complete" ? "Complete" : status === "in_progress" ? "In progress" : "Not started";
      document.querySelectorAll(`[data-stage-id="${cssEscape(stage.id)}"]`).forEach((button) => {
        button.dataset.status = status;
        button.setAttribute("aria-label", `${stage.title}: ${text}`);
        const internal = button.querySelector(".stage-status");
        if (internal) internal.textContent = text;
      });
      document.querySelectorAll(`[data-stage-status="${cssEscape(stage.id)}"]`).forEach((element) => {
        element.textContent = text;
      });
    });
    updateHubSubmitPanel();
  }

  function updateHubSubmitPanel() {
    if (!els.submitReadyPanel) return;
    els.submitReadyPanel.hidden = state.stage !== "hub" || !readyToSubmit();
  }

  function updateResumeBlock() {
    const draft = storage.loadDraft();
    if (!els.resumeBlock) return;
    els.resumeBlock.hidden = !draft || readyToSubmit();
    if (draft && !els.resumeBlock.hidden && els.resumeDetails) {
      const updated = draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : "an earlier session";
      els.resumeDetails.textContent = `Saved ${updated}`;
    }
  }

  function scheduleSave() {
    clearTimeout(saveTimer);
    if (els.saveStatus) els.saveStatus.textContent = "Saving draft…";
    saveTimer = window.setTimeout(saveDraftNow, 350);
  }

  function saveDraftNow() {
    if (!state.startedAt) state.startedAt = new Date().toISOString();
    const saved = storage.saveDraft({
      ...state,
      stage: state.stage,
      currentStageId: state.currentStageId,
      currentPageIndex: state.currentPageIndex
    });
    if (els.saveStatus) {
      els.saveStatus.textContent = `Draft saved ${new Date(saved.updatedAt).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
      })}`;
    }
    updateResumeBlock();
    updateHubStatuses();
  }


  function toggleSound() {
    soundEnabled = storage.setSoundEnabled(!soundEnabled);
    updateSoundToggle();
    if (soundEnabled) playSound("open");
  }

  function updateSoundToggle() {
    if (!els.soundToggle) return;
    els.soundToggle.setAttribute("aria-pressed", String(soundEnabled));
    els.soundToggle.textContent = soundEnabled ? "Sound On" : "Sound Off";
  }

  function playSound(kind) {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = kind === "complete" ? 660 : 440;
      gain.gain.setValueAtTime(0.04, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.12);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.12);
      oscillator.addEventListener("ended", () => context.close());
    } catch (error) {
      console.info("Optional questionnaire sound was unavailable.", error);
    }
  }

  function wireDialogs() {
    document.querySelectorAll("[data-dialog-open]").forEach((button) => {
      button.addEventListener("click", () => {
        document.getElementById(button.dataset.dialogOpen)?.showModal?.();
      });
    });
    document.querySelectorAll("[data-dialog-close]").forEach((button) => {
      button.addEventListener("click", () => button.closest("dialog")?.close());
    });
  }

  function allowsBlankNavigation() {
    return config.mode === "test" && config.test.allowBlankNavigation;
  }

  function reducedMotion() {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  }

  function hasValue(value) {
    if (Array.isArray(value)) return value.length > 0;
    if (value && typeof value === "object") {
      return Object.values(value).some((item) => item !== "" && item !== undefined && item !== null);
    }
    return value !== "" && value !== undefined && value !== null;
  }

  function addUnique(array, value) {
    if (value && !array.includes(value)) array.push(value);
  }

  function parseScaleValue(value) {
    if (value === "na") return "na";
    const numeric = Number(value);
    return Number.isNaN(numeric) ? value : numeric;
  }

  function shortScaleLabel(label) {
    return ({
      "Not important": "Not",
      "Slightly important": "Slightly",
      "Moderately important": "Moderately",
      "Very important": "Very",
      "Not familiar enough to rate": "Not familiar",
      "Not interested": "Not",
      "Slightly interested": "Slightly",
      "Moderately interested": "Moderately",
      "Very interested": "Very",
      "Extremely interested": "Extremely"
    })[label] || label;
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttr(value) {
    return escapeHtml(value);
  }

  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === "function") return window.CSS.escape(String(value));
    return String(value).replace(/([ #;?%&,.+*~\\':"!^$[\]()=>|/@])/g, "\\$1");
  }
