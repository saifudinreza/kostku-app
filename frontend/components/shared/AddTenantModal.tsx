"use client";

// =============================================================================
// AddTenantModal — modal form untuk menambah penghuni baru ke sebuah kamar.
// ANALOGI: formulir pendaftaran masuk kost — owner isi data, lalu simpan.
//
// Alur data:
//   Owner isi form → useCreateTenancy().mutate() → POST /api/tenancies
//   → backend cari user by email → buat Tenancy + ubah status kamar → selesai
// =============================================================================

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAllRooms } from "@/lib/hooks/useRooms";
import { useCreateTenancy } from "@/lib/hooks/useTenancies";
import { formatRupiah } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AddTenantModal({ open, onClose }: Props) {
  const { data: rooms = [], isLoading: roomsLoading } = useAllRooms();
  const createTenancy = useCreateTenancy();

  // Field form
  const [tenantEmail, setTenantEmail] = useState("");
  const [roomId, setRoomId] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10) // default hari ini
  );
  const [endDate, setEndDate] = useState("");
  const [deposit, setDeposit] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Hanya tampilkan kamar yang kosong (status 'available')
  const availableRooms = rooms.filter((r) => r.status === "available");

  function handleClose() {
    // Reset semua field saat modal ditutup
    setTenantEmail("");
    setRoomId("");
    setStartDate(new Date().toISOString().slice(0, 10));
    setEndDate("");
    setDeposit("");
    setError(null);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!roomId) {
      setError("Pilih kamar terlebih dahulu.");
      return;
    }

    try {
      await createTenancy.mutateAsync({
        tenant_email: tenantEmail,
        room_id: Number(roomId),
        start_date: startDate,
        end_date: endDate || undefined,
        deposit: deposit ? Number(deposit) : undefined,
      });
      handleClose();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Gagal menambah penghuni. Coba lagi.";
      setError(msg);
    }
  }

  // Tidak render apa pun kalau modal tertutup
  if (!open) return null;

  return (
    // Overlay gelap di belakang modal — klik di luar untuk tutup
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-page shadow-2xl">
        {/* Header modal */}
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="text-base font-bold text-ink">Tambah Penghuni</h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-1 text-ink-soft hover:bg-line hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* Email penghuni */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink">
              Email Penghuni
            </label>
            <input
              type="email"
              required
              value={tenantEmail}
              onChange={(e) => setTenantEmail(e.target.value)}
              placeholder="penghuni@email.com"
              className="nm-input h-11 w-full rounded-xl px-3.5 text-sm text-ink outline-none"
            />
            <p className="mt-1 text-xs text-ink-soft">
              Penghuni harus sudah punya akun KostKu dengan role Penghuni.
            </p>
          </div>

          {/* Pilih kamar */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink">
              Kamar
            </label>
            {roomsLoading ? (
              <div className="flex h-11 items-center gap-2 text-sm text-ink-soft">
                <Loader2 className="h-4 w-4 animate-spin" />
                Memuat daftar kamar...
              </div>
            ) : availableRooms.length === 0 ? (
              <p className="text-sm text-ink-soft">
                Tidak ada kamar kosong saat ini.
              </p>
            ) : (
              <select
                required
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="nm-input h-11 w-full rounded-xl px-3.5 text-sm text-ink outline-none"
              >
                <option value="">-- Pilih Kamar --</option>
                {availableRooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.property?.name
                      ? `${r.property.name} — Kamar ${r.room_number}`
                      : `Kamar ${r.room_number}`}
                    {" · "}
                    {formatRupiah(r.price)}/bln
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Tanggal masuk */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink">
              Tanggal Masuk
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="nm-input h-11 w-full rounded-xl px-3.5 text-sm text-ink outline-none"
            />
          </div>

          {/* Tanggal keluar (opsional) */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink">
              Tanggal Keluar{" "}
              <span className="font-normal text-ink-soft">(opsional)</span>
            </label>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="nm-input h-11 w-full rounded-xl px-3.5 text-sm text-ink outline-none"
            />
          </div>

          {/* Deposit (opsional) */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink">
              Deposit{" "}
              <span className="font-normal text-ink-soft">(opsional)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-soft">
                Rp
              </span>
              <input
                type="number"
                min={0}
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                placeholder="0"
                className="nm-input h-11 w-full rounded-xl pl-10 pr-3.5 text-sm text-ink outline-none"
              />
            </div>
          </div>

          {/* Pesan error dari API */}
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Tombol aksi */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
            >
              Batal
            </Button>
            <button
              type="submit"
              disabled={createTenancy.isPending || availableRooms.length === 0}
              className="kk-btn kk-btn-primary flex flex-1 items-center justify-center gap-2 rounded-xl text-sm font-bold disabled:opacity-60"
            >
              {createTenancy.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Tambah Penghuni
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
