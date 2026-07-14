(function () {
  "use strict";

  const GAP_THRESHOLD = 0.5;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    const gapTable = document.getElementById("gapTable");
    if (!gapTable) return;

    const observer = new MutationObserver(render);
    observer.observe(gapTable, { childList: true, subtree: true, characterData: true });
    render();
  }

  function render() {
    const rows = readGapRows();
    const needsAttention = rows
      .filter((row) => row.gap >= GAP_THRESHOLD)
      .sort((a, b) => b.gap - a.gap);
    const meetingExpectations = rows
      .filter((row) => Math.abs(row.gap) < GAP_THRESHOLD)
      .sort((a, b) => b.delivery - a.delivery || Math.abs(a.gap) - Math.abs(b.gap));
    const exceedingExpectations = rows
      .filter((row) => row.gap <= -GAP_THRESHOLD)
      .sort((a, b) => a.gap - b.gap);

    renderBucket(
      "needsAttentionList",
      "needsAttentionCount",
      needsAttention,
      "No roles currently fall at least 0.50 points below stated importance."
    );
    renderBucket(
      "meetingExpectationsList",
      "meetingExpectationsCount",
      meetingExpectations,
      "No roles currently fall within the meeting-expectations range."
    );
    renderBucket(
      "exceedingExpectationsList",
      "exceedingExpectationsCount",
      exceedingExpectations,
      "No roles currently exceed stated importance by at least 0.50 points."
    );
  }

  function readGapRows() {
    const table = document.getElementById("gapTable");
    return Array.from(table.querySelectorAll("tr")).flatMap((row) => {
      const cells = row.querySelectorAll("td");
      if (cells.length < 5) return [];

      const importance = Number.parseFloat(cells[1].textContent);
      const delivery = Number.parseFloat(cells[2].textContent);
      const gap = Number.parseFloat(cells[3].textContent);
      const respondents = Number.parseInt(cells[4].textContent, 10);
      if ([importance, delivery, gap].some(Number.isNaN)) return [];

      return [{
        label: cells[0].textContent.trim(),
        importance,
        delivery,
        gap,
        respondents: Number.isNaN(respondents) ? cells[4].textContent.trim() : respondents
      }];
    });
  }

  function renderBucket(listId, countId, rows, emptyMessage) {
    const list = document.getElementById(listId);
    const count = document.getElementById(countId);
    if (!list || !count) return;

    count.textContent = `${rows.length} role${rows.length === 1 ? "" : "s"}`;

    if (!rows.length) {
      list.innerHTML = `<div class="gap-bucket-empty">${escapeHtml(emptyMessage)}</div>`;
      return;
    }

    list.innerHTML = rows.map((row) => `
      <article class="gap-role-item">
        <strong>${escapeHtml(row.label)}</strong>
        <div class="gap-role-metrics">
          <span>Importance <b>${row.importance.toFixed(2)}</b></span>
          <span>Delivery <b>${row.delivery.toFixed(2)}</b></span>
          <span class="gap-value">Gap <b>${formatSigned(row.gap)}</b></span>
          <span>n=${escapeHtml(row.respondents)}</span>
        </div>
      </article>
    `).join("");
  }

  function formatSigned(value) {
    const formatted = value.toFixed(2);
    return value > 0 ? `+${formatted}` : formatted;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
