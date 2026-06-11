"use client";

import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ChatThread } from "@/components/shared/ChatThread";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/lib/auth-context";
import { useTenancies } from "@/lib/hooks/useTenancies";
import { useMessages } from "@/lib/hooks/useMessages";

export default function TenantChatPage() {
  const { user } = useAuth();
  const { data: tenancies = [], isLoading: loadingTenancies } = useTenancies();

  const myTenancy = tenancies.find((t) => t.status === "active");
  const { data: messages = [], isLoading: loadingMessages } = useMessages(myTenancy?.id);

  if (loadingTenancies || loadingMessages) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
      </div>
    );
  }

  const ownerName = myTenancy?.room?.property?.name ? `Owner · ${myTenancy.room.property.name}` : "Owner";
  const ownerInitials = "OK";

  return (
    <>
      <PageHeader title="Chat" description="Hubungi owner — lapor kerusakan atau tanya apa saja." />

      <Card className="flex h-[calc(100vh-13rem)] flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-line px-5 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-light text-xs font-semibold text-brand">
            {ownerInitials}
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">Owner</p>
            <p className="text-xs text-ink-soft">{ownerName}</p>
          </div>
        </div>

        {myTenancy && user ? (
          <ChatThread
            initialMessages={messages}
            currentUserId={user.id}
            tenancyId={myTenancy.id}
            receiverId={myTenancy.room?.property?.owner_id ?? 0}
            placeholder="Tulis pesan ke owner..."
          />
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-ink-soft">Belum ada sewa aktif.</p>
          </div>
        )}
      </Card>
    </>
  );
}
