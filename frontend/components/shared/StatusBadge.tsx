// =============================================================================
// StatusBadge — "stiker status" berwarna (mis. Lunas hijau, Telat merah).
// ANALOGI: seperti stempel di berkas. Kita kirim kode status dalam bahasa
// program ("paid"), komponen menerjemahkannya jadi teks Indonesia + warna yang
// pas, supaya pengguna langsung paham hanya dari warnanya.
// =============================================================================
import { cn } from "@/lib/utils";

// "Kamus" status: tiap kode -> { label tampil, warna }. Hijau = beres/aman,
// kuning = perlu perhatian, merah = bermasalah, biru = sedang diproses, abu =
// netral/selesai. Satu tempat ini dipakai untuk invoice, kamar, sewa, & bayar.
const STYLES: Record<string, { label: string; className: string }> = {
  // Invoice
  paid: { label: "Lunas", className: "text-[#15803D] bg-[#DCFCE7]" },
  unpaid: { label: "Belum Bayar", className: "text-[#B45309] bg-[#FEF3C7]" },
  overdue: { label: "Telat", className: "text-[#B91C1C] bg-[#FEE2E2]" },
  pending: { label: "Pending", className: "text-[#1D4ED8] bg-[#DBEAFE]" },
  // Room
  available: { label: "Tersedia", className: "text-[#0F766E] bg-[#CCFBF1]" },
  occupied: { label: "Terisi", className: "text-[#6D28D9] bg-[#EDE9FE]" },
  maintenance: { label: "Maintenance", className: "text-[#92400E] bg-[#FEF3C7]" },
  // Tenancy / Payment
  active: { label: "Aktif", className: "text-[#15803D] bg-[#DCFCE7]" },
  ended: { label: "Berakhir", className: "text-[#64748B] bg-[#F1F5F9]" },
  success: { label: "Berhasil", className: "text-[#15803D] bg-[#DCFCE7]" },
  failed: { label: "Gagal", className: "text-[#B91C1C] bg-[#FEE2E2]" },
  expired: { label: "Kedaluwarsa", className: "text-[#64748B] bg-[#F1F5F9]" },
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  // Ambil gaya sesuai status. `?? {...}` = pengaman: kalau statusnya tidak
  // dikenal di kamus, tampilkan teks apa adanya dengan warna abu netral
  // (daripada error/blank).
  const conf = STYLES[status] ?? {
    label: status,
    className: "text-ink-soft bg-slate-100",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-badge px-2.5 py-0.5 text-xs font-medium",
        conf.className,
        className
      )}
    >
      {conf.label}
    </span>
  );
}
