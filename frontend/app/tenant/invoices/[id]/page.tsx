"use client";

import Link from "next/link";
import { use, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { PaymentMethods } from "@/components/shared/PaymentMethods";
import { useInvoice } from "@/lib/hooks/useInvoices";
import { useCreateSnapToken } from "@/lib/hooks/usePayments";
import { formatPeriode, formatRupiah, formatTanggal } from "@/lib/utils";

export default function TenantInvoiceDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: invoice, isLoading } = useInvoice(Number(id));
  const createSnapToken = useCreateSnapToken();
  const [snapError, setSnapError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
      </div>
    );
  }

  if (!invoice) return <p className="p-8 text-ink-soft">Tagihan tidak ditemukan.</p>;

  async function handlePay() {
    if (!invoice) return;
    setSnapError(null);
    try {
      const result = await createSnapToken.mutateAsync(invoice.id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const snapObj = typeof window !== "undefined" ? (window as any).snap : null;
      if (snapObj) {
        snapObj.pay(result.snap_token, {
          onSuccess: () => window.location.reload(),
          onPending: () => window.location.reload(),
          onError: () => setSnapError("Pembayaran gagal. Coba lagi."),
        });
      } else {
        setSnapError(`Snap token: ${result.snap_token} (Midtrans belum di-load)`);
      }
    } catch {
      setSnapError("Gagal membuat token pembayaran.");
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

        <Card className="h-fit">
          <CardHeader title="Pembayaran" />
          <div className="space-y-4 p-5">
            <div className="flex justify-between text-sm">
              <span className="text-ink-soft">Jatuh Tempo</span>
              <span className="font-medium text-ink">{formatTanggal(invoice.due_date)}</span>
            </div>

            {invoice.status === "paid" ? (
              <div className="rounded-lg bg-[#DCFCE7] px-4 py-3 text-center text-sm font-medium text-[#15803D]">
                Tagihan ini sudah lunas.
              </div>
            ) : (
              <>
                <div>
                  <p className="mb-3 text-xs font-medium text-ink-soft">Pilih metode pembayaran</p>
                  <PaymentMethods />
                </div>
                {snapError && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{snapError}</p>
                )}
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePay}
                  disabled={createSnapToken.isPending}
                >
                  {createSnapToken.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    `Bayar ${formatRupiah(invoice.total_amount)}`
                  )}
                </Button>
                <p className="text-center text-[11px] text-ink-soft">Pembayaran aman via Midtrans Snap.</p>
              </>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
