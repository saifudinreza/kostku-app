"use client";

import { AppShell } from "@/components/layout/AppShell";
import { ownerNav } from "@/components/layout/nav-config";
import { currentOwner } from "@/lib/mock";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell items={ownerNav} roleLabel="Owner" user={currentOwner}>
      {children}
    </AppShell>
  );
}
