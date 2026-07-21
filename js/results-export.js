"use strict";

  function exportRaw() {
    if (!loadedResponses.length) return window.alert("Load some responses first.");
    storage.downloadJson(`wnmu-viewer-results-bundle-${dateStamp()}.json`, {
      exportedAt: new Date().toISOString(),
      coreSchemaVersion: config.schemaVersion,
      followUpSchemaVersion: config.followUp.schemaVersion,
      coreResponses: loadedResponses,
      followUpResponses: loadedFollowUpResponses
    });
  }

  function exportSummary() {
    const responses = filteredResponses();
    if (!responses.length) return window.alert("No core responses match the current filters.");
    const rows = [["section", "question_id", "item_id", "label", "value", "answered_n", "applicable_n", "skipped_n", "not_applicable_n", "filtered_n", "schema_note"]];

    const sourceCounts = responseSourceCounts(responses);
    Object.entries(sourceCounts).forEach(([source, count]) => rows.push([
      "Data source", "response_source", source, humanize(source), count, responses.length, responses.length, 0, 0, responses.length,
      "Response source categories remain separate"
    ]));

    allQuestions().forEach((question) => {
      const coverage = questionCoverage(question, responses);
      const getter = (response) => question.store === "profile"
        ? response.routeProfile?.[question.id]
        : response.answers?.[question.id];

      if (question.type === "radio" || question.type === "select" || question.type === "scale") {
        addCountRows(rows, responses, stageTitleForQuestion(question.id), question, getter, false, coverage);
        return;
      }

      if (question.type === "checkbox") {
        addCountRows(rows, responses, stageTitleForQuestion(question.id), question, getter, true, coverage);
        return;
      }

      if (question.type === "matrix") {
        (question.rows || []).forEach((row) => {
          const values = responses
            .map((response) => getter(response)?.[row.id])
            .filter(isNumericScore)
            .map(Number);
          if (values.length) {
            rows.push([
              stageTitleForQuestion(question.id), question.id, row.id, row.label, average(values).toFixed(3),
              values.length, coverage.applicable, coverage.skipped, coverage.notApplicable, responses.length, "Numeric average; nonnumeric and missing ratings excluded"
            ]);
          }
        });
        return;
      }

      if (question.type === "text" || question.type === "textarea") {
        const answered = responses.filter((response) => typeof getter(response) === "string" && getter(response).trim());
        rows.push([
          stageTitleForQuestion(question.id), question.id, "answered_count", question.label, answered.length,
          answered.length, coverage.applicable, coverage.skipped, coverage.notApplicable, responses.length, "Full text is available in raw JSON and Viewer Voices"
        ]);
      }
    });

    findQuestion(survey.gapPairs.importanceQuestion).rows.forEach((row) => {
      const stats = pairedRoleStats(responses, row.id);
      if (!stats) return;
      rows.push([
        "Expectation gap", `${survey.gapPairs.importanceQuestion}/${survey.gapPairs.performanceQuestion}`, row.id, row.label,
        stats.gapAverage.toFixed(3), stats.count, stats.count, 0, 0, responses.length, "Paired respondents only"
      ]);
    });

    downloadText(`wnmu-viewer-core-summary-${dateStamp()}.csv`, rows.map((row) => row.map(csvCell).join(",")).join("\n"), "text/csv");
  }

  function exportFollowUpSummary() {
    const responses = filteredFollowUpResponses();
    if (!responses.length) return window.alert("No follow-up responses are linked to the current core filters.");
    const rows = [[
      "module_id", "module_label", "question_id", "item_id", "item_label", "stored_value",
      "count", "module_n", "answered_n", "skipped_n", "linked_core_response_ids",
      "core_schema_version", "follow_up_schema_version", "schema_note"
    ]];

    followUps.modules.forEach((module) => {
      const moduleResponses = responses.filter((response) => response.moduleId === module.id);
      rows.push([
        module.id, module.title, "module_submission", "submitted", "Submitted module", "submitted",
        moduleResponses.length, moduleResponses.length, moduleResponses.length, 0,
        uniqueCoreIds(moduleResponses).join(";"), config.schemaVersion, config.followUp.schemaVersion,
        "Voluntary self-selected module denominator"
      ]);

      module.pages.flatMap((page) => page.questions).forEach((question) => {
        const coverage = followUpQuestionCoverage(question, moduleResponses);
        if (question.type === "textarea") {
          rows.push([
            module.id, module.title, question.id, "answered_count", question.label, "answered_count",
            coverage.answered, moduleResponses.length, coverage.answered, coverage.skipped,
            uniqueCoreIds(coverage.answeredResponses).join(";"), config.schemaVersion, config.followUp.schemaVersion,
            "Full text is available in raw JSON and Viewer Voices"
          ]);
          return;
        }

        const options = question.options || [];
        options.forEach((option) => {
          const matching = coverage.answeredResponses.filter((response) => {
            const value = response.answers?.[question.id];
            return Array.isArray(value) ? value.includes(option.value) : String(value) === String(option.value);
          });
          rows.push([
            module.id, module.title, question.id, option.value, option.label, option.value,
            matching.length, moduleResponses.length, coverage.answered, coverage.skipped,
            uniqueCoreIds(matching).join(";"), config.schemaVersion, config.followUp.schemaVersion,
            "Percent denominator is respondents who submitted this module and answered this question"
          ]);
        });
      });
    });

    downloadText(`wnmu-viewer-follow-up-summary-${dateStamp()}.csv`, rows.map((row) => row.map(csvCell).join(",")).join("\n"), "text/csv");
  }

  function uniqueCoreIds(responses) {
    return Array.from(new Set(responses.map((response) => response.coreResponseId).filter(Boolean)));
  }

  function allQuestions() {
    return survey.stages.flatMap((stage) => stage.pages.flatMap((page) => page.questions));
  }

  function stageTitleForQuestion(questionId) {
    const stage = survey.stages.find((item) => item.pages.some((page) => page.questions.some((question) => question.id === questionId)));
    return stage?.title || "Questionnaire";
  }

  function addCountRows(rows, responses, section, question, getter, arrayValue, coverage) {
    const answered = responses.filter((response) => questionAppliesToResponse(question, response) && (arrayValue ? Array.isArray(getter(response)) && getter(response).length : hasValue(getter(response))));
    const counts = arrayValue ? countArray(answered, getter) : countSingle(answered, getter);
    const labels = labelMap(question.id);
    Object.entries(counts).forEach(([value, count]) => rows.push([
      section, question.id, value, labels[value] || humanize(value), count, answered.length, coverage.applicable, coverage.skipped, coverage.notApplicable, responses.length,
      "Denominator is respondents who answered this question"
    ]));
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
    if (question.optionsFromMatrix) {
      return (findQuestion(question.optionsFromMatrix).rows || []).map((row) => ({ value: row.id, label: row.label }));
    }
    if (question.scale && survey.scales?.[question.scale]) return survey.scales[question.scale];
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
    const width = !value ? 0 : max ? Math.max(3, Math.min(100, (value / max) * 100)) : 0;
    return `<div class="bar-item"><span class="bar-label">${escapeHtml(label)}</span><span class="bar-track"><span style="width:${width.toFixed(1)}%"></span></span><span class="bar-value">${escapeHtml(displayValue)}</span></div>`;
  }
