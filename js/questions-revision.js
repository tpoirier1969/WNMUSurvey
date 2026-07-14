(function () {
  "use strict";

  const survey = window.WNMU_SURVEY;
  if (!survey) return;

  survey.version = "wnmu-viewer-questionnaire-v3-review";

  function findQuestion(id) {
    const routing = (survey.routingQuestions || []).find((question) => question.id === id);
    if (routing) return routing;
    for (const section of survey.sections || []) {
      const question = (section.questions || []).find((item) => item.id === id);
      if (question) return question;
    }
    return null;
  }

  function findSection(id) {
    return (survey.sections || []).find((section) => section.id === id) || null;
  }

  function removeSelectionLimit(id) {
    const question = findQuestion(id);
    if (!question) return;
    delete question.max;
    question.label = question.label
      .replace(/\s*Select up to three\.?/i, "")
      .replace(/\s*Choose up to three\.?/i, "")
      .trim();
  }

  const viewingMethods = findQuestion("viewing_methods");
  if (viewingMethods) {
    viewingMethods.options = viewingMethods.options.map((option) => {
      if (option.value === "pbs_app") {
        return { ...option, label: "PBS App — the free PBS app for livestreams and on-demand programs" };
      }
      if (option.value === "passport") {
        return { ...option, label: "WNMU Passport — the member benefit that unlocks an expanded on-demand library through the PBS App or PBS.org" };
      }
      return option;
    });
  }

  const childrenRole = findQuestion("children_role");
  if (childrenRole) {
    childrenRole.options = childrenRole.options.map((option) => option.value === "neither"
      ? { ...option, label: "I do not select or recommend programming for children" }
      : option);
  }

  const connectionIndex = survey.sections.findIndex((section) => section.id === "connection");
  if (connectionIndex >= 0 && !findSection("channels")) {
    const awarenessOptions = [
      { value: "wnmu_13_1", label: "WNMU-TV (13.1)" },
      { value: "pbs_kids_13_2", label: "PBS KIDS 24/7 (13.2)" },
      { value: "wnmu_plus_13_3", label: "WNMU-TV Plus (13.3)" },
      { value: "mlc_13_4", label: "Michigan Learning Channel (13.4)" },
      { value: "none", label: "I was not aware of any of these channels" }
    ];

    const describedChannelOptions = [
      { value: "wnmu_13_1", label: "WNMU-TV (13.1) — the main channel, with national PBS programs plus regional and locally produced programming" },
      { value: "pbs_kids_13_2", label: "PBS KIDS 24/7 (13.2) — children's educational programming around the clock" },
      { value: "wnmu_plus_13_3", label: "WNMU-TV Plus (13.3) — delayed repeats of much of 13.1, weekday afternoon dramas, weekend arts programming, and different afternoon and evening offerings" },
      { value: "mlc_13_4", label: "Michigan Learning Channel (13.4) — educational programming and learning resources for students, families, and educators" }
    ];

    survey.sections.splice(connectionIndex + 1, 0, {
      id: "channels",
      shortTitle: "Channels",
      eyebrow: "WNMU-TV's four broadcast channels",
      title: "Which WNMU-TV channels do you know, receive, and watch?",
      intro: "WNMU-TV broadcasts four over-the-air channels. Cable and satellite providers do not always carry all four. The first question measures what you knew before seeing the descriptions; the next questions explain what each channel offers.",
      questions: [
        {
          id: "channel_awareness",
          type: "checkbox",
          label: "Before taking this questionnaire, which of these WNMU-TV channels did you know existed?",
          help: "Select every channel you already knew about before reading the descriptions below.",
          exclusiveValues: ["none"],
          options: awarenessOptions
        },
        {
          id: "channels_received",
          type: "checkbox",
          label: "Which of these channels can you currently receive through an antenna, cable, satellite, or another television provider?",
          help: "Select every channel you receive. Provider lineups vary, so it is fine to choose “I am not sure.”",
          exclusiveValues: ["none", "not_sure"],
          options: [
            ...describedChannelOptions,
            { value: "none", label: "I do not receive any of these channels" },
            { value: "not_sure", label: "I am not sure which of these channels I receive" }
          ]
        },
        {
          id: "channels_watched",
          type: "checkbox",
          label: "Which of these channels do you watch, even occasionally?",
          help: "Select every channel you watch. You can select a channel even if you usually watch it through a provider rather than by its over-the-air channel number.",
          exclusiveValues: ["none"],
          options: [
            ...describedChannelOptions,
            { value: "none", label: "I do not watch any of these channels" }
          ]
        }
      ]
    });
  }

  const onlineAwareness = findQuestion("online_awareness");
  if (onlineAwareness) {
    onlineAwareness.options = onlineAwareness.options.map((option) => {
      if (option.value === "pbs_app") return { ...option, label: "PBS App (free app for livestreams and on-demand programs)" };
      if (option.value === "passport") return { ...option, label: "WNMU Passport (member benefit with an expanded on-demand library)" };
      return option;
    });
  }

  const onlineUsed = findQuestion("online_services_used");
  if (onlineUsed) {
    onlineUsed.options = onlineUsed.options.map((option) => {
      if (option.value === "pbs_app") return { ...option, label: "PBS App, with or without signing in to Passport" };
      if (option.value === "passport") return { ...option, label: "WNMU Passport content through the PBS App or PBS.org" };
      return option;
    });
  }

  const onlineBarriers = findQuestion("online_barriers");
  if (onlineBarriers && !onlineBarriers.options.some((option) => option.value === "screen_too_small")) {
    const insertAfter = onlineBarriers.options.findIndex((option) => option.value === "internet");
    const screenOptions = [
      { value: "screen_too_small", label: "The computer, tablet, or phone screen is too small for comfortable viewing" },
      { value: "shared_viewing", label: "Watching on a computer or phone does not work well when I want to watch with other people" }
    ];
    onlineBarriers.options.splice(insertAfter + 1, 0, ...screenOptions);
  }

  ["viewing_times", "online_improvements", "kids_times", "learn_preferred"].forEach(removeSelectionLimit);

  const expectations = findSection("expectations");
  if (expectations) {
    expectations.intro = "Most programs aired by WNMU-TV are produced by regional or national sources. WNMU-TV selects and schedules much of what airs, but the station does not control how most outside programs are produced. Please rate how important each role should be for the station itself.";
  }

  const performance = findSection("performance");
  if (performance) {
    performance.intro = "Please rate WNMU-TV's selection, scheduling, access, local production, and community service—not production decisions made by outside national or regional producers. Choose “Not familiar enough” whenever appropriate.";
  }

  ["importance_roles", "performance_roles"].forEach((id) => {
    const question = findQuestion(id);
    if (!question) return;
    question.help = "WNMU-TV selects and schedules most of the programming it carries, while regional and national producers create most of the programs themselves.";
    question.rows = question.rows.map((row) => row.id === "trusted_pbs"
      ? { ...row, label: "Select and provide trusted national and regional public-television programming" }
      : row);
  });

  const primaryTopicRows = [
    ["architecture", "Architecture"],
    ["art", "Art and visual arts"],
    ["biography", "Biography"],
    ["children", "Children's programming"],
    ["civil_rights", "Civil rights"],
    ["crafts", "Crafts"],
    ["documentary", "Documentary"],
    ["american_drama", "American drama"],
    ["independent_film", "Independent film"],
    ["education", "Education"],
    ["employment", "Employment and workforce"],
    ["entertainment", "Entertainment"],
    ["environment", "Environment"],
    ["financial", "Financial and personal finance"],
    ["food", "Food and cooking"],
    ["gardening", "Gardening"],
    ["health", "Health"],
    ["history", "History"],
    ["holiday", "Holiday programming"],
    ["lgbt", "LGBTQ+ people and issues"],
    ["michigan", "Michigan"],
    ["military", "Military"],
    ["music", "Music"],
    ["native_american", "Native American history, culture, and contemporary life"],
    ["news", "News"],
    ["outdoor", "Outdoor recreation and sporting life"],
    ["politics", "Politics and public policy"],
    ["science", "Science"],
    ["sports", "Sports"],
    ["travel", "Travel"],
    ["war", "War and wartime history"]
  ].map(([id, label]) => ({ id, label }));

  const programInterest = findQuestion("program_interest");
  if (programInterest) {
    programInterest.label = "How interested are you in watching programming in each Primary Topic used by the WNMU-TV Programming Library?";
    programInterest.help = "The list mirrors the Programming Library's Primary Topics. Obvious duplicate spellings and capitalization have been combined, and independent film is kept separate from drama.";
    programInterest.rows = primaryTopicRows;
  }

  const topPriorities = findQuestion("top_program_priorities");
  if (topPriorities) {
    topPriorities.label = "Which five Primary Topics should receive the greatest attention from WNMU-TV?";
  }

  const valuedPrograms = findQuestion("valued_programs");
  if (valuedPrograms) {
    valuedPrograms.label = "Which current or past programs you've watched on WNMU-TV or PBS have been especially valuable or memorable to you?";
  }

  const learnCurrently = findQuestion("learn_currently");
  if (learnCurrently) {
    learnCurrently.options = learnCurrently.options.filter((option) => option.value !== "printed");
  }

  const learnPreferred = findQuestion("learn_preferred");
  if (learnPreferred) {
    learnPreferred.help = "Select every method you would genuinely use. A printed program guide is included as a preference even though WNMU-TV does not currently publish one.";
  }
})();
