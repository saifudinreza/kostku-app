"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCreateProperty } from "@/lib/hooks/useProperties";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AddPropertyModal({ open, onClose }: Props) {
  const createProperty = useCreateProperty();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleClose() {
    setName("");
    setAddress("");
    setCity("");
    setDescription("");
    setError(null);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await createProperty.mutateAsync({ name, address, city, description: description || undefined });
      handleClose();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Gagal menambah properti. Coba lagi.";
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
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="text-base font-bold text-ink">Tambah Properti</h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-1 text-ink-soft hover:bg-line hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink">
              Nama Properti
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Kost Melati, Kost Pak Budi, ..."
              className="nm-input h-11 w-full rounded-xl px-3.5 text-sm text-ink outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink">
              Alamat
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Jl. Mawar No. 10"
              className="nm-input h-11 w-full rounded-xl px-3.5 text-sm text-ink outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink">
              Kota
            </label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Bandung, Jakarta, ..."
              className="nm-input h-11 w-full rounded-xl px-3.5 text-sm text-ink outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink">
              Deskripsi{" "}
              <span className="font-normal text-ink-soft">(opsional)</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kost strategis dekat kampus, fasilitas WiFi, ..."
              className="nm-input w-full rounded-xl px-3.5 py-3 text-sm text-ink outline-none resize-none"
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
              disabled={createProperty.isPending}
              className="kk-btn kk-btn-primary flex flex-1 items-center justify-center gap-2 rounded-xl text-sm font-bold disabled:opacity-60"
            >
              {createProperty.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Simpan Properti
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
