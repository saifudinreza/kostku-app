"use client";

import { DoorOpen, Loader2, Sparkles, TrendingUp, Wallet } from "lucide-react";
import { BarChart } from "@/components/shared/BarChart";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { useOwnerStats, useMonthlyRevenue } from "@/lib/hooks/useDashboard";
import { formatRupiah } from "@/lib/utils";

export default function OwnerReportsPage() {
  const { data: stats, isLoading: loadingStats } = useOwnerStats();
  const { data: monthlyRevenue = [], isLoading: loadingRevenue } = useMonthlyRevenue();

  const loading = loadingStats || loadingRevenue;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
      </div>
    );
  }

  const totalRevenue = monthlyRevenue.reduce((s, m) => s + m.value, 0);
  const avgRevenue = monthlyRevenue.length > 0 ? Math.round(totalRevenue / monthlyRevenue.length) : 0;
  const last = monthlyRevenue[monthlyRevenue.length - 1]?.value ?? 0;
  const prev = monthlyRevenue[monthlyRevenue.length - 2]?.value ?? 0;
  const delta = prev > 0 ? Math.round(((last - prev) / prev) * 100) : 0;

  return (
    <>
      <PageHeader title="Laporan" description="Performa keuangan & hunian 6 bulan terakhir." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Pendapatan Bulan Ini"
          value={formatRupiah(last || (stats?.monthly_revenue ?? 0))}
          icon={Wallet}
          delta={monthlyRevenue.length > 1 ? `${delta > 0 ? "+" : ""}${delta}% vs bulan lalu` : undefined}
          deltaTone={delta >= 0 ? "up" : "down"}
        />
        <StatCard label="Rata-rata / Bulan" value={formatRupiah(avgRevenue)} icon={TrendingUp} />
        <StatCard
          label="Occupancy Rate"
          value={`${stats?.occupancy_rate ?? 0}%`}
          icon={DoorOpen}
          delta={`${stats?.occupied_rooms ?? 0}/${stats?.total_rooms ?? 0} kamar terisi`}
          deltaTone="neutral"
        />
      </div>

      {monthlyRevenue.length > 0 && (
        <Card>
          <CardHeader title="Pendapatan per Bulan" description="Total tagihan terbayar tiap bulan." />
          <div className="p-5">
            <BarChart data={monthlyRevenue} />
          </div>
        </Card>
      )}

      <Card className="border-brand/20 bg-brand-light/50">
        <div className="flex items-start gap-3 p-5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-ink">AI Financial Insight</h3>
            <p className="mt-1 text-sm text-ink-soft">
              Tingkat hunian {stats?.occupancy_rate ?? 0}% ({stats?.occupied_rooms ?? 0}/{stats?.total_rooms ?? 0} kamar).
              {stats && stats.overdue_invoices > 0
                ? ` Terdapat ${stats.overdue_invoices} tagihan overdue — segera follow-up untuk menjaga arus kas.`
                : " Semua tagihan terkini dalam kondisi baik."}
            </p>
          </div>
        </div>
      </Card>
    </>
  );
}
