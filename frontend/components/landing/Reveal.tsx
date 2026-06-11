"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger delay in ms, applied once the element scrolls into view. */
  delay?: number;
  /** Element to render. Defaults to a div. */
  as?: ElementType;
  className?: string;
};

/**
 * Wraps content in a smooth 3D entrance that plays the first time it scrolls
 * into view. Pure CSS transform (see `.kk-reveal` in globals.css) driven by an
 * IntersectionObserver so it stays cheap — no scroll listeners.
 */
export function Reveal({ children, delay = 0, as, className = "" }: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`kk-reveal ${visible ? "is-visible" : ""} ${className}`.trim()}
      style={visible && delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
