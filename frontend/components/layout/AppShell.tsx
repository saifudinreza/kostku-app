"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import type { NavItem } from "./nav-config";
import type { User } from "@/types";

export function AppShell({
  items,
  roleLabel,
  user,
  children,
}: {
  items: NavItem[];
  roleLabel: string;
  user: User;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-page">
      <Sidebar
        items={items}
        roleLabel={roleLabel}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-64">
        <TopBar user={user} onMenuClick={() => setSidebarOpen(true)} />
        <main className="mx-auto max-w-7xl space-y-6 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
