/**
 * Botón "volver arriba" que aparece cuando el usuario hace scroll
 * dentro del panel de contenido. Se autoinstala al importarse y
 * no necesita que main.js sepa de su existencia.
 */
const SHOW_THRESHOLD = 240;

function findScrollTarget() {
  return (
    document.querySelector(".content") ||
    document.querySelector("main") ||
    document.scrollingElement ||
    document.body
  );
}

function buildButton() {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "scroll-top";
  btn.setAttribute("aria-label", "Scroll to top");
  btn.setAttribute("title", "Top");
  btn.innerHTML = "<span aria-hidden=\"true\">▲</span>";
  btn.hidden = true;
  return btn;
}

function attach() {
  if (document.querySelector(".scroll-top")) return;
  const target = findScrollTarget();
  if (!target) return;
  const btn = buildButton();
  document.body.appendChild(btn);

  const onScroll = () => {
    const y = "scrollTop" in target ? target.scrollTop : window.scrollY;
    btn.hidden = y < SHOW_THRESHOLD;
  };
  const scroller = target === document.body || target === document.scrollingElement ? window : target;
  scroller.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  btn.addEventListener("click", () => {
    if ("scrollTo" in target && target !== window) {
      target.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", attach, { once: true });
} else {
  attach();
}

const reattach = () => {
  if (!document.body.contains(document.querySelector(".scroll-top"))) attach();
};
const obs = new MutationObserver(reattach);
obs.observe(document.body, { childList: true, subtree: false });
