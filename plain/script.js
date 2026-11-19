/* =========================================================
   Cedi — portfolio interactions
   Vanilla ES6. No dependencies.
   ========================================================= */
(() => {
  "use strict";

  const doc = document;
  const root = doc.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  /* -------------------------------------------------------
     Header + fixed route line
     ------------------------------------------------------- */
  const header = doc.getElementById("site-header");
  const routeFill = doc.querySelector(".route-line span");

  function updateRoute() {
    if (!routeFill) return;
    const scrollable = root.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? clamp(window.scrollY / scrollable, 0, 1) : 0;
    routeFill.style.transform = `scaleY(${progress})`;
  }

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 18);
  }

  /* -------------------------------------------------------
     Scroll spy
     ------------------------------------------------------- */
  const navLinks = Array.from(doc.querySelectorAll(".nav-desktop a[href^='#']"));
  const spyTargets = navLinks
    .map((link) => {
      const id = link.getAttribute("href").slice(1);
      const el = doc.getElementById(id);
      return el ? { link, el } : null;
    })
    .filter(Boolean);

  function updateSpy() {
    if (!spyTargets.length) return;
    const line = window.scrollY + window.innerHeight * 0.34;
    let active = null;
    let activeTop = -Infinity;

    for (const target of spyTargets) {
      const top = target.el.getBoundingClientRect().top + window.scrollY;
      if (top <= line && top > activeTop) {
        active = target;
        activeTop = top;
      }
    }

    for (const target of spyTargets) {
      target.link.classList.toggle("is-active", target === active);
      if (target === active) target.link.setAttribute("aria-current", "true");
      else target.link.removeAttribute("aria-current");
    }
  }

  /* -------------------------------------------------------
     Mobile drawer
     ------------------------------------------------------- */
  const toggle = doc.querySelector(".nav-toggle");
  const drawer = doc.getElementById("mobile-menu");
  const drawerLinks = drawer ? Array.from(drawer.querySelectorAll("a")) : [];
  let menuOpen = false;

  function setMenu(open) {
    if (!toggle || !drawer) return;
    menuOpen = open;
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    drawer.hidden = !open;
    doc.body.classList.toggle("is-locked", open);

    if (open) {
      const first = drawer.querySelector("a");
      if (first) window.setTimeout(() => first.focus({ preventScroll: true }), 60);
    }
  }

  if (toggle && drawer) {
    toggle.addEventListener("click", () => setMenu(!menuOpen));

    drawerLinks.forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

    doc.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuOpen) {
        setMenu(false);
        toggle.focus({ preventScroll: true });
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 920 && menuOpen) setMenu(false);
    });
  }

  /* -------------------------------------------------------
     Reveal on scroll
     ------------------------------------------------------- */
  const revealItems = doc.querySelectorAll(".reveal");

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  /* -------------------------------------------------------
     Terminal typing
     ------------------------------------------------------- */
  const terminalScreen = doc.querySelector(".terminal-screen");
  const terminalWrap = terminalScreen ? terminalScreen.closest(".browser-wrap") : null;
  let terminalJobs = [];
  let terminalRun = 0;
  let terminalStarted = false;

  function readTerminalText(node) {
    let text = "";
    node.childNodes.forEach((child) => {
      text += child.nodeName === "BR" ? "\n" : child.textContent;
    });
    return text.trim();
  }

  if (terminalScreen) {
    terminalJobs = Array.from(terminalScreen.querySelectorAll(".terminal-block")).map((block) => {
      const command = block.querySelector(".terminal-command");
      const output = block.querySelector(".terminal-out");
      const commandText = command ? command.textContent.trim() : "";
      const outputText = output ? readTerminalText(output) : "";

      if (command) command.textContent = "";
      if (output) output.textContent = "";

      return { block, command, output, commandText, outputText };
    });
  }

  function fillTerminal() {
    if (!terminalScreen) return;
    terminalJobs.forEach((job) => {
      job.block.classList.add("is-visible");
      if (job.command) job.command.textContent = job.commandText;
      if (job.output) job.output.textContent = job.outputText;
    });
    terminalScreen.dataset.typing = "done";
  }

  function finishTerminal() {
    if (!terminalScreen) return;
    terminalStarted = true;
    terminalRun += 1;
    fillTerminal();
  }

  const terminalWait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

  async function typeTerminalText(element, text, run, speed) {
    for (let index = 1; index <= text.length; index += 1) {
      if (run !== terminalRun) return false;
      element.textContent = text.slice(0, index);
      const character = text[index - 1];
      const beat = /[.,/]/.test(character) ? 60 : 0;
      await terminalWait(speed + beat);
    }
    return run === terminalRun;
  }

  async function playTerminal() {
    if (!terminalScreen || terminalStarted) return;
    if (reduceMotion.matches) {
      finishTerminal();
      return;
    }

    terminalStarted = true;
    terminalRun += 1;
    const run = terminalRun;
    terminalScreen.dataset.typing = "active";
    await terminalWait(280);

    for (const job of terminalJobs) {
      if (run !== terminalRun) return;
      job.block.classList.add("is-visible");

      if (job.command) {
        const typed = await typeTerminalText(job.command, job.commandText, run, 45);
        if (!typed) return;
        await terminalWait(130);
      }

      if (job.output) {
        const typed = await typeTerminalText(job.output, job.outputText, run, 11);
        if (!typed) return;
        await terminalWait(210);
      } else {
        await terminalWait(180);
      }
    }

    if (run === terminalRun) terminalScreen.dataset.typing = "done";
  }

  if (terminalScreen && terminalJobs.length) {
    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      finishTerminal();
    } else {
      const terminalObserver = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          terminalObserver.disconnect();
          window.setTimeout(playTerminal, 260);
        },
        { threshold: 0.3 }
      );
      terminalObserver.observe(terminalWrap || terminalScreen);
    }
  }

  /* -------------------------------------------------------
     Hero mouse parallax
     ------------------------------------------------------- */
  const hero = doc.querySelector(".hero");
  const parallaxItems = hero ? Array.from(hero.querySelectorAll("[data-parallax-speed]")) : [];
  let parallaxFrame = 0;
  let parallaxEnabled = false;

  function queueParallax(event) {
    if (!hero || parallaxFrame) return;
    const rect = hero.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;

    parallaxFrame = window.requestAnimationFrame(() => {
      parallaxItems.forEach((item) => {
        const speed = Number(item.dataset.parallaxSpeed || 0);
        const y = clamp(ny * speed, -speed, speed).toFixed(2);
        item.style.setProperty("--p-y", `${y}px`);
      });
      parallaxFrame = 0;
    });
  }

  function resetParallax() {
    parallaxItems.forEach((item) => item.style.setProperty("--p-y", "0px"));
  }

  function setParallax() {
    const shouldEnable =
      window.innerWidth > 900 &&
      window.matchMedia("(pointer: fine)").matches &&
      !reduceMotion.matches;

    if (shouldEnable === parallaxEnabled) return;
    parallaxEnabled = shouldEnable;

    if (shouldEnable && hero) {
      hero.addEventListener("pointermove", queueParallax);
      hero.addEventListener("pointerleave", resetParallax);
    } else if (hero) {
      hero.removeEventListener("pointermove", queueParallax);
      hero.removeEventListener("pointerleave", resetParallax);
      resetParallax();
    }
  }

  setParallax();

  /* -------------------------------------------------------
     Sticky project reel
     ------------------------------------------------------- */
  const reel = doc.getElementById("showcase");
  const slides = reel ? Array.from(reel.querySelectorAll(".reel-slide")) : [];
  const dots = reel ? Array.from(reel.querySelectorAll(".reel-dots .dot")) : [];
  const captionIndex = doc.getElementById("reel-caption-index");
  const captionTitle = doc.getElementById("reel-caption-title");
  const captionTag = doc.getElementById("reel-caption-tag");
  const reelUrl = doc.getElementById("reel-url");
  const reelOpen = doc.getElementById("reel-open");
  const reelOpenLabel = doc.getElementById("reel-open-label");
  let currentSlide = -1;

  function setSlide(index) {
    if (!slides.length || index === currentSlide) return;
    currentSlide = index;
    const slide = slides[index];
    if (!slide) return;
    const total = String(slides.length).padStart(2, "0");
    const number = String(index + 1).padStart(2, "0");

    slides.forEach((item, i) => item.classList.toggle("is-active", i === index));
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
      if (i === index) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });

    if (captionIndex) captionIndex.textContent = `${number} / ${total}`;
    if (captionTitle) captionTitle.textContent = slide.dataset.title || "";
    if (captionTag) captionTag.textContent = slide.dataset.tag || "";
    if (reelUrl) reelUrl.textContent = slide.dataset.url || "";

    if (reelOpen) {
      const href = slide.dataset.href || "#";
      const external = /^https?:/i.test(href);
      reelOpen.href = href;
      reelOpen.target = external ? "_blank" : "_self";
      if (external) reelOpen.rel = "noreferrer noopener";
      else reelOpen.removeAttribute("rel");
      if (reelOpenLabel) reelOpenLabel.textContent = slide.dataset.linkLabel || "Open project";
    }
  }

  function updateReel() {
    if (!reel || !slides.length) return;
    const rect = reel.getBoundingClientRect();
    const travel = reel.offsetHeight - window.innerHeight;
    const progress = travel > 0 ? clamp(-rect.top / travel, 0, 1) : 0;
    const index = clamp(Math.floor(progress * slides.length), 0, slides.length - 1);
    setSlide(index);
  }

  function scrollToSlide(index) {
    if (!reel || !slides.length) return;
    const top = reel.getBoundingClientRect().top + window.scrollY;
    const travel = reel.offsetHeight - window.innerHeight;
    const target = top + ((index + 0.5) / slides.length) * travel;
    window.scrollTo({
      top: target,
      behavior: reduceMotion.matches ? "auto" : "smooth",
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => scrollToSlide(index));
  });

  if (reel && slides.length) {
    reel.style.setProperty("--reel-count", String(slides.length));
    setSlide(0);
  }

  /* -------------------------------------------------------
     Single scroll loop
     ------------------------------------------------------- */
  let scrollFrame = 0;

  function onScroll() {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => {
      updateHeader();
      updateRoute();
      updateSpy();
      updateReel();
      scrollFrame = 0;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    setParallax();
    onScroll();
  });
  window.addEventListener("load", onScroll);

  /* -------------------------------------------------------
     Copy page link + year
     ------------------------------------------------------- */
  const copyButton = doc.getElementById("copy-link");
  const copyLabel = doc.getElementById("copy-link-label");
  const copyStatus = doc.getElementById("copy-status");
  let copyTimer = 0;

  function announceCopy(message) {
    if (copyStatus) copyStatus.textContent = message;
    if (!copyLabel) return;
    copyLabel.textContent = message;
    window.clearTimeout(copyTimer);
    copyTimer = window.setTimeout(() => {
      copyLabel.textContent = "Copy page link";
    }, 2200);
  }

  async function copyPageLink() {
    const url = window.location.href;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const field = doc.createElement("textarea");
        field.value = url;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.top = "-1000px";
        doc.body.appendChild(field);
        field.select();
        const copied = doc.execCommand("copy");
        doc.body.removeChild(field);
        if (!copied) throw new Error("copy failed");
      }
      announceCopy("Link copied");
    } catch (error) {
      announceCopy("Copy failed — copy the URL bar");
    }
  }

  if (copyButton) copyButton.addEventListener("click", copyPageLink);

  const year = doc.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* -------------------------------------------------------
     Re-evaluate motion preferences
     ------------------------------------------------------- */
  const handleMotionChange = () => {
    setParallax();
    if (reduceMotion.matches) {
      revealItems.forEach((item) => item.classList.add("visible"));
      finishTerminal();
    }
    onScroll();
  };

  if (typeof reduceMotion.addEventListener === "function") {
    reduceMotion.addEventListener("change", handleMotionChange);
  } else if (typeof reduceMotion.addListener === "function") {
    reduceMotion.addListener(handleMotionChange);
  }

  resetParallax();
  onScroll();
})();
