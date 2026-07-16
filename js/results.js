(function () {
  "use strict";
  [
    "js/results-controller.js",
    "js/results-summary-render.js",
    "js/results-gap-render.js",
    "js/results-export.js",
    "js/results-copy.js",
    "js/results-data.js"
  ].forEach((src) => document.write(`<script src="${src}"><\/script>`));
  document.addEventListener("DOMContentLoaded", () => init());
})();
