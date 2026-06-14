import Link from "next/link";
import {
  ArrowRight,
  ArrowUp,
  BarChart3,
  Briefcase,
  Building2,
  CheckCircle2,
  LayoutDashboard,
  MessageCircleHeart,
  MessagesSquare,
  Play,
  ReceiptText,
  Sparkles,
  Star,
  TrendingUp,
  UserRound,
  WandSparkles,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { LandingNav } from "@/components/landing/LandingNav";
import { HeroChat } from "@/components/landing/HeroChat";
import { Reveal } from "@/components/landing/Reveal";
import { KostBackground } from "@/components/landing/KostBackground";
import { LandingScrollEffects } from "@/components/landing/LandingScrollEffects";

// =============================================================================
// LandingPage — halaman depan (etalase) yang dilihat pengunjung di "/".
// ANALOGI: seperti brosur/billboard produk. Tujuannya meyakinkan calon
// pengguna lalu mengarahkan ke tombol "Daftar"/"Masuk".
//
// POLA PENTING: semua TEKS isi halaman dikumpulkan di "data array" di atas
// (FEATURES, PROBLEMS, dst). Lalu di bawah, JSX tinggal `.map(...)` —
// mengulang satu cetakan tampilan untuk tiap data. ANALOGI: bikin satu stempel
// kartu, lalu cap berulang untuk tiap isi. Mau tambah fitur? cukup tambah satu
// objek di array, tampilannya ikut bertambah otomatis.
// =============================================================================

// Daftar fitur utama (ikon + judul + deskripsi) untuk bagian "Fitur Utama".
const FEATURES = [
  {
    icon: LayoutDashboard,
    title: "Dashboard Overview",
    desc: "Ringkasan total kamar, hunian, pendapatan, dan jatuh tempo dalam sekali lihat.",
  },
  {
    icon: Building2,
    title: "Multi-Properti & Kamar",
    desc: "Kelola banyak kost sekaligus. Atur kamar, harga, status, dan foto dengan mudah.",
  },
  {
    icon: ReceiptText,
    title: "Tagihan Otomatis",
    desc: "Tagihan ter-generate tiap bulan. Tambah item listrik atau air dalam hitungan detik.",
  },
  {
    icon: Wallet,
    title: "Pembayaran Online",
    desc: "Bayar lewat VA Bank, GoPay, OVO, dan QRIS. Status pembayaran terpantau realtime.",
  },
  {
    icon: MessagesSquare,
    title: "Chat Internal per Kamar",
    desc: "Komunikasi owner & penghuni terarsip rapi per kamar. Lapor kerusakan langsung.",
  },
  {
    icon: BarChart3,
    title: "Laporan & Reminder",
    desc: "Grafik pendapatan & occupancy. Reminder email otomatis H-7 dan H-1 jatuh tempo.",
  },
];

// Dua "persona" beserta keluhannya, untuk bagian "Masalahnya" (owner & tenant).
const PROBLEMS = [
  {
    icon: Briefcase,
    title: "Pemilik Kost",
    sub: "Pak Hasan, 2 kost · 20 kamar",
    points: [
      "Tagihan dikelola manual lewat WhatsApp & Excel, sering terlewat",
      "Cek mutasi bank satu per satu untuk pastikan siapa sudah bayar",
      "Tidak ada laporan keuangan rapi, sulit tahu pendapatan bulanan",
      "Nagih lewat WA pribadi terasa awkward dan tak terdokumentasi",
    ],
  },
  {
    icon: UserRound,
    title: "Penghuni Kost",
    sub: "Budi, mahasiswa sambil kerja",
    points: [
      "Tidak tahu tagihan berapa tanpa harus tanya owner dulu",
      "Bayar harus ke ATM atau transfer manual, sering lupa jatuh tempo",
      "Tidak ada bukti bayar yang tersimpan dan mudah dicari",
      "Susah lapor kerusakan kamar, harus chat ke nomor pribadi",
    ],
  },
];

// Tiga fitur ber-AI yang ditonjolkan (bagian "Ditenagai AI").
const AI_FEATURES = [
  {
    icon: MessageCircleHeart,
    title: "Smart Invoice Assistant",
    desc: "Penghuni bisa tanya apa pun soal tagihannya. AI tahu data tagihan kamu dan menjawab langsung.",
    snippet: '"Kenapa tagihan bulan ini naik?"',
  },
  {
    icon: WandSparkles,
    title: "Room Description Generator",
    desc: "Input data kamar, AI tuliskan deskripsi marketing menarik. Kamar kosong cepat terisi.",
    snippet: "3x4 · AC · WiFi → deskripsi siap",
  },
  {
    icon: TrendingUp,
    title: "AI Financial Insight",
    desc: "AI analisis keuangan kost-mu dalam Bahasa Indonesia, lengkap dengan proyeksi bulan depan.",
    snippet: '"Pendapatan Juni turun 15%…"',
  },
];

// Empat langkah alur pemakaian (bagian "Cara Kerja").
const STEPS = [
  {
    title: "Daftar & Tambah Properti",
    desc: "Buat akun owner dan masukkan kost beserta kamar-kamarmu.",
  },
  {
    title: "Onboarding Penghuni",
    desc: "Assign penghuni ke kamar, set tanggal masuk dan deposit.",
  },
  {
    title: "Tagihan Auto-Generate",
    desc: "Setiap bulan tagihan dibuat otomatis, reminder dikirim sendiri.",
  },
  {
    title: "Bayar & Pantau",
    desc: "Penghuni bayar online, kamu pantau status realtime di dashboard.",
  },
];

// Kutipan testimoni pengguna (bagian "Testimoni"). `initial` = huruf avatar.
const TESTIMONIALS = [
  {
    initial: "H",
    name: "Pak Hasan",
    role: "Pemilik Kost · Semarang",
    quote:
      "Dua kost saya sekarang satu dashboard. Saya langsung tahu siapa belum bayar tanpa harus cek mutasi bank satu-satu lagi.",
  },
  {
    initial: "B",
    name: "Budi",
    role: "Penghuni · Mahasiswa",
    quote:
      "Bayar kost sekarang dari HP pakai QRIS, ada reminder otomatis, dan kalau bingung tagihan tinggal tanya AI-nya. Gampang banget.",
  },
  {
    initial: "S",
    name: "Bu Sari",
    role: "Pemilik Kost · Yogyakarta",
    quote:
      "AI Financial Insight bantu saya lihat tren pendapatan tiap bulan. Deskripsi kamar pun tinggal generate, kamar cepat terisi.",
  },
];

// Angka statistik mini di kartu mockup hero (`accent` = ditampilkan warna ungu).
const HERO_STATS = [
  { label: "Total Kamar", value: "20", accent: false },
  { label: "Terisi", value: "18", accent: true },
  { label: "Pendapatan", value: "4,2", suffix: "jt", accent: false },
];

// Tiga poin kepercayaan di bawah tombol utama (mis. "Gratis untuk mulai").
const HERO_TRUST = ["Gratis untuk mulai", "Tanpa kartu kredit", "Setup 5 menit"];

// Pill = "lencana" kapsul kecil (mis. label "Fitur Utama"). Komponen mungil
// yang dipakai berulang di tiap judul bagian, supaya tidak menyalin style sama.
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 inline-flex items-center gap-[9px] rounded-full px-4 py-2 nm-inset">
      {children}
    </div>
  );
}

// Susunan halaman dari atas ke bawah: Nav -> Hero -> Masalah -> Fitur -> AI ->
// Cara Kerja -> Testimoni -> Ajakan (CTA) -> Footer. `kk-landing` membatasi
// tema neumorphic agar tidak bocor ke halaman dashboard.
export default function LandingPage() {
  return (
    <div className="kk-landing min-h-screen">
      {/* mengaktifkan efek scroll-snap khusus landing (lihat komponennya) */}
      <LandingScrollEffects />
      <LandingNav />

      {/* ============ HERO ============ */}
      <section
        data-snap
        className="relative isolate overflow-hidden pb-[72px] pt-20"
      >
        <KostBackground />
        <div className="relative z-10 mx-auto grid max-w-[1180px] items-center gap-14 px-6 lg:grid-cols-[1.05fr_1fr]">
          <Reveal>
          <Pill>
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: "#6c5ce7", boxShadow: "0 0 8px #8b7bff" }}
            />
            <span className="text-[12.5px] font-bold uppercase tracking-[0.4px] text-[#6c5ce7]">
              Kini dengan Asisten AI
            </span>
          </Pill>
          <h1
            className="m-0 mb-[22px] text-[clamp(40px,6vw,54px)] font-extrabold leading-[1.05] tracking-[-1.5px] text-[#2f3148] text-balance"
            style={{ textShadow: "0 1px 22px rgba(233,234,242,0.95)" }}
          >
            Atur kost-mu
            <br />
            tanpa drama.
          </h1>
          <p
            className="m-0 mb-[34px] max-w-[480px] text-lg leading-[1.65] text-[#5b5e7a] text-pretty"
            style={{ textShadow: "0 1px 16px rgba(233,234,242,0.9)" }}
          >
            Satu dashboard untuk pemilik & penghuni — kelola kamar, tagihan, dan
            pembayaran online. Lengkap dengan asisten AI yang siap menjawab soal
            tagihan kapan saja.
          </p>
          <div className="mb-7 flex flex-wrap items-center gap-4">
            <Link
              href="/register"
              className="kk-btn kk-btn-primary inline-flex items-center gap-[9px] rounded-[15px] px-[30px] py-4 text-base font-bold"
            >
              Mulai Gratis
              <ArrowRight className="h-[18px] w-[18px]" />
            </Link>
            <Link
              href="/owner/dashboard"
              className="kk-btn kk-btn-soft inline-flex items-center gap-[9px] rounded-[15px] px-7 py-4 text-base font-bold"
            >
              <Play className="h-[17px] w-[17px] text-[#6c5ce7]" />
              Lihat Demo
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-[22px]">
            {HERO_TRUST.map((t) => (
              <div
                key={t}
                className="flex items-center gap-2 text-[13.5px] font-semibold text-[#797d99]"
              >
                <CheckCircle2 className="h-[17px] w-[17px] text-[#6c5ce7]" />
                {t}
              </div>
            ))}
          </div>
        </Reveal>

        {/* HERO MOCKUP CARD */}
        <Reveal delay={120} className="relative">
          <div
            className="absolute right-[18px] top-[-18px] z-[3] inline-flex items-center gap-2 rounded-full px-[15px] py-[9px] kk-floaty nm-raised-sm"
          >
            <Zap className="h-[15px] w-[15px] text-[#6c5ce7]" />
            <span className="text-[11.5px] font-bold text-[#5a5d78]">
              Ditenagai Groq · LLaMA 3.3
            </span>
          </div>
          <div className="rounded-[30px] p-[22px] nm-raised-lg">
            {/* mini stats */}
            <div className="mb-[18px] grid grid-cols-3 gap-3">
              {HERO_STATS.map((s) => (
                <div key={s.label} className="rounded-2xl p-3.5 nm-inset">
                  <div className="mb-1.5 text-[11px] font-semibold text-[#8c8fab]">
                    {s.label}
                  </div>
                  <div
                    className="text-[22px] font-extrabold"
                    style={{ color: s.accent ? "#6c5ce7" : "#2f3148" }}
                  >
                    {s.value}
                    {s.suffix && (
                      <span className="text-[13px] font-semibold text-[#8c8fab]">
                        {s.suffix}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* assistant header */}
            <div className="flex items-center gap-3 px-1 pb-4 pt-1">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-[13px] text-white nm-raised-sm"
                style={{ background: "linear-gradient(135deg,#8b7bff,#6c5ce7)" }}
              >
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-extrabold text-[#2f3148]">
                  Smart Invoice Assistant
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#16a34a]">
                  <span className="h-[7px] w-[7px] rounded-full bg-[#16a34a]" />
                  Online
                </div>
              </div>
            </div>
            {/* chat body (live typed demo) */}
            <HeroChat />
            {/* input bar */}
            <div className="mt-4 flex items-center gap-2.5 rounded-2xl py-[7px] pl-[18px] pr-[7px] nm-inset">
              <span className="flex-1 text-[13.5px] text-[#9a9db8]">
                Tanya soal tagihanmu…
              </span>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                style={{
                  background: "linear-gradient(135deg,#8b7bff,#6c5ce7)",
                  boxShadow: "4px 4px 10px #c6c8d8",
                }}
                aria-label="Kirim"
              >
                <ArrowUp className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>
        </Reveal>
        </div>
      </section>

      {/* ============ PROBLEM ============ */}
      <section data-snap className="mx-auto max-w-[1180px] px-6 py-16">
        <Reveal className="mx-auto mb-[52px] max-w-[640px] text-center">
          <Pill>
            <span className="text-xs font-bold uppercase tracking-[0.5px] text-[#6c5ce7]">
              Masalahnya
            </span>
          </Pill>
          <h2 className="m-0 mb-4 text-[38px] font-extrabold leading-[1.12] tracking-[-1px] text-[#2f3148] text-balance">
            Kelola kost manual itu melelahkan
          </h2>
          <p className="m-0 text-[17px] leading-[1.6] text-[#6b6e8a] text-pretty">
            WhatsApp pribadi tercampur, mutasi bank dicek satu-satu, dan tak ada
            catatan rapi. Untuk pemilik maupun penghuni.
          </p>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          {PROBLEMS.map((p, idx) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.title} delay={idx * 100}>
                <div className="rounded-[26px] p-[34px] nm-raised">
                  <div className="mb-6 flex items-center gap-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[14px] text-[#6c5ce7] nm-inset">
                      <Icon className="h-[23px] w-[23px]" />
                    </div>
                    <div>
                      <div className="text-[19px] font-extrabold text-[#2f3148]">
                        {p.title}
                      </div>
                      <div className="text-[13px] font-semibold text-[#8c8fab]">
                        {p.sub}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3.5">
                    {p.points.map((pt) => (
                      <div key={pt} className="flex items-start gap-3">
                        <span className="mt-px flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#fee2e2] text-[#dc2626]">
                          <X className="h-[13px] w-[13px]" />
                        </span>
                        <span className="text-[14.5px] leading-[1.5] text-[#5a5d78]">
                          {pt}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ============ CORE FEATURES ============ */}
      <section id="fitur" data-snap className="mx-auto max-w-[1180px] px-6 py-16">
        <Reveal className="mx-auto mb-[52px] max-w-[640px] text-center">
          <Pill>
            <span className="text-xs font-bold uppercase tracking-[0.5px] text-[#6c5ce7]">
              Fitur Utama
            </span>
          </Pill>
          <h2 className="m-0 mb-4 text-[38px] font-extrabold leading-[1.12] tracking-[-1px] text-[#2f3148] text-balance">
            Semua yang kamu butuh, dalam satu tempat
          </h2>
          <p className="m-0 text-[17px] leading-[1.6] text-[#6b6e8a] text-pretty">
            Dari manajemen kamar sampai laporan keuangan — beres tanpa
            pindah-pindah aplikasi.
          </p>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, idx) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={(idx % 3) * 90}>
                <div className="kk-card h-full rounded-[24px] p-[30px] nm-raised">
                  <div className="mb-[22px] flex h-14 w-14 items-center justify-center rounded-[17px] text-[#6c5ce7] nm-inset">
                    <Icon className="h-[26px] w-[26px]" />
                  </div>
                  <h3 className="m-0 mb-2.5 text-lg font-extrabold text-[#2f3148]">
                    {f.title}
                  </h3>
                  <p className="m-0 text-[14.5px] leading-[1.6] text-[#797d99]">
                    {f.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ============ AI FEATURES ============ */}
      <section id="ai" data-snap className="px-6 py-20">
        <div className="mx-auto max-w-[1180px] rounded-[34px] px-12 py-[60px] nm-inset-lg">
          <Reveal className="mx-auto mb-[50px] max-w-[660px] text-center">
            <div
              className="mb-[22px] inline-flex items-center gap-[9px] rounded-full px-[18px] py-[9px] nm-raised-sm"
              style={{ background: "linear-gradient(135deg,#8b7bff,#6c5ce7)" }}
            >
              <Sparkles className="h-[15px] w-[15px] text-white" />
              <span className="text-[12.5px] font-bold uppercase tracking-[0.4px] text-white">
                Ditenagai AI
              </span>
            </div>
            <h2 className="m-0 mb-4 text-[38px] font-extrabold leading-[1.12] tracking-[-1px] text-[#2f3148] text-balance">
              Bukan sekadar aplikasi manajemen
            </h2>
            <p className="m-0 text-[17px] leading-[1.6] text-[#6b6e8a] text-pretty">
              Tiga asisten cerdas ber-AI yang bantu owner & penghuni ambil
              keputusan lebih baik — ditenagai Groq + LLaMA 3.3 70B.
            </p>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {AI_FEATURES.map((f, idx) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.title} delay={idx * 100}>
                  <div className="kk-card h-full rounded-[24px] p-8 nm-raised">
                    <div
                      className="mb-[22px] flex h-14 w-14 items-center justify-center rounded-[17px] text-white nm-raised-sm"
                      style={{ background: "linear-gradient(135deg,#8b7bff,#6c5ce7)" }}
                    >
                      <Icon className="h-[26px] w-[26px]" />
                    </div>
                    <h3 className="m-0 mb-2.5 text-[18.5px] font-extrabold text-[#2f3148]">
                      {f.title}
                    </h3>
                    <p className="m-0 mb-4 text-[14.5px] leading-[1.6] text-[#797d99]">
                      {f.desc}
                    </p>
                    <div className="rounded-xl px-3.5 py-3 font-mono text-xs text-[#6c5ce7] nm-inset">
                      {f.snippet}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="cara" data-snap className="mx-auto max-w-[1180px] px-6 py-16">
        <Reveal className="mx-auto mb-14 max-w-[640px] text-center">
          <Pill>
            <span className="text-xs font-bold uppercase tracking-[0.5px] text-[#6c5ce7]">
              Cara Kerja
            </span>
          </Pill>
          <h2 className="m-0 mb-4 text-[38px] font-extrabold leading-[1.12] tracking-[-1px] text-[#2f3148] text-balance">
            Mulai dalam 4 langkah
          </h2>
          <p className="m-0 text-[17px] leading-[1.6] text-[#6b6e8a] text-pretty">
            Dari daftar sampai terima pembayaran online — tanpa setup rumit.
          </p>
        </Reveal>
        <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, idx) => (
            <Reveal key={s.title} delay={idx * 90} className="text-center">
              <div className="mx-auto mb-[22px] flex h-[72px] w-[72px] items-center justify-center rounded-[22px] text-[26px] font-extrabold text-[#6c5ce7] nm-raised">
                {idx + 1}
              </div>
              <h3 className="m-0 mb-2 text-[17px] font-extrabold text-[#2f3148]">
                {s.title}
              </h3>
              <p className="m-0 text-[14px] leading-[1.55] text-[#797d99]">
                {s.desc}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section id="testimoni" data-snap className="mx-auto max-w-[1180px] px-6 py-16">
        <Reveal className="mx-auto mb-[52px] max-w-[640px] text-center">
          <Pill>
            <span className="text-xs font-bold uppercase tracking-[0.5px] text-[#6c5ce7]">
              Testimoni
            </span>
          </Pill>
          <h2 className="m-0 text-[38px] font-extrabold leading-[1.12] tracking-[-1px] text-[#2f3148] text-balance">
            Dipakai owner & penghuni di seluruh Indonesia
          </h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, idx) => (
            <Reveal key={t.name} delay={idx * 100}>
              <div className="kk-card h-full rounded-[24px] p-[30px] nm-raised">
                <div className="mb-[18px] flex gap-1 text-[#f0a818]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-[17px] w-[17px] fill-[#f0a818]" />
                  ))}
                </div>
                <p className="m-0 mb-6 text-[15px] font-medium leading-[1.65] text-[#4a4d66]">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3.5">
                  <div className="flex h-[46px] w-[46px] items-center justify-center rounded-[14px] text-[17px] font-extrabold text-[#6c5ce7] nm-raised-sm">
                    {t.initial}
                  </div>
                  <div>
                    <div className="text-[14.5px] font-extrabold text-[#2f3148]">
                      {t.name}
                    </div>
                    <div className="text-[12.5px] font-semibold text-[#8c8fab]">
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ FOOTER CTA ============ */}
      <section className="mx-auto max-w-[1180px] px-6 pb-20 pt-10">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-[34px] px-12 py-[68px] text-center"
            style={{
              background: "linear-gradient(135deg,#8b7bff,#6c5ce7)",
              boxShadow: "16px 16px 38px #c2c0e4,-16px -16px 38px #ffffff",
            }}
          >
            <div className="absolute right-[-40px] top-[-60px] h-[220px] w-[220px] rounded-full bg-white/[0.12]" />
            <div className="absolute bottom-[-80px] left-[-50px] h-[240px] w-[240px] rounded-full bg-white/[0.08]" />
            <div className="relative">
              <h2 className="m-0 mb-[18px] text-[42px] font-extrabold leading-[1.1] tracking-[-1px] text-white text-balance">
                Siap bikin kelola kost lebih ringan?
              </h2>
              <p className="mx-auto mb-9 max-w-[520px] text-lg leading-[1.6] text-white/[0.88]">
                Gabung gratis hari ini. Tanpa kartu kredit, langsung pakai dalam
                5 menit.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="kk-btn kk-btn-light inline-flex items-center gap-[9px] rounded-[15px] px-[34px] py-4 text-base font-extrabold"
                >
                  Coba Gratis Sekarang
                  <ArrowRight className="h-[18px] w-[18px]" />
                </Link>
                <a
                  href="#"
                  className="rounded-[15px] border-[1.5px] border-white/50 px-8 py-4 text-base font-bold text-white transition-colors hover:bg-white/[0.12]"
                >
                  Hubungi Sales
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-[#dadce8]">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-6 pb-10 pt-[52px] sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-4 flex items-center gap-[11px]">
              <div
                className="flex h-[38px] w-[38px] items-center justify-center rounded-xl text-white nm-raised-sm"
                style={{ background: "linear-gradient(135deg,#8b7bff,#6c5ce7)" }}
              >
                <Building2 className="h-[19px] w-[19px]" />
              </div>
              <span className="text-lg font-extrabold text-[#353850]">KostKu</span>
            </div>
            <p className="m-0 max-w-[260px] text-[13.5px] leading-[1.6] text-[#8c8fab]">
              Platform manajemen kost terkonfigurasi AI untuk memudahkan pemilik dan penghuni kost di
              Indonesia.
            </p>
          </div>
          {[
            {
              head: "Produk",
              links: ["Fitur", "Asisten AI", "Cara Kerja", "Harga"],
            },
            {
              head: "Perusahaan",
              links: ["Tentang Kami", "Blog", "Karier", "Kontak"],
            },
            {
              head: "Bantuan",
              links: ["Pusat Bantuan", "Syarat & Ketentuan", "Privasi"],
            },
          ].map((col) => (
            <div key={col.head}>
              <div className="mb-4 text-[13px] font-extrabold uppercase tracking-[0.5px] text-[#2f3148]">
                {col.head}
              </div>
              <div className="flex flex-col gap-[11px]">
                {col.links.map((l) => (
                  <a
                    key={l}
                    href="#"
                    className="text-sm font-medium text-[#797d99] transition-colors hover:text-[#6c5ce7]"
                  >
                    {l}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-3 border-t border-[#dadce8] px-6 pb-10 pt-[22px]">
          <span className="text-[13px] font-medium text-[#9a9db5]">
            © 2026 KostKu. Dibuat di Indonesia.
          </span>
        </div>
      </footer>
    </div>
  );
}
