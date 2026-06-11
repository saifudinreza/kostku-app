"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { UserRole } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("owner");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Frontend-only: simulasi register. Produksi -> POST /api/register (Sanctum).
    document.cookie = `auth_token=demo-token; path=/; max-age=86400`;
    document.cookie = `user_role=${role}; path=/; max-age=86400`;
    setTimeout(() => {
      router.push(role === "owner" ? "/owner/dashboard" : "/tenant/dashboard");
    }, 600);
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">
        Buat akun KostKu
      </h1>
      <p className="mt-1.5 text-sm text-ink-soft">
        Gratis untuk memulai, tanpa kartu kredit.
      </p>

      <div className="nm-input mt-6 grid grid-cols-2 gap-1 rounded-xl p-1.5">
        {(["owner", "tenant"] as UserRole[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={
              "h-9 rounded-lg text-sm font-bold transition-all " +
              (role === r
                ? "text-white [background:linear-gradient(135deg,#8b7bff,#6c5ce7)] [box-shadow:3px_3px_8px_#c8c6ea,-3px_-3px_8px_#ffffff]"
                : "text-ink-soft hover:text-ink")
            }
          >
            {r === "owner" ? "Saya Pemilik" : "Saya Penghuni"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink">
            Nama lengkap
          </label>
          <input
            required
            className="nm-input h-11 w-full rounded-xl px-3.5 text-sm text-ink outline-none"
            placeholder="Nama kamu"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink">Email</label>
          <input
            type="email"
            required
            className="nm-input h-11 w-full rounded-xl px-3.5 text-sm text-ink outline-none"
            placeholder="email@contoh.com"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink">
            Password
          </label>
          <input
            type="password"
            required
            className="nm-input h-11 w-full rounded-xl px-3.5 text-sm text-ink outline-none"
            placeholder="Minimal 8 karakter"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="kk-btn kk-btn-primary flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Daftar
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-bold text-brand hover:underline">
          Masuk
        </Link>
      </p>
    </div>
  );
}
