"use client";

import { AppShell } from "@/components/layout/AppShell";
import { ownerNav } from "@/components/layout/nav-config";
import { useAuth } from "@/lib/auth-context";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <AppShell items={ownerNav} roleLabel="Owner" user={user}>
      {children}
    </AppShell>
  );
}
