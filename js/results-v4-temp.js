(function () {
  "use strict";

  const survey = window.WNMU_SURVEY;
  const config = window.WNMU_CONFIG;
  const storage = window.WNMUStorage;
  if (!survey || !config || !storage) throw new Error("WNMU results scripts loaded in the wrong order.");

  let loadedResponses = [];
  let dataSourceLabel = "No responses loaded";
  const filters = { viewer: "", method: "", age: "", county: "", children: "" };
  const els = {};

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    Object.assign(els, {
      loadLocal: document.getElementById("loadLocal"),
      loadDemo: document.getElementById("loadDemo"),
      jsonUpload: document.getElementById("jsonUpload"),
      exportRaw: document.getElementById("exportRaw"),
      exportSummary: document.getElementById("exportSummary"),
      clearLocal: document.getElementById("clearLocal"),
      dataStatus: document.getElementById("dataStatus"),
      filterViewer: document.getElementById("filterViewer"),
      filterMethod: document.getElementById("filterMethod"),
      filterAge: document.getElementById("filterAge"),
      filterCounty: document.getElementById("filterCounty"),
      filterChildren: document.getElementById("filterChildren"),
      emptyState: document.getElementById("emptyState"),
      analysisContent: document.getElementById("analysisContent"),
      metricResponses: document.getElementById("metricResponses"),
      metricResponsesNote: document.getElementById("metricResponsesNote"),
      metricCurrent: document.getElementById("metricCurrent"),
      metricOnline: document.getElementById("metricOnline"),
      metricChildren: document.getElementById("metricChildren"),
      viewerMix: document.getElementById("viewerMix"),
      methodMix: document.getElementById("methodMix"),
      channelResultsBody: document.getElementById("channelResultsBody"),
      channelResultsNote: document.getElementById("channelResultsNote"),
      programInterest: document.getElementById("programInterest"),
      topPriorities: document.getElementById("topPriorities"),
      gapTable: document.getElementById("gapTable"),
      ageMix: document.getElementById("ageMix"),
      countyMix: document.getElementById("countyMix"),
      commentList: document.getElementById("commentList")
    });

    els.loadLocal?.addEventListener("click", loadLocalResponses);
    els.loadDemo?.addEventListener("click", loadDemoResponses);
    els.jsonUpload?.addEventListener("change", importJson);
    els.exportRaw?.addEventListener("click", exportRaw);
    els.exportSummary?.addEventListener("click", exportSummary);
    els.clearLocal?.addEventListener("click", clearLocalResponses);

    [
      [els.filterViewer, "viewer"], [els.filterMethod, "method"], [els.filterAge, "age"],
      [els.filterCounty, "county"], [els.filterChildren, "children"]
    ].forEach(([select, key]) => select?.addEventListener("change", () => {
      filters[key] = select.value;
      renderAnalysis();
    }));

    if (config.mode === "test" && config.test.useSyntheticResults) loadDemoResponses();
    else loadLocalResponses();
  }

  function loadLocalResponses() {
    loadedResponses = storage.getResponses();
    dataSourceLabel = "submitted browser responses";
    resetAndRender();
  }

  function loadDemoResponses() {
    loadedResponses = makeDemoData();
    dataSourceLabel = "25 synthetic Upper Peninsula PBS audience responses";
    resetAndRender();
  }

  function resetAndRender() {
    resetFilters();
    populateFilters();
    renderAnalysis();
  }

  async function importJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const responses = normalizeImportedData(parsed);
      if (!responses.length) throw new Error("No response records were found.");
      loadedResponses = responses;
      dataSourceLabel = `imported file: ${file.name}`;
      resetAndRender();
    } catch (error) {
      window.alert(`Could not load that JSON file. ${error.message}`);
    } finally {
      event.target.value = "";
    }
  }

  function normalizeImportedData(parsed) {
    if (Array.isArray(parsed)) return parsed.filter(isResponseLike);
    if (parsed && Array.isArray(parsed.responses)) return parsed.responses.filter(isResponseLike);
    return isResponseLike(parsed) ? [parsed] : [];
  }

  function isResponseLike(item) {
    return Boolean(item && typeof item === "object" && item.routeProfile && item.answers);
  }

  function clearLocalResponses() {
    const count = storage.getResponses().length;
    if (!count) return window.alert("There are no submitted browser responses to clear.");
    if (!window.confirm(`Clear ${count} submitted response${count === 1 ? "" : "s"} from this browser? Export them first if they matter.`)) return;
    storage.clearResponses();
    loadLocalResponses();
  }

  function resetFilters() {
    Object.keys(filters).forEach((key) => { filters[key] = ""; });
    Object.values({ viewer: els.filterViewer, method: els.filterMethod, age: els.filterAge, county: els.filterCounty, children: els.filterChildren }).forEach((select) => {
      if (select) select.value = "";
    });
  }

  function populateFilters() {
    fillSelect(els.filterViewer, uniqueValues((response) => response.routeProfile?.viewer_status), labelMap("viewer_status"), "All viewer types");
    fillSelect(els.filterMethod, uniqueArrayValues((response) => response.routeProfile?.viewing_methods), labelMap("viewing_methods"), "All methods");
    fillSelect(els.filterAge, uniqueValues((response) => response.answers?.age_range), labelMap("age_range"), "All ages");
    fillSelect(els.filterCounty, uniqueValues((response) => response.answers?.county_region), labelMap("county_region"), "All locations");
    fillSelect(els.filterChildren, uniqueValues((response) => response.routeProfile?.children_role), labelMap("children_role"), "All household and educator roles");
  }

  function fillSelect(select, values, labels, firstLabel) {
    if (!select) return;
    select.innerHTML = `<option value="">${escapeHtml(firstLabel)}</option>${values.sort((a, b) => String(labels[a] || a).localeCompare(String(labels[b] || b))).map((value) => `<option value="${escapeAttr(value)}">${escapeHtml(labels[value] || humanize(value))}</option>`).join("")}`;
  }

  function uniqueValues(getter) {
    return Array.from(new Set(loadedResponses.map(getter).filter(hasValue)));
  }

  function uniqueArrayValues(getter) {
    return Array.from(new Set(loadedResponses.flatMap((response) => Array.isArray(getter(response)) ? getter(response) : [])));
  }

  function filteredResponses() {
    return loadedResponses.filter((response) => {
      const profile = response.routeProfile || {};
      const answers = response.answers || {};
      if (filters.viewer && profile.viewer_status !== filters.viewer) return false;
      if (filters.method && !(profile.viewing_methods || []).includes(filters.method)) return false;
      if (filters.age && answers.age_range !== filters.age) return false;
      if (filters.county && answers.county_region !== filters.county) return false;
      if (filters.children && profile.children_role !== filters.children) return false;
      return true;
    });
  }

  function renderAnalysis() {
    const responses = filteredResponses();
    const hasData = loadedResponses.length > 0;
    if (els.emptyState) els.emptyState.hidden = hasData;
    if (els.analysisContent) els.analysisContent.hidden = !hasData;
    if (!hasData) {
      if (els.dataStatus) els.dataStatus.textContent = "No responses loaded.";
      return;
    }

    if (els.dataStatus) els.dataStatus.textContent = `${loadedResponses.length} loaded from ${dataSourceLabel}; ${responses.length} match current filters.`;
    renderMetrics(responses);
    renderQuestionBars(els.viewerMix, responses, "viewer_status", (response) => response.routeProfile?.viewer_status, false);
    renderQuestionBars(els.methodMix, responses, "viewing_methods", (response) => response.routeProfile?.viewing_methods, true);
    renderChannelResults(responses);
    renderProgramInterest(responses);
    renderTopPriorities(responses);
    renderGapResults(responses);
    renderQuestionBars(els.ageMix, responses, "age_range", (response) => response.answers?.age_range, false);
    renderQuestionBars(els.countyMix, responses, "county_region", (response) => response.answers?.county_region, false);
    renderComments(responses);
  }

  function renderMetrics(responses) {
    const viewerAnswered = responses.filter((response) => hasValue(response.routeProfile?.viewer_status));
    const current = viewerAnswered.filter((response) => ["regular", "occasional", "once_twice"].includes(response.routeProfile.viewer_status)).length;
    const methodAnswered = responses.filter((response) => Array.isArray(response.routeProfile?.viewing_methods));
    const onlineMethods = ["livestream", "pbs_site", "pbs_app", "passport", "youtube_social"];
    const online = methodAnswered.filter((response) => response.routeProfile.viewing_methods.some((method) => onlineMethods.includes(method))).length;
    const childrenAnswered = responses.filter((response) => hasValue(response.routeProfile?.children_role));
    const children = childrenAnswered.filter((response) => ["household", "educator", "both"].includes(response.routeProfile.children_role)).length;

    els.metricResponses.textContent = responses.length;
    els.metricResponsesNote.textContent = `${loadedResponses.length} total loaded.`;
    els.metricCurrent.textContent = percent(current, viewerAnswered.length);
    els.metricOnline.textContent = percent(online, methodAnswered.length);
    els.metricChildren.textContent = percent(children, childrenAnswered.length);
  }

  function renderQuestionBars(container, responses, questionId, getter, arrayValue) {
    if (!container) return;
    const answered = responses.filter((response) => arrayValue ? Array.isArray(getter(response)) : hasValue(getter(response)));
    const counts = arrayValue ? countArray(answered, getter) : countSingle(answered, getter);
    renderCountBars(container, counts, labelMap(questionId), answered.length);
  }

  function renderCountBars(container, counts, labels, denominator) {
    const entries = Object.entries(counts).filter(([value]) => value && value !== "prefer_not").sort((a, b) => b[1] - a[1]);
    if (!entries.length) {
      container.innerHTML = '<div class="empty-state">No answered responses in this view.</div>';
      return;
    }
    const max = Math.max(...entries.map(([, count]) => count), 1);
    container.innerHTML = entries.map(([value, count]) => barMarkup(labels[value] || humanize(value), count, max, `${count} · ${percent(count, denominator)} · n=${denominator}`)).join("");
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
      : "No responses in this view include the channel questions. Older or skipped responses remain missing, not negative.";
  }

  function renderProgramInterest(responses) {
    const question = findQuestion("program_interest_v2");
    const stats = question.rows.map((row) => {
      const values = responses.map((response) => response.answers?.program_interest_v2?.[row.id]).filter(isNumericScore).map(Number);
      return { label: row.label, average: average(values), count: values.length };
    }).filter((item) => item.count).sort((a, b) => b.average - a.average);
    if (!stats.length) {
      els.programInterest.innerHTML = '<div class="empty-state">No current-schema programming interest ratings in this view. Legacy topic ratings are not reinterpreted.</div>';
      return;
    }
    els.programInterest.innerHTML = stats.map((item) => barMarkup(item.label, item.average, 5, `${item.average.toFixed(2)} · n=${item.count}`)).join("");
  }

  function renderTopPriorities(responses) {
    const question = findQuestion("program_interest_v2");
    const labels = Object.fromEntries(question.rows.map((row) => [row.id, row.label]));
    const answered = responses.filter((response) => Array.isArray(response.answers?.top_program_priorities_v2));
    const counts = countArray(answered, (response) => response.answers.top_program_priorities_v2);
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (!entries.length) {
      els.topPriorities.innerHTML = '<div class="empty-state">No current-schema priority selections in this view.</div>';
      return;
    }
    const max = Math.max(...entries.map(([, count]) => count), 1);
    els.topPriorities.innerHTML = entries.map(([value, count]) => barMarkup(labels[value] || humanize(value), count, max, `${count} · ${percent(count, answered.length)} · n=${answered.length}`)).join("");
  }

  function pairedRoleStats(responses, roleId) {
    const pairs = responses.flatMap((response) => {
      const importance = response.answers?.importance_roles?.[roleId];
      const performance = response.answers?.performance_roles?.[roleId];
      if (!isNumericScore(importance) || !isNumericScore(performance)) return [];
      return [{ importance: Number(importance), performance: Number(performance), gap: Number(importance) - Number(performance) }];
    });
    if (!pairs.length) return null;
    return {
      count: pairs.length,
      importanceAverage: average(pairs.map((pair) => pair.importance)),
      performanceAverage: average(pairs.map((pair) => pair.performance)),
      gapAverage: average(pairs.map((pair) => pair.gap))
    };
  }

  function renderGapResults(responses) {
    const roles = findQuestion(survey.gapPairs.importanceQuestion).rows;
    const rows = roles.map((role) => {
      const stats = pairedRoleStats(responses, role.id);
      return stats ? { label: role.label, ...stats } : null;
    }).filter(Boolean).sort((a, b) => b.gapAverage - a.gapAverage);

    if (!rows.length) els.gapTable.innerHTML = '<tr><td colspan="5">No respondents in this view rated both importance and performance for the same role.</td></tr>';
    else els.gapTable.innerHTML = rows.map((row) => `<tr><td>${escapeHtml(row.label)}</td><td>${row.importanceAverage.toFixed(2)}</td><td>${row.performanceAverage.toFixed(2)}</td><td class="${row.gapAverage >= 1 ? "gap-high" : ""}">${formatSigned(row.gapAverage)}</td><td>${row.count}</td></tr>`).join("");

    renderGapBucket("needsAttentionList", "needsAttentionCount", rows.filter((row) => row.gapAverage >= 0.5).sort((a, b) => b.gapAverage - a.gapAverage), "No roles currently fall at least 0.50 points below stated importance.");
    renderGapBucket("meetingExpectationsList", "meetingExpectationsCount", rows.filter((row) => Math.abs(row.gapAverage) < 0.5).sort((a, b) => b.performanceAverage - a.performanceAverage), "No roles currently fall within the meeting-expectations range.");
    renderGapBucket("exceedingExpectationsList", "exceedingExpectationsCount", rows.filter((row) => row.gapAverage <= -0.5).sort((a, b) => a.gapAverage - b.gapAverage), "No roles currently exceed stated importance by at least 0.50 points.");
  }

  function renderGapBucket(listId, countId, rows, emptyMessage) {
    const list = document.getElementById(listId);
    const count = document.getElementById(countId);
    if (!list || !count) return;
    count.textContent = `${rows.length} role${rows.length === 1 ? "" : "s"}`;
    list.innerHTML = rows.length ? rows.map((row) => `<article class="gap-role-item"><strong>${escapeHtml(row.label)}</strong><div class="gap-role-metrics"><span>Importance <b>${row.importanceAverage.toFixed(2)}</b></span><span>Delivery <b>${row.performanceAverage.toFixed(2)}</b></span><span class="gap-value">Gap <b>${formatSigned(row.gapAverage)}</b></span><span>n=${row.count}</span></div></article>`).join("") : `<div class="gap-bucket-empty">${escapeHtml(emptyMessage)}</div>`;
  }

  function renderComments(responses) {
    const commentQuestions = [
      ["valued_programs", "Valued programs"], ["kids_needs", "Children and educator needs"],
      ["nonviewer_return", "What could win them back"], ["station_feedback_v2", "Station feedback"]
    ];
    const comments = responses.flatMap((response) => commentQuestions.flatMap(([id, label]) => {
      const value = response.answers?.[id];
      return typeof value === "string" && value.trim() ? [{ label, text: value.trim() }] : [];
    }));
    els.commentList.innerHTML = comments.length ? comments.map((comment) => `<article class="comment-card"><strong>${escapeHtml(comment.label)}</strong><p>${escapeHtml(comment.text)}</p></article>`).join("") : '<div class="empty-state">No open comments in this filtered view.</div>';
  }

  function exportRaw() {
    if (!loadedResponses.length) return window.alert("Load some responses first.");
    storage.downloadJson(`wnmu-viewer-responses-${dateStamp()}.json`, loadedResponses);
  }

  function exportSummary() {
    const responses = filteredResponses();
    if (!responses.length) return window.alert("No responses match the current filters.");
    const rows = [["section", "question_id", "item_id", "label", "value", "answered_n", "filtered_n", "schema_note"]];
    addCountRows(rows, responses, "Audience", "viewer_status", (response) => response.routeProfile?.viewer_status, false);
    addCountRows(rows, responses, "Access", "viewing_methods", (response) => response.routeProfile?.viewing_methods, true);
    addCountRows(rows, responses, "Channels", "channel_awareness", (response) => response.answers?.channel_awareness, true);
    addCountRows(rows, responses, "Channels", "channels_received", (response) => response.answers?.channels_received, true);
    addCountRows(rows, responses, "Channels", "channels_watched", (response) => response.answers?.channels_watched, true);

    const programQuestion = findQuestion("program_interest_v2");
    programQuestion.rows.forEach((row) => {
      const values = responses.map((response) => response.answers?.program_interest_v2?.[row.id]).filter(isNumericScore).map(Number);
      if (values.length) rows.push(["Programming", "program_interest_v2", row.id, row.label, average(values).toFixed(3), values.length, responses.length, "Current schema only; legacy program_interest is not remapped"]);
    });

    findQuestion("importance_roles").rows.forEach((row) => {
      const stats = pairedRoleStats(responses, row.id);
      if (!stats) return;
      rows.push(["Expectation gap", "importance_roles/performance_roles", row.id, row.label, stats.gapAverage.toFixed(3), stats.count, responses.length, "Paired respondents only"]);
    });

    downloadText(`wnmu-viewer-summary-${dateStamp()}.csv`, rows.map((row) => row.map(csvCell).join(",")).join("\n"), "text/csv");
  }

  function addCountRows(rows, responses, section, questionId, getter, arrayValue) {
    const answered = responses.filter((response) => arrayValue ? Array.isArray(getter(response)) : hasValue(getter(response)));
    const counts = arrayValue ? countArray(answered, getter) : countSingle(answered, getter);
    const labels = labelMap(questionId);
    Object.entries(counts).forEach(([value, count]) => rows.push([section, questionId, value, labels[value] || humanize(value), count, answered.length, responses.length, "Denominator is respondents who answered this question"]));
  }

  function findQuestion(id) {
    for (const stage of survey.stages) for (const page of stage.pages) {
      const question = page.questions.find((item) => item.id === id);
      if (question) return question;
    }
    return { id, options: [], rows: [] };
  }

  function resolveOptions(question) {
    if (question.options) return question.options;
    if (question.optionsFromMatrix) return (findQuestion(question.optionsFromMatrix).rows || []).map((row) => ({ value: row.id, label: row.label }));
    return [];
  }

  function labelMap(questionId) {
    return Object.fromEntries(resolveOptions(findQuestion(questionId)).map((option) => [option.value, option.label]));
  }

  function countSingle(responses, getter) {
    return responses.reduce((counts, response) => {
      const value = getter(response);
      if (hasValue(value)) counts[value] = (counts[value] || 0) + 1;
      return counts;
    }, {});
  }

  function countArray(responses, getter) {
    return responses.reduce((counts, response) => {
      const values = getter(response);
      if (Array.isArray(values)) values.forEach((value) => { counts[value] = (counts[value] || 0) + 1; });
      return counts;
    }, {});
  }

  function barMarkup(label, value, max, displayValue) {
    const width = max ? Math.max(3, Math.min(100, (value / max) * 100)) : 0;
    return `<div class="bar-item"><span class="bar-label">${escapeHtml(label)}</span><span class="bar-track"><span style="width:${width.toFixed(1)}%"></span></span><span class="bar-value">${escapeHtml(displayValue)}</span></div>`;
  }

  function makeDemoData() {
    const roles = findQuestion("importance_roles").rows.map((row) => row.id);
    const programs = findQuestion("program_interest_v2").rows.map((row) => row.id);
    const viewers = ["regular", "regular", "regular", "regular", "regular", "regular", "regular", "regular", "regular", "occasional", "occasional", "occasional", "occasional", "occasional", "occasional", "occasional", "occasional", "occasional", "occasional", "once_twice", "once_twice", "once_twice", "former", "former", "never"];
    const ages = ["55_64", "65_74", "65_74", "75_84", "55_64", "65_74", "75_84", "55_64", "65_74", "45_54", "55_64", "65_74", "75_84", "55_64", "65_74", "45_54", "75_84", "55_64", "65_74", "45_54", "55_64", "65_74", "75_84", "65_74", "85_plus"];
    const counties = ["marquette", "marquette", "delta", "dickinson", "houghton", "marquette", "alger", "marquette", "menominee", "delta", "marquette", "houghton", "dickinson", "northern_wi", "marquette", "schoolcraft", "delta", "houghton", "marquette", "menominee", "alger", "dickinson", "delta", "northern_wi", "marquette"];
    const communities = ["city", "small_town", "rural", "small_town", "rural", "city", "rural", "small_town", "rural", "city", "small_town", "rural", "small_town", "rural", "city", "remote", "small_town", "rural", "city", "rural", "remote", "small_town", "rural", "small_town", "city"];
    const childrenRoles = ["neither", "household", "neither", "neither", "educator", "neither", "household", "neither", "neither", "both", "neither", "neither", "household", "neither", "educator", "neither", "neither", "neither", "household", "neither", "neither", "neither", "neither", "neither", "neither"];
    const methodSets = [
      ["antenna", "pbs_app", "passport"], ["cable", "passport"], ["antenna"], ["cable"], ["antenna", "pbs_app"],
      ["satellite", "passport"], ["antenna", "pbs_site"], ["cable", "pbs_app"], ["antenna"], ["pbs_app", "passport"],
      ["cable"], ["antenna", "livestream"], ["satellite"], ["antenna", "pbs_app"], ["cable", "passport"],
      ["pbs_app", "youtube_social"], ["antenna"], ["cable", "pbs_site"], ["antenna", "passport"], ["pbs_app"],
      ["antenna"], ["cable"], ["antenna"], ["satellite"], ["not_watched"]
    ];

    return viewers.map((viewer, index) => {
      const methods = methodSets[index];
      const isViewer = !["never", "former"].includes(viewer);
      const importance = {};
      const performance = {};
      roles.forEach((role, roleIndex) => {
        const score = clampScore(3 + ((index + roleIndex) % 2) + (["trusted_pbs", "local_programs", "preserve_history", "reflect_region"].includes(role) ? 1 : 0));
        importance[role] = score;
        if (isViewer) performance[role] = clampScore(score - (["local_programs", "reflect_region", "online_access"].includes(role) ? 1 : 0) - ((index + roleIndex) % 5 === 0 ? 1 : 0));
      });
      const interest = {};
      programs.forEach((program, programIndex) => {
        let score = 2 + ((index + programIndex * 2) % 3);
        if (["up_history_heritage", "great_lakes_nature", "local_people", "outdoor_recreation", "national_documentaries"].includes(program)) score += 1;
        if (program === "children_education" && childrenRoles[index] !== "neither") score = 5;
        interest[program] = clampScore(score);
      });
      const top = Object.entries(interest).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id]) => id);
      const aware = ["wnmu_13_1", ...(index % 3 ? ["pbs_kids_13_2"] : []), ...(index % 2 ? [] : ["wnmu_plus_13_3"]), ...(index % 4 ? [] : ["mlc_13_4"])];
      const received = methods.includes("antenna") ? ["wnmu_13_1", "pbs_kids_13_2", "wnmu_plus_13_3", "mlc_13_4"] : methods.includes("cable") ? ["wnmu_13_1", "pbs_kids_13_2", "wnmu_plus_13_3"] : methods.includes("satellite") ? ["wnmu_13_1"] : ["not_sure"];
      const watched = viewer === "never" ? ["none"] : ["wnmu_13_1", ...(childrenRoles[index] !== "neither" ? ["pbs_kids_13_2"] : []), ...(index % 3 ? [] : ["wnmu_plus_13_3"])];
      return {
        responseId: `synthetic-${String(index + 1).padStart(2, "0")}`,
        id: `synthetic-${String(index + 1).padStart(2, "0")}`,
        respondentId: `synthetic-person-${String(index + 1).padStart(2, "0")}`,
        schemaVersion: config.schemaVersion,
        surveyVersion: config.schemaVersion,
        buildVersion: config.buildVersion,
        mode: "test",
        source: "synthetic-up-pbs-sample",
        submittedAt: new Date(Date.now() - index * 86400000).toISOString(),
        routeProfile: { viewer_status: viewer, viewing_methods: methods, children_role: childrenRoles[index] },
        answers: {
          age_range: ages[index], county_region: counties[index], community_type: communities[index],
          internet_quality: communities[index] === "remote" ? "unreliable" : "adequate",
          channel_awareness: aware, channels_received: received, channels_watched: watched,
          program_interest_v2: interest, top_program_priorities_v2: top, importance_roles: importance,
          performance_roles: isViewer ? performance : undefined,
          valued_programs: index % 7 === 0 ? "Local history, Great Lakes documentaries, and long-form PBS programs." : "",
          station_feedback_v2: isViewer && index % 6 === 0 ? "The station is trusted, but local programs should be easier to find and repeat." : "",
          nonviewer_return: !isViewer ? "A clearer schedule and more visible local programs would help." : ""
        }
      };
    });
  }

  function average(values) { return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0; }
  function clampScore(value) { return Math.max(1, Math.min(5, value)); }
  function isNumericScore(value) { return value !== "na" && hasValue(value) && !Number.isNaN(Number(value)); }
  function hasValue(value) { return value !== null && value !== undefined && value !== ""; }
  function percent(part, total) { return total ? `${Math.round((part / total) * 100)}%` : "0%"; }
  function formatSigned(value) { return value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2); }
  function dateStamp() { return new Date().toISOString().slice(0, 10); }
  function humanize(value) { return String(value || "").replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
  function csvCell(value) { return `"${String(value ?? "").replace(/"/g, '""')}"`; }

  function downloadText(filename, text, type) {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  function escapeAttr(value) { return escapeHtml(value); }
})();
