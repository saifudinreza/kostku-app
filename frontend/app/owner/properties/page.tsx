"use client";

import { useState } from "react";
import { Building2, Loader2, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { AddPropertyModal } from "@/components/shared/AddPropertyModal";
import { RoomModal } from "@/components/shared/RoomModal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useProperties } from "@/lib/hooks/useProperties";
import { useAllRooms, useDeleteRoom } from "@/lib/hooks/useRooms";
import { formatRupiah } from "@/lib/utils";
import type { Room } from "@/types";

export default function PropertiesPage() {
  const { data: properties = [], isLoading: loadingProps } = useProperties();
  const { data: rooms = [],      isLoading: loadingRooms } = useAllRooms();
  const deleteRoom = useDeleteRoom();

  // State modal properti
  const [propModalOpen, setPropModalOpen] = useState(false);

  // State modal kamar — null = tutup, number = tambah (prefill properti), Room = edit
  const [roomModal, setRoomModal] = useState<null | { defaultPropertyId?: number; room?: Room }>(null);

  // State konfirmasi hapus — simpan id kamar yang sedang dikonfirmasi
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const loading = loadingProps || loadingRooms;

  async function handleDelete(id: number) {
    await deleteRoom.mutateAsync(id);
    setConfirmDeleteId(null);
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <>
      {/* Modal tambah properti */}
      <AddPropertyModal
        open={propModalOpen}
        onClose={() => setPropModalOpen(false)}
      />

      {/* Modal tambah / edit kamar */}
      <RoomModal
        open={roomModal !== null}
        onClose={() => setRoomModal(null)}
        properties={properties}
        room={roomModal?.room}
        defaultPropertyId={roomModal?.defaultPropertyId}
      />

      <PageHeader
        title="Properti"
        description="Kelola semua kost milikmu."
        action={
          <Button onClick={() => setPropModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Tambah Properti
          </Button>
        }
      />

      {/* Kartu per properti */}
      <div className="grid gap-6 md:grid-cols-2">
        {properties.map((p) => {
          const propRooms = rooms.filter((r) => r.property_id === p.id);
          const occupied  = propRooms.filter((r) => r.status === "occupied").length;
          const minPrice  = propRooms.length > 0 ? Math.min(...propRooms.map((r) => r.price)) : 0;

          return (
            <Card key={p.id} className="overflow-hidden">
              <div className="flex h-32 items-center justify-center bg-gradient-to-br from-brand to-brand-dark">
                <Building2 className="h-12 w-12 text-white/80" />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-ink">{p.name}</h3>
                  <span className="rounded-badge bg-brand-light px-2.5 py-0.5 text-xs font-medium text-brand">
                    {p.rooms_count ?? propRooms.length} kamar
                  </span>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-soft">
                  <MapPin className="h-4 w-4" />
                  {p.address}, {p.city}
                </p>
                <div className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-ink">{occupied}</p>
                    <p className="text-xs text-ink-soft">Terisi</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-ink">{propRooms.length - occupied}</p>
                    <p className="text-xs text-ink-soft">Kosong</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink">
                      {minPrice > 0 ? formatRupiah(minPrice) : "-"}
                    </p>
                    <p className="text-xs text-ink-soft">Mulai dari</p>
                  </div>
                </div>

                {/* Tombol tambah kamar untuk properti ini */}
                <button
                  onClick={() => setRoomModal({ defaultPropertyId: p.id })}
                  className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-brand/40 py-2 text-xs font-semibold text-brand hover:bg-brand-light transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Tambah Kamar
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Tabel semua kamar dengan aksi Edit & Hapus */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] font-semibold text-ink">Semua Kamar</h3>
          <Button size="sm" onClick={() => setRoomModal({})}>
            <Plus className="h-4 w-4" />
            Tambah Kamar
          </Button>
        </div>

        {rooms.length === 0 ? (
          <p className="mt-6 text-center text-sm text-ink-soft">
            Belum ada kamar. Tambahkan kamar lewat tombol di atas.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((r) => {
              const prop = properties.find((p) => p.id === r.property_id);
              const isConfirming = confirmDeleteId === r.id;

              return (
                <div
                  key={r.id}
                  className="flex flex-col gap-3 rounded-lg border border-line p-4"
                >
                  {/* Info kamar */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-ink">Kamar {r.room_number}</p>
                      <p className="text-xs text-ink-soft">
                        {prop?.name ?? "—"} · Lantai {r.floor ?? "-"}
                      </p>
                      <p className="mt-1 text-sm font-medium text-brand">
                        {formatRupiah(r.price)}/bln
                      </p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>

                  {/* Tombol aksi */}
                  {isConfirming ? (
                    // Konfirmasi hapus
                    <div className="flex gap-2">
                      <span className="flex-1 text-center text-xs text-ink-soft">
                        Hapus kamar ini?
                      </span>
                      <button
                        onClick={() => handleDelete(r.id)}
                        disabled={deleteRoom.isPending}
                        className="rounded-lg bg-red-500 px-3 py-1 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-60"
                      >
                        {deleteRoom.isPending ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          "Ya, Hapus"
                        )}
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="rounded-lg border border-line px-3 py-1 text-xs font-semibold text-ink-soft hover:text-ink"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    // Tombol Edit + Hapus normal
                    <div className="flex gap-2">
                      <button
                        onClick={() => setRoomModal({ room: r })}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line py-1.5 text-xs font-semibold text-ink-soft hover:border-brand hover:text-brand transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(r.id)}
                        disabled={r.status === "occupied"}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line py-1.5 text-xs font-semibold text-ink-soft hover:border-red-400 hover:text-red-500 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                        title={r.status === "occupied" ? "Tidak bisa hapus kamar yang sedang terisi" : ""}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Hapus
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </>
  );
}
