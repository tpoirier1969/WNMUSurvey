"use strict";

function makeDemoData() {
  const roles = findQuestion(survey.gapPairs.importanceQuestion).rows.map((row) => row.id);
  const programs = findQuestion("program_category_interest").rows.map((row) => row.id);
  const viewers = ["regular", "regular", "regular", "regular", "regular", "regular", "regular", "regular", "regular", "occasional", "occasional", "occasional", "occasional", "occasional", "occasional", "occasional", "occasional", "occasional", "occasional", "once_twice", "once_twice", "once_twice", "former", "former", "never"];
  const ages = ["55_64", "65_74", "65_74", "75_84", "55_64", "65_74", "75_84", "55_64", "65_74", "45_54", "55_64", "65_74", "75_84", "55_64", "65_74", "45_54", "75_84", "55_64", "65_74", "45_54", "55_64", "65_74", "75_84", "65_74", "85_plus"];
  const counties = ["marquette", "marquette", "delta", "dickinson", "houghton", "marquette", "alger", "marquette", "menominee", "delta", "marquette", "houghton", "dickinson", "northern_wi", "marquette", "schoolcraft", "delta", "houghton", "marquette", "menominee", "alger", "dickinson", "delta", "northern_wi", "marquette"];
  const communities = ["city", "town", "rural", "town", "rural", "city", "rural", "town", "rural", "city", "town", "rural", "town", "rural", "city", "rural", "town", "rural", "city", "rural", "rural", "town", "rural", "town", "city"];
  const childrenRoles = ["neither", "household", "neither", "neither", "educator", "neither", "household", "neither", "neither", "both", "neither", "neither", "household", "neither", "educator", "neither", "neither", "neither", "household", "neither", "neither", "neither", "neither", "neither", "neither"];
  const methodSets = [
    ["antenna", "pbs_app", "pbs_passport"], ["cable_satellite", "pbs_passport"], ["antenna"], ["cable_satellite"], ["antenna", "pbs_org"],
    ["cable_satellite", "pbs_passport"], ["antenna", "pbs_app"], ["cable_satellite", "pbs_org"], ["antenna"], ["pbs_app", "pbs_passport"],
    ["cable_satellite"], ["antenna", "wnmu_livestream"], ["cable_satellite"], ["antenna", "pbs_org"], ["cable_satellite", "pbs_passport"],
    ["pbs_app", "youtube"], ["antenna"], ["cable_satellite", "youtube_tv"], ["antenna", "pbs_passport"], ["pbs_org"],
    ["antenna"], ["cable_satellite"], ["antenna"], ["youtube_tv"], ["not_watched"]
  ];

  return viewers.map((viewer, index) => {
    const methods = methodSets[index];
    const isViewer = !["never", "former"].includes(viewer);
    const importance = {};
    const performance = {};

    roles.forEach((role, roleIndex) => {
      const score = clampScore(3 + ((index + roleIndex) % 2) + (["trusted_public_media", "up_programming", "reflect_region"].includes(role) ? 1 : 0));
      importance[role] = score;
      if (isViewer) performance[role] = clampScore(score - (["up_programming", "reflect_region", "online_access"].includes(role) ? 1 : 0) - ((index + roleIndex) % 5 === 0 ? 1 : 0));
    });

    const interest = {};
    programs.forEach((program, programIndex) => {
      let score = 2 + ((index + programIndex * 2) % 3);
      if (["history_biography", "environment_nature", "outdoor_recreation", "regional_documentaries", "national_pbs_documentaries"].includes(program)) score += 1;
      if (program === "children_education" && childrenRoles[index] !== "neither") score = 5;
      interest[program] = clampScore(score);
    });

    const top = Object.entries(interest).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id]) => id);
    const aware = ["wnmu_13_1", ...(index % 3 ? ["pbs_kids_13_2"] : []), ...(index % 2 ? [] : ["wnmu_plus_13_3"]), ...(index % 4 ? [] : ["mlc_13_4"])];
    const received = methods.includes("antenna")
      ? ["wnmu_13_1", "pbs_kids_13_2", "wnmu_plus_13_3", "mlc_13_4"]
      : methods.includes("cable_satellite")
        ? ["wnmu_13_1", "pbs_kids_13_2", "wnmu_plus_13_3"]
        : methods.includes("youtube_tv") ? ["wnmu_13_1"] : undefined;
    const watched = viewer === "never"
      ? undefined
      : ["wnmu_13_1", ...(childrenRoles[index] !== "neither" ? ["pbs_kids_13_2"] : []), ...(index % 3 ? [] : ["wnmu_plus_13_3"])];

    return {
      responseId: `synthetic-${String(index + 1).padStart(2, "0")}`,
      id: `synthetic-${String(index + 1).padStart(2, "0")}`,
      respondentId: `synthetic-person-${String(index + 1).padStart(2, "0")}`,
      schemaVersion: config.schemaVersion,
      surveyVersion: config.schemaVersion,
      buildVersion: config.buildVersion,
      mode: "test",
      source: "synthetic-up-pbs-sample",
      submittedAt: new Date(Date.now() - index * 86400000).toISOString(),
      routeProfile: { viewer_status: viewer, viewing_methods: methods, children_role: childrenRoles[index] },
      answers: {
        age_range: ages[index],
        county_region: counties[index],
        community_type: communities[index],
        internet_streaming_quality: communities[index] === "rural" && index % 3 === 0 ? "unreliable" : index % 5 === 0 ? "works_well" : "adequate",
        channel_awareness: aware,
        channels_received: received,
        channels_watched: watched,
        online_awareness: ["wnmu_site", ...(index % 2 === 0 ? ["pbs_app"] : ["pbs_org"]), ...(index % 4 === 0 ? ["pbs_passport"] : [])],
        program_category_interest: interest,
        program_category_priorities: top,
        station_role_importance: importance,
        station_role_performance: isViewer ? performance : undefined,
        valued_programs: index % 7 === 0 ? "Local history, Great Lakes documentaries, and long-form PBS programs." : "",
        final_feedback: index % 6 === 0 ? "The station is trusted, but Upper Peninsula programs should be easier to find and promoted more clearly." : "",
        nonviewer_return: !isViewer ? "A clearer schedule and more visible Upper Peninsula programs would help." : ""
      }
    };
  });
}

function average(values) { return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0; }
function clampScore(value) { return Math.max(1, Math.min(5, value)); }
function isNumericScore(value) { return value !== "na" && hasValue(value) && !Number.isNaN(Number(value)); }
function hasValue(value) {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === "object") return Object.values(value).some((item) => item !== "" && item !== undefined && item !== null);
  return value !== null && value !== undefined && value !== "";
}
function percent(part, total) { return total ? `${Math.round((part / total) * 100)}%` : "0%"; }
function formatSigned(value) { return value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2); }
function dateStamp() { return new Date().toISOString().slice(0, 10); }
function humanize(value) { return String(value || "").replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function csvCell(value) { return `"${String(value ?? "").replace(/"/g, '""')}"`; }

function downloadText(filename, text, type) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function escapeAttr(value) { return escapeHtml(value); }
