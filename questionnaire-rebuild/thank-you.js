(function () {
  "use strict";

  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = "thank-you.css?v=rebuild-0.2.2";
  document.head.append(stylesheet);

  const config = window.WNMU_REBUILD_CONFIG;
  const storage = window.WNMU_REBUILD_STORAGE;
  const followUps = window.WNMU_FOLLOW_UPS;
  const app = document.getElementById("surveyApp");
  const completePanel = document.getElementById("completePanel");
  const previewLink = document.getElementById("thankYouPreviewLink");
  const testLinks = document.querySelector(".test-navigation-links");
  if (!config || !storage || !followUps || !app || !completePanel) return;

  const moduleSummaries = Object.freeze({
    "local-programming": "Regional stories, voices, and production priorities.",
    "programming-ideas": "Program subjects, formats, and new ideas.",
    "online-viewing": "PBS App, Passport, devices, and online access.",
    "children-education": "Children's viewing, learning needs, and resources.",
    communication: "Schedules, reminders, and finding programs."
  });

  let activeResponseId = null;

  if (testLinks) testLinks.hidden = config.mode !== "test";
  previewLink?.addEventListener("click", showPreview);

  const observer = new MutationObserver(() => {
    if (app.dataset.view === "complete") renderLatestThankYou();
  });
  observer.observe(app, { attributes: true, attributeFilter: ["data-view"] });

  completePanel.addEventListener("click", (event) => {
    const copy = event.target.closest("#copyFollowUpLink");
    if (copy) copyPrivateLink(copy.dataset.url);
  });

  if (config.mode === "test" && location.hash === "#thank-you") showPreview();

  function showPreview(event) {
    event?.preventDefault();
    const response = storage.getLatestResponse() || storage.getOrCreateTestThankYouPreview();
    showCompletionView();
    renderThankYou(response);
    history.replaceState(null, "", `${location.pathname}${location.search}#thank-you`);
  }

  function showCompletionView() {
    app.dataset.view = "complete";
    ["welcomePanel", "resumeBlock", "submitReadyPanel", "questionnairePanel"].forEach((id) => {
      const panel = document.getElementById(id);
      if (panel) panel.hidden = true;
    });
    const facts = app.querySelector(".survey-facts");
    if (facts) facts.hidden = true;
    completePanel.hidden = false;
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function renderLatestThankYou() {
    const response = storage.getLatestResponse() || (config.mode === "test" ? storage.getOrCreateTestThankYouPreview() : null);
    if (response) renderThankYou(response);
  }

  function eligibleModules(response) {
    return followUps.modules.filter((module) => {
      const allowed = module.eligibility?.coreChildrenRoleIn;
      return !allowed || allowed.includes(response.routeProfile?.children_role);
    });
  }

  function followUpUrl(access, moduleId) {
    const url = new URL(config.followUp.path, location.href);
    if (moduleId) url.searchParams.set("module", moduleId);
    const hash = new URLSearchParams();
    hash.set("continue", access.token);
    url.hash = hash;
    return url.href;
  }

  function renderThankYou(response) {
    if (!response?.responseId) return;
    if (activeResponseId === response.responseId && completePanel.querySelector(".completion-followups")) return;
    activeResponseId = response.responseId;

    const access = storage.getOrCreateFollowUpAccess(response);
    const privateUrl = followUpUrl(access);
    const submitted = storage.getFollowUpResponses(true);
    const modules = eligibleModules(response);
    const moduleCards = modules.map((module) => {
      const completed = submitted.some((item) => item.accessId === access.accessId && item.moduleId === module.id && item.followUpSchemaVersion === followUps.schemaVersion);
      const draft = storage.loadFollowUpDraft(access.accessId, module.id);
      const status = completed ? "Completed" : draft ? "Saved for later" : "Optional";
      const action = completed ? "Review" : draft ? "Continue" : "Begin";
      const summary = moduleSummaries[module.id] || module.intro;
      return `<article class="thank-you-module" data-status="${escapeAttr(status.toLowerCase().replace(/\s+/g, "-"))}">
        <p class="thank-you-module-status">${escapeHtml(status)}</p>
        <h3>${escapeHtml(module.title)}</h3>
        <p>${escapeHtml(summary)}</p>
        <div class="thank-you-module-footer"><span>${escapeHtml(module.time)}</span><a class="button secondary" href="${escapeAttr(followUpUrl(access, module.id))}">${action}</a></div>
      </article>`;
    }).join("");

    const subject = encodeURIComponent("My WNMU-TV follow-up questionnaire link");
    const body = encodeURIComponent(`Use this private link to return to the optional WNMU-TV follow-up questionnaires:\n\n${privateUrl}`);

    completePanel.innerHTML = `
      <header class="completion-header">
        <div class="completion-mark" aria-hidden="true">✓</div>
        <p class="eyebrow">Questionnaire submitted</p>
        <h2 tabindex="-1">Thank you. Your response has been recorded.</h2>
        <p class="completion-summary">You may stop here or choose an optional follow-up below.</p>
      </header>
      <section class="completion-followups" aria-labelledby="followUpOfferTitle">
        <div class="completion-followup-heading">
          <div><p class="eyebrow">Optional</p><h3 id="followUpOfferTitle">Follow-up topics</h3></div>
          <p>Choose any topic. Your main questionnaire stays complete.</p>
        </div>
        <div class="thank-you-module-grid">${moduleCards}</div>
        <div class="completion-private-link">
          <div><strong>Save a return link</strong><p>Continue later in this browser. Follow-ups stay linked without using your name or email.</p></div>
          <div class="button-row">
            <a class="button primary" href="${escapeAttr(privateUrl)}">All topics</a>
            <button class="button secondary" id="copyFollowUpLink" type="button" data-url="${escapeAttr(privateUrl)}">Copy link</button>
            <a class="button quiet" href="mailto:?subject=${subject}&body=${body}">Email link</a>
          </div>
          <p id="copyFollowUpStatus" class="question-message" aria-live="polite"></p>
        </div>
      </section>
      <div class="button-row centered completion-bottom-actions">
        <a class="button secondary" href="results.html">View results</a>
        <a class="button quiet" href="index.html">Questionnaire home</a>
      </div>
      <span class="sr-only">Response ${escapeHtml(response.responseId)}</span>`;

    completePanel.querySelector("h2")?.focus({ preventScroll: true });
  }

  async function copyPrivateLink(url) {
    const status = document.getElementById("copyFollowUpStatus");
    try {
      await navigator.clipboard.writeText(url);
      if (status) status.textContent = "Private link copied.";
    } catch (error) {
      if (status) status.textContent = `Copy this private link: ${url}`;
    }
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  function escapeAttr(value) { return escapeHtml(value); }
})();
