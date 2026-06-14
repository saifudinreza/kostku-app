"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PAYMENT_GROUPS,
  PAYMENT_METHODS,
  type PaymentMethod,
} from "@/lib/payments";

interface PaymentMethodsProps {
  /** Dipanggil saat metode dipilih — sambungkan ke pembuatan transaksi Midtrans. */
  onSelect?: (method: PaymentMethod) => void;
}

/**
 * Grid metode pembayaran dengan logo per channel. Murni UI/state lokal;
 * integrasi Midtrans Snap dilakukan di handler `onSelect` / tombol Bayar.
 */
export function PaymentMethods({ onSelect }: PaymentMethodsProps) {
  const [selected, setSelected] = useState<string | null>(null);

  function pick(m: PaymentMethod) {
    setSelected(m.id);
    onSelect?.(m);
  }

  return (
    <div className="space-y-5">
      {PAYMENT_GROUPS.map((group) => {
        const methods = PAYMENT_METHODS.filter((m) => m.group === group.id);
        if (methods.length === 0) return null;
        return (
          <div key={group.id}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">
              {group.label}
            </p>
            {/* grid-cols-1 di <320px agar tidak terlalu sempit, 2 kolom di atasnya */}
            <div className="grid grid-cols-1 gap-2.5 min-[320px]:grid-cols-2">
              {methods.map((m) => {
                const active = selected === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => pick(m)}
                    aria-pressed={active}
                    className={cn(
                      "relative flex h-14 w-full items-center justify-center rounded-xl border bg-white px-3 transition-all",
                      active
                        ? "border-brand ring-2 ring-brand/30"
                        : "border-line hover:border-brand/50"
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.logo}
                      alt={m.label}
                      className="h-7 w-auto max-w-full object-contain"
                    />
                    {active && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
