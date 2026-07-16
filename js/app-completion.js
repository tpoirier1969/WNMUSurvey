"use strict";

  function renderCompletionPanel(response) {
    if (!els.completePanel) return;
    const modules = (survey.followUpModules || []).filter((module) => matchesCondition(module.when, state));
    const followUpPath = config.followUp?.placeholderPath || "follow-up.html";
    const moduleButtons = modules.map((module) => {
      const href = `${followUpPath}?module=${encodeURIComponent(module.id)}`;
      return `<a class="button secondary followup-module-button" href="${escapeAttr(href)}"><span>${escapeHtml(module.label)}</span><small>${escapeHtml(module.time)}</small></a>`;
    }).join("");
    const testRestart = config.mode === "test"
      ? '<button class="button quiet" id="newResponse" type="button">Start another test response</button>'
      : "";

    els.completePanel.innerHTML = `
      <div class="completion-mark" aria-hidden="true">✓</div>
      <p class="eyebrow">Questionnaire submitted</p>
      <h2>Thank you for helping WNMU-TV better understand its viewers and communities.</h2>
      <p>Your main questionnaire has been submitted. The optional follow-up questionnaires below are separate and may be completed now or later.</p>
      <div id="completionFollowups" class="completion-followups">
        <h3>Would you like to tell us more?</h3>
        <p>Choose any topic that interests you. These links currently open a placeholder page while the longer questionnaires are being built.</p>
        <div class="followup-grid">${moduleButtons}</div>
        <div class="button-row centered completion-link-actions">
          <button class="button quiet" id="copyFollowUpLink" type="button">Copy follow-up page link</button>
          <button class="button primary" id="finishThankYou" type="button">I'm done now</button>
        </div>
        <p id="copyFollowUpStatus" class="question-message" aria-live="polite"></p>
        <p class="completion-note">Private cross-device links and optional email delivery will be added when the follow-up questionnaires are connected to the database.</p>
      </div>
      <p id="completionFinalMessage" class="completion-final-message" hidden>Thank you. You may close this page.</p>
      <div class="button-row centered">${testRestart}</div>
      <span class="sr-only">Response ${escapeHtml(response?.responseId || "saved")}</span>`;
  }

  function handleCompletionAction(event) {
    const target = event.target.closest("button");
    if (!target) return;
    if (target.id === "copyFollowUpLink") copyFollowUpLink();
    else if (target.id === "finishThankYou") finishThankYou();
    else if (target.id === "newResponse") startNewResponse();
  }

  async function copyFollowUpLink() {
    const status = document.getElementById("copyFollowUpStatus");
    const followUpUrl = new URL(config.followUp?.placeholderPath || "follow-up.html", window.location.href).href;
    try {
      await navigator.clipboard.writeText(followUpUrl);
      if (status) status.textContent = "Follow-up page link copied.";
    } catch (error) {
      const textarea = document.createElement("textarea");
      textarea.value = followUpUrl;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand("copy");
      textarea.remove();
      if (status) status.textContent = copied ? "Follow-up page link copied." : `Copy this link: ${followUpUrl}`;
    }
  }

  function finishThankYou() {
    const followups = document.getElementById("completionFollowups");
    const message = document.getElementById("completionFinalMessage");
    if (followups) followups.hidden = true;
    if (message) message.hidden = false;
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

