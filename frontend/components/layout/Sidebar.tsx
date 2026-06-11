"use client"; // memakai usePathname & onClick -> komponen browser

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LogOut, X } from "lucide-react";
import type { NavItem } from "./nav-config";
import { cn } from "@/lib/utils";

// =============================================================================
// Sidebar — menu samping kiri. ANALOGI: seperti daftar menu di sisi restoran.
// Di desktop selalu tampil; di HP muncul sebagai "laci" (drawer) yang bisa
// dibuka/ditutup. Menu yang sedang dibuka disorot ungu otomatis.
// =============================================================================
interface SidebarProps {
  items: NavItem[]; // daftar menu (dari nav-config)
  /** Sub-label di bawah logo, mis. "Owner" / "Penghuni" */
  roleLabel: string;
  /** Status terbuka di mode HP (drawer) */
  open: boolean;
  onClose: () => void; // fungsi untuk menutup drawer
}

export function Sidebar({ items, roleLabel, open, onClose }: SidebarProps) {
  // usePathname = alamat URL halaman saat ini (mis. "/owner/invoices").
  // Dipakai untuk menentukan menu mana yang sedang aktif (disorot).
  const pathname = usePathname();

  return (
    <>
      {/* Lapisan gelap di belakang drawer saat dibuka di HP. Menekannya =
          menutup sidebar (`onClose`). `lg:hidden` = hanya muncul di layar kecil. */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-text shadow-[12px_0_34px_-16px_rgba(150,153,176,0.65)] transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white nm-raised-sm"
              style={{ background: "linear-gradient(135deg,#8b7bff,#6c5ce7)" }}
            >
              <Building2 className="h-[18px] w-[18px]" />
            </span>
            <div className="leading-none">
              <p className="font-sans text-base font-extrabold text-sidebar-active">
                KostKu
              </p>
              <p className="mt-0.5 text-[11px] font-semibold text-sidebar-text">
                {roleLabel}
              </p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="text-sidebar-text hover:text-ink lg:hidden"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        {/* Daftar menu: ubah tiap item jadi sebuah link (Link). */}
        <nav className="scrollbar-thin flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
          {items.map((item) => {
            // Menu dianggap "aktif" bila URL sekarang sama persis ATAU berada di
            // dalam menu itu (mis. /owner/invoices/1001 tetap menyorot "Tagihan").
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon; // huruf besar agar bisa ditulis <Icon />.
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
                  active
                    ? "text-white [background:linear-gradient(135deg,#8b7bff,#6c5ce7)] [box-shadow:5px_5px_12px_#c4c2e4,-5px_-5px_12px_#ffffff]"
                    : "text-sidebar-text hover:text-sidebar-active hover:[box-shadow:inset_3px_3px_7px_#d3d5e4,inset_-3px_-3px_7px_#ffffff]"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3">
          <Link
            href="/login"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-sidebar-text transition-all hover:text-danger hover:[box-shadow:inset_3px_3px_7px_#d3d5e4,inset_-3px_-3px_7px_#ffffff]"
          >
            <LogOut className="h-5 w-5" />
            Keluar
          </Link>
        </div>
      </aside>
    </>
  );
}
