(function () {
  "use strict";
  [
    "js/results-controller.js",
    "js/results-summary-render.js",
    "js/results-gap-render.js",
    "js/results-detail-render.js",
    "js/results-followup-render.js",
    "js/results-decision-render.js",
    "js/results-export.js",
    "js/results-copy.js",
    "js/results-data.js",
    "js/results-followup-data.js"
  ].forEach((src) => document.write(`<script src="${src}?v=${encodeURIComponent(window.WNMU_CONFIG?.buildVersion || "dev")}"><\/script>`));
  document.addEventListener("DOMContentLoaded", () => init());
})();
