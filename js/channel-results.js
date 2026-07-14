(function () {
  "use strict";

  const channels = [
    { id: "wnmu_13_1", label: "WNMU-TV 13.1" },
    { id: "pbs_kids_13_2", label: "PBS KIDS 24/7 13.2" },
    { id: "wnmu_plus_13_3", label: "WNMU-TV Plus 13.3" },
    { id: "mlc_13_4", label: "Michigan Learning Channel 13.4" }
  ];

  let responses = [];

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    responses = makeDemoResponses();

    document.getElementById("loadDemo")?.addEventListener("click", () => {
      responses = makeDemoResponses();
      queueRender();
    });

    document.getElementById("loadLocal")?.addEventListener("click", () => {
      responses = window.WNMUStorage?.getResponses?.() || [];
      queueRender();
    });

    document.getElementById("clearLocal")?.addEventListener("click", () => {
      window.setTimeout(() => {
        responses = window.WNMUStorage?.getResponses?.() || [];
        render();
      }, 0);
    });

    const upload = document.getElementById("jsonUpload");
    upload?.addEventListener("change", async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        const parsed = JSON.parse(await file.text());
        responses = normalizeImportedData(parsed);
        render();
      } catch {
        // The main results script displays the import error. Keep the previous channel view.
      }
    });

    ["filterViewer", "filterMethod", "filterAge", "filterGender", "filterEducation", "filterCounty", "filterChildren"].forEach((id) => {
      document.getElementById(id)?.addEventListener("change", queueRender);
    });

    render();
  }

  function queueRender() {
    window.setTimeout(render, 0);
  }

  function normalizeImportedData(parsed) {
    if (Array.isArray(parsed)) return parsed.filter(isResponseLike);
    if (parsed && Array.isArray(parsed.responses)) return parsed.responses.filter(isResponseLike);
    return isResponseLike(parsed) ? [parsed] : [];
  }

  function isResponseLike(item) {
    return Boolean(item && typeof item === "object" && item.routeProfile && item.answers);
  }

  function filteredResponses() {
    const values = {
      viewer: document.getElementById("filterViewer")?.value || "",
      method: document.getElementById("filterMethod")?.value || "",
      age: document.getElementById("filterAge")?.value || "",
      gender: document.getElementById("filterGender")?.value || "",
      education: document.getElementById("filterEducation")?.value || "",
      county: document.getElementById("filterCounty")?.value || "",
      children: document.getElementById("filterChildren")?.value || ""
    };

    return responses.filter((response) => {
      const profile = response.routeProfile || {};
      const answers = response.answers || {};
      if (values.viewer && profile.viewer_status !== values.viewer) return false;
      if (values.method && !(profile.viewing_methods || []).includes(values.method)) return false;
      if (values.age && answers.age_range !== values.age) return false;
      if (values.gender && answers.gender !== values.gender) return false;
      if (values.education && answers.education_level !== values.education) return false;
      if (values.county && answers.county_region !== values.county) return false;
      if (values.children && profile.children_role !== values.children) return false;
      return true;
    });
  }

  function render() {
    const body = document.getElementById("channelResultsBody");
    const note = document.getElementById("channelResultsNote");
    if (!body || !note) return;

    const filtered = filteredResponses();
    const metrics = [
      { key: "channel_awareness", label: "Knew about it" },
      { key: "channels_received", label: "Can receive it" },
      { key: "channels_watched", label: "Watches it" }
    ];

    body.innerHTML = channels.map((channel) => {
      const cells = metrics.map((metric) => {
        const answered = filtered.filter((response) => Array.isArray(response.answers?.[metric.key]));
        const count = answered.filter((response) => response.answers[metric.key].includes(channel.id)).length;
        return `<td><strong>${count}</strong><span>${percent(count, answered.length)} · n=${answered.length}</span></td>`;
      }).join("");
      return `<tr><th scope="row">${escapeHtml(channel.label)}</th>${cells}</tr>`;
    }).join("");

    const answeredAny = filtered.filter((response) => ["channel_awareness", "channels_received", "channels_watched"]
      .some((key) => Array.isArray(response.answers?.[key]))).length;

    note.textContent = answeredAny
      ? `${answeredAny} of ${filtered.length} responses in this filtered view include at least one of the new channel questions. Percentages use the number who answered each question.`
      : "No responses in this view include the new channel questions yet. Earlier saved responses will remain blank here.";
  }

  function percent(part, total) {
    return total ? `${Math.round((part / total) * 100)}%` : "0%";
  }

  function makeDemoResponses() {
    const viewers = [
      "regular", "regular", "regular", "regular", "regular", "regular", "regular", "regular", "regular",
      "occasional", "occasional", "occasional", "occasional", "occasional", "occasional", "occasional", "occasional", "occasional", "occasional",
      "once_twice", "once_twice", "once_twice", "former", "former", "never"
    ];
    const ages = [
      "55_64", "65_74", "65_74", "75_84", "55_64", "65_74", "75_84", "55_64", "65_74",
      "45_54", "55_64", "65_74", "75_84", "55_64", "65_74", "45_54", "75_84", "55_64", "65_74",
      "45_54", "55_64", "65_74", "75_84", "65_74", "85_plus"
    ];
    const genders = [
      "woman", "woman", "man", "woman", "man", "woman", "woman", "man", "woman", "woman",
      "man", "woman", "man", "woman", "woman", "man", "woman", "man", "woman", "man",
      "woman", "man", "woman", "man", "woman"
    ];
    const education = [
      "bachelor", "graduate", "associate", "bachelor", "graduate", "bachelor", "some_college", "associate", "graduate", "bachelor",
      "bachelor", "graduate", "associate", "bachelor", "graduate", "some_college", "bachelor", "associate", "graduate", "bachelor",
      "some_college", "graduate", "bachelor", "bachelor", "graduate"
    ];
    const counties = [
      "marquette", "marquette", "delta", "dickinson", "houghton", "marquette", "alger", "marquette", "menominee", "delta",
      "marquette", "houghton", "dickinson", "northern_wi", "marquette", "schoolcraft", "delta", "houghton", "marquette", "menominee",
      "alger", "dickinson", "delta", "northern_wi", "marquette"
    ];
    const children = [
      "neither", "household", "neither", "neither", "educator", "neither", "household", "neither", "neither", "both",
      "neither", "neither", "household", "neither", "educator", "neither", "neither", "neither", "household", "neither",
      "neither", "neither", "neither", "neither", "neither"
    ];
    const methods = [
      ["antenna", "pbs_app", "passport"], ["cable", "passport"], ["antenna"], ["cable"], ["antenna", "pbs_app"],
      ["satellite", "passport"], ["antenna", "pbs_site"], ["cable", "pbs_app"], ["antenna"], ["pbs_app", "passport"],
      ["cable"], ["antenna", "livestream"], ["satellite"], ["antenna", "pbs_app"], ["cable", "passport"],
      ["pbs_app", "youtube_social"], ["antenna"], ["cable", "pbs_site"], ["antenna", "passport"], ["pbs_app"],
      ["antenna"], ["cable"], ["antenna"], ["satellite"], ["not_watched"]
    ];

    return viewers.map((viewer, index) => {
      const antenna = methods[index].includes("antenna");
      const cable = methods[index].includes("cable");
      const satellite = methods[index].includes("satellite");
      const aware = ["wnmu_13_1"];
      if (index % 3 !== 2) aware.push("pbs_kids_13_2");
      if (index % 2 === 0 || index < 5) aware.push("wnmu_plus_13_3");
      if (index % 4 === 0 || [4, 9, 14].includes(index)) aware.push("mlc_13_4");

      let received;
      if (antenna) received = ["wnmu_13_1", "pbs_kids_13_2", "wnmu_plus_13_3", "mlc_13_4"];
      else if (cable) received = ["wnmu_13_1", ...(index % 2 ? ["pbs_kids_13_2"] : []), ...(index % 3 ? ["wnmu_plus_13_3"] : [])];
      else if (satellite) received = ["wnmu_13_1"];
      else received = ["not_sure"];

      const watched = viewer === "never" ? ["none"] : ["wnmu_13_1"];
      if (["household", "educator", "both"].includes(children[index])) watched.push("pbs_kids_13_2");
      if (aware.includes("wnmu_plus_13_3") && index % 3 !== 1) watched.push("wnmu_plus_13_3");
      if (aware.includes("mlc_13_4") && ["educator", "both"].includes(children[index])) watched.push("mlc_13_4");

      return {
        routeProfile: {
          viewer_status: viewer,
          viewing_methods: methods[index],
          children_role: children[index]
        },
        answers: {
          age_range: ages[index],
          gender: genders[index],
          education_level: education[index],
          county_region: counties[index],
          channel_awareness: aware,
          channels_received: received,
          channels_watched: watched
        }
      };
    });
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
