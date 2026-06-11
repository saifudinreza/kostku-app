"use client";

import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card } from "@/components/ui/Card";
import { Table, Td, Th, Tr } from "@/components/ui/Table";
import { useInvoices } from "@/lib/hooks/useInvoices";
import { formatPeriode, formatRupiah, formatTanggal } from "@/lib/utils";

export default function TenantInvoicesPage() {
  const { data: invoices = [], isLoading } = useInvoices();

  return (
    <>
      <PageHeader title="Tagihan" description="Semua tagihan kamarmu." />

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
                  <Td>{formatPeriode(inv.period_month, inv.period_year)}</Td>
                  <Td className="text-ink-soft">{formatTanggal(inv.due_date)}</Td>
                  <Td className="text-right font-medium">{formatRupiah(inv.total_amount)}</Td>
                  <Td><StatusBadge status={inv.status} /></Td>
                  <Td className="text-right">
                    <Link
                      href={`/tenant/invoices/${inv.id}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
                    >
                      {inv.status === "paid" ? "Detail" : "Bayar"}
                      <ArrowRight className="h-4 w-4" />
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
