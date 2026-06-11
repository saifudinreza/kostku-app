import { DoorOpen, Sparkles, TrendingUp, Wallet } from "lucide-react";
import { BarChart } from "@/components/shared/BarChart";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { monthlyRevenue, rooms } from "@/lib/mock";
import { formatRupiah } from "@/lib/utils";

export default function OwnerReportsPage() {
  const occupied = rooms.filter((r) => r.status === "occupied").length;
  const occupancy = Math.round((occupied / rooms.length) * 100);
  const totalRevenue = monthlyRevenue.reduce((s, m) => s + m.value, 0);
  const avgRevenue = Math.round(totalRevenue / monthlyRevenue.length);
  const last = monthlyRevenue[monthlyRevenue.length - 1].value;
  const prev = monthlyRevenue[monthlyRevenue.length - 2].value;
  const delta = Math.round(((last - prev) / prev) * 100);

  return (
    <>
      <PageHeader
        title="Laporan"
        description="Performa keuangan & hunian 6 bulan terakhir."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Pendapatan Bulan Ini"
          value={formatRupiah(last)}
          icon={Wallet}
          delta={`${delta > 0 ? "+" : ""}${delta}% vs bulan lalu`}
          deltaTone={delta >= 0 ? "up" : "down"}
        />
        <StatCard
          label="Rata-rata / Bulan"
          value={formatRupiah(avgRevenue)}
          icon={TrendingUp}
        />
        <StatCard
          label="Occupancy Rate"
          value={`${occupancy}%`}
          icon={DoorOpen}
          delta={`${occupied}/${rooms.length} kamar terisi`}
          deltaTone="neutral"
        />
      </div>

      <Card>
        <CardHeader
          title="Pendapatan per Bulan"
          description="Total tagihan terbayar tiap bulan."
        />
        <div className="p-5">
          <BarChart data={monthlyRevenue} />
        </div>
      </Card>

      <Card className="border-brand/20 bg-brand-light/50">
        <div className="flex items-start gap-3 p-5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-ink">
              AI Financial Insight
            </h3>
            <p className="mt-1 text-sm text-ink-soft">
              Pendapatan Juni turun {Math.abs(delta)}% dibanding Mei karena 2
              kamar kosong sejak tanggal 10 (Kamar 102 dan 201). Jika segera
              diisi, proyeksi pendapatan Juli bisa kembali ke{" "}
              {formatRupiah(4200000)}.
            </p>
          </div>
        </div>
      </Card>
    </>
  );
}
