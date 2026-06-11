import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  DoorOpen,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardHeader } from "@/components/ui/Card";
import { Table, Td, Th, Tr } from "@/components/ui/Table";
import { invoices, rooms, tenancies } from "@/lib/mock";
import { formatPeriode, formatRupiah, formatTanggal } from "@/lib/utils";

export default function OwnerDashboard() {
  const totalRooms = rooms.length;
  const occupied = rooms.filter((r) => r.status === "occupied").length;
  const available = rooms.filter((r) => r.status === "available").length;
  const monthlyRevenue = tenancies
    .filter((t) => t.status === "active")
    .reduce((sum, t) => sum + (t.room?.price ?? 0), 0);
  const unpaid = invoices.filter(
    (i) => i.status === "unpaid" || i.status === "overdue"
  );

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Ringkasan kost-mu hari ini."
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Kamar" value={String(totalRooms)} icon={BedDouble} />
        <StatCard
          label="Kamar Terisi"
          value={`${occupied}/${totalRooms}`}
          icon={DoorOpen}
          delta={`${Math.round((occupied / totalRooms) * 100)}% occupancy`}
          deltaTone="up"
        />
        <StatCard
          label="Pendapatan Bulan Ini"
          value={formatRupiah(monthlyRevenue)}
          icon={Wallet}
          delta="-15% vs Mei"
          deltaTone="down"
        />
        <StatCard
          label="Tagihan Belum Bayar"
          value={String(unpaid.length)}
          icon={TrendingUp}
          delta={formatRupiah(
            unpaid.reduce((s, i) => s + i.total_amount, 0)
          )}
          deltaTone="neutral"
        />
      </div>

      {/* AI insight */}
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
              Pendapatan Juni turun 15% dibanding Mei karena 2 kamar kosong sejak
              tanggal 10 (Kamar 102 dan 201). Jika segera diisi, proyeksi
              pendapatan Juli bisa kembali ke {formatRupiah(4200000)}.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Tagihan belum bayar */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Tagihan Terbaru"
            action={
              <Link
                href="/owner/invoices"
                className="flex items-center gap-1 text-sm font-medium text-brand hover:underline"
              >
                Semua <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <Table>
            <thead>
              <tr>
                <Th>No. Invoice</Th>
                <Th>Periode</Th>
                <Th>Jatuh Tempo</Th>
                <Th className="text-right">Total</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <Tr key={inv.id}>
                  <Td className="font-mono text-xs">{inv.invoice_number}</Td>
                  <Td>{formatPeriode(inv.period_month, inv.period_year)}</Td>
                  <Td className="text-ink-soft">{formatTanggal(inv.due_date)}</Td>
                  <Td className="text-right font-medium">
                    {formatRupiah(inv.total_amount)}
                  </Td>
                  <Td>
                    <StatusBadge status={inv.status} />
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </Card>

        {/* Status kamar */}
        <Card>
          <CardHeader title="Status Kamar" />
          <div className="space-y-4 p-5">
            {[
              { label: "Terisi", value: occupied, color: "bg-[#6D28D9]" },
              { label: "Tersedia", value: available, color: "bg-[#0F766E]" },
              {
                label: "Maintenance",
                value: rooms.filter((r) => r.status === "maintenance").length,
                color: "bg-[#92400E]",
              },
            ].map((s) => (
              <div key={s.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-ink-soft">{s.label}</span>
                  <span className="font-semibold text-ink">{s.value}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full [box-shadow:inset_2px_2px_5px_#d0d2e2,inset_-2px_-2px_5px_#ffffff]">
                  <div
                    className={`h-full rounded-full ${s.color}`}
                    style={{ width: `${(s.value / totalRooms) * 100}%` }}
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
