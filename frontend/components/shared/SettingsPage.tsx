"use client";

import { useState } from "react";
import { Loader2, Save, ShieldCheck, User } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";

type Tab = "profile" | "password";

export function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState<Tab>("profile");

  // Profile form
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);
    try {
      const { data } = await api.put("/auth/profile", { name, phone: phone || null });
      updateUser(data);
      setProfileMsg({ ok: true, text: "Profil berhasil diperbarui." });
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Gagal memperbarui profil.";
      setProfileMsg({ ok: false, text: msg });
    } finally {
      setProfileLoading(false);
    }
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPassMsg({ ok: false, text: "Konfirmasi password tidak cocok." });
      return;
    }
    setPassLoading(true);
    setPassMsg(null);
    try {
      await api.put("/auth/password", {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });
      setPassMsg({ ok: true, text: "Password berhasil diubah." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Gagal mengubah password.";
      setPassMsg({ ok: false, text: msg });
    } finally {
      setPassLoading(false);
    }
  }

  return (
    <>
      <PageHeader title="Pengaturan" description="Kelola profil dan keamanan akun." />

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl p-1 w-fit [box-shadow:inset_3px_3px_8px_#d0d2e2,inset_-3px_-3px_8px_#ffffff]">
        {([
          { key: "profile", label: "Profil", icon: User },
          { key: "password", label: "Keamanan", icon: ShieldCheck },
        ] as { key: Tab; label: string; icon: typeof User }[]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all ${
              tab === key
                ? "bg-brand text-white shadow-md"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {tab === "profile" && (
        <Card className="max-w-lg">
          <CardHeader title="Informasi Profil" />
          <form onSubmit={handleProfileSave} className="space-y-5 p-5">
            {/* Avatar placeholder */}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand text-2xl font-extrabold text-white [box-shadow:6px_6px_14px_#c0bee2,-6px_-6px_14px_#ffffff]">
                {(name || user?.name || "?")[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-ink">{user?.name}</p>
                <p className="text-sm text-ink-soft">{user?.email}</p>
                <span className="mt-1 inline-block rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold capitalize text-brand">
                  {user?.role}
                </span>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="nm-input w-full rounded-xl px-4 py-3 text-sm text-ink outline-none"
                placeholder="Nama lengkap"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">
                Nomor HP <span className="font-normal text-ink-soft">(opsional)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="nm-input w-full rounded-xl px-4 py-3 text-sm text-ink outline-none"
                placeholder="08xxxxxxxxxx"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Email</label>
              <input
                type="email"
                value={user?.email ?? ""}
                disabled
                className="w-full cursor-not-allowed rounded-xl px-4 py-3 text-sm text-ink-soft opacity-60 [box-shadow:inset_3px_3px_7px_#d0d2e2,inset_-3px_-3px_7px_#ffffff]"
              />
              <p className="mt-1 text-xs text-ink-soft">Email tidak dapat diubah.</p>
            </div>

            {profileMsg && (
              <p className={`rounded-xl px-4 py-3 text-sm font-medium ${
                profileMsg.ok
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-600"
              }`}>
                {profileMsg.ok ? "✓ " : "✗ "}{profileMsg.text}
              </p>
            )}

            <Button type="submit" disabled={profileLoading} className="w-full">
              {profileLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Simpan Perubahan
            </Button>
          </form>
        </Card>
      )}

      {/* Password tab */}
      {tab === "password" && (
        <Card className="max-w-lg">
          <CardHeader title="Ganti Password" />
          <form onSubmit={handlePasswordSave} className="space-y-5 p-5">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Password Lama</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="nm-input w-full rounded-xl px-4 py-3 text-sm text-ink outline-none"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Password Baru</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="nm-input w-full rounded-xl px-4 py-3 text-sm text-ink outline-none"
                placeholder="Minimal 8 karakter"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Konfirmasi Password Baru</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="nm-input w-full rounded-xl px-4 py-3 text-sm text-ink outline-none"
                placeholder="Ulangi password baru"
              />
            </div>

            {passMsg && (
              <p className={`rounded-xl px-4 py-3 text-sm font-medium ${
                passMsg.ok
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-600"
              }`}>
                {passMsg.ok ? "✓ " : "✗ "}{passMsg.text}
              </p>
            )}

            <Button type="submit" disabled={passLoading} className="w-full">
              {passLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              Ubah Password
            </Button>
          </form>
        </Card>
      )}
    </>
  );
}
