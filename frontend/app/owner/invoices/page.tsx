"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Download, FileText, Loader2, Plus, Printer, XCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table, Td, Th, Tr } from "@/components/ui/Table";
import { useInvoices, useGenerateMonthlyInvoices } from "@/lib/hooks/useInvoices";
import { useExportInvoicesCsv } from "@/lib/hooks/useRooms";
import { formatPeriode, formatRupiah, formatTanggal } from "@/lib/utils";
import { api } from "@/lib/api";

export default function OwnerInvoicesPage() {
  const { data: invoices = [], isLoading } = useInvoices();
  const generateMonthly = useGenerateMonthlyInvoices();
  const exportCsv       = useExportInvoicesCsv();

  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const unpaid = invoices.filter((i) => i.status === "unpaid" || i.status === "overdue");

  async function handlePrintPdf() {
    try {
      const res  = await api.get<string>("/export/invoices/print", { responseType: "text" });
      const win  = window.open("", "_blank");
      win?.document.write(res.data);
      win?.document.close();
    } catch {
      setToast({ type: "error", message: "Gagal membuka halaman print." });
    }
  }

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
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => exportCsv.mutate()}
              disabled={exportCsv.isPending || invoices.length === 0}
              className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-page px-3 py-2 text-sm font-semibold text-ink-soft hover:border-brand hover:text-brand transition-colors disabled:opacity-50"
            >
              {exportCsv.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              CSV
            </button>
            <button
              onClick={handlePrintPdf}
              disabled={invoices.length === 0}
              className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-page px-3 py-2 text-sm font-semibold text-ink-soft hover:border-brand hover:text-brand transition-colors disabled:opacity-50"
            >
              <Printer className="h-4 w-4" />
              Print PDF
            </button>
            <Button onClick={handleGenerate} disabled={generateMonthly.isPending}>
              {generateMonthly.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Generate Tagihan
            </Button>
          </div>
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
        ) : invoices.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-12 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-light text-brand">
              <FileText className="h-6 w-6" />
            </span>
            <p className="font-medium text-ink">Belum ada tagihan</p>
            <p className="text-sm text-ink-soft">Klik "Generate Tagihan" untuk membuat tagihan bulan ini secara otomatis.</p>
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
