(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const setupLoop = (demo, duration, paint) => {
    if (typeof IntersectionObserver !== "function") return;

    const button = demo.querySelector("[data-demo-pause]");
    const name = demo.getAttribute("aria-label");
    const visiblePortion = 0.65;
    let inView = false;
    let paused = false;
    let frame = 0;
    let elapsed = 0;
    let lastTime;

    const tick = now => {
      elapsed = (elapsed + now - (lastTime ?? now)) % duration;
      lastTime = now;
      paint(elapsed);
      frame = requestAnimationFrame(tick);
    };

    const syncPlayback = () => {
      const playing = inView && !paused && !document.hidden && !reduceMotion.matches;
      demo.toggleAttribute("data-animating", playing);
      if (playing) {
        if (!frame) frame = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(frame);
        frame = 0;
        lastTime = undefined;
      }
    };

    button.addEventListener("click", () => {
      paused = demo.toggleAttribute("data-paused");
      button.setAttribute("aria-label", `${paused ? "Resume" : "Pause"} ${name}`);
      syncPlayback();
    });

    const syncMotionPreference = () => {
      button.hidden = reduceMotion.matches;
      if (reduceMotion.matches) {
        elapsed = 0;
        paint(null);
      }
      syncPlayback();
    };

    const observer = new IntersectionObserver(entries => {
      inView = entries[entries.length - 1].intersectionRatio >= visiblePortion;
      syncPlayback();
    }, { threshold: visiblePortion });
    observer.observe(demo);
    document.addEventListener("visibilitychange", syncPlayback);
    reduceMotion.addEventListener("change", syncMotionPreference);
    syncMotionPreference();
  };

  const setupEarinter = demo => {
    const caption = demo.querySelector("[data-demo-caption]");
    const clip = demo.querySelector("[data-earinter-trace-window]");
    const playhead = demo.querySelector("[data-earinter-playhead]");
    const traceWidth = Number(clip.getAttribute("width"));
    const summary = caption.textContent;
    const stages = {
      fast: "Fast eating detected",
      cue: 'Earbud: "More chewing."',
      slower: "Diner slows; earbud quiet"
    };
    const drawingDuration = 4700;

    setupLoop(demo, drawingDuration + 1350, elapsed => {
      const fraction = elapsed === null ? 1 : Math.min(elapsed / drawingDuration, 1);
      const phase = fraction < 0.36 ? "fast" : fraction < 0.65 ? "cue" : fraction < 1 ? "slower" : undefined;
      if (phase || demo.dataset.phase) {
        const x = (fraction * traceWidth).toFixed(1);
        clip.setAttribute("width", x);
        playhead.setAttribute("transform", `translate(${x} 0)`);
      }
      if (demo.dataset.phase === phase) return;

      if (phase) demo.dataset.phase = phase;
      else delete demo.dataset.phase;
      caption.textContent = stages[phase] ?? summary;
    });
  };

  const setupScenes = (demo, scenes, sceneDuration, showScene) => {
    let currentScene = -1;
    setupLoop(demo, sceneDuration * scenes.length, elapsed => {
      const index = elapsed === null ? -1 : Math.floor(elapsed / sceneDuration);
      if (currentScene === index) return;
      currentScene = index;
      showScene(scenes[index]);
    });
  };

  const setupIngestionLoop = demo => {
    const caption = demo.querySelector("[data-demo-caption]");
    const summary = caption.textContent;
    const rail = demo.querySelector(".loop-demo__rail");
    const trail = rail.querySelector("[data-loop-trail]");
    const arrow = rail.querySelector("[data-loop-runner]");
    const viewBox = rail.viewBox.baseVal;
    const sceneDuration = 2175;
    const travelDuration = 1900;
    const scenes = [
      ["behavior", "Choose a target behavior, such as meal timing."],
      ["sense", "Capture signals about behavior and context."],
      ["reason", "Interpret those signals to estimate what is happening."],
      ["feedback", "Intervene, then sense again to close the loop."]
    ].map(([name, copy]) => {
      const path = rail.querySelector(`[data-loop-leg="${name}"]`);
      return { name, copy, path, length: path.getTotalLength() };
    });
    let pixelX = 1;
    let pixelY = 1;
    let arrowScale = 0.75;
    let lastElapsed = null;

    const paint = elapsed => {
      lastElapsed = elapsed;
      if (elapsed === null) {
        delete demo.dataset.scene;
        trail.removeAttribute("d");
        caption.textContent = summary;
        return;
      }

      const { name, copy, path, length } = scenes[Math.floor(elapsed / sceneDuration)];
      if (demo.dataset.scene !== name) {
        demo.dataset.scene = name;
        caption.textContent = copy;
      }

      const progress = Math.min((elapsed % sceneDuration) / travelDuration, 1);
      const distance = length * progress;
      const head = path.getPointAtLength(distance);
      const before = path.getPointAtLength(Math.max(0, distance - 1));
      const after = path.getPointAtLength(Math.min(length, distance + 1));
      const angle = Math.atan2((after.y - before.y) * pixelY, (after.x - before.x) * pixelX) * 180 / Math.PI;
      arrow.setAttribute("transform", `translate(${head.x} ${head.y}) scale(${arrowScale / pixelX} ${arrowScale / pixelY}) rotate(${angle}) translate(-12 -12)`);

      // Follow the same geometry as the arrow so the tail stays attached on bends.
      const start = Math.max(0, distance - 32);
      const points = Array.from({ length: 9 }, (_, i) => {
        const point = path.getPointAtLength(start + (distance - start) * i / 8);
        return `${point.x} ${point.y}`;
      });
      trail.setAttribute("d", `M${points.join("L")}`);
    };

    const syncSize = () => {
      const { width, height } = rail.getBoundingClientRect();
      if (!width || !height) return;
      pixelX = width / viewBox.width;
      pixelY = height / viewBox.height;
      arrowScale = 1.2 * parseFloat(getComputedStyle(document.documentElement).fontSize) / 24;
      if (lastElapsed !== null) paint(lastElapsed);
    };

    syncSize();
    if (typeof ResizeObserver === "function") new ResizeObserver(syncSize).observe(rail);
    else window.addEventListener("resize", syncSize);
    setupLoop(demo, sceneDuration * scenes.length, paint);
  };

  const setupMealCapture = demo => {
    const technique = demo.querySelector("[data-meal-technique]");
    const description = demo.querySelector("[data-meal-description]");
    const summary = description.textContent;
    const scenes = [
      ["reminder", "Prompts/cues", "Cue the routine: take a photo before the first bite."],
      ["success", "Focus on past success", "Revisit a successful capture as the routine takes shape."],
      ["support", "Social support", "Share a meal photo when you want support for the routine."]
    ];
    setupScenes(demo, scenes, 2900, scene => {
      const [name, label, copy] = scene ?? ["reminder", "", summary];
      demo.dataset.scene = name;
      technique.hidden = !label;
      technique.textContent = label;
      description.textContent = copy;
    });
  };

  const setupStoryEcho = demo => {
    const index = demo.querySelector("[data-story-index]");
    const kicker = demo.querySelector("[data-story-kicker]");
    const copy = demo.querySelector("[data-story-copy]");
    const controls = demo.querySelectorAll("[data-story-controls]");
    const scenes = {
      intro: [1, "Before the meal", copy.textContent],
      meal: [2, "After the meal", "The child and caregiver log the encounter."],
      touch: [3, "In the next chapter", "The explorer runs a finger over the carrot's ridges."],
      smell: [3, "In the next chapter", "The explorer follows the carrot's earthy scent."]
    };

    demo.querySelectorAll("[data-story-action]").forEach(button => {
      button.disabled = false;
      button.addEventListener("click", () => {
        const name = button.dataset.storyAction;
        const [step, title, text] = scenes[name];
        demo.dataset.scene = name;
        index.textContent = `0${step} / 03`;
        kicker.textContent = title;
        copy.textContent = text;
        const nextControls = step === 3 ? "ending" : name;
        controls.forEach(group => {
          group.hidden = group.dataset.storyControls !== nextControls;
        });
        demo.querySelector(`[data-story-controls="${nextControls}"] button`).focus({ preventScroll: true });
      });
    });
  };

  const setupLaughAnchor = demo => {
    const button = demo.querySelector("[data-laugh-context]");
    const when = demo.querySelector("[data-laugh-when]");
    const kicker = demo.querySelector("[data-laugh-kicker]");
    const copy = demo.querySelector("[data-laugh-copy]");
    const options = demo.querySelectorAll("[data-laugh-view]");
    const later = [kicker.textContent, copy.textContent];
    const recent = ["Cues shown together", "The photo helps distinguish this from other recent moments."];
    const note = ["My note", '"We laughed at our wrong turn. I liked the detour."'];

    const render = () => {
      const isRecent = demo.dataset.view === "recent";
      const open = demo.hasAttribute("data-context");
      const [title, text] = open ? note : isRecent ? recent : later;
      when.textContent = isRecent ? "Recent review" : "Later review";
      kicker.textContent = title;
      copy.textContent = text;
      button.textContent = isRecent ? (open ? "Hide note" : "Read note") : (open ? "Hide photo & note" : "Reveal photo & note");
      button.setAttribute("aria-expanded", String(open));
    };

    button.disabled = false;
    button.addEventListener("click", () => {
      demo.toggleAttribute("data-context");
      render();
    });
    options.forEach(option => {
      option.disabled = false;
      option.addEventListener("click", () => {
        const view = option.dataset.laughView;
        if (demo.dataset.view === view) return;
        demo.dataset.view = view;
        demo.removeAttribute("data-context");
        options.forEach(item => item.setAttribute("aria-pressed", String(item === option)));
        render();
      });
    });
  };

  document.querySelectorAll("[data-earinter-demo]").forEach(setupEarinter);
  document.querySelectorAll("[data-loop-demo]").forEach(setupIngestionLoop);
  document.querySelectorAll("[data-meal-demo]").forEach(setupMealCapture);
  document.querySelectorAll("[data-story-demo]").forEach(setupStoryEcho);
  document.querySelectorAll("[data-laugh-demo]").forEach(setupLaughAnchor);
})();
