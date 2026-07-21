"use strict";

  function renderFollowUpResults(coreResponses) {
    const responses = filteredFollowUpResponses(coreResponses);
    renderFollowUpSection(els.followUpAudienceResults, "audience", responses);
    renderFollowUpSection(els.followUpProgrammingResults, "programming", responses);
    renderFollowUpSection(els.followUpPerformanceResults, "performance", responses);
    renderFollowUpVoices(responses);
    renderFollowUpAllData(responses);
  }

  function renderFollowUpSection(container, sectionId, responses) {
    if (!container) return;
    const moduleMarkup = followUps.modules.map((module) => {
      const questions = module.pages
        .flatMap((page) => page.questions)
        .filter((question) => question.resultsSection === sectionId);
      if (!questions.length) return "";
      const moduleResponses = responses.filter((response) => response.moduleId === module.id);
      return followUpModuleSectionMarkup(module, questions, moduleResponses);
    }).filter(Boolean).join("");

    container.innerHTML = moduleMarkup || '<div class="empty-state">No follow-up questions belong to this section.</div>';
  }

  function followUpModuleSectionMarkup(module, questions, moduleResponses) {
    const sourceCounts = followUpSourceCounts(moduleResponses);
    const sourceText = [
      sourceCounts.synthetic ? `${sourceCounts.synthetic} synthetic` : "",
      sourceCounts.browser_submitted ? `${sourceCounts.browser_submitted} browser-submitted` : "",
      sourceCounts.other ? `${sourceCounts.other} imported or other` : ""
    ].filter(Boolean).join(" + ");
    return `
      <section class="result-section followup-module-results" data-followup-module="${escapeAttr(module.id)}">
        <p class="eyebrow">Optional follow-up · ${escapeHtml(module.title)}</p>
        <h2>${escapeHtml(module.title)}</h2>
        <details class="denominator-note"><summary>How percentages are calculated</summary><p>Voluntary, self-selected module population: ${moduleResponses.length} respondents${sourceText ? ` · ${escapeHtml(sourceText)}` : ""}. Each question uses only those who answered it.</p></details>
        <div class="all-data-grid">${questions.map((question) =>
          `<article class="all-data-card" data-followup-question-result="${escapeAttr(question.id)}">${followUpQuestionResultMarkup(question, moduleResponses, true)}</article>`
        ).join("")}</div>
      </section>`;
  }

  function followUpQuestionResultMarkup(question, moduleResponses, includeTitle = false) {
    const coverage = followUpQuestionCoverage(question, moduleResponses);
    const title = includeTitle ? `<h4>${escapeHtml(question.label || question.id)}</h4>` : "";
    const meta = followUpCoverageMetaMarkup(coverage);
    let result = "";
    if (["radio", "checkbox"].includes(question.type)) {
      result = followUpCategoricalMarkup(question, coverage.answeredResponses);
    } else if (question.type === "textarea") {
      result = followUpTextMarkup(coverage);
    } else {
      result = '<div class="empty-state">This follow-up question type does not have a renderer.</div>';
    }
    return `${title}${meta}${result}`;
  }

  function followUpQuestionCoverage(question, moduleResponses) {
    const answeredResponses = moduleResponses.filter((response) => followUpQuestionHasAnswer(question, response));
    return {
      moduleRespondents: moduleResponses.length,
      answered: answeredResponses.length,
      skipped: moduleResponses.length - answeredResponses.length,
      answeredResponses
    };
  }

  function followUpQuestionHasAnswer(question, response) {
    const value = response.answers?.[question.id];
    if (question.type === "textarea") return typeof value === "string" && Boolean(value.trim());
    return hasValue(value);
  }

  function followUpCoverageMetaMarkup(coverage) {
    return `<details class="denominator-note"><summary>How percentages are calculated</summary><p>Answered n=${coverage.answered} · Skipped n=${coverage.skipped} · Voluntary module n=${coverage.moduleRespondents}.</p></details>`;
  }

  function followUpCategoricalMarkup(question, answeredResponses) {
    if (!answeredResponses.length) return '<div class="empty-state">No answered responses in this module view.</div>';
    const arrayValue = question.type === "checkbox";
    const getter = (response) => response.answers?.[question.id];
    const counts = arrayValue ? countArray(answeredResponses, getter) : countSingle(answeredResponses, getter);
    const options = question.options || [];
    const knownValues = new Set(options.map((option) => String(option.value)));
    const entries = options.map((option) => [String(option.value), counts[option.value] || counts[String(option.value)] || 0]);
    Object.entries(counts).forEach(([value, count]) => {
      if (!knownValues.has(String(value))) entries.push([value, count]);
    });
    const labels = Object.fromEntries(options.map((option) => [String(option.value), option.label]));
    const max = Math.max(...entries.map(([, count]) => count), 1);
    return `<div class="bar-list">${entries
      .sort((a, b) => b[1] - a[1])
      .map(([value, count]) => barMarkup(labels[value] || humanize(value), count, max, percent(count, answeredResponses.length)))
      .join("")}</div>`;
  }

  function followUpTextMarkup(coverage) {
    const label = coverage.answered === 1 ? "response" : "responses";
    return `<div class="text-result-summary"><strong>${coverage.answered}</strong><span>answered ${label}; full text appears in Viewer Voices and raw JSON.</span></div>`;
  }

  function renderFollowUpVoices(responses) {
    if (!els.followUpVoiceGroups) return;
    const groups = followUps.modules.flatMap((module) =>
      module.pages.flatMap((page) =>
        page.questions
          .filter((question) => question.type === "textarea")
          .map((question) => ({ module, question }))
      )
    );
    els.followUpVoiceGroups.innerHTML = groups.map(({ module, question }) => {
      const moduleResponses = responses.filter((response) => response.moduleId === module.id);
      const coverage = followUpQuestionCoverage(question, moduleResponses);
      const comments = coverage.answeredResponses.map((response) => String(response.answers?.[question.id] || "").trim());
      return `<section class="result-section viewer-voice-section">
        <p class="eyebrow">Optional follow-up · ${escapeHtml(module.title)}</p>
        <h2>${escapeHtml(question.label)}</h2>
        ${followUpCoverageMetaMarkup(coverage)}
        ${comments.length
          ? `<div class="comment-list">${comments.map((text) => `<article class="comment-card"><p>${escapeHtml(text)}</p></article>`).join("")}</div>`
          : '<div class="empty-state">No comments in this filtered module view.</div>'}
      </section>`;
    }).join("");
  }

  function renderFollowUpAllData(responses) {
    if (!els.followUpAllDataResults) return;
    els.followUpAllDataResults.innerHTML = followUps.modules.map((module) => {
      const moduleResponses = responses.filter((response) => response.moduleId === module.id);
      const questions = module.pages.flatMap((page) => page.questions);
      return `<section class="all-data-stage">
        <div class="all-data-stage-heading">
          <p class="eyebrow">Optional follow-up · Module n=${moduleResponses.length}</p>
          <h3>${escapeHtml(module.title)}</h3>
          <p>Participation is voluntary and self-selected. Percentages use only respondents who submitted this module and answered the question.</p>
        </div>
        <div class="all-data-grid">${questions.map((question) =>
          `<article class="all-data-card" data-followup-question-result="${escapeAttr(question.id)}">${followUpQuestionResultMarkup(question, moduleResponses, true)}</article>`
        ).join("")}</div>
      </section>`;
    }).join("");
  }

  function findFollowUpModule(moduleId) {
    return followUps.modules.find((module) => module.id === moduleId) || null;
  }

  function findFollowUpQuestion(questionId) {
    for (const module of followUps.modules) {
      for (const page of module.pages) {
        const question = page.questions.find((item) => item.id === questionId);
        if (question) return { module, page, question };
      }
    }
    return null;
  }
