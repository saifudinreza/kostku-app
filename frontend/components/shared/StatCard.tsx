// =============================================================================
// StatCard — kartu angka ringkasan untuk dashboard.
// ANALOGI: seperti "papan skor" kecil: ada label (mis. "Total Pendapatan"),
// angka besarnya, ikon, dan delta (perubahan, mis. "+12%" naik = hijau).
// =============================================================================
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string; // keterangan, mis. "Kamar Terisi"
  value: string; // angka utama yang ditonjolkan
  icon: LucideIcon; // ikon dari pustaka lucide (dikirim sebagai komponen)
  /** Perubahan dibanding periode lalu, mis. "+12%" atau "-15%" */
  delta?: string;
  deltaTone?: "up" | "down" | "neutral"; // warna delta: naik hijau / turun merah / netral abu
  iconClassName?: string;
}

// `icon: Icon` = ganti nama prop `icon` jadi `Icon` di dalam fungsi, karena
// komponen React harus diawali huruf besar agar bisa ditulis sebagai <Icon />.
export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaTone = "neutral",
  iconClassName,
}: StatCardProps) {
  return (
    <div className="kk-card rounded-card bg-card p-5 shadow-card">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-ink-soft">{label}</p>
        <span
          className={cn(
            "nm-chip flex h-10 w-10 items-center justify-center rounded-xl text-brand",
            iconClassName
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-3 font-sans text-[28px] font-bold leading-tight text-ink">
        {value}
      </p>
      {delta && (
        <p
          className={cn(
            "mt-1 text-xs font-medium",
            deltaTone === "up" && "text-success",
            deltaTone === "down" && "text-danger",
            deltaTone === "neutral" && "text-ink-soft"
          )}
        >
          {delta}
        </p>
      )}
    </div>
  );
}
