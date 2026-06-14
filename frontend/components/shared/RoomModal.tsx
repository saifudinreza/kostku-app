"use client";

// Modal untuk TAMBAH dan EDIT kamar.
// Kalau prop `room` diisi → mode Edit (prefill data lama).
// Kalau `room` kosong → mode Tambah (form kosong).

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Star, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCreateRoom, useDeleteRoomImage, useSetPrimaryImage, useUpdateRoom, useUploadRoomImage } from "@/lib/hooks/useRooms";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { formatRupiah } from "@/lib/utils";
import type { Property, Room, RoomImage, RoomStatus } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  properties: Property[];   // daftar properti milik owner untuk dropdown
  room?: Room;              // diisi saat mode Edit
  defaultPropertyId?: number; // prefill properti saat klik "Tambah Kamar" dari kartu properti
}

const STATUS_OPTIONS: { value: RoomStatus; label: string }[] = [
  { value: "available",   label: "Tersedia" },
  { value: "occupied",    label: "Terisi" },
  { value: "maintenance", label: "Maintenance" },
];

export function RoomModal({ open, onClose, onSuccess, properties, room, defaultPropertyId }: Props) {
  const isEdit = !!room;
  const trapRef = useFocusTrap(open, onClose);

  const createRoom    = useCreateRoom();
  const updateRoom    = useUpdateRoom(room?.id ?? 0);
  const uploadImage   = useUploadRoomImage(room?.id ?? 0);
  const deleteImage   = useDeleteRoomImage();
  const setPrimary    = useSetPrimaryImage();
  const isPending     = createRoom.isPending || updateRoom.isPending;

  const fileInputRef  = useRef<HTMLInputElement>(null);
  const [images, setImages]           = useState<RoomImage[]>([]);

  const [propertyId, setPropertyId] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [floor,      setFloor]      = useState("");
  const [price,      setPrice]      = useState("");
  const [status,     setStatus]     = useState<RoomStatus>("available");
  const [description, setDescription] = useState("");
  const [error,      setError]      = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

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
      setImages(room.images ?? []);
    } else {
      setPropertyId(defaultPropertyId ? String(defaultPropertyId) : "");
      setRoomNumber("");
      setFloor("");
      setPrice("");
      setStatus("available");
      setDescription("");
      setImages([]);
    }
    setError(null);
    setPhotoError(null);
  }, [open, isEdit, room, defaultPropertyId]);

  function handleClose() {
    setError(null);
    setPhotoError(null);
    onClose();
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !room?.id) return;
    setPhotoError(null);
    try {
      const img = await uploadImage.mutateAsync(file);
      setImages((prev) => [...prev, img]);
    } catch {
      setPhotoError("Gagal upload foto. Pastikan ukuran < 10MB.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDeletePhoto(imageId: number) {
    try {
      await deleteImage.mutateAsync(imageId);
      setImages((prev) => {
        const remaining = prev.filter((img) => img.id !== imageId);
        // Jika yang dihapus adalah primary, set primary ke foto pertama
        if (prev.find((img) => img.id === imageId)?.is_primary && remaining.length > 0) {
          remaining[0].is_primary = true;
        }
        return remaining;
      });
    } catch {
      setPhotoError("Gagal menghapus foto.");
    }
  }

  async function handleSetPrimary(imageId: number) {
    try {
      await setPrimary.mutateAsync(imageId);
      setImages((prev) =>
        prev.map((img) => ({ ...img, is_primary: img.id === imageId }))
      );
    } catch {
      setPhotoError("Gagal set foto utama.");
    }
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
      onSuccess?.();
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
      ref={trapRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="room-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="flex max-h-[90vh] w-full max-w-md flex-col rounded-2xl bg-page shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 id="room-modal-title" className="text-base font-bold text-ink">
            {isEdit ? "Edit Kamar" : "Tambah Kamar"}
          </h2>
          <button
            onClick={handleClose}
            aria-label="Tutup modal"
            className="rounded-lg p-1 text-ink-soft hover:bg-line hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-4 overflow-y-auto p-6">
          {!isEdit && (
            <div>
              <label htmlFor="room-property" className="mb-1.5 block text-sm font-bold text-ink">
                Properti
              </label>
              <select
                id="room-property"
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="room-number" className="mb-1.5 block text-sm font-bold text-ink">
                Nomor Kamar
              </label>
              <input
                id="room-number"
                type="text"
                required
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="101, A1, ..."
                className="nm-input h-11 w-full rounded-xl px-3.5 text-sm text-ink outline-none"
              />
            </div>
            <div>
              <label htmlFor="room-floor" className="mb-1.5 block text-sm font-bold text-ink">
                Lantai{" "}
                <span className="font-normal text-ink-soft">(opsional)</span>
              </label>
              <input
                id="room-floor"
                type="number"
                min={1}
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                placeholder="1"
                className="nm-input h-11 w-full rounded-xl px-3.5 text-sm text-ink outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="room-price" className="mb-1.5 block text-sm font-bold text-ink">
              Harga Sewa / Bulan
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-soft">
                Rp
              </span>
              <input
                id="room-price"
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

          <div>
            <p className="mb-1.5 text-sm font-bold text-ink">Status</p>
            <div role="group" aria-label="Status kamar" className="grid grid-cols-3 gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={status === opt.value}
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

          <div>
            <label htmlFor="room-desc" className="mb-1.5 block text-sm font-bold text-ink">
              Deskripsi{" "}
              <span className="font-normal text-ink-soft">(opsional)</span>
            </label>
            <textarea
              id="room-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kamar dengan AC, kamar mandi dalam, ..."
              className="nm-input w-full resize-none rounded-xl px-3.5 py-3 text-sm text-ink outline-none"
            />
          </div>

          {/* Foto kamar — hanya ditampilkan saat edit (room sudah ada di DB) */}
          {isEdit && (
            <div>
              <p className="mb-1.5 text-sm font-bold text-ink">Foto Kamar</p>

              {images.length > 0 && (
                <div className="mb-2 grid grid-cols-3 gap-2">
                  {images.map((img) => (
                    <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-line">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "http://localhost:8000"}/storage/${img.image_path}`}
                        alt="Foto kamar"
                        className="h-full w-full object-cover"
                      />
                      {img.is_primary && (
                        <span className="absolute left-1 top-1 flex items-center gap-0.5 rounded-md bg-brand/90 px-1.5 py-0.5 text-[10px] font-bold text-white">
                          <Star className="h-2.5 w-2.5 fill-white" /> Utama
                        </span>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        {!img.is_primary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(img.id)}
                            disabled={setPrimary.isPending}
                            className="rounded-lg bg-white/90 p-1.5 text-brand hover:bg-white"
                            title="Set sebagai foto utama"
                          >
                            <Star className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(img.id)}
                          disabled={deleteImage.isPending}
                          className="rounded-lg bg-white/90 p-1.5 text-red-500 hover:bg-white"
                          title="Hapus foto"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadImage.isPending}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-brand/40 py-2.5 text-xs font-semibold text-brand hover:bg-brand-light transition-colors disabled:opacity-60"
              >
                {uploadImage.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ImagePlus className="h-4 w-4" />
                )}
                {uploadImage.isPending ? "Mengupload..." : "Upload Foto"}
              </button>

              {photoError && (
                <p className="mt-1.5 text-xs text-red-500">{photoError}</p>
              )}
            </div>
          )}

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
