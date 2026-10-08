/* ============================================================================
   Mini-game: tap the butterflies before they fly off. 20 second round,
   live score, final score screen, replay. Nothing is saved or sent anywhere.
   ============================================================================ */
(function () {
  const stage = document.getElementById("game-stage");
  const canvas = document.getElementById("game-canvas");
  const hud = document.getElementById("game-hud");
  const scoreEl = document.getElementById("game-score");
  const timerEl = document.getElementById("game-timer");
  const startScreen = document.getElementById("game-start-screen");
  const startBtn = document.getElementById("game-start-btn");
  const endScreen = document.getElementById("game-end-screen");
  const finalScoreEl = document.getElementById("game-final-score");
  const replayBtn = document.getElementById("game-replay-btn");

  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext("2d");
  const COLORS = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];
  const ROUND_MS = 20000;
  const SPAWN_EVERY_MS = 420;

  let W, H, DPR;
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    const rect = stage.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  let butterflies = [];
  let score = 0;
  let running = false;
  let lastSpawn = 0;
  let roundStart = 0;
  let rafId = null;

  function randomEdgeSpawn() {
    const side = Math.floor(Math.random() * 4);
    const pad = 20;
    if (side === 0) return { x: -pad, y: Math.random() * H, vx: 1, vy: (Math.random() - 0.5) };
    if (side === 1) return { x: W + pad, y: Math.random() * H, vx: -1, vy: (Math.random() - 0.5) };
    if (side === 2) return { x: Math.random() * W, y: -pad, vx: (Math.random() - 0.5), vy: 1 };
    return { x: Math.random() * W, y: H + pad, vx: (Math.random() - 0.5), vy: -1 };
  }

  class Butterfly {
    constructor() {
      const spawn = randomEdgeSpawn();
      this.x = spawn.x;
      this.y = spawn.y;
      const speed = 55 + Math.random() * 45;
      const len = Math.hypot(spawn.vx, spawn.vy) || 1;
      this.vx = (spawn.vx / len) * speed;
      this.vy = (spawn.vy / len) * speed;
      this.wobblePhase = Math.random() * Math.PI * 2;
      this.wobbleSpeed = 1.2 + Math.random() * 1.2;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.size = 13 + Math.random() * 7;
      this.hitRadius = this.size * 1.6;
      this.flapPhase = Math.random() * Math.PI * 2;
      this.flapSpeed = 9 + Math.random() * 5;
      this.born = performance.now();
      this.life = 3200 + Math.random() * 1800;
      this.popping = false;
      this.popT = 0;
      this.dead = false;
    }

    update(dt, now) {
      if (this.popping) {
        this.popT += dt;
        if (this.popT > 260) this.dead = true;
        return;
      }
      const age = now - this.born;
      if (age > this.life) {
        this.dead = true;
        return;
      }
      const wob = Math.sin(now / 1000 * this.wobbleSpeed + this.wobblePhase) * 40;
      this.x += this.vx * (dt / 1000);
      this.y += this.vy * (dt / 1000) + wob * (dt / 1000);

      if (this.x < -60 || this.x > W + 60 || this.y < -60 || this.y > H + 60) {
        this.dead = true;
      }
    }

    draw(now) {
      const flap = Math.sin(now / 1000 * this.flapSpeed + this.flapPhase);
      const wingScale = 0.35 + Math.abs(flap) * 0.65;
      let scale = 1;
      let opacity = 1;

      if (this.popping) {
        const t = this.popT / 260;
        scale = 1 + t * 1.1;
        opacity = 1 - t;
      }

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.scale(scale, scale);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;

      ctx.save();
      ctx.scale(wingScale, 1);
      ctx.beginPath();
      ctx.ellipse(-this.size * 0.55, 0, this.size, this.size * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.scale(wingScale, 1);
      ctx.beginPath();
      ctx.ellipse(this.size * 0.55, 0, this.size, this.size * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.restore();
    }
  }

  function hitTest(px, py) {
    for (let i = butterflies.length - 1; i >= 0; i--) {
      const b = butterflies[i];
      if (b.popping || b.dead) continue;
      const d = Math.hypot(b.x - px, b.y - py);
      if (d <= b.hitRadius) return b;
    }
    return null;
  }

  function pointFromEvent(e) {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches && e.touches[0];
    const clientX = touch ? touch.clientX : e.clientX;
    const clientY = touch ? touch.clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function onTap(e) {
    if (!running) return;
    e.preventDefault();
    const p = pointFromEvent(e);
    const hit = hitTest(p.x, p.y);
    if (hit) {
      hit.popping = true;
      hit.popT = 0;
      score++;
      scoreEl.textContent = `Score ${score}`;
    }
  }

  canvas.addEventListener("pointerdown", onTap);

  let lastFrame = 0;
  function loop(now) {
    if (!running) return;
    const dt = lastFrame ? now - lastFrame : 16;
    lastFrame = now;

    const elapsed = now - roundStart;
    const remaining = Math.max(0, ROUND_MS - elapsed);
    timerEl.textContent = `${Math.ceil(remaining / 1000)}s`;

    if (remaining <= 0) {
      endRound();
      return;
    }

    if (now - lastSpawn > SPAWN_EVERY_MS && butterflies.length < 14) {
      lastSpawn = now;
      butterflies.push(new Butterfly());
    }

    ctx.clearRect(0, 0, W, H);
    butterflies.forEach((b) => b.update(dt, now));
    butterflies = butterflies.filter((b) => !b.dead);
    butterflies.forEach((b) => b.draw(now));

    rafId = requestAnimationFrame(loop);
  }

  function startRound() {
    resize();
    score = 0;
    butterflies = [];
    scoreEl.textContent = "Score 0";
    timerEl.textContent = "20s";
    startScreen.hidden = true;
    endScreen.hidden = true;
    hud.hidden = false;
    running = true;
    roundStart = performance.now();
    lastSpawn = 0;
    lastFrame = 0;
    rafId = requestAnimationFrame(loop);
  }

  function endRound() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    ctx.clearRect(0, 0, W, H);
    hud.hidden = true;
    finalScoreEl.textContent = String(score);
    endScreen.hidden = false;
  }

  startBtn.addEventListener("click", startRound);
  replayBtn.addEventListener("click", startRound);
})();
