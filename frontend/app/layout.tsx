// =============================================================================
// RootLayout — "bingkai terluar" SELURUH aplikasi (tag <html> & <body>).
// ANALOGI: seperti sampul buku. Setiap halaman (apa pun) dibungkus di dalamnya,
// jadi pengaturan global (bahasa, font, CSS) cukup ditulis sekali di sini.
// File `layout.tsx` di folder `app` adalah aturan khusus Next.js: ia otomatis
// membungkus semua isi di bawahnya lewat `children`.
// =============================================================================
import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css"; // memuat semua style global (warna, neumorphic, dll)
import { Providers } from "@/components/Providers";

// Muat tiga font dari Google. Tiap font disimpan ke "variabel CSS" (mis.
// --font-jakarta) supaya bisa dipanggil dari styling. Jakarta = font utama UI.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// metadata = info untuk tab browser & mesin pencari (judul & deskripsi situs).
// Next.js otomatis memasangnya ke <head> halaman.
export const metadata: Metadata = {
  title: "KostKu — Kelola Kost Lebih Cerdas",
  description:
    "Platform SaaS manajemen kost: kamar, penghuni, tagihan, pembayaran online, dan laporan keuangan dengan bantuan AI dalam satu dashboard.",
};

// `lang="id"` = bahasa Indonesia. Variabel font ditempel di <html> agar tersedia
// di seluruh halaman. `children` = isi halaman yang sedang dibuka.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${jetbrainsMono.variable} ${jakarta.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full">
        <Providers>{children}</Providers>
        {/* Midtrans Snap JS — loaded only when needed */}
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? ""}
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
