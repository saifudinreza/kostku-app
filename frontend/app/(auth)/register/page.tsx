"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import type { UserRole } from "@/types";

export default function RegisterPage() {
  const { register } = useAuth();
  const [role, setRole] = useState<UserRole>("owner");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setError("Password tidak cocok.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await register(name, email, password, passwordConfirmation, role);
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } })?.response?.data;
      const msg = data?.message ?? Object.values(data?.errors ?? {}).flat()[0] ?? "Pendaftaran gagal.";
      setError(msg);
    } finally {
      setLoading(false);
    }
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="nm-input h-11 w-full rounded-xl px-3.5 text-sm text-ink outline-none"
            placeholder="Nama kamu"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="nm-input h-11 w-full rounded-xl px-3.5 text-sm text-ink outline-none"
            placeholder="email@contoh.com"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="nm-input h-11 w-full rounded-xl px-3.5 text-sm text-ink outline-none"
            placeholder="Minimal 8 karakter"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink">
            Ulangi password
          </label>
          <input
            type="password"
            required
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="nm-input h-11 w-full rounded-xl px-3.5 text-sm text-ink outline-none"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="kk-btn kk-btn-primary flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Daftar sebagai {role === "owner" ? "Pemilik" : "Penghuni"}
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
