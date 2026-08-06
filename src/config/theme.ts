/**
 * Site-wide theme configuration.
 *
 * Light and dark are peers, not inversions — each is a complete token block in
 * globals.css and each passes WCAG 2.2 AA independently. This module is the
 * single place the *default* is decided, so it can be switched without editing
 * a component.
 *
 * Set NEXT_PUBLIC_DEFAULT_THEME=dark at build time to flip the site default.
 * A returning visitor's stored choice (the in-page toggle) always wins over
 * this. `prefers-color-scheme` does NOT — Sumeet's explicit call, round 14:
 * every first-time visitor sees the site default regardless of their OS
 * setting, and reaches for the toggle themselves if they want dark. This is a
 * deliberate departure from the previous behaviour, which read the OS
 * preference ahead of DEFAULT_THEME.
 */

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "yallo-theme";

const configured = process.env.NEXT_PUBLIC_DEFAULT_THEME;

/**
 * Canon §2: "Light is the default register." Dark is reserved for evidence and
 * data surfaces via the `.band-invert` class, not used as the page default.
 */
export const DEFAULT_THEME: Theme = configured === "dark" ? "dark" : "light";

/**
 * Runs before first paint, inlined into <head>. Resolves the theme from
 * localStorage, else DEFAULT_THEME, and stamps it on <html> so there is no
 * flash of the wrong register.
 *
 * Deliberately does NOT consult `prefers-color-scheme` — see the module
 * comment above. A visitor's OS setting no longer overrides the site default;
 * only their own stored choice, made via the in-page toggle, does.
 *
 * Kept as a string rather than a module because it must execute synchronously
 * ahead of hydration.
 */
export const themeInitScript = `
(function(){try{
  var k=${JSON.stringify(THEME_STORAGE_KEY)},d=${JSON.stringify(DEFAULT_THEME)};
  var s=localStorage.getItem(k);
  var t=(s==='light'||s==='dark')?s:d;
  document.documentElement.setAttribute('data-theme',t);
}catch(e){}})();
`.trim();

/**
 * Ambient colour scheme — canon §5. A design decision, not a user preference:
 * no storage, no client script, just an attribute stamped at render time.
 *
 * "spectrum": six desaturated hues in the ambient layer (the default).
 * "gold":     monochrome — ambient stays tonal with the marker.
 *
 * THE FLIP: change this constant (or set NEXT_PUBLIC_AMBIENT=gold at build
 * time). Nothing else moves — every consumer resolves through --amb-N.
 */
export type AmbientScheme = "spectrum" | "gold";

const configuredAmbient = process.env.NEXT_PUBLIC_AMBIENT;

export const AMBIENT_SCHEME: AmbientScheme =
  configuredAmbient === "gold" ? "gold" : "spectrum";
