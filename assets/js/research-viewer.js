(() => {
  const viewer = document.querySelector("[data-research-viewer]");
  const research = viewer?.closest("[data-research-tabs]");
  if (!research || typeof viewer.showModal !== "function") return;

  const title = viewer.querySelector("[data-viewer-title]");
  const original = viewer.querySelector("[data-viewer-original]");
  const status = viewer.querySelector("[data-viewer-status]");
  const media = viewer.querySelector("[data-viewer-media]");
  let opener;
  let scrollPosition;
  let pressedBackdrop = false;

  const setStatus = message => {
    status.textContent = message;
    status.hidden = !message;
  };

  const showFigure = link => {
    const thumbnail = link.querySelector("img");
    const fullSize = new Image();
    fullSize.alt = thumbnail?.alt || "";
    fullSize.decoding = "async";
    let pending = fullSize;

    // Reuse the visible thumbnail while the original figure loads.
    if (thumbnail?.complete && thumbnail.naturalWidth && thumbnail.currentSrc !== link.href) {
      pending = new Image();
      pending.alt = fullSize.alt;
      pending.src = thumbnail.currentSrc;
    } else {
      fullSize.hidden = true;
      setStatus("Loading figure...");
    }
    media.replaceChildren(pending);

    fullSize.addEventListener("load", () => {
      if (media.firstElementChild !== pending) return;
      fullSize.hidden = false;
      media.replaceChildren(fullSize);
      setStatus("");
    }, { once: true });
    fullSize.addEventListener("error", () => {
      if (media.firstElementChild === pending) setStatus("The full-size figure could not load. Try opening the original.");
    }, { once: true });
    fullSize.src = link.href;
  };

  const showVideo = link => {
    const video = document.createElement("video");
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    if (link.dataset.previewPoster) video.poster = link.dataset.previewPoster;

    if (link.dataset.previewCaptions) {
      const captions = document.createElement("track");
      captions.kind = "captions";
      captions.srclang = "en";
      captions.label = "English";
      captions.src = link.dataset.previewCaptions;
      video.append(captions);
    }

    video.addEventListener("error", () => {
      if (media.firstElementChild === video) setStatus("The video could not load here. Try opening the original.");
    }, { once: true });
    video.src = link.href;
    media.replaceChildren(video);
  };

  research.querySelectorAll("[data-research-preview]").forEach(link => {
    link.setAttribute("aria-haspopup", "dialog");
  });

  research.addEventListener("click", event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest("a[data-research-preview]");
    if (!link) return;
    event.preventDefault();
    if (opener) return;

    opener = link;
    scrollPosition = window.scrollY;
    const kind = link.dataset.researchPreview;
    const project = link.closest(".home-research-paper")?.querySelector("h4")?.textContent.trim();
    title.textContent = project || (kind === "video" ? "Project video" : "Project figure");
    original.href = link.href;
    setStatus("");
    viewer.showModal();
    document.documentElement.classList.add("research-viewer-open");
    if (kind === "video") showVideo(link);
    else showFigure(link);
  });

  viewer.addEventListener("pointerdown", event => {
    pressedBackdrop = event.target === viewer;
  });
  viewer.addEventListener("click", event => {
    if (pressedBackdrop && event.target === viewer) viewer.close();
    pressedBackdrop = false;
  });
  viewer.addEventListener("close", () => {
    const video = media.querySelector("video");
    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
    media.replaceChildren();
    setStatus("");
    document.documentElement.classList.remove("research-viewer-open");
    if (window.scrollY !== scrollPosition) window.scrollTo(0, scrollPosition);
    opener?.focus({ preventScroll: true });
    opener = null;
  });
})();
