(function () {
  "use strict";

  const survey = window.WNMU_SURVEY;
  const storage = window.WNMUStorage;

  const state = {
    stage: "welcome",
    routeProfile: {},
    answers: {},
    routeSectionIds: [],
    currentSectionIndex: 0,
    startedAt: null
  };

  const els = {};
  let saveTimer = null;
  let transitionTimer = null;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    Object.assign(els, {
      welcomePanel: document.getElementById("welcomePanel"),
      routingPanel: document.getElementById("routingPanel"),
      questionnairePanel: document.getElementById("questionnairePanel"),
      completePanel: document.getElementById("completePanel"),
      routingQuestions: document.getElementById("routingQuestions"),
      routingError: document.getElementById("routingError"),
      sectionTabs: document.getElementById("sectionTabs"),
      sectionStage: document.getElementById("sectionStage"),
      progressBar: document.getElementById("progressBar"),
      progressText: document.getElementById("progressText"),
      sectionPosition: document.getElementById("sectionPosition"),
      saveStatus: document.getElementById("saveStatus"),
      prevSection: document.getElementById("prevSection"),
      nextSection: document.getElementById("nextSection"),
      submitSurvey: document.getElementById("submitSurvey"),
      changeRoute: document.getElementById("changeRoute"),
      resumeBlock: document.getElementById("resumeBlock"),
      resumeDetails: document.getElementById("resumeDetails")
    });

    document.getElementById("startSurvey").addEventListener("click", startRouting);
    document.getElementById("resumeSurvey").addEventListener("click", resumeDraft);
    document.getElementById("discardDraft").addEventListener("click", discardDraft);
    document.getElementById("routingBack").addEventListener("click", () => showStage("welcome"));
    document.getElementById("continueSurvey").addEventListener("click", beginQuestionnaire);
    document.getElementById("newResponse").addEventListener("click", startNewResponse);
    els.prevSection.addEventListener("click", () => navigateSection(-1));
    els.nextSection.addEventListener("click", () => navigateSection(1));
    els.submitSurvey.addEventListener("click", submitSurvey);
    els.changeRoute.addEventListener("click", changeRoutingAnswers);

    [els.routingQuestions, els.sectionStage].forEach((container) => {
      container.addEventListener("change", handleInput);
      container.addEventListener("input", handleInput);
    });

    renderRoutingQuestions();
    updateResumeBlock();
    showStage("welcome");
  }

  function showStage(stageName) {
    state.stage = stageName;
    const map = {
      welcome: els.welcomePanel,
      routing: els.routingPanel,
      questionnaire: els.questionnairePanel,
      complete: els.completePanel
    };

    Object.entries(map).forEach(([name, panel]) => {
      panel.hidden = name !== stageName;
    });

    if (stageName !== "welcome") {
      document.getElementById("surveyApp").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function startRouting() {
    if (!state.startedAt) state.startedAt = new Date().toISOString();
    renderRoutingQuestions();
    showStage("routing");
  }

  function startNewResponse() {
    Object.assign(state, {
      stage: "welcome",
      routeProfile: {},
      answers: {},
      routeSectionIds: [],
      currentSectionIndex: 0,
      startedAt: new Date().toISOString()
    });
    storage.clearDraft();
    renderRoutingQuestions();
    showStage("welcome");
    updateResumeBlock();
  }

  function discardDraft() {
    if (!window.confirm("Discard the saved draft in this browser? Submitted responses will not be affected.")) return;
    storage.clearDraft();
    Object.assign(state, {
      stage: "welcome",
      routeProfile: {},
      answers: {},
      routeSectionIds: [],
      currentSectionIndex: 0,
      startedAt: null
    });
    renderRoutingQuestions();
    updateResumeBlock();
    showStage("welcome");
  }

  function resumeDraft() {
    const draft = storage.loadDraft();
    if (!draft) {
      updateResumeBlock();
      return;
    }

    state.routeProfile = draft.routeProfile || {};
    state.answers = draft.answers || {};
    state.routeSectionIds = buildRoute().map((section) => section.id);
    state.currentSectionIndex = Math.min(
      Number.isInteger(draft.currentSectionIndex) ? draft.currentSectionIndex : 0,
      Math.max(state.routeSectionIds.length - 1, 0)
    );
    state.startedAt = draft.startedAt || new Date().toISOString();

    if (draft.stage === "routing") {
      renderRoutingQuestions();
      showStage("routing");
    } else {
      showStage("questionnaire");
      renderSection(state.currentSectionIndex, 0);
    }
  }

  function updateResumeBlock() {
    const draft = storage.loadDraft();
    if (!draft) {
      els.resumeBlock.hidden = true;
      return;
    }

    els.resumeBlock.hidden = false;
    const updated = draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : "an earlier session";
    els.resumeDetails.textContent = `Saved ${updated}`;
  }

  function renderRoutingQuestions() {
    els.routingQuestions.innerHTML = survey.routingQuestions
      .map((question, index) => renderQuestion(question, state.routeProfile[question.id], index + 1, true))
      .join("");
    els.routingError.textContent = "";
  }

  function validateRouting() {
    const missing = survey.routingQuestions.filter((question) => {
      if (!question.required) return false;
      const value = state.routeProfile[question.id];
      return Array.isArray(value) ? value.length === 0 : value === undefined || value === null || value === "";
    });

    if (!missing.length) return true;
    els.routingError.textContent = "Please answer the required questions before continuing.";
    const first = els.routingQuestions.querySelector(`[data-question-block="${missing[0].id}"]`);
    if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
    return false;
  }

  function beginQuestionnaire() {
    if (!validateRouting()) return;
    state.routeSectionIds = buildRoute().map((section) => section.id);
    state.currentSectionIndex = 0;
    showStage("questionnaire");
    renderSection(0, 1);
    saveDraft(false, "questionnaire");
  }

  function changeRoutingAnswers() {
    renderRoutingQuestions();
    showStage("routing");
  }

  function buildRoute() {
    return buildRouteFromProfile(state.routeProfile);
  }

  function buildRouteFromProfile(profile) {
    const oldProfile = state.routeProfile;
    state.routeProfile = profile;
    const route = survey.sections.filter((section) => matchesCondition(section.when));
    state.routeProfile = oldProfile;
    return route;
  }

  function visibleQuestions(section) {
    return section.questions.filter((question) => matchesCondition(question.when));
  }

  function matchesCondition(condition) {
    if (!condition) return true;
    const profile = state.routeProfile || {};
    const answers = state.answers || {};

    if (condition.all && !condition.all.every(matchesCondition)) return false;
    if (condition.any && !condition.any.some(matchesCondition)) return false;

    if (condition.viewerStatusIn && !condition.viewerStatusIn.includes(profile.viewer_status)) return false;
    if (condition.viewerStatusNotIn && condition.viewerStatusNotIn.includes(profile.viewer_status)) return false;

    if (condition.hasAnyMethod) {
      const methods = profile.viewing_methods || [];
      if (!condition.hasAnyMethod.some((method) => methods.includes(method))) return false;
    }

    if (condition.hasAnyRelationship) {
      const relationships = profile.station_relationships || [];
      if (!condition.hasAnyRelationship.some((value) => relationships.includes(value))) return false;
    }

    if (condition.childrenRoleIn && !condition.childrenRoleIn.includes(profile.children_role)) return false;

    if (condition.answerIn) {
      const value = answers[condition.answerIn.id];
      if (!condition.answerIn.values.includes(value)) return false;
    }

    if (condition.answerNotIn) {
      const value = answers[condition.answerNotIn.id];
      if (condition.answerNotIn.values.includes(value)) return false;
    }

    return true;
  }

  function getCurrentRoute() {
    const route = buildRoute();
    state.routeSectionIds = route.map((section) => section.id);
    return route;
  }

  function renderSection(index, direction) {
    const route = getCurrentRoute();
    if (!route.length) return;
    state.currentSectionIndex = Math.max(0, Math.min(index, route.length - 1));
    const section = route[state.currentSectionIndex];
    const questions = visibleQuestions(section);
    const content = `
      <article class="section-page" aria-labelledby="section-title-${escapeAttr(section.id)}">
        <header class="section-page-head">
          <p class="eyebrow">${escapeHtml(section.eyebrow)}</p>
          <h2 id="section-title-${escapeAttr(section.id)}">${escapeHtml(section.title)}</h2>
          <p>${escapeHtml(section.intro || "")}</p>
        </header>
        <div class="question-stack">
          ${questions.map((question, questionIndex) => renderQuestion(question, state.answers[question.id], questionIndex + 1, false)).join("")}
        </div>
      </article>
    `;

    clearTimeout(transitionTimer);
    if (!els.sectionStage.innerHTML || direction === 0) {
      els.sectionStage.innerHTML = content;
      els.sectionStage.className = "section-stage";
    } else {
      els.sectionStage.className = direction > 0 ? "section-stage exit-left" : "section-stage exit-right";
      transitionTimer = window.setTimeout(() => {
        els.sectionStage.innerHTML = content;
        els.sectionStage.className = direction > 0 ? "section-stage enter-right" : "section-stage enter-left";
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            els.sectionStage.className = "section-stage";
          });
        });
      }, 180);
    }

    renderSectionTabs(route);
    updateProgress(route);
    updateNavigation(route);
    saveDraft(false, "questionnaire");

    window.setTimeout(() => {
      const heading = els.sectionStage.querySelector("h2");
      if (heading) heading.focus({ preventScroll: true });
      document.getElementById("questionnairePanel").scrollIntoView({ behavior: "smooth", block: "start" });
    }, direction === 0 ? 0 : 210);
  }

  function renderSectionTabs(route) {
    els.sectionTabs.innerHTML = route
      .map((section, index) => {
        const current = index === state.currentSectionIndex;
        const completed = index < state.currentSectionIndex;
        return `<button type="button" class="section-tab${current ? " current" : ""}${completed ? " completed" : ""}" data-section-index="${index}" ${current ? 'aria-current="step"' : ""}><span>${index + 1}</span>${escapeHtml(section.shortTitle || section.title)}</button>`;
      })
      .join("");

    els.sectionTabs.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        const targetIndex = Number(button.dataset.sectionIndex);
        const direction = targetIndex > state.currentSectionIndex ? 1 : -1;
        renderSection(targetIndex, direction);
      });
    });
  }

  function updateProgress(route) {
    const percent = Math.round(((state.currentSectionIndex + 1) / route.length) * 100);
    els.progressBar.style.width = `${percent}%`;
    els.progressText.textContent = `${percent}% complete`;
    els.sectionPosition.textContent = `Section ${state.currentSectionIndex + 1} of ${route.length}`;
  }

  function updateNavigation(route) {
    els.prevSection.disabled = state.currentSectionIndex === 0;
    const isLast = state.currentSectionIndex === route.length - 1;
    els.nextSection.hidden = isLast;
    els.submitSurvey.hidden = !isLast;
  }

  function navigateSection(delta) {
    const route = getCurrentRoute();
    const target = state.currentSectionIndex + delta;
    if (target < 0 || target >= route.length) return;
    renderSection(target, delta);
  }

  function renderQuestion(question, value, number, routing) {
    const questionOptions = resolveOptions(question);
    const optional = !question.required || question.optionalLabel;
    const help = question.help ? `<p class="question-help">${escapeHtml(question.help)}</p>` : "";
    const badge = optional ? '<span class="optional-badge">Optional</span>' : '<span class="required-badge">Required</span>';
    const context = routing ? "route" : "answers";

    let control = "";

    if (question.type === "radio") {
      control = `<div class="choice-grid">${questionOptions.map((option) => choiceMarkup(question, option, value, "radio", context)).join("")}</div>`;
    } else if (question.type === "checkbox") {
      const selected = Array.isArray(value) ? value : [];
      control = `<div class="choice-grid">${questionOptions.map((option) => choiceMarkup(question, option, selected, "checkbox", context)).join("")}</div>`;
    } else if (question.type === "select") {
      control = `<select class="select-control" data-question-id="${escapeAttr(question.id)}" data-context="${context}">
        <option value="">Choose an option</option>
        ${questionOptions.map((option) => `<option value="${escapeAttr(option.value)}" ${String(value) === String(option.value) ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}
      </select>`;
    } else if (question.type === "text") {
      control = `<input class="text-control" type="text" value="${escapeAttr(value || "")}" data-question-id="${escapeAttr(question.id)}" data-context="${context}" />`;
    } else if (question.type === "textarea") {
      control = `<textarea class="text-control textarea-control" rows="4" data-question-id="${escapeAttr(question.id)}" data-context="${context}">${escapeHtml(value || "")}</textarea>`;
    } else if (question.type === "scale") {
      control = `<div class="scale-row">${survey.scales[question.scale].map((option) => choiceMarkup(question, option, value, "radio", context, true)).join("")}</div>`;
    } else if (question.type === "matrix") {
      control = renderMatrix(question, value || {}, context);
    }

    return `
      <fieldset class="question-card" data-question-block="${escapeAttr(question.id)}" data-max="${question.max || ""}" data-exclusive="${escapeAttr((question.exclusiveValues || []).join(","))}">
        <legend>
          <span class="question-number">${number}</span>
          <span class="question-label">${escapeHtml(question.label)}</span>
          ${badge}
        </legend>
        ${help}
        ${control}
        <p class="question-message" aria-live="polite"></p>
      </fieldset>
    `;
  }

  function choiceMarkup(question, option, selectedValue, type, context, compact) {
    const checked = type === "checkbox"
      ? Array.isArray(selectedValue) && selectedValue.map(String).includes(String(option.value))
      : String(selectedValue) === String(option.value);
    const name = type === "radio" ? question.id : `${question.id}[]`;
    const className = compact ? "choice scale-choice" : "choice";
    return `
      <label class="${className}">
        <input type="${type}" name="${escapeAttr(name)}" value="${escapeAttr(option.value)}" data-question-id="${escapeAttr(question.id)}" data-context="${context}" ${checked ? "checked" : ""} />
        <span>${escapeHtml(option.label)}</span>
      </label>
    `;
  }

  function renderMatrix(question, values, context) {
    const scale = survey.scales[question.scale];
    return `
      <div class="matrix-wrap">
        <table class="matrix-table">
          <thead>
            <tr>
              <th scope="col">Area</th>
              ${scale.map((option) => `<th scope="col">${escapeHtml(shortScaleLabel(option.label))}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${question.rows.map((row) => `
              <tr>
                <th scope="row">${escapeHtml(row.label)}</th>
                ${scale.map((option) => {
                  const checked = String(values[row.id]) === String(option.value);
                  return `<td><label class="matrix-choice"><input type="radio" name="${escapeAttr(question.id)}__${escapeAttr(row.id)}" value="${escapeAttr(option.value)}" data-question-id="${escapeAttr(question.id)}" data-row-id="${escapeAttr(row.id)}" data-context="${context}" ${checked ? "checked" : ""} /><span class="sr-only">${escapeHtml(row.label)}: ${escapeHtml(option.label)}</span></label></td>`;
                }).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function resolveOptions(question) {
    if (question.options) return question.options;
    if (question.optionsFromMatrix) {
      for (const section of survey.sections) {
        const matrix = section.questions.find((item) => item.id === question.optionsFromMatrix);
        if (matrix && matrix.rows) return matrix.rows.map((row) => ({ value: row.id, label: row.label }));
      }
    }
    return [];
  }

  function shortScaleLabel(label) {
    const replacements = {
      "Not important": "Not",
      "Slightly important": "Slightly",
      "Moderately important": "Moderately",
      "Very important": "Very",
      "Essential": "Essential",
      "Not sure": "Not sure",
      "Poor": "Poor",
      "Weak": "Weak",
      "Adequate": "Adequate",
      "Good": "Good",
      "Excellent": "Excellent",
      "Not familiar enough to rate": "Not familiar",
      "Not interested": "Not",
      "Slightly interested": "Slightly",
      "Moderately interested": "Moderately",
      "Very interested": "Very",
      "Extremely interested": "Extremely"
    };
    return replacements[label] || label;
  }

  function handleInput(event) {
    const target = event.target;
    if (!target.dataset.questionId) return;

    const questionId = target.dataset.questionId;
    const context = target.dataset.context === "route" ? state.routeProfile : state.answers;
    const question = findQuestion(questionId);
    const block = target.closest("[data-question-block]");

    if (target.type === "checkbox") {
      enforceExclusive(target, block);
      if (!enforceMax(target, block)) return;
      context[questionId] = Array.from(block.querySelectorAll(`input[type="checkbox"][data-question-id="${cssEscape(questionId)}"]:checked`)).map((input) => input.value);
    } else if (target.dataset.rowId) {
      context[questionId] = context[questionId] || {};
      context[questionId][target.dataset.rowId] = parseScaleValue(target.value);
    } else {
      context[questionId] = target.type === "radio" && question && question.type === "scale"
        ? parseScaleValue(target.value)
        : target.value;
    }

    if (block) {
      const message = block.querySelector(".question-message");
      if (message) message.textContent = "";
    }

    scheduleSave();

    if (target.dataset.context !== "route" && currentSectionHasAnswerConditions()) {
      const active = document.activeElement;
      const activeQuestion = active && active.dataset ? active.dataset.questionId : null;
      renderSection(state.currentSectionIndex, 0);
      if (activeQuestion) {
        const nextFocus = els.sectionStage.querySelector(`[data-question-id="${cssEscape(activeQuestion)}"]`);
        if (nextFocus) nextFocus.focus({ preventScroll: true });
      }
    }
  }

  function currentSectionHasAnswerConditions() {
    const route = getCurrentRoute();
    const section = route[state.currentSectionIndex];
    if (!section) return false;
    return section.questions.some((question) => question.when && (question.when.answerIn || question.when.answerNotIn));
  }

  function enforceExclusive(target, block) {
    if (!block) return;
    const exclusive = (block.dataset.exclusive || "").split(",").filter(Boolean);
    if (!exclusive.length || !target.checked) return;

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
    const message = block.querySelector(".question-message");
    if (message) message.textContent = `Choose no more than ${max}.`;
    return false;
  }

  function findQuestion(questionId) {
    const routeQuestion = survey.routingQuestions.find((question) => question.id === questionId);
    if (routeQuestion) return routeQuestion;
    for (const section of survey.sections) {
      const question = section.questions.find((item) => item.id === questionId);
      if (question) return question;
    }
    return null;
  }

  function scheduleSave() {
    clearTimeout(saveTimer);
    els.saveStatus.textContent = "Saving draft…";
    saveTimer = window.setTimeout(() => saveDraft(false), 350);
  }

  function saveDraft(showMessage, forcedStage) {
    if (!state.startedAt) state.startedAt = new Date().toISOString();
    const payload = {
      stage: forcedStage || state.stage,
      routeProfile: state.routeProfile,
      answers: state.answers,
      routeSectionIds: buildRoute().map((section) => section.id),
      currentSectionIndex: state.currentSectionIndex,
      startedAt: state.startedAt
    };
    const saved = storage.saveDraft(payload);
    if (els.saveStatus) {
      els.saveStatus.textContent = `Draft saved ${new Date(saved.updatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
    }
    if (showMessage) {
      window.setTimeout(() => {
        if (els.saveStatus) els.saveStatus.textContent = "Draft saved in this browser";
      }, 1200);
    }
    updateResumeBlock();
  }

  function submitSurvey() {
    saveDraft(false, "questionnaire");
    const draft = storage.loadDraft();
    const response = storage.saveResponse(draft);
    storage.clearDraft();
    showStage("complete");
    updateResumeBlock();
    console.info("Saved local WNMU survey response", response.id);
  }

  function optionLabels(question) {
    return (question.options || []).reduce((map, option) => {
      map[option.value] = option.label;
      return map;
    }, {});
  }

  function parseScaleValue(value) {
    if (value === "na") return "na";
    const numeric = Number(value);
    return Number.isNaN(numeric) ? value : numeric;
  }

  function dateStamp() {
    return new Date().toISOString().slice(0, 10);
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
    if (window.CSS && typeof window.CSS.escape === "function") return window.CSS.escape(value);
    return String(value).replace(/([ #;?%&,.+*~\\':"!^$[\]()=>|/@])/g, "\\$1");
  }
})();
