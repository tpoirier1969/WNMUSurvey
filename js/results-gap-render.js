"use strict";

  function pairedRoleStats(responses, roleId) {
    const importanceQuestion = survey.gapPairs.importanceQuestion;
    const performanceQuestion = survey.gapPairs.performanceQuestion;
    const pairs = responses.flatMap((response) => {
      const importance = response.answers?.[importanceQuestion]?.[roleId];
      const performance = response.answers?.[performanceQuestion]?.[roleId];
      if (!isNumericScore(importance) || !isNumericScore(performance)) return [];
      return [{ importance: Number(importance), performance: Number(performance), gap: Number(importance) - Number(performance) }];
    });
    if (!pairs.length) return null;
    return {
      count: pairs.length,
      importanceAverage: average(pairs.map((pair) => pair.importance)),
      performanceAverage: average(pairs.map((pair) => pair.performance)),
      gapAverage: average(pairs.map((pair) => pair.gap))
    };
  }

  function renderGapResults(responses) {
    const roles = findQuestion(survey.gapPairs.importanceQuestion).rows;
    const rows = roles.map((role) => {
      const stats = pairedRoleStats(responses, role.id);
      return stats ? { label: role.label, ...stats } : null;
    }).filter(Boolean).sort((a, b) => b.gapAverage - a.gapAverage);

    if (!rows.length) {
      els.gapTable.innerHTML = '<tr><td colspan="5">No respondents in this view rated both importance and performance for the same role.</td></tr>';
    } else {
      els.gapTable.innerHTML = rows.map((row) => `<tr><td>${escapeHtml(row.label)}</td><td>${row.importanceAverage.toFixed(2)}</td><td>${row.performanceAverage.toFixed(2)}</td><td class="${row.gapAverage >= 1 ? "gap-high" : ""}">${formatSigned(row.gapAverage)}</td><td>${row.count}</td></tr>`).join("");
    }

    renderGapBucket("needsAttentionList", "needsAttentionCount", rows.filter((row) => row.gapAverage >= 0.5).sort((a, b) => b.gapAverage - a.gapAverage), "No roles currently fall at least 0.50 points below stated importance.");
    renderGapBucket("meetingExpectationsList", "meetingExpectationsCount", rows.filter((row) => Math.abs(row.gapAverage) < 0.5).sort((a, b) => b.performanceAverage - a.performanceAverage), "No roles currently fall within the meeting-expectations range.");
    renderGapBucket("exceedingExpectationsList", "exceedingExpectationsCount", rows.filter((row) => row.gapAverage <= -0.5).sort((a, b) => a.gapAverage - b.gapAverage), "No roles currently exceed stated importance by at least 0.50 points.");
  }

  function renderGapBucket(listId, countId, rows, emptyMessage) {
    const list = document.getElementById(listId);
    const count = document.getElementById(countId);
    if (!list || !count) return;
    count.textContent = `${rows.length} role${rows.length === 1 ? "" : "s"}`;
    list.innerHTML = rows.length
      ? rows.map((row) => `<article class="gap-role-item"><strong>${escapeHtml(row.label)}</strong><div class="gap-role-metrics"><span>Importance <b>${row.importanceAverage.toFixed(2)}</b></span><span>Delivery <b>${row.performanceAverage.toFixed(2)}</b></span><span class="gap-value">Gap <b>${formatSigned(row.gapAverage)}</b></span><span>n=${row.count}</span></div></article>`).join("")
      : `<div class="gap-bucket-empty">${escapeHtml(emptyMessage)}</div>`;
  }

  function renderComments(responses) {
    const commentQuestions = [
      ["valued_programs", "Valued programs"],
      ["kids_needs", "Children and educator needs"],
      ["nonviewer_return", "What could win them back"],
      ["final_feedback", "Final feedback"]
    ];
    const comments = responses.flatMap((response) => commentQuestions.flatMap(([id, label]) => {
      const value = response.answers?.[id];
      return typeof value === "string" && value.trim() ? [{ label, text: value.trim() }] : [];
    }));
    els.commentList.innerHTML = comments.length
      ? comments.map((comment) => `<article class="comment-card"><strong>${escapeHtml(comment.label)}</strong><p>${escapeHtml(comment.text)}</p></article>`).join("")
      : '<div class="empty-state">No open comments in this filtered view.</div>';
  }

