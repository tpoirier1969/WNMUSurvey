(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const stage = document.getElementById("sectionStage");
    if (!stage) return;

    let restoreToken = 0;

    function improveMatrices(root) {
      root.querySelectorAll(".matrix-table").forEach((table) => {
        if (table.dataset.cardLayoutReady === "true") return;
        table.dataset.cardLayoutReady = "true";
        table.classList.add("matrix-card-table");

        const headings = Array.from(table.querySelectorAll("thead th")).slice(1).map((cell) => cell.textContent.trim());
        table.querySelectorAll("tbody tr").forEach((row) => {
          row.querySelectorAll("td").forEach((cell, index) => {
            const label = cell.querySelector(".matrix-choice");
            if (!label || label.querySelector(".matrix-visible-label")) return;
            const visible = document.createElement("span");
            visible.className = "matrix-visible-label";
            visible.textContent = headings[index] || `Option ${index + 1}`;
            label.appendChild(visible);
          });
        });
      });
    }

    const observer = new MutationObserver(() => improveMatrices(stage));
    observer.observe(stage, { childList: true, subtree: true });
    improveMatrices(stage);

    function preservePosition(event) {
      const target = event.target;
      if (!(target instanceof HTMLElement) || !stage.contains(target) || !target.dataset.questionId) return;

      const token = ++restoreToken;
      const top = window.scrollY;
      const questionId = target.dataset.questionId;
      const rowId = target.dataset.rowId || "";
      const value = target.value;

      const restore = () => {
        if (token !== restoreToken) return;
        window.scrollTo({ top, left: window.scrollX, behavior: "auto" });
        const selector = `[data-question-id="${cssEscape(questionId)}"]${rowId ? `[data-row-id="${cssEscape(rowId)}"]` : ""}[value="${cssEscape(value)}"]`;
        const replacement = stage.querySelector(selector);
        if (replacement) replacement.focus({ preventScroll: true });
        improveMatrices(stage);
      };

      requestAnimationFrame(restore);
      window.setTimeout(restore, 40);
      window.setTimeout(restore, 240);
    }

    stage.addEventListener("change", preservePosition, true);
  });

  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === "function") return window.CSS.escape(String(value));
    return String(value).replace(/([ #;?%&,.+*~\\':"!^$[\]()=>|/@])/g, "\\$1");
  }
})();
