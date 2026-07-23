(function () {
  "use strict";

  const config = window.WNMU_CONFIG;
  const coreSurvey = window.WNMU_SURVEY;
  const followUps = window.WNMU_FOLLOW_UPS;
  const storage = window.WNMUStorage;
  if (!config || !coreSurvey || !followUps || !storage) throw new Error("Follow-up questionnaire scripts loaded in the wrong order.");

  const moduleSummaries = Object.freeze({
    "local-programming": "Regional subjects, voices, geographic priorities, and ideas.",
    "programming-ideas": "Program subjects, qualities, lengths, and new ideas.",
    "online-viewing": "WNMU online viewing, Passport, and viewer support.",
    "children-education": "Children's learning needs, regional topics, and resources.",
    communication: "Schedules, reminders, and finding programs."
  });

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
    [
      "followUpAccessError", "followUpAccessErrorText", "followUpHub", "followUpQuestionnaire", "followUpComplete",
      "linkedCoreSummary", "followUpModuleGrid", "continuationLink", "copyContinuationLink", "emailContinuationLink",
      "continuationStatus", "followUpTestResponseCount", "downloadFollowUpResponses", "followUpModuleTitle",
      "followUpModuleIntro", "followUpPageTitle", "followUpPageIntro", "followUpPageContext", "followUpPagePosition",
      "followUpProgressBar", "followUpQuestions", "followUpPrevious", "followUpNext", "followUpSubmit",
      "followUpSaveExit", "followUpModuleError", "followUpCompleteTitle", "followUpCompleteMessage", "followUpCompleteHub"
    ].forEach((id) => { els[id] = document.getElementById(id); });

    access = resolveAccess();
    if (!access) return showAccessError("This follow-up link could not be connected to a completed main questionnaire in this browser. Use the private link shown after submitting the main questionnaire.");
    coreResponse = storage.getResponse(access.coreResponseId);
    if (!coreResponse) return showAccessError("The completed main questionnaire connected to this link is no longer available in this browser.");

    wireEvents();
    const requested = new URLSearchParams(location.search).get("module");
    const module = eligibleModules().find((item) => item.id === requested);
    module ? openModule(module.id) : showHub();
  }

  function resolveAccess() {
    let token = new URLSearchParams(location.hash.replace(/^#/, "")).get("continue");
    if (!token) {
      const latest = storage.getLatestFollowUpAccess();
      if (!latest) return null;
      token = latest.token;
      const hash = new URLSearchParams();
      hash.set("continue", token);
      history.replaceState(null, "", `${location.pathname}${location.search}#${hash}`);
    }
    return storage.resolveFollowUpAccess(token);
  }

  function wireEvents() {
    els.followUpModuleGrid?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-module-id]");
      if (button) openModule(button.dataset.moduleId);
    });
    els.copyContinuationLink?.addEventListener("click", copyContinuationLink);
    els.downloadFollowUpResponses?.addEventListener("click", downloadResponses);
    els.followUpQuestions?.addEventListener("change", handleInput);
    els.followUpQuestions?.addEventListener("input", handleInput);
    els.followUpPrevious?.addEventListener("click", () => navigate(-1));
    els.followUpNext?.addEventListener("click", () => navigate(1));
    els.followUpSubmit?.addEventListener("click", submitModule);
    els.followUpSaveExit?.addEventListener("click", saveAndExit);
    els.followUpCompleteHub?.addEventListener("click", showHub);
    document.querySelectorAll("[data-followup-hub]").forEach((button) => button.addEventListener("click", showHub));
  }

  function eligibleModules() {
    return followUps.modules.filter((module) => {
      const allowed = module.eligibility?.coreChildrenRoleIn;
      return !allowed || allowed.includes(coreResponse.routeProfile?.children_role);
    });
  }

  function questionIsApplicable(question) {
    const allowed = question.when?.coreChildrenRoleIn;
    return !allowed || allowed.includes(coreResponse.routeProfile?.children_role);
  }

  function applicableQuestions(page) {
    return page.questions.filter(questionIsApplicable);
  }

  function showAccessError(message) {
    document.title = "Follow-up link unavailable | WNMU-TV";
    if (els.followUpAccessErrorText) els.followUpAccessErrorText.textContent = message;
    showOnly("error");
  }

  function showHub() {
    if (currentModule && !els.followUpQuestionnaire?.hidden) saveDraftNow();
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
    scrollToTop();
  }

  function renderLinkedSummary() {
    const submitted = coreResponse.submittedAt ? new Date(coreResponse.submittedAt).toLocaleString() : "an earlier session";
    const status = coreOptionLabel("viewer_status", coreResponse.routeProfile?.viewer_status) || "Viewer status not answered";
    const priorities = selectedCorePriorities().map((option) => option.label);
    els.linkedCoreSummary.innerHTML = `<strong>Main questionnaire complete</strong><span>Submitted ${escapeHtml(submitted)}</span><span>${escapeHtml(status)}</span><span>${escapeHtml(priorities.length ? priorities.join(", ") : "No programming priorities selected")}</span><p>Follow-ups stay linked without using your name or email.</p>`;
  }

  function renderContinuationActions() {
    const url = continuationUrl();
    els.continuationLink.value = url;
    els.continuationLink.setAttribute("aria-label", "Private follow-up link");
    const subject = encodeURIComponent("My WNMU-TV follow-up questionnaire link");
    const body = encodeURIComponent(`Use this private link to return to the optional WNMU-TV follow-up questionnaires:\n\n${url}\n\nIn this test version, the link works in the browser where the main questionnaire was submitted.`);
    els.emailContinuationLink.href = `mailto:?subject=${subject}&body=${body}`;
  }

  function renderModuleGrid() {
    const submitted = storage.getFollowUpResponses(true);
    els.followUpModuleGrid.innerHTML = eligibleModules().map((module) => {
      const completed = submitted.some((response) => response.accessId === access.accessId && response.moduleId === module.id && response.followUpSchemaVersion === followUps.schemaVersion);
      const draft = storage.loadFollowUpDraft(access.accessId, module.id);
      const status = completed ? "Completed" : draft ? "Saved for later" : "Not started";
      const action = completed ? "Review" : draft ? "Continue" : "Begin";
      const summary = moduleSummaries[module.id] || module.intro;
      return `<article class="followup-module-card" data-status="${escapeAttr(status.toLowerCase().replace(/\s+/g, "-"))}"><div><p class="followup-module-status">${status}</p><h2>${escapeHtml(module.title)}</h2><p>${escapeHtml(summary)}</p></div><div class="followup-module-card-footer"><span>${escapeHtml(module.time)}</span><button class="button secondary" type="button" data-module-id="${escapeAttr(module.id)}">${action}</button></div></article>`;
    }).join("");
  }

  function renderTestTools() {
    const count = storage.getFollowUpResponses(true).filter((response) => response.accessId === access.accessId && response.followUpSchemaVersion === followUps.schemaVersion).length;
    els.followUpTestResponseCount.textContent = `${count} of ${eligibleModules().length} modules submitted in this browser for ${followUps.schemaVersion}.`;
  }

  async function copyContinuationLink() {
    const url = continuationUrl();
    try {
      await navigator.clipboard.writeText(url);
      els.continuationStatus.textContent = "Private link copied.";
    } catch (error) {
      els.continuationLink.focus();
      els.continuationLink.select();
      els.continuationStatus.textContent = "Select and copy the link above.";
    }
  }

  function downloadResponses() {
    const responses = storage.getFollowUpResponses(true).filter((response) => response.accessId === access.accessId && response.followUpSchemaVersion === followUps.schemaVersion);
    storage.downloadJson(`wnmu-rebuild-follow-up-responses-${new Date().toISOString().slice(0, 10)}.json`, {
      accessId: access.accessId,
      respondentId: access.respondentId,
      coreResponseId: access.coreResponseId,
      coreSchemaVersion: access.coreSchemaVersion,
      followUpSchemaVersion: followUps.schemaVersion,
      responses
    });
  }

  function openModule(moduleId) {
    if (currentModule && currentModule.id !== moduleId && !els.followUpQuestionnaire.hidden) saveDraftNow();
    currentModule = eligibleModules().find((item) => item.id === moduleId);
    if (!currentModule) return showHub();
    const saved = storage.loadFollowUpDraft(access.accessId, moduleId) || storage.getFollowUpResponse(access.accessId, moduleId) || {};
    answers = clone(saved.answers || {});
    currentPageIndex = Math.min(Number(saved.currentPageIndex || 0), currentModule.pages.length - 1);
    startedAt = saved.startedAt || new Date().toISOString();
    updateUrl(moduleId);
    renderModulePage();
    showOnly("questionnaire");
    scrollToTop();
  }

  function renderModulePage() {
    const page = currentModule.pages[currentPageIndex];
    const questions = applicableQuestions(page);
    document.title = `${currentModule.title} | WNMU-TV Follow-up`;
    els.followUpModuleTitle.textContent = currentModule.title;
    els.followUpModuleIntro.textContent = currentModule.intro;
    els.followUpPageTitle.textContent = page.title;
    els.followUpPageIntro.textContent = page.intro || "";
    els.followUpPageIntro.hidden = !page.intro;
    const context = renderPageContext(page);
    els.followUpPageContext.innerHTML = context;
    els.followUpPageContext.hidden = !context;
    els.followUpPagePosition.textContent = `Page ${currentPageIndex + 1} of ${currentModule.pages.length}`;
    els.followUpProgressBar.style.width = `${((currentPageIndex + 1) / currentModule.pages.length) * 100}%`;
    els.followUpModuleError.textContent = "";
    els.followUpQuestions.innerHTML = questions.map((question, index) => renderQuestion(question, index + 1)).join("");
    els.followUpPrevious.disabled = currentPageIndex === 0;
    els.followUpNext.hidden = currentPageIndex === currentModule.pages.length - 1;
    els.followUpSubmit.hidden = currentPageIndex !== currentModule.pages.length - 1;
  }

  function renderPageContext(page) {
    if (page.context?.type !== "core_priorities") return "";
    const priorities = selectedCorePriorities();
    if (!priorities.length) return `<section class="question-card followup-question-card followup-context-card"><p class="eyebrow">From your main questionnaire</p><h3>No programming priorities were selected.</h3><p>The following questions ask what subjects, formats, and ideas matter most to you.</p></section>`;
    return `<section class="question-card followup-question-card followup-context-card"><p class="eyebrow">From your main questionnaire</p><h3>Your television and online priorities</h3><ul>${priorities.map((option) => `<li>${escapeHtml(option.label)}</li>`).join("")}</ul><p>The following questions ask for more detail.</p></section>`;
  }

  function renderQuestion(question, number) {
    const value = answers[question.id];
    const help = question.help ? `<p class="question-help">${escapeHtml(question.help)}</p>` : "";
    let control;
    if (question.type === "textarea") {
      control = `<textarea class="textarea-control" rows="5" data-question-id="${escapeAttr(question.id)}" aria-label="${escapeAttr(question.label)}">${escapeHtml(value || "")}</textarea>`;
    } else {
      const inputType = question.type === "checkbox" ? "checkbox" : "radio";
      const checked = Array.isArray(value) ? value : [value];
      control = `<div class="choice-grid ${(question.options || []).length <= 6 ? "compact-choice-grid" : ""}">${(question.options || []).map((option) => `<label class="choice"><input type="${inputType}" name="${escapeAttr(question.id)}" value="${escapeAttr(option.value)}" data-question-id="${escapeAttr(question.id)}" ${checked.includes(option.value) || checked.includes(Number(option.value)) ? "checked" : ""}><span>${escapeHtml(option.label)}</span></label>`).join("")}</div>`;
    }
    return `<fieldset class="question-card followup-question-card" data-question-block="${escapeAttr(question.id)}" data-max="${escapeAttr(question.max || "")}" data-exclusive="${escapeAttr((question.exclusiveValues || []).join(","))}"><legend><span class="question-number">${number}</span><span class="question-label">${escapeHtml(question.label)}</span><span class="optional-badge">Optional</span></legend>${help}${control}<p class="question-message" aria-live="polite"></p></fieldset>`;
  }

  function handleInput(event) {
    const input = event.target;
    const questionId = input.dataset.questionId;
    if (!questionId || !currentModule) return;
    const block = input.closest("[data-question-block]");
    if (input.type === "checkbox") {
      enforceExclusive(input, block);
      if (!enforceMax(input, block)) return;
      answers[questionId] = Array.from(block.querySelectorAll(`input[type="checkbox"][data-question-id="${cssEscape(questionId)}"]:checked`)).map((item) => item.value);
    } else answers[questionId] = input.value;
    block?.querySelector(".question-message")?.replaceChildren();
    scheduleSave();
  }

  function enforceExclusive(input, block) {
    if (!block || !input.checked) return;
    const exclusive = block.dataset.exclusive.split(",").filter(Boolean);
    const boxes = Array.from(block.querySelectorAll('input[type="checkbox"]'));
    if (exclusive.includes(input.value)) boxes.forEach((box) => { if (box !== input) box.checked = false; });
    else boxes.forEach((box) => { if (exclusive.includes(box.value)) box.checked = false; });
  }

  function enforceMax(input, block) {
    const max = Number(block?.dataset.max || 0);
    if (!max || !input.checked || block.querySelectorAll('input[type="checkbox"]:checked').length <= max) return true;
    input.checked = false;
    block.querySelector(".question-message").textContent = `Choose no more than ${max}.`;
    return false;
  }

  function navigate(direction) {
    saveDraftNow();
    currentPageIndex = Math.max(0, Math.min(currentModule.pages.length - 1, currentPageIndex + direction));
    renderModulePage();
    scrollToTop(true);
  }

  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveDraftNow, 350);
  }

  function saveDraftNow() {
    clearTimeout(saveTimer);
    saveTimer = 0;
    if (currentModule) storage.saveFollowUpDraft(access, currentModule.id, { answers: applicableAnswerCopy(), currentPageIndex, startedAt });
  }

  function applicableAnswerCopy() {
    const ids = new Set(currentModule.pages.flatMap((page) => applicableQuestions(page)).map((question) => question.id));
    return Object.fromEntries(Object.entries(answers).filter(([id, value]) => ids.has(id) && hasValue(value)));
  }

  function saveAndExit() {
    saveDraftNow();
    showHub();
  }

  function submitModule() {
    clearTimeout(saveTimer);
    storage.saveFollowUpResponse(access, currentModule.id, { answers: applicableAnswerCopy(), startedAt });
    els.followUpCompleteTitle.textContent = `${currentModule.title} submitted`;
    els.followUpCompleteMessage.textContent = "This follow-up is linked to your completed main questionnaire. Choose another topic or return later with your private link.";
    showOnly("complete");
    scrollToTop();
  }

  function selectedCorePriorities() {
    const questions = coreSurvey.stages.flatMap((stage) => stage.pages.flatMap((page) => page.questions));
    const seen = new Set();
    return ["television_program_priorities", "online_program_priorities"].flatMap((id) => {
      const selected = coreResponse.answers?.[id] || [];
      const priorityQuestion = questions.find((item) => item.id === id);
      const matrix = priorityQuestion?.optionsFromMatrix ? questions.find((item) => item.id === priorityQuestion.optionsFromMatrix) : null;
      const options = priorityQuestion?.options || (matrix?.rows || []).map((row) => ({ value: row.id, label: row.label }));
      return options.filter((option) => selected.includes(option.value) && !seen.has(option.value) && seen.add(option.value));
    });
  }

  function coreOptionLabel(questionId, value) {
    const question = coreSurvey.stages.flatMap((stage) => stage.pages.flatMap((page) => page.questions)).find((item) => item.id === questionId);
    return question?.options?.find((option) => option.value === value)?.label || value || "";
  }

  function updateUrl(moduleId) {
    const url = new URL(location.href);
    moduleId ? url.searchParams.set("module", moduleId) : url.searchParams.delete("module");
    const hash = new URLSearchParams();
    hash.set("continue", access.token);
    url.hash = hash;
    history.replaceState(null, "", url);
  }

  function continuationUrl() {
    const url = new URL(config.followUp.path, location.href);
    const hash = new URLSearchParams();
    hash.set("continue", access.token);
    url.hash = hash;
    return url.href;
  }

  function showOnly(name) {
    els.followUpAccessError.hidden = name !== "error";
    els.followUpHub.hidden = name !== "hub";
    els.followUpQuestionnaire.hidden = name !== "questionnaire";
    els.followUpComplete.hidden = name !== "complete";
  }

  function scrollToTop(smooth = false) {
    scrollTo({ top: 0, behavior: smooth && !matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ? "smooth" : "auto" });
  }

  function hasValue(value) {
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && value !== "";
  }
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function escapeHtml(value) { return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;"); }
  function escapeAttr(value) { return escapeHtml(value); }
  function cssEscape(value) { return window.CSS?.escape ? CSS.escape(String(value)) : String(value).replace(/([ #;?%&,.+*~\':"!^$[\]()=>|/@])/g, "\\$1"); }
})();
