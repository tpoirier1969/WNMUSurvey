(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", () => {
    const interestSection = document.getElementById("programInterest")?.closest(".result-section");
    const interestNote = interestSection?.querySelector("p:not(.eyebrow)");
    if (interestNote) interestNote.textContent = "Average 1–5 interest score among respondents who rated each of the 17 viewer-facing categories.";

    const prioritySection = document.getElementById("topPriorities")?.closest(".result-section");
    const priorityNote = prioritySection?.querySelector("p:not(.eyebrow)");
    if (priorityNote) priorityNote.textContent = "Selections use the same 17 categories as the programming-interest ratings.";
  });

  window.enhanceCollapsibleResults = function enhanceCollapsibleResults() {
    document.querySelectorAll(".result-section:not(.collapsible-ready), .decision-finding-card:not(.collapsible-ready)").forEach((panel, index) => {
      if (panel.matches("details") || panel.classList.contains("decision-foundation")) return;
      const heading = panel.querySelector(":scope > h2, :scope > h3");
      if (!heading) return;
      const bodyChildren = Array.from(panel.children).filter((child) => child !== heading && !child.classList.contains("eyebrow"));
      if (!bodyChildren.length) return;
      const body = document.createElement("div");
      body.className = "collapsible-result-body";
      body.hidden = true;
      body.id = `result-detail-${index}-${Math.random().toString(36).slice(2, 8)}`;
      bodyChildren.forEach((child) => body.appendChild(child));
      const button = document.createElement("button");
      button.type = "button";
      button.className = "result-collapse-button";
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", body.id);
      button.textContent = "Show results";
      button.addEventListener("click", () => {
        const opening = body.hidden;
        body.hidden = !opening;
        button.setAttribute("aria-expanded", String(opening));
        button.textContent = opening ? "Hide results" : "Show results";
      });
      heading.insertAdjacentElement("afterend", button);
      panel.appendChild(body);
      panel.classList.add("collapsible-ready");
    });
  };
})();
