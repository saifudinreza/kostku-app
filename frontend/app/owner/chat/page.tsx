"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ChatThread } from "@/components/shared/ChatThread";
import { Card } from "@/components/ui/Card";
import { currentOwner, messages, rooms, tenancies } from "@/lib/mock";
import { cn } from "@/lib/utils";

export default function OwnerChatPage() {
  const [activeTenancyId, setActiveTenancyId] = useState(tenancies[0]?.id ?? 0);
  const active = tenancies.find((t) => t.id === activeTenancyId);
  const activeRoom = rooms.find((r) => r.id === active?.room_id);
  const thread = messages.filter((m) => m.tenancy_id === activeTenancyId);

  return (
    <>
      <PageHeader title="Chat" description="Pesan internal dengan penghuni." />

      <Card className="grid h-[calc(100vh-13rem)] grid-cols-1 overflow-hidden md:grid-cols-[18rem_1fr]">
        {/* Daftar percakapan */}
        <div className="hidden border-r border-line md:block">
          <div className="border-b border-line px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Penghuni
            </p>
          </div>
          <div className="divide-y divide-line">
            {tenancies.map((t) => {
              const room = rooms.find((r) => r.id === t.room_id);
              const lastMsg = [...messages]
                .reverse()
                .find((m) => m.tenancy_id === t.id);
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTenancyId(t.id)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-black/[0.03]",
                    t.id === activeTenancyId && "bg-brand-light/60"
                  )}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-light text-xs font-semibold text-brand">
                    {t.tenant?.name
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">
                      {t.tenant?.name}
                    </p>
                    <p className="truncate text-xs text-ink-soft">
                      {lastMsg?.body ?? `Kamar ${room?.room_number}`}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Thread aktif */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 border-b border-line px-5 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-light text-xs font-semibold text-brand">
              {active?.tenant?.name
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")}
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">
                {active?.tenant?.name}
              </p>
              <p className="text-xs text-ink-soft">
                Kamar {activeRoom?.room_number}
              </p>
            </div>
          </div>
          <ChatThread
            key={activeTenancyId}
            initialMessages={thread}
            currentUserId={currentOwner.id}
            placeholder={`Pesan ke ${active?.tenant?.name ?? "penghuni"}...`}
          />
        </div>
      </Card>
    </>
  );
}
