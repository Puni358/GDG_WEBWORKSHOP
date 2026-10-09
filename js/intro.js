/* ============================================================================
   GDG UVCE Web Development Workshop — Neo-Brutalist Intro Animation
   Orchestrated via GSAP 3.15.0 (Local Library)
   
   Story:
   Scene 1: Boot / Code Primitives (0.0s – 0.9s)
   Scene 2: Google Geometry / Assembly (0.9s – 2.0s)
   Scene 3: Sticker / GDG Energy (1.9s – 3.1s)
   Scene 4: Collapse into GDG Logo (3.1s – 4.0s)
   Scene 5: Identity & Monospace Text (4.0s – 4.7s)
   Scene 6: Seamless Hero Handoff (4.7s – 5.4s)
   ============================================================================ */

(function () {
  "use strict";

  const introEl = document.getElementById("intro");
  const skipBtn = document.getElementById("skip-intro");

  if (!introEl) return;

  let isFinished = false;
  let tl = null;
  let ctx = null;

  function finishIntro(immediate) {
    if (isFinished) return;
    isFinished = true;

    if (tl) {
      tl.kill();
      tl = null;
    }

    window.removeEventListener("keydown", onKeydown);

    if (immediate) {
      introEl.style.display = "none";
      introEl.classList.add("hidden");
      document.body.style.overflow = "";
      if (ctx) {
        ctx.revert();
        ctx = null;
      }
      return;
    }

    gsap.to(introEl, {
      opacity: 0,
      duration: 0.45,
      ease: "power2.out",
      onComplete: function () {
        introEl.style.display = "none";
        introEl.classList.add("hidden");
        document.body.style.overflow = "";
        if (ctx) {
          ctx.revert();
          ctx = null;
        }
      }
    });
  }

  function onKeydown(e) {
    if (e.key === "Escape") {
      finishIntro(false);
    }
  }

  // Accessibility check for reduced motion
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion || typeof gsap === "undefined") {
    finishIntro(true);
    return;
  }

  // Lock body scroll during intro
  document.body.style.overflow = "hidden";
  window.addEventListener("keydown", onKeydown);
  if (skipBtn) {
    skipBtn.addEventListener("click", function () {
      finishIntro(false);
    });
  }

  // Register available local plugins
  if (typeof DrawSVGPlugin !== "undefined") gsap.registerPlugin(DrawSVGPlugin);
  if (typeof ScrambleTextPlugin !== "undefined") gsap.registerPlugin(ScrambleTextPlugin);
  if (typeof CustomEase !== "undefined") {
    gsap.registerPlugin(CustomEase);
    try {
      CustomEase.create("neoSnap", "M0,0 C0.12,0.85 0.22,1.2 1,1");
    } catch (e) {
      // fallback to built-in ease
    }
  }

  ctx = gsap.context(function () {
    const snapEase = gsap.parseEase("neoSnap") || "back.out(1.8)";
    const popEase = "back.out(2.2)";

    tl = gsap.timeline({
      onComplete: function () {
        finishIntro(false);
      }
    });

    // Label markers for clear declarative scene inspection
    tl.addLabel("boot", 0)
      .addLabel("assembly", 0.9)
      .addLabel("sticker", 1.9)
      .addLabel("collapse", 3.1)
      .addLabel("identity", 4.0)
      .addLabel("handoff", 4.75);

    /* -------------------------------------------------------------------------
       SCENE 1: BOOT / CODE PRIMITIVES (0.0s – 0.9s)
       ------------------------------------------------------------------------- */
    // Initial setups
    gsap.set(".intro-boot-line", { opacity: 0, y: -12 });
    gsap.set(".intro-geom", { opacity: 0, scale: 0 });
    gsap.set("#intro-sticker-assembly", { opacity: 0, scale: 0 });
    gsap.set("#intro-sticker-brackets", { opacity: 0, scale: 0 });
    gsap.set("#intro-logo-card", { opacity: 0, scale: 0 });
    gsap.set("#intro-identity", { opacity: 0, y: 12 });

    // Boot lines sequence
    tl.to(".intro-boot-line--1", { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }, "boot+=0.05")
      .to(".intro-boot-line--2", { opacity: 1, y: 0, duration: 0.3, ease: snapEase }, "boot+=0.15")
      .to(".intro-boot-line--3", { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }, "boot+=0.28");

    // Line-art vectors DrawSVG entrance
    if (typeof DrawSVGPlugin !== "undefined") {
      tl.fromTo("#intro-svg-globe ellipse, #intro-svg-globe line", 
        { drawSVG: "0%" }, 
        { drawSVG: "100%", duration: 0.65, stagger: 0.06, ease: "power2.inOut" }, 
        "boot+=0.1"
      );
      tl.fromTo("#intro-svg-asterisk line", 
        { drawSVG: "0%" }, 
        { drawSVG: "100%", duration: 0.45, stagger: 0.05, ease: "power2.out" }, 
        "boot+=0.2"
      );
      tl.fromTo("#intro-svg-brace-left path, #intro-svg-brace-right path", 
        { drawSVG: "0%" }, 
        { drawSVG: "100%", duration: 0.5, ease: "power2.out" }, 
        "boot+=0.25"
      );
    } else {
      tl.fromTo(["#intro-svg-globe", "#intro-svg-asterisk", "#intro-svg-brace-left", "#intro-svg-brace-right"], 
        { opacity: 0, scale: 0.5 }, 
        { opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: snapEase }, 
        "boot+=0.1"
      );
    }

    tl.fromTo("#intro-svg-slash polygon", 
      { scale: 0, transformOrigin: "center center" }, 
      { scale: 1, duration: 0.35, stagger: 0.08, ease: popEase }, 
      "boot+=0.35"
    );

    /* -------------------------------------------------------------------------
       SCENE 2: GOOGLE GEOMETRY / ASSEMBLY (0.9s – 2.0s)
       ------------------------------------------------------------------------- */
    // Fade out boot text cleanly
    tl.to("#intro-boot-text", { y: -22, opacity: 0, duration: 0.3, ease: "power2.in" }, "assembly");

    // Geometric color shapes fly in from different directions with tactile snap
    tl.fromTo(".intro-geom--blue-pill", 
      { x: -90, y: -60, rotation: -25, scale: 0, opacity: 0 }, 
      { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.5, ease: snapEase }, 
      "assembly+=0.05"
    );
    tl.fromTo(".intro-geom--yellow-stadium", 
      { x: 90, y: 60, rotation: 18, scale: 0, opacity: 0 }, 
      { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.5, ease: snapEase }, 
      "assembly+=0.15"
    );
    tl.fromTo(".intro-geom--green-pill", 
      { x: -70, y: 70, rotation: 15, scale: 0, opacity: 0 }, 
      { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.5, ease: snapEase }, 
      "assembly+=0.22"
    );
    tl.fromTo(".intro-geom--red-blob", 
      { x: 80, y: -50, rotation: -15, scale: 0, opacity: 0 }, 
      { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.5, ease: snapEase }, 
      "assembly+=0.28"
    );
    tl.fromTo([".intro-geom--arrow", ".intro-geom--dots", ".intro-geom--arches"], 
      { scale: 0, opacity: 0 }, 
      { scale: 1, opacity: 1, stagger: 0.08, duration: 0.4, ease: snapEase }, 
      "assembly+=0.35"
    );

    // Subtle rotation of globe
    tl.to("#intro-svg-globe", { rotation: 20, duration: 0.9, ease: "sine.inOut" }, "assembly+=0.1");

    /* -------------------------------------------------------------------------
       SCENE 3: STICKER / GDG ENERGY (1.9s – 3.1s)
       ------------------------------------------------------------------------- */
    tl.fromTo("#intro-sticker-assembly", 
      { scale: 0.35, rotation: -10, opacity: 0 }, 
      { scale: 1, rotation: 0, opacity: 1, duration: 0.6, ease: popEase }, 
      "sticker"
    );
    tl.fromTo("#intro-sticker-brackets", 
      { scale: 0.3, rotation: 12, opacity: 0 }, 
      { scale: 1, rotation: 0, opacity: 1, duration: 0.48, ease: snapEase }, 
      "sticker+=0.15"
    );

    // Dynamic sticker bounce and primitive reaction
    tl.to("#intro-primitives", { scale: 1.05, duration: 0.35, yoyo: true, repeat: 1, ease: "sine.inOut" }, "sticker+=0.3");

    /* -------------------------------------------------------------------------
       SCENE 4: COLLAPSE INTO GDG LOGO (3.1s – 4.0s)
       ------------------------------------------------------------------------- */
    // All scattered surrounding shapes collapse inward toward center
    tl.to([".intro-svg", ".intro-geom", ".intro-sticker"], {
      x: 0,
      y: 0,
      scale: 0.1,
      opacity: 0,
      duration: 0.42,
      stagger: 0.02,
      ease: "power3.in"
    }, "collapse");

    // The official GDG Main Logo lands firmly at center
    tl.fromTo("#intro-logo-card", 
      { scale: 0.15, rotation: -15, opacity: 0 }, 
      { scale: 1, rotation: 0, opacity: 1, duration: 0.55, ease: popEase }, 
      "collapse+=0.25"
    );

    // Tactile micro-pulse
    tl.to("#intro-logo-card", { scale: 1.04, duration: 0.12, yoyo: true, repeat: 1, ease: "power1.inOut" }, "collapse+=0.78");

    /* -------------------------------------------------------------------------
       SCENE 5: IDENTITY & MONOSPACE TEXT (4.0s – 4.7s)
       ------------------------------------------------------------------------- */
    tl.to("#intro-identity", { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, "identity");

    if (typeof ScrambleTextPlugin !== "undefined") {
      tl.to("#intro-identity-badge", {
        scrambleText: {
          text: "[ GDG ON CAMPUS · UVCE ]",
          chars: "{}/<>_10*#",
          speed: 0.35
        },
        duration: 0.6
      }, "identity+=0.05");
    }

    tl.fromTo("#intro-identity-sub", 
      { opacity: 0, y: 6 }, 
      { opacity: 1, y: 0, duration: 0.28, ease: "power2.out" }, 
      "identity+=0.25"
    );

    /* -------------------------------------------------------------------------
       SCENE 6: HERO HANDOFF (4.75s – 5.4s)
       ------------------------------------------------------------------------- */
    tl.add(function () {
      const heroLogoEl = document.querySelector(".hero-logo");
      const logoCard = document.getElementById("intro-logo-card");

      if (heroLogoEl && logoCard) {
        const heroRect = heroLogoEl.getBoundingClientRect();
        const cardRect = logoCard.getBoundingClientRect();

        const dx = (heroRect.left + heroRect.width / 2) - (cardRect.left + cardRect.width / 2);
        const dy = (heroRect.top + heroRect.height / 2) - (cardRect.top + cardRect.height / 2);
        const targetScale = heroRect.width / cardRect.width;

        gsap.to(logoCard, {
          x: dx,
          y: dy,
          scale: targetScale,
          borderRadius: "12px",
          padding: "2px",
          boxShadow: "2px 2px 0px #1E1E1E",
          duration: 0.6,
          ease: "power3.inOut"
        });
      }

      gsap.to(["#intro-identity", ".intro-header"], {
        opacity: 0,
        duration: 0.35,
        ease: "power2.out"
      });

      gsap.to(introEl, {
        opacity: 0,
        duration: 0.45,
        delay: 0.15,
        ease: "power2.out",
        onComplete: function () {
          finishIntro(false);
        }
      });
    }, "handoff");

  }, introEl);

})();
