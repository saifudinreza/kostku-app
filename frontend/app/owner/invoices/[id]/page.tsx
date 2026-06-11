"use client";

import Link from "next/link";
import { use } from "react";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { useInvoice } from "@/lib/hooks/useInvoices";
import { formatPeriode, formatRupiah, formatTanggal } from "@/lib/utils";

export default function OwnerInvoiceDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: invoice, isLoading } = useInvoice(Number(id));

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
      </div>
    );
  }

  if (!invoice) return <p className="p-8 text-ink-soft">Tagihan tidak ditemukan.</p>;

  const tenancy = invoice.tenancy;
  const room = tenancy?.room;
  const payment = invoice.payment;

  return (
    <>
      <Link
        href="/owner/invoices"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Tagihan
      </Link>

      <PageHeader
        title={invoice.invoice_number}
        description={`Periode ${formatPeriode(invoice.period_month, invoice.period_year)} · ${tenancy?.tenant?.name ?? "-"} · Kamar ${room?.room_number ?? "-"}`}
        action={
          invoice.status !== "paid" ? (
            <Button variant="outline">
              <Send className="h-4 w-4" />
              Kirim Reminder
            </Button>
          ) : undefined
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Rincian Tagihan" action={<StatusBadge status={invoice.status} />} />
          <div className="divide-y divide-line">
            {invoice.items?.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-medium text-ink">{item.name}</p>
                  {item.note && <p className="text-xs text-ink-soft">{item.note}</p>}
                </div>
                <span className="font-medium text-ink">{formatRupiah(item.amount)}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-line bg-page px-5 py-4">
            <span className="font-semibold text-ink">Total</span>
            <span className="text-lg font-bold text-ink">{formatRupiah(invoice.total_amount)}</span>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Informasi" />
            <dl className="space-y-3 p-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Jatuh Tempo</dt>
                <dd className="font-medium text-ink">{formatTanggal(invoice.due_date)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Penghuni</dt>
                <dd className="font-medium text-ink">{tenancy?.tenant?.name ?? "-"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Kamar</dt>
                <dd className="font-medium text-ink">Kamar {room?.room_number ?? "-"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Properti</dt>
                <dd className="font-medium text-ink">{room?.property?.name ?? "-"}</dd>
              </div>
            </dl>
          </Card>

          <Card>
            <CardHeader title="Pembayaran" />
            <div className="p-5 text-sm">
              {payment ? (
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">Status</dt>
                    <dd><StatusBadge status={payment.status} /></dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">Metode</dt>
                    <dd className="font-medium text-ink">{payment.payment_method ?? "-"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">Order ID</dt>
                    <dd className="font-mono text-xs text-ink">{payment.midtrans_order_id}</dd>
                  </div>
                  {payment.paid_at && (
                    <div className="flex justify-between">
                      <dt className="text-ink-soft">Dibayar</dt>
                      <dd className="font-medium text-ink">{formatTanggal(payment.paid_at)}</dd>
                    </div>
                  )}
                </dl>
              ) : (
                <p className="text-ink-soft">Belum ada pembayaran.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
