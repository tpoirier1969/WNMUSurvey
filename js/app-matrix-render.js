"use strict";

  function renderMatrix(question, values) {
    const scale = survey.scales[question.scale];
    return `<div class="matrix-wrap"><table class="matrix-table matrix-card-table"><thead><tr><th scope="col">Area</th>${scale.map((option) =>
      `<th scope="col">${escapeHtml(shortScaleLabel(option.label))}</th>`
    ).join("")}</tr></thead><tbody>${question.rows.map((row) =>
      `<tr><th scope="row">${escapeHtml(row.label)}</th>${scale.map((option) =>
        `<td><label class="matrix-choice"><input type="radio" name="${escapeAttr(question.id)}__${escapeAttr(row.id)}" value="${escapeAttr(option.value)}" data-question-id="${escapeAttr(question.id)}" data-row-id="${escapeAttr(row.id)}" ${String(values[row.id]) === String(option.value) ? "checked" : ""} /><span class="matrix-visible-label">${escapeHtml(option.label)}</span><span class="sr-only">${escapeHtml(row.label)}: ${escapeHtml(option.label)}</span></label></td>`
      ).join("")}</tr>`
    ).join("")}</tbody></table></div>`;
  }

  function renderPairedMatrix(importanceQuestion, importanceValues) {
    const performanceQuestion = findQuestion(importanceQuestion.pairWith);
    const showPerformance = Boolean(performanceQuestion && isQuestionVisible(performanceQuestion));
    const performanceValues = performanceQuestion ? getQuestionValue(performanceQuestion) || {} : {};

    return `<div class="paired-matrix-flat">
      <div class="paired-scale-key">
        <span><strong>Importance:</strong> 1 = Not important · 5 = Essential</span>
        ${showPerformance ? '<span><strong>WNMU-TV performance:</strong> 1 = Poor · 5 = Excellent</span>' : ""}
      </div>
      ${importanceQuestion.rows.map((row, index) => {
        const rowLabelId = `paired-role-${index}-${row.id}`;
        const importanceLabelId = `${rowLabelId}-importance`;
        const performanceLabelId = `${rowLabelId}-performance`;
        return `<section class="paired-role-row" aria-labelledby="${escapeAttr(rowLabelId)}">
          <h3 id="${escapeAttr(rowLabelId)}">${escapeHtml(row.label)}</h3>
          <div class="paired-rating-line" role="group" aria-labelledby="${escapeAttr(importanceLabelId)}">
            <span id="${escapeAttr(importanceLabelId)}" class="paired-rating-prompt">How important is this?</span>
            <div class="paired-number-scale">${pairedScaleChoices(importanceQuestion, row, importanceValues[row.id], "importance")}</div>
          </div>
          ${showPerformance ? `<div class="paired-rating-line" role="group" aria-labelledby="${escapeAttr(performanceLabelId)}">
            <span id="${escapeAttr(performanceLabelId)}" class="paired-rating-prompt">How is WNMU-TV doing?</span>
            <div class="paired-number-scale">${pairedScaleChoices(performanceQuestion, row, performanceValues[row.id], "performance")}</div>
          </div>` : ""}
        </section>`;
      }).join("")}
    </div>`;
  }

  function pairedScaleChoices(question, row, selectedValue, ratingKind) {
    return survey.scales[question.scale].map((option) => {
      const checked = String(selectedValue) === String(option.value);
      const progressRowId = `${question.id}__${row.id}`;
      const visible = option.shortLabel || option.label;
      const prompt = ratingKind === "importance" ? "importance" : "WNMU-TV performance";
      return `<label class="choice paired-scale-choice"><input type="radio" name="${escapeAttr(question.id)}__${escapeAttr(row.id)}" value="${escapeAttr(option.value)}" data-question-id="${escapeAttr(question.id)}" data-row-id="${escapeAttr(progressRowId)}" data-answer-row-id="${escapeAttr(row.id)}" ${checked ? "checked" : ""} /><span aria-hidden="true">${escapeHtml(visible)}</span><span class="sr-only">${escapeHtml(row.label)}, ${prompt}: ${escapeHtml(option.label)}</span></label>`;
    }).join("");
  }

