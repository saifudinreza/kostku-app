import { CreditCard } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card } from "@/components/ui/Card";
import { Table, Td, Th, Tr } from "@/components/ui/Table";
import { invoices, payments, rooms, tenancies } from "@/lib/mock";
import { formatRupiah, formatTanggal } from "@/lib/utils";

export default function OwnerPaymentsPage() {
  const received = payments
    .filter((p) => p.status === "success")
    .reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter((p) => p.status === "pending").length;

  return (
    <>
      <PageHeader
        title="Pembayaran"
        description="Riwayat transaksi via Midtrans."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Diterima"
          value={formatRupiah(received)}
          icon={CreditCard}
          delta={`${payments.filter((p) => p.status === "success").length} transaksi`}
          deltaTone="up"
        />
        <StatCard
          label="Menunggu"
          value={String(pending)}
          icon={CreditCard}
          delta="Pending di Midtrans"
          deltaTone="neutral"
        />
        <StatCard
          label="Total Transaksi"
          value={String(payments.length)}
          icon={CreditCard}
        />
      </div>

      <Card>
        <Table>
          <thead>
            <tr>
              <Th>Order ID</Th>
              <Th>Penghuni</Th>
              <Th>Metode</Th>
              <Th className="text-right">Nominal</Th>
              <Th>Tanggal</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => {
              const inv = invoices.find((i) => i.id === p.invoice_id);
              const tenancy = tenancies.find((t) => t.id === inv?.tenancy_id);
              const room = rooms.find((r) => r.id === tenancy?.room_id);
              return (
                <Tr key={p.id}>
                  <Td className="font-mono text-xs">{p.midtrans_order_id}</Td>
                  <Td>
                    <p className="font-medium text-ink">
                      {tenancy?.tenant?.name ?? "-"}
                    </p>
                    <p className="text-xs text-ink-soft">
                      Kamar {room?.room_number}
                    </p>
                  </Td>
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
              );
            })}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
