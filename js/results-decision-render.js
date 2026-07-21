"use strict";

  const DECISION_MINIMUM_N = 5;

  function renderDecisionBrief(coreResponses, followUpResponses) {
    renderDecisionContext(coreResponses, followUpResponses);
    renderCoreDecisionFindings(coreResponses);
    renderFollowUpDecisionFindings(followUpResponses);
    renderContactRequestSummary(coreResponses);
  }

  function renderDecisionContext(coreResponses, followUpResponses) {
    const modulesCompleted = new Set(followUpResponses.map((response) => response.moduleId)).size;
    const linkedPeople = new Set(followUpResponses.map((response) => response.respondentId || response.coreResponseId)).size;

    if (els.decisionBriefStatus) {
      els.decisionBriefStatus.innerHTML = `<p><strong>${coreResponses.length}</strong> questionnaire responses are included in this view.</p><p>Filters update the findings below.</p>`;
    }
    if (els.followUpDecisionStatus) {
      els.followUpDecisionStatus.innerHTML = followUpResponses.length
        ? `<p><strong>${linkedPeople}</strong> respondents completed <strong>${followUpResponses.length}</strong> optional follow-ups across <strong>${modulesCompleted}</strong> modules.</p>`
        : `<p>No optional follow-up responses are linked to the currently filtered core respondents.</p>`;
    }
  }

  function renderCoreDecisionFindings(responses) {
    if (!els.decisionFindings) return;
    const findings = [
      programmingPriorityFinding(responses),
      importanceGapFinding(responses),
      streamingAccessFinding(responses),
      digitalViewingFinding(responses),
      stationAwarenessFinding(responses),
      trustFinding(responses),
      nonviewerBarrierFinding(responses)
    ].filter(Boolean).sort((a, b) => b.priority - a.priority).slice(0, 6);

    els.decisionFindings.innerHTML = findings.length
      ? findings.map(decisionFindingMarkup).join("")
      : `<div class="empty-state">No core finding meets the minimum evidence rule of answered n=${DECISION_MINIMUM_N} in this filtered view.</div>`;
  }

  function programmingPriorityFinding(responses) {
    const question = findQuestion("program_category_priorities");
    const coverage = questionCoverage(question, responses);
    if (coverage.answered < DECISION_MINIMUM_N) return null;
    const counts = countArray(coverage.answeredResponses, (response) => questionValue(question, response));
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    if (!top) return null;
    const labels = labelMap("program_category_priorities");
    const share = top[1] / coverage.answered;
    return {
      priority: 90 + share,
      eyebrow: "Core · Programming priority",
      title: `${labels[top[0]] || humanize(top[0])} leads the forced-choice priorities`,
      evidence: `${top[1]} of ${coverage.answered} respondents who selected priorities included this category (${percent(top[1], coverage.answered)}; answered n=${coverage.answered}, skipped n=${coverage.skipped}).`,
      implication: "This is the clearest core signal about where respondents want WNMU-TV to place greater programming attention.",
      options: [
        "Treat it as a candidate for scheduling, acquisition, partnership, or development exploration.",
        "Check the interest scores and audience filters before choosing what to do."
      ],
      caution: coreFindingCaution(responses, "Respondents could choose up to five categories, so percentages do not sum to 100%.")
    };
  }

  function importanceGapFinding(responses) {
    const roles = findQuestion(survey.gapPairs.importanceQuestion).rows;
    const rows = roles.map((role) => {
      const stats = pairedRoleStats(responses, role.id);
      return stats ? { role, ...stats } : null;
    }).filter((row) => row && row.count >= DECISION_MINIMUM_N).sort((a, b) => b.gapAverage - a.gapAverage);
    const top = rows[0];
    if (!top || top.gapAverage < 0.5) return null;
    return {
      priority: 100 + top.gapAverage,
      eyebrow: "Core · Performance opportunity",
      title: `${top.role.label} has the largest material importance–delivery gap`,
      evidence: `Among ${top.count} people who rated both, importance averaged ${top.importanceAverage.toFixed(2)} and WNMU-TV's performance averaged ${top.performanceAverage.toFixed(2)}. Performance trails importance by ${formatSigned(top.gapAverage)} points.`,
      implication: "Respondents in this paired group place more importance on this role than they believe WNMU-TV currently delivers.",
      options: [
        "Ask what specifically is falling short before choosing a remedy.",
        "Set a measurable improvement experiment, then repeat the paired measure to see whether the gap narrows."
      ],
      caution: coreFindingCaution(responses, "Only respondents who rated both importance and delivery for this same role are included.")
    };
  }

  function streamingAccessFinding(responses) {
    const question = findQuestion("internet_streaming_quality");
    const coverage = questionCoverage(question, responses);
    const usableValues = new Set(["works_well", "adequate", "slow", "unreliable", "none"]);
    const usable = coverage.answeredResponses.filter((response) => usableValues.has(questionValue(question, response)));
    if (usable.length < DECISION_MINIMUM_N) return null;
    const constrainedValues = new Set(["slow", "unreliable", "none"]);
    const constrained = usable.filter((response) => constrainedValues.has(questionValue(question, response))).length;
    const share = constrained / usable.length;
    const title = share >= 0.25
      ? "Home internet limits streaming for a meaningful share of respondents"
      : "Most respondents report at least adequate home streaming access";
    return {
      priority: 65 + Math.abs(share - 0.25),
      eyebrow: "Core · Access",
      title,
      evidence: `${constrained} of ${usable.length} respondents reporting a home streaming condition selected slow, unreliable, or no home internet (${percent(constrained, usable.length)}; usable n=${usable.length}; ${coverage.answered - usable.length} answered “Not tried” or “Prefer not”; skipped n=${coverage.skipped}).`,
      implication: share >= 0.25
        ? "A streaming-only solution would leave part of this respondent group poorly served."
        : "Digital delivery appears practical for many respondents, while broadcast access still matters for the constrained minority.",
      options: [
        "Keep broadcast and low-bandwidth information paths in plans that also expand streaming.",
        "Use geography and community-type filters to see where access constraints concentrate."
      ],
      caution: coreFindingCaution(responses, "This measures self-reported home streaming quality, not a technical broadband test.")
    };
  }

  function digitalViewingFinding(responses) {
    const question = findQuestion("viewing_methods");
    const coverage = questionCoverage(question, responses);
    if (coverage.answered < DECISION_MINIMUM_N) return null;
    const onlineMethods = new Set(["wnmu_livestream", "pbs_app", "pbs_org", "pbs_passport", "youtube_tv", "youtube"]);
    const online = coverage.answeredResponses.filter((response) => {
      const methods = questionValue(question, response);
      return Array.isArray(methods) && methods.some((method) => onlineMethods.has(method));
    }).length;
    return {
      priority: 60 + (online / coverage.answered),
      eyebrow: "Core · Viewing path",
      title: `${percent(online, coverage.answered)} report using at least one online viewing method`,
      evidence: `${online} of ${coverage.answered} respondents answering viewing methods selected the WNMU-TV livestream, PBS App, PBS.org, Passport, YouTube TV, or YouTube (answered n=${coverage.answered}, skipped n=${coverage.skipped}).`,
      implication: "Online viewing is part of the service mix. The optional online follow-up identifies the service used most often.",
      options: [
        "Use the online follow-up's most-used-service result to identify the primary path.",
        "Avoid treating all online methods as interchangeable when planning promotion or support."
      ],
      caution: coreFindingCaution(responses, "This is a multi-select measure and combines several distinct online services.")
    };
  }

  function stationAwarenessFinding(responses) {
    const question = findQuestion("station_awareness");
    const coverage = questionCoverage(question, responses);
    if (coverage.answered < DECISION_MINIMUM_N) return null;
    const incomplete = coverage.answeredResponses.filter((response) => questionValue(question, response) !== "local_pbs").length;
    const share = incomplete / coverage.answered;
    return {
      priority: 70 + share,
      eyebrow: "Core · Awareness",
      title: share >= 0.25
        ? "Some respondents did not know WNMU-TV is their local PBS station"
        : "Most respondents already identified WNMU-TV as their local PBS station",
      evidence: `${incomplete} of ${coverage.answered} respondents answering the awareness question did not select “I knew WNMU-TV was my local PBS station” (${percent(incomplete, coverage.answered)}; answered n=${coverage.answered}, skipped n=${coverage.skipped}).`,
      implication: share >= 0.25
        ? "Station identity and service awareness may be limiting discovery for part of this respondent group."
        : "Basic station identity is comparatively strong in this view; awareness of individual channels and services may still differ.",
      options: [
        "Compare channel and online-service awareness before choosing an outreach message.",
        "Test whether clearer WNMU-TV/PBS identification improves discovery among less-aware segments."
      ],
      caution: coreFindingCaution(responses, "Answering a WNMU-TV questionnaire can itself attract people who already know the station.")
    };
  }

  function trustFinding(responses) {
    const question = findQuestion("trust_station");
    const coverage = questionCoverage(question, responses);
    const rated = coverage.answeredResponses.filter((response) => questionValue(question, response) !== "not_familiar");
    if (rated.length < DECISION_MINIMUM_N) return null;
    const high = rated.filter((response) => ["quite", "great"].includes(questionValue(question, response))).length;
    const share = high / rated.length;
    return {
      priority: 55 + share,
      eyebrow: "Core · Trust",
      title: share >= 0.6 ? "Trust is a reported strength in this viewer group" : "High trust is not yet a majority signal in this view",
      evidence: `${high} of ${rated.length} respondents offering a trust rating selected “Quite a bit” or “A great deal” (${percent(high, rated.length)}; rated n=${rated.length}; ${coverage.answered - rated.length} answered “Not familiar enough”).`,
      implication: share >= 0.6
        ? "Trust may be an asset WNMU-TV can protect while changing programming and access strategies."
        : "The station should understand whether lower trust reflects content, relevance, awareness, or limited familiarity.",
      options: [
        "Protect trusted editorial and public-service qualities when testing new formats.",
        "Compare trust with viewer relationship and regional-reflection ratings before drawing a cause."
      ],
      caution: coreFindingCaution(responses, "Former and never-viewers were not asked this question, so it is not a community-wide trust measure.")
    };
  }

  function nonviewerBarrierFinding(responses) {
    const question = findQuestion("nonviewer_reasons");
    const coverage = questionCoverage(question, responses);
    if (coverage.answered < DECISION_MINIMUM_N) return null;
    const counts = countArray(coverage.answeredResponses, (response) => questionValue(question, response));
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    if (!top) return null;
    const labels = labelMap("nonviewer_reasons");
    return {
      priority: 80 + (top[1] / coverage.answered),
      eyebrow: "Core · Former and non-viewers",
      title: `${labels[top[0]] || humanize(top[0])} is the leading reported barrier`,
      evidence: `${top[1]} of ${coverage.answered} applicable respondents who answered the barrier question selected this reason (${percent(top[1], coverage.answered)}; answered n=${coverage.answered}, skipped n=${coverage.skipped}, not applicable n=${coverage.notApplicable}).`,
      implication: "This is the most common stated obstacle in the routed former-, never-, and unsure-viewer group.",
      options: [
        "Test a narrowly matched response to this barrier before committing to a broad change.",
        "Review open return-to-viewing comments for the specific service or programming change people describe."
      ],
      caution: coreFindingCaution(responses, "The question is routed and multi-select; it does not represent current viewers or prove causation.")
    };
  }

  function renderFollowUpDecisionFindings(followUpResponses) {
    if (!els.followUpDecisionFindings) return;
    const specs = [
      ["local-programming", "local_subjects", "Regional subject development", "Use the leading subject as one candidate for development, acquisition, or partnership research."],
      ["programming-ideas", "regional_music_performance_interest", "Regional music-performance concept", "Use the leading selection to shape a concept test, not as approval to produce a series."],
      ["online-viewing", "online_primary_service", "Primary online service", "Focus promotion and support on the service people use most."],
      ["children-education", "children_learning_goals", "Children's learning priorities", "Use the leading learning goal to guide resources and programming for families and educators."],
      ["communication", "schedule_format", "Schedule and program information", "Use the leading format as a candidate communication product to test with this module's participants."]
    ];
    const findings = specs.map(([moduleId, questionId, context, option]) =>
      followUpTopChoiceFinding(followUpResponses, moduleId, questionId, context, option)
    ).filter(Boolean);

    els.followUpDecisionFindings.innerHTML = findings.length
      ? findings.map(decisionFindingMarkup).join("")
      : `<div class="empty-state">No optional module has answered n=${DECISION_MINIMUM_N} for a designated Decision Brief signal in this filtered view.</div>`;
  }

  function followUpTopChoiceFinding(responses, moduleId, questionId, context, option) {
    const module = findFollowUpModule(moduleId);
    const found = findFollowUpQuestion(questionId);
    if (!module || !found) return null;
    const moduleResponses = responses.filter((response) => response.moduleId === moduleId);
    const coverage = followUpQuestionCoverage(found.question, moduleResponses);
    if (coverage.answered < DECISION_MINIMUM_N) return null;
    const getter = (response) => response.answers?.[questionId];
    const counts = found.question.type === "checkbox"
      ? countArray(coverage.answeredResponses, getter)
      : countSingle(coverage.answeredResponses, getter);
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    if (!top) return null;
    const labels = Object.fromEntries((found.question.options || []).map((item) => [String(item.value), item.label]));
    return {
      priority: 0,
      eyebrow: `Optional follow-up · ${module.title}`,
      title: `${context}: ${labels[top[0]] || humanize(top[0])}`,
      evidence: `${top[1]} of ${coverage.answered} people who answered this question selected this option (${percent(top[1], coverage.answered)}; answered n=${coverage.answered}, skipped n=${coverage.skipped}, module n=${coverage.moduleRespondents}).`,
      implication: "This was the most common answer in this optional follow-up.",
      options: [option, "Compare it with core filters and related open comments before deciding what to do."],
      caution: found.question.type === "checkbox" ? "Respondents could select more than one option." : ""
    };
  }

  function renderContactRequestSummary(coreResponses) {
    if (!els.contactRequestSummary) return;
    const requests = filteredContactRequests(coreResponses);
    els.contactRequestSummary.innerHTML = `<div class="contact-count-card"><strong>${requests.length}</strong><span>optional contact request${requests.length === 1 ? "" : "s"} linked to responses in this filtered view</span></div><p>Contact details are stored separately from questionnaire answers. Names, email addresses, reasons, and contact records are not shown here and are not included in research JSON or CSV exports.</p>`;
  }

  function coreFindingCaution(responses, specific) {
    return specific;
  }

  function decisionFindingMarkup(finding) {
    return `<article class="decision-finding-card">
      <p class="eyebrow">${escapeHtml(finding.eyebrow)}</p>
      <h3>${escapeHtml(finding.title)}</h3>
      <dl class="decision-finding-parts">
        <div><dt>Evidence</dt><dd>${escapeHtml(finding.evidence)}</dd></div>
        <div><dt>What it means</dt><dd>${escapeHtml(finding.implication)}</dd></div>
        <div><dt>What WNMU-TV could do</dt><dd><ul>${finding.options.map((option) => `<li>${escapeHtml(option)}</li>`).join("")}</ul></dd></div>
        ${finding.caution ? `<div class="decision-note"><dt>Note</dt><dd>${escapeHtml(finding.caution)}</dd></div>` : ""}
      </dl>
    </article>`;
  }

  function renderQualitativeThemes(coreResponses, followUpResponses) {
    if (!els.qualitativeThemes) return;
    const comments = collectOpenComments(coreResponses, followUpResponses);
    if (!comments.length) {
      els.qualitativeThemes.innerHTML = '<div class="empty-state">No open responses are available in this filtered view.</div>';
      return;
    }

    const definitions = qualitativeThemeDefinitions();
    const coreCommentCount = comments.filter((comment) => comment.source === "Core questionnaire").length;
    const followUpCommentCount = comments.length - coreCommentCount;
    const themed = definitions.map((theme) => ({
      ...theme,
      comments: comments.filter((comment) => theme.patterns.some((pattern) => pattern.test(comment.text)))
    }));
    const matchedIds = new Set(themed.flatMap((theme) => theme.comments.map((comment) => comment.id)));
    const other = comments.filter((comment) => !matchedIds.has(comment.id));
    if (other.length) themed.push({ id: "other", label: "Other or not automatically classified", comments: other });

    els.qualitativeThemes.innerHTML = `<p class="theme-method-note">${comments.length} original open response${comments.length === 1 ? "" : "s"} are in this filtered view: ${coreCommentCount} core and ${followUpCommentCount} voluntary follow-up. Theme matching is a transparent keyword aid, not a replacement for human review or a measure of the full audience. A comment may appear in more than one theme. Text below is shown exactly as submitted.</p><div class="qualitative-theme-list">${themed.filter((theme) => theme.comments.length).map((theme) => qualitativeThemeMarkup(theme, comments.length)).join("")}</div>`;
  }

  function collectOpenComments(coreResponses, followUpResponses) {
    const coreQuestions = survey.stages.flatMap((stage) => stage.pages.flatMap((page) => page.questions))
      .filter((question) => ["text", "textarea"].includes(question.type));
    const coreComments = coreQuestions.flatMap((question) => {
      const coverage = questionCoverage(question, coreResponses);
      return coverage.answeredResponses.map((response, index) => ({
        id: `core:${question.id}:${response.responseId || response.id || index}`,
        text: String(questionValue(question, response)).trim(),
        source: "Core questionnaire",
        question: question.label || question.id
      }));
    });
    const followUpComments = followUps.modules.flatMap((module) => {
      const moduleResponses = followUpResponses.filter((response) => response.moduleId === module.id);
      return module.pages.flatMap((page) => page.questions.filter((question) => question.type === "textarea").flatMap((question) => {
        const coverage = followUpQuestionCoverage(question, moduleResponses);
        return coverage.answeredResponses.map((response, index) => ({
          id: `followup:${question.id}:${response.responseId || response.id || index}`,
          text: String(response.answers?.[question.id] || "").trim(),
          source: `Optional follow-up · ${module.title}`,
          question: question.label || question.id
        }));
      }));
    });
    return [...coreComments, ...followUpComments];
  }

  function qualitativeThemeDefinitions() {
    return [
      { id: "regional", label: "Regional stories, communities, and representation", patterns: [/upper peninsula/i, /\bu\.?p\.?\b/i, /regional/i, /local/i, /communit/i, /great lakes/i, /lake superior/i, /yooper/i, /marquette/i] },
      { id: "programming", label: "Programs, subjects, and formats", patterns: [/program/i, /show/i, /documentar/i, /history/i, /music/i, /performance/i, /nature/i, /outdoor/i, /news/i, /arts?/i, /culture/i, /travel/i, /series/i] },
      { id: "online", label: "Online access, streaming, and devices", patterns: [/online/i, /stream/i, /\bapp\b/i, /passport/i, /internet/i, /web ?site/i, /\bweb\b/i, /youtube/i, /device/i, /on[ -]?demand/i, /livestream/i] },
      { id: "communication", label: "Schedules, promotion, and communication", patterns: [/schedule/i, /broadcast time/i, /email/i, /text message/i, /remind/i, /promot/i, /information/i, /calendar/i, /social media/i, /easier to find/i, /clearer/i] },
      { id: "children", label: "Children, families, schools, and education", patterns: [/child/i, /\bkids?\b/i, /famil/i, /youth/i, /student/i, /school/i, /classroom/i, /teacher/i, /educat/i, /learn/i] },
      { id: "trust", label: "Trust, strengths, and station performance", patterns: [/trust/i, /quality/i, /strong/i, /excellent/i, /valuable/i, /valued/i, /reliable/i, /doing well/i, /improv/i] }
    ];
  }

  function qualitativeThemeMarkup(theme, totalComments) {
    return `<details class="qualitative-theme-card">
      <summary><span>${escapeHtml(theme.label)}</span><strong>${theme.comments.length} of ${totalComments} comments</strong></summary>
      <div class="qualitative-theme-comments">${theme.comments.map((comment) => `<article class="comment-card themed-comment"><p>${escapeHtml(comment.text)}</p><small>${escapeHtml(comment.source)} · ${escapeHtml(comment.question)}</small></article>`).join("")}</div>
    </details>`;
  }
