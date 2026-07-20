"use strict";

  function init() {
    ensureHubSubmitPanel();

    Object.assign(els, {
      hubPanel: document.getElementById("welcomePanel"),
      questionnairePanel: document.getElementById("questionnairePanel"),
      completePanel: document.getElementById("completePanel"),
      sectionTabs: document.getElementById("sectionTabs"),
      sectionStage: document.getElementById("sectionStage"),
      progressBar: document.getElementById("progressBar"),
      progressText: document.getElementById("progressText"),
      sectionPosition: document.getElementById("sectionPosition"),
      saveStatus: document.getElementById("saveStatus"),
      pageError: document.getElementById("pageError"),
      prevSection: document.getElementById("prevSection"),
      nextSection: document.getElementById("nextSection"),
      completeStage: document.getElementById("completeStage"),
      submitSurvey: document.getElementById("submitSurvey"),
      submitReadyPanel: document.getElementById("submitReadyPanel"),
      submitFromHub: document.getElementById("submitFromHub"),
      returnToStages: document.getElementById("returnToStages") || document.getElementById("changeRoute"),
      resumeBlock: document.getElementById("resumeBlock"),
      resumeDetails: document.getElementById("resumeDetails"),
      resumeSurvey: document.getElementById("resumeSurvey"),
      discardDraft: document.getElementById("discardDraft"),
      soundToggle: document.getElementById("soundToggle"),
      versionLabel: document.getElementById("versionLabel"),
      modeLabel: document.getElementById("modeLabel"),
      testThankYouShortcut: document.getElementById("testThankYouShortcut")
    });

    const draft = storage.loadDraft();
    if (draft) state = hydrateDraft(draft);

    document.querySelectorAll("[data-stage-id]").forEach((button) => {
      button.addEventListener("click", () => openStage(button.dataset.stageId));
    });

    document.getElementById("startSurvey")?.addEventListener("click", () => openStage(survey.stages[0].id));
    els.resumeSurvey?.addEventListener("click", resumeDraft);
    els.discardDraft?.addEventListener("click", discardDraft);
    els.returnToStages?.addEventListener("click", returnToHub);
    els.prevSection?.addEventListener("click", () => navigatePage(-1));
    els.nextSection?.addEventListener("click", () => navigatePage(1));
    els.completeStage?.addEventListener("click", completeCurrentStage);
    els.submitFromHub?.addEventListener("click", submitSurvey);
    els.submitSurvey?.addEventListener("click", submitSurvey);
    els.soundToggle?.addEventListener("click", toggleSound);
    els.testThankYouShortcut?.addEventListener("click", showLatestTestThankYou);

    els.sectionStage?.addEventListener("change", handleInput);
    els.sectionStage?.addEventListener("input", handleInput);
    els.completePanel?.addEventListener("click", handleCompletionAction);

    wireDialogs();
    updateBuildLabels();
    updateSoundToggle();
    updateResumeBlock();
    updateHubStatuses();
    showPanel("hub");
  }

  function ensureHubSubmitPanel() {
    if (document.getElementById("submitReadyPanel")) return;
    const stageHub = document.getElementById("stageHub");
    if (!stageHub) return;
    const panel = document.createElement("section");
    panel.id = "submitReadyPanel";
    panel.className = "submit-ready-panel";
    panel.hidden = true;
    panel.setAttribute("aria-live", "polite");
    panel.innerHTML = `
      <div>
        <strong>All five stages are complete.</strong>
        <p>Your answers have not been submitted yet.</p>
      </div>
      <div class="button-row">
        <button class="button primary" id="submitFromHub" type="button">Submit questionnaire</button>
      </div>`;
    stageHub.insertAdjacentElement("afterend", panel);
  }

  function hydrateDraft(draft) {
    const validStages = new Set(survey.stages.map((stage) => stage.id));
    const hydrated = {
      ...blankState(),
      ...draft,
      stage: "hub",
      respondentId: draft.respondentId || storage.getRespondentId(),
      routeProfile: draft.routeProfile || {},
      answers: draft.answers || {},
      visitedStageIds: (draft.visitedStageIds || []).filter((id) => validStages.has(id)),
      completedStageIds: (draft.completedStageIds || []).filter((id) => validStages.has(id)),
      stageProgress: draft.stageProgress || {}
    };
    refreshCompletedStages(hydrated);
    return hydrated;
  }

  function updateBuildLabels() {
    if (els.versionLabel) els.versionLabel.textContent = `v${config.buildVersion.replace(/-test$/, "")}`;
    if (els.modeLabel) els.modeLabel.textContent = config.modeLabel;
    document.documentElement.dataset.surveyMode = config.mode;
    document.documentElement.classList.toggle("survey-test-mode", config.mode === "test");
  }

  function showLatestTestThankYou() {
    if (config.mode !== "test") return;

    const response = storage.getResponses()
      .filter((item) => item.status === "submitted" && item.schemaVersion === config.schemaVersion)
      .sort((a, b) => String(b.submittedAt || b.createdAt || "").localeCompare(String(a.submittedAt || a.createdAt || "")))[0];

    if (!response) {
      showPanel("hub");
      const instruction = document.querySelector(".welcome-instruction");
      if (instruction) {
        instruction.textContent = "Submit at least one test response before using the Thank You page shortcut.";
        instruction.setAttribute("role", "status");
        instruction.setAttribute("tabindex", "-1");
        instruction.focus({ preventScroll: true });
        instruction.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "center" });
      }
      return;
    }

    state = {
      ...blankState(),
      respondentId: response.respondentId || storage.getRespondentId(),
      routeProfile: clone(response.routeProfile || {}),
      answers: clone(response.answers || {}),
      startedAt: response.startedAt || null,
      completedStageIds: survey.stages.map((stage) => stage.id),
      visitedStageIds: survey.stages.map((stage) => stage.id),
      stageProgress: Object.fromEntries(survey.stages.map((stage) => [stage.id, {
        explicitlyCompleted: true,
        visitedPageIds: stage.pages.map((page) => page.id),
        lastPageIndex: Math.max(0, stage.pages.length - 1)
      }]))
    };
    refreshCompletedStages(state);
    updateHubStatuses();
    renderCompletionPanel(response);
    showPanel("complete");
  }

  function showPanel(name) {
    state.stage = name;
    if (els.hubPanel) els.hubPanel.hidden = name !== "hub";
    if (els.questionnairePanel) els.questionnairePanel.hidden = name !== "questionnaire";
    if (els.completePanel) els.completePanel.hidden = name !== "complete";
    updateHubSubmitPanel();
    if (name !== "hub") {
      document.getElementById("surveyApp")?.scrollIntoView({
        behavior: reducedMotion() ? "auto" : "smooth",
        block: "start"
      });
    }
  }

  function openStage(stageId, pageIndex) {
    const stage = findStage(stageId);
    if (!stage) return;
    if (!state.startedAt) state.startedAt = new Date().toISOString();
    state.currentStageId = stage.id;
    state.currentPageIndex = Number.isInteger(pageIndex)
      ? pageIndex
      : Math.min(Number(state.stageProgress?.[stage.id]?.lastPageIndex || 0), stage.pages.length - 1);
    addUnique(state.visitedStageIds, stage.id);
    showPanel("questionnaire");
    playSound("open");
    renderPage(state.currentPageIndex, 0);
  }

  function resumeDraft() {
    const stageId = state.currentStageId && findStage(state.currentStageId)
      ? state.currentStageId
      : firstInProgressStageId();
    openStage(stageId || survey.stages[0].id);
  }

  function firstInProgressStageId() {
    return survey.stages.find((stage) => getStageStatus(stage) === "in_progress")?.id || null;
  }

  function returnToHub() {
    refreshCompletedStages(state);
    saveDraftNow();
    updateHubStatuses();
    showPanel("hub");
  }


document.addEventListener("DOMContentLoaded", init);
