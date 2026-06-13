"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2, Plus, XCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table, Td, Th, Tr } from "@/components/ui/Table";
import { useInvoices, useGenerateMonthlyInvoices } from "@/lib/hooks/useInvoices";
import { formatPeriode, formatRupiah, formatTanggal } from "@/lib/utils";

export default function OwnerInvoicesPage() {
  const { data: invoices = [], isLoading } = useInvoices();
  const generateMonthly = useGenerateMonthlyInvoices();

  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const unpaid = invoices.filter((i) => i.status === "unpaid" || i.status === "overdue");

  function handleGenerate() {
    setToast(null);
    generateMonthly.mutate(undefined, {
      onSuccess: (res) => {
        const count = res.data?.count ?? 0;
        setToast({
          type: "success",
          message: count > 0
            ? `${count} tagihan berhasil dibuat untuk bulan ini.`
            : "Semua tagihan bulan ini sudah ada, tidak ada yang perlu dibuat.",
        });
      },
      onError: (err: unknown) => {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data
            ?.message ?? "Gagal generate tagihan. Coba lagi.";
        setToast({ type: "error", message: msg });
      },
    });
  }

  return (
    <>
      <PageHeader
        title="Tagihan"
        description={`${invoices.length} tagihan · ${unpaid.length} belum dibayar (${formatRupiah(unpaid.reduce((s, i) => s + i.total_amount, 0))})`}
        action={
          <Button onClick={handleGenerate} disabled={generateMonthly.isPending}>
            {generateMonthly.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Generate Tagihan
          </Button>
        }
      />

      {/* Notifikasi hasil generate */}
      {toast && (
        <div
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
            toast.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : (
            <XCircle className="h-5 w-5 shrink-0" />
          )}
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="text-current opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      <Card>
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-brand" />
          </div>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>No. Invoice</Th>
                <Th>Penghuni</Th>
                <Th>Periode</Th>
                <Th>Jatuh Tempo</Th>
                <Th className="text-right">Total</Th>
                <Th>Status</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <Tr key={inv.id}>
                  <Td className="font-mono text-xs">{inv.invoice_number}</Td>
                  <Td className="font-medium text-ink">
                    {inv.tenancy?.tenant?.name ?? "—"}
                  </Td>
                  <Td>{formatPeriode(inv.period_month, inv.period_year)}</Td>
                  <Td className="text-ink-soft">{formatTanggal(inv.due_date)}</Td>
                  <Td className="text-right font-medium">{formatRupiah(inv.total_amount)}</Td>
                  <Td>
                    <StatusBadge status={inv.status} />
                  </Td>
                  <Td>
                    <Link
                      href={`/owner/invoices/${inv.id}`}
                      className="flex items-center gap-1 text-sm font-medium text-brand hover:underline"
                    >
                      Detail <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}
