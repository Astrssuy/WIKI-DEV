/**
 * Animación de typewriter en el elemento .hero__type del CRT.
 * Lee el texto inicial, lo limpia y lo "tipea" carácter a carácter.
 * Respeta `prefers-reduced-motion` para evitar movimiento innecesario.
 */
const SPEED_MS = 35;
const START_DELAY_MS = 400;

function shouldAnimate() {
  return !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function typeInto(el, text, speed) {
  let i = 0;
  el.textContent = "";
  function step() {
    if (i >= text.length) return;
    el.textContent += text.charAt(i++);
    setTimeout(step, speed);
  }
  step();
}

function run() {
  const target = document.querySelector(".hero__type, [data-typewriter]");
  if (!target) return;
  const text = (target.getAttribute("data-text") || target.textContent || "").trim();
  if (!text) return;
  if (!shouldAnimate()) {
    target.textContent = text;
    return;
  }
  setTimeout(() => typeInto(target, text, SPEED_MS), START_DELAY_MS);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", run, { once: true });
} else {
  run();
}
