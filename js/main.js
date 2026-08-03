(function () {
  "use strict";

  const CONFIG = window.GIFT_CONFIG;
  const app = {
    index: -1,
    busy: false,
    musicStarted: false,
    starsLit: 0,
    flowerChosen: false
  };

  const $ = (selector, root) => (root || document).querySelector(selector);
  const $$ = (selector, root) => Array.from((root || document).querySelectorAll(selector));

  const SKIN_INK = {
    rose: "#be123c",
    night: "#facc15",
    floral: "#15803d",
    cake: "#db2777",
    gold: "#b45309",
    memories: "#6d28d9"
  };

  const SKIN_WAVE = {
    rose: "#f472b6",
    night: "#818cf8",
    floral: "#22c55e",
    cake: "#ec4899",
    gold: "#f59e0b",
    memories: "#a78bfa"
  };

  const SKIN_STAMP = {
    rose: "🌹",
    night: "⭐",
    floral: "🌷",
    cake: "🧁",
    gold: "🎈",
    memories: "📷"
  };

  const MONEY_SVG = `
    <svg class="money-svg" viewBox="0 0 280 230" aria-hidden="true">
      <path d="M140 215 C 118 178 118 132 140 92" fill="none" stroke="#15803d" stroke-width="6" stroke-linecap="round"/>
      <path d="M140 215 C 162 178 162 132 140 92" fill="none" stroke="#166534" stroke-width="5" stroke-linecap="round"/>
      <g transform="rotate(-32 140 92)">
        <rect x="108" y="24" width="64" height="92" rx="12" fill="#dcfce7" stroke="#16a34a" stroke-width="4"/>
        <text x="140" y="78" text-anchor="middle" font-size="30" fill="#15803d">¥</text>
      </g>
      <g transform="rotate(0 140 92)">
        <rect x="108" y="24" width="64" height="92" rx="12" fill="#bbf7d0" stroke="#16a34a" stroke-width="4"/>
        <text x="140" y="78" text-anchor="middle" font-size="30" fill="#15803d">¥</text>
      </g>
      <g transform="rotate(32 140 92)">
        <rect x="108" y="24" width="64" height="92" rx="12" fill="#dcfce7" stroke="#16a34a" stroke-width="4"/>
        <text x="140" y="78" text-anchor="middle" font-size="30" fill="#15803d">¥</text>
      </g>
      <g transform="rotate(64 140 92)">
        <rect x="108" y="24" width="64" height="92" rx="12" fill="#bbf7d0" stroke="#16a34a" stroke-width="4"/>
        <text x="140" y="78" text-anchor="middle" font-size="30" fill="#15803d">¥</text>
      </g>
      <circle cx="118" cy="196" r="10" fill="#fbbf24" stroke="#b45309" stroke-width="3"/>
      <circle cx="162" cy="200" r="12" fill="#fde68a" stroke="#b45309" stroke-width="3"/>
      <circle cx="140" cy="214" r="8" fill="#fcd34d" stroke="#b45309" stroke-width="3"/>
    </svg>`;

  const CAKE_SVG = `
    <svg class="cake" viewBox="0 0 360 320" aria-hidden="true">
      <defs>
        <linearGradient id="cakeGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fff1f2"/>
          <stop offset="100%" stop-color="#fbcfe8"/>
        </linearGradient>
      </defs>
      <ellipse cx="180" cy="304" rx="150" ry="16" fill="#e9d5ff" opacity="0.5"/>
      <rect x="70" y="236" width="220" height="68" rx="12" fill="#fbcfe8" stroke="#f472b6" stroke-width="3"/>
      <path d="M70 240 q12 20 24 0 q12 20 24 0 q12 20 24 0 q12 20 24 0 q12 20 24 0 q12 20 24 0 q12 20 24 0 q12 20 24 0 q12 20 24 0" fill="#f9a8d4"/>
      <rect x="105" y="186" width="150" height="54" rx="10" fill="#fde68a" stroke="#f59e0b" stroke-width="3"/>
      <rect x="136" y="140" width="88" height="50" rx="9" fill="url(#cakeGlow)" stroke="#d6b28c" stroke-width="3"/>
      <rect x="132" y="136" width="96" height="7" rx="3" fill="#f9a8d4" stroke="#f472b6" stroke-width="2"/>
      <g stroke="#f472b6" stroke-width="3" stroke-linecap="round">
        <line x1="86" y1="270" x2="92" y2="282"/>
        <line x1="112" y1="268" x2="118" y2="280"/>
        <line x1="244" y1="270" x2="250" y2="282"/>
        <line x1="270" y1="268" x2="276" y2="280"/>
      </g>
      <g stroke="#f59e0b" stroke-width="3" stroke-linecap="round">
        <line x1="125" y1="210" x2="132" y2="222"/>
        <line x1="228" y1="210" x2="235" y2="222"/>
      </g>
      <g transform="translate(158,140)">
        <rect x="-4" y="-26" width="8" height="26" rx="2" fill="#fda4af" stroke="#e11d48" stroke-width="1.5"/>
        <path class="flame" d="M0 -42 C -8 -35 -7 -25 0 -26 C 7 -25 8 -35 0 -42 Z" fill="#fde047" stroke="#f59e0b" stroke-width="1.5"/>
        <path class="flame-inner" d="M0 -37 C -3 -34 -3 -29 0 -29 C 3 -29 3 -34 0 -37 Z" fill="#fef9c3"/>
      </g>
      <g transform="translate(180,139)">
        <rect x="-4" y="-26" width="8" height="26" rx="2" fill="#f9a8d4" stroke="#db2777" stroke-width="1.5"/>
        <path class="flame" d="M0 -44 C -9 -36 -7 -26 0 -27 C 7 -26 9 -36 0 -44 Z" fill="#facc15" stroke="#d97706" stroke-width="1.5"/>
        <path class="flame-inner" d="M0 -39 C -3 -36 -3 -31 0 -31 C 3 -31 3 -36 0 -39 Z" fill="#fef9c3"/>
      </g>
      <g transform="translate(202,140)">
        <rect x="-4" y="-26" width="8" height="26" rx="2" fill="#fda4af" stroke="#e11d48" stroke-width="1.5"/>
        <path class="flame" d="M0 -42 C -8 -35 -7 -25 0 -26 C 7 -25 8 -35 0 -42 Z" fill="#fde047" stroke="#f59e0b" stroke-width="1.5"/>
        <path class="flame-inner" d="M0 -37 C -3 -34 -3 -29 0 -29 C 3 -29 3 -34 0 -37 Z" fill="#fef9c3"/>
      </g>
    </svg>`;

  function burst(x, y, opts) {
    const o = opts || {};
    const colors = o.colors || ["#f43f5e", "#fbbf24", "#f472b6", "#38bdf8", "#a3e635"];
    confetti({
      particleCount: o.count || 70,
      spread: o.spread || 75,
      startVelocity: 32,
      ticks: 180,
      gravity: 0.85,
      origin: { x: x / window.innerWidth, y: y / window.innerHeight },
      colors: colors,
      scalar: 0.9,
      shapes: o.shapes || ["circle", "square"]
    });
  }

  function burstAt(element, opts) {
    const rect = element.getBoundingClientRect();
    burst(rect.left + rect.width / 2, rect.top + rect.height / 2, opts);
  }

  function sparkleAt(element) {
    const rect = element.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const colors = ["#fbbf24", "#f472b6", "#fde68a", "#f9a8d4", "#38bdf8"];
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2;
      const dist = 26 + Math.random() * 14;
      const spark = document.createElement("span");
      spark.className = "spark";
      spark.style.left = cx + "px";
      spark.style.top = cy + "px";
      spark.style.color = colors[i % colors.length];
      spark.textContent = "\u2726";
      document.body.appendChild(spark);
      gsap.to(spark, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        autoAlpha: 0,
        scale: 0.35,
        rotation: 90,
        duration: 0.45 + Math.random() * 0.2,
        ease: "power2.out",
        onComplete: function () {
          spark.remove();
        }
      });
    }
  }

  function startMusic() {
    if (app.musicStarted) return;
    app.musicStarted = true;
    const bgm = $("#bgm");
    bgm.volume = 0;
    bgm.play().catch(function () {});
    gsap.to(bgm, { volume: 0.28, duration: 1.8, ease: "power1.inOut" });
  }

  function initCover() {
    $("#cover-line").textContent = CONFIG.coverLine;
    $("#cover-sub").textContent = CONFIG.coverSub;

    let coverStarted = false;
    const startCover = function () {
      if (coverStarted) return;
      coverStarted = true;
      if (window.SplitText) {
        const split = new SplitText("#cover-line", { type: "chars" });
        gsap.fromTo(
          split.chars,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.34,
            ease: "power2.out",
            onComplete: function () {
              gsap.to("#cover-sub", { opacity: 1, duration: 1, delay: 0.4 });
            }
          }
        );
      } else {
        gsap.fromTo(
          "#cover-line",
          { opacity: 0 },
          {
            opacity: 1,
            duration: 3,
            onComplete: function () {
              gsap.to("#cover-sub", { opacity: 1, duration: 1, delay: 0.4 });
            }
          }
        );
      }
    };

    if (document.fonts && document.fonts.ready) {
      let fontSettled = false;
      const runWhenReady = function () {
        if (fontSettled) return;
        fontSettled = true;
        startCover();
      };
      document.fonts.ready.then(runWhenReady).catch(runWhenReady);
      setTimeout(runWhenReady, 3000);
    } else {
      startCover();
    }

    gsap.to(".envelope-shell", { y: -10, duration: 1.7, yoyo: true, repeat: -1, ease: "sine.inOut" });
    $("#cover-envelope").addEventListener("click", startExperience);
  }

  function initBackground() {
    const layer = $("#bg-anim");
    if (!layer) return;
    const count = window.innerWidth < 640 ? 12 : 22;
    const types = [
      {
        color: "#f472b6",
        path: "M12 2 C 17 8 20 12 12 22 C 4 12 7 8 12 2 Z"
      },
      {
        color: "#fbbf24",
        path: "M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.4l-6.1 3.2 1.4-6.8L2.2 9.1l6.9-.8z"
      },
      {
        color: "#fb7185",
        path: "M12 20 C 6 15 2 11 4 7 C 5.5 4 9 4 12 7 C 15 4 18.5 4 20 7 C 22 11 18 15 12 20 Z"
      },
      {
        color: "#38bdf8",
        path: "M12 2 L13.6 10.4 L22 12 L13.6 13.6 L12 22 L10.4 13.6 L2 12 L10.4 10.4 Z"
      }
    ];

    for (let i = 0; i < count; i++) {
      const t = types[i % types.length];
      const piece = document.createElement("span");
      piece.className = "bg-piece";
      piece.style.setProperty("--x", (Math.random() * 94 + 3).toFixed(1) + "%");
      piece.style.setProperty("--size", (10 + Math.random() * 20).toFixed(1) + "px");
      piece.style.setProperty("--color", t.color);
      piece.style.setProperty("--o", (0.25 + Math.random() * 0.45).toFixed(2));
      piece.style.setProperty("--dur", (14 + Math.random() * 16).toFixed(1) + "s");
      piece.style.setProperty("--delay", (-Math.random() * 30).toFixed(1) + "s");
      piece.style.setProperty("--sway", (12 + Math.random() * 30).toFixed(0) + "px");
      piece.innerHTML = '<svg viewBox="0 0 24 24"><path d="' + t.path + '"/></svg>';
      layer.appendChild(piece);
    }

    window.addEventListener("pointermove", function (event) {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      gsap.to(layer, { x: nx * 18, y: ny * 12, duration: 1.4, ease: "power2.out" });
    });
  }

  function startExperience() {
    if (app.busy) return;
    app.busy = true;
    startMusic();
    burst(window.innerWidth / 2, window.innerHeight / 2, { count: 90, spread: 100 });
    gsap.to("#scene-cover", {
      autoAlpha: 0,
      duration: 0.7,
      ease: "power2.in",
      onComplete: function () {
        $("#scene-cover").classList.remove("active");
        app.busy = false;
        showLetter(0);
      }
    });
  }

  function showLetter(index) {
    app.index = index;
    const cfg = CONFIG.letters[index];
    const stage = $("#letter-stage");
    stage.innerHTML = "";

    const scene = document.createElement("section");
    scene.className = "letter-scene skin-" + cfg.skin;
    scene.innerHTML =
      '<div class="env-wrap">' +
      '<div class="envelope" role="button" tabindex="0" aria-label="打开这封信">' +
      '<span class="env-back"></span>' +
      '<span class="env-letter">给 ' + CONFIG.recipient + "</span>" +
      '<span class="env-front"></span>' +
      '<span class="env-flap"></span>' +
      '<span class="env-stamp">' + SKIN_STAMP[cfg.skin] + "</span>" +
      '<span class="env-label" aria-label="' + cfg.title + '"></span>' +
      "</div>" +
      "</div>" +
      '<article class="letter-paper"><div class="paper-inner"></div></article>';
    stage.appendChild(scene);
    $("#scene-letter").classList.add("active");

    const env = $(".envelope", scene);
    const openHandler = function (event) {
      if (event && event.stopImmediatePropagation) event.stopImmediatePropagation();
      env.removeEventListener("click", openHandler);
      env.removeEventListener("keydown", keyHandler);
      openLetter(index);
    };
    const dismissHandler = function () {
      if (!env.classList.contains("opened")) return;
      env.removeEventListener("click", dismissHandler);
      gsap.to(env, {
        autoAlpha: 0,
        duration: 0.25,
        onComplete: function () {
          env.style.display = "none";
        }
      });
    };
    const keyHandler = function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openHandler();
      }
    };
    env.addEventListener("click", openHandler);
    env.addEventListener("click", dismissHandler);
    env.addEventListener("keydown", keyHandler);

    gsap.fromTo(
      scene,
      { autoAlpha: 0, y: 30 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        onComplete: function () {
          let hintShown = false;
          const showHint = function () {
            if (hintShown) return;
            hintShown = true;
            const hint = document.createElement("div");
            hint.className = "open-hint";
            hint.textContent = "点一下打开";
            $(".env-wrap", scene).appendChild(hint);
            gsap.fromTo(hint, { opacity: 0 }, { opacity: 1, duration: 0.5 });
          };
          writeTitle(cfg.title, $(".env-label", scene), cfg.skin).then(showHint);
          setTimeout(showHint, 4500);
        }
      }
    );
  }

  function writeTitle(title, container, skin) {
    container.innerHTML = "";
    container.classList.add("env-label--decorated");
    container.style.display = "flex";

    const ink = SKIN_INK[skin] || "#9f1239";
    const waveColor = SKIN_WAVE[skin] || "#f472b6";

    const text = document.createElement("span");
    text.className = "env-title-text";
    text.style.setProperty("--title-ink", ink);
    text.style.setProperty("--title-wave", waveColor);
    container.appendChild(text);

    const chars = Array.from(title);
    chars.forEach(function (ch) {
      const c = document.createElement("span");
      c.className = "env-title-char";
      c.textContent = ch;
      text.appendChild(c);
    });

    const charEls = Array.from(text.querySelectorAll(".env-title-char"));

    gsap.fromTo(
      charEls,
      { opacity: 0, y: 10, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        stagger: 0.34,
        ease: "power2.out",
        onComplete: function () {
          gsap.set(charEls, { clearProps: "transform" });
        }
      }
    );

    return Promise.resolve();
  }

  function openLetter(index) {
    const scene = $("#letter-stage .letter-scene");
    const env = $(".envelope", scene);
    const paper = $(".letter-paper", scene);
    if (app.busy) return;
    app.busy = true;

    renderLetter(index, $(".paper-inner", scene));
    paper.classList.add("open");
    env.classList.add("opened");
    app.busy = false;

    setTimeout(function () {
      if (env.style.display !== "none") {
        env.style.display = "none";
      }
    }, 900);

    const tl = gsap.timeline();
    tl.to($(".env-flap", env), {
        rotationX: -180,
        transformOrigin: "50% 0%",
        duration: 0.7,
        ease: "power3.inOut"
      }, 0)
      .call(function () {
        env.classList.add("opening");
      }, [], 0.35)
      .to($(".env-letter", env), { yPercent: -105, duration: 0.75, ease: "power3.out" }, 0.3)
      .to(env, { y: -40, scale: 0.94, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 0.75)
      .to(paper, { autoAlpha: 1, y: 0, scale: 1, duration: 0.65, ease: "power3.out" }, 1.0);
  }

  function renderLetter(index, container) {
    const cfg = CONFIG.letters[index];
    if (cfg.kind === "opening") renderOpening(cfg, container);
    if (cfg.kind === "stars") renderStars(cfg, container);
    if (cfg.kind === "memories") renderMemories(cfg, container);
    if (cfg.kind === "flower") renderFlower(cfg, container);
    if (cfg.kind === "wish") renderWish(cfg, container);
    if (cfg.kind === "ending") renderEnding(cfg, container);
  }

  function renderOpening(cfg, box) {
    box.innerHTML =
      '<h2 class="paper-title">' + cfg.title + "</h2>" +
      '<p class="greeting">' + cfg.greeting + "</p>" +
      '<p class="body-text">' + cfg.body + "</p>" +
      '<p class="signature">' + cfg.signature + "</p>";

    reserveNextBtn(box);

    gsap.delayedCall(1.5, function () {
      showNext(box, "收好这封信");
    });
  }

  function generateEllipsePath(cx, cy, rx, ry) {
    return "M " + (cx - rx) + " " + cy + " A " + rx + " " + ry + " 0 1 0 " + (cx + rx) + " " + cy + " A " + rx + " " + ry + " 0 1 0 " + (cx - rx) + " " + cy;
  }

  function renderMemories(cfg, box) {
    var data = cfg.orbit || {};
    var images = data.images || [];
    var baseW = 700;
    var baseH = 700;
    var cx = baseW / 2;
    var cy = baseH / 2;
    var rx = data.radiusX || 300;
    var ry = data.radiusY || 110;
    var rotation = data.rotation != null ? data.rotation : -8;
    var duration = data.duration || 28;
    var itemSize = data.itemSize || 70;
    var path = generateEllipsePath(cx, cy, rx, ry);

    var hasOffsetPath = CSS && CSS.supports && (CSS.supports("offset-path", 'path("M 0 0 L 1 1")') || CSS.supports("offset-path", "path(%)"));

    box.innerHTML =
      '<h2 class="memories-title">' + cfg.title + "</h2>" +
      '<div class="orbit-stage" id="orbit-stage">' +
      '<div class="orbit-design" style="--design-w:' + baseW + "px;--design-h:" + baseH + 'px;">' +
      '<div class="orbit-wrapper" id="orbit-wrapper" style="--orbit-rot:' + rotation + 'deg;">' +
      '<svg class="orbit-path-debug" viewBox="0 0 ' + baseW + " " + baseH + '" aria-hidden="true">' +
      '<path d="' + path + '" fill="none" stroke="rgba(167,139,250,0.18)" stroke-width="2"/></svg>' +
      "</div></div></div>" +
      '<p class="body-text" style="text-align:center">' + (cfg.caption || "") + "</p>";

    var stage = $("#orbit-stage", box);
    var design = $(".orbit-design", box);
    var wrapper = $("#orbit-wrapper", box);

    var center = document.createElement("div");
    center.className = "orbit-center";
    center.innerHTML =
      '<span class="orbit-center-eyebrow">' + (cfg.centerEyebrow || "") + "</span>" +
      '<span class="orbit-center-title">' + (cfg.centerTitle || "") + "</span>" +
      '<span class="orbit-center-sub">' + (cfg.centerSub || "") + "</span>";
    design.appendChild(center);

    if (!hasOffsetPath) {
      stage.classList.add("no-offsetpath");
      wrapper.style.display = "none";
      images.forEach(function (src) {
        var item = document.createElement("div");
        item.className = "orbit-item";
        item.innerHTML = '<div class="orbit-item-inner"><img src="' + src + '" alt="回忆" loading="lazy"></div>';
        stage.appendChild(item);
      });
      reserveNextBtn(box);
      gsap.delayedCall(3.5, function () {
        showMemoriesNext(box, cfg);
      });
      return;
    }

    var items = [];
    images.forEach(function (src, index) {
      var item = document.createElement("div");
      item.className = "orbit-item";
      item.style.setProperty("--item-size", itemSize + "px");
      item.style.setProperty("offset-path", 'path("' + path + '")');
      var inner = document.createElement("div");
      inner.className = "orbit-item-inner";
      inner.style.setProperty("--orbit-rot", rotation + "deg");
      var img = document.createElement("img");
      img.src = src;
      img.alt = "回忆 " + (index + 1);
      img.loading = "lazy";
      img.draggable = false;
      inner.appendChild(img);
      item.appendChild(inner);
      wrapper.appendChild(item);
      items.push({ el: item, offset: index / images.length });
    });

    gsap.set(design, { autoAlpha: 0, scale: 0.9 });
    gsap.to(design, { autoAlpha: 1, scale: 1, duration: 0.8, ease: "power3.out" });

    var progress = 0;
    var ticker = gsap.ticker.add(function (time, delta) {
      if (!duration) return;
      progress += (delta / 1000) / duration;
      if (progress > 1) progress -= 1;
      items.forEach(function (it) {
        var d = (progress + it.offset) % 1;
        it.el.style.offsetDistance = (d * 100).toFixed(3) + "%";
      });
    });

    reserveNextBtn(box);

    gsap.delayedCall(3.5, function () {
      showMemoriesNext(box, cfg);
    });

    box._orbitTicker = ticker;
  }

  function showMemoriesNext(box, cfg) {
    if (box._memoriesShown) return;
    box._memoriesShown = true;
    gsap.delayedCall(0.4, function () {
      showNext(box, "收好这份回忆");
    });
  }

  function renderStars(cfg, box) {
    app.starsLit = 0;
    box.innerHTML =
      '<h2 class="paper-title">' + cfg.heading + "</h2>" +
      '<div class="counter">已点亮 <span id="star-count">0</span> / 21</div>' +
      '<div class="star-grid-wrap"></div>' +
      '<div class="compliment-card" id="compliment-card"></div>';

    const grid = document.createElement("div");
    grid.className = "star-grid";
    cfg.compliments.forEach(function (text, index) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "star-btn";
      btn.setAttribute("aria-label", "点亮第 " + (index + 1) + " 颗星星");
      btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.4l-6.1 3.2 1.4-6.8L2.2 9.1l6.9-.8z"/></svg>';
      btn.addEventListener("click", function () {
        lightStar(btn, text, cfg, box);
      });
      grid.appendChild(btn);
    });
    $(".star-grid-wrap", box).appendChild(grid);

    reserveNextBtn(box);
  }

  function lightStar(btn, text, cfg, box) {
    if (btn.classList.contains("lit")) return;
    btn.classList.add("lit");
    app.starsLit++;
    $("#star-count", box).textContent = app.starsLit;
    const card = $("#compliment-card", box);
    card.innerHTML = "";
    const p = document.createElement("p");
    p.textContent = "第 " + app.starsLit + " 颗星：" + text;
    card.appendChild(p);
    gsap.fromTo(card, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45 });
    sparkleAt(btn);

    if (app.starsLit === cfg.compliments.length) {
      gsap.delayedCall(1.1, function () {
        card.innerHTML = '<p class="final-line">' + cfg.final + "</p>";
        gsap.fromTo(card, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6 });
        burst(window.innerWidth / 2, window.innerHeight * 0.55, { count: 120, spread: 120, shapes: ["star", "circle"] });
        gsap.delayedCall(1.3, function () {
          showNext(box, "星星收好");
        });
      });
    }
  }

  function renderFlower(cfg, box) {
    app.flowerChosen = false;
    const options = cfg.options
      .map(function (opt) {
        return (
          '<button type="button" class="option-card" data-id="' + opt.id + '">' +
          '<span class="opt-icon">' + opt.icon + "</span><span>" + opt.name + "</span></button>"
        );
      })
      .join("");
    box.innerHTML =
      '<h2 class="paper-title">送花</h2>' +
      '<p class="flower-question">' + cfg.question + "</p>" +
      '<div class="flower-options">' + options + "</div>" +
      '<div class="result-card" id="flower-result"></div>';

    $$(".option-card", box).forEach(function (btn) {
      btn.addEventListener("click", function () {
        chooseFlower(btn.dataset.id, cfg, box);
      });
    });

    reserveNextBtn(box);
  }

  function chooseFlower(id, cfg, box) {
    if (app.flowerChosen) return;
    app.flowerChosen = true;
    const opt = cfg.options.find(function (item) {
      return item.id === id;
    });
    const result = $("#flower-result", box);

    if (opt.id === "money") {
      result.innerHTML = '<div class="money-flower">' + MONEY_SVG + "</div><p class=\"flower-message\">" + opt.message + "</p>";
    } else {
      result.innerHTML =
        '<img class="flower-img" src="' + opt.image + '" alt="' + opt.name + '" loading="lazy">' +
        '<p class="flower-message">' + opt.message + "</p>";
    }
    result.classList.add("show");
    gsap.fromTo(result, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 });
    confetti({
      particleCount: 60,
      spread: 85,
      origin: { x: 0.5, y: 0.62 },
      colors: ["#f43f5e", "#fbbf24", "#f9a8d4", "#86efac"],
      scalar: 0.8
    });
    gsap.delayedCall(1.7, function () {
      showNext(box, "收好这朵花");
    });
  }

  function renderWish(cfg, box) {
    box.innerHTML =
      '<p class="wish-line1">' + cfg.line1 + "</p>" +
      '<p class="wish-line2">' + cfg.line2 + "</p>" +
      '<div class="cake-stage">' + CAKE_SVG + "</div>" +
      '<p class="wish-prompt">' + cfg.prompt + "</p>" +
      '<p class="wish-after">' + cfg.after + "</p>";

    reserveNextBtn(box);

    startFlameFlicker();

    gsap.delayedCall(2.8, blowOutCandles);
    gsap.delayedCall(4.8, function () {
      gsap.to(".wish-after", { opacity: 1, y: 0, duration: 0.6 });
      gsap.delayedCall(1.2, function () {
        showNext(box, "愿望收好");
      });
    });
  }

  function startFlameFlicker() {
    if (!app.flameTweens) app.flameTweens = [];
    $$(".flame", $("#letter-stage")).forEach(function (flame) {
      const tl = gsap.timeline({ repeat: -1, defaults: { ease: "sine.inOut", transformOrigin: "50% 100%" } });
      tl.to(flame, { scaleY: 0.82, scaleX: 1.14, rotation: -6, duration: 0.09 })
        .to(flame, { scaleY: 1.08, scaleX: 0.88, rotation: 6, duration: 0.13 })
        .to(flame, { scaleY: 0.94, scaleX: 1.03, rotation: -2, duration: 0.1 });
      flame._flickerTl = tl;
      app.flameTweens.push(tl);
    });
    $$(".flame-inner", $("#letter-stage")).forEach(function (inner) {
      const tl = gsap.timeline({ repeat: -1, defaults: { ease: "sine.inOut", transformOrigin: "50% 100%" } });
      tl.to(inner, { scaleY: 0.88, scaleX: 1.08, duration: 0.1 })
        .to(inner, { scaleY: 1.05, scaleX: 0.94, duration: 0.13 })
        .to(inner, { scaleY: 0.96, scaleX: 1, duration: 0.09 });
      inner._flickerTl = tl;
      app.flameTweens.push(tl);
    });
  }

  function blowOutCandles() {
    const flames = $$(".flame", $("#letter-stage"));
    flames.forEach(function (flame, index) {
      gsap.delayedCall(index * 0.45, function () {
        if (flame._flickerTl) flame._flickerTl.kill();
        const inner = $(".flame-inner", flame.parentElement);
        if (inner && inner._flickerTl) inner._flickerTl.kill();
        gsap.to(flame, {
          scaleY: 0,
          opacity: 0,
          duration: 0.45,
          ease: "power2.in",
          transformOrigin: "50% 100%"
        });
        gsap.to(inner, {
          scaleY: 0,
          opacity: 0,
          duration: 0.35,
          ease: "power2.in"
        });
        const rect = flame.getBoundingClientRect();
        spawnSmoke(rect.left + rect.width / 2, rect.top + rect.height / 2);
      });
    });
  }

  function spawnSmoke(x, y) {
    for (let i = 0; i < 3; i++) {
      const puff = document.createElement("div");
      puff.className = "smoke-puff";
      puff.style.left = x + (Math.random() * 16 - 8) + "px";
      puff.style.top = y + Math.random() * 4 + "px";
      document.body.appendChild(puff);
      gsap.to(puff, {
        y: -34 - Math.random() * 30,
        x: Math.random() * 20 - 10,
        autoAlpha: 0,
        scale: 1.8,
        duration: 1.3 + Math.random() * 0.7,
        ease: "power1.out",
        delay: i * 0.18,
        onComplete: function () {
          puff.remove();
        }
      });
    }
  }

  function renderEnding(cfg, box) {
    box.innerHTML =
      '<h2 class="paper-title">' + cfg.title + "</h2>" +
      '<p class="greeting">' + cfg.greeting + "</p>" +
      '<p class="body-text">' + cfg.body + "</p>" +
      '<p class="signature">' + cfg.signature + "</p>" +
      '<p class="ending-date">' + cfg.date + "</p>";

    reserveNextBtn(box);

    fireworks(4);
    gsap.delayedCall(5.2, function () {
      showNext(box, "收好这封信");
    });
  }

  function fireworks(rounds) {
    for (let i = 0; i < rounds; i++) {
      gsap.delayedCall(i * 0.9, function () {
        burst(
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight * 0.7,
          { count: 90, spread: 120, shapes: ["star", "circle"] }
        );
      });
    }
  }

  function reserveNextBtn(box) {
    if ($(".next-btn", box)) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-primary next-btn";
    btn.textContent = "下一封信";
    btn.style.opacity = "0";
    btn.style.transform = "translateY(8px)";
    btn.style.pointerEvents = "none";
    btn.addEventListener("click", function () {
      closeLetter(app.index);
    });
    box.appendChild(btn);
  }

  function showNext(box, label) {
    var btn = $(".next-btn", box);
    if (btn) {
      if (label) btn.textContent = label;
      gsap.to(btn, { opacity: 1, y: 0, pointerEvents: "auto", duration: 0.5, ease: "power2.out" });
    }
  }

  function closeLetter(index) {
    if (app.busy) return;
    app.busy = true;
    const scene = $("#letter-stage .letter-scene");
    const paper = $(".letter-paper", scene);
    const box = $(".paper-inner", scene) || paper;
    paper.classList.remove("open");
    const env = $(".envelope", scene);
    env.classList.remove("opened");
    env.style.display = "";
    if (app.flameTweens) {
      app.flameTweens.forEach(function (tl) { tl.kill(); });
      app.flameTweens = [];
    }
    if (box && box._orbitTicker) {
      gsap.ticker.remove(box._orbitTicker);
      box._orbitTicker = null;
    }

    const tl = gsap.timeline({
      onComplete: function () {
        gsap.to(scene, {
          autoAlpha: 0,
          y: -24,
          duration: 0.55,
          ease: "power2.in",
          onComplete: function () {
            scene.remove();
            if (index < CONFIG.letters.length - 1) {
              showLetter(index + 1);
            } else {
              finish();
            }
            app.busy = false;
          }
        });
      }
    });
    tl.to(paper, { autoAlpha: 0, y: 20, scale: 0.98, duration: 0.5, ease: "power2.in" }, 0)
      .to(env, { autoAlpha: 1, y: 0, scale: 1, duration: 0.4 }, 0)
      .to($(".env-letter", env), { yPercent: 0, duration: 0.6, ease: "power2.in" }, 0.2)
      .to($(".env-flap", env), { rotationX: 0, duration: 0.6, ease: "power3.inOut" }, 0.55)
      .call(function () {
        env.classList.remove("opening");
        env.classList.add("closing");
      }, [], 0.85);
  }

  function finish() {
    $("#scene-letter").classList.remove("active");
    $("#curtain-sub").textContent = "To " + CONFIG.recipient + " · From " + CONFIG.sender;
    $("#curtain-date").textContent = CONFIG.date;
    gsap.to("#curtain", { autoAlpha: 1, duration: 1.2, ease: "power2.out" });

    if (window.Galaxy) {
      app.galaxy = new window.Galaxy({
        container: "#curtain-galaxy",
        focal: [0.5, 0.5],
        rotation: [1.0, 0.0],
        starSpeed: 0.5,
        density: 1.5,
        hueShift: 200,
        speed: 1.0,
        mouseInteraction: true,
        glowIntensity: 0.4,
        saturation: 0.7,
        mouseRepulsion: true,
        repulsionStrength: 2,
        twinkleIntensity: 0.4,
        rotationSpeed: 0.08,
        transparent: true,
      });
      try {
        app.galaxy.init();
      } catch (e) {
        app.galaxy = null;
      }
    }

    if (window.LightRays) {
      app.lightRays = new window.LightRays({
        container: "#curtain-rays",
        raysOrigin: "top-center",
        raysColor: "#fde68a",
        raysSpeed: 1.2,
        lightSpread: 0.6,
        rayLength: 1.6,
        pulsating: true,
        fadeDistance: 1.2,
        saturation: 0.85,
        followMouse: true,
        mouseInfluence: 0.08,
        noiseAmount: 0.08,
        distortion: 0.03,
      });
      try {
        app.lightRays.init();
      } catch (e) {
        app.lightRays = null;
      }
    }

    fireworks(5);
    gsap.to("#bgm", {
      volume: 0,
      duration: 2.5,
      onComplete: function () {
        $("#bgm").pause();
      }
    });
  }

  document.addEventListener("click", function (event) {
    const interactive = event.target.closest("button, a, .envelope, .envelope-shell");
    if (interactive) return;
    burst(event.clientX, event.clientY, { count: 36, spread: 70 });
  });

  if ("serviceWorker" in navigator) {
    const secure = location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1";
    if (secure) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("sw.js").catch(function () {});
      });
    }
  }

  window.addEventListener("DOMContentLoaded", function () {
    initCover();
    initBackground();
  });
})();
