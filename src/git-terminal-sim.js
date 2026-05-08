/**
 * Consola Git simulada + visualizador 8-bit del árbol de trabajo.
 * Subconjunto de comandos; estado en memoria (solo sesión).
 */

function initialState() {
  return {
    branch: "main",
    branches: ["main"],
    /** @type {Record<string, { tracked: boolean; work: "clean" | "modified"; staged: boolean }>} */
    files: {
      "README.md": { tracked: true, work: "modified", staged: false },
      "app.js": { tracked: true, work: "clean", staged: false },
    },
    /** @type {{ hash: string; msg: string }[]} */
    commits: [{ hash: "e4f9012", msg: "init snapshot" }],
  };
}

function shortenHash(s) {
  return s.slice(0, 7);
}

/**
 * @param {HTMLElement} root
 * @param {(k: string, o?: object) => string} t
 * @param {AbortSignal} signal
 * @returns {() => void}
 */
export function mountGitTerminal(root, t, signal) {
  function escAttr(s0) {
    return String(s0)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  let state = initialState();
  let rafId = 0;
  let alive = true;
  const t0 = performance.now();

  root.innerHTML = `
    <div class="git-term">
      <div class="git-term__viz-wrap">
        <p class="git-term__viz-title">${escAttr(t("gitGame.vizTitle"))}</p>
        <canvas class="git-term__viz-canvas" width="520" height="200" aria-hidden="true"></canvas>
        <p class="git-term__viz-legend" data-viz-legend></p>
      </div>
      <div class="git-term__panel">
        <p class="git-term__hint">${escAttr(t("gitGame.terminalHint"))}</p>
        <div class="git-term__log" data-terminal-log role="log" aria-live="polite"></div>
        <div class="git-term__input-row">
          <span class="git-term__prompt">$</span>
          <input type="text" class="git-term__input" data-terminal-input autocomplete="off" spellcheck="false"
            placeholder="${escAttr(t("gitGame.terminalPlaceholder"))}" aria-label="${escAttr(t("gitGame.terminalInputLabel"))}" />
        </div>
        <div class="git-term__actions">
          <button type="button" class="git-game__btn" data-term-help>${escAttr(t("gitGame.terminalHelpBtn"))}</button>
          <button type="button" class="git-game__btn git-game__btn--ghost" data-term-clear>${escAttr(t("gitGame.terminalClearBtn"))}</button>
          <button type="button" class="git-game__btn git-game__btn--ghost" data-term-reset>${escAttr(t("gitGame.terminalResetBtn"))}</button>
        </div>
      </div>
    </div>
  `;

  const logEl = root.querySelector("[data-terminal-log]");
  const inputEl = root.querySelector("[data-terminal-input]");
  const canvas = root.querySelector(".git-term__viz-canvas");
  const legendEl = root.querySelector("[data-viz-legend]");
  /** @type {CanvasRenderingContext2D | null} */
  const ctx = canvas.getContext("2d");

  function randomHash() {
    return [...Array(7)]
      .map(() => "0123456789abcdef"[Math.floor(Math.random() * 16)])
      .join("");
  }

  function log(line, cls = "") {
    String(line)
      .split("\n")
      .forEach((chunk) => {
        const row = document.createElement("div");
        row.className = "git-term-line " + cls;
        row.textContent = chunk;
        logEl.appendChild(row);
      });
    logEl.scrollTop = logEl.scrollHeight;
  }

  function formatStatus() {
    const lines = [`${t("gitTerm.onBranch")} ${state.branch}`];
    const unstaged = Object.entries(state.files).filter(
      ([, f]) => f.tracked && f.work === "modified" && !f.staged,
    );
    const staged = Object.entries(state.files).filter(([, f]) => f.staged);
    if (staged.length) {
      lines.push(t("gitTerm.staged"));
      staged.forEach(([name]) => lines.push(`\t${name}`));
    }
    if (unstaged.length) {
      lines.push(t("gitTerm.unstaged"));
      unstaged.forEach(([name]) => lines.push(`\tmodified: ${name}`));
    }
    if (!staged.length && !unstaged.length) {
      lines.push(t("gitTerm.clean"));
    }
    return lines.join("\n");
  }

  function drawViz() {
    if (!ctx || !alive) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#030508";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#39ffc8";
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, w - 4, h - 4);

    const pulse = 0.5 + 0.5 * Math.sin((performance.now() - t0) / 400);
    const cols = [
      { x: 12, label: t("gitTerm.colWork"), w: 150 },
      { x: 178, label: t("gitTerm.colIndex"), w: 150 },
      { x: 344, label: t("gitTerm.colHead"), w: 160 },
    ];

    ctx.font = "bold 9px JetBrains Mono, monospace";
    ctx.fillStyle = "#ffb347";
    cols.forEach((c) => ctx.fillText(c.label, c.x, 22));

    ctx.strokeStyle = "#2a3548";
    ctx.beginPath();
    ctx.moveTo(166, 8);
    ctx.lineTo(166, h - 8);
    ctx.moveTo(332, 8);
    ctx.lineTo(332, h - 8);
    ctx.stroke();

    let y = 40;
    const files = Object.entries(state.files);
    files.forEach(([name, f]) => {
      const rowH = 28;
      const dot = (x, color, glow) => {
        ctx.fillStyle = glow ? `rgba(57,255,200,${0.35 + 0.35 * pulse})` : "#0f141c";
        ctx.fillRect(x, y, 16, 16);
        ctx.strokeStyle = color;
        ctx.strokeRect(x, y, 16, 16);
      };
      dot(cols[0].x + 4, f.work === "modified" ? "#ffb347" : "#2a3548", f.work === "modified");
      dot(cols[1].x + 4, f.staged ? "#39ffc8" : "#2a3548", f.staged);
      ctx.fillStyle = "#7a9e94";
      ctx.font = "10px JetBrains Mono, monospace";
      ctx.fillText(name.slice(0, 18), cols[0].x + 28, y + 12);
      y += rowH;
    });

    const tip = state.commits[state.commits.length - 1];
    ctx.fillStyle = `rgba(255,179,71,${0.55 + 0.25 * pulse})`;
    ctx.font = "10px JetBrains Mono, monospace";
    ctx.fillText(shortenHash(tip.hash), cols[2].x + 8, 52);
    ctx.fillStyle = "#c8f7e8";
    const msg = tip.msg.length > 22 ? `${tip.msg.slice(0, 22)}…` : tip.msg;
    ctx.fillText(msg, cols[2].x + 8, 68);
    ctx.fillStyle = "#7a94ff";
    ctx.font = "8px JetBrains Mono, monospace";
    ctx.fillText(`branch: ${state.branch}`, cols[2].x + 8, 92);

    legendEl.textContent = t("gitGame.vizLegend");

    rafId = requestAnimationFrame(drawViz);
  }

  function exec(lineRaw) {
    const line = lineRaw.trim();
    if (!line) return;
    log(`$ ${line}`, "git-term-line--cmd");

    const lower = line.toLowerCase();
    if (lower === "clear") {
      logEl.innerHTML = "";
      return;
    }
    if (lower === "help" || lower === "git help") {
      log(t("gitTerm.helpBody"));
      return;
    }

    if (!lower.startsWith("git ")) {
      log(t("gitTerm.errUnknown"), "git-term-line--err");
      return;
    }

    const body = line.slice(4).trim();
    const parts = body.match(/(?:[^\s"]+|"[^"]*")+/g)?.map((p) => p.replace(/^"|"$/g, "")) ?? [];

    if (parts[0] === "status") {
      log(formatStatus());
      return;
    }

    if (parts[0] === "add") {
      if (parts[1] === "." || parts[1] === "-A") {
        let n = 0;
        Object.keys(state.files).forEach((k) => {
          const f = state.files[k];
          if (f.work === "modified") {
            f.staged = true;
            n++;
          }
        });
        log(n ? t("gitTerm.okStaged", { n }) : t("gitTerm.nothingToStage"));
        return;
      }
      const file = parts[1];
      if (!file || !state.files[file]) {
        log(t("gitTerm.errNoFile"), "git-term-line--err");
        return;
      }
      if (state.files[file].work !== "modified") {
        log(t("gitTerm.errAlreadyClean"), "git-term-line--err");
        return;
      }
      state.files[file].staged = true;
      log(t("gitTerm.okStagedOne", { file }));
      return;
    }

    if (parts[0] === "restore" && parts[1] === "--staged") {
      const file = parts[2];
      if (!file || !state.files[file]) {
        log(t("gitTerm.errNoFile"), "git-term-line--err");
        return;
      }
      state.files[file].staged = false;
      log(t("gitTerm.okUnstaged", { file }));
      return;
    }

    if (parts[0] === "commit" && parts[1] === "-m") {
      const msg = parts.slice(2).join(" ");
      if (!msg) {
        log(t("gitTerm.errNeedMsg"), "git-term-line--err");
        return;
      }
      const staged = Object.entries(state.files).filter(([, f]) => f.staged);
      if (!staged.length) {
        log(t("gitTerm.errNothingStaged"), "git-term-line--err");
        return;
      }
      staged.forEach(([name, f]) => {
        f.staged = false;
        f.work = "clean";
      });
      const h = randomHash();
      state.commits.push({ hash: h, msg });
      log(t("gitTerm.okCommit", { h: shortenHash(h), msg }));
      return;
    }

    if (parts[0] === "branch") {
      if (parts.length === 1) {
        state.branches.forEach((b) => log(`${b === state.branch ? "* " : "  "}${b}`));
        return;
      }
      const name = parts[1];
      if (state.branches.includes(name)) {
        log(t("gitTerm.errBranchExists"), "git-term-line--err");
        return;
      }
      state.branches.push(name);
      log(t("gitTerm.okBranch", { name }));
      return;
    }

    if (parts[0] === "switch" || parts[0] === "checkout") {
      const name = parts[1];
      if (!name) {
        log(t("gitTerm.errNeedBranch"), "git-term-line--err");
        return;
      }
      if (!state.branches.includes(name)) {
        log(t("gitTerm.errBranchMissing"), "git-term-line--err");
        return;
      }
      state.branch = name;
      log(t("gitTerm.okSwitch", { name }));
      return;
    }

    if (parts[0] === "log") {
      state.commits
        .slice()
        .reverse()
        .forEach((c) => {
          log(`${shortenHash(c.hash)}  ${c.msg}`);
        });
      return;
    }

    log(t("gitTerm.errNotImpl"), "git-term-line--err");
  }

  drawViz();

  inputEl.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Enter") {
        exec(inputEl.value);
        inputEl.value = "";
      }
    },
    { signal },
  );

  root.querySelector("[data-term-help]").addEventListener("click", () => log(t("gitTerm.helpBody")), { signal });
  root.querySelector("[data-term-clear]").addEventListener("click", () => {
    logEl.innerHTML = "";
  }, { signal });
  root.querySelector("[data-term-reset]").addEventListener(
    "click",
    () => {
      state = initialState();
      logEl.innerHTML = "";
      log(t("gitTerm.resetDone"));
    },
    { signal },
  );

  log(t("gitTerm.welcome"));

  return () => {
    alive = false;
    cancelAnimationFrame(rafId);
  };
}
