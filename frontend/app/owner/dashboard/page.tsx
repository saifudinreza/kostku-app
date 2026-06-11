"use client";

import Link from "next/link";
import { ArrowRight, BedDouble, DoorOpen, Loader2, Sparkles, TrendingUp, Wallet } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardHeader } from "@/components/ui/Card";
import { Table, Td, Th, Tr } from "@/components/ui/Table";
import { useOwnerStats } from "@/lib/hooks/useDashboard";
import { formatPeriode, formatRupiah, formatTanggal } from "@/lib/utils";

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

      <Card className="border-brand/20 bg-brand-light/50">
        <div className="flex items-start gap-3 p-5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-ink">AI Financial Insight</h3>
            <p className="mt-1 text-sm text-ink-soft">
              Tingkat hunian saat ini {d.occupancy_rate}% ({occupied}/{totalRooms} kamar).
              {d.overdue_invoices > 0
                ? ` Terdapat ${d.overdue_invoices} tagihan overdue yang perlu ditindaklanjuti.`
                : " Semua tagihan dalam kondisi baik."}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
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

        <Card>
          <CardHeader title="Status Kamar" />
          <div className="space-y-4 p-5">
            {[
              { label: "Terisi", value: occupied, color: "bg-[#6D28D9]" },
              { label: "Tersedia", value: available, color: "bg-[#0F766E]" },
              { label: "Maintenance", value: maintenance, color: "bg-[#92400E]" },
            ].map((s) => (
              <div key={s.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-ink-soft">{s.label}</span>
                  <span className="font-semibold text-ink">{s.value}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full [box-shadow:inset_2px_2px_5px_#d0d2e2,inset_-2px_-2px_5px_#ffffff]">
                  <div
                    className={`h-full rounded-full ${s.color}`}
                    style={{ width: totalRooms > 0 ? `${(s.value / totalRooms) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
