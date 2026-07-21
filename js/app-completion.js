"use strict";

  let activeCompletionResponse = null;

  function renderCompletionPanel(response) {
    if (!els.completePanel) return;
    activeCompletionResponse = response || null;
    const modules = (survey.followUpModules || []).filter((module) => matchesCondition(module.when, state));
    const followUpPath = config.followUp?.placeholderPath || "follow-up.html";
    let followUpHubUrl = new URL(followUpPath, window.location.href).href;

    try {
      const access = storage.getOrCreateFollowUpAccess(response);
      const url = new URL(followUpPath, window.location.href);
      const hash = new URLSearchParams();
      hash.set("continue", access.token);
      url.hash = hash.toString();
      followUpHubUrl = url.href;
    } catch (error) {
      console.warn("The private follow-up link could not be created.", error);
    }

    const moduleButtons = modules.map((module) => {
      const url = new URL(followUpHubUrl);
      url.searchParams.set("module", module.id);
      return `<a class="button secondary followup-module-button" href="${escapeAttr(url.href)}"><span>${escapeHtml(module.label)}</span><small>${escapeHtml(module.time)}</small></a>`;
    }).join("");

    const emailSubject = encodeURIComponent("My WNMU-TV follow-up questionnaire link");
    const emailBody = encodeURIComponent(
      `Use this private link to return to the optional WNMU-TV follow-up questionnaires:\n\n${followUpHubUrl}`
    );
    const existingContact = config.contact?.enabled
      ? storage.getContactRequestForResponse(response?.responseId)
      : null;
    const selectedReasons = new Set(existingContact?.reasons || []);
    const contactReasonOptions = [
      ["response_followup", "Discuss something in my questionnaire response"],
      ["programming_idea", "Follow up about a programming idea or opportunity"],
      ["future_research", "Invite me to future WNMU-TV research"]
    ];
    const contactMarkup = config.contact?.enabled ? `
      <details id="contactRequestPanel" class="contact-opt-in">
        <summary>Would you like WNMU-TV to contact you?</summary>
        <div class="contact-opt-in-body">
          <p>This is optional. Your contact details will be stored in a separate contact record, not in your questionnaire answers. Research results show only the number of people requesting contact.</p>
          <p class="contact-test-note"><strong>Test version:</strong> this contact request is stored only in this browser. A protected contact system is still required before public release.</p>
          <form id="contactRequestForm" data-core-response-id="${escapeAttr(response?.responseId || "")}" novalidate>
            <div class="contact-field-grid">
              <label>Your name <span>(optional)</span><input name="contactName" type="text" autocomplete="name" maxlength="100" value="${escapeAttr(existingContact?.name || "")}" /></label>
              <label>Email address <span>(required)</span><input name="contactEmail" type="email" autocomplete="email" maxlength="254" required value="${escapeAttr(existingContact?.email || "")}" /></label>
            </div>
            <fieldset class="contact-reasons">
              <legend>What may WNMU-TV contact you about? <span>(choose at least one)</span></legend>
              ${contactReasonOptions.map(([value, label]) => `<label><input name="contactReason" type="checkbox" value="${escapeAttr(value)}"${selectedReasons.has(value) ? " checked" : ""} /><span>${escapeHtml(label)}</span></label>`).join("")}
            </fieldset>
            <label class="contact-consent"><input name="contactConsent" type="checkbox" required${existingContact ? " checked" : ""} /><span>I agree that WNMU-TV may use this information to contact me for the purposes I selected.</span></label>
            <div class="button-row">
              <button class="button secondary" type="submit">${existingContact ? "Update contact request" : "Save contact request"}</button>
              ${existingContact ? '<button class="button quiet danger-button" id="removeContactRequest" type="button">Remove saved contact request</button>' : ""}
            </div>
            <p id="contactRequestStatus" class="question-message" role="status" aria-live="polite">${existingContact ? "A contact request is already saved for this response. You may update it here." : ""}</p>
          </form>
        </div>
      </details>` : "";

    els.completePanel.innerHTML = `
      <div class="completion-mark" aria-hidden="true">✓</div>
      <p class="eyebrow">Questionnaire submitted</p>
      <h2>Thank you for helping WNMU-TV better understand its viewers and communities.</h2>
      <p>Your main questionnaire has been submitted. You do not need to repeat it. The optional questionnaires below are separate and their answers will be connected to this response through a random pseudonymous respondent ID.</p>
      <div id="completionFollowups" class="completion-followups">
        <h3>Would you like to tell us more?</h3>
        <p>Choose any topic now, or save your private link and return later.</p>
        <div class="followup-grid">${moduleButtons}</div>
        <div class="button-row centered completion-link-actions">
          <button class="button quiet" id="copyFollowUpLink" type="button" data-follow-up-url="${escapeAttr(followUpHubUrl)}">Copy private follow-up link</button>
          <a class="button quiet" href="mailto:?subject=${emailSubject}&body=${emailBody}">Email link using my email app</a>
          <button class="button primary" id="finishThankYou" type="button">I'm done now</button>
        </div>
        <p id="copyFollowUpStatus" class="question-message" aria-live="polite"></p>
        <p class="completion-note">Keep this private link if you plan to return later.</p>
      </div>
      ${contactMarkup}
      <p id="completionFinalMessage" class="completion-final-message" hidden>Thank you. You may close this page. Your private follow-up link remains available if you saved it.</p>
      <span class="sr-only">Response ${escapeHtml(response?.responseId || "saved")}</span>`;
  }

  function handleCompletionSubmit(event) {
    if (event.target?.id !== "contactRequestForm") return;
    event.preventDefault();
    const form = event.target;
    const status = form.querySelector("#contactRequestStatus");
    const response = storage.getResponse(form.dataset.coreResponseId)
      || (activeCompletionResponse?.responseId === form.dataset.coreResponseId ? activeCompletionResponse : null);
    const reasons = Array.from(form.querySelectorAll('input[name="contactReason"]:checked')).map((input) => input.value);

    if (!form.reportValidity()) return;
    if (!reasons.length) {
      if (status) status.textContent = "Choose at least one reason WNMU-TV may contact you.";
      form.querySelector('input[name="contactReason"]')?.focus();
      return;
    }
    if (!response) {
      if (status) status.textContent = "This contact request could not be linked to the submitted questionnaire.";
      return;
    }

    try {
      storage.saveContactRequest(response, {
        name: form.elements.contactName.value,
        email: form.elements.contactEmail.value,
        reasons,
        consent: form.elements.contactConsent.checked
      });
      const button = form.querySelector('button[type="submit"]');
      if (button) button.textContent = "Update contact request";
      if (status) status.textContent = "Your contact request was saved separately from your questionnaire answers.";
    } catch (error) {
      console.warn("The contact request could not be saved.", error);
      if (status) status.textContent = "The contact request could not be saved. Please try again.";
    }
  }

  function handleCompletionAction(event) {
    const target = event.target.closest("button");
    if (!target) return;
    if (target.id === "copyFollowUpLink") copyFollowUpLink(target.dataset.followUpUrl);
    else if (target.id === "finishThankYou") finishThankYou();
    else if (target.id === "removeContactRequest") removeContactRequest();
    else if (target.id === "newResponse") startNewResponse();
  }

  function removeContactRequest() {
    if (!activeCompletionResponse?.responseId) return;
    if (!window.confirm("Remove the saved contact request for this questionnaire response?")) return;
    storage.removeContactRequestForResponse(activeCompletionResponse.responseId);
    renderCompletionPanel(activeCompletionResponse);
    const panel = document.getElementById("contactRequestPanel");
    if (panel) panel.open = true;
    const status = document.getElementById("contactRequestStatus");
    if (status) status.textContent = "The saved contact request was removed.";
  }

  async function copyFollowUpLink(followUpUrl) {
    const status = document.getElementById("copyFollowUpStatus");
    const url = followUpUrl || new URL(config.followUp?.placeholderPath || "follow-up.html", window.location.href).href;
    try {
      await navigator.clipboard.writeText(url);
      if (status) status.textContent = "Private follow-up link copied.";
    } catch (error) {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand("copy");
      textarea.remove();
      if (status) status.textContent = copied ? "Private follow-up link copied." : `Copy this link: ${url}`;
    }
  }

  function finishThankYou() {
    const followups = document.getElementById("completionFollowups");
    const contact = document.getElementById("contactRequestPanel");
    const message = document.getElementById("completionFinalMessage");
    if (followups) followups.hidden = true;
    if (contact) contact.hidden = true;
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
