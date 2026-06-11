import { Plus, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table, Td, Th, Tr } from "@/components/ui/Table";
import { properties, rooms, tenancies } from "@/lib/mock";
import { formatRupiah, formatTanggal } from "@/lib/utils";

export default function TenantsPage() {
  return (
    <>
      <PageHeader
        title="Penghuni"
        description="Semua penghuni aktif di kost-mu."
        action={
          <Button>
            <Plus className="h-4 w-4" />
            Tambah Penghuni
          </Button>
        }
      />

      <Card>
        {tenancies.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-12 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-light text-brand">
              <UserPlus className="h-6 w-6" />
            </span>
            <p className="text-sm text-ink-soft">Belum ada penghuni.</p>
          </div>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Penghuni</Th>
                <Th>Kamar</Th>
                <Th>Properti</Th>
                <Th>Tanggal Masuk</Th>
                <Th className="text-right">Deposit</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {tenancies.map((t) => {
                const room = rooms.find((r) => r.id === t.room_id);
                const prop = properties.find(
                  (p) => p.id === room?.property_id
                );
                return (
                  <Tr key={t.id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-light text-xs font-semibold text-brand">
                          {t.tenant?.name
                            .split(" ")
                            .map((w) => w[0])
                            .slice(0, 2)
                            .join("")}
                        </span>
                        <div>
                          <p className="font-medium text-ink">
                            {t.tenant?.name}
                          </p>
                          <p className="text-xs text-ink-soft">
                            {t.tenant?.phone}
                          </p>
                        </div>
                      </div>
                    </Td>
                    <Td>Kamar {room?.room_number}</Td>
                    <Td className="text-ink-soft">{prop?.name}</Td>
                    <Td className="text-ink-soft">
                      {formatTanggal(t.start_date)}
                    </Td>
                    <Td className="text-right font-medium">
                      {t.deposit ? formatRupiah(t.deposit) : "-"}
                    </Td>
                    <Td>
                      <StatusBadge status={t.status} />
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}
