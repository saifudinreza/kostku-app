"use client";

import Link from "next/link";
import { ArrowRight, BedDouble, DoorOpen, Loader2, TrendingUp, Wallet } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardHeader } from "@/components/ui/Card";
import { Table, Td, Th, Tr } from "@/components/ui/Table";
import { useOwnerStats } from "@/lib/hooks/useDashboard";
import { RevenueChart, OccupancyChart } from "@/components/shared/DashboardCharts";
import { formatRupiah, formatTanggal } from "@/lib/utils";

export default function OwnerDashboard() {
  const { data, isLoading } = useOwnerStats();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
      </div>
    );
  }

  const d = data!;
  const occupied = d.occupied_rooms;
  const totalRooms = d.total_rooms;
  const available = d.available_rooms;
  const maintenance = totalRooms - occupied - available;

  return (
    <>
      <PageHeader title="Dashboard" description="Ringkasan kost-mu hari ini." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Kamar" value={String(totalRooms)} icon={BedDouble} />
        <StatCard
          label="Kamar Terisi"
          value={`${occupied}/${totalRooms}`}
          icon={DoorOpen}
          delta={`${d.occupancy_rate}% occupancy`}
          deltaTone="up"
        />
        <StatCard
          label="Pendapatan Bulan Ini"
          value={formatRupiah(d.monthly_revenue)}
          icon={Wallet}
        />
        <StatCard
          label="Tagihan Belum Bayar"
          value={String(d.pending_invoices + d.overdue_invoices)}
          icon={TrendingUp}
          delta={d.overdue_invoices > 0 ? `${d.overdue_invoices} overdue` : undefined}
          deltaTone="neutral"
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Pendapatan 6 Bulan Terakhir" />
          <div className="px-4 pb-4 pt-2">
            <RevenueChart />
          </div>
        </Card>

        <Card>
          <CardHeader title="Status Kamar" />
          <div className="px-2 pb-2 pt-1">
            <OccupancyChart
              occupied={occupied}
              available={available}
              maintenance={maintenance}
            />
          </div>
        </Card>
      </div>

      {/* Recent invoices */}
      <Card>
        <CardHeader
          title="Tagihan Terbaru"
          action={
            <Link href="/owner/invoices" className="flex items-center gap-1 text-sm font-medium text-brand hover:underline">
              Semua <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <Table>
          <thead>
            <tr>
              <Th>No. Invoice</Th>
              <Th>Penghuni</Th>
              <Th>Kamar</Th>
              <Th>Jatuh Tempo</Th>
              <Th className="text-right">Total</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {d.recent_invoices.map((inv) => (
              <Tr key={inv.id}>
                <Td className="font-mono text-xs">{inv.invoice_number}</Td>
                <Td className="font-medium text-ink">{inv.tenant_name}</Td>
                <Td className="text-ink-soft">Kamar {inv.room_number}</Td>
                <Td className="text-ink-soft">{formatTanggal(inv.due_date)}</Td>
                <Td className="text-right font-medium">{formatRupiah(inv.total_amount)}</Td>
                <Td><StatusBadge status={inv.status as never} /></Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
