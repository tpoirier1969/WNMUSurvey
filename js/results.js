(function () {
  "use strict";

  const survey = window.WNMU_SURVEY;
  const storage = window.WNMUStorage;
  let loadedResponses = [];
  let dataSourceLabel = "No responses loaded";

  const els = {};
  const filters = {
    viewer: "",
    method: "",
    age: "",
    county: "",
    children: ""
  };

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    Object.assign(els, {
      loadLocal: document.getElementById("loadLocal"),
      jsonUpload: document.getElementById("jsonUpload"),
      loadDemo: document.getElementById("loadDemo"),
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
      programInterest: document.getElementById("programInterest"),
      topPriorities: document.getElementById("topPriorities"),
      gapTable: document.getElementById("gapTable"),
      ageMix: document.getElementById("ageMix"),
      countyMix: document.getElementById("countyMix"),
      commentList: document.getElementById("commentList")
    });

    els.loadLocal.addEventListener("click", loadLocalResponses);
    els.loadDemo.addEventListener("click", loadDemoResponses);
    els.jsonUpload.addEventListener("change", importJson);
    els.exportRaw.addEventListener("click", exportRaw);
    els.exportSummary.addEventListener("click", exportSummary);
    els.clearLocal.addEventListener("click", clearLocalResponses);

    [
      [els.filterViewer, "viewer"],
      [els.filterMethod, "method"],
      [els.filterAge, "age"],
      [els.filterCounty, "county"],
      [els.filterChildren, "children"]
    ].forEach(([select, key]) => {
      select.addEventListener("change", () => {
        filters[key] = select.value;
        renderAnalysis();
      });
    });

    loadLocalResponses();
  }

  function loadLocalResponses() {
    loadedResponses = storage.getResponses();
    dataSourceLabel = "browser responses";
    resetFilters();
    populateFilters();
    renderAnalysis();
  }

  function loadDemoResponses() {
    loadedResponses = makeDemoData();
    dataSourceLabel = "synthetic demonstration data";
    resetFilters();
    populateFilters();
    renderAnalysis();
  }

  async function importJson(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const responses = normalizeImportedData(parsed);
      if (!responses.length) throw new Error("No responses were found in that JSON file.");
      loadedResponses = responses;
      dataSourceLabel = `imported file: ${file.name}`;
      resetFilters();
      populateFilters();
      renderAnalysis();
    } catch (error) {
      window.alert(`Could not load that JSON file. ${error.message}`);
    } finally {
      event.target.value = "";
    }
  }

  function normalizeImportedData(parsed) {
    if (Array.isArray(parsed)) return parsed.filter(isResponseLike);
    if (parsed && Array.isArray(parsed.responses)) return parsed.responses.filter(isResponseLike);
    if (isResponseLike(parsed)) return [parsed];
    return [];
  }

  function isResponseLike(item) {
    return Boolean(item && typeof item === "object" && item.routeProfile && item.answers);
  }

  function clearLocalResponses() {
    const count = storage.getResponses().length;
    if (!count) {
      window.alert("There are no browser responses to clear.");
      return;
    }
    if (!window.confirm(`Clear ${count} submitted response${count === 1 ? "" : "s"} from this browser? Export them first if they matter.`)) return;
    storage.clearResponses();
    loadLocalResponses();
  }

  function resetFilters() {
    Object.keys(filters).forEach((key) => {
      filters[key] = "";
    });
    [els.filterViewer, els.filterMethod, els.filterAge, els.filterCounty, els.filterChildren].forEach((select) => {
      select.value = "";
    });
  }

  function populateFilters() {
    fillSelect(els.filterViewer, uniqueValues((response) => response.routeProfile.viewer_status), labelMap("viewer_status"), "All viewer types");
    fillSelect(els.filterMethod, uniqueArrayValues((response) => response.routeProfile.viewing_methods), labelMap("viewing_methods"), "All methods");
    fillSelect(els.filterAge, uniqueValues((response) => response.answers.age_range), labelMap("age_range"), "All ages");
    fillSelect(els.filterCounty, uniqueValues((response) => response.answers.county_region), labelMap("county_region"), "All locations");
    fillSelect(els.filterChildren, uniqueValues((response) => response.routeProfile.children_role), labelMap("children_role"), "All households and roles");
  }

  function fillSelect(select, values, labels, firstLabel) {
    select.innerHTML = `<option value="">${escapeHtml(firstLabel)}</option>` + values
      .sort((a, b) => String(labels[a] || a).localeCompare(String(labels[b] || b)))
      .map((value) => `<option value="${escapeAttr(value)}">${escapeHtml(labels[value] || humanize(value))}</option>`)
      .join("");
  }

  function uniqueValues(getter) {
    return Array.from(new Set(loadedResponses.map(getter).filter((value) => value !== undefined && value !== null && value !== "")));
  }

  function uniqueArrayValues(getter) {
    const values = loadedResponses.flatMap((response) => {
      const value = getter(response);
      return Array.isArray(value) ? value : [];
    });
    return Array.from(new Set(values));
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
    els.emptyState.hidden = hasData;
    els.analysisContent.hidden = !hasData;

    if (!hasData) {
      els.dataStatus.textContent = "No responses loaded.";
      return;
    }

    els.dataStatus.textContent = `${loadedResponses.length} loaded from ${dataSourceLabel}; ${responses.length} match current filters.`;
    renderMetrics(responses);
    renderCountBars(els.viewerMix, countSingle(responses, (response) => response.routeProfile.viewer_status), labelMap("viewer_status"), responses.length);
    renderCountBars(els.methodMix, countArray(responses, (response) => response.routeProfile.viewing_methods), labelMap("viewing_methods"), responses.length);
    renderProgramInterest(responses);
    renderTopPriorities(responses);
    renderGapTable(responses);
    renderCountBars(els.ageMix, countSingle(responses, (response) => response.answers.age_range), labelMap("age_range"), responses.length);
    renderCountBars(els.countyMix, countSingle(responses, (response) => response.answers.county_region), labelMap("county_region"), responses.length);
    renderComments(responses);
  }

  function renderMetrics(responses) {
    const total = responses.length;
    const current = responses.filter((response) => ["regular", "occasional", "once_twice"].includes(response.routeProfile.viewer_status)).length;
    const onlineMethods = ["livestream", "pbs_site", "pbs_app", "passport", "youtube_social"];
    const online = responses.filter((response) => (response.routeProfile.viewing_methods || []).some((method) => onlineMethods.includes(method))).length;
    const children = responses.filter((response) => ["household", "educator", "both"].includes(response.routeProfile.children_role)).length;

    els.metricResponses.textContent = total;
    els.metricResponsesNote.textContent = `${loadedResponses.length} total loaded.`;
    els.metricCurrent.textContent = percent(current, total);
    els.metricOnline.textContent = percent(online, total);
    els.metricChildren.textContent = percent(children, total);
  }

  function renderCountBars(container, counts, labels, denominator) {
    const entries = Object.entries(counts)
      .filter(([value]) => value && value !== "prefer_not")
      .sort((a, b) => b[1] - a[1]);

    if (!entries.length) {
      container.innerHTML = '<div class="empty-state">No responses in this view.</div>';
      return;
    }

    const max = Math.max(...entries.map(([, count]) => count), 1);
    container.innerHTML = entries.map(([value, count]) => barMarkup(labels[value] || humanize(value), count, max, `${count} · ${percent(count, denominator)}`)).join("");
  }

  function renderProgramInterest(responses) {
    const question = findQuestion("program_interest");
    const stats = question.rows.map((row) => {
      const values = responses
        .map((response) => response.answers.program_interest && response.answers.program_interest[row.id])
        .filter(isNumericScore)
        .map(Number);
      return {
        id: row.id,
        label: row.label,
        average: average(values),
        count: values.length
      };
    }).filter((item) => item.count > 0).sort((a, b) => b.average - a.average).slice(0, 12);

    if (!stats.length) {
      els.programInterest.innerHTML = '<div class="empty-state">No programming interest ratings in this view.</div>';
      return;
    }

    els.programInterest.innerHTML = stats.map((item) => barMarkup(item.label, item.average, 5, `${item.average.toFixed(2)} · n=${item.count}`)).join("");
  }

  function renderTopPriorities(responses) {
    const matrix = findQuestion("program_interest");
    const labels = matrix.rows.reduce((map, row) => {
      map[row.id] = row.label;
      return map;
    }, {});
    const counts = countArray(responses, (response) => response.answers.top_program_priorities);
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 12);

    if (!entries.length) {
      els.topPriorities.innerHTML = '<div class="empty-state">No top-five programming choices in this view.</div>';
      return;
    }

    const max = Math.max(...entries.map(([, count]) => count), 1);
    els.topPriorities.innerHTML = entries.map(([value, count]) => barMarkup(labels[value] || humanize(value), count, max, `${count} · ${percent(count, responses.length)}`)).join("");
  }

  function renderGapTable(responses) {
    const importanceQuestion = findQuestion(survey.gapPairs.importanceQuestion);
    const rows = importanceQuestion.rows.map((row) => {
      const importance = responses
        .map((response) => response.answers.importance_roles && response.answers.importance_roles[row.id])
        .filter(isNumericScore)
        .map(Number);
      const performance = responses
        .map((response) => response.answers.performance_roles && response.answers.performance_roles[row.id])
        .filter(isNumericScore)
        .map(Number);
      const importanceAverage = average(importance);
      const performanceAverage = average(performance);
      const gap = importance.length && performance.length ? importanceAverage - performanceAverage : null;
      return {
        label: row.label,
        importanceAverage,
        performanceAverage,
        importanceCount: importance.length,
        performanceCount: performance.length,
        gap
      };
    }).filter((row) => row.importanceCount || row.performanceCount)
      .sort((a, b) => (b.gap ?? -99) - (a.gap ?? -99));

    if (!rows.length) {
      els.gapTable.innerHTML = '<tr><td colspan="5">No paired importance/performance ratings in this view.</td></tr>';
      return;
    }

    els.gapTable.innerHTML = rows.map((row) => `
      <tr>
        <td>${escapeHtml(row.label)}</td>
        <td>${row.importanceCount ? row.importanceAverage.toFixed(2) : "—"}</td>
        <td>${row.performanceCount ? row.performanceAverage.toFixed(2) : "—"}</td>
        <td class="${row.gap !== null && row.gap >= 1 ? "gap-high" : ""}">${row.gap === null ? "—" : row.gap.toFixed(2)}</td>
        <td>${row.importanceCount} / ${row.performanceCount}</td>
      </tr>
    `).join("");
  }

  function renderComments(responses) {
    const commentQuestions = [
      ["most_important_responsibility", "Most important responsibility"],
      ["never_lose", "Never lose"],
      ["nonviewer_return", "What could win them back"],
      ["broadcast_improvement", "Broadcast improvement"],
      ["does_well", "Doing well"],
      ["falls_short", "Falling short"],
      ["underrepresented", "Underrepresented"],
      ["valued_programs", "Valued programs"],
      ["missing_subject", "Missing subject"],
      ["one_program_change", "Programming change"],
      ["kids_needs", "Children and educator needs"],
      ["context_note", "Household or community context"],
      ["final_comment", "Final comment"]
    ];

    const comments = [];
    responses.forEach((response) => {
      commentQuestions.forEach(([id, label]) => {
        const value = response.answers[id];
        if (typeof value === "string" && value.trim()) {
          comments.push({ label, text: value.trim() });
        }
      });
    });

    if (!comments.length) {
      els.commentList.innerHTML = '<div class="empty-state">No open comments in this filtered view.</div>';
      return;
    }

    els.commentList.innerHTML = comments.map((comment) => `
      <article class="comment-card"><strong>${escapeHtml(comment.label)}</strong><p>${escapeHtml(comment.text)}</p></article>
    `).join("");
  }

  function barMarkup(label, value, max, displayValue) {
    const width = max ? Math.max(3, Math.min(100, (value / max) * 100)) : 0;
    return `
      <div class="bar-item">
        <span class="bar-label">${escapeHtml(label)}</span>
        <span class="bar-track"><span style="width:${width.toFixed(1)}%"></span></span>
        <span class="bar-value">${escapeHtml(displayValue)}</span>
      </div>
    `;
  }

  function countSingle(responses, getter) {
    return responses.reduce((counts, response) => {
      const value = getter(response);
      if (value !== undefined && value !== null && value !== "") counts[value] = (counts[value] || 0) + 1;
      return counts;
    }, {});
  }

  function countArray(responses, getter) {
    return responses.reduce((counts, response) => {
      const values = getter(response);
      if (!Array.isArray(values)) return counts;
      values.forEach((value) => {
        counts[value] = (counts[value] || 0) + 1;
      });
      return counts;
    }, {});
  }

  function findQuestion(id) {
    const routeQuestion = survey.routingQuestions.find((question) => question.id === id);
    if (routeQuestion) return routeQuestion;
    for (const section of survey.sections) {
      const question = section.questions.find((item) => item.id === id);
      if (question) return question;
    }
    return { id, options: [], rows: [] };
  }

  function labelMap(questionId) {
    const question = findQuestion(questionId);
    return (question.options || []).reduce((map, option) => {
      map[option.value] = option.label;
      return map;
    }, {});
  }

  function average(values) {
    if (!values.length) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  function isNumericScore(value) {
    return value !== "na" && value !== null && value !== undefined && value !== "" && !Number.isNaN(Number(value));
  }

  function percent(part, total) {
    return total ? `${Math.round((part / total) * 100)}%` : "0%";
  }

  function exportRaw() {
    if (!loadedResponses.length) {
      window.alert("Load some responses first.");
      return;
    }
    storage.downloadJson(`wnmu-viewer-responses-${dateStamp()}.json`, loadedResponses);
  }

  function exportSummary() {
    const responses = filteredResponses();
    if (!responses.length) {
      window.alert("No responses match the current filters.");
      return;
    }

    const rows = [["section", "item", "value", "n"]];
    const viewerCounts = countSingle(responses, (response) => response.routeProfile.viewer_status);
    Object.entries(viewerCounts).forEach(([value, count]) => rows.push(["Viewer mix", labelMap("viewer_status")[value] || value, count, responses.length]));

    const methodCounts = countArray(responses, (response) => response.routeProfile.viewing_methods);
    Object.entries(methodCounts).forEach(([value, count]) => rows.push(["Viewing methods", labelMap("viewing_methods")[value] || value, count, responses.length]));

    const programQuestion = findQuestion("program_interest");
    programQuestion.rows.forEach((row) => {
      const values = responses.map((response) => response.answers.program_interest && response.answers.program_interest[row.id]).filter(isNumericScore).map(Number);
      if (values.length) rows.push(["Program interest average", row.label, average(values).toFixed(3), values.length]);
    });

    const importanceQuestion = findQuestion("importance_roles");
    importanceQuestion.rows.forEach((row) => {
      const importance = responses.map((response) => response.answers.importance_roles && response.answers.importance_roles[row.id]).filter(isNumericScore).map(Number);
      const performance = responses.map((response) => response.answers.performance_roles && response.answers.performance_roles[row.id]).filter(isNumericScore).map(Number);
      if (importance.length) rows.push(["Importance average", row.label, average(importance).toFixed(3), importance.length]);
      if (performance.length) rows.push(["Performance average", row.label, average(performance).toFixed(3), performance.length]);
      if (importance.length && performance.length) rows.push(["Expectation gap", row.label, (average(importance) - average(performance)).toFixed(3), Math.min(importance.length, performance.length)]);
    });

    downloadText(`wnmu-viewer-summary-${dateStamp()}.csv`, rows.map((row) => row.map(csvCell).join(",")).join("\n"), "text/csv");
  }

  function csvCell(value) {
    const string = String(value ?? "");
    return `"${string.replace(/"/g, '""')}"`;
  }

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

  function dateStamp() {
    return new Date().toISOString().slice(0, 10);
  }

  function humanize(value) {
    return String(value || "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function makeDemoData() {
    const roles = findQuestion("importance_roles").rows.map((row) => row.id);
    const programs = findQuestion("program_interest").rows.map((row) => row.id);
    const viewers = ["regular", "regular", "occasional", "occasional", "once_twice", "former", "former", "never", "unsure", "regular", "occasional", "never"];
    const ages = ["65_74", "55_64", "45_54", "35_44", "25_34", "75_84", "55_64", "18_24", "45_54", "65_74", "35_44", "25_34"];
    const counties = ["marquette", "delta", "houghton", "dickinson", "marquette", "alger", "northern_wi", "marquette", "baraga", "ontonagon", "menominee", "chippewa"];
    const childrenRoles = ["neither", "neither", "household", "both", "educator", "neither", "neither", "household", "neither", "neither", "household", "neither"];
    const methodSets = [
      ["antenna", "pbs_app", "passport"],
      ["cable"],
      ["pbs_app", "youtube_social"],
      ["antenna", "livestream"],
      ["pbs_site", "pbs_app"],
      ["cable"],
      ["antenna"],
      ["not_watched"],
      ["youtube_social"],
      ["satellite", "passport"],
      ["antenna", "pbs_app"],
      ["not_watched"]
    ];

    return viewers.map((viewer, index) => {
      const isViewer = viewer !== "never";
      const importance = {};
      const performance = {};
      roles.forEach((role, roleIndex) => {
        importance[role] = clampScore(3 + ((index + roleIndex) % 3));
        if (isViewer) performance[role] = clampScore(2 + ((index * 2 + roleIndex) % 4));
      });

      const interest = {};
      programs.forEach((program, programIndex) => {
        let score = 1 + ((index + programIndex * 2) % 5);
        if (["up_history", "great_lakes", "local_people", "nature", "outdoors"].includes(program)) score = Math.min(5, score + 1);
        if (childrenRoles[index] !== "neither" && program === "kids") score = 5;
        interest[program] = score;
      });

      const top = Object.entries(interest).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id]) => id);
      return {
        id: `demo-${index + 1}`,
        createdAt: new Date(Date.now() - index * 86400000).toISOString(),
        surveyVersion: survey.version,
        source: "synthetic-demo",
        routeProfile: {
          viewer_status: viewer,
          viewing_methods: methodSets[index],
          children_role: childrenRoles[index],
          station_relationships: index % 4 === 0 ? ["donor"] : ["none"]
        },
        answers: {
          age_range: ages[index],
          county_region: counties[index],
          internet_quality: index % 4 === 0 ? "unreliable" : "adequate",
          importance_roles: importance,
          performance_roles: isViewer ? performance : undefined,
          program_interest: interest,
          top_program_priorities: top,
          most_important_responsibility: index % 3 === 0 ? "Tell more stories from communities outside Marquette and keep local history available." : "",
          never_lose: index % 4 === 0 ? "Trusted educational programming without commercial clutter." : "",
          does_well: isViewer && index % 3 === 1 ? "National PBS programs and thoughtful long-form material." : "",
          falls_short: isViewer && index % 3 === 2 ? "It can be hard to know when local programs are airing or where to find them online." : "",
          nonviewer_return: !isViewer ? "A clearer explanation of what is local and an easy place to browse it online." : "",
          missing_subject: index % 4 === 2 ? "More coverage of rural health, outdoor access, and small-town economic changes." : "",
          final_comment: index === 0 ? "This is demonstration data, not a real viewer comment." : ""
        }
      };
    });
  }

  function clampScore(value) {
    return Math.max(1, Math.min(5, value));
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttr(value) {
    return escapeHtml(value);
  }
})();
