(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.getElementById("sectionTabs");
    const nav = tabs?.closest(".section-nav");
    if (!tabs || !nav) return;

    const phoneQuery = window.matchMedia("(max-width: 680px)");
    let pending = 0;

    function revealCurrentTab(behavior = "smooth") {
      if (!phoneQuery.matches) return;
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(() => {
        const current = tabs.querySelector(".section-tab.current");
        if (!current) return;
        const left = current.offsetLeft - ((nav.clientWidth - current.offsetWidth) / 2);
        nav.scrollTo({ left: Math.max(0, left), behavior });
      });
    }

    const observer = new MutationObserver(() => revealCurrentTab("smooth"));
    observer.observe(tabs, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });

    tabs.addEventListener("click", () => window.setTimeout(() => revealCurrentTab("smooth"), 30));
    phoneQuery.addEventListener?.("change", () => revealCurrentTab("auto"));
    window.addEventListener("orientationchange", () => window.setTimeout(() => revealCurrentTab("auto"), 120));

    revealCurrentTab("auto");
  });
})();
