/* ============================================================================
   GDG UVCE Web Development Workshop — Neo-Brutalist Intro Animation V2
   Orchestrated via GSAP 3.15.0 (Local Library)
   
   V2 Choreography:
   Scene 1: Boot / Code Primitives (0.0s – 0.95s)
            DrawSVG stroke reveals, responsive brackets, monospace construction.
   Scene 2: Google Geometry Assembly (0.85s – 2.0s)
            Chromatic order (Blue → Green → Yellow → Red), anticipation curves,
            tactile snap with micro-settle.
   Scene 3: Sticker Moment — HERO of the Intro (1.85s – 3.1s)
            Geometry pauses, assembly sticker drops with overshoot,
            physical impact recoil ripple on surrounding shapes.
   Scene 4: Real Transformation into Logo (3.05s – 4.05s)
            Tiered convergence: outer line-art → braces → color blocks → stickers
            → 70ms micro-pause → logo card lands with confident tactile snap.
   Scene 5: Identity & Monospace Text (4.1s – 4.75s)
            Connected to logo: badge opens, ScrambleText deciphers, subline resolves.
   Scene 6: Elegant Hero Handoff (4.85s – 5.5s)
            Coordinate-accurate getBoundingClientRect() interpolation,
            dissolve into hero section, clean DOM teardown.
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
      duration: 0.38,
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

  // Accessibility guard: immediately bypass intro if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion || typeof gsap === "undefined") {
    finishIntro(true);
    return;
  }

  // Lock body scroll during intro execution
  document.body.style.overflow = "hidden";
  window.addEventListener("keydown", onKeydown);
  if (skipBtn) {
    skipBtn.addEventListener("click", function () {
      finishIntro(false);
    });
  }

  // Register available local GSAP plugins
  if (typeof DrawSVGPlugin !== "undefined") gsap.registerPlugin(DrawSVGPlugin);
  if (typeof ScrambleTextPlugin !== "undefined") gsap.registerPlugin(ScrambleTextPlugin);
  if (typeof CustomEase !== "undefined") {
    gsap.registerPlugin(CustomEase);
    try {
      // Custom neo-brutalist tactile snap curve: fast acceleration, crisp 15% overshoot, solid lock
      CustomEase.create("neoSnap", "M0,0 C0.14,0.9 0.24,1.15 1,1");
    } catch (e) {
      // fallback handled gracefully
    }
  }
  if (typeof CustomBounce !== "undefined") {
    gsap.registerPlugin(CustomBounce);
    try {
      CustomBounce.create("stickerImpact", { strength: 0.5, squash: 1 });
    } catch (e) {
      // fallback handled gracefully
    }
  }
  if (typeof MotionPathPlugin !== "undefined") gsap.registerPlugin(MotionPathPlugin);

  // Scoped animation context for bulletproof cleanup
  ctx = gsap.context(function () {
    const snapEase = gsap.parseEase("neoSnap") || "back.out(1.8)";
    const popEase = "back.out(2.2)";

    tl = gsap.timeline({
      onComplete: function () {
        finishIntro(false);
      }
    });
    window.__introTL = tl;

    // Semantic scene labels
    tl.addLabel("boot", 0)
      .addLabel("assembly", 0.85)
      .addLabel("sticker", 1.85)
      .addLabel("collapse", 3.05)
      .addLabel("identity", 4.1)
      .addLabel("handoff", 4.85);

    /* -------------------------------------------------------------------------
       INITIAL ELEMENT STATES
       ------------------------------------------------------------------------- */
    gsap.set(".intro-boot-line", { opacity: 0, y: -10 });
    gsap.set(".intro-svg", { opacity: 0, scale: 0.7 });
    gsap.set(".intro-geom", { opacity: 0, scale: 0 });
    gsap.set("#intro-sticker-assembly", { opacity: 0, scale: 0 });
    gsap.set("#intro-sticker-brackets", { opacity: 0, scale: 0 });
    gsap.set("#intro-logo-card", { opacity: 0, scale: 0 });
    gsap.set("#intro-identity", { opacity: 0, y: 12 });

    /* -------------------------------------------------------------------------
       SCENE 1: BOOT / CODE PRIMITIVES (0.0s – 0.95s)
       ------------------------------------------------------------------------- */
    // Double slash operator draws into existence first
    tl.to("#intro-svg-slash", { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)" }, "boot+=0.04");

    // Monospace boot lines construct themselves
    tl.to(".intro-boot-line--1", { opacity: 1, y: 0, duration: 0.28, ease: "power2.out" }, "boot+=0.08");

    // Wireframe globe draws its longitude/latitude lines
    tl.to("#intro-svg-globe", { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" }, "boot+=0.12");
    if (typeof DrawSVGPlugin !== "undefined") {
      tl.fromTo("#intro-svg-globe ellipse, #intro-svg-globe line", 
        { drawSVG: "0%" }, 
        { drawSVG: "100%", duration: 0.65, stagger: 0.06, ease: "power2.inOut" }, 
        "boot+=0.12"
      );
    }

    // Code braces snap in, enclosing the construction area
    tl.to(["#intro-svg-brace-left", "#intro-svg-brace-right"], { 
      opacity: 1, scale: 1, duration: 0.42, ease: "back.out(1.8)" 
    }, "boot+=0.2");
    if (typeof DrawSVGPlugin !== "undefined") {
      tl.fromTo(["#intro-svg-brace-left path", "#intro-svg-brace-right path"], 
        { drawSVG: "0%" }, 
        { drawSVG: "100%", duration: 0.45, ease: "power2.out" }, 
        "boot+=0.2"
      );
    }

    // Core chapter tag resolves in monospace
    tl.to(".intro-boot-line--2", { opacity: 1, y: 0, duration: 0.32, ease: snapEase }, "boot+=0.24");

    // Asterisk operator draws with a slight spring
    tl.to("#intro-svg-asterisk", { opacity: 1, scale: 1, duration: 0.38, ease: "back.out(2.2)" }, "boot+=0.3");
    if (typeof DrawSVGPlugin !== "undefined") {
      tl.fromTo("#intro-svg-asterisk line", 
        { drawSVG: "0%" }, 
        { drawSVG: "100%", duration: 0.4, stagger: 0.04, ease: "power2.out" }, 
        "boot+=0.3"
      );
    }

    // Line 3 status
    tl.to(".intro-boot-line--3", { opacity: 1, y: 0, duration: 0.24, ease: "power2.out" }, "boot+=0.36");

    // Globe subtle continuous rotational drift
    tl.to("#intro-svg-globe", { rotation: 18, duration: 1.2, ease: "sine.inOut" }, "boot+=0.2");

    /* -------------------------------------------------------------------------
       SCENE 2: GOOGLE GEOMETRY ASSEMBLY (0.85s – 2.0s)
       ------------------------------------------------------------------------- */
    // Boot text cleanly ascends and dissolves as geometry begins arriving
    tl.to("#intro-boot-text", { y: -18, opacity: 0, duration: 0.3, ease: "power2.in" }, "assembly");

    // 1. Core Blue Horizontal Pill (curves in from top-left)
    tl.fromTo(".intro-geom--blue-pill", 
      { x: -110, y: -70, rotation: -20, scale: 0.3, opacity: 0 }, 
      { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.52, ease: snapEase }, 
      "assembly+=0.04"
    );

    // 2. Core Green Vertical Pill (curves in from bottom-left)
    tl.fromTo(".intro-geom--green-pill", 
      { x: -90, y: 80, rotation: 15, scale: 0.3, opacity: 0 }, 
      { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.52, ease: snapEase }, 
      "assembly+=0.12"
    );

    // 3. Core Yellow Stadium (drops in with tactile bounce from bottom-right)
    tl.fromTo(".intro-geom--yellow-stadium", 
      { x: 100, y: 70, rotation: 16, scale: 0.3, opacity: 0 }, 
      { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.52, ease: snapEase }, 
      "assembly+=0.2"
    );

    // 4. Core Red L-Blob (locks the 4-quadrant frame on top-right)
    tl.fromTo(".intro-geom--red-blob", 
      { x: 90, y: -60, rotation: -16, scale: 0.3, opacity: 0 }, 
      { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.52, ease: snapEase }, 
      "assembly+=0.28"
    );

    // Supporting connector elements: arrow, window dots, arches
    tl.fromTo(".intro-geom--arrow", 
      { x: 50, scale: 0.4, opacity: 0 }, 
      { x: 0, scale: 1, opacity: 1, duration: 0.4, ease: snapEase }, 
      "assembly+=0.35"
    );
    tl.fromTo([".intro-geom--dots", ".intro-geom--arches"], 
      { scale: 0, opacity: 0 }, 
      { scale: 1, opacity: 1, stagger: 0.08, duration: 0.38, ease: snapEase }, 
      "assembly+=0.38"
    );

    // Subtle breathing settle as the final shapes complete their lock-in
    tl.to([".intro-geom--blue-pill", ".intro-geom--green-pill", ".intro-geom--yellow-stadium", ".intro-geom--red-blob"], {
      scale: 1,
      duration: 0.2,
      ease: "power2.out"
    }, "assembly+=0.68");

    /* -------------------------------------------------------------------------
       SCENE 3: STICKER MOMENT — HERO OF THE INTRO (1.85s – 3.05s)
       Fluid anticipation -> tactile entrance -> asymmetric elastic recoil
       ------------------------------------------------------------------------- */
    // Step 1: Fluid Anticipation — surrounding geometry smoothly cushions inward
    // continuously from 1.85s to 2.18s (zero dead freeze, continuous deceleration)
    tl.to(".intro-primitives", { 
      scale: 0.965, 
      duration: 0.33, 
      ease: "power2.out" 
    }, "sticker");

    // Step 2: GDG Assembly Sticker drops into center stage with crisp kinetic arrival
    tl.fromTo("#intro-sticker-assembly", 
      { scale: 0.28, rotation: -7, y: -26, opacity: 0 }, 
      { scale: 1, rotation: 0, y: 0, opacity: 1, duration: 0.58, ease: "back.out(2.2)" }, 
      "sticker+=0.06"
    );

    // Step 3: Physical Impact Recoil — triggered precisely when sticker makes contact (sticker+=0.33 = 2.18s)
    // Parent container elastically rebounds back to rest
    tl.to(".intro-primitives", { 
      scale: 1, 
      duration: 0.34, 
      ease: "power2.out" 
    }, "sticker+=0.33");

    // 4 Quadrant Shapes: Asymmetric impulse response (punchy 110ms outward blast + 260ms smooth elastic return)
    // Blue Pill (Top-Left)
    tl.to(".intro-geom--blue-pill", { x: -8, y: -6, duration: 0.11, ease: "power2.out" }, "sticker+=0.33");
    tl.to(".intro-geom--blue-pill", { x: 0, y: 0, duration: 0.26, ease: "power2.inOut" }, "sticker+=0.44");

    // Yellow Stadium (Bottom-Right)
    tl.to(".intro-geom--yellow-stadium", { x: 8, y: 7, duration: 0.11, ease: "power2.out" }, "sticker+=0.33");
    tl.to(".intro-geom--yellow-stadium", { x: 0, y: 0, duration: 0.26, ease: "power2.inOut" }, "sticker+=0.44");

    // Green Pill (Bottom-Left)
    tl.to(".intro-geom--green-pill", { x: -7, y: 7, duration: 0.11, ease: "power2.out" }, "sticker+=0.33");
    tl.to(".intro-geom--green-pill", { x: 0, y: 0, duration: 0.26, ease: "power2.inOut" }, "sticker+=0.44");

    // Red Blob (Top-Right)
    tl.to(".intro-geom--red-blob", { x: 8, y: -6, duration: 0.11, ease: "power2.out" }, "sticker+=0.33");
    tl.to(".intro-geom--red-blob", { x: 0, y: 0, duration: 0.26, ease: "power2.inOut" }, "sticker+=0.44");

    // Step 4: Bracket sticker joins composition on lower-right
    tl.fromTo("#intro-sticker-brackets", 
      { scale: 0.22, rotation: 10, opacity: 0 }, 
      { scale: 1, rotation: 0, opacity: 1, duration: 0.46, ease: "back.out(1.8)" }, 
      "sticker+=0.26"
    );

    /* -------------------------------------------------------------------------
       SCENE 4: REAL TRANSFORMATION INTO THE LOGO (3.05s – 4.05s)
       Tiered convergence rather than simultaneous collapse
       ------------------------------------------------------------------------- */
    // Tier 1: Outer line-art primitives (globe, slash, asterisk, arches, dots) glide inward
    tl.to(["#intro-svg-globe", "#intro-svg-slash", "#intro-svg-asterisk", ".intro-geom--dots", ".intro-geom--arches"], {
      scale: 0.2,
      opacity: 0,
      duration: 0.36,
      ease: "power2.in"
    }, "collapse");

    // Tier 2: Braces and arrow rotate inward toward center
    tl.to("#intro-svg-brace-left", { x: 45, rotation: 12, scale: 0.25, opacity: 0, duration: 0.34, ease: "power2.in" }, "collapse+=0.1");
    tl.to("#intro-svg-brace-right", { x: -45, rotation: -12, scale: 0.25, opacity: 0, duration: 0.34, ease: "power2.in" }, "collapse+=0.1");
    tl.to(".intro-geom--arrow", { y: -25, scale: 0.2, opacity: 0, duration: 0.3, ease: "power2.in" }, "collapse+=0.1");

    // Tier 3: 4 Google color blocks converge together toward the central anchor point
    tl.to([".intro-geom--blue-pill", ".intro-geom--yellow-stadium", ".intro-geom--green-pill", ".intro-geom--red-blob"], {
      x: 0,
      y: 0,
      scale: 0.25,
      opacity: 0,
      stagger: 0.02,
      duration: 0.32,
      ease: "power3.in"
    }, "collapse+=0.18");

    // Tier 4: Sticker containers condense into center core
    tl.to(["#intro-sticker-brackets", "#intro-sticker-assembly"], {
      scale: 0.2,
      opacity: 0,
      duration: 0.28,
      ease: "power3.in"
    }, "collapse+=0.3");

    // Tier 5: 70ms Micro-pause (Visual silence right before logo landing)

    // Tier 6: Official GDG Logo Card lands firmly with confident tactile snap
    tl.fromTo("#intro-logo-card", 
      { scale: 0.2, rotation: -10, y: -20, opacity: 0 }, 
      { scale: 1, rotation: 0, y: 0, opacity: 1, duration: 0.52, ease: "back.out(2.4)" }, 
      "collapse+=0.65"
    );

    // Micro-settle on logo image
    tl.fromTo("#intro-logo-img", 
      { scale: 0.92 }, 
      { scale: 1, duration: 0.22, ease: "power2.out" }, 
      "collapse+=0.75"
    );

    /* -------------------------------------------------------------------------
       SCENE 5: IDENTITY & MONOSPACE TEXT (4.1s – 4.75s)
       ------------------------------------------------------------------------- */
    // Identity container enters immediately following logo settle
    tl.fromTo("#intro-identity", 
      { opacity: 0, y: 12 }, 
      { opacity: 1, y: 0, duration: 0.28, ease: "power2.out" }, 
      "identity"
    );

    // Chapter badge deciphers with ScrambleTextPlugin
    if (typeof ScrambleTextPlugin !== "undefined") {
      tl.to("#intro-identity-badge", {
        scrambleText: {
          text: "[ GDG ON CAMPUS · UVCE ]",
          chars: "{}/<>_10*#",
          speed: 0.32
        },
        duration: 0.55
      }, "identity+=0.04");
    }

    // Subtitle resolves with clean slide-up
    tl.fromTo("#intro-identity-sub", 
      { opacity: 0, y: 6 }, 
      { opacity: 1, y: 0, duration: 0.26, ease: "power2.out" }, 
      "identity+=0.22"
    );

    /* -------------------------------------------------------------------------
       SCENE 6: ELEGANT HERO HANDOFF (4.85s – 5.5s)
       ------------------------------------------------------------------------- */
    tl.add(function () {
      const heroLogoEl = document.querySelector(".hero-logo");
      const logoCard = document.getElementById("intro-logo-card");

      // Smoothly fade out intro-only text and header
      gsap.to(["#intro-identity", ".intro-header"], {
        opacity: 0,
        y: -8,
        duration: 0.32,
        ease: "power2.out"
      });

      if (heroLogoEl && logoCard) {
        // Measure real target coordinates dynamically
        const heroRect = heroLogoEl.getBoundingClientRect();
        const cardRect = logoCard.getBoundingClientRect();

        const dx = (heroRect.left + heroRect.width / 2) - (cardRect.left + cardRect.width / 2);
        const dy = (heroRect.top + heroRect.height / 2) - (cardRect.top + cardRect.height / 2);
        const targetScale = heroRect.width / cardRect.width;

        // Elegant curved interpolation to hero position
        gsap.to(logoCard, {
          x: dx,
          y: dy,
          scale: targetScale,
          borderRadius: "12px",
          padding: "2px",
          boxShadow: "2px 2px 0px #1E1E1E",
          duration: 0.62,
          ease: "power3.inOut"
        });
      }

      // Dissolve intro overlay into the hero section underneath
      gsap.to(introEl, {
        opacity: 0,
        duration: 0.44,
        delay: 0.18,
        ease: "power2.out",
        onComplete: function () {
          finishIntro(false);
        }
      });
    }, "handoff");

  }, introEl);

})();
