"use client";

import { Bell, Menu, Search } from "lucide-react";
import type { User } from "@/types";

export function TopBar({
  user,
  onMenuClick,
}: {
  user: User;
  onMenuClick: () => void;
}) {
  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 px-4 backdrop-blur lg:px-6" style={{ background: "rgba(233,234,242,0.78)" }}>
      <button
        onClick={onMenuClick}
        className="nm-chip flex h-10 w-10 items-center justify-center rounded-xl text-ink-soft hover:text-ink lg:hidden"
        aria-label="Buka menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
        <input
          type="search"
          placeholder="Cari kamar, penghuni, tagihan…"
          className="nm-input h-11 w-full rounded-xl pl-10 pr-3 text-sm text-ink outline-none placeholder:text-ink-soft"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          className="nm-chip relative flex h-10 w-10 items-center justify-center rounded-xl text-ink-soft transition-colors hover:text-brand"
          aria-label="Notifikasi"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-danger ring-2 ring-[#e9eaf2]" />
        </button>

        <div className="flex items-center gap-3 pl-1">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-bold leading-tight text-ink">
              {user.name}
            </p>
            <p className="text-xs capitalize text-ink-soft">{user.role}</p>
          </div>
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white nm-raised-sm"
            style={{ background: "linear-gradient(135deg,#8b7bff,#6c5ce7)" }}
          >
            {initials}
          </span>
        </div>
      </div>
    </header>
  );
}
