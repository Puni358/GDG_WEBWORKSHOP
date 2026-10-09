/* ============================================================================
   Intro animation.

   Sequence: a ring of butterflies glides in and settles into a circle
   (colored in a red -> yellow -> green -> blue sweep, echoing the logo's
   ring), taking roughly 4.8-5.3s. The instant the last butterfly lands, about
   40 jigsaw-piece shards of the real logo image fly in from the edges along
   curved paths and assemble into the logo inside the ring. A soft glow pulse
   plays once the logo is whole, a small caption fades in under it, then
   everything fades and the logo glides into its exact hero position for a
   seamless handoff.

   Butterflies are pre-rendered once as sprites (6 colors x 8 flap frames)
   onto offscreen canvases and reused everywhere with drawImage. Logo shards
   are likewise cut and rendered once onto their own offscreen canvases.
   ============================================================================ */
(function () {
  const introEl = document.getElementById("intro");
  const canvas = document.getElementById("intro-canvas");
  const skipBtn = document.getElementById("skip-intro");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function finishIntro() {
    introEl.classList.add("hidden");
    document.body.style.overflow = "";
    window.removeEventListener("keydown", onKeydown);
  }

  function onKeydown(e) {
    if (e.key === "Escape") finishIntro();
  }

  if (prefersReducedMotion || !canvas.getContext) {
    finishIntro();
    return;
  }

  document.body.style.overflow = "hidden";
  window.addEventListener("keydown", onKeydown);

  const ctx = canvas.getContext("2d");
  let W, H, DPR;

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth || document.documentElement.clientWidth || 375;
    H = window.innerHeight || document.documentElement.clientHeight || 667;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  /* ---------------------------- helpers ----------------------------------- */
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp01(v) { return Math.max(0, Math.min(1, v)); }
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  // Eases to 1 with a small overshoot just before settling — used for the
  // shard landing "snap".
  function easeOutBackSmall(t) {
    const c1 = 0.7;
    const c3 = c1 + 1;
    const tm = t - 1;
    return 1 + c3 * tm * tm * tm + c1 * tm * tm;
  }
  function quadPoint(x0, y0, cx, cy, x1, y1, t) {
    const mt = 1 - t;
    return [
      mt * mt * x0 + 2 * mt * t * cx + t * t * x1,
      mt * mt * y0 + 2 * mt * t * cy + t * t * y1,
    ];
  }
  function hexToRgb(hex) {
    const n = parseInt(hex.replace("#", ""), 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  function shadeColor(hex, factor) {
    const { r, g, b } = hexToRgb(hex);
    return `rgb(${Math.round(r * factor)},${Math.round(g * factor)},${Math.round(b * factor)})`;
  }
  function hexToRgba(hex, alpha) {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  /* ============================================================================
     BUTTERFLY SPRITES — unchanged design: petal-shaped wings (bulging outer
     edge, concave inner edge), gradient fill, scalloped margins, veins,
     eyespots, sheen, segmented body, antennae. Pre-rendered once per
     color x flap-frame and reused everywhere via drawImage.
     ============================================================================ */
  const VARIANTS = [
    { key: "red",       c1: "#ff9c92", c2: "#EA4335", edge: "#9c261c", spot: "#fff5e8" },
    { key: "redYellow", c1: "#ffba8a", c2: "#f2994a", edge: "#a85c1d", spot: "#fff1dc" },
    { key: "yellow",    c1: "#ffe79a", c2: "#FBBC05", edge: "#a97900", spot: "#3a2a00" },
    { key: "green",     c1: "#8de3ab", c2: "#34A853", edge: "#1c6b34", spot: "#eafff0" },
    { key: "blueGreen", c1: "#86e0d6", c2: "#2fa6a0", edge: "#17615c", spot: "#eafffc" },
    { key: "blue",      c1: "#9fc1ff", c2: "#4285F4", edge: "#1f4fa8", spot: "#eaf2ff" },
  ];
  const FRAMES = 8;
  const SPRITE_BASE = 140;

  // A wing is a petal: a bulging outer (leading) edge from the attach point
  // out to the tip, and a tucked-in, slightly concave inner (trailing) edge
  // back from the tip to the attach point. Sampling each edge as points lets
  // us add a scalloped ripple (tapered to zero at both ends) along the outer
  // edge only, which is where real wing margins scallop.
  function wingPoints(attachX, attachY, tipAngleDeg, length, spread, outerBulge, innerBulge, scallopAmp, scallopCount, samples, side) {
    const angle = (tipAngleDeg * Math.PI) / 180;
    const tipX = attachX + side * Math.cos(angle) * length;
    const tipY = attachY + Math.sin(angle) * length;

    const dx = tipX - attachX;
    const dy = tipY - attachY;
    const chordLen = Math.hypot(dx, dy) || 1;
    const nx = (-dy / chordLen) * spread;
    const ny = (dx / chordLen) * spread;

    const mx = (attachX + tipX) / 2;
    const my = (attachY + tipY) / 2;
    const outerCtrl = [mx + nx * outerBulge, my + ny * outerBulge];
    const innerCtrl = [mx + nx * innerBulge, my + ny * innerBulge];

    const outerPts = [];
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const p = quadPoint(attachX, attachY, outerCtrl[0], outerCtrl[1], tipX, tipY, t);
      const ripple = scallopAmp * Math.sin(t * Math.PI) * Math.sin(t * scallopCount * Math.PI * 2);
      p[0] += (nx / spread) * ripple;
      p[1] += (ny / spread) * ripple;
      outerPts.push(p);
    }
    const innerPts = [];
    for (let i = 1; i < samples; i++) {
      const t = i / samples;
      innerPts.push(quadPoint(tipX, tipY, innerCtrl[0], innerCtrl[1], attachX, attachY, t));
    }

    return { outerPts, innerPts, tipX, tipY };
  }

  function drawWing(g, opts) {
    const { outerPts, innerPts, tipX, tipY } = wingPoints(
      opts.attachX, opts.attachY, opts.tipAngleDeg, opts.length, opts.spread,
      opts.outerBulge, opts.innerBulge, opts.scallopAmp, opts.scallopCount, opts.samples, opts.side
    );
    const pts = outerPts.concat(innerPts);
    g.beginPath();
    const n = pts.length;
    let m0 = [(pts[n - 1][0] + pts[0][0]) / 2, (pts[n - 1][1] + pts[0][1]) / 2];
    g.moveTo(m0[0], m0[1]);
    for (let i = 0; i < n; i++) {
      const next = pts[(i + 1) % n];
      const m = [(pts[i][0] + next[0]) / 2, (pts[i][1] + next[1]) / 2];
      g.quadraticCurveTo(pts[i][0], pts[i][1], m[0], m[1]);
    }
    g.closePath();

    const tip = [tipX, tipY];
    const grad = g.createLinearGradient(opts.attachX, opts.attachY, tip[0], tip[1]);
    grad.addColorStop(0, opts.c1);
    grad.addColorStop(1, opts.c2);
    g.fillStyle = grad;
    g.fill();
    g.lineWidth = 1;
    g.strokeStyle = hexToRgba(opts.edge, 0.75);
    g.stroke();

    g.strokeStyle = hexToRgba(opts.edge, 0.32);
    g.lineWidth = 0.6;
    for (let k = 1; k <= opts.veinCount; k++) {
      const idx = Math.floor((k / (opts.veinCount + 1)) * outerPts.length);
      const p = outerPts[idx];
      g.beginPath();
      g.moveTo(opts.attachX, opts.attachY);
      g.lineTo(p[0], p[1]);
      g.stroke();
    }

    for (let e = 0; e < opts.eyespots; e++) {
      const idx = Math.floor(outerPts.length * (0.38 + e * 0.2));
      const p = outerPts[idx];
      const r = opts.length * 0.065;
      g.beginPath();
      g.fillStyle = opts.spot;
      g.arc(p[0], p[1], r, 0, Math.PI * 2);
      g.fill();
      g.beginPath();
      g.fillStyle = hexToRgba(opts.edge, 0.8);
      g.arc(p[0], p[1], r * 0.45, 0, Math.PI * 2);
      g.fill();
    }

    if (opts.sheen) {
      const p = outerPts[Math.floor(outerPts.length * 0.3)];
      g.save();
      g.globalAlpha = 0.16;
      g.fillStyle = "#ffffff";
      g.beginPath();
      g.ellipse(
        (opts.attachX + p[0]) / 2, (opts.attachY + p[1]) / 2,
        opts.length * 0.3, opts.length * 0.16,
        Math.atan2(p[1] - opts.attachY, p[0] - opts.attachX), 0, Math.PI * 2
      );
      g.fill();
      g.restore();
    }
  }

  function drawBody(g, cx, cy, size) {
    g.save();
    g.fillStyle = "#161616";
    g.beginPath(); g.ellipse(cx, cy + size * 0.14, size * 0.045, size * 0.12, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(cx, cy, size * 0.055, size * 0.078, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(cx, cy - size * 0.1, size * 0.04, size * 0.04, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = "rgba(255,255,255,0.08)";
    g.beginPath(); g.ellipse(cx - size * 0.012, cy - size * 0.02, size * 0.02, size * 0.05, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#1a1a1a";
    g.lineWidth = 1;
    [-1, 1].forEach((side) => {
      g.beginPath();
      g.moveTo(cx + side * size * 0.015, cy - size * 0.13);
      g.quadraticCurveTo(cx + side * size * 0.09, cy - size * 0.22, cx + side * size * 0.1, cy - size * 0.28);
      g.stroke();
      g.beginPath();
      g.fillStyle = "#1a1a1a";
      g.arc(cx + side * size * 0.1, cy - size * 0.28, size * 0.012, 0, Math.PI * 2);
      g.fill();
    });
    g.restore();
  }

  function renderButterflySprite(variant, openness) {
    const size = SPRITE_BASE;
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const g = c.getContext("2d");
    const cx = size / 2;
    const cy = size / 2 + 4;

    const wingSpreadX = 0.2 + 0.8 * openness;
    const wingSquash = 0.85 + 0.15 * openness;
    const darken = 0.65 + 0.35 * openness;
    const upperC1 = shadeColor(variant.c1, darken);
    const upperC2 = shadeColor(variant.c2, darken);
    const lowerC1 = shadeColor(variant.c1, darken * 0.92);
    const lowerC2 = shadeColor(variant.c2, darken * 0.92);

    const halo = g.createRadialGradient(cx, cy, 0, cx, cy, size * 0.42);
    halo.addColorStop(0, hexToRgba(variant.c2, 0.22));
    halo.addColorStop(1, hexToRgba(variant.c2, 0));
    g.fillStyle = halo;
    g.beginPath();
    g.arc(cx, cy, size * 0.42, 0, Math.PI * 2);
    g.fill();

    [1, -1].forEach((side) => {
      drawWing(g, {
        attachX: cx, attachY: cy + 9,
        tipAngleDeg: 58, length: size * 0.17 * wingSpreadX, spread: size * 0.26 * wingSquash,
        outerBulge: 1.5, innerBulge: -0.08,
        scallopAmp: size * 0.004, scallopCount: 3, samples: 20, side,
        c1: lowerC1, c2: lowerC2, edge: variant.edge, spot: variant.spot,
        veinCount: 3, eyespots: 1, sheen: false,
      });
    });

    [1, -1].forEach((side) => {
      drawWing(g, {
        attachX: cx, attachY: cy - 12,
        tipAngleDeg: -34, length: size * 0.22 * wingSpreadX, spread: size * 0.4 * wingSquash,
        outerBulge: 1.5, innerBulge: -0.05,
        scallopAmp: size * 0.005, scallopCount: 4, samples: 26, side,
        c1: upperC1, c2: upperC2, edge: variant.edge, spot: variant.spot,
        veinCount: 5, eyespots: 2, sheen: true,
      });
    });

    drawBody(g, cx, cy, size);
    return c;
  }

  const spriteSheet = VARIANTS.map((v) =>
    Array.from({ length: FRAMES }, (_, i) => renderButterflySprite(v, i / (FRAMES - 1)))
  );

  function frameForPhase(now, phase, speed) {
    const openness = Math.abs(Math.sin(now / 1000 * speed + phase));
    return Math.round(openness * (FRAMES - 1));
  }

  /* ---------------------------- ring layout --------------------------------- */
  const isMobile = W < 600;
  const RING_COUNT = isMobile ? 43 : 72;

  function computeRing(count) {
    const ringR = Math.min(W, H) * 0.27;
    const cx = W / 2;
    const cy = H / 2;
    const pts = [];
    for (let i = 0; i < count; i++) {
      const frac = i / count;
      const angle = frac * Math.PI * 2 - Math.PI / 2;
      pts.push({
        x: cx + Math.cos(angle) * ringR,
        y: cy + Math.sin(angle) * ringR,
        variantIdx: Math.floor(frac * VARIANTS.length) % VARIANTS.length,
      });
    }
    return { pts, ringR, cx, cy };
  }

  function randomEdgePoint() {
    const side = Math.floor(Math.random() * 4);
    const pad = 60;
    if (side === 0) return { x: -pad, y: Math.random() * H };
    if (side === 1) return { x: W + pad, y: Math.random() * H };
    if (side === 2) return { x: Math.random() * W, y: -pad };
    return { x: Math.random() * W, y: H + pad };
  }

  /* ============================================================================
     LOGO SHARDS — the logo image is cut into ~40 irregular, edge-matched
     pieces (a shared jittered vertex grid, so adjacent pieces still tile
     perfectly) and clipped to a circle so it drops cleanly inside the ring.
     Each piece is rendered once to its own offscreen canvas (a base layer
     plus a thin edge-highlight overlay used only while the piece is flying).
     ============================================================================ */
  const logoImg = new Image();
  const logoLoaded = new Promise((resolve) => {
    logoImg.onload = () => resolve(true);
    logoImg.onerror = () => resolve(false);
  });
  logoImg.src = "assets/logo.jpeg";

  function buildLogoShards(ring) {
    const logoRadius = ring.ringR * 0.72;
    const logoDiameter = logoRadius * 2;
    const cols = 8;
    const rows = 7;
    const cellW = logoDiameter / cols;
    const cellH = logoDiameter / rows;
    const jitter = 0.22;

    const verts = [];
    for (let j = 0; j <= rows; j++) {
      const row = [];
      for (let i = 0; i <= cols; i++) {
        const bx = i * cellW;
        const by = j * cellH;
        const jx = i > 0 && i < cols ? (Math.random() * 2 - 1) * cellW * jitter : 0;
        const jy = j > 0 && j < rows ? (Math.random() * 2 - 1) * cellH * jitter : 0;
        row.push([bx + jx, by + jy]);
      }
      verts.push(row);
    }

    const hMid = [];
    for (let j = 0; j <= rows; j++) {
      const row = [];
      for (let i = 0; i < cols; i++) {
        const a = verts[j][i], b = verts[j][i + 1];
        const jy = (Math.random() * 2 - 1) * cellH * 0.16;
        row.push([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + jy]);
      }
      hMid.push(row);
    }
    const vMid = [];
    for (let j = 0; j < rows; j++) {
      const row = [];
      for (let i = 0; i <= cols; i++) {
        const a = verts[j][i], b = verts[j + 1][i];
        const jx = (Math.random() * 2 - 1) * cellW * 0.16;
        row.push([(a[0] + b[0]) / 2 + jx, (a[1] + b[1]) / 2]);
      }
      vMid.push(row);
    }

    const cx = logoRadius, cy = logoRadius;
    const pieces = [];

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const TL = verts[j][i], TR = verts[j][i + 1], BR = verts[j + 1][i + 1], BL = verts[j + 1][i];
        const top = hMid[j][i], bottom = hMid[j + 1][i], right = vMid[j][i + 1], left = vMid[j][i];
        const poly = [TL, top, TR, right, BR, bottom, BL, left];

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        poly.forEach((p) => {
          minX = Math.min(minX, p[0]); minY = Math.min(minY, p[1]);
          maxX = Math.max(maxX, p[0]); maxY = Math.max(maxY, p[1]);
        });

        // Include this piece whenever its bounding box actually touches the
        // circle — not just when its (jittered) center is close enough.
        // The jittered grid tiles the square with no internal gaps (shared
        // vertices), so this guarantees the circle-clipped union of kept
        // pieces exactly fills the circle, with no missing slivers at the
        // boundary.
        const closestX = Math.max(minX, Math.min(cx, maxX));
        const closestY = Math.max(minY, Math.min(cy, maxY));
        const distToBox = Math.hypot(closestX - cx, closestY - cy);
        if (distToBox > logoRadius) continue;

        const pad = 10;
        const bw = Math.ceil(maxX - minX) + pad * 2;
        const bh = Math.ceil(maxY - minY) + pad * 2;

        const base = document.createElement("canvas");
        base.width = bw; base.height = bh;
        const bctx = base.getContext("2d");
        bctx.save();
        bctx.translate(pad - minX, pad - minY);
        bctx.beginPath();
        poly.forEach((p, idx) => (idx === 0 ? bctx.moveTo(p[0], p[1]) : bctx.lineTo(p[0], p[1])));
        bctx.closePath();
        bctx.clip();
        bctx.beginPath();
        bctx.arc(cx, cy, logoRadius, 0, Math.PI * 2);
        bctx.closePath();
        bctx.clip();
        if (logoImg.naturalWidth) {
          bctx.drawImage(logoImg, 0, 0, logoImg.naturalWidth, logoImg.naturalHeight, 0, 0, logoDiameter, logoDiameter);
        }
        bctx.restore();

        const edgeC = document.createElement("canvas");
        edgeC.width = bw; edgeC.height = bh;
        const ectx = edgeC.getContext("2d");
        ectx.save();
        ectx.translate(pad - minX, pad - minY);
        ectx.beginPath();
        poly.forEach((p, idx) => (idx === 0 ? ectx.moveTo(p[0], p[1]) : ectx.lineTo(p[0], p[1])));
        ectx.closePath();
        ectx.strokeStyle = "rgba(255,255,255,0.55)";
        ectx.lineWidth = 1.4;
        ectx.stroke();
        ectx.restore();

        const centerLocalX = (minX + maxX) / 2;
        const centerLocalY = (minY + maxY) / 2;
        pieces.push({
          base, edge: edgeC,
          offsetX: centerLocalX - minX + pad,
          offsetY: centerLocalY - minY + pad,
          homeLocalX: centerLocalX,
          homeLocalY: centerLocalY,
        });
      }
    }

    return { pieces, logoRadius, logoDiameter };
  }

  function buildMergedLogo(shardLayout) {
    const size = shardLayout.logoDiameter;
    const c = document.createElement("canvas");
    c.width = size; c.height = size;
    const g = c.getContext("2d");
    g.save();
    // Each piece is already clipped to the circle individually, but
    // sub-pixel rounding where adjacent piece edges meet can leave a
    // faintly uneven boundary. Clipping the finished composite to one
    // precise circle guarantees a perfectly round edge regardless.
    g.beginPath();
    g.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    g.closePath();
    g.clip();
    // Draw the pristine source image as a base first. Each piece's own
    // polygon-and-circle clip can leave a hairline gap at a shared seam
    // (winding-rule edge cases on the torn, jittered polygon), which would
    // otherwise show as a notch; with the real image underneath, any such
    // gap just shows the correct pixels instead of a hole.
    if (logoImg.naturalWidth) {
      g.drawImage(logoImg, 0, 0, logoImg.naturalWidth, logoImg.naturalHeight, 0, 0, size, size);
    }
    shardLayout.pieces.forEach((piece) => {
      g.drawImage(piece.base, piece.homeLocalX - piece.offsetX, piece.homeLocalY - piece.offsetY);
    });
    g.restore();
    return c;
  }

  /* ---------------------------- scene state --------------------------------- */
  let ring, butterflies, shardLayout, shards, mergedLogo;
  let ringDoneAt = 0;     // dynamic: moment the last ring butterfly lands
  let shardsDoneAt = 0;   // dynamic: moment the last shard lands

  function buildScene() {
    ring = computeRing(RING_COUNT);
    butterflies = [];

    let maxRingLand = 0;
    ring.pts.forEach((p) => {
      const start = randomEdgePoint();
      const stagger = Math.random() * 1500;     // staggered starts across ~1.5s
      const flightDur = 3300 + Math.random() * 500; // each flight ~3.3-3.8s (slower glide)
      maxRingLand = Math.max(maxRingLand, stagger + flightDur);
      butterflies.push({
        variantIdx: p.variantIdx,
        startX: start.x, startY: start.y,
        targetX: p.x, targetY: p.y,
        x: start.x, y: start.y,
        size: lerp(16, 23, Math.random()),
        flapPhase: Math.random() * Math.PI * 2,
        flapSpeed: 6.5 + Math.random() * 4,
        stagger, flightDur,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.8 + Math.random() * 0.6,
        wobbleR: 2 + Math.random() * 2.5,
        angle: 0,
      });
    });
    ringDoneAt = maxRingLand;

    shardLayout = buildLogoShards(ring);
    shards = [];
    let maxShardLand = 0;
    shardLayout.pieces.forEach((piece) => {
      const home = { x: ring.cx - shardLayout.logoRadius + piece.homeLocalX, y: ring.cy - shardLayout.logoRadius + piece.homeLocalY };
      const start = randomEdgePoint();
      const dist = Math.hypot(home.x - start.x, home.y - start.y);
      const curveOffset = (Math.random() * 2 - 1) * (dist * 0.22 + 40);
      const stagger = Math.random() * 600;
      const duration = 1200 + Math.random() * 400;
      maxShardLand = Math.max(maxShardLand, stagger + duration);
      shards.push({
        piece, home, start, curveOffset,
        rot0: (Math.random() * 2 - 1) * ((50 + Math.random() * 50) * Math.PI) / 180,
        scale0: 1.1 + Math.random() * 0.15,
        stagger, duration,
        x: start.x, y: start.y, rot: 0, scale: 1, opacity: 0,
        fastForward: false,
      });
    });
    shardsDoneAt = maxShardLand;
  }

  /* ---------------------------- timeline ------------------------------------ */
  // T_SHARDS_START / T_PULSE_START / etc. are resolved once buildScene() has
  // produced the real (randomized) ring/shard landing times, so shards begin
  // the instant the ring is actually done, with no fixed-guess gap.
  let T_SHARDS_START = 0;
  let T_SHARDS_DONE = 0;
  let T_PULSE_START = 0;
  const T_PULSE_DUR = 550;
  let T_CAPTION_START = 0;
  const T_CAPTION_DUR = 450;
  let T_HOLD_END = 0;
  const T_HOLD_DUR = 800;
  let T_FINISH_START = 0;
  const T_FINISH_DUR = 850;
  let T_TOTAL = 0;

  function resolveTimeline() {
    T_SHARDS_START = ringDoneAt;
    T_SHARDS_DONE = T_SHARDS_START + shardsDoneAt + 220; // + settle fade window
    T_PULSE_START = T_SHARDS_DONE;
    T_CAPTION_START = T_PULSE_START + 150;
    T_HOLD_END = T_PULSE_START + T_PULSE_DUR + T_HOLD_DUR;
    T_FINISH_START = T_HOLD_END;
    T_TOTAL = T_FINISH_START + T_FINISH_DUR + 150;
  }

  /* ---------------------------- butterfly update/draw ------------------------ */
  function updateButterfly(b, now, elapsed, fadeFrac) {
    const localElapsed = elapsed - b.stagger;
    const t = clamp01(localElapsed / b.flightDur);
    const eased = easeInOutCubic(t);

    if (t < 1) {
      b.x = lerp(b.startX, b.targetX, eased);
      b.y = lerp(b.startY, b.targetY, eased);
      const flightAngle = Math.atan2(b.targetY - b.startY, b.targetX - b.startX);
      b.angle = flightAngle * 0.4 * (1 - eased);
      b.visible = localElapsed > -200;
    } else {
      const wob = now / 1000 * b.wobbleSpeed + b.wobblePhase;
      b.x = b.targetX + Math.cos(wob) * b.wobbleR;
      b.y = b.targetY + Math.sin(wob) * b.wobbleR * 0.6;
      b.angle *= 0.9;
      b.visible = true;
    }

    b.opacity = (1 - fadeFrac) * (b.visible ? 1 : 0);
  }

  function drawButterfly(ctx, b, now) {
    if (b.opacity <= 0.01) return;
    const frame = frameForPhase(now, b.flapPhase, b.flapSpeed);
    const sprite = spriteSheet[b.variantIdx][frame];
    const scale = b.size / SPRITE_BASE;
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.angle);
    ctx.scale(scale, scale);
    ctx.globalAlpha = b.opacity;
    ctx.drawImage(sprite, -SPRITE_BASE / 2, -SPRITE_BASE / 2);
    ctx.restore();
  }

  function drawRingGlow(ctx, alpha) {
    if (alpha <= 0.01) return;
    const grad = ctx.createRadialGradient(ring.cx, ring.cy, 0, ring.cx, ring.cy, ring.ringR * 1.35);
    grad.addColorStop(0, `rgba(66,133,244,${0.16 * alpha})`);
    grad.addColorStop(0.6, `rgba(234,67,53,${0.08 * alpha})`);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  /* ---------------------------- shard update/draw ----------------------------- */
  function updateShard(s, elapsed) {
    if (s.fastForward) {
      s.x = s.home.x; s.y = s.home.y; s.rot = 0; s.scale = 1; s.opacity = 1;
      s.settled = true;
      return;
    }
    const localElapsed = elapsed - T_SHARDS_START - s.stagger;
    if (localElapsed < 0) { s.opacity = 0; s.settled = false; return; }

    const t = clamp01(localElapsed / s.duration);
    const e = easeOutBackSmall(t);

    const mx = (s.start.x + s.home.x) / 2, my = (s.start.y + s.home.y) / 2;
    const dx = s.home.x - s.start.x, dy = s.home.y - s.start.y;
    const len = Math.hypot(dx, dy) || 1;
    const px = -dy / len, py = dx / len;
    const ctrlX = mx + px * s.curveOffset, ctrlY = my + py * s.curveOffset;
    const pos = quadPoint(s.start.x, s.start.y, ctrlX, ctrlY, s.home.x, s.home.y, e);
    s.x = pos[0]; s.y = pos[1];
    s.rot = lerp(s.rot0, 0, e);
    s.scale = lerp(s.scale0, 1, e);
    s.opacity = clamp01(localElapsed / 150);

    const settleProgress = clamp01((localElapsed - s.duration) / 220);
    s.shadowFactor = t < 1 ? 1 : 1 - settleProgress;
    s.edgeFactor = t < 1 ? 0.9 : 0.9 * (1 - settleProgress);
    s.settled = settleProgress >= 1;
  }

  function drawShard(ctx, s) {
    if (s.opacity <= 0.01) return;
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.rot);
    ctx.scale(s.scale, s.scale);
    ctx.globalAlpha = s.opacity;
    const shadowFactor = s.fastForward ? 0 : s.shadowFactor || 0;
    if (shadowFactor > 0.01) {
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = 7 * shadowFactor;
      ctx.shadowOffsetY = 2 * shadowFactor;
    }
    ctx.drawImage(s.piece.base, -s.piece.offsetX, -s.piece.offsetY);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    const edgeFactor = s.fastForward ? 0 : s.edgeFactor || 0;
    if (edgeFactor > 0.01) {
      ctx.globalAlpha = s.opacity * edgeFactor;
      ctx.drawImage(s.piece.edge, -s.piece.offsetX, -s.piece.offsetY);
    }
    ctx.restore();
  }

  function drawCaption(ctx, alpha) {
    if (alpha <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const fontSize = Math.max(13, Math.min(20, ring.ringR * 0.115));
    ctx.font = `600 ${fontSize}px 'Google Sans', sans-serif`;
    const capY = ring.cy + shardLayout.logoRadius + (ring.ringR - shardLayout.logoRadius) * 0.42;
    ctx.fillText("GDG on Campus · UVCE", ring.cx, capY);
    ctx.restore();
  }

  function drawLogoPulse(ctx, progress) {
    if (progress <= 0.01) return;
    const alpha = Math.sin(clamp01(progress) * Math.PI);
    const r = shardLayout.logoRadius * (1.1 + 0.35 * progress);
    const grad = ctx.createRadialGradient(ring.cx, ring.cy, shardLayout.logoRadius * 0.6, ring.cx, ring.cy, r);
    grad.addColorStop(0, `rgba(255,255,255,${0.22 * alpha})`);
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(ring.cx, ring.cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  /* ---------------------------- performance guard --------------------------- */
  let lastFpsCheck = 0;
  let fpsFrameCount = 0;
  let reduceStep = 0;

  function maybeReduceLoad(now, elapsed) {
    fpsFrameCount++;
    if (now - lastFpsCheck < 400) return;
    const fps = fpsFrameCount / ((now - lastFpsCheck) / 1000);
    fpsFrameCount = 0;
    lastFpsCheck = now;
    if (fps < 45 && reduceStep < 2 && elapsed < T_SHARDS_DONE) {
      reduceStep++;
      // Fast-forward (not remove) a batch of not-yet-landed shards straight
      // to their settled position — keeps the assembled logo gap-free while
      // cutting the per-frame flight/shadow cost.
      const flying = shards.filter((s) => !s.fastForward && !s.settled);
      const cut = Math.ceil(flying.length * 0.3);
      for (let i = 0; i < cut; i++) flying[i].fastForward = true;
    }
  }

  /* ---------------------------- main loop ------------------------------------ */
  let startTime = null;
  let pauseOffset = 0;
  let hiddenSince = null;
  let rafId = null;
  let done = false;
  let mergedBuilt = false;
  let heroRect = null;
  let sceneReady = false;

  function frame(now) {
    if (done || !sceneReady) return;

    // Poll visibility rather than relying solely on the visibilitychange
    // event (some embedding contexts front/hide a tab without firing it) —
    // this guarantees we always resume once frames start being delivered
    // again, while still skipping all the real work while hidden.
    if (document.hidden) {
      if (hiddenSince === null) hiddenSince = now;
      rafId = requestAnimationFrame(frame);
      return;
    }
    if (hiddenSince !== null) {
      pauseOffset += now - hiddenSince;
      hiddenSince = null;
    }

    if (startTime === null) { startTime = now; lastFpsCheck = now; }
    const elapsed = now - startTime - pauseOffset;

    maybeReduceLoad(now, elapsed);

    const inFinish = elapsed >= T_FINISH_START;
    const finishT = inFinish ? clamp01((elapsed - T_FINISH_START) / T_FINISH_DUR) : 0;
    const finishEased = easeInOutCubic(finishT);
    const ringFadeFrac = inFinish ? finishEased : 0;

    ctx.fillStyle = "rgba(10, 10, 10, 0.3)";
    ctx.fillRect(0, 0, W, H);

    const glowAlpha = clamp01(elapsed / ringDoneAt) * (1 - ringFadeFrac);
    drawRingGlow(ctx, glowAlpha);

    for (let i = 0; i < butterflies.length; i++) {
      const b = butterflies[i];
      updateButterfly(b, now, elapsed, ringFadeFrac);
      drawButterfly(ctx, b, now);
    }

    // Shards: still individually flying/landing, then (once all settled)
    // swapped for a single merged bitmap — identical pixels, one draw call.
    if (elapsed >= T_SHARDS_START) {
      if (!mergedBuilt && elapsed >= T_SHARDS_DONE) {
        mergedLogo = buildMergedLogo(shardLayout);
        mergedBuilt = true;
      }
      if (mergedBuilt) {
        const pulseT = clamp01((elapsed - T_PULSE_START) / T_PULSE_DUR);
        if (!inFinish) drawLogoPulse(ctx, pulseT);

        const homeCx = ring.cx, homeCy = ring.cy, homeSize = shardLayout.logoDiameter;
        let drawCx = homeCx, drawCy = homeCy, drawSize = homeSize;
        if (inFinish) {
          if (!heroRect) {
            const heroLogoEl = document.querySelector(".hero-logo");
            const r = heroLogoEl ? heroLogoEl.getBoundingClientRect() : null;
            heroRect = r && r.width > 0 ? r : { left: homeCx - homeSize / 2, top: homeCy - homeSize / 2, width: homeSize, height: homeSize };
          }
          const targetCx = heroRect.left + heroRect.width / 2;
          const targetCy = heroRect.top + heroRect.height / 2;
          const targetSize = heroRect.width;
          drawCx = lerp(homeCx, targetCx, finishEased);
          drawCy = lerp(homeCy, targetCy, finishEased);
          drawSize = lerp(homeSize, targetSize, finishEased);
        }
        ctx.drawImage(mergedLogo, drawCx - drawSize / 2, drawCy - drawSize / 2, drawSize, drawSize);
      } else {
        for (let i = 0; i < shards.length; i++) {
          const s = shards[i];
          updateShard(s, elapsed);
          drawShard(ctx, s);
        }
      }
    }

    const captionAlpha =
      clamp01((elapsed - T_CAPTION_START) / T_CAPTION_DUR) *
      (inFinish ? 1 - clamp01(finishT / 0.3) : 1);
    if (mergedBuilt) drawCaption(ctx, captionAlpha);

    if (elapsed >= T_TOTAL) {
      done = true;
      finishIntro();
      return;
    }

    rafId = requestAnimationFrame(frame);
  }

  function skip() {
    done = true;
    if (rafId) cancelAnimationFrame(rafId);
    finishIntro();
  }
  skipBtn.addEventListener("click", skip);

  function start() {
    buildScene();
    resolveTimeline();
    sceneReady = true;
    // frame() itself polls document.hidden and skips work while hidden, so
    // it's safe to always schedule the first frame here regardless of the
    // tab's current visibility.
    rafId = requestAnimationFrame(frame);
  }

  const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready.catch(() => {}) : Promise.resolve();
  Promise.all([fontsReady, logoLoaded]).then(start);
})();
