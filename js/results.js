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
    gender: "",
    education: "",
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
      filterGender: document.getElementById("filterGender"),
      filterEducation: document.getElementById("filterEducation"),
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
      genderMix: document.getElementById("genderMix"),
      educationMix: document.getElementById("educationMix"),
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
      [els.filterGender, "gender"],
      [els.filterEducation, "education"],
      [els.filterCounty, "county"],
      [els.filterChildren, "children"]
    ].forEach(([select, key]) => {
      select.addEventListener("change", () => {
        filters[key] = select.value;
        renderAnalysis();
      });
    });

    loadDemoResponses();
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
    dataSourceLabel = "25 synthetic Upper Peninsula PBS viewer responses";
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
    [els.filterViewer, els.filterMethod, els.filterAge, els.filterGender, els.filterEducation, els.filterCounty, els.filterChildren].forEach((select) => {
      select.value = "";
    });
  }

  function populateFilters() {
    fillSelect(els.filterViewer, uniqueValues((response) => response.routeProfile.viewer_status), labelMap("viewer_status"), "All viewer types");
    fillSelect(els.filterMethod, uniqueArrayValues((response) => response.routeProfile.viewing_methods), labelMap("viewing_methods"), "All methods");
    fillSelect(els.filterAge, uniqueValues((response) => response.answers.age_range), labelMap("age_range"), "All ages");
    fillSelect(els.filterGender, uniqueValues((response) => response.answers.gender), labelMap("gender"), "All genders");
    fillSelect(els.filterEducation, uniqueValues((response) => response.answers.education_level), labelMap("education_level"), "All education levels");
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
      if (filters.gender && answers.gender !== filters.gender) return false;
      if (filters.education && answers.education_level !== filters.education) return false;
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
    renderCountBars(els.genderMix, countSingle(responses, (response) => response.answers.gender), labelMap("gender"), responses.length);
    renderCountBars(els.educationMix, countSingle(responses, (response) => response.answers.education_level), labelMap("education_level"), responses.length);
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

    const viewers = [
      "regular", "regular", "regular", "regular", "regular", "regular", "regular", "regular", "regular",
      "occasional", "occasional", "occasional", "occasional", "occasional", "occasional", "occasional", "occasional", "occasional", "occasional",
      "once_twice", "once_twice", "once_twice", "former", "former", "never"
    ];
    const ages = [
      "55_64", "65_74", "65_74", "75_84", "55_64", "65_74", "75_84", "55_64", "65_74",
      "45_54", "55_64", "65_74", "75_84", "55_64", "65_74", "45_54", "75_84", "55_64", "65_74",
      "45_54", "55_64", "65_74", "75_84", "65_74", "85_plus"
    ];
    const genders = [
      "woman", "woman", "man", "woman", "man", "woman", "woman", "man", "woman", "woman",
      "man", "woman", "man", "woman", "woman", "man", "woman", "man", "woman", "man",
      "woman", "man", "woman", "man", "woman"
    ];
    const education = [
      "bachelor", "graduate", "associate", "bachelor", "graduate", "bachelor", "some_college", "associate", "graduate", "bachelor",
      "bachelor", "graduate", "associate", "bachelor", "graduate", "some_college", "bachelor", "associate", "graduate", "bachelor",
      "some_college", "graduate", "bachelor", "bachelor", "graduate"
    ];
    const counties = [
      "marquette", "marquette", "delta", "dickinson", "houghton", "marquette", "alger", "marquette", "menominee", "delta",
      "marquette", "houghton", "dickinson", "northern_wi", "marquette", "schoolcraft", "delta", "houghton", "marquette", "menominee",
      "alger", "dickinson", "delta", "northern_wi", "marquette"
    ];
    const communities = [
      "city", "small_town", "rural", "small_town", "rural", "city", "rural", "small_town", "rural", "city",
      "small_town", "rural", "small_town", "rural", "city", "remote", "small_town", "rural", "city", "rural",
      "remote", "small_town", "rural", "small_town", "city"
    ];
    const childrenRoles = [
      "neither", "household", "neither", "neither", "educator", "neither", "household", "neither", "neither", "both",
      "neither", "neither", "household", "neither", "educator", "neither", "neither", "neither", "household", "neither",
      "neither", "neither", "neither", "neither", "neither"
    ];
    const methodSets = [
      ["antenna", "pbs_app", "passport"], ["cable", "passport"], ["antenna"], ["cable"], ["antenna", "pbs_app"],
      ["satellite", "passport"], ["antenna", "pbs_site"], ["cable", "pbs_app"], ["antenna"], ["pbs_app", "passport"],
      ["cable"], ["antenna", "livestream"], ["satellite"], ["antenna", "pbs_app"], ["cable", "passport"],
      ["pbs_app", "youtube_social"], ["antenna"], ["cable", "pbs_site"], ["antenna", "passport"], ["pbs_app"],
      ["antenna"], ["cable"], ["antenna"], ["satellite"], ["not_watched"]
    ];
    const employment = ages.map((age, index) => {
      if (["65_74", "75_84", "85_plus"].includes(age)) return index % 5 === 0 ? ["part", "retired"] : ["retired"];
      if (index % 7 === 0) return ["self"];
      if (index % 6 === 0) return ["part"];
      return ["full"];
    });
    const focusSets = [
      ["up_history", "great_lakes", "local_people", "nature", "outdoors"],
      ["british_drama", "national_docs", "local_arts", "books_food", "up_history"],
      ["local_news", "civil_discussion", "state_policy", "economy", "great_lakes"],
      ["health", "nature", "home_garden", "how_to", "local_people"],
      ["outdoors", "resources", "great_lakes", "nature", "travel"]
    ];
    const comments = [
      "Keep telling stories from outside Marquette as well as in town.",
      "I value programs that treat viewers like adults and do not rush every subject.",
      "A weekly program about the Great Lakes and Upper Peninsula communities would get watched in our house.",
      "It is sometimes difficult to know when a local program will be repeated.",
      "Please keep the British mysteries, but make local programs easier to find online.",
      "More practical coverage of rural health care and services would be useful.",
      "Outdoor programming should include conservation, access, and local history—not only hunting shows.",
      "I would like more performances and programs featuring artists from across the U.P.",
      "The station is trusted, but it can feel too centered on Marquette County.",
      "A simple weekly email with local program highlights would help me watch more often."
    ];

    return viewers.map((viewer, index) => {
      const methods = methodSets[index];
      const isViewer = viewer !== "never";
      const isOnline = methods.some((method) => ["livestream", "pbs_site", "pbs_app", "passport", "youtube_social"].includes(method));
      const isRural = ["rural", "remote"].includes(communities[index]);
      const focus = new Set(focusSets[index % focusSets.length]);

      const importance = {};
      const performance = {};
      roles.forEach((role, roleIndex) => {
        let score = 3 + ((index + roleIndex) % 2);
        if (["trusted_pbs", "local_programs", "regional_issues", "preserve_history", "reflect_region", "science_nature"].includes(role)) score += 1;
        if (role === "limited_internet" && isRural) score += 1;
        if (role === "online_access" && isOnline) score += 1;
        if (role === "children" && childrenRoles[index] !== "neither") score += 1;
        importance[role] = clampScore(score);

        if (isViewer) {
          let penalty = ((index + roleIndex) % 3 === 0) ? 1 : 0;
          if (["local_programs", "reflect_region", "online_access", "regional_issues"].includes(role)) penalty += 1;
          if (role === "trusted_pbs") penalty = 0;
          performance[role] = clampScore(importance[role] - penalty);
        }
      });

      const interest = {};
      programs.forEach((program, programIndex) => {
        let score = 2 + ((index + programIndex * 3) % 3);
        if (["up_history", "great_lakes", "local_people", "nature", "outdoors", "national_docs"].includes(program)) score += 1;
        if (focus.has(program)) score += 1;
        if (program === "kids" && childrenRoles[index] !== "neither") score = 5;
        if (program === "kids" && childrenRoles[index] === "neither") score = Math.min(score, 3);
        interest[program] = clampScore(score);
      });

      const top = Object.entries(interest)
        .sort((a, b) => b[1] - a[1] || programs.indexOf(a[0]) - programs.indexOf(b[0]))
        .slice(0, 5)
        .map(([id]) => id);

      const relationships = [];
      if (index < 10 || index === 14 || index === 18) relationships.push("donor");
      if (methods.includes("passport")) relationships.push("passport_user");
      if ([0, 4, 9, 14, 19].includes(index)) relationships.push("nmu_affiliation");
      if ([4, 9, 14].includes(index)) relationships.push("educator");
      if (!relationships.length) relationships.push("none");

      return {
        id: `sample-${String(index + 1).padStart(2, "0")}`,
        createdAt: new Date(Date.now() - index * 86400000).toISOString(),
        surveyVersion: survey.version,
        source: "synthetic-up-pbs-sample",
        routeProfile: {
          viewer_status: viewer,
          viewing_methods: methods,
          children_role: childrenRoles[index],
          station_relationships: relationships
        },
        answers: {
          age_range: ages[index],
          gender: genders[index],
          education_level: education[index],
          county_region: counties[index],
          community_type: communities[index],
          household_size: index % 6 === 0 ? "1" : "2",
          employment: employment[index],
          internet_quality: communities[index] === "remote" ? "unreliable" : (isRural && index % 3 === 0 ? "slow" : "adequate"),
          importance_roles: importance,
          performance_roles: isViewer ? performance : undefined,
          program_interest: interest,
          top_program_priorities: top,
          most_important_responsibility: index % 4 === 0 ? "Provide trusted programming while telling more stories from communities throughout the Upper Peninsula." : "",
          never_lose: index % 5 === 0 ? "Educational programs and thoughtful documentaries without commercial clutter." : "",
          does_well: isViewer && index % 4 === 1 ? "Trusted national PBS programs, documentaries, and programs that take time with a subject." : "",
          falls_short: isViewer && index % 4 === 2 ? "Local programs and repeat times can be hard to find, especially online." : "",
          underrepresented: index % 6 === 0 ? "Smaller rural communities and the western Upper Peninsula could appear more often." : "",
          missing_subject: index % 3 === 0 ? comments[index % comments.length] : "",
          one_program_change: index % 7 === 0 ? "Create a dependable weekly slot for new Upper Peninsula programs and repeat it at another time." : "",
          final_comment: index === 0 ? "Synthetic sample response for dashboard testing—not a real viewer comment." : ""
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
