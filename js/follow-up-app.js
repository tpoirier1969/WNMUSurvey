(function () {
  "use strict";

  const config = window.WNMU_CONFIG;
  const coreSurvey = window.WNMU_SURVEY;
  const followUps = window.WNMU_FOLLOW_UPS;
  const storage = window.WNMUStorage;
  if (!config || !coreSurvey || !followUps || !storage) {
    throw new Error("Follow-up questionnaire scripts loaded in the wrong order.");
  }

  const els = {};
  let access = null;
  let coreResponse = null;
  let currentModule = null;
  let currentPageIndex = 0;
  let answers = {};
  let startedAt = null;
  let saveTimer = 0;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    Object.assign(els, {
      accessError: document.getElementById("followUpAccessError"),
      accessErrorText: document.getElementById("followUpAccessErrorText"),
      hub: document.getElementById("followUpHub"),
      questionnaire: document.getElementById("followUpQuestionnaire"),
      complete: document.getElementById("followUpComplete"),
      linkedSummary: document.getElementById("linkedCoreSummary"),
      moduleGrid: document.getElementById("followUpModuleGrid"),
      continuationLink: document.getElementById("continuationLink"),
      copyContinuationLink: document.getElementById("copyContinuationLink"),
      emailContinuationLink: document.getElementById("emailContinuationLink"),
      continuationStatus: document.getElementById("continuationStatus"),
      testResponseCount: document.getElementById("followUpTestResponseCount"),
      downloadResponses: document.getElementById("downloadFollowUpResponses"),
      moduleTitle: document.getElementById("followUpModuleTitle"),
      moduleIntro: document.getElementById("followUpModuleIntro"),
      pageTitle: document.getElementById("followUpPageTitle"),
      pagePosition: document.getElementById("followUpPagePosition"),
      progressBar: document.getElementById("followUpProgressBar"),
      questionContainer: document.getElementById("followUpQuestions"),
      prev: document.getElementById("followUpPrevious"),
      next: document.getElementById("followUpNext"),
      submit: document.getElementById("followUpSubmit"),
      saveExit: document.getElementById("followUpSaveExit"),
      moduleError: document.getElementById("followUpModuleError"),
      completeTitle: document.getElementById("followUpCompleteTitle"),
      completeMessage: document.getElementById("followUpCompleteMessage"),
      completeHub: document.getElementById("followUpCompleteHub")
    });

    access = resolveAccess();
    if (!access) {
      showAccessError(
        "This follow-up link could not be connected to a completed main questionnaire in this browser. "
        + "Use the private link shown after submitting the main questionnaire. Cross-device links will work after the production database is connected."
      );
      return;
    }

    coreResponse = storage.getResponse(access.coreResponseId);
    if (!coreResponse) {
      showAccessError(
        "The completed main questionnaire connected to this link is no longer available in this browser. "
        + "The production version will store this connection in the approved database."
      );
      return;
    }

    wireEvents();
    const requestedModule = new URLSearchParams(window.location.search).get("module");
    const module = eligibleModules().find((item) => item.id === requestedModule);
    if (module) openModule(module.id);
    else showHub();
  }

  function resolveAccess() {
    let token = continuationTokenFromHash();
    if (!token) {
      const latest = storage.getLatestFollowUpAccess();
      if (!latest) return null;
      token = latest.token;
      setContinuationHash(token);
    }
    return storage.resolveFollowUpAccess(token);
  }

  function continuationTokenFromHash() {
    return new URLSearchParams(window.location.hash.replace(/^#/, "")).get("continue");
  }

  function setContinuationHash(token) {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    params.set("continue", token);
    history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${params.toString()}`);
  }

  function wireEvents() {
    els.moduleGrid?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-module-id]");
      if (button) openModule(button.dataset.moduleId);
    });
    els.copyContinuationLink?.addEventListener("click", copyContinuationLink);
    els.downloadResponses?.addEventListener("click", downloadResponses);
    els.questionContainer?.addEventListener("change", handleInput);
    els.questionContainer?.addEventListener("input", handleInput);
    els.prev?.addEventListener("click", () => navigate(-1));
    els.next?.addEventListener("click", () => navigate(1));
    els.submit?.addEventListener("click", submitModule);
    els.saveExit?.addEventListener("click", saveAndExit);
    els.completeHub?.addEventListener("click", showHub);
    document.querySelectorAll("[data-followup-hub]").forEach((button) => {
      button.addEventListener("click", showHub);
    });
  }

  function eligibleModules() {
    return followUps.modules.filter((module) => {
      const allowed = module.eligibility?.coreChildrenRoleIn;
      return !allowed || allowed.includes(coreResponse.routeProfile?.children_role);
    });
  }

  function showAccessError(message) {
    document.title = "Follow-up link unavailable | WNMU-TV";
    if (els.accessErrorText) els.accessErrorText.textContent = message;
    showOnly("error");
  }

  function showHub() {
    if (currentModule && els.questionnaire && !els.questionnaire.hidden) saveDraftNow();
    currentModule = null;
    currentPageIndex = 0;
    answers = {};
    startedAt = null;
    document.title = "WNMU-TV Follow-up Questionnaires";
    updateUrl(null);
    renderLinkedSummary();
    renderContinuationActions();
    renderModuleGrid();
    renderTestTools();
    showOnly("hub");
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function renderLinkedSummary() {
    if (!els.linkedSummary) return;
    const submitted = coreResponse.submittedAt
      ? new Date(coreResponse.submittedAt).toLocaleString()
      : "an earlier session";
    const viewerStatus = optionLabel("viewer_status", coreResponse.routeProfile?.viewer_status);
    const priorities = corePriorityOptions()
      .filter((option) => (coreResponse.answers?.program_category_priorities || []).includes(option.value))
      .map((option) => option.label);
    const priorityText = priorities.length ? priorities.join(", ") : "No programming priorities were selected";
    els.linkedSummary.innerHTML = `
      <strong>Your main questionnaire is complete.</strong>
      <span>Submitted ${escapeHtml(submitted)}</span>
      <span>${escapeHtml(viewerStatus || "Viewer status not answered")}</span>
      <span>${escapeHtml(priorityText)}</span>
      <p>These follow-up answers will be connected to that response through a random pseudonymous respondent ID. You will not be asked to repeat the main questionnaire.</p>`;
  }

  function renderContinuationActions() {
    const url = continuationUrl();
    if (els.continuationLink) {
      els.continuationLink.value = url;
      els.continuationLink.setAttribute("aria-label", "Private follow-up link");
    }
    if (els.emailContinuationLink) {
      const subject = encodeURIComponent("My WNMU-TV follow-up questionnaire link");
      const body = encodeURIComponent(
        `Use this private link to return to the optional WNMU-TV follow-up questionnaires:\n\n${url}\n\n`
        + "In this test version, the link works in the browser where the main questionnaire was submitted."
      );
      els.emailContinuationLink.href = `mailto:?subject=${subject}&body=${body}`;
    }
  }

  function renderModuleGrid() {
    if (!els.moduleGrid) return;
    const responses = storage.getFollowUpResponses();
    els.moduleGrid.innerHTML = eligibleModules().map((module) => {
      const completed = responses.some((response) =>
        response.accessId === access.accessId && response.moduleId === module.id
      );
      const draft = storage.loadFollowUpDraft(access.accessId, module.id);
      const status = completed ? "Completed" : draft ? "Saved for later" : "Not started";
      const action = completed ? "Review answers" : draft ? "Continue" : "Begin";
      return `
        <article class="followup-module-card" data-status="${escapeAttr(status.toLowerCase().replace(/\s+/g, "-"))}">
          <div>
            <p class="followup-module-status">${escapeHtml(status)}</p>
            <h2>${escapeHtml(module.title)}</h2>
            <p>${escapeHtml(module.intro)}</p>
          </div>
          <div class="followup-module-card-footer">
            <span>${escapeHtml(module.time)}</span>
            <button class="button secondary" type="button" data-module-id="${escapeAttr(module.id)}">${escapeHtml(action)}</button>
          </div>
        </article>`;
    }).join("");
  }

  function renderTestTools() {
    const responses = storage.getFollowUpResponses()
      .filter((response) => response.accessId === access.accessId);
    if (els.testResponseCount) {
      els.testResponseCount.textContent = `${responses.length} of ${eligibleModules().length} modules submitted in this browser.`;
    }
  }

  async function copyContinuationLink() {
    const url = continuationUrl();
    try {
      await navigator.clipboard.writeText(url);
      if (els.continuationStatus) els.continuationStatus.textContent = "Private follow-up link copied.";
    } catch (error) {
      if (els.continuationLink) {
        els.continuationLink.focus();
        els.continuationLink.select();
      }
      if (els.continuationStatus) {
        els.continuationStatus.textContent = "Select and copy the private link shown above.";
      }
    }
  }

  function downloadResponses() {
    const responses = storage.getFollowUpResponses()
      .filter((response) => response.accessId === access.accessId);
    storage.downloadJson("wnmu-follow-up-test-responses.json", {
      exportedAt: new Date().toISOString(),
      respondentId: access.respondentId,
      coreResponseId: access.coreResponseId,
      followUpSchemaVersion: followUps.schemaVersion,
      responses
    });
  }

  function openModule(moduleId) {
    if (currentModule && currentModule.id !== moduleId && els.questionnaire && !els.questionnaire.hidden) {
      saveDraftNow();
    }
    const module = eligibleModules().find((item) => item.id === moduleId);
    if (!module) return showHub();
    currentModule = module;
    const submitted = storage.getFollowUpResponse(access.accessId, module.id);
    const draft = storage.loadFollowUpDraft(access.accessId, module.id);
    const saved = draft || submitted || {};
    answers = clone(saved.answers || {});
    currentPageIndex = Math.min(Number(saved.currentPageIndex || 0), module.pages.length - 1);
    startedAt = saved.startedAt || new Date().toISOString();
    updateUrl(module.id);
    renderModulePage();
    showOnly("questionnaire");
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function renderModulePage() {
    const page = currentModule.pages[currentPageIndex];
    if (!page) return showHub();
    document.title = `${currentModule.title} | WNMU-TV Follow-up`;
    if (els.moduleTitle) els.moduleTitle.textContent = currentModule.title;
    if (els.moduleIntro) els.moduleIntro.textContent = currentModule.intro;
    if (els.pageTitle) els.pageTitle.textContent = page.title;
    if (els.pagePosition) els.pagePosition.textContent = `Page ${currentPageIndex + 1} of ${currentModule.pages.length}`;
    if (els.progressBar) els.progressBar.style.width = `${((currentPageIndex + 1) / currentModule.pages.length) * 100}%`;
    if (els.moduleError) els.moduleError.textContent = "";
    if (els.questionContainer) {
      els.questionContainer.innerHTML = page.questions.map((question, index) =>
        renderQuestion(question, index + 1)
      ).join("");
    }
    if (els.prev) els.prev.disabled = currentPageIndex === 0;
    if (els.next) els.next.hidden = currentPageIndex >= currentModule.pages.length - 1;
    if (els.submit) els.submit.hidden = currentPageIndex < currentModule.pages.length - 1;
  }

  function renderQuestion(question, number) {
    const value = answers[question.id];
    const options = resolveOptions(question);
    const help = question.help ? `<p class="question-help">${escapeHtml(question.help)}</p>` : "";
    let control = "";

    if (question.type === "textarea") {
      control = `<textarea class="textarea-control" rows="5" data-question-id="${escapeAttr(question.id)}">${escapeHtml(value || "")}</textarea>`;
    } else {
      const inputType = question.type === "checkbox" ? "checkbox" : "radio";
      const checkedValues = Array.isArray(value) ? value : [value];
      control = `<div class="choice-grid ${options.length <= 6 ? "compact-choice-grid" : ""}">`
        + options.map((option) => `
          <label class="choice">
            <input type="${inputType}" name="${escapeAttr(question.id)}" value="${escapeAttr(option.value)}"
              data-question-id="${escapeAttr(question.id)}"
              ${checkedValues.includes(option.value) || checkedValues.includes(Number(option.value)) ? "checked" : ""}>
            <span>${escapeHtml(option.label)}</span>
          </label>`).join("")
        + `</div>`;
    }

    return `
      <fieldset class="question-card followup-question-card"
        data-question-block="${escapeAttr(question.id)}"
        data-max="${escapeAttr(question.max || "")}"
        data-exclusive="${escapeAttr((question.exclusiveValues || []).join(","))}">
        <legend>
          <span class="question-number">${number}</span>
          <span class="question-label">${escapeHtml(question.label)}</span>
          <span class="optional-badge">Optional</span>
        </legend>
        ${help}
        ${control}
        <p class="question-message" aria-live="polite"></p>
      </fieldset>`;
  }

  function resolveOptions(question) {
    if (question.optionsFromCorePriorities) {
      const selected = coreResponse.answers?.program_category_priorities || [];
      const options = corePriorityOptions();
      const selectedOptions = options.filter((option) => selected.includes(option.value));
      return selectedOptions.length ? selectedOptions : options;
    }
    return question.options || [];
  }

  function corePriorityOptions() {
    const question = coreSurvey.stages
      .flatMap((stage) => stage.pages.flatMap((page) => page.questions))
      .find((item) => item.id === "program_category_priorities");
    if (question?.options) return question.options;
    if (question?.optionsFromMatrix) {
      const matrix = coreSurvey.stages
        .flatMap((stage) => stage.pages.flatMap((page) => page.questions))
        .find((item) => item.id === question.optionsFromMatrix);
      return (matrix?.rows || []).map((row) => ({ value: row.id, label: row.label }));
    }
    return [];
  }

  function optionLabel(questionId, value) {
    const question = coreSurvey.stages
      .flatMap((stage) => stage.pages.flatMap((page) => page.questions))
      .find((item) => item.id === questionId);
    return question?.options?.find((option) => option.value === value)?.label || value || "";
  }

  function handleInput(event) {
    const input = event.target;
    const questionId = input.dataset.questionId;
    if (!questionId || !currentModule) return;
    const question = currentModule.pages
      .flatMap((page) => page.questions)
      .find((item) => item.id === questionId);
    if (!question) return;
    const block = input.closest("[data-question-block]");

    if (input.type === "checkbox") {
      enforceExclusive(input, block);
      if (!enforceMax(input, block)) return;
      answers[questionId] = Array.from(
        block.querySelectorAll(`input[type="checkbox"][data-question-id="${cssEscape(questionId)}"]:checked`)
      ).map((item) => item.value);
    } else {
      answers[questionId] = input.value;
    }

    block?.querySelector(".question-message")?.replaceChildren();
    scheduleSave();
  }

  function enforceExclusive(input, block) {
    if (!block || !input.checked) return;
    const exclusive = String(block.dataset.exclusive || "").split(",").filter(Boolean);
    if (!exclusive.length) return;
    const boxes = Array.from(block.querySelectorAll('input[type="checkbox"]'));
    if (exclusive.includes(input.value)) {
      boxes.forEach((box) => {
        if (box !== input) box.checked = false;
      });
    } else {
      boxes.forEach((box) => {
        if (exclusive.includes(box.value)) box.checked = false;
      });
    }
  }

  function enforceMax(input, block) {
    if (!block || !input.checked) return true;
    const max = Number(block.dataset.max || 0);
    if (!max) return true;
    const checked = block.querySelectorAll('input[type="checkbox"]:checked');
    if (checked.length <= max) return true;
    input.checked = false;
    const message = block.querySelector(".question-message");
    if (message) message.textContent = `Choose no more than ${max}.`;
    return false;
  }

  function navigate(direction) {
    if (!currentModule) return;
    saveDraftNow();
    currentPageIndex = Math.max(
      0,
      Math.min(currentModule.pages.length - 1, currentPageIndex + direction)
    );
    renderModulePage();
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }

  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = window.setTimeout(saveDraftNow, 350);
  }

  function saveDraftNow() {
    clearTimeout(saveTimer);
    saveTimer = 0;
    if (!currentModule) return;
    storage.saveFollowUpDraft(access, currentModule.id, {
      answers: clone(answers),
      currentPageIndex,
      startedAt
    });
  }

  function saveAndExit() {
    saveDraftNow();
    showHub();
  }

  function submitModule() {
    if (!currentModule) return;
    clearTimeout(saveTimer);
    saveTimer = 0;
    const response = storage.saveFollowUpResponse(access, currentModule.id, {
      answers: clone(answers),
      startedAt
    });
    if (els.completeTitle) els.completeTitle.textContent = `${currentModule.title} submitted`;
    if (els.completeMessage) {
      els.completeMessage.textContent =
        "Your main questionnaire remains complete, and this follow-up response has been linked to it. "
        + "You may choose another topic now or return later using your private link.";
    }
    showOnly("complete");
    window.scrollTo({ top: 0, behavior: "auto" });
    return response;
  }

  function updateUrl(moduleId) {
    const url = new URL(window.location.href);
    if (moduleId) url.searchParams.set("module", moduleId);
    else url.searchParams.delete("module");
    const hash = new URLSearchParams();
    hash.set("continue", access.token);
    url.hash = hash.toString();
    history.replaceState(null, "", url);
  }

  function continuationUrl() {
    const url = new URL("follow-up.html", window.location.href);
    const hash = new URLSearchParams();
    hash.set("continue", access.token);
    url.hash = hash.toString();
    return url.href;
  }

  function showOnly(name) {
    if (els.accessError) els.accessError.hidden = name !== "error";
    if (els.hub) els.hub.hidden = name !== "hub";
    if (els.questionnaire) els.questionnaire.hidden = name !== "questionnaire";
    if (els.complete) els.complete.hidden = name !== "complete";
  }

  function prefersReducedMotion() {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
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
