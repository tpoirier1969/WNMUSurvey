"use strict";

  function renderAnalysis() {
    const responses = filteredResponses();
    const hasData = loadedResponses.length > 0;
    if (els.emptyState) els.emptyState.hidden = hasData;
    if (els.analysisContent) els.analysisContent.hidden = !hasData;
    if (!hasData) {
      if (els.dataStatus) els.dataStatus.textContent = "No responses loaded.";
      return;
    }

    if (els.dataStatus) els.dataStatus.textContent = dataStatusText(responses.length);
    const followUpResponses = filteredFollowUpResponses(responses);
    const activeFilters = Object.values(filters).filter(Boolean).length;
    if (els.filterSummary) els.filterSummary.textContent = activeFilters
      ? `${responses.length} responses match ${activeFilters} active filter${activeFilters === 1 ? "" : "s"}`
      : `Showing all ${responses.length} responses`;
    if (els.heroCoreResponses) els.heroCoreResponses.textContent = responses.length;
    if (els.heroFollowUpRespondents) els.heroFollowUpRespondents.textContent = linkedFollowUpRespondentCount(followUpResponses);
    if (els.heroFollowUpModules) els.heroFollowUpModules.textContent = followUpResponses.length;
    renderMetrics(responses);
    renderQuestionBars(els.viewerMix, responses, "viewer_status", (response) => response.routeProfile?.viewer_status, false);
    renderQuestionBars(els.methodMix, responses, "viewing_methods", (response) => response.routeProfile?.viewing_methods, true);
    renderChannelResults(responses);
    renderProgramInterest(responses);
    renderTopPriorities(responses);
    renderGapResults(responses);
    renderQuestionBars(els.ageMix, responses, "age_range", (response) => response.answers?.age_range, false);
    renderQuestionBars(els.countyMix, responses, "county_region", (response) => response.answers?.county_region, false);
    renderCoreDetailResults(responses);
    renderFollowUpResults(responses);
    renderDecisionBrief(responses, followUpResponses);
    renderQualitativeThemes(responses, followUpResponses);
    renderSectionSnapshots(responses, followUpResponses);
    window.enhanceCollapsibleResults?.();
  }

  function renderMetrics(responses) {
    const viewerAnswered = responses.filter((response) => hasValue(response.routeProfile?.viewer_status));
    const current = viewerAnswered.filter((response) => ["regular", "occasional", "once_twice"].includes(response.routeProfile.viewer_status)).length;
    const methodAnswered = responses.filter((response) => Array.isArray(response.routeProfile?.viewing_methods));
    const onlineMethods = ["wnmu_livestream", "pbs_app", "pbs_org", "pbs_passport", "youtube_tv", "youtube"];
    const online = methodAnswered.filter((response) => response.routeProfile.viewing_methods.some((method) => onlineMethods.includes(method))).length;
    const sourceCounts = responseSourceCounts(responses);
    const sourceNote = [
      sourceCounts.synthetic ? `${sourceCounts.synthetic} synthetic` : "",
      sourceCounts.browser_submitted ? `${sourceCounts.browser_submitted} browser-submitted` : "",
      sourceCounts.other ? `${sourceCounts.other} imported or other` : ""
    ].filter(Boolean).join(" + ");

    els.metricResponses.textContent = responses.length;
    els.metricResponsesNote.textContent = sourceNote || `${loadedResponses.length} total loaded.`;
    els.metricCurrent.textContent = percent(current, viewerAnswered.length);
    els.metricOnline.textContent = percent(online, methodAnswered.length);
  }

  function renderQuestionBars(container, responses, questionId, getter, arrayValue) {
    if (!container) return;
    const answered = responses.filter((response) => arrayValue ? Array.isArray(getter(response)) && getter(response).length : hasValue(getter(response)));
    const counts = arrayValue ? countArray(answered, getter) : countSingle(answered, getter);
    renderCountBars(container, counts, labelMap(questionId), answered.length);
  }

  function renderCountBars(container, counts, labels, denominator) {
    const entries = Object.entries(counts)
      .filter(([value]) => value && value !== "prefer_not")
      .sort((a, b) => b[1] - a[1]);
    if (!entries.length) {
      container.innerHTML = '<div class="empty-state">No answered responses in this view.</div>';
      return;
    }
    const max = Math.max(...entries.map(([, count]) => count), 1);
    container.innerHTML = entries.map(([value, count]) =>
      barMarkup(labels[value] || humanize(value), count, max, percent(count, denominator))
    ).join("");
  }

  function renderChannelResults(responses) {
    if (!els.channelResultsBody || !els.channelResultsNote) return;
    const channels = [
      { id: "wnmu_13_1", label: "WNMU-TV 13.1" },
      { id: "pbs_kids_13_2", label: "PBS KIDS 24/7 13.2" },
      { id: "wnmu_plus_13_3", label: "WNMU-TV Plus 13.3" },
      { id: "mlc_13_4", label: "Michigan Learning Channel 13.4" }
    ];
    const metrics = ["channel_awareness", "channels_received", "channels_watched"];
    els.channelResultsBody.innerHTML = channels.map((channel) => {
      const cells = metrics.map((questionId) => {
        const answered = responses.filter((response) => Array.isArray(response.answers?.[questionId]));
        const count = answered.filter((response) => response.answers[questionId].includes(channel.id)).length;
        return `<td><strong>${percent(count, answered.length)}</strong></td>`;
      }).join("");
      return `<tr><th scope="row">${escapeHtml(channel.label)}</th>${cells}</tr>`;
    }).join("");
    const anyAnswered = responses.filter((response) => metrics.some((id) => Array.isArray(response.answers?.[id]))).length;
    els.channelResultsNote.textContent = anyAnswered
      ? "Each percentage uses only respondents who answered that specific channel question. Open All Data & Export for counts and denominators."
      : "No responses in this view include the channel questions. Skipped responses remain missing, not negative.";
  }

  function renderProgramInterest(responses) {
    const question = findQuestion("program_category_interest");
    const stats = question.rows.map((row) => {
      const values = responses
        .map((response) => response.answers?.program_category_interest?.[row.id])
        .filter(isNumericScore)
        .map(Number);
      return { label: row.label, average: average(values), count: values.length };
    }).filter((item) => item.count).sort((a, b) => b.average - a.average);
    if (!stats.length) {
      els.programInterest.innerHTML = '<div class="empty-state">No programming interest ratings in this view.</div>';
      return;
    }
    els.programInterest.innerHTML = stats.map((item) =>
      barMarkup(item.label, item.average, 5, item.average.toFixed(2))
    ).join("");
  }

  function renderTopPriorities(responses) {
    const question = findQuestion("program_category_interest");
    const labels = Object.fromEntries(question.rows.map((row) => [row.id, row.label]));
    const answered = responses.filter((response) => Array.isArray(response.answers?.program_category_priorities));
    const counts = countArray(answered, (response) => response.answers.program_category_priorities);
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (!entries.length) {
      els.topPriorities.innerHTML = '<div class="empty-state">No priority selections in this view.</div>';
      return;
    }
    const max = Math.max(...entries.map(([, count]) => count), 1);
    els.topPriorities.innerHTML = entries.map(([value, count]) =>
      barMarkup(labels[value] || humanize(value), count, max, percent(count, answered.length))
    ).join("");
  }

  function renderSectionSnapshots(responses, followUpResponses) {
    renderAudienceSnapshot(responses);
    renderProgrammingSnapshot(responses);
    renderPerformanceSnapshot(responses);
    renderVoicesSnapshot(responses, followUpResponses);
  }

  function snapshotMarkup(title, items, note) {
    return `<div class="snapshot-heading"><p class="eyebrow">At a glance</p><h3>${escapeHtml(title)}</h3></div><div class="snapshot-grid">${items.map((item) => `<article class="snapshot-card snapshot-${escapeAttr(item.tone)}"><div class="snapshot-meter" style="--snapshot-level:${Math.max(0, Math.min(100, Number(item.level) || 0))}%" aria-hidden="true"><span></span></div><div><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong><p>${escapeHtml(item.text)}</p></div></article>`).join("")}</div>${note ? `<p class="snapshot-note">${escapeHtml(note)}</p>` : ""}`;
  }

  function topSelection(responses, questionId, getter) {
    const answered = responses.filter((response) => Array.isArray(getter(response)) && getter(response).length);
    const counts = countArray(answered, getter);
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top ? { label: labelMap(questionId)[top[0]] || humanize(top[0]), percentage: percent(top[1], answered.length) } : null;
  }

  function renderAudienceSnapshot(responses) {
    if (!els.audienceSnapshot) return;
    const internet = responses.filter((response) => hasValue(response.answers?.internet_streaming_quality));
    const constrained = internet.filter((response) => ["slow", "unreliable", "none"].includes(response.answers.internet_streaming_quality)).length;
    const methods = topSelection(responses, "viewing_methods", (response) => response.routeProfile?.viewing_methods);
    const awareness = responses.filter((response) => hasValue(response.answers?.station_awareness));
    const knowsLocal = awareness.filter((response) => response.answers.station_awareness === "local_pbs").length;
    els.audienceSnapshot.innerHTML = snapshotMarkup("Access signals at a glance", [
      { tone: constrained ? "attention" : "positive", level: internet.length ? constrained / internet.length * 100 : 0, label: "Pay attention", value: percent(constrained, internet.length), text: "have limited home streaming." },
      { tone: "steady", level: Number.parseFloat(methods?.percentage) || 0, label: "Most-used method", value: methods?.percentage || "—", text: methods ? methods.label : "No answers available." },
      { tone: "positive", level: awareness.length ? knowsLocal / awareness.length * 100 : 0, label: "Station awareness", value: percent(knowsLocal, awareness.length), text: "knew WNMU-TV is their local PBS station." }
    ]);
  }

  function renderProgrammingSnapshot(responses) {
    if (!els.programmingSnapshot) return;
    const priority = topSelection(responses, "program_category_priorities", (response) => response.answers?.program_category_priorities);
    const question = findQuestion("program_category_interest");
    const interests = question.rows.map((row) => {
      const values = responses.map((response) => response.answers?.program_category_interest?.[row.id]).filter(isNumericScore).map(Number);
      return { label: row.label, average: average(values) };
    }).filter((item) => item.average).sort((a, b) => b.average - a.average);
    const local = topSelection(responses, "local_formats", (response) => response.answers?.local_formats);
    els.programmingSnapshot.innerHTML = snapshotMarkup("What programming evidence says", [
      { tone: "attention", level: Number.parseFloat(priority?.percentage) || 0, label: "Top priority", value: priority?.percentage || "—", text: priority?.label || "No answers available." },
      { tone: "steady", level: interests[0]?.average ? interests[0].average / 5 * 100 : 0, label: "Highest interest", value: interests[0]?.average ? `${interests[0].average.toFixed(1)} / 5` : "—", text: interests[0]?.label || "No ratings available." },
      { tone: "positive", level: Number.parseFloat(local?.percentage) || 0, label: "Local opportunity", value: local?.percentage || "—", text: local?.label || "No answers available." }
    ]);
  }

  function renderPerformanceSnapshot(responses) {
    if (!els.performanceSnapshot) return;
    const roles = findQuestion(survey.gapPairs.importanceQuestion).rows;
    const rows = roles.map((role) => ({ role, stats: pairedRoleStats(responses, role.id) })).filter((item) => item.stats);
    const needs = rows.filter((item) => item.stats.gapAverage >= 0.5);
    const meeting = rows.filter((item) => Math.abs(item.stats.gapAverage) < 0.5);
    const exceeding = rows.filter((item) => item.stats.gapAverage <= -0.5);
    const total = rows.length;
    els.performanceSnapshot.innerHTML = snapshotMarkup("Expectations compared with delivery", [
      { tone: "attention", level: total ? needs.length / total * 100 : 0, label: "Needs attention", value: percent(needs.length, total), text: "of rated station roles." },
      { tone: "steady", level: total ? meeting.length / total * 100 : 0, label: "Meeting expectations", value: percent(meeting.length, total), text: "of rated station roles." },
      { tone: "positive", level: total ? exceeding.length / total * 100 : 0, label: "Exceeding expectations", value: percent(exceeding.length, total), text: "of rated station roles." }
    ]);
  }

  function renderVoicesSnapshot(responses, followUpResponses) {
    if (!els.voicesSnapshot) return;
    const comments = collectOpenComments(responses, followUpResponses);
    const themes = qualitativeThemeDefinitions().map((theme) => ({ label: theme.label, count: comments.filter((comment) => theme.patterns.some((pattern) => pattern.test(comment.text))).length })).sort((a, b) => b.count - a.count);
    const top = themes[0];
    const followUpCount = comments.filter((comment) => comment.source !== "Core questionnaire").length;
    els.voicesSnapshot.innerHTML = snapshotMarkup("What viewers chose to say", [
      { tone: "attention", level: comments.length ? (comments.length - (top?.count || 0)) / comments.length * 100 : 0, label: "Other comments", value: comments.length ? percent(comments.length - (top?.count || 0), comments.length) : "—", text: "need individual review." },
      { tone: "steady", level: comments.length ? (top?.count || 0) / comments.length * 100 : 0, label: "Top theme", value: comments.length ? percent(top?.count || 0, comments.length) : "—", text: top?.label || "No comments available." },
      { tone: "positive", level: comments.length ? followUpCount / comments.length * 100 : 0, label: "From follow-ups", value: comments.length ? percent(followUpCount, comments.length) : "—", text: "of open comments." }
    ]);
  }
