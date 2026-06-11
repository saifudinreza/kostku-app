"use client";

import { useState } from "react";
import { Loader2, Plus, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { AddTenantModal } from "@/components/shared/AddTenantModal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table, Td, Th, Tr } from "@/components/ui/Table";
import { useTenancies } from "@/lib/hooks/useTenancies";
import { formatRupiah, formatTanggal } from "@/lib/utils";

export default function TenantsPage() {
  const { data: tenancies = [], isLoading } = useTenancies();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <AddTenantModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <PageHeader
        title="Penghuni"
        description="Semua penghuni aktif di kost-mu."
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Tambah Penghuni
          </Button>
        }
      />

      <Card>
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-brand" />
          </div>
        ) : tenancies.length === 0 ? (
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
              {tenancies.map((t) => (
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
                        <p className="font-medium text-ink">{t.tenant?.name}</p>
                        <p className="text-xs text-ink-soft">{t.tenant?.phone}</p>
                      </div>
                    </div>
                  </Td>
                  <Td>Kamar {t.room?.room_number}</Td>
                  <Td className="text-ink-soft">{t.room?.property?.name ?? "—"}</Td>
                  <Td className="text-ink-soft">{formatTanggal(t.start_date)}</Td>
                  <Td className="text-right font-medium">
                    {t.deposit ? formatRupiah(t.deposit) : "-"}
                  </Td>
                  <Td>
                    <StatusBadge status={t.status} />
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
