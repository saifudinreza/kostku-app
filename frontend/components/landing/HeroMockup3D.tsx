"use client";

import { useRef, useEffect } from "react";
import { WandSparkles, CheckCircle2, Bell, Home } from "lucide-react";

const STATS = [
  { label: "Total Kamar", value: "20", accent: false, suffix: undefined },
  { label: "Terisi", value: "18", accent: true, suffix: undefined },
  { label: "Pendapatan", value: "4,2", accent: false, suffix: "jt" },
];

const INVOICES = [
  { room: "Kamar 101", name: "Ahmad Fauzi", amount: "800rb", paid: true },
  { room: "Kamar 102", name: "Siti Rahayu", amount: "750rb", paid: false },
  { room: "Kamar 103", name: "Rudi Santoso", amount: "900rb", paid: false },
];

const BADGES = [
  {
    Icon: CheckCircle2,
    text: "Pembayaran diterima!",
    sub: "Kamar 101 · Rp 800rb",
    iconColor: "#16a34a",
    iconBg: "#dcfce7",
    delay: "0.7s",
    pos: { top: "-22px", right: "-14px" },
  },
  {
    Icon: Home,
    text: "Kamar 103 terisi",
    sub: "Mulai 15 Juni 2026",
    iconColor: "#6c5ce7",
    iconBg: "#ede9fe",
    delay: "1.05s",
    pos: { bottom: "90px", left: "-78px" },
  },
  {
    Icon: Bell,
    text: "Reminder terkirim",
    sub: "H-3 jatuh tempo · email",
    iconColor: "#d97706",
    iconBg: "#fef3c7",
    delay: "1.35s",
    pos: { bottom: "-18px", right: "22px" },
  },
];

export function HeroMockup3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    if (!container || !card) return;

    let rafId = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    let isHovering = false;
    let floatT = 0;

    const onMove = (e: MouseEvent) => {
      isHovering = true;
      const r = container.getBoundingClientRect();
      const relX = e.clientX - r.left - r.width / 2;
      const relY = e.clientY - r.top - r.height / 2;
      tx = (relY / (r.height / 2)) * -7;
      ty = (relX / (r.width / 2)) * 9;
    };
    const onLeave = () => {
      isHovering = false;
      tx = 0;
      ty = 0;
    };

    const tick = () => {
      floatT += 0.007;
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;

      const floatY = isHovering ? 0 : Math.sin(floatT) * -9;
      const tiltX = isHovering ? cx : cx + Math.sin(floatT * 0.7) * 0.8;
      const tiltY = isHovering ? cy : cy + Math.sin(floatT * 0.5) * 0.5;

      card.style.transform = `
        perspective(1000px)
        rotateX(${tiltX}deg)
        rotateY(${tiltY}deg)
        translateY(${floatY}px)
      `;
      rafId = requestAnimationFrame(tick);
    };

    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-[420px] py-10 lg:max-w-none lg:py-12"
      style={{ isolation: "isolate" }}
    >
      {/* Floating notification badges — only on desktop */}
      {BADGES.map((b) => {
        const Icon = b.Icon;
        return (
          <div
            key={b.text}
            className="kk-badge-in absolute z-20 hidden items-center gap-[10px] rounded-2xl py-[9px] pl-[9px] pr-[15px] nm-raised lg:flex"
            style={{ animationDelay: b.delay, ...b.pos }}
          >
            <div
              className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px]"
              style={{ background: b.iconBg }}
            >
              <Icon className="h-[16px] w-[16px]" style={{ color: b.iconColor }} />
            </div>
            <div>
              <p className="text-[12px] font-bold leading-none text-[#2f3148]">{b.text}</p>
              <p className="mt-[3px] text-[10.5px] text-[#8c8fab]">{b.sub}</p>
            </div>
          </div>
        );
      })}

      {/* Live status badge */}
      <div className="kk-floaty absolute right-[10px] top-[2px] z-[5] inline-flex items-center gap-2 rounded-full px-[13px] py-[8px] nm-raised-sm">
        <span
          className="kk-ping-dot h-[8px] w-[8px] rounded-full bg-[#16a34a]"
          style={{ boxShadow: "0 0 6px #16a34a" }}
        />
        <span className="text-[11px] font-bold text-[#5a5d78]">Reminder otomatis aktif</span>
      </div>

      {/* Glow halo behind card */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[80%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-[60px]"
        style={{
          background:
            "radial-gradient(ellipse at 55% 45%, rgba(139,123,255,0.45) 0%, rgba(108,92,231,0.2) 50%, transparent 75%)",
        }}
      />

      {/* Main 3D card */}
      <div
        ref={cardRef}
        className="kk-glint mt-6 rounded-[30px] p-[22px] nm-raised-lg will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Mini stats row */}
        <div className="mb-[18px] grid grid-cols-3 gap-3">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl p-3.5 nm-inset">
              <div className="mb-1.5 text-[11px] font-semibold text-[#8c8fab]">{s.label}</div>
              <div
                className="text-[22px] font-extrabold leading-none"
                style={{ color: s.accent ? "#6c5ce7" : "#2f3148" }}
              >
                {s.value}
                {s.suffix && (
                  <span className="text-[13px] font-semibold text-[#8c8fab]">{s.suffix}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Invoice mini list */}
        <div className="mb-[14px] rounded-[18px] px-[14px] py-[12px] nm-inset">
          <div className="mb-[10px] flex items-center justify-between">
            <span className="text-[12.5px] font-extrabold text-[#2f3148]">Tagihan Bulan Ini</span>
            <span className="rounded-full bg-[#fef3c7] px-2 py-[2px] text-[10.5px] font-bold text-[#d97706]">
              2 menunggu
            </span>
          </div>
          {INVOICES.map((inv) => (
            <div
              key={inv.room}
              className="flex items-center justify-between border-b border-[#e8e9f3] py-[8px] last:border-0"
            >
              <div>
                <p className="text-[12px] font-semibold text-[#2f3148]">{inv.room}</p>
                <p className="text-[10.5px] text-[#9a9db8]">{inv.name}</p>
              </div>
              <div className="flex items-center gap-[7px]">
                <span className="text-[12px] font-bold text-[#2f3148]">Rp {inv.amount}</span>
                <span
                  className={`rounded-full px-[8px] py-[2px] text-[10px] font-bold ${
                    inv.paid ? "bg-[#dcfce7] text-[#15803d]" : "bg-[#fef3c7] text-[#d97706]"
                  }`}
                >
                  {inv.paid ? "Lunas" : "Menunggu"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* AI teaser strip */}
        <div className="flex items-start gap-[11px] rounded-[14px] p-[12px] nm-raised-sm">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-white"
            style={{ background: "linear-gradient(135deg,#8b7bff,#6c5ce7)" }}
          >
            <WandSparkles className="h-[15px] w-[15px]" />
          </div>
          <div>
            <p className="text-[12px] font-extrabold text-[#2f3148]">AI Generate Deskripsi</p>
            <p className="text-[11px] leading-[1.5] text-[#797d99]">
              "AC · WiFi · 3×4m" → siap dalam 3 detik
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
