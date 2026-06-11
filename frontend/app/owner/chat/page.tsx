"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ChatThread } from "@/components/shared/ChatThread";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/lib/auth-context";
import { useTenancies } from "@/lib/hooks/useTenancies";
import { useMessages } from "@/lib/hooks/useMessages";
import { cn } from "@/lib/utils";

export default function OwnerChatPage() {
  const { user } = useAuth();
  const { data: tenancies = [], isLoading: loadingTenancies } = useTenancies();
  const [activeTenancyId, setActiveTenancyId] = useState<number | null>(null);

  const effectiveTenancyId = activeTenancyId ?? tenancies[0]?.id ?? null;
  const { data: messages = [], isLoading: loadingMessages } = useMessages(effectiveTenancyId ?? undefined);

  const active = tenancies.find((t) => t.id === effectiveTenancyId);

  if (loadingTenancies) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Chat" description="Pesan internal dengan penghuni." />

      <Card className="grid h-[calc(100vh-13rem)] grid-cols-1 overflow-hidden md:grid-cols-[18rem_1fr]">
        <div className="hidden border-r border-line md:block">
          <div className="border-b border-line px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Penghuni</p>
          </div>
          <div className="divide-y divide-line">
            {tenancies.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTenancyId(t.id)}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-black/[0.03]",
                  t.id === effectiveTenancyId && "bg-brand-light/60"
                )}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-light text-xs font-semibold text-brand">
                  {t.tenant?.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{t.tenant?.name}</p>
                  <p className="truncate text-xs text-ink-soft">Kamar {t.room?.room_number}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          {active && (
            <div className="flex items-center gap-3 border-b border-line px-5 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-light text-xs font-semibold text-brand">
                {active.tenant?.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{active.tenant?.name}</p>
                <p className="text-xs text-ink-soft">Kamar {active.room?.room_number}</p>
              </div>
            </div>
          )}
          {effectiveTenancyId && user && (
            <ChatThread
              key={effectiveTenancyId}
              initialMessages={messages}
              currentUserId={user.id}
              tenancyId={effectiveTenancyId}
              receiverId={active?.tenant?.id ?? 0}
              placeholder={`Pesan ke ${active?.tenant?.name ?? "penghuni"}...`}
            />
          )}
        </div>
      </Card>
    </>
  );
}
