(function () {
  "use strict";

  const config = window.WNMU_REBUILD_CONFIG;
  const storage = window.WNMU_REBUILD_STORAGE;
  const followUps = window.WNMU_FOLLOW_UPS;
  const app = document.getElementById("surveyApp");
  const completePanel = document.getElementById("completePanel");
  const previewLink = document.getElementById("thankYouPreviewLink");
  const testLinks = document.querySelector(".test-navigation-links");
  if (!config || !storage || !followUps || !app || !completePanel) return;

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
      const action = completed ? "Review answers" : draft ? "Continue" : "Begin";
      return `<article class="thank-you-module" data-status="${escapeAttr(status.toLowerCase().replace(/\s+/g, "-"))}">
        <p class="thank-you-module-status">${escapeHtml(status)}</p>
        <h3>${escapeHtml(module.title)}</h3>
        <p>${escapeHtml(module.intro)}</p>
        <div class="thank-you-module-footer"><span>${escapeHtml(module.time)}</span><a class="button secondary" href="${escapeAttr(followUpUrl(access, module.id))}">${action}</a></div>
      </article>`;
    }).join("");

    const subject = encodeURIComponent("My WNMU-TV follow-up questionnaire link");
    const body = encodeURIComponent(`Use this private link to return to the optional WNMU-TV follow-up questionnaires:\n\n${privateUrl}`);

    completePanel.innerHTML = `
      <div class="completion-mark" aria-hidden="true">✓</div>
      <p class="eyebrow">Questionnaire submitted</p>
      <h2 tabindex="-1">Thank you for helping WNMU-TV better understand its viewers and communities.</h2>
      <p>Your main questionnaire is complete. The optional topics below let you add detail without repeating any of your main answers.</p>
      <section class="completion-followups" aria-labelledby="followUpOfferTitle">
        <div class="completion-followup-heading">
          <div><p class="eyebrow">Optional next step</p><h3 id="followUpOfferTitle">Would you like to tell us more?</h3></div>
          <p>Choose one topic, several, or none. Each submitted follow-up is linked to this response with a random pseudonymous respondent ID.</p>
        </div>
        <div class="thank-you-module-grid">${moduleCards}</div>
        <div class="completion-private-link">
          <div><strong>Save your private return link</strong><p>You can return to these optional questionnaires later without taking the main questionnaire again.</p></div>
          <div class="button-row">
            <a class="button primary" href="${escapeAttr(privateUrl)}">View all follow-up topics</a>
            <button class="button secondary" id="copyFollowUpLink" type="button" data-url="${escapeAttr(privateUrl)}">Copy private link</button>
            <a class="button quiet" href="mailto:?subject=${subject}&body=${body}">Email link</a>
          </div>
          <p id="copyFollowUpStatus" class="question-message" aria-live="polite"></p>
        </div>
      </section>
      <div class="button-row centered completion-bottom-actions">
        <a class="button secondary" href="results.html">View results</a>
        <a class="button quiet" href="index.html">Return to questionnaire home</a>
      </div>
      <span class="sr-only">Response ${escapeHtml(response.responseId)}</span>`;

    completePanel.querySelector("h2")?.focus({ preventScroll: true });
  }

  async function copyPrivateLink(url) {
    const status = document.getElementById("copyFollowUpStatus");
    try {
      await navigator.clipboard.writeText(url);
      if (status) status.textContent = "Private follow-up link copied.";
    } catch (error) {
      if (status) status.textContent = `Copy this private link: ${url}`;
    }
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  function escapeAttr(value) { return escapeHtml(value); }
})();
