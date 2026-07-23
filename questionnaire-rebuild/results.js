(function () {
  "use strict";

  const survey = window.WNMU_REBUILD_SURVEY;
  const followUps = window.WNMU_FOLLOW_UPS;
  const storage = window.WNMU_REBUILD_STORAGE;
  if (!survey || !followUps || !storage) throw new Error("Results scripts loaded in the wrong order.");

  const els = {
    coreCount: document.getElementById("coreResponseCount"),
    followRespondents: document.getElementById("followUpRespondentCount"),
    followModules: document.getElementById("followUpModuleCount"),
    viewerFilter: document.getElementById("viewerStatusFilter"),
    childrenFilter: document.getElementById("childrenRoleFilter"),
    countyFilter: document.getElementById("countyFilter"),
    clearFilters: document.getElementById("clearFilters"),
    download: document.getElementById("downloadResults"),
    moduleGrid: document.getElementById("moduleCompletionGrid"),
    coreResults: document.getElementById("coreResults"),
    followResults: document.getElementById("followUpResults")
  };

  const allCore = storage.getResponses();
  const allFollow = storage.getFollowUpResponses(false);
  const coreQuestions = survey.stages.flatMap((stage) => stage.pages.flatMap((page) => page.questions));
  const coreQuestionMap = new Map(coreQuestions.map((question) => [question.id, question]));
  const allCoreById = new Map(allCore.map((response) => [response.responseId, response]));

  populateFilters();
  [els.viewerFilter, els.childrenFilter, els.countyFilter].forEach((control) => control.addEventListener("change", render));
  els.clearFilters.addEventListener("click", () => {
    els.viewerFilter.value = "";
    els.childrenFilter.value = "";
    els.countyFilter.value = "";
    render();
  });
  els.download.addEventListener("click", downloadResults);
  render();

  function populateFilters() {
    populateSelect(els.viewerFilter, unique(allCore.map((response) => response.routeProfile?.viewer_status)), "viewer_status");
    populateSelect(els.childrenFilter, unique(allCore.map((response) => response.routeProfile?.children_role)), "children_role");
    populateSelect(els.countyFilter, unique(allCore.map((response) => response.answers?.county_region)), "county_region");
  }

  function populateSelect(select, values, questionId) {
    values.filter(hasValue).sort((a, b) => labelForCoreValue(questionId, a).localeCompare(labelForCoreValue(questionId, b))).forEach((value) => {
      const option = document.createElement("option");
      option.value = String(value);
      option.textContent = labelForCoreValue(questionId, value);
      select.append(option);
    });
  }

  function filteredData() {
    const core = allCore.filter((response) => {
      if (els.viewerFilter.value && String(response.routeProfile?.viewer_status ?? "") !== els.viewerFilter.value) return false;
      if (els.childrenFilter.value && String(response.routeProfile?.children_role ?? "") !== els.childrenFilter.value) return false;
      if (els.countyFilter.value && String(response.answers?.county_region ?? "") !== els.countyFilter.value) return false;
      return true;
    });
    const coreIds = new Set(core.map((response) => response.responseId));
    const follow = allFollow.filter((response) => coreIds.has(response.coreResponseId));
    return { core, follow };
  }

  function render() {
    const { core, follow } = filteredData();
    els.coreCount.textContent = core.length;
    els.followRespondents.textContent = new Set(follow.map((response) => response.respondentId)).size;
    els.followModules.textContent = follow.length;
    renderModuleCompletion(core, follow);
    renderCoreResults(core);
    renderFollowUpResults(follow);
  }

  function renderModuleCompletion(core, follow) {
    els.moduleGrid.innerHTML = followUps.modules.map((module) => {
      const responses = follow.filter((response) => response.moduleId === module.id);
      const respondents = new Set(responses.map((response) => response.respondentId)).size;
      const coreEligible = module.eligibility?.coreChildrenRoleIn
        ? core.filter((response) => module.eligibility.coreChildrenRoleIn.includes(response.routeProfile?.children_role)).length
        : core.length;
      const rate = coreEligible ? Math.round((respondents / coreEligible) * 100) : 0;
      return `<article class="module-completion-card"><p class="eyebrow">${escapeHtml(module.time)}</p><h3>${escapeHtml(module.title)}</h3><strong>${respondents}</strong><span>submitted responses</span><p>${rate}% of ${coreEligible} eligible main respondents in view</p></article>`;
    }).join("");
  }

  function renderCoreResults(responses) {
    if (!responses.length) {
      els.coreResults.innerHTML = emptyState("No rebuild questionnaire responses match the current filters.");
      return;
    }
    els.coreResults.innerHTML = survey.stages.map((stage, stageIndex) => {
      const questions = stage.pages.flatMap((page) => page.questions);
      return `<details class="result-section" ${stageIndex === 0 ? "open" : ""}><summary><span>${escapeHtml(stage.title)}</span><small>${questions.length} questions</small></summary><div class="result-question-grid">${questions.map((question) => renderQuestionSummary(question, responses, "core")).join("")}</div></details>`;
    }).join("");
  }

  function renderFollowUpResults(responses) {
    if (!responses.length) {
      els.followResults.innerHTML = emptyState("No linked follow-up responses match the current filters.");
      return;
    }
    els.followResults.innerHTML = followUps.modules.map((module, moduleIndex) => {
      const moduleResponses = responses.filter((response) => response.moduleId === module.id);
      const questions = module.pages.flatMap((page) => page.questions);
      return `<details class="result-section" ${moduleIndex === 0 ? "open" : ""}><summary><span>${escapeHtml(module.title)}</span><small>${moduleResponses.length} submitted modules</small></summary><div class="result-question-grid">${questions.map((question) => renderQuestionSummary(question, moduleResponses, "followup")).join("")}</div></details>`;
    }).join("");
  }

  function renderQuestionSummary(question, responses, source) {
    const applicable = responses.filter((response) => source === "core" ? coreQuestionApplicable(question, response) : followUpQuestionApplicable(question, response));
    const values = applicable.map((response) => response.answers?.[question.id]).filter(hasValue);
    const answered = values.length;
    const skipped = Math.max(0, applicable.length - answered);
    const notApplicable = Math.max(0, responses.length - applicable.length);
    const header = `<header><h3>${escapeHtml(question.label)}</h3><p>${answered} answered · ${skipped} skipped${notApplicable ? ` · ${notApplicable} not applicable` : ""}</p></header>`;

    if (!applicable.length) return `<article class="result-question">${header}<p class="empty-answer">No applicable respondents in view.</p></article>`;
    if (!answered) return `<article class="result-question">${header}<p class="empty-answer">No answers in view.</p></article>`;
    if (question.type === "textarea") return `<article class="result-question text-results">${header}<ul>${values.map((value) => `<li>${escapeHtml(value)}</li>`).join("")}</ul></article>`;
    if (question.type === "matrix" || values.some((value) => value && typeof value === "object" && !Array.isArray(value))) {
      return `<article class="result-question matrix-results">${header}${renderMatrix(question, values, source)}</article>`;
    }
    return `<article class="result-question">${header}${renderCounts(question, values, answered, source)}</article>`;
  }

  function coreQuestionApplicable(question, response) {
    const rule = question.when;
    if (!rule) return true;
    const role = response.routeProfile?.children_role;
    const status = response.routeProfile?.viewer_status;
    const methods = response.routeProfile?.viewing_methods || [];
    if (rule.childrenRoleIn && !rule.childrenRoleIn.includes(role)) return false;
    if (rule.viewerStatusIn && !rule.viewerStatusIn.includes(status)) return false;
    if (rule.viewerStatusNotIn && rule.viewerStatusNotIn.includes(status)) return false;
    if (rule.hasAnyMethod && !rule.hasAnyMethod.some((method) => methods.includes(method))) return false;
    return true;
  }

  function followUpQuestionApplicable(question, response) {
    const allowed = question.when?.coreChildrenRoleIn;
    if (!allowed) return true;
    const core = allCoreById.get(response.coreResponseId);
    return Boolean(core && allowed.includes(core.routeProfile?.children_role));
  }

  function renderMatrix(question, values, source) {
    const rowIds = new Set();
    values.forEach((value) => Object.keys(value || {}).forEach((rowId) => rowIds.add(rowId)));
    const rows = question.rows || Array.from(rowIds).map((id) => ({ id, label: id }));
    return `<div class="matrix-summary">${rows.map((row) => {
      const rowValues = values.map((value) => value?.[row.id]).filter(hasValue);
      if (!rowValues.length) return "";
      return `<section><h4>${escapeHtml(row.label || row.id)}</h4>${renderCountRows(countValues(rowValues), rowValues.length, (value) => labelForValue(question, value, source))}</section>`;
    }).join("")}</div>`;
  }

  function renderCounts(question, values, answered, source) {
    const flattened = values.flatMap((value) => Array.isArray(value) ? value : [value]);
    return renderCountRows(countValues(flattened), answered, (value) => labelForValue(question, value, source));
  }

  function renderCountRows(counts, denominator, labeler) {
    const rows = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
    return `<div class="answer-bars">${rows.map(([value, count]) => {
      const percent = denominator ? Math.round((count / denominator) * 100) : 0;
      return `<div class="answer-row"><div><span>${escapeHtml(labeler(value))}</span><strong>${count} · ${percent}%</strong></div><div class="answer-track" aria-hidden="true"><span style="width:${Math.min(100, percent)}%"></span></div></div>`;
    }).join("")}</div>`;
  }

  function countValues(values) {
    const counts = new Map();
    values.forEach((value) => {
      const key = String(value);
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return counts;
  }

  function labelForValue(question, value, source) {
    const stringValue = String(value);
    const options = questionOptions(question, source);
    return options.find((option) => String(option.value) === stringValue)?.label || stringValue;
  }

  function questionOptions(question, source) {
    if (Array.isArray(question.options)) return question.options;
    if (source === "core" && question.optionsFromMatrix) {
      const matrix = coreQuestionMap.get(question.optionsFromMatrix);
      return (matrix?.rows || []).map((row) => ({ value: row.id, label: row.label }));
    }
    if (source === "core" && question.scale && survey.scales?.[question.scale]) return survey.scales[question.scale];
    return [];
  }

  function labelForCoreValue(questionId, value) {
    const question = coreQuestionMap.get(questionId);
    if (!question) return String(value ?? "");
    return labelForValue(question, value, "core");
  }

  function downloadResults() {
    const { core, follow } = filteredData();
    storage.downloadJson(`wnmu-rebuild-linked-results-${new Date().toISOString().slice(0, 10)}.json`, {
      exportedAt: new Date().toISOString(),
      coreSchemaVersion: window.WNMU_REBUILD_CONFIG.schemaVersion,
      followUpSchemaVersion: followUps.schemaVersion,
      filters: {
        viewerStatus: els.viewerFilter.value || null,
        childrenRole: els.childrenFilter.value || null,
        countyRegion: els.countyFilter.value || null
      },
      coreResponses: core,
      followUpResponses: follow
    });
  }

  function unique(values) { return Array.from(new Set(values.filter(hasValue).map(String))); }
  function hasValue(value) {
    if (Array.isArray(value)) return value.length > 0;
    if (value && typeof value === "object") return Object.values(value).some(hasValue);
    return value !== undefined && value !== null && value !== "";
  }
  function emptyState(message) { return `<div class="results-empty"><p>${escapeHtml(message)}</p></div>`; }
  function escapeHtml(value) { return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;"); }
})();
