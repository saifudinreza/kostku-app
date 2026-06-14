"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Plus, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { AddTenantModal } from "@/components/shared/AddTenantModal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table, Td, Th, Tr } from "@/components/ui/Table";
import { useTenancies, useEndTenancy } from "@/lib/hooks/useTenancies";
import { formatRupiah, formatTanggal } from "@/lib/utils";

export default function TenantsPage() {
  const { data: tenancies = [], isLoading } = useTenancies();
  const endTenancy = useEndTenancy();

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmEndId, setConfirmEndId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  async function handleEnd(id: number) {
    try {
      await endTenancy.mutateAsync(id);
      setConfirmEndId(null);
      setToast({ type: "success", msg: "Sewa berhasil diakhiri. Kamar kini tersedia kembali." });
    } catch {
      setToast({ type: "error", msg: "Gagal mengakhiri sewa. Coba lagi." });
    }
  }

  return (
    <>
      <AddTenantModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setToast({ type: "success", msg: "Penghuni baru berhasil ditambahkan." })}
      />

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

      {toast && (
        <div className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${toast.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
          {toast.type === "success" && <CheckCircle2 className="h-5 w-5 shrink-0" />}
          <span className="flex-1">{toast.msg}</span>
          <button onClick={() => setToast(null)} className="opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

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
            <p className="font-medium text-ink">Belum ada penghuni</p>
            <p className="text-sm text-ink-soft">Tambahkan penghuni pertama kamu untuk mulai mengelola kost.</p>
          </div>
        ) : (
          <Table>
            <thead>
              <tr>
                {/* Kolom Penghuni selalu tampil; kolom lain disembunyikan di layar sempit */}
                <Th>Penghuni</Th>
                <Th>Kamar · Properti</Th>
                <Th className="hidden sm:table-cell">Tanggal Masuk</Th>
                <Th className="hidden md:table-cell text-right">Deposit</Th>
                <Th>Status</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {tenancies.map((t) => (
                <Tr key={t.id}>
                  {/* Penghuni — avatar hanya muncul di sm ke atas */}
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-light text-xs font-semibold text-brand sm:flex">
                        {t.tenant?.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                      </span>
                      <div>
                        <p className="font-medium text-ink">{t.tenant?.name}</p>
                        {/* Di mobile: nomor HP + kamar muncul di sini karena kolom terpisah tersembunyi */}
                        <p className="text-xs text-ink-soft sm:hidden">
                          {t.room?.property?.name} · Kamar {t.room?.room_number}
                        </p>
                        <p className="text-xs text-ink-soft">{t.tenant?.phone}</p>
                      </div>
                    </div>
                  </Td>

                  {/* Kamar + properti — satu kolom gabungan, selalu tampil */}
                  <Td>
                    <p className="text-sm font-medium text-ink">Kamar {t.room?.room_number}</p>
                    <p className="text-xs text-ink-soft">{t.room?.property?.name ?? "—"}</p>
                  </Td>

                  {/* Kolom-kolom yang disembunyikan di mobile */}
                  <Td className="hidden sm:table-cell text-ink-soft">{formatTanggal(t.start_date)}</Td>
                  <Td className="hidden md:table-cell text-right font-medium">
                    {t.deposit ? formatRupiah(t.deposit) : "-"}
                  </Td>

                  <Td>
                    <StatusBadge status={t.status} />
                  </Td>

                  <Td>
                    {t.status === "active" && (
                      confirmEndId === t.id ? (
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-1.5">
                          <span className="text-xs text-ink-soft">Yakin?</span>
                          <button
                            onClick={() => handleEnd(t.id)}
                            disabled={endTenancy.isPending}
                            className="rounded-lg bg-red-500 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-60"
                          >
                            {endTenancy.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Ya"}
                          </button>
                          <button
                            onClick={() => setConfirmEndId(null)}
                            className="rounded-lg border border-line px-2.5 py-1 text-xs font-semibold text-ink-soft hover:text-ink"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmEndId(t.id)}
                          className="whitespace-nowrap rounded-lg border border-line px-3 py-1 text-xs font-semibold text-ink-soft hover:border-red-300 hover:text-red-500 transition-colors"
                        >
                          Akhiri Sewa
                        </button>
                      )
                    )}
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
