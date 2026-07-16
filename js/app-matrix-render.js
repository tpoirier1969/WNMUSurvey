"use strict";

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
        ${renderScaleKey(survey.scales[importanceQuestion.scale], "importance")}
        ${showPerformance ? renderScaleKey(survey.scales[performanceQuestion.scale], "performance") : ""}
      </div>
      ${importanceQuestion.rows.map((row, index) => {
        const rowLabelId = `paired-role-${index}-${row.id}`;
        const importanceLabelId = `${rowLabelId}-importance`;
        const performanceLabelId = `${rowLabelId}-performance`;
        return `<section class="paired-role-row" aria-labelledby="${escapeAttr(rowLabelId)}">
          <h3 id="${escapeAttr(rowLabelId)}">${escapeHtml(row.label)}</h3>
          <div class="paired-rating-line" role="group" aria-labelledby="${escapeAttr(importanceLabelId)}">
            <span id="${escapeAttr(importanceLabelId)}" class="paired-rating-prompt">Importance</span>
            <div class="paired-number-scale">${pairedScaleChoices(importanceQuestion, row, importanceValues[row.id], "importance")}</div>
          </div>
          ${showPerformance ? `<div class="paired-rating-line" role="group" aria-labelledby="${escapeAttr(performanceLabelId)}">
            <span id="${escapeAttr(performanceLabelId)}" class="paired-rating-prompt">Performance</span>
            <div class="paired-number-scale">${pairedScaleChoices(performanceQuestion, row, performanceValues[row.id], "performance")}</div>
          </div>` : ""}
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
      ${scale.map((option) => `<span><b>${escapeHtml(option.value === "na" ? option.shortLabel || "Not sure" : option.value)}</b> ${escapeHtml(option.label)}</span>`).join("")}
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
    return survey.scales[question.scale].map((option) => {
      const checked = String(selectedValue) === String(option.value);
      const progressRowId = `${question.id}__${row.id}`;
      const visible = option.shortLabel || option.value;
      const prompt = ratingKind === "importance" ? "importance" : "WNMU-TV performance";
      return `<label class="rating-choice"><input type="radio" name="${escapeAttr(question.id)}__${escapeAttr(row.id)}" value="${escapeAttr(option.value)}" data-question-id="${escapeAttr(question.id)}" data-row-id="${escapeAttr(progressRowId)}" data-answer-row-id="${escapeAttr(row.id)}" ${checked ? "checked" : ""} /><span aria-hidden="true">${escapeHtml(visible)}</span><span class="sr-only">${escapeHtml(row.label)}, ${prompt}: ${escapeHtml(option.label)}</span></label>`;
    }).join("");
  }
