(function () {
  "use strict";

  const survey = window.WNMU_SURVEY;
  const config = window.WNMU_CONFIG;
  const storage = window.WNMUStorage;
  if (!survey || !config || !storage) return;

  /*
   * stage-interface.js loads before app.js. Preserve the viewer's sound
   * preference, then temporarily disable the legacy single-tone sound before
   * app.js reads it. This file owns the visible sound control and the richer
   * stage sounds after DOMContentLoaded.
   */
  let soundEnabled = storage.getSoundEnabled();
  storage.setSoundEnabled(false);

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    const app = document.getElementById("surveyApp");
    const welcome = document.getElementById("welcomePanel");
    const questionnaire = document.getElementById("questionnairePanel");
    const complete = document.getElementById("completePanel");
    const resumeBlock = document.getElementById("resumeBlock");
    const stageCards = Array.from(document.querySelectorAll(".stage-card[data-stage-id]"));
    if (!app || !stageCards.length) return;

    let activeStageId = null;
    let bypassPress = false;
    let pressLocked = false;
    let refreshTimer = 0;
    let lastStageSoundAt = 0;
    let audioContext = null;

    stageCards.forEach((card) => {
      card.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) return;
        lastStageSoundAt = performance.now();
        playSound("open");
      });

      card.addEventListener("click", (event) => {
        if (event.detail === 0 && performance.now() - lastStageSoundAt > 250) {
          lastStageSoundAt = performance.now();
          playSound("open");
        }

        if (pressLocked && !bypassPress) {
          event.preventDefault();
          event.stopImmediatePropagation();
          return;
        }

        if (bypassPress || reducedMotion()) {
          activeStageId = card.dataset.stageId;
          window.setTimeout(refresh, 0);
          return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();
        activeStageId = card.dataset.stageId;
        pressLocked = true;
        stageCards.forEach((item) => item.classList.toggle("is-pressing", item === card));

        window.setTimeout(() => {
          card.classList.remove("is-pressing");
          pressLocked = false;
          bypassPress = true;
          card.click();
          bypassPress = false;
          window.setTimeout(refresh, 0);
          window.setTimeout(refresh, 360);
        }, 90);
      }, true);
    });

    const observer = new MutationObserver(() => scheduleRefresh());
    [welcome, questionnaire, complete].filter(Boolean).forEach((panel) => {
      observer.observe(panel, { attributes: true, attributeFilter: ["hidden"] });
    });
    stageCards.forEach((card) => observer.observe(card, {
      attributes: true,
      attributeFilter: ["data-status"]
    }));
    if (resumeBlock) {
      observer.observe(resumeBlock, { attributes: true, attributeFilter: ["hidden"] });
    }

    const sectionStage = document.getElementById("sectionStage");
    const sectionPosition = document.getElementById("sectionPosition");
    if (sectionStage) observer.observe(sectionStage, { childList: true, subtree: true });
    if (sectionPosition) {
      observer.observe(sectionPosition, {
        childList: true,
        characterData: true,
        subtree: true
      });
    }

    document.addEventListener("input", () => {
      scheduleRefresh(30);
      window.setTimeout(refresh, 420);
    }, true);
    document.addEventListener("change", () => {
      scheduleRefresh(30);
      window.setTimeout(refresh, 420);
    }, true);

    document.getElementById("returnToStages")?.addEventListener("click", () => {
      window.setTimeout(refresh, 0);
    });
    document.getElementById("resumeSurvey")?.addEventListener("click", () => {
      window.setTimeout(refresh, 20);
    });
    document.getElementById("newResponse")?.addEventListener("click", () => {
      activeStageId = null;
      window.setTimeout(refresh, 0);
    });

    wireCompletionSound(document.getElementById("completeStage"));
    wireCompletionSound(document.getElementById("submitSurvey"));

    /*
     * app.js initializes after this DOMContentLoaded listener. Replace the
     * button on the next task so its anonymous legacy listener stays attached
     * only to the detached original element.
     */
    window.setTimeout(setupSoundControl, 0);
    refresh();

    function setupSoundControl() {
      const legacyToggle = document.getElementById("soundToggle");
      if (!legacyToggle) {
        storage.setSoundEnabled(soundEnabled);
        return;
      }

      const soundToggle = legacyToggle.cloneNode(true);
      legacyToggle.replaceWith(soundToggle);
      storage.setSoundEnabled(soundEnabled);
      updateSoundToggle(soundToggle);

      soundToggle.addEventListener("click", () => {
        soundEnabled = !soundEnabled;
        storage.setSoundEnabled(soundEnabled);
        updateSoundToggle(soundToggle);
        if (soundEnabled) playSound("preview");
      });
    }

    function updateSoundToggle(button) {
      button.setAttribute("aria-pressed", String(soundEnabled));
      button.textContent = soundEnabled ? "Sound On" : "Sound Off";
      button.title = soundEnabled
        ? "Turn questionnaire sounds off"
        : "Turn questionnaire sounds on";
    }

    function wireCompletionSound(button) {
      if (!button) return;
      let pointerSoundAt = 0;
      button.addEventListener("pointerdown", (event) => {
        if (event.button !== 0 || button.hidden || button.disabled) return;
        pointerSoundAt = performance.now();
        playSound("complete");
      });
      button.addEventListener("click", (event) => {
        if (event.detail === 0 && performance.now() - pointerSoundAt > 250) {
          playSound("complete");
        }
      }, true);
    }

    function playSound(kind) {
      if (!soundEnabled) return;

      try {
        const context = getAudioContext();
        if (!context) return;
        if (context.state === "suspended") context.resume().catch(() => {});

        const now = context.currentTime;
        const master = context.createGain();
        master.gain.setValueAtTime(0.0001, now);
        master.gain.exponentialRampToValueAtTime(0.16, now + 0.008);
        master.gain.exponentialRampToValueAtTime(0.0001, now + (kind === "complete" ? 0.42 : 0.25));
        master.connect(context.destination);

        addSoftClick(context, master, now);

        const notes = kind === "complete"
          ? [
              { frequency: 392.0, offset: 0.00, duration: 0.24 },
              { frequency: 523.25, offset: 0.055, duration: 0.25 },
              { frequency: 659.25, offset: 0.11, duration: 0.27 },
              { frequency: 783.99, offset: 0.17, duration: 0.24 }
            ]
          : [
              { frequency: 329.63, offset: 0.00, duration: 0.16 },
              { frequency: 493.88, offset: 0.035, duration: 0.17 },
              { frequency: 659.25, offset: 0.07, duration: 0.17 }
            ];

        notes.forEach((note, index) => {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          const start = now + note.offset;
          const end = start + note.duration;

          oscillator.type = index % 2 ? "sine" : "triangle";
          oscillator.frequency.setValueAtTime(note.frequency * 0.92, start);
          oscillator.frequency.exponentialRampToValueAtTime(note.frequency, start + 0.035);

          gain.gain.setValueAtTime(0.0001, start);
          gain.gain.exponentialRampToValueAtTime(index === 0 ? 0.32 : 0.22, start + 0.012);
          gain.gain.exponentialRampToValueAtTime(0.0001, end);

          oscillator.connect(gain).connect(master);
          oscillator.start(start);
          oscillator.stop(end + 0.02);
        });
      } catch (error) {
        console.info("Optional questionnaire sound was unavailable.", error);
      }
    }

    function addSoftClick(context, destination, start) {
      const frameCount = Math.max(1, Math.floor(context.sampleRate * 0.035));
      const buffer = context.createBuffer(1, frameCount, context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let index = 0; index < frameCount; index += 1) {
        const envelope = 1 - index / frameCount;
        data[index] = (Math.random() * 2 - 1) * envelope * envelope;
      }

      const source = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();
      filter.type = "bandpass";
      filter.frequency.value = 1550;
      filter.Q.value = 0.8;
      gain.gain.setValueAtTime(0.13, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.035);
      source.buffer = buffer;
      source.connect(filter).connect(gain).connect(destination);
      source.start(start);
    }

    function getAudioContext() {
      if (audioContext && audioContext.state !== "closed") return audioContext;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      audioContext = new AudioContext();
      return audioContext;
    }

    function scheduleRefresh(delay = 0) {
      clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(refresh, delay);
    }

    function refresh() {
      const view = !questionnaire?.hidden
        ? "questionnaire"
        : !complete?.hidden
          ? "complete"
          : "hub";
      app.dataset.view = view;
      app.dataset.hasResume = String(
        view === "hub" && Boolean(resumeBlock && !resumeBlock.hidden)
      );

      const draft = loadDraft();
      if (view === "questionnaire") {
        activeStageId = inferActiveStageId(draft) || activeStageId;
      } else {
        activeStageId = null;
      }

      stageCards.forEach((card) => {
        const stage = survey.stages.find((item) => item.id === card.dataset.stageId);
        if (!stage) return;

        const status = card.dataset.status || "not_started";
        const percent = stagePercent(stage, status, draft);
        const current = view === "questionnaire" && stage.id === activeStageId;
        card.dataset.current = String(current);
        card.style.setProperty("--stage-progress", `${percent}%`);

        if (current) card.setAttribute("aria-current", "step");
        else card.removeAttribute("aria-current");

        const statusText = status === "complete"
          ? "Complete"
          : status === "in_progress"
            ? "In progress"
            : "Not started";
        card.setAttribute(
          "aria-label",
          status === "in_progress"
            ? `${stage.title}: ${statusText}, ${percent}% complete`
            : `${stage.title}: ${statusText}`
        );
      });
    }

    function loadDraft() {
      try {
        const raw = localStorage.getItem(config.storageKeys.draft);
        return raw ? JSON.parse(raw) : null;
      } catch (error) {
        console.info("Stage progress could not read the saved draft.", error);
        return null;
      }
    }

    function inferActiveStageId(draft) {
      const text = document.querySelector("#sectionStage .eyebrow")?.textContent || "";
      const match = text.match(/Stage\s+(\d+)/i);
      const stageNumber = match ? Number(match[1]) : 0;
      const stageFromPage = survey.stages.find((stage) => stage.number === stageNumber)?.id;
      if (stageFromPage) return stageFromPage;
      if (
        draft?.currentStageId
        && survey.stages.some((stage) => stage.id === draft.currentStageId)
      ) {
        return draft.currentStageId;
      }
      return null;
    }

    function stagePercent(stage, status, draft) {
      if (status === "complete") return 100;

      const questions = stage.pages
        .flatMap((page) => page.questions || [])
        .filter((question) => questionIsApplicable(question, draft));
      const completion = questions.reduce((totals, question) => {
        const value = question.store === "profile"
          ? draft?.routeProfile?.[question.id]
          : draft?.answers?.[question.id];
        const result = questionCompletion(question, value);
        totals.done += result.done;
        totals.total += result.total;
        return totals;
      }, { done: 0, total: 0 });

      if (!completion.done || !completion.total) return 0;
      const percent = Math.round((completion.done / completion.total) * 100);
      return Math.max(2, Math.min(98, percent));
    }
  }

  function questionCompletion(question, value) {
    if (question.type === "matrix") {
      const rows = question.rows || [];
      const completed = rows.filter((row) => hasValue(value?.[row.id])).length;
      return { done: completed, total: rows.length || 1 };
    }
    return { done: hasValue(value) ? 1 : 0, total: 1 };
  }

  function questionIsApplicable(question, draft) {
    if (config.mode === "test" && config.test.showAllConditionalQuestions) return true;
    return matchesCondition(question.when, draft);
  }

  function matchesCondition(condition, draft) {
    if (!condition) return true;
    const profile = draft?.routeProfile || {};
    const answers = draft?.answers || {};
    if (condition.all && !condition.all.every((item) => matchesCondition(item, draft))) return false;
    if (condition.any && !condition.any.some((item) => matchesCondition(item, draft))) return false;
    if (condition.viewerStatusIn && !condition.viewerStatusIn.includes(profile.viewer_status)) return false;
    if (
      condition.viewerStatusNotIn
      && (!hasValue(profile.viewer_status) || condition.viewerStatusNotIn.includes(profile.viewer_status))
    ) return false;
    if (condition.childrenRoleIn && !condition.childrenRoleIn.includes(profile.children_role)) return false;
    if (
      condition.hasAnyMethod
      && !condition.hasAnyMethod.some((value) => (profile.viewing_methods || []).includes(value))
    ) return false;
    if (condition.answerIn && !condition.answerIn.values.includes(answers[condition.answerIn.id])) return false;
    if (condition.answerNotIn && condition.answerNotIn.values.includes(answers[condition.answerNotIn.id])) return false;
    return true;
  }

  function hasValue(value) {
    if (Array.isArray(value)) return value.length > 0;
    if (value && typeof value === "object") {
      return Object.values(value).some(
        (item) => item !== "" && item !== undefined && item !== null
      );
    }
    return value !== "" && value !== undefined && value !== null;
  }

  function reducedMotion() {
    return Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
  }
})();
