(() => {
  if (new URLSearchParams(window.location.search).get("motion") === "static") return;

  const plate = document.querySelector(".home-research-plate");
  if (!plate) return;

  const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
  const signal = plate.querySelector("[data-plate-signal]");
  const readout = plate.querySelector("[data-plate-readout]");
  const point = plate.querySelector("[data-plate-point]");
  const signalLength = signal?.getTotalLength();
  let frame = 0;
  let lastProgress = "";

  const update = () => {
    frame = 0;
    const { top, height } = plate.getBoundingClientRect();
    const viewport = window.innerHeight;
    const middle = top + height / 2;
    const progress = Math.max(0, Math.min(1, (viewport * 0.9 - middle) / (viewport * 0.82)));
    const value = progress.toFixed(4);

    if (value !== lastProgress) {
      plate.style.setProperty("--plate-progress", value);
      if (signalLength && readout && point) {
        const position = signal.getPointAtLength(progress * signalLength);
        readout.setAttribute("transform", `translate(${position.x.toFixed(2)} 0)`);
        point.setAttribute("cy", position.y.toFixed(2));
      }
      lastProgress = value;
    }
    if (!plate.hasAttribute("data-scroll-motion")) plate.setAttribute("data-scroll-motion", "");
  };

  const schedule = () => {
    if (motion.matches && !frame) frame = window.requestAnimationFrame(update);
  };

  const syncPreference = () => {
    if (motion.matches) schedule();
    else {
      window.cancelAnimationFrame(frame);
      frame = 0;
      plate.removeAttribute("data-scroll-motion");
    }
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  motion.addEventListener?.("change", syncPreference);
  syncPreference();
})();
