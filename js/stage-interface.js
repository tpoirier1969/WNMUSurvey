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
    const resumeBlock = document.getElementById("resumeBlock");
    const stageCards = Array.from(document.querySelectorAll(".stage-card[data-stage-id]"));
    if (!app || !stageCards.length) return;

    let activeStageId = null;
    let bypassPress = false;
    let pressLocked = false;
    let refreshTimer = 0;

    stageCards.forEach((card) => {
      card.addEventListener("click", (event) => {
        if (pressLocked && !bypassPress) {
          event.preventDefault();
          event.stopImmediatePropagation();
          return;
        }
        if (bypassPress || reducedMotion()) {
          activeStageId = card.dataset.stageId;
          window.setTimeout(refresh, 0);
          return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();
        activeStageId = card.dataset.stageId;
        pressLocked = true;
        stageCards.forEach((item) => item.classList.toggle("is-pressing", item === card));
        window.setTimeout(() => {
          card.classList.remove("is-pressing");
          pressLocked = false;
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
    if (resumeBlock) observer.observe(resumeBlock, { attributes: true, attributeFilter: ["hidden"] });
    const sectionStage = document.getElementById("sectionStage");
    const sectionPosition = document.getElementById("sectionPosition");
    if (sectionStage) observer.observe(sectionStage, { childList: true, subtree: true });
    if (sectionPosition) observer.observe(sectionPosition, { childList: true, characterData: true, subtree: true });

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
      app.dataset.hasResume = String(view === "hub" && Boolean(resumeBlock && !resumeBlock.hidden));

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
      const text = document.querySelector("#sectionStage .eyebrow")?.textContent || "";
      const match = text.match(/Stage\s+(\d+)/i);
      const stageNumber = match ? Number(match[1]) : 0;
      const stageFromPage = survey.stages.find((stage) => stage.number === stageNumber)?.id;
      if (stageFromPage) return stageFromPage;
      if (draft?.currentStageId && survey.stages.some((stage) => stage.id === draft.currentStageId)) return draft.currentStageId;
      return null;
    }

    function stagePercent(stage, status, draft) {
      if (status === "complete") return 100;
      if (status === "not_started") return 0;

      const progress = draft?.stageProgress?.[stage.id];
      const visited = new Set(progress?.visitedPageIds || []);
      const pageRatio = stage.pages.length
        ? stage.pages.filter((page) => visited.has(page.id)).length / stage.pages.length
        : 0;
      const questions = stage.pages
        .flatMap((page) => page.questions || [])
        .filter((question) => questionIsApplicable(question, draft));
      const completion = questions.reduce((totals, question) => {
        const value = question.store === "profile" ? draft?.routeProfile?.[question.id] : draft?.answers?.[question.id];
        const result = questionCompletion(question, value);
        totals.done += result.done;
        totals.total += result.total;
        return totals;
      }, { done: 0, total: 0 });
      const answerRatio = completion.total ? completion.done / completion.total : pageRatio;
      let percent = Math.round(((pageRatio * 0.35) + (answerRatio * 0.65)) * 100);

      if (stage.id === activeStageId) {
        const position = document.getElementById("sectionPosition")?.textContent || "";
        const match = position.match(/Page\s+(\d+)\s+of\s+(\d+)/i);
        if (match) percent = Math.max(percent, Math.round(((Number(match[1]) - 0.65) / Number(match[2])) * 100));
        const rendered = Array.from(document.querySelectorAll("#sectionStage [data-question-block]"));
        if (rendered.length) {
          const renderedCompletion = rendered.reduce((totals, block) => {
            const result = questionBlockCompletion(block);
            totals.done += result.done;
            totals.total += result.total;
            return totals;
          }, { done: 0, total: 0 });
          const currentPageRatio = renderedCompletion.total ? renderedCompletion.done / renderedCompletion.total : 0;
          const pageBase = match ? (Number(match[1]) - 1) / Number(match[2]) : 0;
          const pageShare = match ? currentPageRatio / Number(match[2]) : currentPageRatio;
          percent = Math.max(percent, Math.round((pageBase + pageShare) * 100));
        }
      }

      return Math.max(5, Math.min(95, percent));
    }
  }

  function questionBlockCompletion(block) {
    const rowControls = Array.from(block.querySelectorAll("[data-row-id]"));
    if (rowControls.length) {
      const rowIds = new Set(rowControls.map((control) => control.dataset.rowId).filter(Boolean));
      const completedRows = new Set(rowControls.filter((control) => control.checked).map((control) => control.dataset.rowId));
      return { done: completedRows.size, total: rowIds.size };
    }
    const controls = Array.from(block.querySelectorAll("input, select, textarea"));
    const done = controls.some((control) => {
      if (control.type === "checkbox" || control.type === "radio") return control.checked;
      return String(control.value || "").trim() !== "";
    });
    return { done: done ? 1 : 0, total: 1 };
  }

  function questionCompletion(question, value) {
    if (question.type === "matrix") {
      const rows = question.rows || [];
      const completed = rows.filter((row) => hasValue(value?.[row.id])).length;
      return { done: completed, total: rows.length || 1 };
    }
    return { done: hasValue(value) ? 1 : 0, total: 1 };
  }

  function questionIsApplicable(question, draft) {
    if (config.mode === "test" && config.test.showAllConditionalQuestions) return true;
    return matchesCondition(question.when, draft);
  }

  function matchesCondition(condition, draft) {
    if (!condition) return true;
    const profile = draft?.routeProfile || {};
    const answers = draft?.answers || {};
    if (condition.all && !condition.all.every((item) => matchesCondition(item, draft))) return false;
    if (condition.any && !condition.any.some((item) => matchesCondition(item, draft))) return false;
    if (condition.viewerStatusIn && !condition.viewerStatusIn.includes(profile.viewer_status)) return false;
    if (condition.viewerStatusNotIn && (!hasValue(profile.viewer_status) || condition.viewerStatusNotIn.includes(profile.viewer_status))) return false;
    if (condition.childrenRoleIn && !condition.childrenRoleIn.includes(profile.children_role)) return false;
    if (condition.hasAnyMethod && !condition.hasAnyMethod.some((value) => (profile.viewing_methods || []).includes(value))) return false;
    if (condition.answerIn && !condition.answerIn.values.includes(answers[condition.answerIn.id])) return false;
    if (condition.answerNotIn && condition.answerNotIn.values.includes(answers[condition.answerNotIn.id])) return false;
    return true;
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
