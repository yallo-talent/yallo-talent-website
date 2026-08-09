"use client";

import { useEffect } from "react";

/**
 * Puts the requested register on this document, for the duration of the frame.
 *
 * WHY IT HAS TO BE AN EFFECT. The theme is `data-theme` on `<html>`, which the
 * root layout sets from the build-time default and a pre-hydration script then
 * overrides from the visitor's stored choice. The preview is a separate
 * document inside an iframe, so it inherits neither the cockpit's register nor
 * the reader's — it gets the site default, and both preview buttons would show
 * the same page. This is what makes "both themes" true rather than offered.
 *
 * It does NOT write to storage. The reader's own choice is theirs; a preview
 * that changed it would be a cockpit control quietly editing the visitor's
 * preference on the public site.
 */
export function PreviewTheme({ theme }: { theme: "light" | "dark" }) {
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute("data-theme");
    root.setAttribute("data-theme", theme);
    return () => {
      if (previous) root.setAttribute("data-theme", previous);
    };
  }, [theme]);
  return null;
}
