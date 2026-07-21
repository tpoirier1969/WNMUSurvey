"use strict";

  const survey = window.WNMU_SURVEY;
  const config = window.WNMU_CONFIG;
  const storage = window.WNMUStorage;
  if (!survey || !config || !storage) throw new Error("WNMU results scripts loaded in the wrong order.");

  let loadedResponses = [];
  let dataSourceLabel = "No responses loaded";
  let excludedBrowserResponses = 0;
  const filters = { viewer: "", method: "", age: "", county: "", children: "" };
  const els = {};

  function init() {
    Object.assign(els, {
      reloadTestData: document.getElementById("reloadTestData"),
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
      stationAwarenessResult: document.getElementById("stationAwarenessResult"),
      internetQualityResult: document.getElementById("internetQualityResult"),
      communityTypeResult: document.getElementById("communityTypeResult"),
      onlineAwarenessResult: document.getElementById("onlineAwarenessResult"),
      watchPreferenceResult: document.getElementById("watchPreferenceResult"),
      childrenRoleResult: document.getElementById("childrenRoleResult"),
      kidsUseResult: document.getElementById("kidsUseResult"),
      onlineImprovementsResult: document.getElementById("onlineImprovementsResult"),
      learnPreferredResult: document.getElementById("learnPreferredResult"),
      localFormatsResult: document.getElementById("localFormatsResult"),
      importanceResult: document.getElementById("importanceResult"),
      performanceResult: document.getElementById("performanceResult"),
      reflectsMeResult: document.getElementById("reflectsMeResult"),
      trustStationResult: document.getElementById("trustStationResult"),
      nonviewerReasonsResult: document.getElementById("nonviewerReasonsResult"),
      viewerVoiceGroups: document.getElementById("viewerVoiceGroups"),
      allDataResults: document.getElementById("allDataResults"),
      decisionBriefStatus: document.getElementById("decisionBriefStatus")
    });

    els.reloadTestData?.addEventListener("click", loadDefaultResponses);
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

    wireResultTabs();
    loadDefaultResponses();
  }

  function loadDefaultResponses() {
    if (config.mode === "test" && config.test.useSyntheticResults) loadCombinedTestResponses();
    else loadBrowserResponses();
  }

  function loadCombinedTestResponses() {
    const stored = storage.getResponses();
    const browserResponses = stored.filter(isResponseLike);
    excludedBrowserResponses = stored.length - browserResponses.length;
    loadedResponses = [...makeDemoData(), ...browserResponses];
    dataSourceLabel = "combined test responses";
    resetAndRender();
  }

  function loadBrowserResponses() {
    const stored = storage.getResponses();
    loadedResponses = stored.filter(isResponseLike);
    excludedBrowserResponses = stored.length - loadedResponses.length;
    dataSourceLabel = "submitted browser responses";
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
      if (!responses.length) throw new Error(`No ${config.schemaVersion} response records were found.`);
      loadedResponses = responses;
      excludedBrowserResponses = 0;
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
    const schemaVersion = item?.schemaVersion || item?.surveyVersion;
    return Boolean(
      item
      && typeof item === "object"
      && item.routeProfile
      && typeof item.routeProfile === "object"
      && item.answers
      && typeof item.answers === "object"
      && schemaVersion === config.schemaVersion
    );
  }

  function clearLocalResponses() {
    const count = storage.getResponses().length;
    if (!count) return window.alert("There are no submitted browser responses to clear.");
    if (!window.confirm(`Clear ${count} submitted response${count === 1 ? "" : "s"} from this browser? Export them first if they matter.`)) return;
    storage.clearResponses();
    loadDefaultResponses();
  }

  function resetFilters() {
    Object.keys(filters).forEach((key) => { filters[key] = ""; });
    [els.filterViewer, els.filterMethod, els.filterAge, els.filterCounty, els.filterChildren].forEach((select) => {
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
    select.innerHTML = `<option value="">${escapeHtml(firstLabel)}</option>${values
      .sort((a, b) => String(labels[a] || a).localeCompare(String(labels[b] || b)))
      .map((value) => `<option value="${escapeAttr(value)}">${escapeHtml(labels[value] || humanize(value))}</option>`)
      .join("")}`;
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

  function responseSourceCategory(response) {
    const source = String(response?.source || "").toLowerCase();
    if (source.includes("synthetic")) return "synthetic";
    if (source.includes("browser") || source.includes("local")) return "browser_submitted";
    return "other";
  }

  function responseSourceCounts(responses = loadedResponses) {
    return responses.reduce((counts, response) => {
      const category = responseSourceCategory(response);
      counts[category] = (counts[category] || 0) + 1;
      return counts;
    }, { synthetic: 0, browser_submitted: 0, other: 0 });
  }

  function dataStatusText(filteredCount) {
    const counts = responseSourceCounts();
    const sourceParts = [];
    if (counts.synthetic) sourceParts.push(`${counts.synthetic} synthetic`);
    if (counts.browser_submitted) sourceParts.push(`${counts.browser_submitted} browser-submitted`);
    if (counts.other) sourceParts.push(`${counts.other} imported or other`);
    const excluded = excludedBrowserResponses
      ? ` ${excludedBrowserResponses} older or non-${config.schemaVersion} browser record${excludedBrowserResponses === 1 ? " was" : "s were"} excluded.`
      : "";
    return `${loadedResponses.length} loaded from ${dataSourceLabel}${sourceParts.length ? ` (${sourceParts.join(" + ")})` : ""}; ${filteredCount} match current filters.${excluded}`;
  }

  function wireResultTabs() {
    const tabs = Array.from(document.querySelectorAll("[data-results-tab]"));
    if (!tabs.length) return;
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => showResultSection(tab.dataset.resultsTab));
      tab.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        let nextIndex = index;
        if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = tabs.length - 1;
        tabs[nextIndex].focus();
        showResultSection(tabs[nextIndex].dataset.resultsTab);
      });
    });
  }

  function showResultSection(sectionId) {
    document.querySelectorAll("[data-results-tab]").forEach((tab) => {
      const selected = tab.dataset.resultsTab === sectionId;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    document.querySelectorAll("[data-results-panel]").forEach((panel) => {
      panel.hidden = panel.dataset.resultsPanel !== sectionId;
    });
  }
