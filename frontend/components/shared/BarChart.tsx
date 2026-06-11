// =============================================================================
// BarChart — grafik batang sederhana, dibuat dari div biasa (tanpa pustaka).
// ANALOGI: bayangkan deretan gelas diisi air. Gelas tertinggi = nilai terbesar,
// gelas lain diisi proporsional terhadap yang tertinggi. Saat disorot, muncul
// gelembung berisi nominal rupiahnya.
// Untuk produksi bisa diganti pustaka grafik (mis. Recharts).
// =============================================================================
import { formatRupiah } from "@/lib/utils";

export function BarChart({
  data,
}: {
  data: { month: string; value: number }[]; // mis. [{month:"Jan", value:3800000}, ...]
}) {
  // Cari nilai terbesar -> jadi patokan tinggi 100%. Angka `1` di akhir mencegah
  // pembagian dengan nol kalau datanya kosong (biar tidak error).
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex h-64 items-end gap-3 px-1">
      {data.map((d) => (
        <div key={d.month} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full flex-1 items-end">
            {/* Tinggi batang = (nilai ÷ nilai terbesar) × 100%. Jadi batang
                tertinggi penuh, yang lain mengikuti proporsinya. */}
            <div
              className="group relative w-full rounded-t-md bg-brand/80 transition-all hover:bg-brand"
              style={{ height: `${(d.value / max) * 100}%` }}
            >
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-ink px-2 py-1 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                {formatRupiah(d.value)}
              </span>
            </div>
          </div>
          <span className="text-xs font-medium text-ink-soft">{d.month}</span>
        </div>
      ))}
    </div>
  );
}
