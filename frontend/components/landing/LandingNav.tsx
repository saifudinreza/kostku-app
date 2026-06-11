"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Menu, X } from "lucide-react";

const LINKS = [
  { label: "Fitur", href: "#fitur" },
  { label: "AI", href: "#ai" },
  { label: "Cara Kerja", href: "#cara" },
  { label: "Testimoni", href: "#testimoni" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50"
      style={{ background: "rgba(233,234,242,0.82)", backdropFilter: "blur(10px)" }}
    >
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-5 px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span
            className="flex h-[42px] w-[42px] items-center justify-center rounded-[13px] text-white nm-raised-sm"
            style={{ background: "linear-gradient(135deg,#8b7bff,#6c5ce7)" }}
          >
            <Building2 className="h-[22px] w-[22px]" />
          </span>
          <span className="text-xl font-extrabold tracking-[-0.4px] text-[#353850]">
            KostKu
          </span>
        </Link>

        <nav className="hidden items-center gap-[34px] md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[14.5px] font-semibold text-[#6b6e8a] transition-colors hover:text-[#6c5ce7]"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="kk-btn kk-btn-soft inline-flex items-center rounded-[13px] px-5 py-[11px] text-sm font-bold"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="kk-btn kk-btn-primary inline-flex items-center rounded-[13px] px-[22px] py-[11px] text-sm font-bold"
          >
            Coba Gratis
          </Link>
        </div>

        <button
          className="text-[#4a4d66] md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 rounded-[18px] p-3 nm-raised-sm">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-[11px] px-3 py-2 text-sm font-semibold text-[#6b6e8a]"
              >
                {l.label}
              </a>
            ))}
            <hr className="my-2 border-[#dadce8]" />
            <Link
              href="/login"
              className="rounded-[11px] px-3 py-2 text-sm font-semibold text-[#6b6e8a]"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="kk-btn kk-btn-primary mt-1 rounded-[11px] px-3 py-2 text-center text-sm font-bold"
            >
              Coba Gratis
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
