import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table, Td, Th, Tr } from "@/components/ui/Table";
import { invoices, rooms, tenancies } from "@/lib/mock";
import { formatPeriode, formatRupiah, formatTanggal } from "@/lib/utils";

export default function OwnerInvoicesPage() {
  const total = invoices.reduce((s, i) => s + i.total_amount, 0);
  const unpaid = invoices.filter(
    (i) => i.status === "unpaid" || i.status === "overdue"
  );

  return (
    <>
      <PageHeader
        title="Tagihan"
        description={`${invoices.length} tagihan · ${unpaid.length} belum dibayar (${formatRupiah(
          unpaid.reduce((s, i) => s + i.total_amount, 0)
        )})`}
        action={
          <Button>
            <Plus className="h-4 w-4" />
            Generate Tagihan
          </Button>
        }
      />

      <Card>
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
            {invoices.map((inv) => {
              const tenancy = tenancies.find((t) => t.id === inv.tenancy_id);
              const room = rooms.find((r) => r.id === tenancy?.room_id);
              return (
                <Tr key={inv.id}>
                  <Td className="font-mono text-xs">{inv.invoice_number}</Td>
                  <Td>
                    <p className="font-medium text-ink">
                      {tenancy?.tenant?.name ?? "-"}
                    </p>
                    <p className="text-xs text-ink-soft">
                      Kamar {room?.room_number}
                    </p>
                  </Td>
                  <Td>{formatPeriode(inv.period_month, inv.period_year)}</Td>
                  <Td className="text-ink-soft">
                    {formatTanggal(inv.due_date)}
                  </Td>
                  <Td className="text-right font-medium">
                    {formatRupiah(inv.total_amount)}
                  </Td>
                  <Td>
                    <StatusBadge status={inv.status} />
                  </Td>
                  <Td className="text-right">
                    <Link
                      href={`/owner/invoices/${inv.id}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
                    >
                      Detail <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Td>
                </Tr>
              );
            })}
          </tbody>
        </Table>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-ink-soft">Total seluruh tagihan</span>
          <span className="text-lg font-bold text-ink">
            {formatRupiah(total)}
          </span>
        </div>
      </Card>
    </>
  );
}
