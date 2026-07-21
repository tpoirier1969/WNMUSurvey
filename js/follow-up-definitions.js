(function () {
  "use strict";
  const config = window.WNMU_CONFIG;
  const modules = window.WNMU_FOLLOW_UP_MODULES || [];
  if (!config) throw new Error("WNMU configuration must load before follow-up definitions.");
  if (modules.length !== 5) throw new Error("WNMU follow-up module files loaded in the wrong order.");
  window.WNMU_FOLLOW_UPS = Object.freeze({
    schemaVersion: config.followUp.schemaVersion,
    retiredQuestionIds: Object.freeze(["deeper_priority_categories", "program_recommendations"]),
    modules: Object.freeze(modules)
  });
  delete window.WNMU_FOLLOW_UP_MODULES;
})();
