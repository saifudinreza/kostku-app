import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTORS = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

/**
 * Traps keyboard focus inside a container while `active` is true.
 *
 * - Auto-focuses the first focusable element when the trap activates.
 * - Tab / Shift+Tab cycles only within the container.
 * - Escape calls `onClose` (if provided).
 * - Restores focus to the previously-focused element when the trap deactivates.
 *
 * Usage:
 *   const trapRef = useFocusTrap(open, handleClose);
 *   return <div ref={trapRef} role="dialog" ...>
 */
export function useFocusTrap(active: boolean, onClose?: () => void) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep onClose stable without adding it to the effect's dependency array
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;

    // Remember which element had focus so we can restore it on close
    const previouslyFocused = document.activeElement as HTMLElement | null;

    function getFocusable(): HTMLElement[] {
      return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));
    }

    // Defer by one tick so the browser has painted the modal before focusing
    const timer = window.setTimeout(() => {
      getFocusable()[0]?.focus();
    }, 10);

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onCloseRef.current?.();
        return;
      }

      if (e.key !== "Tab") return;

      const focusable = getFocusable();
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        // Shift+Tab on first element → jump to last
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab on last element → jump to first
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      // Restore focus to wherever the user was before opening the modal
      previouslyFocused?.focus();
    };
  }, [active]);

  return containerRef;
}
