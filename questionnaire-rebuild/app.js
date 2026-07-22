(function () {
  "use strict";

  const config = window.WNMU_REBUILD_CONFIG;
  const survey = window.WNMU_REBUILD_SURVEY;
  const storage = window.WNMU_REBUILD_STORAGE;
  if (!config || !survey || !storage) throw new Error("The standalone questionnaire could not start.");

  const stageById = new Map(survey.stages.map((stage) => [stage.id, stage]));
  const questionById = new Map();
  const questionNumbers = new Map();
  let questionNumber = 0;
  survey.stages.forEach((stage) => stage.pages.forEach((page) => page.questions.forEach((question) => {
    questionById.set(question.id, question);
    questionNumbers.set(question.id, ++questionNumber);
  })));

  const routeControllers = new Set(["children_role", "viewer_status", "viewing_methods"]);
  const app = document.getElementById("surveyApp");
  const welcomePanel = document.getElementById("welcomePanel");
  const stageHub = document.getElementById("stageHub");
  const stageCards = Array.from(stageHub.querySelectorAll("[data-stage-id]"));
  const resumeBlock = document.getElementById("resumeBlock");
  const resumeDetails = document.getElementById("resumeDetails");
  const submitReadyPanel = document.getElementById("submitReadyPanel");
  const surveyFacts = app.querySelector(".survey-facts");
  const questionnairePanel = document.getElementById("questionnairePanel");
  const completePanel = document.getElementById("completePanel");
  const sectionPosition = document.getElementById("sectionPosition");
  const saveStatus = document.getElementById("saveStatus");
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const sectionTabs = document.getElementById("sectionTabs");
  const sectionStage = document.getElementById("sectionStage");
  const pageError = document.getElementById("pageError");
  const prevSection = document.getElementById("prevSection");
  const nextSection = document.getElementById("nextSection");
  const completeStage = document.getElementById("completeStage");
  const versionLabel = document.getElementById("versionLabel");
  const storedDraft = storage.getDraft();
  let saveTimer = null;
  let focusPageHeading = false;

  const state = {
    respondentId: storedDraft?.respondentId || storage.getRespondentId(),
    startedAt: storedDraft?.startedAt || new Date().toISOString(),
    answers: storedDraft?.answers && typeof storedDraft.answers === "object" ? storedDraft.answers : {},
    completedStageIds: new Set(Array.isArray(storedDraft?.completedStageIds) ? storedDraft.completedStageIds : []),
    activeStageId: storedDraft?.activeStageId || null,
    activePageIndex: Number.isInteger(storedDraft?.activePageIndex) ? storedDraft.activePageIndex : 0,
    hasDraft: Boolean(storedDraft)
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function routeProfile() {
    return {
      childrenRole: state.answers.children_role || null,
      viewerStatus: state.answers.viewer_status || null,
      viewingMethods: Array.isArray(state.answers.viewing_methods) ? [...state.answers.viewing_methods] : []
    };
  }

  function isApplicable(question) {
    if (!question?.when || config.test.showAllConditionalQuestions) return true;
    const profile = routeProfile();
    const rule = question.when;
    if (rule.childrenRoleIn && !rule.childrenRoleIn.includes(profile.childrenRole)) return false;
    if (rule.viewerStatusIn && !rule.viewerStatusIn.includes(profile.viewerStatus)) return false;
    if (rule.viewerStatusNotIn && rule.viewerStatusNotIn.includes(profile.viewerStatus)) return false;
    if (rule.hasAnyMethod && !rule.hasAnyMethod.some((value) => profile.viewingMethods.includes(value))) return false;
    return true;
  }

  function answerHasValue(value) {
    if (Array.isArray(value)) return value.length > 0;
    if (value && typeof value === "object") return Object.values(value).some((item) => item !== "" && item !== null && item !== undefined);
    return value !== "" && value !== null && value !== undefined;
  }

  function optionsFor(question) {
    if (Array.isArray(question.options)) return question.options;
    if (question.optionsFromMatrix) return questionById.get(question.optionsFromMatrix)?.rows?.map((row) => ({ value: row.id, label: row.label })) || [];
    return [];
  }

  function questionsInStage(stage) {
    return stage.pages.flatMap((page) => page.questions);
  }

  function applicableQuestions(stage) {
    return questionsInStage(stage).filter(isApplicable);
  }

  function stageProgress(stage) {
    if (state.completedStageIds.has(stage.id)) return 100;
    const questions = applicableQuestions(stage);
    if (!questions.length) return 0;
    const answered = questions.filter((question) => answerHasValue(state.answers[question.id])).length;
    return Math.round((answered / questions.length) * 100);
  }

  function stageStatus(stage) {
    if (state.completedStageIds.has(stage.id)) return { value: "complete", label: "Complete" };
    if (stageProgress(stage) > 0) return { value: "in_progress", label: "In progress" };
    return { value: "not_started", label: "Not started" };
  }

  function updateStageCards() {
    stageCards.forEach((card) => {
      const stage = stageById.get(card.dataset.stageId);
      const status = stageStatus(stage);
      const progress = stageProgress(stage);
      card.dataset.status = status.value;
      card.dataset.current = String(state.activeStageId === stage.id && app.dataset.view === "questionnaire");
      card.style.setProperty("--stage-progress", `${progress}%`);
      card.querySelector(".stage-status").textContent = status.label;
      card.setAttribute("aria-label", `${stage.title}: ${status.label}`);
      card.setAttribute("aria-current", card.dataset.current === "true" ? "step" : "false");
    });
  }

  function formatSavedTime(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "You can continue from your saved draft.";
    return `Last saved ${date.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}.`;
  }

  function updateHubPanels() {
    const allComplete = survey.stages.every((stage) => state.completedStageIds.has(stage.id));
    resumeBlock.hidden = !state.hasDraft;
    submitReadyPanel.hidden = !allComplete;
    if (state.hasDraft) {
      const draft = storage.getDraft();
      resumeDetails.textContent = formatSavedTime(draft?.updatedAt);
    }
  }

  function draftPayload() {
    return {
      respondentId: state.respondentId,
      startedAt: state.startedAt,
      answers: clone(state.answers),
      routeProfile: routeProfile(),
      completedStageIds: [...state.completedStageIds],
      activeStageId: state.activeStageId,
      activePageIndex: state.activePageIndex
    };
  }

  function saveDraft(immediate = false) {
    window.clearTimeout(saveTimer);
    saveStatus.textContent = "Saving…";
    const write = () => {
      const saved = storage.saveDraft(draftPayload());
      state.hasDraft = true;
      saveStatus.textContent = `Saved ${new Date(saved.updatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
      updateHubPanels();
    };
    if (immediate) write();
    else saveTimer = window.setTimeout(write, 250);
  }

  function setView(view) {
    app.dataset.view = view;
    welcomePanel.hidden = view !== "hub";
    surveyFacts.hidden = view !== "hub";
    questionnairePanel.hidden = view !== "questionnaire";
    completePanel.hidden = view !== "complete";
    if (view !== "hub") {
      resumeBlock.hidden = true;
      submitReadyPanel.hidden = true;
    } else {
      updateHubPanels();
    }
    updateStageCards();
  }

  function showHub() {
    state.activeStageId = null;
    state.activePageIndex = 0;
    setView("hub");
    saveDraft(true);
    stageHub.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function openStage(stageId, pageIndex = 0) {
    const stage = stageById.get(stageId);
    if (!stage) return;
    state.activeStageId = stageId;
    state.activePageIndex = Math.max(0, Math.min(pageIndex, stage.pages.length - 1));
    focusPageHeading = true;
    setView("questionnaire");
    renderQuestionnaire();
    saveDraft(true);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function createBadge(question) {
    const badge = document.createElement("span");
    badge.className = question.required ? "required-badge" : "optional-badge";
    badge.textContent = question.required ? "Required" : "Optional";
    return badge;
  }

  function createQuestionHeading(question, legend = false) {
    const heading = document.createElement(legend ? "legend" : "div");
    heading.className = "question-heading";
    const number = document.createElement("span");
    number.className = "question-number";
    number.textContent = questionNumbers.get(question.id);
    const label = document.createElement("span");
    label.className = "question-label";
    label.textContent = question.label;
    heading.append(number, label, createBadge(question));
    return heading;
  }

  function addHelp(block, question) {
    if (!question.help) return;
    const help = document.createElement("p");
    help.className = "question-help";
    help.textContent = question.help;
    block.append(help);
  }

  function createMessage(question) {
    const message = document.createElement("p");
    message.id = `message-${question.id}`;
    message.className = "question-message";
    message.setAttribute("aria-live", "polite");
    return message;
  }

  function createChoice(question, option) {
    const label = document.createElement("label");
    label.className = "choice";
    const input = document.createElement("input");
    input.type = question.type;
    input.name = question.id;
    input.value = option.value;
    input.dataset.questionId = question.id;
    const answer = state.answers[question.id];
    input.checked = question.type === "checkbox" ? Array.isArray(answer) && answer.includes(option.value) : answer === option.value;
    const text = document.createElement("span");
    text.textContent = option.label;
    label.append(input, text);
    return label;
  }

  function renderSelect(question) {
    const block = document.createElement("div");
    block.className = "question-card inline-select-question";
    block.dataset.questionBlock = question.id;
    block.append(createQuestionHeading(question));
    const select = document.createElement("select");
    select.className = "select-control";
    select.dataset.questionId = question.id;
    select.setAttribute("aria-label", question.label);
    const blank = document.createElement("option");
    blank.value = "";
    blank.textContent = "Choose an option";
    select.append(blank);
    optionsFor(question).forEach((option) => {
      const element = document.createElement("option");
      element.value = option.value;
      element.textContent = option.label;
      select.append(element);
    });
    select.value = state.answers[question.id] || "";
    block.append(select);
    addHelp(block, question);
    block.append(createMessage(question));
    return block;
  }

  function renderChoiceQuestion(question) {
    const block = document.createElement("fieldset");
    block.className = "question-card";
    block.dataset.questionBlock = question.id;
    block.append(createQuestionHeading(question, true));
    addHelp(block, question);
    const grid = document.createElement("div");
    grid.className = `choice-grid${question.layout === "compact" ? " compact-choice-grid" : ""}`;
    optionsFor(question).forEach((option) => grid.append(createChoice(question, option)));
    block.append(grid, createMessage(question));
    return block;
  }

  function renderTextarea(question) {
    const block = document.createElement("div");
    block.className = "question-card";
    block.dataset.questionBlock = question.id;
    block.append(createQuestionHeading(question));
    addHelp(block, question);
    const textarea = document.createElement("textarea");
    textarea.className = "textarea-control";
    textarea.rows = 4;
    textarea.dataset.questionId = question.id;
    textarea.setAttribute("aria-label", question.label);
    textarea.value = state.answers[question.id] || "";
    block.append(textarea, createMessage(question));
    return block;
  }

  function scaleValue(value) {
    const numeric = Number(value);
    return Number.isNaN(numeric) ? value : numeric;
  }

  function renderScaleChoices(question, rowId) {
    const scale = survey.scales[question.scale] || [];
    const group = document.createElement("div");
    group.className = "matrix-number-scale";
    group.setAttribute("role", "radiogroup");
    group.setAttribute("aria-label", `${question.label}: ${question.rows.find((row) => row.id === rowId)?.label || rowId}`);
    scale.forEach((option) => {
      const label = document.createElement("label");
      label.className = "rating-choice";
      label.title = option.label;
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `${question.id}-${rowId}`;
      input.value = option.value;
      input.dataset.questionId = question.id;
      input.dataset.rowId = rowId;
      input.checked = String(state.answers[question.id]?.[rowId] ?? "") === String(option.value);
      const text = document.createElement("span");
      text.textContent = option.shortLabel || option.label;
      label.append(input, text);
      group.append(label);
    });
    return group;
  }

  function renderScaleKey(question, title) {
    const key = document.createElement("div");
    key.className = "rating-scale-key";
    const strong = document.createElement("strong");
    strong.textContent = title || question.label;
    key.append(strong);
    (survey.scales[question.scale] || []).forEach((option) => {
      const item = document.createElement("span");
      item.textContent = `${option.shortLabel || option.value} ${option.label}`;
      key.append(item);
    });
    return key;
  }

  function renderMatrix(question) {
    const block = document.createElement("fieldset");
    block.className = "question-card matrix-flat";
    block.dataset.questionBlock = question.id;
    block.append(createQuestionHeading(question, true));
    addHelp(block, question);
    block.append(renderScaleKey(question));
    const rows = document.createElement("div");
    rows.className = "matrix-flat-rows";
    question.rows.forEach((row) => {
      const line = document.createElement("div");
      line.className = "matrix-flat-row";
      const label = document.createElement("span");
      label.className = "matrix-flat-label";
      label.textContent = row.label;
      line.append(label, renderScaleChoices(question, row.id));
      rows.append(line);
    });
    block.append(rows, createMessage(question));
    return block;
  }

  function renderPairedMatrix(question) {
    const paired = questionById.get(question.pairWith);
    const showPaired = paired && isApplicable(paired);
    const block = document.createElement("fieldset");
    block.className = "question-card paired-matrix";
    block.dataset.questionBlock = question.id;
    block.append(createQuestionHeading(question, true));
    addHelp(block, question);
    const keys = document.createElement("div");
    keys.className = "paired-scale-key";
    keys.append(renderScaleKey(question, "Importance"));
    if (showPaired) keys.append(renderScaleKey(paired, "Performance"));
    block.append(keys);
    const rows = document.createElement("div");
    rows.className = "paired-matrix-rows";
    question.rows.forEach((row) => {
      const line = document.createElement("div");
      line.className = "paired-role-row";
      const title = document.createElement("h3");
      title.textContent = row.label;
      const importance = document.createElement("div");
      importance.className = "paired-rating-line";
      const importancePrompt = document.createElement("span");
      importancePrompt.className = "paired-rating-prompt";
      importancePrompt.textContent = "Importance";
      importance.append(importancePrompt, renderScaleChoices(question, row.id));
      line.append(title, importance);
      if (showPaired) {
        const performance = document.createElement("div");
        performance.className = "paired-rating-line";
        const performancePrompt = document.createElement("span");
        performancePrompt.className = "paired-rating-prompt";
        performancePrompt.textContent = "Performance";
        performance.append(performancePrompt, renderScaleChoices(paired, row.id));
        line.append(performance);
      }
      rows.append(line);
    });
    block.append(rows, createMessage(question));
    return block;
  }

  function renderQuestion(question) {
    if (question.type === "select") return renderSelect(question);
    if (question.type === "radio" || question.type === "checkbox") return renderChoiceQuestion(question);
    if (question.type === "textarea") return renderTextarea(question);
    if (question.type === "matrix" && question.presentation === "flat_pair") return renderPairedMatrix(question);
    if (question.type === "matrix") return renderMatrix(question);
    throw new Error(`Unsupported question type: ${question.type}`);
  }

  function renderSectionTabs(stage) {
    sectionTabs.replaceChildren();
    stage.pages.forEach((page, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "section-tab";
      button.dataset.pageIndex = index;
      button.dataset.current = String(index === state.activePageIndex);
      button.setAttribute("aria-current", index === state.activePageIndex ? "page" : "false");
      const number = document.createElement("span");
      number.textContent = index + 1;
      const title = document.createElement("strong");
      title.textContent = page.title;
      button.append(number, title);
      sectionTabs.append(button);
    });
  }

  function renderQuestionnaire() {
    const stage = stageById.get(state.activeStageId);
    if (!stage) return showHub();
    const page = stage.pages[state.activePageIndex];
    renderSectionTabs(stage);
    sectionStage.replaceChildren();
    const article = document.createElement("article");
    article.className = "section-page";
    article.setAttribute("aria-labelledby", `page-title-${page.id}`);
    const header = document.createElement("header");
    header.className = "section-page-head";
    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = `Stage ${stage.number}: ${stage.title}`;
    const title = document.createElement("h2");
    title.id = `page-title-${page.id}`;
    title.tabIndex = -1;
    title.textContent = page.title;
    const intro = document.createElement("p");
    intro.textContent = stage.intro;
    header.append(eyebrow, title, intro);
    const stack = document.createElement("div");
    stack.className = "question-stack";
    page.questions.filter((question) => isApplicable(question) && !question.renderedBy).forEach((question) => stack.append(renderQuestion(question)));
    article.append(header, stack);
    sectionStage.append(article);

    const progress = stageProgress(stage);
    sectionPosition.textContent = `Stage ${stage.number} of ${survey.stages.length} · Page ${state.activePageIndex + 1} of ${stage.pages.length}`;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${progress}% of this stage`;
    prevSection.disabled = state.activePageIndex === 0;
    nextSection.hidden = state.activePageIndex === stage.pages.length - 1;
    completeStage.hidden = state.activePageIndex !== stage.pages.length - 1;
    pageError.textContent = "";
    updateStageCards();
    if (focusPageHeading) {
      focusPageHeading = false;
      title.focus({ preventScroll: true });
    }
  }

  function showQuestionMessage(questionId, message) {
    const element = document.getElementById(`message-${questionId}`);
    if (element) element.textContent = message;
  }

  function updateAnswer(control) {
    const questionId = control.dataset.questionId;
    const question = questionById.get(questionId);
    if (!question) return;
    showQuestionMessage(questionId, "");

    if (question.type === "checkbox") {
      const controls = Array.from(sectionStage.querySelectorAll(`input[type="checkbox"][data-question-id="${questionId}"]`));
      if (control.checked && question.exclusiveValues?.includes(control.value)) {
        controls.forEach((item) => { if (item !== control) item.checked = false; });
      } else if (control.checked && question.exclusiveValues?.length) {
        controls.forEach((item) => { if (question.exclusiveValues.includes(item.value)) item.checked = false; });
      }
      let selected = controls.filter((item) => item.checked).map((item) => item.value);
      if (question.max && selected.length > question.max) {
        control.checked = false;
        selected = controls.filter((item) => item.checked).map((item) => item.value);
        showQuestionMessage(questionId, `Choose no more than ${question.max}.`);
      }
      state.answers[questionId] = selected;
    } else if (question.type === "matrix") {
      if (!control.checked) return;
      const answer = state.answers[questionId] && typeof state.answers[questionId] === "object" ? state.answers[questionId] : {};
      answer[control.dataset.rowId] = scaleValue(control.value);
      state.answers[questionId] = answer;
    } else if (question.type === "radio") {
      if (!control.checked) return;
      state.answers[questionId] = control.value;
    } else {
      state.answers[questionId] = control.value;
    }

    updateStageCards();
    const stage = stageById.get(state.activeStageId);
    const progress = stageProgress(stage);
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${progress}% of this stage`;
    saveDraft();
    if (routeControllers.has(questionId)) renderQuestionnaire();
  }

  function missingRequiredQuestions(stage) {
    return applicableQuestions(stage).filter((question) => question.required && !answerHasValue(state.answers[question.id]));
  }

  function findQuestionPage(stage, questionId) {
    return stage.pages.findIndex((page) => page.questions.some((question) => question.id === questionId));
  }

  function showMissingQuestion(stage, question) {
    state.activeStageId = stage.id;
    state.activePageIndex = Math.max(0, findQuestionPage(stage, question.id));
    setView("questionnaire");
    renderQuestionnaire();
    pageError.textContent = "Please answer the required question before completing this stage.";
    const block = sectionStage.querySelector(`[data-question-block="${question.id}"]`);
    block?.scrollIntoView({ block: "center", behavior: "smooth" });
    block?.querySelector("input, select, textarea")?.focus({ preventScroll: true });
  }

  function completeCurrentStage() {
    const stage = stageById.get(state.activeStageId);
    const missing = missingRequiredQuestions(stage);
    if (missing.length) return showMissingQuestion(stage, missing[0]);
    state.completedStageIds.add(stage.id);
    saveDraft(true);
    showHub();
  }

  function submissionAnswers() {
    const answers = {};
    survey.stages.forEach((stage) => stage.pages.forEach((page) => page.questions.forEach((question) => {
      if (isApplicable(question) && answerHasValue(state.answers[question.id])) answers[question.id] = clone(state.answers[question.id]);
    })));
    return answers;
  }

  function submitSurvey() {
    for (const stage of survey.stages) {
      const missing = missingRequiredQuestions(stage);
      if (missing.length) return showMissingQuestion(stage, missing[0]);
    }
    if (!survey.stages.every((stage) => state.completedStageIds.has(stage.id))) {
      pageError.textContent = "Complete all five stages before submitting.";
      return showHub();
    }
    storage.submit({
      respondentId: state.respondentId,
      startedAt: state.startedAt,
      answers: submissionAnswers(),
      routeProfile: routeProfile(),
      completedStageIds: [...state.completedStageIds]
    });
    state.hasDraft = false;
    state.activeStageId = null;
    setView("complete");
    completePanel.querySelector("h2").focus?.({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function resetQuestionnaire() {
    storage.clearDraft();
    window.clearTimeout(saveTimer);
    state.respondentId = storage.getRespondentId();
    state.startedAt = new Date().toISOString();
    state.answers = {};
    state.completedStageIds = new Set();
    state.activeStageId = null;
    state.activePageIndex = 0;
    state.hasDraft = false;
    saveStatus.textContent = "Answers save automatically";
    setView("hub");
    updateHubPanels();
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function continueDraft() {
    const stageId = state.activeStageId && stageById.has(state.activeStageId)
      ? state.activeStageId
      : survey.stages.find((stage) => !state.completedStageIds.has(stage.id))?.id || survey.stages[0].id;
    openStage(stageId, state.activePageIndex);
  }

  stageHub.addEventListener("click", (event) => {
    const card = event.target.closest("[data-stage-id]");
    if (card) openStage(card.dataset.stageId, 0);
  });

  sectionTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-page-index]");
    if (!button) return;
    state.activePageIndex = Number(button.dataset.pageIndex);
    focusPageHeading = true;
    renderQuestionnaire();
    saveDraft(true);
  });

  sectionStage.addEventListener("change", (event) => {
    if (event.target.matches("[data-question-id]")) updateAnswer(event.target);
  });

  sectionStage.addEventListener("input", (event) => {
    if (event.target.matches("textarea[data-question-id]")) updateAnswer(event.target);
  });

  prevSection.addEventListener("click", () => {
    if (state.activePageIndex <= 0) return;
    state.activePageIndex -= 1;
    focusPageHeading = true;
    renderQuestionnaire();
    saveDraft(true);
  });

  nextSection.addEventListener("click", () => {
    const stage = stageById.get(state.activeStageId);
    if (state.activePageIndex >= stage.pages.length - 1) return;
    state.activePageIndex += 1;
    focusPageHeading = true;
    renderQuestionnaire();
    saveDraft(true);
  });

  completeStage.addEventListener("click", completeCurrentStage);
  document.getElementById("returnToStages").addEventListener("click", showHub);
  document.getElementById("resumeSurvey").addEventListener("click", continueDraft);
  document.getElementById("discardDraft").addEventListener("click", resetQuestionnaire);
  document.getElementById("submitFromHub").addEventListener("click", submitSurvey);
  document.getElementById("newResponse").addEventListener("click", resetQuestionnaire);

  document.addEventListener("click", (event) => {
    const opener = event.target.closest("[data-dialog-open]");
    if (opener) document.getElementById(opener.dataset.dialogOpen)?.showModal();
    const closer = event.target.closest("[data-dialog-close]");
    if (closer) closer.closest("dialog")?.close();
  });

  versionLabel.textContent = config.buildVersion;
  setView("hub");
  updateHubPanels();
})();
