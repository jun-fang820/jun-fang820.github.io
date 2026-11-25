(() => {
  const research = document.querySelector("[data-research-tabs]");
  const tabList = research?.querySelector("[data-research-tablist]");
  const panelGroup = research?.querySelector("[data-research-panels]");
  if (!tabList || !panelGroup) return;

  const tabs = Array.from(tabList.querySelectorAll("a"));
  const panels = tabs.map(tab => document.getElementById(tab.hash.slice(1)));
  if (!tabs.length || panels.some(panel => !panel)) return;

  const artwork = new Map(Array.from(research.querySelectorAll("[data-research-art]"), layer => [
    layer.dataset.researchArt, layer
  ]));
  const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");

  const setupPaperTrack = panel => {
    const track = panel.querySelector("[data-research-paper-track]");
    const controls = panel.querySelector("[data-research-paper-controls]");
    if (!track || !controls || track.children.length < 2) return;

    const cards = Array.from(track.children);
    const previous = controls.querySelector("[data-research-paper-previous]");
    const next = controls.querySelector("[data-research-paper-next]");
    const count = controls.querySelector("[data-research-paper-count]");
    const pitch = () => cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left;
    let frame = 0;

    const update = () => {
      const width = track.clientWidth;
      if (!width) return;
      const end = track.scrollWidth - width;
      controls.hidden = end <= 1;
      if (controls.hidden) {
        track.removeAttribute("tabindex");
        return;
      }

      track.tabIndex = 0;
      const step = pitch();
      const first = Math.max(0, Math.round(track.scrollLeft / step)) + 1;
      const last = Math.min(cards.length, first + Math.max(1, Math.round(width / step)) - 1);
      count.textContent = `${first === last ? first : `${first}-${last}`} of ${cards.length}`;
      previous.setAttribute("aria-disabled", String(track.scrollLeft <= 1));
      next.setAttribute("aria-disabled", String(track.scrollLeft >= end - 1));
    };

    const move = (button, direction) => {
      if (button.getAttribute("aria-disabled") === "true") return;
      const step = pitch();
      track.scrollTo({
        left: (Math.round(track.scrollLeft / step) + direction) * step,
        behavior: motion.matches ? "smooth" : "auto"
      });
    };

    previous.addEventListener("click", () => move(previous, -1));
    next.addEventListener("click", () => move(next, 1));
    track.addEventListener("scroll", () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    }, { passive: true });
    if (typeof ResizeObserver === "function") new ResizeObserver(update).observe(track);
    else window.addEventListener("resize", update);

    return update;
  };

  const paperTracks = panels.map(setupPaperTrack);
  let activeIndex = -1;
  let heightTransition;
  const activate = index => {
    if (index === activeIndex) return;

    const animate = activeIndex !== -1 && motion.matches;
    const previousHeight = animate ? panelGroup.offsetHeight : 0;
    heightTransition?.cancel();

    tabs.forEach((tab, position) => {
      const active = position === index;
      const panel = panels[position];
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      artwork.get(panel.id)?.toggleAttribute("data-active", active);
      if (active && animate) {
        panel.dataset.entering = index < activeIndex ? "backward" : "forward";
      } else {
        delete panel.dataset.entering;
      }
      panel.hidden = !active;
    });
    activeIndex = index;
    paperTracks[index]?.();

    if (animate) {
      const nextHeight = panelGroup.offsetHeight;
      if (previousHeight !== nextHeight) {
        heightTransition = panelGroup.animate?.(
          [
            { height: `${previousHeight}px`, overflow: "hidden" },
            { height: `${nextHeight}px`, overflow: "hidden" }
          ],
          { duration: 260, easing: "ease-out" }
        );
      }
    }
  };

  const select = index => {
    activate(index);
    const hash = tabs[index].hash;
    // Update the shareable URL without jumping away from the tabs.
    if (window.location.hash !== hash) window.history.pushState(null, "", hash);
  };

  const syncFromUrl = () => {
    const target = document.getElementById(window.location.hash.slice(1));
    const index = panels.findIndex(panel => panel.contains(target));
    activate(index === -1 ? 0 : index);
  };

  tabList.setAttribute("role", "tablist");
  tabs.forEach((tab, index) => {
    const panel = panels[index];
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", panel.id);
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", tab.id);
    panel.tabIndex = 0;

    tab.addEventListener("click", event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      select(index);
    });

    tab.addEventListener("keydown", event => {
      let next = index;
      switch (event.key) {
        case "ArrowLeft":
          next = (index - 1 + tabs.length) % tabs.length;
          break;
        case "ArrowRight":
          next = (index + 1) % tabs.length;
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = tabs.length - 1;
          break;
        case " ":
          break;
        default:
          return;
      }
      event.preventDefault();
      select(next);
      tabs[next].focus({ preventScroll: true });
    });
  });

  window.addEventListener("popstate", syncFromUrl);
  window.addEventListener("hashchange", syncFromUrl);
  syncFromUrl();
})();
