(() => {
  const demo = document.querySelector("[data-earinter-demo]");
  if (!demo) return;

  const button = demo.querySelector("[data-earinter-replay]");
  const status = demo.querySelector("[data-earinter-status]");
  const clip = demo.querySelector("[data-earinter-trace-window]");
  const playhead = demo.querySelector("[data-earinter-playhead]");
  const traceWidth = Number(clip.getAttribute("width"));
  const summary = status.textContent;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const stages = {
    fast: "Fast eating detected",
    cue: 'Earbud: "More chewing."',
    slower: "Diner slows; earbud quiet"
  };
  let observer;
  let frame = 0;

  const showProgress = fraction => {
    const x = (fraction * traceWidth).toFixed(1);
    clip.setAttribute("width", x);
    playhead.setAttribute("transform", `translate(${x} 0)`);
  };

  const showSummary = () => {
    cancelAnimationFrame(frame);
    delete demo.dataset.phase;
    status.textContent = summary;
    showProgress(1);
  };

  const play = () => {
    if (reduceMotion.matches) return;
    observer?.disconnect();
    cancelAnimationFrame(frame);
    button.textContent = "Replay";
    demo.dataset.phase = "fast";
    status.textContent = stages.fast;
    showProgress(0);

    let start;
    const tick = now => {
      start ??= now;
      const fraction = Math.min((now - start) / 4700, 1);
      if (fraction === 1) {
        showSummary();
        return;
      }

      showProgress(fraction);
      const phase = fraction < 0.36 ? "fast" : fraction < 0.65 ? "cue" : "slower";
      if (demo.dataset.phase !== phase) {
        demo.dataset.phase = phase;
        status.textContent = stages[phase];
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
  };

  button.addEventListener("click", play);
  button.hidden = reduceMotion.matches;
  reduceMotion.addEventListener("change", () => {
    button.hidden = reduceMotion.matches;
    if (reduceMotion.matches) {
      observer?.disconnect();
      showSummary();
    }
  });

  if (!reduceMotion.matches && typeof IntersectionObserver === "function") {
    const visiblePortion = 0.65;
    observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.intersectionRatio >= visiblePortion)) play();
    }, { threshold: visiblePortion });
    observer.observe(demo);
  }
})();
