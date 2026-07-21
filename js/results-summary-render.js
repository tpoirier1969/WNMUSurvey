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
  }

  function renderMetrics(responses) {
    const viewerAnswered = responses.filter((response) => hasValue(response.routeProfile?.viewer_status));
    const current = viewerAnswered.filter((response) => ["regular", "occasional", "once_twice"].includes(response.routeProfile.viewer_status)).length;
    const methodAnswered = responses.filter((response) => Array.isArray(response.routeProfile?.viewing_methods));
    const onlineMethods = ["wnmu_livestream", "pbs_app", "pbs_org", "pbs_passport", "youtube_tv", "youtube"];
    const online = methodAnswered.filter((response) => response.routeProfile.viewing_methods.some((method) => onlineMethods.includes(method))).length;
    const childrenAnswered = responses.filter((response) => hasValue(response.routeProfile?.children_role));
    const children = childrenAnswered.filter((response) => ["household", "educator", "both"].includes(response.routeProfile.children_role)).length;
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
    els.metricChildren.textContent = percent(children, childrenAnswered.length);
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
    return `<div class="snapshot-heading"><p class="eyebrow">Section snapshot</p><h3>${escapeHtml(title)}</h3></div><div class="snapshot-grid">${items.map((item) => `<article class="snapshot-card snapshot-${escapeAttr(item.tone)}"><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong><p>${escapeHtml(item.text)}</p></article>`).join("")}</div>${note ? `<p class="snapshot-note">${escapeHtml(note)}</p>` : ""}`;
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
      { tone: constrained ? "attention" : "positive", label: "Pay attention", value: percent(constrained, internet.length), text: "report slow, unreliable, or no home internet." },
      { tone: "steady", label: "Strong audience signal", value: methods?.percentage || "—", text: methods ? `use ${methods.label}, the most-selected viewing method.` : "No viewing-method answers are available." },
      { tone: "positive", label: "Positive result", value: percent(knowsLocal, awareness.length), text: "identified WNMU-TV as their local PBS station." }
    ], "These are descriptive signals, not expectation ratings.");
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
      { tone: "attention", label: "Pay attention", value: priority?.percentage || "—", text: priority ? `placed ${priority.label} in their limited priority selections.` : "No priority selections are available." },
      { tone: "steady", label: "Strong audience signal", value: interests[0]?.average ? `${interests[0].average.toFixed(1)} / 5` : "—", text: interests[0] ? `${interests[0].label} has the highest average interest.` : "No interest ratings are available." },
      { tone: "positive", label: "Opportunity", value: local?.percentage || "—", text: local ? `${local.label} is the most-selected local or regional format.` : "No local-format selections are available." }
    ], "Interest and priority indicate demand; they do not measure current station performance.");
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
      { tone: "attention", label: "Needs attention", value: percent(needs.length, total), text: "of rated roles fall at least 0.50 points below importance." },
      { tone: "steady", label: "Meeting expectations", value: percent(meeting.length, total), text: "of rated roles are within 0.49 points of importance." },
      { tone: "positive", label: "Exceeding expectations", value: percent(exceeding.length, total), text: "of rated roles exceed importance by at least 0.50 points." }
    ], "Role percentages summarize paired importance-versus-delivery measures; details retain paired denominators.");
  }

  function renderVoicesSnapshot(responses, followUpResponses) {
    if (!els.voicesSnapshot) return;
    const comments = collectOpenComments(responses, followUpResponses);
    const themes = qualitativeThemeDefinitions().map((theme) => ({ label: theme.label, count: comments.filter((comment) => theme.patterns.some((pattern) => pattern.test(comment.text))).length })).sort((a, b) => b.count - a.count);
    const top = themes[0];
    const followUpCount = comments.filter((comment) => comment.source !== "Core questionnaire").length;
    els.voicesSnapshot.innerHTML = snapshotMarkup("What viewers chose to say", [
      { tone: "attention", label: "Review closely", value: comments.length ? percent(comments.length - (top?.count || 0), comments.length) : "—", text: "of comments fall outside the largest automatically matched theme or may overlap other themes." },
      { tone: "steady", label: "Most recurring theme", value: comments.length ? percent(top?.count || 0, comments.length) : "—", text: top ? top.label : "No open responses are available." },
      { tone: "positive", label: "Additional depth", value: comments.length ? percent(followUpCount, comments.length) : "—", text: "of open responses came from voluntary follow-up modules." }
    ], "Keyword matching is an organizing aid. Original comments remain the evidence and may appear in more than one theme.");
  }
