(function () {
  "use strict";

  const survey = window.WNMU_SURVEY;
  const config = window.WNMU_CONFIG;
  if (!survey || !config) return;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    const app = document.getElementById("surveyApp");
    const welcome = document.getElementById("welcomePanel");
    const questionnaire = document.getElementById("questionnairePanel");
    const complete = document.getElementById("completePanel");
    const stageCards = Array.from(document.querySelectorAll(".stage-card[data-stage-id]"));
    if (!app || !stageCards.length) return;

    let activeStageId = null;
    let bypassPress = false;
    let refreshTimer = 0;

    stageCards.forEach((card) => {
      card.addEventListener("click", (event) => {
        if (bypassPress || reducedMotion()) {
          activeStageId = card.dataset.stageId;
          window.setTimeout(refresh, 0);
          return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();
        activeStageId = card.dataset.stageId;
        stageCards.forEach((item) => item.classList.toggle("is-pressing", item === card));
        window.setTimeout(() => {
          card.classList.remove("is-pressing");
          bypassPress = true;
          card.click();
          bypassPress = false;
          window.setTimeout(refresh, 0);
          window.setTimeout(refresh, 420);
        }, 125);
      }, true);
    });

    const observer = new MutationObserver(() => scheduleRefresh());
    [welcome, questionnaire, complete].filter(Boolean).forEach((panel) => {
      observer.observe(panel, { attributes: true, attributeFilter: ["hidden"] });
    });
    stageCards.forEach((card) => observer.observe(card, { attributes: true, attributeFilter: ["data-status"] }));

    document.addEventListener("input", () => scheduleRefresh(30), true);
    document.addEventListener("change", () => scheduleRefresh(30), true);
    document.getElementById("returnToStages")?.addEventListener("click", () => window.setTimeout(refresh, 0));
    document.getElementById("resumeSurvey")?.addEventListener("click", () => window.setTimeout(refresh, 20));
    document.getElementById("newResponse")?.addEventListener("click", () => {
      activeStageId = null;
      window.setTimeout(refresh, 0);
    });

    refresh();

    function scheduleRefresh(delay = 0) {
      clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(refresh, delay);
    }

    function refresh() {
      const view = !questionnaire?.hidden ? "questionnaire" : !complete?.hidden ? "complete" : "hub";
      app.dataset.view = view;

      const draft = loadDraft();
      if (view === "questionnaire") activeStageId = inferActiveStageId(draft) || activeStageId;
      else activeStageId = null;

      stageCards.forEach((card) => {
        const stage = survey.stages.find((item) => item.id === card.dataset.stageId);
        if (!stage) return;
        const status = card.dataset.status || "not_started";
        const percent = stagePercent(stage, status, draft);
        const current = view === "questionnaire" && stage.id === activeStageId;
        card.dataset.current = String(current);
        card.style.setProperty("--stage-progress", `${percent}%`);
        if (current) card.setAttribute("aria-current", "step");
        else card.removeAttribute("aria-current");

        const statusText = status === "complete" ? "Complete" : status === "in_progress" ? "In progress" : "Not started";
        card.setAttribute("aria-label", status === "in_progress"
          ? `${stage.title}: ${statusText}, ${percent}% complete`
          : `${stage.title}: ${statusText}`);
      });
    }

    function loadDraft() {
      try {
        const raw = localStorage.getItem(config.storageKeys.draft);
        return raw ? JSON.parse(raw) : null;
      } catch (error) {
        console.info("Stage progress could not read the saved draft.", error);
        return null;
      }
    }

    function inferActiveStageId(draft) {
      if (draft?.currentStageId && survey.stages.some((stage) => stage.id === draft.currentStageId)) return draft.currentStageId;
      const text = document.querySelector("#sectionStage .eyebrow")?.textContent || "";
      const match = text.match(/Stage\s+(\d+)/i);
      const stageNumber = match ? Number(match[1]) : 0;
      return survey.stages.find((stage) => stage.number === stageNumber)?.id || null;
    }

    function stagePercent(stage, status, draft) {
      if (status === "complete") return 100;
      if (status === "not_started") return 0;

      const progress = draft?.stageProgress?.[stage.id];
      const visited = new Set(progress?.visitedPageIds || []);
      const pageRatio = stage.pages.length
        ? stage.pages.filter((page) => visited.has(page.id)).length / stage.pages.length
        : 0;
      const questions = stage.pages.flatMap((page) => page.questions || []);
      const answered = questions.filter((question) => hasValue(question.store === "profile"
        ? draft?.routeProfile?.[question.id]
        : draft?.answers?.[question.id])).length;
      const answerRatio = questions.length ? answered / questions.length : pageRatio;
      let percent = Math.round(((pageRatio * 0.35) + (answerRatio * 0.65)) * 100);

      if (stage.id === activeStageId) {
        const position = document.getElementById("sectionPosition")?.textContent || "";
        const match = position.match(/Page\s+(\d+)\s+of\s+(\d+)/i);
        if (match) percent = Math.max(percent, Math.round(((Number(match[1]) - 0.65) / Number(match[2])) * 100));
        const rendered = Array.from(document.querySelectorAll("#sectionStage [data-question-block]"));
        if (rendered.length) {
          const completed = rendered.filter(questionBlockHasValue).length;
          const currentPageRatio = completed / rendered.length;
          const pageBase = match ? (Number(match[1]) - 1) / Number(match[2]) : 0;
          const pageShare = match ? currentPageRatio / Number(match[2]) : currentPageRatio;
          percent = Math.max(percent, Math.round((pageBase + pageShare) * 100));
        }
      }

      return Math.max(5, Math.min(95, percent));
    }
  }

  function questionBlockHasValue(block) {
    const controls = Array.from(block.querySelectorAll("input, select, textarea"));
    return controls.some((control) => {
      if (control.type === "checkbox" || control.type === "radio") return control.checked;
      return String(control.value || "").trim() !== "";
    });
  }

  function hasValue(value) {
    if (Array.isArray(value)) return value.length > 0;
    if (value && typeof value === "object") return Object.values(value).some((item) => item !== "" && item !== undefined && item !== null);
    return value !== "" && value !== undefined && value !== null;
  }

  function reducedMotion() {
    return Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
  }
})();
