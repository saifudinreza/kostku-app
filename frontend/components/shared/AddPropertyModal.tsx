"use client";

import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCreateProperty, useUpdateProperty } from "@/lib/hooks/useProperties";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import type { Property } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  /** Pass existing property to switch to edit mode */
  property?: Property;
}

export function AddPropertyModal({ open, onClose, onSuccess, property }: Props) {
  const createProperty = useCreateProperty();
  const updateProperty = useUpdateProperty(property?.id ?? 0);
  const trapRef = useFocusTrap(open, onClose);

  const isEditing = !!property;

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Pre-fill form when editing
  useEffect(() => {
    if (property) {
      setName(property.name ?? "");
      setAddress(property.address ?? "");
      setCity(property.city ?? "");
      setDescription(property.description ?? "");
    } else {
      setName("");
      setAddress("");
      setCity("");
      setDescription("");
    }
    setError(null);
  }, [property, open]);

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
    const payload = { name, address, city, description: description || undefined };
    try {
      if (isEditing) {
        await updateProperty.mutateAsync(payload);
      } else {
        await createProperty.mutateAsync(payload);
      }
      handleClose();
      onSuccess?.();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? (isEditing ? "Gagal mengubah properti." : "Gagal menambah properti.");
      setError(msg);
    }
  }

  const isPending = createProperty.isPending || updateProperty.isPending;

  if (!open) return null;

  return (
    <div
      ref={trapRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="prop-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="w-full max-w-md rounded-2xl bg-page shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 id="prop-modal-title" className="text-base font-bold text-ink">
            {isEditing ? "Edit Properti" : "Tambah Properti"}
          </h2>
          <button
            onClick={handleClose}
            aria-label="Tutup modal"
            className="rounded-lg p-1 text-ink-soft hover:bg-line hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label htmlFor="prop-name" className="mb-1.5 block text-sm font-bold text-ink">
              Nama Properti
            </label>
            <input
              id="prop-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Kost Melati, Kost Pak Budi, ..."
              className="nm-input h-11 w-full rounded-xl px-3.5 text-sm text-ink outline-none"
            />
          </div>

          <div>
            <label htmlFor="prop-address" className="mb-1.5 block text-sm font-bold text-ink">
              Alamat
            </label>
            <input
              id="prop-address"
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Jl. Mawar No. 10"
              className="nm-input h-11 w-full rounded-xl px-3.5 text-sm text-ink outline-none"
            />
          </div>

          <div>
            <label htmlFor="prop-city" className="mb-1.5 block text-sm font-bold text-ink">
              Kota
            </label>
            <input
              id="prop-city"
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Bandung, Jakarta, ..."
              className="nm-input h-11 w-full rounded-xl px-3.5 text-sm text-ink outline-none"
            />
          </div>

          <div>
            <label htmlFor="prop-desc" className="mb-1.5 block text-sm font-bold text-ink">
              Deskripsi{" "}
              <span className="font-normal text-ink-soft">(opsional)</span>
            </label>
            <textarea
              id="prop-desc"
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
              disabled={isPending}
              className="kk-btn kk-btn-primary flex flex-1 items-center justify-center gap-2 rounded-xl text-sm font-bold disabled:opacity-60"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? "Simpan Perubahan" : "Simpan Properti"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
