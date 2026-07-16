"use strict";

  const SHARED_EVALUATION_SCALE = [
    { value: 1, label: "Very low", shortLabel: "1" },
    { value: 2, label: "Low", shortLabel: "2" },
    { value: 3, label: "Moderate", shortLabel: "3" },
    { value: 4, label: "High", shortLabel: "4" },
    { value: 5, label: "Very high", shortLabel: "5" },
    { value: "na", label: "Unable to rate", shortLabel: "N/A" }
  ];

  function renderMatrix(question, values) {
    const scale = survey.scales[question.scale];
    return `<div class="matrix-flat">
      ${renderScaleKey(scale, question.scale)}
      <div class="matrix-flat-rows">
        ${question.rows.map((row, index) => {
          const rowLabelId = `matrix-row-${question.id}-${index}-${row.id}`;
          return `<div class="matrix-flat-row" role="group" aria-labelledby="${escapeAttr(rowLabelId)}">
            <span id="${escapeAttr(rowLabelId)}" class="matrix-flat-label">${escapeHtml(row.label)}</span>
            <div class="matrix-number-scale">${matrixScaleChoices(question, row, values[row.id])}</div>
          </div>`;
        }).join("")}
      </div>
    </div>`;
  }

  function renderPairedMatrix(importanceQuestion, importanceValues) {
    const performanceQuestion = findQuestion(importanceQuestion.pairWith);
    const viewerStatusKnown = hasValue(state.routeProfile?.viewer_status);
    const showPerformance = Boolean(
      performanceQuestion
      && (isQuestionVisible(performanceQuestion) || !viewerStatusKnown)
    );
    const performanceValues = performanceQuestion ? getQuestionValue(performanceQuestion) || {} : {};

    return `<div class="paired-matrix-flat">
      <div class="paired-scale-key">
        ${renderSharedEvaluationKey(showPerformance)}
      </div>
      ${importanceQuestion.rows.map((row, index) => {
        const rowLabelId = `paired-role-${index}-${row.id}`;
        const importanceLabelId = `${rowLabelId}-importance`;
        const performanceLabelId = `${rowLabelId}-performance`;
        return `<section class="paired-role-row" aria-labelledby="${escapeAttr(rowLabelId)}">
          <h3 id="${escapeAttr(rowLabelId)}" style="grid-row:auto">${escapeHtml(row.label)}</h3>
          <div class="paired-rating-combined" style="display:flex;flex-wrap:wrap;gap:6px 12px;min-width:0">
            <div class="paired-rating-line" role="group" aria-labelledby="${escapeAttr(importanceLabelId)}" style="flex:1 1 300px;grid-template-columns:74px minmax(0,1fr);gap:6px">
              <span id="${escapeAttr(importanceLabelId)}" class="paired-rating-prompt">Importance</span>
              <div class="paired-number-scale">${pairedScaleChoices(importanceQuestion, row, importanceValues[row.id], "importance")}</div>
            </div>
            ${showPerformance ? `<div class="paired-rating-line" role="group" aria-labelledby="${escapeAttr(performanceLabelId)}" style="flex:1 1 300px;grid-template-columns:74px minmax(0,1fr);gap:6px">
              <span id="${escapeAttr(performanceLabelId)}" class="paired-rating-prompt">Performance</span>
              <div class="paired-number-scale">${pairedScaleChoices(performanceQuestion, row, performanceValues[row.id], "performance")}</div>
            </div>` : ""}
          </div>
        </section>`;
      }).join("")}
    </div>`;
  }

  function renderScaleKey(scale, scaleName) {
    const title = ({
      interest: "Interest",
      importance: "Importance",
      performance: "Performance"
    })[scaleName] || "Scale";
    return `<div class="rating-scale-key" aria-label="${escapeAttr(title)} scale">
      <strong>${escapeHtml(title)}:</strong>
      ${scale.map((option) => option.value === "na"
        ? `<span><b>${escapeHtml(option.shortLabel || option.label)}</b></span>`
        : `<span><b>${escapeHtml(option.value)}</b> ${escapeHtml(option.label)}</span>`
      ).join("")}
    </div>`;
  }

  function renderSharedEvaluationKey(showPerformance) {
    const appliesTo = showPerformance ? "Importance and performance" : "Importance";
    return `<div class="rating-scale-key" aria-label="Shared ${escapeAttr(appliesTo.toLowerCase())} scale">
      <strong>${escapeHtml(appliesTo)}:</strong>
      ${SHARED_EVALUATION_SCALE.map((option) =>
        `<span><b>${escapeHtml(option.shortLabel)}</b> ${escapeHtml(option.label)}</span>`
      ).join("")}
    </div>`;
  }

  function matrixScaleChoices(question, row, selectedValue) {
    return survey.scales[question.scale].map((option) => {
      const checked = String(selectedValue) === String(option.value);
      const visible = option.value === "na" ? option.shortLabel || option.label : option.value;
      return `<label class="rating-choice"><input type="radio" name="${escapeAttr(question.id)}__${escapeAttr(row.id)}" value="${escapeAttr(option.value)}" data-question-id="${escapeAttr(question.id)}" data-row-id="${escapeAttr(row.id)}" ${checked ? "checked" : ""} /><span aria-hidden="true">${escapeHtml(visible)}</span><span class="sr-only">${escapeHtml(row.label)}: ${escapeHtml(option.label)}</span></label>`;
    }).join("");
  }

  function pairedScaleChoices(question, row, selectedValue, ratingKind) {
    return SHARED_EVALUATION_SCALE.map((option) => {
      const checked = String(selectedValue) === String(option.value);
      const progressRowId = `${question.id}__${row.id}`;
      const prompt = ratingKind === "importance" ? "importance" : "WNMU-TV performance";
      return `<label class="rating-choice"><input type="radio" name="${escapeAttr(question.id)}__${escapeAttr(row.id)}" value="${escapeAttr(option.value)}" data-question-id="${escapeAttr(question.id)}" data-row-id="${escapeAttr(progressRowId)}" data-answer-row-id="${escapeAttr(row.id)}" ${checked ? "checked" : ""} /><span aria-hidden="true">${escapeHtml(option.shortLabel)}</span><span class="sr-only">${escapeHtml(row.label)}, ${prompt}: ${escapeHtml(option.label)}</span></label>`;
    }).join("");
  }
