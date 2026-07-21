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
      barMarkup(labels[value] || humanize(value), count, max, `${count} · ${percent(count, denominator)} · n=${denominator}`)
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
        return `<td><strong>${count}</strong><span>${percent(count, answered.length)} · n=${answered.length}</span></td>`;
      }).join("");
      return `<tr><th scope="row">${escapeHtml(channel.label)}</th>${cells}</tr>`;
    }).join("");
    const anyAnswered = responses.filter((response) => metrics.some((id) => Array.isArray(response.answers?.[id]))).length;
    els.channelResultsNote.textContent = anyAnswered
      ? `${anyAnswered} of ${responses.length} responses include at least one channel question. Each percentage uses only the respondents who answered that specific question.`
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
      barMarkup(item.label, item.average, 5, `${item.average.toFixed(2)} · n=${item.count}`)
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
      barMarkup(labels[value] || humanize(value), count, max, `${count} · ${percent(count, answered.length)} · n=${answered.length}`)
    ).join("");
  }
