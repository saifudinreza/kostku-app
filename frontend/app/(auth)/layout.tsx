import Link from "next/link";
import { Building2, CreditCard, Sparkles } from "lucide-react";

const PERKS = [
  { icon: Building2, label: "Manajemen properti & kamar terpusat" },
  { icon: CreditCard, label: "Pembayaran online VA, GoPay, OVO, QRIS" },
  { icon: Sparkles, label: "Asisten AI untuk tagihan & insight keuangan" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-page">
      {/* Brand panel */}
      <div
        className="relative hidden w-1/2 flex-col justify-between overflow-hidden p-12 text-white lg:flex"
        style={{ background: "linear-gradient(150deg,#8b7bff,#6c5ce7 55%,#5a4bd4)" }}
      >
        {/* soft decorative orbs */}
        <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-white/[0.12]" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-white/[0.08]" />

        <Link href="/" className="relative flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <Building2 className="h-5 w-5" />
          </span>
          <span className="text-xl font-extrabold tracking-tight">KostKu</span>
        </Link>

        <div className="relative max-w-md">
          <h2 className="text-[34px] font-extrabold leading-[1.15] tracking-tight">
            Kelola kost-mu lebih cerdas, semua dalam satu dashboard.
          </h2>
          <ul className="mt-9 space-y-4">
            {PERKS.map((p) => {
              const Icon = p.icon;
              return (
                <li key={p.label} className="flex items-center gap-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="text-[15px] font-medium text-white/90">
                    {p.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="relative text-sm font-medium text-white/55">
          © {new Date().getFullYear()} KostKu. Dibuat di Indonesia.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2">
        <div className="mx-auto w-full max-w-sm rounded-[28px] bg-card p-8 shadow-card sm:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
