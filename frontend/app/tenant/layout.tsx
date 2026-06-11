"use client";

import { AppShell } from "@/components/layout/AppShell";
import { tenantNav } from "@/components/layout/nav-config";
import { useAuth } from "@/lib/auth-context";

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <AppShell items={tenantNav} roleLabel="Penghuni" user={user}>
      {children}
    </AppShell>
  );
}
