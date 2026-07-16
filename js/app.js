(function () {
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

  document.addEventListener("DOMContentLoaded", init);

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

  function init() {
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
      returnToStages: document.getElementById("returnToStages") || document.getElementById("changeRoute"),
      resumeBlock: document.getElementById("resumeBlock"),
      resumeDetails: document.getElementById("resumeDetails"),
      resumeSurvey: document.getElementById("resumeSurvey"),
      discardDraft: document.getElementById("discardDraft"),
      soundToggle: document.getElementById("soundToggle"),
      versionLabel: document.getElementById("versionLabel"),
      modeLabel: document.getElementById("modeLabel")
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
    els.submitSurvey?.addEventListener("click", submitSurvey);
    document.getElementById("newResponse")?.addEventListener("click", startNewResponse);
    els.soundToggle?.addEventListener("click", toggleSound);

    [els.sectionStage].filter(Boolean).forEach((container) => {
      container.addEventListener("change", handleInput);
      container.addEventListener("input", handleInput);
    });

    wireDialogs();
    updateBuildLabels();
    updateSoundToggle();
    updateResumeBlock();
    updateHubStatuses();
    showPanel("hub");
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

  function showPanel(name) {
    state.stage = name;
    if (els.hubPanel) els.hubPanel.hidden = name !== "hub";
    if (els.questionnairePanel) els.questionnairePanel.hidden = name !== "questionnaire";
    if (els.completePanel) els.completePanel.hidden = name !== "complete";
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

  function renderPage(index, direction) {
    const stage = findStage(state.currentStageId);
    if (!stage || !els.sectionStage) return;

    state.currentPageIndex = Math.max(0, Math.min(index, stage.pages.length - 1));
    const page = stage.pages[state.currentPageIndex];
    const progress = state.stageProgress[stage.id] || { visitedPageIds: [], lastPageIndex: 0 };
    addUnique(progress.visitedPageIds, page.id);
    progress.lastPageIndex = state.currentPageIndex;
    state.stageProgress[stage.id] = progress;

    const questions = page.questions.filter((question) => isQuestionVisible(question) && !question.renderedBy);
    const content = `
      <article class="section-page" aria-labelledby="active-page-title">
        <header class="section-page-head">
          <p class="eyebrow">Stage ${stage.number}: ${escapeHtml(stage.title)}</p>
          <h2 id="active-page-title" tabindex="-1">${escapeHtml(page.title)}</h2>
          <p>${escapeHtml(stage.intro || "")}</p>
        </header>
        <div class="question-stack">
          ${questions.map((question, questionIndex) => renderQuestion(question, getQuestionValue(question), questionIndex + 1)).join("")}
        </div>
      </article>`;

    clearTimeout(transitionTimer);
    if (!els.sectionStage.innerHTML || direction === 0 || reducedMotion()) {
      els.sectionStage.innerHTML = content;
      els.sectionStage.className = "section-stage";
    } else {
      els.sectionStage.className = direction > 0 ? "section-stage exit-left" : "section-stage exit-right";
      transitionTimer = window.setTimeout(() => {
        els.sectionStage.innerHTML = content;
        els.sectionStage.className = direction > 0 ? "section-stage enter-right" : "section-stage enter-left";
        requestAnimationFrame(() => requestAnimationFrame(() => {
          els.sectionStage.className = "section-stage";
        }));
      }, 180);
    }

    if (els.pageError) els.pageError.textContent = "";
    renderPageTabs(stage);
    updateProgress(stage);
    updateNavigation(stage);
    refreshCompletedStages(state);
    scheduleSave();

    window.setTimeout(() => {
      els.sectionStage.querySelector("h2")?.focus({ preventScroll: true });
    }, direction === 0 || reducedMotion() ? 0 : 210);
  }

  function renderPageTabs(stage) {
    if (!els.sectionTabs) return;
    els.sectionTabs.innerHTML = stage.pages.map((page, index) => {
      const current = index === state.currentPageIndex;
      const visited = (state.stageProgress[stage.id]?.visitedPageIds || []).includes(page.id);
      return `<button type="button" class="section-tab${current ? " current" : ""}${visited && !current ? " completed" : ""}" data-page-index="${index}" ${current ? 'aria-current="step"' : ""}><span>${index + 1}</span>${escapeHtml(page.title)}</button>`;
    }).join("");

    els.sectionTabs.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        const target = Number(button.dataset.pageIndex);
        if (target > state.currentPageIndex && !validatePage(currentPage())) return;
        renderPage(target, target > state.currentPageIndex ? 1 : -1);
      });
    });
  }

  function updateProgress(stage) {
    const stagePercent = Math.round(((state.currentPageIndex + 1) / stage.pages.length) * 100);
    if (els.progressBar) els.progressBar.style.width = `${stagePercent}%`;
    if (els.progressText) els.progressText.textContent = `${stagePercent}% of this stage`;
    if (els.sectionPosition) {
      els.sectionPosition.textContent = `Stage ${stage.number} of ${survey.stages.length} · Page ${state.currentPageIndex + 1} of ${stage.pages.length}`;
    }
  }

  function updateNavigation(stage) {
    const lastPage = state.currentPageIndex === stage.pages.length - 1;
    const finalStage = stage.id === survey.stages[survey.stages.length - 1].id;
    if (els.prevSection) els.prevSection.disabled = state.currentPageIndex === 0;
    if (els.nextSection) els.nextSection.hidden = lastPage;
    if (els.completeStage) els.completeStage.hidden = !lastPage || finalStage;
    if (els.submitSurvey) els.submitSurvey.hidden = !lastPage || !finalStage;
  }

  function navigatePage(delta) {
    const stage = findStage(state.currentStageId);
    if (!stage) return;
    if (delta > 0 && !validatePage(currentPage())) return;
    const target = state.currentPageIndex + delta;
    if (target < 0 || target >= stage.pages.length) return;
    renderPage(target, delta);
  }

  function completeCurrentStage() {
    const stage = findStage(state.currentStageId);
    if (!stage || !validateStage(stage)) return;
    markStageExplicitlyComplete(stage);
    refreshCompletedStages(state);
    saveDraftNow();
    playSound("complete");
    updateHubStatuses();
    showPanel("hub");
  }

  function validatePage(page) {
    if (!page || allowsBlankNavigation()) return true;
    const missing = page.questions.filter((question) =>
      question.required && isQuestionVisible(question) && !hasValue(getQuestionValue(question))
    );
    if (!missing.length) return true;
    showValidationError(missing[0], "Please answer the required question before continuing.");
    return false;
  }

  function validateStage(stage) {
    for (let pageIndex = 0; pageIndex < stage.pages.length; pageIndex += 1) {
      const missing = stage.pages[pageIndex].questions.find((question) =>
        question.required && isQuestionVisible(question) && !hasValue(getQuestionValue(question))
      );
      if (missing) {
        renderPage(pageIndex, pageIndex >= state.currentPageIndex ? 1 : -1);
        window.setTimeout(() => {
          showValidationError(missing, "Please answer this required question before completing the stage.");
        }, 20);
        return false;
      }
    }
    return true;
  }

  function validateQuestionnaire() {
    if (allowsBlankSubmission()) return null;
    for (const stage of survey.stages) {
      const visited = state.stageProgress?.[stage.id]?.visitedPageIds || [];
      const firstUnvisited = stage.pages.findIndex((page) => !visited.includes(page.id));
      if (firstUnvisited >= 0) return { stage, pageIndex: firstUnvisited, question: null, stageVisit: true };

      for (let pageIndex = 0; pageIndex < stage.pages.length; pageIndex += 1) {
        const missing = stage.pages[pageIndex].questions.find((question) =>
          question.required && isQuestionVisible(question) && !hasValue(getQuestionValue(question))
        );
        if (missing) return { stage, pageIndex, question: missing };
      }
    }
    return null;
  }

  function showValidationError(question, message) {
    if (els.pageError) els.pageError.textContent = message;
    const blockId = question.renderedBy || question.id;
    const block = els.sectionStage?.querySelector(`[data-question-block="${cssEscape(blockId)}"]`);
    if (!block) return;
    block.querySelector(".question-message").textContent = message;
    block.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "center" });
    block.querySelector(`[data-question-id="${cssEscape(question.id)}"], input, select, textarea`)?.focus({ preventScroll: true });
  }

  function submitSurvey() {
    const missing = validateQuestionnaire();
    if (missing) {
      state.currentStageId = missing.stage.id;
      showPanel("questionnaire");
      renderPage(missing.pageIndex, 0);
      window.setTimeout(() => {
        if (missing.question) showValidationError(missing.question, "Please answer the required question before submitting.");
        else if (els.pageError) els.pageError.textContent = "Please review each questionnaire stage before submitting.";
      }, 20);
      return;
    }

    const visibleQuestionIds = allQuestions().filter(isQuestionVisible).map((question) => question.id);
    const visibleSet = new Set(visibleQuestionIds);
    const routeProfile = {};
    const answers = {};

    allQuestions().forEach((question) => {
      if (!visibleSet.has(question.id)) return;
      const value = getQuestionValue(question);
      if (!hasValue(value)) return;
      if (question.store === "profile") routeProfile[question.id] = clone(value);
      else answers[question.id] = clone(value);
    });

    const finalStage = findStage(state.currentStageId);
    if (finalStage) markStageExplicitlyComplete(finalStage);
    refreshCompletedStages(state);
    storage.saveResponse({
      respondentId: state.respondentId,
      startedAt: state.startedAt,
      routeProfile,
      answers,
      visibleQuestionIds,
      completedStageIds: state.completedStageIds
    });
    storage.clearDraft();
    playSound("complete");
    showPanel("complete");
    updateResumeBlock();
  }

  function startNewResponse() {
    state = blankState();
    storage.clearDraft();
    updateResumeBlock();
    updateHubStatuses();
    showPanel("hub");
  }

  function discardDraft() {
    if (!window.confirm("Discard the saved questionnaire draft in this browser? Submitted responses will not be affected.")) return;
    state = blankState();
    storage.clearDraft();
    updateResumeBlock();
    updateHubStatuses();
    showPanel("hub");
  }

  function handleInput(event) {
    const target = event.target;
    const questionId = target.dataset.questionId;
    if (!questionId) return;

    const question = findQuestion(questionId);
    if (!question) return;

    const context = question.store === "profile" ? state.routeProfile : state.answers;
    const block = target.closest("[data-question-block]");

    if (target.type === "checkbox") {
      enforceExclusive(target, block);
      if (!enforceMax(target, block)) return;
      context[questionId] = Array.from(
        block.querySelectorAll(`input[type="checkbox"][data-question-id="${cssEscape(questionId)}"]:checked`)
      ).map((input) => input.value);
    } else if (target.dataset.answerRowId || target.dataset.rowId) {
      const rowId = target.dataset.answerRowId || target.dataset.rowId;
      context[questionId] = context[questionId] || {};
      context[questionId][rowId] = parseScaleValue(target.value);
    } else {
      context[questionId] = question.type === "scale" ? parseScaleValue(target.value) : target.value;
    }

    block?.querySelector(".question-message")?.replaceChildren();
    if (els.pageError) els.pageError.textContent = "";
    refreshCompletedStages(state);
    scheduleSave();

    if (["viewer_status", "viewing_methods", "children_role"].includes(questionId)) {
      const focusValue = target.value;
      renderPage(state.currentPageIndex, 0);
      const replacement = els.sectionStage.querySelector(
        `[data-question-id="${cssEscape(questionId)}"][value="${cssEscape(focusValue)}"]`
      );
      replacement?.focus({ preventScroll: true });
    }
  }

  function enforceExclusive(target, block) {
    if (!block || !target.checked) return;
    const exclusive = (block.dataset.exclusive || "").split(",").filter(Boolean);
    if (!exclusive.length) return;
    const boxes = Array.from(block.querySelectorAll('input[type="checkbox"]'));
    if (exclusive.includes(target.value)) {
      boxes.forEach((box) => {
        if (box !== target) box.checked = false;
      });
    } else {
      boxes.forEach((box) => {
        if (exclusive.includes(box.value)) box.checked = false;
      });
    }
  }

  function enforceMax(target, block) {
    if (!block || !target.checked) return true;
    const max = Number(block.dataset.max || 0);
    if (!max) return true;
    const checked = block.querySelectorAll('input[type="checkbox"]:checked');
    if (checked.length <= max) return true;
    target.checked = false;
    block.querySelector(".question-message").textContent = `Choose no more than ${max}.`;
    return false;
  }

  function renderQuestion(question, value, number) {
    const options = resolveOptions(question);
    const optional = !question.required || question.optionalLabel;
    const badge = optional
      ? '<span class="optional-badge">Optional</span>'
      : '<span class="required-badge">Required</span>';
    const help = question.help ? `<p class="question-help">${escapeHtml(question.help)}</p>` : "";
    const choiceGridClass = question.layout === "compact" ? "choice-grid compact-choice-grid" : "choice-grid";
    const controlId = `question-control-${question.id}`;
    let control = "";

    if (question.type === "radio") {
      control = `<div class="${choiceGridClass}">${options.map((option) =>
        choiceMarkup(question, option, value, "radio")
      ).join("")}</div>`;
    } else if (question.type === "checkbox") {
      control = `<div class="${choiceGridClass}">${options.map((option) =>
        choiceMarkup(question, option, Array.isArray(value) ? value : [], "checkbox")
      ).join("")}</div>`;
    } else if (question.type === "select") {
      const selectClass = question.inlineControl ? "select-control inline-select-control" : "select-control";
      control = `<select id="${escapeAttr(controlId)}" class="${selectClass}" data-question-id="${escapeAttr(question.id)}"><option value="">Choose an option</option>${options.map((option) =>
        `<option value="${escapeAttr(option.value)}" ${String(value) === String(option.value) ? "selected" : ""}>${escapeHtml(option.label)}</option>`
      ).join("")}</select>`;
    } else if (question.type === "text") {
      control = `<input class="text-control" type="text" value="${escapeAttr(value || "")}" data-question-id="${escapeAttr(question.id)}" />`;
    } else if (question.type === "textarea") {
      control = `<textarea class="text-control textarea-control" rows="4" data-question-id="${escapeAttr(question.id)}">${escapeHtml(value || "")}</textarea>`;
    } else if (question.type === "scale") {
      control = `<div class="scale-row">${survey.scales[question.scale].map((option) =>
        choiceMarkup(question, option, value, "radio", true)
      ).join("")}</div>`;
    } else if (question.type === "matrix" && question.pairWith) {
      control = renderPairedMatrix(question, value || {});
    } else if (question.type === "matrix") {
      control = renderMatrix(question, value || {});
    }

    const blockAttributes = `data-question-block="${escapeAttr(question.id)}" data-max="${question.max || ""}" data-exclusive="${escapeAttr((question.exclusiveValues || []).join(","))}"`;
    if (question.type === "select" && question.inlineControl) {
      return `<div class="question-card inline-select-question" ${blockAttributes}><div class="inline-question-heading"><span class="question-number">${number}</span><label class="question-label" for="${escapeAttr(controlId)}">${escapeHtml(question.label)}</label>${badge}</div>${help}${control}<p class="question-message" aria-live="polite"></p></div>`;
    }

    return `<fieldset class="question-card" ${blockAttributes}><legend><span class="question-number">${number}</span><span class="question-label">${escapeHtml(question.label)}</span>${badge}</legend>${help}${control}<p class="question-message" aria-live="polite"></p></fieldset>`;
  }

  function choiceMarkup(question, option, selectedValue, type, compact) {
    const checked = type === "checkbox"
      ? selectedValue.map(String).includes(String(option.value))
      : String(selectedValue) === String(option.value);
    const name = type === "radio" ? question.id : `${question.id}[]`;
    return `<label class="choice${compact ? " scale-choice" : ""}"><input type="${type}" name="${escapeAttr(name)}" value="${escapeAttr(option.value)}" data-question-id="${escapeAttr(question.id)}" ${checked ? "checked" : ""} /><span>${escapeHtml(option.label)}</span></label>`;
  }

  function renderMatrix(question, values) {
    const scale = survey.scales[question.scale];
    return `<div class="matrix-wrap"><table class="matrix-table matrix-card-table"><thead><tr><th scope="col">Area</th>${scale.map((option) =>
      `<th scope="col">${escapeHtml(shortScaleLabel(option.label))}</th>`
    ).join("")}</tr></thead><tbody>${question.rows.map((row) =>
      `<tr><th scope="row">${escapeHtml(row.label)}</th>${scale.map((option) =>
        `<td><label class="matrix-choice"><input type="radio" name="${escapeAttr(question.id)}__${escapeAttr(row.id)}" value="${escapeAttr(option.value)}" data-question-id="${escapeAttr(question.id)}" data-row-id="${escapeAttr(row.id)}" ${String(values[row.id]) === String(option.value) ? "checked" : ""} /><span class="matrix-visible-label">${escapeHtml(option.label)}</span><span class="sr-only">${escapeHtml(row.label)}: ${escapeHtml(option.label)}</span></label></td>`
      ).join("")}</tr>`
    ).join("")}</tbody></table></div>`;
  }

  function renderPairedMatrix(importanceQuestion, importanceValues) {
    const performanceQuestion = findQuestion(importanceQuestion.pairWith);
    const showPerformance = Boolean(performanceQuestion && isQuestionVisible(performanceQuestion));
    const performanceValues = performanceQuestion ? getQuestionValue(performanceQuestion) || {} : {};
    const note = showPerformance
      ? '<p class="paired-rating-note">Rate importance first, then WNMU-TV performance for the same role.</p>'
      : '<p class="paired-rating-note">Performance ratings appear for respondents who indicated enough recent familiarity with WNMU-TV.</p>';

    return `<div class="paired-matrix">${note}${importanceQuestion.rows.map((row, index) => {
      const rowLabelId = `paired-role-${index}-${row.id}`;
      const importanceLabelId = `${rowLabelId}-importance`;
      const performanceLabelId = `${rowLabelId}-performance`;
      return `<section class="paired-role-card" aria-labelledby="${escapeAttr(rowLabelId)}">
        <h3 id="${escapeAttr(rowLabelId)}">${escapeHtml(row.label)}</h3>
        <div class="paired-rating-groups">
          <div class="paired-rating-group" role="group" aria-labelledby="${escapeAttr(importanceLabelId)}">
            <h4 id="${escapeAttr(importanceLabelId)}">How important should this be?</h4>
            <div class="scale-row paired-scale-row">
              ${pairedScaleChoices(importanceQuestion, row, importanceValues[row.id])}
            </div>
          </div>
          ${showPerformance ? `<div class="paired-rating-group" role="group" aria-labelledby="${escapeAttr(performanceLabelId)}">
            <h4 id="${escapeAttr(performanceLabelId)}">How well is WNMU-TV doing?</h4>
            <div class="scale-row paired-scale-row">
              ${pairedScaleChoices(performanceQuestion, row, performanceValues[row.id])}
            </div>
          </div>` : ""}
        </div>
      </section>`;
    }).join("")}</div>`;
  }

  function pairedScaleChoices(question, row, selectedValue) {
    return survey.scales[question.scale].map((option) => {
      const checked = String(selectedValue) === String(option.value);
      const progressRowId = `${question.id}__${row.id}`;
      return `<label class="choice scale-choice paired-scale-choice"><input type="radio" name="${escapeAttr(question.id)}__${escapeAttr(row.id)}" value="${escapeAttr(option.value)}" data-question-id="${escapeAttr(question.id)}" data-row-id="${escapeAttr(progressRowId)}" data-answer-row-id="${escapeAttr(row.id)}" ${checked ? "checked" : ""} /><span>${escapeHtml(option.label)}</span><span class="sr-only">${escapeHtml(row.label)}: ${escapeHtml(option.label)}</span></label>`;
    }).join("");
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
  }

  function updateResumeBlock() {
    const draft = storage.loadDraft();
    if (!els.resumeBlock) return;
    els.resumeBlock.hidden = !draft;
    if (draft && els.resumeDetails) {
      const updated = draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : "an earlier session";
      els.resumeDetails.textContent = draft.migratedFrom
        ? `Earlier answers recovered and updated · saved ${updated}`
        : `Saved ${updated}`;
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

  function allowsBlankSubmission() {
    return config.mode === "test" && config.test.allowBlankSubmission;
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
})();
