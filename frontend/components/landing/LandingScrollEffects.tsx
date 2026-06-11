"use client"; // menyentuh <html> di browser -> komponen browser

import { useEffect } from "react";

// =============================================================================
// LandingScrollEffects — mengaktifkan efek "scroll nempel per bagian" di
// halaman depan saja. ANALOGI: seperti gigi pada laci yang berhenti rapi di
// tiap bagian saat digeser.
//
// Caranya: menempelkan penanda `kk-snap` ke tag <html> saat halaman landing
// dibuka, dan MELEPASNYA saat ditinggalkan — supaya gulungan di dashboard
// (owner/tenant) tetap normal, tidak ikut "nempel". Komponen ini tidak
// menggambar apa pun, makanya `return null` (cuma menjalankan efek).
// =============================================================================
export function LandingScrollEffects() {
  useEffect(() => {
    const el = document.documentElement; // ini tag <html>
    el.classList.add("kk-snap"); // pasang penanda saat masuk landing
    return () => el.classList.remove("kk-snap"); // lepas penanda saat keluar
  }, []);

  return null; // tidak ada tampilan; murni efek samping
}
