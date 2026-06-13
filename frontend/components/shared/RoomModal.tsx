"use client";

// Modal untuk TAMBAH dan EDIT kamar.
// Kalau prop `room` diisi → mode Edit (prefill data lama).
// Kalau `room` kosong → mode Tambah (form kosong).

import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCreateRoom, useUpdateRoom } from "@/lib/hooks/useRooms";
import { formatRupiah } from "@/lib/utils";
import type { Property, Room, RoomStatus } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  properties: Property[];   // daftar properti milik owner untuk dropdown
  room?: Room;              // diisi saat mode Edit
  defaultPropertyId?: number; // prefill properti saat klik "Tambah Kamar" dari kartu properti
}

const STATUS_OPTIONS: { value: RoomStatus; label: string }[] = [
  { value: "available",   label: "Tersedia" },
  { value: "occupied",    label: "Terisi" },
  { value: "maintenance", label: "Maintenance" },
];

export function RoomModal({ open, onClose, properties, room, defaultPropertyId }: Props) {
  const isEdit = !!room;

  const createRoom              = useCreateRoom();
  // useUpdateRoom butuh id saat inisialisasi — pakai 0 sebagai fallback aman
  const updateRoom              = useUpdateRoom(room?.id ?? 0);
  const isPending               = createRoom.isPending || updateRoom.isPending;

  const [propertyId, setPropertyId] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [floor,      setFloor]      = useState("");
  const [price,      setPrice]      = useState("");
  const [status,     setStatus]     = useState<RoomStatus>("available");
  const [description, setDescription] = useState("");
  const [error,      setError]      = useState<string | null>(null);

  // Isi form saat modal dibuka
  useEffect(() => {
    if (!open) return;
    if (isEdit && room) {
      setPropertyId(String(room.property_id));
      setRoomNumber(room.room_number);
      setFloor(room.floor != null ? String(room.floor) : "");
      setPrice(String(room.price));
      setStatus(room.status);
      setDescription(room.description ?? "");
    } else {
      setPropertyId(defaultPropertyId ? String(defaultPropertyId) : "");
      setRoomNumber("");
      setFloor("");
      setPrice("");
      setStatus("available");
      setDescription("");
    }
    setError(null);
  }, [open, isEdit, room, defaultPropertyId]);

  function handleClose() {
    setError(null);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const payload = {
      property_id: Number(propertyId),
      room_number: roomNumber,
      floor:       floor ? Number(floor) : undefined,
      price:       Number(price),
      status,
      description: description || undefined,
    };

    try {
      if (isEdit) {
        // Edit: kirim hanya field yang boleh diubah
        await updateRoom.mutateAsync({
          room_number: payload.room_number,
          floor:       payload.floor,
          price:       payload.price,
          status:      payload.status,
          description: payload.description,
        });
      } else {
        await createRoom.mutateAsync(payload);
      }
      handleClose();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Gagal menyimpan kamar. Coba lagi.";
      setError(msg);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="w-full max-w-md rounded-2xl bg-page shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="text-base font-bold text-ink">
            {isEdit ? "Edit Kamar" : "Tambah Kamar"}
          </h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-1 text-ink-soft hover:bg-line hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* Pilih properti — hanya untuk mode Tambah */}
          {!isEdit && (
            <div>
              <label className="mb-1.5 block text-sm font-bold text-ink">
                Properti
              </label>
              <select
                required
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                className="nm-input h-11 w-full rounded-xl px-3.5 text-sm text-ink outline-none"
              >
                <option value="">-- Pilih Properti --</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.city}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Nomor kamar + lantai dalam satu baris */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-ink">
                Nomor Kamar
              </label>
              <input
                type="text"
                required
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="101, A1, ..."
                className="nm-input h-11 w-full rounded-xl px-3.5 text-sm text-ink outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-ink">
                Lantai{" "}
                <span className="font-normal text-ink-soft">(opsional)</span>
              </label>
              <input
                type="number"
                min={1}
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                placeholder="1"
                className="nm-input h-11 w-full rounded-xl px-3.5 text-sm text-ink outline-none"
              />
            </div>
          </div>

          {/* Harga */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink">
              Harga Sewa / Bulan
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-soft">
                Rp
              </span>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1500000"
                className="nm-input h-11 w-full rounded-xl pl-10 pr-3.5 text-sm text-ink outline-none"
              />
            </div>
            {price && (
              <p className="mt-1 text-xs text-ink-soft">
                {formatRupiah(Number(price))} per bulan
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink">
              Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className={
                    "rounded-xl border py-2 text-xs font-semibold transition-all " +
                    (status === opt.value
                      ? "border-brand bg-brand-light text-brand"
                      : "border-line bg-page text-ink-soft hover:border-brand/50")
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink">
              Deskripsi{" "}
              <span className="font-normal text-ink-soft">(opsional)</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kamar dengan AC, kamar mandi dalam, ..."
              className="nm-input w-full resize-none rounded-xl px-3.5 py-3 text-sm text-ink outline-none"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
              Batal
            </Button>
            <button
              type="submit"
              disabled={isPending}
              className="kk-btn kk-btn-primary flex flex-1 items-center justify-center gap-2 rounded-xl text-sm font-bold disabled:opacity-60"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Simpan Perubahan" : "Tambah Kamar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
