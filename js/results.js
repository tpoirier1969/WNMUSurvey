(function () {
  "use strict";
  const version = encodeURIComponent(window.WNMU_CONFIG?.buildVersion || "");
  [
    "js/results-controller.js",
    "js/results-summary-render.js",
    "js/results-gap-render.js",
    "js/results-export.js",
    "js/results-detail-render.js",
    "js/results-copy.js",
    "js/results-data.js"
  ].forEach((src) => document.write(`<script src="${src}${version ? `?v=${version}` : ""}"><\/script>`));
  document.addEventListener("DOMContentLoaded", () => init());
})();
