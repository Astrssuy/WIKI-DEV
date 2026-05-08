/**
 * Minijuegos Git: 3 niveles, contenido por idioma (`locales/games/*.json`).
 */

import { mountGitTerminal } from "./git-terminal-sim.js";

const STORAGE = "gitArcade_v4";
const MODE_KEY = `${STORAGE}_mode`;

function maxUnlock() {
  const n = parseInt(sessionStorage.getItem(`${STORAGE}_unlock`) || "1", 10);
  return Number.isFinite(n) ? Math.min(3, Math.max(1, n)) : 1;
}

function setMaxUnlock(n) {
  sessionStorage.setItem(`${STORAGE}_unlock`, String(Math.min(3, Math.max(1, n))));
}

function markPart(levelId, part) {
  sessionStorage.setItem(`${STORAGE}_L${levelId}_${part}`, "1");
}

function isPartDone(levelId, part) {
  return sessionStorage.getItem(`${STORAGE}_L${levelId}_${part}`) === "1";
}

/**
 * @param {HTMLElement} root
 * @param {(key: string, opts?: object) => string} tr
 * @param {ReturnType<typeof getGamePack>} pack
 */
export function mountGitGames(root, tr, pack) {
  const t = tr;
  let gameAc = new AbortController();
  let terminalAc = new AbortController();
  /** @type {(() => void) | null} */
  let terminalTeardown = null;
  /** @type {(() => void)[]} */
  let gameCleanups = [];
  let currentLevel = 1;
  let mode = sessionStorage.getItem(MODE_KEY) === "terminal" ? "terminal" : "missions";

  function esc(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  root.innerHTML = `
    <div class="git-arcade">
      <header class="git-arcade__header">
        <span class="git-arcade__pill">8-BIT LAB</span>
        <h3 class="git-arcade__title">${esc(t("gitGame.blockTitle"))}</h3>
        <p class="git-arcade__sub">${esc(t("gitGame.blockSubtitle"))}</p>
      </header>

      <div class="git-mode-bar" role="group" aria-label="${esc(t("gitGame.modeBarAria"))}">
        <div class="git-mode-bar__toggles">
          <button type="button" class="git-mode-btn" data-mode="missions" aria-pressed="true">
            ${esc(t("gitGame.modeMissions"))}
          </button>
          <button type="button" class="git-mode-btn" data-mode="terminal" aria-pressed="false">
            ${esc(t("gitGame.modeTerminal"))}
          </button>
        </div>
        <p class="git-mode-bar__hint">${esc(t("gitGame.modeHint"))}</p>
      </div>

      <div class="git-missions" data-git-missions>
      <div class="git-level-bar">
        <span class="git-level-bar__label">${esc(t("gitGame.levelPick"))}</span>
        <nav class="git-level-tabs" data-level-tabs aria-label="${esc(t("gitGame.levelPick"))}"></nav>
        <p class="git-level-bar__hint" data-level-hint>${esc(t("gitGame.levelLocked"))}</p>
        <p class="git-level-bar__status" data-level-status></p>
      </div>

      <section class="git-game git-game--quiz" aria-label="quiz">
        <h4 class="git-game__title" data-quiz-heading></h4>
        <p class="git-game__q" data-quiz-q></p>
        <div class="git-game__opts" data-quiz-opts></div>
        <p class="git-game__hud"><span data-quiz-score>0</span> · <span data-quiz-progress></span></p>
        <p class="git-game__msg" data-quiz-msg hidden></p>
        <button type="button" class="git-game__btn git-game__btn--ghost" data-quiz-again hidden>${esc(t("gitGame.playAgain"))}</button>
      </section>

      <section class="git-game git-game--sequence" aria-label="sequence">
        <h4 class="git-game__title">${esc(t("gitGame.seqTitle"))}</h4>
        <p class="git-game__hint" data-seq-hint></p>
        <div class="git-game__pixel-row" data-seq-row></div>
        <p class="git-game__msg" data-seq-msg></p>
        <button type="button" class="git-game__btn" data-seq-reset>${esc(t("gitGame.seqShuffle"))}</button>
      </section>

      <section class="git-game git-game--branch" aria-label="branch visual">
        <h4 class="git-game__title">${esc(t("gitGame.branchTitle"))}</h4>
        <p class="git-game__canvas-label" data-branch-canvas-label></p>
        <canvas class="git-game__canvas" data-branch-canvas width="320" height="140" aria-hidden="true"></canvas>
        <p class="git-game__q git-game__q--sm" data-branch-q></p>
        <div class="git-game__opts" data-branch-opts></div>
        <p class="git-game__msg" data-branch-msg></p>
      </section>
      </div>

      <div class="git-term-host" data-git-terminal hidden></div>
    </div>
  `;

  const missionsEl = root.querySelector("[data-git-missions]");
  const terminalHost = root.querySelector("[data-git-terminal]");
  const modeBtns = root.querySelectorAll(".git-mode-btn[data-mode]");

  const tabsEl = root.querySelector("[data-level-tabs]");
  const hintEl = root.querySelector("[data-level-hint]");
  const statusEl = root.querySelector("[data-level-status]");

  function updateLevelStatus() {
    const u = maxUnlock();
    hintEl.style.display = u >= 3 ? "none" : "";
    statusEl.textContent = t("gitGame.levelStatus", { n: currentLevel });
  }

  function tryUnlockNext(levelId) {
    if (!isPartDone(levelId, "quiz") || !isPartDone(levelId, "seq") || !isPartDone(levelId, "branch")) return;
    const u = maxUnlock();
    if (levelId === u && u < 3) {
      setMaxUnlock(u + 1);
      statusEl.textContent = t("gitGame.levelUnlocked");
      hintEl.style.display = "";
    }
    renderTabs();
  }

  function syncModeUi() {
    modeBtns.forEach((btn) => {
      const on = btn.getAttribute("data-mode") === mode;
      btn.classList.toggle("git-mode-btn--active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    missionsEl.hidden = mode !== "missions";
    terminalHost.hidden = mode !== "terminal";
  }

  function stopTerminal() {
    if (terminalTeardown) {
      try {
        terminalTeardown();
      } catch {
        /* noop */
      }
      terminalTeardown = null;
    }
    terminalAc.abort();
    terminalAc = new AbortController();
    terminalHost.innerHTML = "";
  }

  function startTerminal() {
    stopTerminal();
    terminalTeardown = mountGitTerminal(terminalHost, t, terminalAc.signal);
  }

  function setMode(next) {
    const m = next === "terminal" ? "terminal" : "missions";
    mode = m;
    sessionStorage.setItem(MODE_KEY, m);
    if (m === "terminal") {
      gameAc.abort();
      gameCleanups.forEach((fn) => {
        try {
          fn();
        } catch {
          /* noop */
        }
      });
      gameCleanups = [];
      gameAc = new AbortController();
      syncModeUi();
      startTerminal();
      queueMicrotask(() => {
        terminalHost.querySelector(".git-term__input")?.focus();
      });
    } else {
      stopTerminal();
      syncModeUi();
      remountGames();
    }
  }

  modeBtns.forEach((btn) => {
    btn.addEventListener("click", () => setMode(btn.getAttribute("data-mode") || "missions"));
  });

  function renderTabs() {
    const u = maxUnlock();
    tabsEl.innerHTML = "";
    pack.levels.forEach((lvl) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "git-level-tab" + (lvl.id === currentLevel ? " git-level-tab--active" : "");
      const locked = lvl.id > u;
      btn.disabled = locked;
      btn.innerHTML = locked
        ? `<span class="git-level-tab__lock" aria-hidden="true">!</span> ${esc(lvl.badge)}`
        : esc(lvl.badge);
      btn.addEventListener("click", () => {
        if (lvl.id > maxUnlock()) return;
        currentLevel = lvl.id;
        renderTabs();
        remountGames();
      });
      tabsEl.appendChild(btn);
    });
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function initQuiz(level, signal) {
    const qEl = root.querySelector("[data-quiz-q]");
    const optsEl = root.querySelector("[data-quiz-opts]");
    const scoreEl = root.querySelector("[data-quiz-score]");
    const progEl = root.querySelector("[data-quiz-progress]");
    const msgEl = root.querySelector("[data-quiz-msg]");
    const againBtn = root.querySelector("[data-quiz-again]");
    const heading = root.querySelector("[data-quiz-heading]");
    heading.textContent = level.quizTitle;

    let pool = shuffle([...level.quiz]);
    let idx = 0;
    let score = 0;
    const rounds = Math.min(level.quizRounds || 3, pool.length);

    function showRound() {
      msgEl.hidden = true;
      againBtn.hidden = true;
      if (idx >= rounds) {
        qEl.textContent = "";
        optsEl.innerHTML = "";
        msgEl.hidden = false;
        msgEl.className = "git-game__msg git-game__msg--ok";
        msgEl.textContent = `${t("gitGame.finalScore")} ${score}/${rounds}`;
        againBtn.hidden = false;
        progEl.textContent = t("gitGame.quizDone");
        if (!isPartDone(level.id, "quiz")) {
          markPart(level.id, "quiz");
          tryUnlockNext(level.id);
        }
        return;
      }
      const item = pool[idx];
      qEl.textContent = item.q;
      optsEl.innerHTML = "";
      item.opts.forEach((opt, oi) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "git-game__opt";
        b.textContent = opt;
        b.addEventListener(
          "click",
          () => {
            optsEl.querySelectorAll("button").forEach((x) => {
              x.disabled = true;
            });
            if (oi === item.correct) {
              score += 1;
              msgEl.hidden = false;
              msgEl.className = "git-game__msg git-game__msg--ok";
              msgEl.textContent = t("gitGame.correct");
              scoreEl.textContent = String(score);
            } else {
              msgEl.hidden = false;
              msgEl.className = "git-game__msg git-game__msg--bad";
              msgEl.textContent = t("gitGame.incorrect");
              b.classList.add("git-game__opt--wrong");
            }
            idx += 1;
            setTimeout(showRound, 520);
          },
          { signal },
        );
        optsEl.appendChild(b);
      });
      progEl.textContent = t("gitGame.quizProgress", { cur: idx + 1, total: rounds });
    }

    againBtn.addEventListener(
      "click",
      () => {
        pool = shuffle([...level.quiz]);
        idx = 0;
        score = 0;
        scoreEl.textContent = "0";
        msgEl.hidden = true;
        againBtn.hidden = true;
        showRound();
      },
      { signal },
    );

    showRound();
  }

  function initSequence(level, signal) {
    const row = root.querySelector("[data-seq-row]");
    const msg = root.querySelector("[data-seq-msg]");
    const hint = root.querySelector("[data-seq-hint]");
    const resetBtn = root.querySelector("[data-seq-reset]");
    hint.textContent = level.sequenceHint;
    const steps = [...level.sequenceSteps];
    let order = [];
    let expect = 0;

    function paint() {
      row.innerHTML = "";
      order = shuffle([...steps]);
      expect = 0;
      order.forEach((cmd) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "git-game__chip";
        b.textContent = cmd;
        b.addEventListener(
          "click",
          () => {
            if (cmd === steps[expect]) {
              expect += 1;
              b.classList.add("git-game__chip--done");
              b.disabled = true;
              msg.className = "git-game__msg git-game__msg--ok";
              msg.textContent = `${t("gitGame.seqStep")} ${expect}/${steps.length}`;
              if (expect >= steps.length) {
                msg.textContent = t("gitGame.seqWin");
                if (!isPartDone(level.id, "seq")) {
                  markPart(level.id, "seq");
                  tryUnlockNext(level.id);
                }
              }
            } else {
              msg.className = "git-game__msg git-game__msg--bad";
              msg.textContent = t("gitGame.seqFail");
              expect = 0;
              setTimeout(paint, 650);
            }
          },
          { signal },
        );
        row.appendChild(b);
      });
    }

    resetBtn.addEventListener("click", paint, { signal });
    paint();
  }

  function initBranch(level, signal) {
    const canvas = root.querySelector("[data-branch-canvas]");
    const qEl = root.querySelector("[data-branch-q]");
    const optsEl = root.querySelector("[data-branch-opts]");
    const msgEl = root.querySelector("[data-branch-msg]");
    const labelEl = root.querySelector("[data-branch-canvas-label]");
    labelEl.textContent = `${level.canvasBranchLabel} · ${t("gitGame.branchCanvasHint")}`;

    const bq = level.branchQ;
    qEl.textContent = bq.q;
    /** @type {CanvasRenderingContext2D | null} */
    const ctx = canvas.getContext("2d");
    let rafId = 0;
    const t0 = performance.now();

    function draw() {
      if (!ctx || gameAc.signal.aborted) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = "#05080c";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#2a3548";
      ctx.strokeRect(4, 4, w - 8, h - 8);

      const cy = 72;
      const xs = [48, 120, 192, 264];
      ctx.strokeStyle = "#39ffc8";
      ctx.lineWidth = 3;
      for (let i = 0; i < xs.length - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(xs[i], cy);
        ctx.lineTo(xs[i + 1], cy);
        ctx.stroke();
      }

      const pulse = 0.65 + 0.35 * Math.sin((performance.now() - t0) / 280);
      xs.forEach((x, i) => {
        ctx.fillStyle = i === 2 ? `rgba(57,255,200,${pulse})` : "#0f141c";
        ctx.fillRect(x - 14, cy - 14, 28, 28);
        ctx.strokeStyle = i === 2 ? "#ffb347" : "#39ffc8";
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 14, cy - 14, 28, 28);
        ctx.fillStyle = "#7a9e94";
        ctx.font = "10px JetBrains Mono, monospace";
        ctx.fillText(String.fromCharCode(65 + i), x - 4, cy + 4);
      });

      ctx.fillStyle = "#ffb347";
      ctx.font = "bold 11px JetBrains Mono, monospace";
      ctx.fillText("HEAD", xs[2] - 18, cy - 26);
      ctx.fillStyle = "#7a94ff";
      ctx.font = "9px JetBrains Mono, monospace";
      const br = level.canvasBranchLabel;
      ctx.fillText(br, 160, 112);

      if (!gameAc.signal.aborted) rafId = requestAnimationFrame(draw);
    }

    draw();

    optsEl.innerHTML = "";
    bq.opts.forEach((opt, oi) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "git-game__opt";
      b.textContent = opt;
      b.addEventListener(
        "click",
        () => {
          if (oi === bq.correct) {
            msgEl.className = "git-game__msg git-game__msg--ok";
            msgEl.textContent = t("gitGame.correct");
            if (!isPartDone(level.id, "branch")) {
              markPart(level.id, "branch");
              tryUnlockNext(level.id);
            }
            optsEl.querySelectorAll("button").forEach((x) => {
              x.disabled = true;
            });
          } else {
            msgEl.className = "git-game__msg git-game__msg--bad";
            msgEl.textContent = t("gitGame.incorrect");
          }
        },
        { signal },
      );
      optsEl.appendChild(b);
    });

    return () => cancelAnimationFrame(rafId);
  }

  function remountGames() {
    if (mode !== "missions") return;
    gameCleanups.forEach((fn) => {
      try {
        fn();
      } catch {
        /* noop */
      }
    });
    gameCleanups = [];
    gameAc.abort();
    gameAc = new AbortController();
    const signal = gameAc.signal;
    const level = pack.levels.find((l) => l.id === currentLevel);
    if (!level) return;

    updateLevelStatus();

    initQuiz(level, signal);
    initSequence(level, signal);
    const stopCanvas = initBranch(level, signal);
    gameCleanups.push(stopCanvas ?? (() => {}));
  }

  function onBoot() {
    currentLevel = Math.min(currentLevel, maxUnlock());
    renderTabs();
    updateLevelStatus();
    syncModeUi();
    if (mode === "terminal") {
      startTerminal();
      queueMicrotask(() => {
        terminalHost.querySelector(".git-term__input")?.focus();
      });
    } else {
      remountGames();
    }
  }

  onBoot();

  return () => {
    gameAc.abort();
    stopTerminal();
    gameCleanups.forEach((fn) => {
      try {
        fn();
      } catch {
        /* noop */
      }
    });
    gameCleanups = [];
  };
}
