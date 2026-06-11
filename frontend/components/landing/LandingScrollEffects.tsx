"use client";

import { useEffect } from "react";

/**
 * Enables gentle section-to-section scroll snapping while the landing page is
 * mounted, by toggling `kk-snap` on <html>. Scoped this way so the dashboard's
 * normal scrolling is never affected. Honors prefers-reduced-motion via CSS.
 */
export function LandingScrollEffects() {
  useEffect(() => {
    const el = document.documentElement;
    el.classList.add("kk-snap");
    return () => el.classList.remove("kk-snap");
  }, []);

  return null;
}
