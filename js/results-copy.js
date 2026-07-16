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
})();
