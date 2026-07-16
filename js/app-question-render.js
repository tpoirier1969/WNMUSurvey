"use strict";

  function renderQuestion(question, value, number) {
    const options = resolveOptions(question);
    const optional = !question.required || question.optionalLabel;
    const badge = optional
      ? '<span class="optional-badge">Optional</span>'
      : '<span class="required-badge">Required</span>';
    const help = question.help ? `<p class="question-help">${escapeHtml(question.help)}</p>` : "";
    const choiceGridClass = question.layout === "compact" ? "choice-grid compact-choice-grid" : "choice-grid";
    const controlId = `question-control-${question.id}`;
    const blockAttributes = `data-question-block="${escapeAttr(question.id)}" data-max="${question.max || ""}" data-exclusive="${escapeAttr((question.exclusiveValues || []).join(","))}"`;

    if (question.type === "matrix" && question.pairWith && question.presentation === "flat_pair") {
      return renderPairedQuestionBlock(question, value || {}, number, badge, help, blockAttributes);
    }

    let control = "";
    if (question.type === "radio") {
      control = `<div class="${choiceGridClass}">${options.map((option) =>
        choiceMarkup(question, option, value, "radio")
      ).join("")}</div>`;
    } else if (question.type === "checkbox") {
      control = `<div class="${choiceGridClass}">${options.map((option) =>
        choiceMarkup(question, option, Array.isArray(value) ? value : [], "checkbox")
      ).join("")}</div>`;
    } else if (question.type === "select") {
      const selectClass = question.inlineControl ? "select-control inline-select-control" : "select-control";
      control = `<select id="${escapeAttr(controlId)}" class="${selectClass}" data-question-id="${escapeAttr(question.id)}"><option value="">Choose an option</option>${options.map((option) =>
        `<option value="${escapeAttr(option.value)}" ${String(value) === String(option.value) ? "selected" : ""}>${escapeHtml(option.label)}</option>`
      ).join("")}</select>`;
    } else if (question.type === "text") {
      control = `<input class="text-control" type="text" value="${escapeAttr(value || "")}" data-question-id="${escapeAttr(question.id)}" />`;
    } else if (question.type === "textarea") {
      control = `<textarea class="text-control textarea-control" rows="4" data-question-id="${escapeAttr(question.id)}">${escapeHtml(value || "")}</textarea>`;
    } else if (question.type === "scale") {
      control = `<div class="scale-row">${survey.scales[question.scale].map((option) =>
        choiceMarkup(question, option, value, "radio", true)
      ).join("")}</div>`;
    } else if (question.type === "matrix") {
      control = renderMatrix(question, value || {});
    }

    if (question.type === "select" && question.inlineControl) {
      return `<div class="question-card inline-select-question" ${blockAttributes}><div class="inline-question-heading"><span class="question-number">${number}</span><label class="question-label" for="${escapeAttr(controlId)}">${escapeHtml(question.label)}</label>${badge}</div>${help}${control}<p class="question-message" aria-live="polite"></p></div>`;
    }

    return `<fieldset class="question-card" ${blockAttributes}><legend><span class="question-number">${number}</span><span class="question-label">${escapeHtml(question.label)}</span>${badge}</legend>${help}${control}<p class="question-message" aria-live="polite"></p></fieldset>`;
  }

  function renderPairedQuestionBlock(question, values, number, badge, help, blockAttributes) {
    return `<section class="paired-question-block" ${blockAttributes} aria-labelledby="paired-question-title-${escapeAttr(question.id)}">
      <header class="paired-question-heading">
        <span class="question-number">${number}</span>
        <div>
          <h3 id="paired-question-title-${escapeAttr(question.id)}" class="question-label">${escapeHtml(question.label)}</h3>
          ${help}
        </div>
        ${badge}
      </header>
      ${renderPairedMatrix(question, values)}
      <p class="question-message" aria-live="polite"></p>
    </section>`;
  }

  function choiceMarkup(question, option, selectedValue, type, compact) {
    const checked = type === "checkbox"
      ? selectedValue.map(String).includes(String(option.value))
      : String(selectedValue) === String(option.value);
    const name = type === "radio" ? question.id : `${question.id}[]`;
    return `<label class="choice${compact ? " scale-choice" : ""}"><input type="${type}" name="${escapeAttr(name)}" value="${escapeAttr(option.value)}" data-question-id="${escapeAttr(question.id)}" ${checked ? "checked" : ""} /><span>${escapeHtml(option.label)}</span></label>`;
  }

