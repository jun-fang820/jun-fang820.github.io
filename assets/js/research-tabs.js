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
