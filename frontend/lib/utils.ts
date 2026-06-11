// =============================================================================
// Kumpulan fungsi bantu (helper) yang dipakai berulang di banyak file.
// ANALOGI: ini "kotak peralatan" — pisau, gunting, penggaris kecil yang sering
// dipakai, jadi disimpan di satu tempat daripada bikin ulang di tiap halaman.
// =============================================================================
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn = "class names". Menggabungkan beberapa nama class CSS jadi satu, dan
 * merapikan kalau ada yang bentrok (mis. "p-2" lalu "p-4" -> menang "p-4").
 * ANALOGI: seperti merapikan daftar belanja — kalau "gula" ditulis dua kali
 * dengan jumlah beda, ambil yang paling akhir, buang yang duplikat/bertentangan.
 * Dipakai komponen agar style bawaan bisa ditimpa lewat prop `className`.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Ubah angka jadi format rupiah Indonesia: 850000 -> "Rp 850.000".
 * `toLocaleString("id-ID")` yang otomatis menambahkan titik pemisah ribuan.
 */
export function formatRupiah(value: number): string {
  return "Rp " + value.toLocaleString("id-ID");
}

const BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

/**
 * Ubah angka bulan+tahun jadi label periode: (6, 2025) -> "Juni 2025".
 * Catatan: array BULAN dihitung dari 0, sedangkan bulan dari 1, maka `month - 1`.
 * `?? month` = pengaman: kalau bulan di luar 1-12, tampilkan angkanya saja.
 */
export function formatPeriode(month: number, year: number): string {
  return `${BULAN[month - 1] ?? month} ${year}`;
}

/**
 * Ubah tanggal format mesin (ISO, mis. "2025-06-20") jadi format manusia
 * "20 Jun 2025". Kalau tanggalnya tidak valid, kembalikan teks aslinya saja.
 */
export function formatTanggal(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
