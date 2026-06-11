import { Receipt } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card } from "@/components/ui/Card";
import { Table, Td, Th, Tr } from "@/components/ui/Table";
import { currentTenant, invoices, payments, tenancies } from "@/lib/mock";
import { formatRupiah, formatTanggal } from "@/lib/utils";

export default function TenantPaymentsPage() {
  const tenancy = tenancies.find((t) => t.tenant_id === currentTenant.id);
  const myInvoiceIds = new Set(
    invoices.filter((i) => i.tenancy_id === tenancy?.id).map((i) => i.id)
  );
  const myPayments = payments.filter((p) => myInvoiceIds.has(p.invoice_id));

  return (
    <>
      <PageHeader
        title="Pembayaran"
        description="Riwayat pembayaran dan bukti transaksi."
      />

      <Card>
        {myPayments.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-12 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-light text-brand">
              <Receipt className="h-6 w-6" />
            </span>
            <p className="text-sm text-ink-soft">Belum ada pembayaran.</p>
          </div>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Order ID</Th>
                <Th>Metode</Th>
                <Th className="text-right">Nominal</Th>
                <Th>Tanggal</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {myPayments.map((p) => (
                <Tr key={p.id}>
                  <Td className="font-mono text-xs">{p.midtrans_order_id}</Td>
                  <Td className="text-ink-soft">{p.payment_method ?? "-"}</Td>
                  <Td className="text-right font-medium">
                    {formatRupiah(p.amount)}
                  </Td>
                  <Td className="text-ink-soft">
                    {p.paid_at ? formatTanggal(p.paid_at) : "-"}
                  </Td>
                  <Td>
                    <StatusBadge status={p.status} />
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
