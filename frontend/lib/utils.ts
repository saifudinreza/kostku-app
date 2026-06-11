import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Gabung className kondisional + resolusi konflik Tailwind. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format angka rupiah: 850000 -> "Rp 850.000". */
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

/** Nama periode tagihan: (6, 2025) -> "Juni 2025". */
export function formatPeriode(month: number, year: number): string {
  return `${BULAN[month - 1] ?? month} ${year}`;
}

/** Tanggal ISO -> "20 Jun 2025". */
export function formatTanggal(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
