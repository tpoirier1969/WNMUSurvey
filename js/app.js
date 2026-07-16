(function () {
  "use strict";
  [
    "js/app-core.js",
    "js/app-navigation.js",
    "js/app-completion.js",
    "js/app-matrix-render.js",
    "js/app-question-render.js",
    "js/app-init.js"
  ].forEach((src) => document.write(`<script src="${src}"><\/script>`));
})();
