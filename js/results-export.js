"use strict";

  function exportRaw() {
    if (!loadedResponses.length) return window.alert("Load some responses first.");
    storage.downloadJson(`wnmu-viewer-responses-${dateStamp()}.json`, loadedResponses);
  }

  function exportSummary() {
    const responses = filteredResponses();
    if (!responses.length) return window.alert("No responses match the current filters.");
    const rows = [["section", "question_id", "item_id", "label", "value", "answered_n", "filtered_n", "schema_note"]];

    allQuestions().forEach((question) => {
      const getter = (response) => question.store === "profile"
        ? response.routeProfile?.[question.id]
        : response.answers?.[question.id];

      if (question.type === "radio" || question.type === "select" || question.type === "scale") {
        addCountRows(rows, responses, stageTitleForQuestion(question.id), question.id, getter, false);
        return;
      }

      if (question.type === "checkbox") {
        addCountRows(rows, responses, stageTitleForQuestion(question.id), question.id, getter, true);
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
              values.length, responses.length, "Numeric average; nonnumeric and missing ratings excluded"
            ]);
          }
        });
        return;
      }

      if (question.type === "text" || question.type === "textarea") {
        const answered = responses.filter((response) => typeof getter(response) === "string" && getter(response).trim());
        rows.push([
          stageTitleForQuestion(question.id), question.id, "answered_count", question.label, answered.length,
          answered.length, responses.length, "Full text is available in raw JSON and the open-response view"
        ]);
      }
    });

    findQuestion(survey.gapPairs.importanceQuestion).rows.forEach((row) => {
      const stats = pairedRoleStats(responses, row.id);
      if (!stats) return;
      rows.push([
        "Expectation gap", `${survey.gapPairs.importanceQuestion}/${survey.gapPairs.performanceQuestion}`, row.id, row.label,
        stats.gapAverage.toFixed(3), stats.count, responses.length, "Paired respondents only"
      ]);
    });

    downloadText(`wnmu-viewer-summary-${dateStamp()}.csv`, rows.map((row) => row.map(csvCell).join(",")).join("\n"), "text/csv");
  }

  function allQuestions() {
    return survey.stages.flatMap((stage) => stage.pages.flatMap((page) => page.questions));
  }

  function stageTitleForQuestion(questionId) {
    const stage = survey.stages.find((item) => item.pages.some((page) => page.questions.some((question) => question.id === questionId)));
    return stage?.title || "Questionnaire";
  }

  function addCountRows(rows, responses, section, questionId, getter, arrayValue) {
    const answered = responses.filter((response) => arrayValue ? Array.isArray(getter(response)) && getter(response).length : hasValue(getter(response)));
    const counts = arrayValue ? countArray(answered, getter) : countSingle(answered, getter);
    const labels = labelMap(questionId);
    Object.entries(counts).forEach(([value, count]) => rows.push([
      section, questionId, value, labels[value] || humanize(value), count, answered.length, responses.length,
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

