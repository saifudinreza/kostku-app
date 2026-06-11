"use client"; // mengatur buka/tutup sidebar -> butuh state -> komponen browser

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import type { NavItem } from "./nav-config";
import type { User } from "@/types";

// =============================================================================
// AppShell — "rangka" tampilan aplikasi setelah login.
// ANALOGI: seperti bingkai foto. Sidebar (kiri) + TopBar (atas) selalu tetap,
// sedangkan `children` (isi tiap halaman) diganti-ganti di tengah. Jadi semua
// halaman owner/tenant tampil konsisten tanpa menyalin tata letak berulang.
// =============================================================================
export function AppShell({
  items, // daftar menu sidebar (ownerNav atau tenantNav)
  roleLabel, // label peran di bawah logo ("Owner"/"Penghuni")
  user, // data pengguna untuk ditampilkan di TopBar
  children, // isi halaman yang sedang dibuka
}: {
  items: NavItem[];
  roleLabel: string;
  user: User;
  children: React.ReactNode;
}) {
  // Saklar buka/tutup sidebar di layar HP (di desktop sidebar selalu terlihat).
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-page">
      <Sidebar
        items={items}
        roleLabel={roleLabel}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* `lg:pl-64` = beri jarak kiri selebar sidebar (256px) di layar besar,
          supaya isi halaman tidak tertimpa sidebar. */}
      <div className="lg:pl-64">
        {/* Tombol menu di TopBar memicu `setSidebarOpen(true)` -> sidebar muncul. */}
        <TopBar user={user} onMenuClick={() => setSidebarOpen(true)} />
        <main className="mx-auto max-w-7xl space-y-6 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
