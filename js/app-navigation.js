"use strict";

  function renderPage(index, direction) {
    const stage = findStage(state.currentStageId);
    if (!stage || !els.sectionStage) return;

    state.currentPageIndex = Math.max(0, Math.min(index, stage.pages.length - 1));
    const page = stage.pages[state.currentPageIndex];
    const progress = state.stageProgress[stage.id] || { visitedPageIds: [], lastPageIndex: 0 };
    addUnique(progress.visitedPageIds, page.id);
    progress.lastPageIndex = state.currentPageIndex;
    state.stageProgress[stage.id] = progress;

    const questions = page.questions.filter((question) => isQuestionVisible(question) && !question.renderedBy);
    const content = `
      <article class="section-page" aria-labelledby="active-page-title">
        <header class="section-page-head">
          <p class="eyebrow">Stage ${stage.number}: ${escapeHtml(stage.title)}</p>
          <h2 id="active-page-title" tabindex="-1">${escapeHtml(page.title)}</h2>
          <p>${escapeHtml(stage.intro || "")}</p>
        </header>
        <div class="question-stack">
          ${questions.map((question, questionIndex) => renderQuestion(question, getQuestionValue(question), questionIndex + 1)).join("")}
        </div>
      </article>`;

    clearTimeout(transitionTimer);
    if (!els.sectionStage.innerHTML || direction === 0 || reducedMotion()) {
      els.sectionStage.innerHTML = content;
      els.sectionStage.className = "section-stage";
    } else {
      els.sectionStage.className = direction > 0 ? "section-stage exit-left" : "section-stage exit-right";
      transitionTimer = window.setTimeout(() => {
        els.sectionStage.innerHTML = content;
        els.sectionStage.className = direction > 0 ? "section-stage enter-right" : "section-stage enter-left";
        requestAnimationFrame(() => requestAnimationFrame(() => {
          els.sectionStage.className = "section-stage";
        }));
      }, 180);
    }

    if (els.pageError) els.pageError.textContent = "";
    renderPageTabs(stage);
    updateProgress(stage);
    updateNavigation(stage);
    refreshCompletedStages(state);
    scheduleSave();

    window.setTimeout(() => {
      els.sectionStage.querySelector("h2")?.focus({ preventScroll: true });
    }, direction === 0 || reducedMotion() ? 0 : 210);
  }

  function renderPageTabs(stage) {
    if (!els.sectionTabs) return;
    els.sectionTabs.innerHTML = stage.pages.map((page, index) => {
      const current = index === state.currentPageIndex;
      const visited = (state.stageProgress[stage.id]?.visitedPageIds || []).includes(page.id);
      return `<button type="button" class="section-tab${current ? " current" : ""}${visited && !current ? " completed" : ""}" data-page-index="${index}" ${current ? 'aria-current="step"' : ""}><span>${index + 1}</span>${escapeHtml(page.title)}</button>`;
    }).join("");

    els.sectionTabs.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        const target = Number(button.dataset.pageIndex);
        if (target > state.currentPageIndex && !validatePage(currentPage())) return;
        renderPage(target, target > state.currentPageIndex ? 1 : -1);
      });
    });
  }

  function updateProgress(stage) {
    const stagePercent = Math.round(((state.currentPageIndex + 1) / stage.pages.length) * 100);
    if (els.progressBar) els.progressBar.style.width = `${stagePercent}%`;
    if (els.progressText) els.progressText.textContent = `${stagePercent}% of this stage`;
    if (els.sectionPosition) {
      els.sectionPosition.textContent = `Stage ${stage.number} of ${survey.stages.length} · Page ${state.currentPageIndex + 1} of ${stage.pages.length}`;
    }
  }

  function updateNavigation(stage) {
    const lastPage = state.currentPageIndex === stage.pages.length - 1;
    if (els.prevSection) els.prevSection.disabled = state.currentPageIndex === 0;
    if (els.nextSection) els.nextSection.hidden = lastPage;
    if (els.completeStage) els.completeStage.hidden = !lastPage;
    if (els.submitSurvey) els.submitSurvey.hidden = true;
  }

  function navigatePage(delta) {
    const stage = findStage(state.currentStageId);
    if (!stage) return;
    if (delta > 0 && !validatePage(currentPage())) return;
    const target = state.currentPageIndex + delta;
    if (target < 0 || target >= stage.pages.length) return;
    renderPage(target, delta);
  }

  function completeCurrentStage() {
    const stage = findStage(state.currentStageId);
    if (!stage || !validateStage(stage)) return;
    markStageExplicitlyComplete(stage);
    refreshCompletedStages(state);
    saveDraftNow();
    playSound("complete");
    updateHubStatuses();
    showPanel("hub");
  }

  function validatePage(page) {
    if (!page || allowsBlankNavigation()) return true;
    const missing = page.questions.filter((question) =>
      question.required && isQuestionVisible(question) && !hasValue(getQuestionValue(question))
    );
    if (!missing.length) return true;
    showValidationError(missing[0], "Please answer the required question before continuing.");
    return false;
  }

  function validateStage(stage) {
    for (let pageIndex = 0; pageIndex < stage.pages.length; pageIndex += 1) {
      const missing = stage.pages[pageIndex].questions.find((question) =>
        question.required && isQuestionVisible(question) && !hasValue(getQuestionValue(question))
      );
      if (missing) {
        renderPage(pageIndex, pageIndex >= state.currentPageIndex ? 1 : -1);
        window.setTimeout(() => {
          showValidationError(missing, "Please answer this required question before completing the stage.");
        }, 20);
        return false;
      }
    }
    return true;
  }

  function validateQuestionnaire() {
    refreshCompletedStages(state);
    for (const stage of survey.stages) {
      if (stageIsComplete(stage, state)) continue;
      for (let pageIndex = 0; pageIndex < stage.pages.length; pageIndex += 1) {
        const missing = stage.pages[pageIndex].questions.find((question) =>
          question.required && isQuestionVisible(question) && !hasValue(getQuestionValue(question))
        );
        if (missing) return { stage, pageIndex, question: missing };
      }
      return {
        stage,
        pageIndex: Math.min(Number(state.stageProgress?.[stage.id]?.lastPageIndex || 0), stage.pages.length - 1),
        question: null,
        stageCompletion: true
      };
    }
    return null;
  }

  function showValidationError(question, message) {
    if (els.pageError) els.pageError.textContent = message;
    const blockId = question.renderedBy || question.id;
    const block = els.sectionStage?.querySelector(`[data-question-block="${cssEscape(blockId)}"]`);
    if (!block) return;
    block.querySelector(".question-message")?.replaceChildren(document.createTextNode(message));
    block.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "center" });
    block.querySelector(`[data-question-id="${cssEscape(question.id)}"], input, select, textarea`)?.focus({ preventScroll: true });
  }

  function submitSurvey() {
    const missing = validateQuestionnaire();
    if (missing) {
      state.currentStageId = missing.stage.id;
      showPanel("questionnaire");
      renderPage(missing.pageIndex, 0);
      window.setTimeout(() => {
        if (missing.question) {
          showValidationError(missing.question, "Please answer this required question before submitting.");
        } else if (els.pageError) {
          els.pageError.textContent = "Complete this stage before submitting the questionnaire.";
        }
      }, 20);
      return;
    }

    const visibleQuestionIds = allQuestions().filter(isQuestionVisible).map((question) => question.id);
    const visibleSet = new Set(visibleQuestionIds);
    const routeProfile = {};
    const answers = {};

    allQuestions().forEach((question) => {
      if (!visibleSet.has(question.id)) return;
      const value = getQuestionValue(question);
      if (!hasValue(value)) return;
      if (question.store === "profile") routeProfile[question.id] = clone(value);
      else answers[question.id] = clone(value);
    });

    refreshCompletedStages(state);
    let response;
    try {
      response = storage.saveResponse({
        respondentId: state.respondentId,
        startedAt: state.startedAt,
        routeProfile,
        answers,
        visibleQuestionIds,
        completedStageIds: state.completedStageIds
      });
    } catch (error) {
      console.error("Questionnaire submission could not be saved.", error);
      showPanel("hub");
      if (els.submitReadyPanel) {
        const message = els.submitReadyPanel.querySelector("p");
        if (message) message.textContent = "Your response could not be saved. Please leave this page open and try submitting again.";
      }
      return;
    }
    storage.clearDraft();
    renderCompletionPanel(response);
    playSound("complete");
    showPanel("complete");
    updateResumeBlock();
  }

