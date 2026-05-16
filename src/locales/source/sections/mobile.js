export const mobileSection = {
  id: "mobile",
  title: "Mobile & responsive",
  icon: "▭",
  summary: "Viewport, touch targets, responsive layouts, and PWAs that actually feel mobile.",
  blocks: [
    {
      type: "text",
      content:
        "Most users open your site on a phone. Designing mobile-first isn't a trend — it's the constraint that keeps interfaces honest. Once it works on a 360px screen with a thumb, it tends to work everywhere.",
    },
    {
      type: "list",
      title: "Viewport & units",
      items: [
        "`<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">` — non-negotiable.",
        "Prefer `rem` for typography and spacing — scales with user font-size.",
        "`vh` is buggy on mobile (URL bar); use `dvh` / `svh` / `lvh` (dynamic/small/large).",
        "`clamp(min, preferred, max)` gives fluid type without breakpoints.",
      ],
    },
    {
      type: "code",
      lang: "css",
      code: `/* Fluid type and safe full-height */
:root { font-size: clamp(0.95rem, 0.85rem + 0.4vw, 1.15rem); }

.hero {
  min-height: 100dvh;    /* dynamic viewport height — survives URL bar */
  padding: max(1rem, env(safe-area-inset-top)) 1rem;
}

/* Mobile-first: small by default, override up */
.grid { display: grid; gap: 1rem; }
@media (min-width: 48rem) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}`,
    },
    {
      type: "list",
      title: "Touch targets & gestures",
      items: [
        "Minimum hit area ≈ 44×44px (Apple HIG) / 48×48dp (Android).",
        "Increase spacing between tappable items; thumbs are not styluses.",
        "`touch-action: pan-y` on horizontally swipable widgets prevents browser hijack.",
        "Avoid `:hover`-only affordances; mobile users never see them.",
        "Native `<input type=\"tel\">`, `\"email\"`, `\"number\"` give the right keyboard.",
      ],
    },
    {
      type: "list",
      title: "Responsive images",
      items: [
        "`srcset` + `sizes` — let the browser pick the right resolution.",
        "Modern formats: `<picture>` with `image/avif` then `image/webp` then JPEG fallback.",
        "Lazy load below-the-fold with `loading=\"lazy\"`.",
        "Always set `width`/`height` (or `aspect-ratio`) to avoid layout shifts (CLS).",
      ],
    },
    {
      type: "code",
      lang: "html",
      code: `<picture>
  <source srcset="/hero.avif" type="image/avif" />
  <source srcset="/hero.webp" type="image/webp" />
  <img
    src="/hero.jpg"
    width="1200"
    height="630"
    alt="Retro CRT terminal on a desk"
    loading="lazy"
  />
</picture>`,
    },
    {
      type: "list",
      title: "Progressive Web Apps (PWA) basics",
      items: [
        "`manifest.webmanifest` — name, icons, theme color, display: standalone.",
        "Service Worker — offline cache, background sync; Workbox automates the boring bits.",
        "Install prompt — listen to `beforeinstallprompt` and show your own button.",
        "Test on a real phone, not just DevTools device mode.",
        "Lighthouse PWA audit catches most missing pieces.",
      ],
    },
    {
      type: "text",
      content:
        "If your app feels janky on a mid-range Android with throttled network in DevTools, it feels janky in real life for half your users. Optimize for the median device, not the iPhone Pro on the engineer's desk.",
    },
  ],
};
