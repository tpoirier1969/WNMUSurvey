(function () {
  "use strict";

  const survey = window.WNMU_SURVEY;
  if (!survey) return;

  survey.testMode = true;

  (survey.routingQuestions || []).forEach(makeOptional);
  (survey.sections || []).forEach((section) => {
    delete section.when;
    (section.questions || []).forEach((question) => {
      delete question.when;
      makeOptional(question);
    });
  });

  document.documentElement.classList.add("survey-test-mode");

  const container = document.querySelector(".public-survey-container");
  if (container && !document.getElementById("testModeNotice")) {
    const notice = document.createElement("div");
    notice.id = "testModeNotice";
    notice.className = "test-mode-notice";
    notice.setAttribute("role", "status");
    notice.innerHTML = "<strong>Test mode:</strong> Every section and conditional question is shown. You may move through the questionnaire without answering anything.";
    Object.assign(notice.style, {
      margin: "0 0 18px",
      padding: "13px 16px",
      border: "1px solid #d49a31",
      borderRadius: "12px",
      background: "#fff7df",
      color: "#4f3a0d",
      lineHeight: "1.45"
    });
    container.prepend(notice);
  }

  const continueButton = document.getElementById("continueSurvey");
  if (continueButton) continueButton.textContent = "Continue without answering";

  function makeOptional(question) {
    question.required = false;
    question.optionalLabel = true;
  }
})();
