"use client";

import { AppShell } from "@/components/layout/AppShell";
import { tenantNav } from "@/components/layout/nav-config";
import { currentTenant } from "@/lib/mock";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell items={tenantNav} roleLabel="Penghuni" user={currentTenant}>
      {children}
    </AppShell>
  );
}
