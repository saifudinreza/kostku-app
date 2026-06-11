"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import type { UserRole } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("owner");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Frontend-only: simulasi login. Produksi -> POST /api/login (Sanctum).
    // Set cookie demo agar middleware mengizinkan akses dashboard.
    document.cookie = `auth_token=demo-token; path=/; max-age=86400`;
    document.cookie = `user_role=${role}; path=/; max-age=86400`;
    setTimeout(() => {
      router.push(role === "owner" ? "/owner/dashboard" : "/tenant/dashboard");
    }, 600);
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">
        Selamat datang kembali
      </h1>
      <p className="mt-1.5 text-sm text-ink-soft">
        Masuk untuk mengelola kost-mu.
      </p>

      {/* Role toggle */}
      <div className="nm-input mt-6 grid grid-cols-2 gap-1 rounded-xl p-1.5">
        {(["owner", "tenant"] as UserRole[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={
              "h-9 rounded-lg text-sm font-bold capitalize transition-all " +
              (role === r
                ? "text-white [background:linear-gradient(135deg,#8b7bff,#6c5ce7)] [box-shadow:3px_3px_8px_#c8c6ea,-3px_-3px_8px_#ffffff]"
                : "text-ink-soft hover:text-ink")
            }
          >
            {r === "owner" ? "Pemilik" : "Penghuni"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink">Email</label>
          <input
            type="email"
            required
            defaultValue={role === "owner" ? "hasan@kostku.id" : "budi@kostku.id"}
            className="nm-input h-11 w-full rounded-xl px-3.5 text-sm text-ink outline-none"
            placeholder="email@contoh.com"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-bold text-ink">Password</label>
            <a href="#" className="text-xs font-bold text-brand hover:underline">
              Lupa password?
            </a>
          </div>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              required
              defaultValue="password"
              className="nm-input h-11 w-full rounded-xl px-3.5 pr-10 text-sm text-ink outline-none"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
              aria-label="Tampilkan password"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="kk-btn kk-btn-primary flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Masuk sebagai {role === "owner" ? "Pemilik" : "Penghuni"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Belum punya akun?{" "}
        <Link href="/register" className="font-bold text-brand hover:underline">
          Daftar gratis
        </Link>
      </p>
    </div>
  );
}
