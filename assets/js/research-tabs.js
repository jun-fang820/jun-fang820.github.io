(() => {
  const research = document.querySelector("[data-research-tabs]");
  const tabList = research?.querySelector("[data-research-tablist]");
  if (!tabList) return;

  const tabs = Array.from(tabList.querySelectorAll("a"));
  const panels = tabs.map(tab => document.getElementById(tab.hash.slice(1)));
  if (!tabs.length || panels.some(panel => !panel)) return;

  const activate = index => {
    tabs.forEach((tab, position) => {
      const active = position === index;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[position].hidden = !active;
    });
  };

  const select = index => {
    activate(index);
    const hash = tabs[index].hash;
    // Update the shareable URL without jumping away from the tabs.
    if (window.location.hash !== hash) window.history.pushState(null, "", hash);
  };

  const syncFromUrl = () => {
    const index = tabs.findIndex(tab => tab.hash === window.location.hash);
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
