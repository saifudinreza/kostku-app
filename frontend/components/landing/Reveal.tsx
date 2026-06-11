"use client"; // memantau gulungan layar -> komponen browser

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

// =============================================================================
// Reveal — pembungkus animasi "muncul saat di-scroll".
// ANALOGI: seperti tirai panggung. Selama isi belum kelihatan di layar, dia
// "tersembunyi" (transparan & sedikit bergeser). Begitu kamu menggulir sampai
// dia masuk pandangan, tirai dibuka sekali (animasi naik & memudar masuk).
// Hemat tenaga karena pakai "pengintai" (IntersectionObserver), bukan terus
// mendengarkan setiap gerakan scroll.
// =============================================================================
type RevealProps = {
  children: ReactNode;
  /** Jeda mulai (ms) — untuk efek berurutan antar elemen. */
  delay?: number;
  /** Jenis tag HTML yang dipakai. Default: <div>. */
  as?: ElementType;
  className?: string;
};

export function Reveal({ children, delay = 0, as, className = "" }: RevealProps) {
  const Tag = (as ?? "div") as ElementType; // tag yang akan dirender
  const ref = useRef<HTMLElement | null>(null); // "penanda" ke elemen aslinya di layar
  const [visible, setVisible] = useState(false); // sudah masuk pandangan?

  // useEffect = kode yang jalan SETELAH elemen tampil. Di sini kita pasang
  // "pengintai" yang memberi tahu saat elemen masuk layar.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // IntersectionObserver = mata pengintai. Saat minimal 12% elemen terlihat
    // (`threshold: 0.12`), tandai visible, lalu berhenti mengintai (sekali saja).
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
    // Bersih-bersih saat komponen hilang, agar tidak ada pengintai nyangkut.
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
