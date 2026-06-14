"use client";

"use client";

import { CreditCard, Download, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card } from "@/components/ui/Card";
import { Table, Td, Th, Tr } from "@/components/ui/Table";
import { usePayments } from "@/lib/hooks/usePayments";
import { useExportPaymentsCsv } from "@/lib/hooks/useRooms";
import { formatRupiah, formatTanggal } from "@/lib/utils";

export default function OwnerPaymentsPage() {
  const { data: payments = [], isLoading } = usePayments();
  const exportCsv = useExportPaymentsCsv();

  const received = payments.filter((p) => p.status === "success").reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter((p) => p.status === "pending").length;

  return (
    <>
      <PageHeader
        title="Pembayaran"
        description="Riwayat transaksi via Midtrans."
        action={
          <button
            onClick={() => exportCsv.mutate()}
            disabled={exportCsv.isPending || payments.length === 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-page px-3 py-2 text-sm font-semibold text-ink-soft hover:border-brand hover:text-brand transition-colors disabled:opacity-50"
          >
            {exportCsv.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Export CSV
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Diterima"
          value={formatRupiah(received)}
          icon={CreditCard}
          delta={`${payments.filter((p) => p.status === "success").length} transaksi`}
          deltaTone="up"
        />
        <StatCard label="Menunggu" value={String(pending)} icon={CreditCard} delta="Pending di Midtrans" deltaTone="neutral" />
        <StatCard label="Total Transaksi" value={String(payments.length)} icon={CreditCard} />
      </div>

      <Card>
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-brand" />
          </div>
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-12 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-light text-brand">
              <CreditCard className="h-6 w-6" />
            </span>
            <p className="font-medium text-ink">Belum ada transaksi</p>
            <p className="text-sm text-ink-soft">Riwayat pembayaran via Midtrans akan muncul di sini.</p>
          </div>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Order ID</Th>
                <Th>Invoice</Th>
                <Th>Metode</Th>
                <Th className="text-right">Nominal</Th>
                <Th>Tanggal</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <Tr key={p.id}>
                  <Td className="font-mono text-xs">{p.midtrans_order_id}</Td>
                  <Td className="font-mono text-xs text-ink-soft">
                    {(p as { invoice?: { invoice_number?: string } }).invoice?.invoice_number ?? `#${p.invoice_id}`}
                  </Td>
                  <Td className="text-ink-soft">{p.payment_method ?? "-"}</Td>
                  <Td className="text-right font-medium">{formatRupiah(p.amount)}</Td>
                  <Td className="text-ink-soft">{p.paid_at ? formatTanggal(p.paid_at) : "-"}</Td>
                  <Td><StatusBadge status={p.status} /></Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}
