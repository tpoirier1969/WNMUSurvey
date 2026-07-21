"use strict";

  const survey = window.WNMU_SURVEY;
  const followUps = window.WNMU_FOLLOW_UPS;
  const config = window.WNMU_CONFIG;
  const storage = window.WNMUStorage;
  if (!survey || !followUps || !config || !storage) throw new Error("WNMU results scripts loaded in the wrong order.");

  let loadedResponses = [];
  let loadedFollowUpResponses = [];
  let loadedContactRequests = [];
  let excludedBrowserResponses = 0;
  let excludedBrowserFollowUpResponses = 0;
  let excludedBrowserResponseDetails = [];
  let excludedBrowserFollowUpResponseDetails = [];
  const filters = { viewer: "", method: "", age: "", county: "", children: "" };
  const els = {};

  function init() {
    Object.assign(els, {
      reloadTestData: document.getElementById("reloadTestData"),
      jsonUpload: document.getElementById("jsonUpload"),
      exportRaw: document.getElementById("exportRaw"),
      exportSummary: document.getElementById("exportSummary"),
      exportFollowUpSummary: document.getElementById("exportFollowUpSummary"),
      clearLocal: document.getElementById("clearLocal"),
      dataStatus: document.getElementById("dataStatus"),
      followUpDataStatus: document.getElementById("followUpDataStatus"),
      excludedRecordDiagnostics: document.getElementById("excludedRecordDiagnostics"),
      resetFilters: document.getElementById("resetFilters"),
      filterSummary: document.getElementById("filterSummary"),
      heroCoreResponses: document.getElementById("heroCoreResponses"),
      heroFollowUpRespondents: document.getElementById("heroFollowUpRespondents"),
      heroFollowUpModules: document.getElementById("heroFollowUpModules"),
      audienceSnapshot: document.getElementById("audienceSnapshot"),
      programmingSnapshot: document.getElementById("programmingSnapshot"),
      performanceSnapshot: document.getElementById("performanceSnapshot"),
      voicesSnapshot: document.getElementById("voicesSnapshot"),
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
      decisionBriefStatus: document.getElementById("decisionBriefStatus"),
      followUpDecisionStatus: document.getElementById("followUpDecisionStatus"),
      followUpAudienceResults: document.getElementById("followUpAudienceResults"),
      followUpProgrammingResults: document.getElementById("followUpProgrammingResults"),
      followUpPerformanceResults: document.getElementById("followUpPerformanceResults"),
      followUpVoiceGroups: document.getElementById("followUpVoiceGroups"),
      followUpAllDataResults: document.getElementById("followUpAllDataResults"),
      qualitativeThemes: document.getElementById("qualitativeThemes"),
      decisionFindings: document.getElementById("decisionFindings"),
      followUpDecisionFindings: document.getElementById("followUpDecisionFindings"),
      contactRequestSummary: document.getElementById("contactRequestSummary")
    });

    els.reloadTestData?.addEventListener("click", loadDefaultResponses);
    els.jsonUpload?.addEventListener("change", importJson);
    els.exportRaw?.addEventListener("click", exportRaw);
    els.exportSummary?.addEventListener("click", exportSummary);
    els.exportFollowUpSummary?.addEventListener("click", exportFollowUpSummary);
    els.clearLocal?.addEventListener("click", clearLocalResponses);
    els.resetFilters?.addEventListener("click", () => {
      resetFilters();
      renderAnalysis();
    });

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
    const storedCore = storage.getResponses();
    const browserCore = storedCore.filter(isResponseLike);
    excludedBrowserResponseDetails = excludedRecordDetails(storedCore, coreResponseRejectionReasons, "core");
    excludedBrowserResponses = excludedBrowserResponseDetails.length;

    const storedFollowUps = storage.getFollowUpResponses();
    const browserFollowUps = storedFollowUps.filter(isFollowUpResponseLike);
    excludedBrowserFollowUpResponseDetails = excludedRecordDetails(storedFollowUps, followUpResponseRejectionReasons, "follow-up");
    excludedBrowserFollowUpResponses = excludedBrowserFollowUpResponseDetails.length;

    const demoCore = makeDemoData();
    loadedResponses = [...demoCore, ...browserCore];
    loadedFollowUpResponses = [...makeDemoFollowUpData(demoCore), ...browserFollowUps];
    loadedContactRequests = storage.getContactRequests().filter(isContactRequestLike);
    resetAndRender();
  }

  function loadBrowserResponses() {
    const storedCore = storage.getResponses();
    loadedResponses = storedCore.filter(isResponseLike);
    excludedBrowserResponseDetails = excludedRecordDetails(storedCore, coreResponseRejectionReasons, "core");
    excludedBrowserResponses = excludedBrowserResponseDetails.length;

    const storedFollowUps = storage.getFollowUpResponses();
    loadedFollowUpResponses = storedFollowUps.filter(isFollowUpResponseLike);
    excludedBrowserFollowUpResponseDetails = excludedRecordDetails(storedFollowUps, followUpResponseRejectionReasons, "follow-up");
    excludedBrowserFollowUpResponses = excludedBrowserFollowUpResponseDetails.length;
    loadedContactRequests = storage.getContactRequests().filter(isContactRequestLike);

    resetAndRender();
  }

  function resetAndRender() {
    resetFilters();
    populateFilters();
    renderExcludedRecordDiagnostics();
    renderAnalysis();
  }

  async function importJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const normalized = normalizeImportedData(parsed);
      if (!normalized.coreResponses.length) throw new Error(`No ${config.schemaVersion} core response records were found.`);
      loadedResponses = normalized.coreResponses;
      loadedFollowUpResponses = normalized.followUpResponses;
      excludedBrowserResponses = 0;
      excludedBrowserFollowUpResponses = 0;
      excludedBrowserResponseDetails = [];
      excludedBrowserFollowUpResponseDetails = [];
      loadedContactRequests = [];
      resetAndRender();
    } catch (error) {
      window.alert(`Could not load that JSON file. ${error.message}`);
    } finally {
      event.target.value = "";
    }
  }

  function normalizeImportedData(parsed) {
    if (Array.isArray(parsed)) {
      return {
        coreResponses: parsed.filter(isResponseLike),
        followUpResponses: parsed.filter(isFollowUpResponseLike)
      };
    }
    if (parsed && typeof parsed === "object") {
      const coreCandidates = parsed.coreResponses || parsed.responses || [];
      const followUpCandidates = parsed.followUpResponses || [];
      if (isResponseLike(parsed)) {
        return { coreResponses: [parsed], followUpResponses: [] };
      }
      return {
        coreResponses: Array.isArray(coreCandidates) ? coreCandidates.filter(isResponseLike) : [],
        followUpResponses: Array.isArray(followUpCandidates) ? followUpCandidates.filter(isFollowUpResponseLike) : []
      };
    }
    return { coreResponses: [], followUpResponses: [] };
  }

  function isResponseLike(item) {
    return coreResponseRejectionReasons(item).length === 0;
  }

  function isFollowUpResponseLike(item) {
    return followUpResponseRejectionReasons(item).length === 0;
  }

  function coreResponseRejectionReasons(item) {
    if (!item || typeof item !== "object" || Array.isArray(item)) return ["Record is not an object."];
    const reasons = [];
    if (item.isTestPreview) reasons.push("This is a Test Thank You preview record, not a submitted core questionnaire response.");
    const schemaVersion = item.schemaVersion || item.surveyVersion || "missing";
    if (schemaVersion !== config.schemaVersion) reasons.push(`Schema is ${schemaVersion}; expected ${config.schemaVersion}.`);
    if (!item.routeProfile || typeof item.routeProfile !== "object" || Array.isArray(item.routeProfile)) reasons.push("routeProfile is missing or invalid.");
    if (!item.answers || typeof item.answers !== "object" || Array.isArray(item.answers)) reasons.push("answers is missing or invalid.");
    return reasons;
  }

  function followUpResponseRejectionReasons(item) {
    if (!item || typeof item !== "object" || Array.isArray(item)) return ["Record is not an object."];
    const reasons = [];
    const schemaVersion = item.followUpSchemaVersion || "missing";
    if (schemaVersion !== config.followUp.schemaVersion) reasons.push(`Schema is ${schemaVersion}; expected ${config.followUp.schemaVersion}.`);
    if (!item.answers || typeof item.answers !== "object" || Array.isArray(item.answers)) reasons.push("answers is missing or invalid.");
    if (!item.coreResponseId) reasons.push("coreResponseId is missing.");
    if (!item.moduleId) reasons.push("moduleId is missing.");
    return reasons;
  }

  function isContactRequestLike(item) {
    return Boolean(
      item
      && typeof item === "object"
      && !Array.isArray(item)
      && item.coreResponseId
      && !item.isTestPreview
      && item.contactSchemaVersion === config.contact?.schemaVersion
      && item.status === "contact_requested"
      && item.consentGiven === true
    );
  }

  function excludedRecordDetails(records, reasonGetter, kind) {
    return records.flatMap((record, index) => {
      const reasons = reasonGetter(record);
      if (!reasons.length) return [];
      return [{
        kind,
        id: record?.responseId || record?.id || `${kind} record ${index + 1}`,
        schema: record?.schemaVersion || record?.surveyVersion || record?.followUpSchemaVersion || "missing",
        reasons
      }];
    });
  }

  function renderExcludedRecordDiagnostics() {
    if (!els.excludedRecordDiagnostics) return;
    const details = [...excludedBrowserResponseDetails, ...excludedBrowserFollowUpResponseDetails];
    if (!details.length) {
      els.excludedRecordDiagnostics.innerHTML = "";
      els.excludedRecordDiagnostics.hidden = true;
      return;
    }
    els.excludedRecordDiagnostics.hidden = false;
    els.excludedRecordDiagnostics.innerHTML = `<details class="excluded-record-details">
      <summary>${details.length} stored browser record${details.length === 1 ? " was" : "s were"} excluded — view exact reasons</summary>
      <p>Excluded records are not used in any calculation. IDs and schemas are shown for diagnosis; answer contents are not displayed here.</p>
      <ul>${details.map((detail) => `<li><strong>${escapeHtml(detail.id)}</strong> · ${escapeHtml(detail.kind)} · schema ${escapeHtml(detail.schema)}<ul>${detail.reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}</ul></li>`).join("")}</ul>
    </details>`;
  }

  function clearLocalResponses() {
    const coreCount = storage.getResponses().length;
    const followUpCount = storage.getFollowUpResponses().length;
    const contactCount = storage.getContactRequests().length;
    const total = coreCount + followUpCount + contactCount;
    if (!total) return window.alert("There are no submitted browser responses to clear.");
    const message = `Clear ${coreCount} core response${coreCount === 1 ? "" : "s"}, ${followUpCount} follow-up response${followUpCount === 1 ? "" : "s"}, and ${contactCount} separate contact request${contactCount === 1 ? "" : "s"} from this browser? Export questionnaire responses first if they matter.`;
    if (!window.confirm(message)) return;
    storage.clearResponses();
    storage.clearFollowUpResponses();
    storage.clearContactRequests();
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

  function filteredFollowUpResponses(coreResponses = filteredResponses()) {
    const coreIds = new Set(coreResponses.flatMap((response) => [response.responseId, response.id].filter(Boolean)));
    return loadedFollowUpResponses.filter((response) => coreIds.has(response.coreResponseId));
  }

  function filteredContactRequests(coreResponses = filteredResponses()) {
    const coreIds = new Set(coreResponses.flatMap((response) => [response.responseId, response.id].filter(Boolean)));
    return loadedContactRequests.filter((request) => coreIds.has(request.coreResponseId));
  }

  function linkedFollowUpRespondentCount(responses = loadedFollowUpResponses) {
    return new Set(responses.map((response) => response.respondentId || response.coreResponseId).filter(Boolean)).size;
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

  function followUpSourceCounts(responses = loadedFollowUpResponses) {
    return responseSourceCounts(responses);
  }

  function dataStatusText(filteredCount) {
    const excludedCore = excludedBrowserResponses
      ? ` ${excludedBrowserResponses} browser core record${excludedBrowserResponses === 1 ? " was" : "s were"} excluded; see the diagnostic below.`
      : "";
    const excludedFollowUp = excludedBrowserFollowUpResponses
      ? ` ${excludedBrowserFollowUpResponses} browser follow-up record${excludedBrowserFollowUpResponses === 1 ? " was" : "s were"} excluded; see the diagnostic below.`
      : "";
    if (els.followUpDataStatus) {
      els.followUpDataStatus.textContent = `${loadedFollowUpResponses.length} follow-up module responses loaded.${excludedFollowUp}`;
    }
    return `${loadedResponses.length} questionnaire responses loaded; ${filteredCount} match current filters.${excludedCore}`;
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
