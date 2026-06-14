"use client";

import Link from "next/link";
import { use, useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { useInvoice } from "@/lib/hooks/useInvoices";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { formatPeriode, formatRupiah, formatTanggal } from "@/lib/utils";

export default function OwnerInvoiceDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: invoice, isLoading } = useInvoice(Number(id));
  const qc = useQueryClient();

  const [confirmPaid, setConfirmPaid] = useState(false);
  const [paying, setPaying] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
      </div>
    );
  }

  if (!invoice) return <p className="p-8 text-ink-soft">Tagihan tidak ditemukan.</p>;

  const tenancy = invoice.tenancy;
  const room    = tenancy?.room;
  const payment = invoice.payment;
  const isPaid  = invoice.status === "paid";

  async function handleMarkPaid() {
    setPaying(true);
    setToast(null);
    try {
      await api.put(`/invoices/${invoice!.id}`, { status: "paid" });
      await qc.invalidateQueries({ queryKey: ["invoices"] });
      setToast({ type: "success", msg: "Tagihan berhasil ditandai lunas." });
      setConfirmPaid(false);
    } catch {
      setToast({ type: "error", msg: "Gagal memperbarui status tagihan." });
    } finally {
      setPaying(false);
    }
  }

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
      />

      {toast && (
        <div className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${toast.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
          {toast.type === "success" && <CheckCircle2 className="h-5 w-5 shrink-0" />}
          <span className="flex-1">{toast.msg}</span>
          <button onClick={() => setToast(null)} className="opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Rincian item tagihan */}
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

        <div className="space-y-4">
          {/* Info tagihan */}
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

          {/* Info pembayaran Midtrans */}
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
                    <dd className="font-medium text-ink capitalize">{payment.payment_method?.replace("_", " ") ?? "-"}</dd>
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
                <p className="text-ink-soft">Belum ada pembayaran via Midtrans.</p>
              )}
            </div>
          </Card>

          {/* Konfirmasi bayar manual (tunai/transfer) */}
          {!isPaid && (
            <Card className="p-5">
              <p className="mb-1 text-sm font-semibold text-ink">Konfirmasi Bayar Manual</p>
              <p className="mb-4 text-xs text-ink-soft">
                Penghuni sudah bayar tunai / transfer langsung? Tandai lunas di sini.
              </p>
              {confirmPaid ? (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-ink">Yakin tandai tagihan ini sudah lunas?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleMarkPaid}
                      disabled={paying}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-green-600 py-2 text-xs font-bold text-white hover:bg-green-700 disabled:opacity-60"
                    >
                      {paying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                      Ya, Lunas
                    </button>
                    <button
                      onClick={() => setConfirmPaid(false)}
                      className="flex-1 rounded-xl border border-line py-2 text-xs font-semibold text-ink-soft hover:text-ink"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <Button variant="outline" className="w-full" onClick={() => setConfirmPaid(true)}>
                  Tandai Sudah Bayar
                </Button>
              )}
            </Card>
          )}

          {isPaid && (
            <div className="rounded-xl bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700">
              ✓ Tagihan ini sudah lunas
            </div>
          )}
        </div>
      </div>
    </>
  );
}
