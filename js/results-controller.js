"use strict";

  const survey = window.WNMU_SURVEY;
  const config = window.WNMU_CONFIG;
  const storage = window.WNMUStorage;
  if (!survey || !config || !storage) throw new Error("WNMU results scripts loaded in the wrong order.");

  let loadedResponses = [];
  let dataSourceLabel = "No responses loaded";
  const filters = { viewer: "", method: "", age: "", county: "", children: "" };
  const els = {};


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
    loadedResponses = storage.getResponses().filter(isResponseLike);
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
      if (!responses.length) throw new Error(`No ${config.schemaVersion} response records were found.`);
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
    return Boolean(
      item
      && typeof item === "object"
      && item.routeProfile
      && item.answers
      && item.schemaVersion === config.schemaVersion
    );
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

