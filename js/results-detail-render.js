"use strict";

  function renderCoreDetailResults(responses) {
    renderQuestionInto(els.stationAwarenessResult, responses, "station_awareness");
    renderQuestionInto(els.internetQualityResult, responses, "internet_streaming_quality");
    renderQuestionInto(els.communityTypeResult, responses, "community_type");
    renderQuestionInto(els.onlineAwarenessResult, responses, "online_awareness");
    renderQuestionInto(els.watchPreferenceResult, responses, "watch_preference");
    renderQuestionInto(els.childrenRoleResult, responses, "children_role");
    renderQuestionInto(els.kidsUseResult, responses, "kids_use");
    renderQuestionInto(els.onlineImprovementsResult, responses, "online_improvements");
    renderQuestionInto(els.learnPreferredResult, responses, "learn_preferred");
    renderQuestionInto(els.localFormatsResult, responses, "local_formats");
    renderQuestionInto(els.importanceResult, responses, "station_role_importance", { matrixMode: "bars" });
    renderQuestionInto(els.performanceResult, responses, "station_role_performance", { matrixMode: "bars" });
    renderQuestionInto(els.reflectsMeResult, responses, "reflects_me");
    renderQuestionInto(els.trustStationResult, responses, "trust_station");
    renderQuestionInto(els.nonviewerReasonsResult, responses, "nonviewer_reasons");
    renderViewerVoiceGroups(responses);
    renderAllData(responses);
  }

  function renderQuestionInto(container, responses, questionId, options = {}) {
    if (!container) return;
    const question = findQuestion(questionId);
    container.innerHTML = questionResultMarkup(question, responses, options);
  }

  function questionResultMarkup(question, responses, options = {}) {
    if (!question?.id) return '<div class="empty-state">Question definition unavailable.</div>';
    const coverage = questionCoverage(question, responses);
    const title = options.includeTitle ? `<h4>${escapeHtml(question.label || question.id)}</h4>` : "";
    const meta = coverageMetaMarkup(coverage);
    let result = "";

    if (["radio", "select", "scale", "checkbox"].includes(question.type)) {
      result = categoricalQuestionMarkup(question, coverage.answeredResponses);
    } else if (question.type === "matrix") {
      result = options.matrixMode === "bars"
        ? matrixAverageBarsMarkup(question, coverage.answeredResponses)
        : matrixDistributionMarkup(question, coverage.answeredResponses);
    } else if (["text", "textarea"].includes(question.type)) {
      result = textQuestionMarkup(question, coverage);
    } else {
      result = '<div class="empty-state">This question type does not yet have a result renderer.</div>';
    }

    return `${title}${meta}${result}`;
  }

  function questionCoverage(question, responses) {
    const applicableResponses = responses.filter((response) => questionAppliesToResponse(question, response));
    const answeredResponses = applicableResponses.filter((response) => questionHasAnswer(question, response));
    return {
      total: responses.length,
      applicable: applicableResponses.length,
      answered: answeredResponses.length,
      skipped: applicableResponses.length - answeredResponses.length,
      notApplicable: responses.length - applicableResponses.length,
      answeredResponses
    };
  }

  function questionAppliesToResponse(question, response) {
    const when = question.when || {};
    const profile = response.routeProfile || {};
    const viewerStatus = profile.viewer_status;
    const childrenRole = profile.children_role;
    const methods = Array.isArray(profile.viewing_methods) ? profile.viewing_methods : [];
    if (when.viewerStatusNotIn?.includes(viewerStatus)) return false;
    if (when.viewerStatusIn && !when.viewerStatusIn.includes(viewerStatus)) return false;
    if (when.childrenRoleIn && !when.childrenRoleIn.includes(childrenRole)) return false;
    if (when.hasAnyMethod && !when.hasAnyMethod.some((method) => methods.includes(method))) return false;
    return true;
  }

  function questionValue(question, response) {
    return question.store === "profile"
      ? response.routeProfile?.[question.id]
      : response.answers?.[question.id];
  }

  function questionHasAnswer(question, response) {
    const value = questionValue(question, response);
    if (["text", "textarea"].includes(question.type)) return typeof value === "string" && Boolean(value.trim());
    return hasValue(value);
  }

  function coverageMetaMarkup(coverage) {
    const parts = [
      `Answered n=${coverage.answered}`,
      `Skipped n=${coverage.skipped}`
    ];
    if (coverage.notApplicable) parts.push(`Not applicable n=${coverage.notApplicable}`);
    return `<p class="result-coverage">${parts.map(escapeHtml).join(" · ")}</p>`;
  }

  function categoricalQuestionMarkup(question, answeredResponses) {
    if (!answeredResponses.length) return '<div class="empty-state">No answered responses in this view.</div>';
    const arrayValue = question.type === "checkbox";
    const getter = (response) => questionValue(question, response);
    const counts = arrayValue ? countArray(answeredResponses, getter) : countSingle(answeredResponses, getter);
    const knownOptions = resolveOptions(question);
    const knownValues = new Set(knownOptions.map((option) => String(option.value)));
    const entries = knownOptions.map((option) => [String(option.value), counts[option.value] || counts[String(option.value)] || 0]);
    Object.entries(counts).forEach(([value, count]) => {
      if (!knownValues.has(String(value))) entries.push([value, count]);
    });
    const labels = Object.fromEntries(knownOptions.map((option) => [String(option.value), option.label]));
    const max = Math.max(...entries.map(([, count]) => count), 1);
    return `<div class="bar-list">${entries
      .sort((a, b) => b[1] - a[1])
      .map(([value, count]) => barMarkup(labels[value] || humanize(value), count, max, `${count} · ${percent(count, answeredResponses.length)} · n=${answeredResponses.length}`))
      .join("")}</div>`;
  }

  function matrixAverageBarsMarkup(question, answeredResponses) {
    const stats = (question.rows || []).map((row) => {
      const values = answeredResponses
        .map((response) => questionValue(question, response)?.[row.id])
        .filter(isNumericScore)
        .map(Number);
      return { row, values, average: average(values) };
    }).filter((item) => item.values.length).sort((a, b) => b.average - a.average);
    if (!stats.length) return '<div class="empty-state">No numeric ratings in this view.</div>';
    return `<div class="bar-list">${stats.map((item) =>
      barMarkup(item.row.label, item.average, 5, `${item.average.toFixed(2)} · n=${item.values.length}`)
    ).join("")}</div>`;
  }

  function matrixDistributionMarkup(question, answeredResponses) {
    const rows = (question.rows || []).map((row) => {
      const values = answeredResponses
        .map((response) => questionValue(question, response)?.[row.id])
        .filter(isNumericScore)
        .map(Number);
      const counts = [1, 2, 3, 4, 5].map((score) => values.filter((value) => value === score).length);
      return { row, values, counts, average: average(values) };
    });
    if (!rows.some((item) => item.values.length)) return '<div class="empty-state">No numeric ratings in this view.</div>';
    return `<div class="data-table-wrap"><table class="data-table matrix-results-table"><thead><tr><th>Item</th><th>Average</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>Rated n</th></tr></thead><tbody>${rows.map((item) => `<tr><th scope="row">${escapeHtml(item.row.label)}</th><td>${item.values.length ? item.average.toFixed(2) : "—"}</td>${item.counts.map((count) => `<td>${count}</td>`).join("")}<td>${item.values.length}</td></tr>`).join("")}</tbody></table></div>`;
  }

  function textQuestionMarkup(question, coverage) {
    const label = coverage.answered === 1 ? "response" : "responses";
    return `<div class="text-result-summary"><strong>${coverage.answered}</strong><span>answered ${label}; full text appears in Viewer Voices and raw JSON.</span></div>`;
  }

  function renderViewerVoiceGroups(responses) {
    if (!els.viewerVoiceGroups) return;
    const groups = [
      ["valued_programs", "Programs viewers value"],
      ["kids_needs", "Children, family, classroom, and educator needs"],
      ["nonviewer_return", "What could attract or regain viewers"],
      ["final_feedback", "What WNMU-TV is doing well and could improve"]
    ];
    els.viewerVoiceGroups.innerHTML = groups.map(([questionId, title]) => {
      const question = findQuestion(questionId);
      const coverage = questionCoverage(question, responses);
      const comments = coverage.answeredResponses.map((response) => String(questionValue(question, response)).trim());
      return `<section class="result-section viewer-voice-section"><p class="eyebrow">${escapeHtml(title)}</p><h2>${escapeHtml(question.label || title)}</h2>${coverageMetaMarkup(coverage)}${comments.length
        ? `<div class="comment-list">${comments.map((text) => `<article class="comment-card"><p>${escapeHtml(text)}</p></article>`).join("")}</div>`
        : '<div class="empty-state">No comments in this filtered view.</div>'}</section>`;
    }).join("");
  }

  function renderAllData(responses) {
    if (!els.allDataResults) return;
    els.allDataResults.innerHTML = survey.stages.map((stage) => {
      const questions = stage.pages.flatMap((page) => page.questions);
      return `<section class="all-data-stage"><div class="all-data-stage-heading"><p class="eyebrow">Stage ${stage.number}</p><h3>${escapeHtml(stage.title)}</h3></div><div class="all-data-grid">${questions.map((question) => `<article class="all-data-card" data-question-result="${escapeAttr(question.id)}">${questionResultMarkup(question, responses, { includeTitle: true })}</article>`).join("")}</div></section>`;
    }).join("");
  }
