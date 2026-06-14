"use client";

import Link from "next/link";
import { use, useState } from "react";
import { ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { PaymentMethods } from "@/components/shared/PaymentMethods";
import { useInvoice } from "@/lib/hooks/useInvoices";
import { useCreateSnapToken, useCheckPaymentStatus } from "@/lib/hooks/usePayments";
import { formatPeriode, formatRupiah, formatTanggal } from "@/lib/utils";
import type { PaymentMethod } from "@/lib/payments";

export default function TenantInvoiceDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: invoice, isLoading } = useInvoice(Number(id));
  const createSnapToken    = useCreateSnapToken();
  const checkStatus        = useCheckPaymentStatus();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [snapError, setSnapError]           = useState<string | null>(null);
  const [statusMsg, setStatusMsg]           = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
      </div>
    );
  }

  if (!invoice) return <p className="p-8 text-ink-soft">Tagihan tidak ditemukan.</p>;

  async function syncStatus() {
    if (!invoice) return;
    setStatusMsg(null);
    try {
      const res = await checkStatus.mutateAsync(invoice.id);
      if (res.invoice_status === "paid") {
        setStatusMsg("✓ Pembayaran dikonfirmasi. Halaman akan diperbarui...");
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setStatusMsg(`Status dari Midtrans: ${res.transaction_status ?? "tidak diketahui"}. Coba beberapa saat lagi.`);
      }
    } catch {
      setStatusMsg("Gagal cek status. Pastikan kamu sudah menyelesaikan pembayaran di Midtrans.");
    }
  }

  async function handlePay() {
    if (!invoice) return;
    setSnapError(null);

    try {
      const result = await createSnapToken.mutateAsync({
        invoiceId: invoice.id,
        enabledPayments: selectedMethod ? [selectedMethod.midtransCode] : undefined,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const snapObj = typeof window !== "undefined" ? (window as any).snap : null;
      if (snapObj) {
        snapObj.pay(result.snap_token, {
          // Setelah Snap selesai, sync status dari Midtrans ke DB lokal
          onSuccess: () => syncStatus(),
          onPending: () => syncStatus(),
          onError:   () => setSnapError("Pembayaran gagal di Midtrans. Coba lagi."),
          onClose:   () => {},
        });
      } else {
        setSnapError(`Snap JS belum di-load. Token: ${result.snap_token}`);
      }
    } catch {
      setSnapError("Gagal membuat token pembayaran. Coba lagi.");
    }
  }

  return (
    <>
      <Link
        href="/tenant/invoices"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Tagihan
      </Link>

      <PageHeader
        title={invoice.invoice_number}
        description={`Periode ${formatPeriode(invoice.period_month, invoice.period_year)}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Panel pembayaran — tampil di atas di mobile, kanan di desktop */}
        <Card className="order-first h-fit lg:order-last">
          <CardHeader title="Pembayaran" />
          <div className="space-y-4 p-5">
            <div className="flex justify-between text-sm">
              <span className="text-ink-soft">Jatuh Tempo</span>
              <span className="font-medium text-ink">{formatTanggal(invoice.due_date)}</span>
            </div>

            {invoice.status === "paid" ? (
              <div className="rounded-lg bg-green-100 px-4 py-3 text-center text-sm font-medium text-green-700">
                ✓ Tagihan ini sudah lunas.
              </div>
            ) : (
              <>
                <div>
                  <p className="mb-3 text-xs font-medium text-ink-soft">
                    Pilih metode pembayaran
                  </p>
                  <PaymentMethods onSelect={setSelectedMethod} />
                </div>

                {snapError && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                    {snapError}
                  </p>
                )}

                {statusMsg && (
                  <p className={`rounded-lg px-3 py-2 text-sm ${statusMsg.startsWith("✓") ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                    {statusMsg}
                  </p>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePay}
                  disabled={createSnapToken.isPending || checkStatus.isPending || !selectedMethod}
                >
                  {createSnapToken.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : selectedMethod ? (
                    `Bayar via ${selectedMethod.label}`
                  ) : (
                    "Pilih metode pembayaran dulu"
                  )}
                </Button>

                {/* Tombol ini muncul jika sudah pernah ada transaksi tapi status belum terupdate */}
                {invoice.payment && (
                  <button
                    onClick={syncStatus}
                    disabled={checkStatus.isPending}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-line py-2 text-xs font-semibold text-ink-soft transition-colors hover:border-brand hover:text-brand disabled:opacity-60"
                  >
                    {checkStatus.isPending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3.5 w-3.5" />
                    )}
                    Sudah bayar? Cek status pembayaran
                  </button>
                )}

                <p className="text-center text-[11px] text-ink-soft">
                  Pembayaran aman via Midtrans Snap.
                </p>
              </>
            )}
          </div>
        </Card>

        {/* Rincian tagihan */}
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

      </div>
    </>
  );
}
