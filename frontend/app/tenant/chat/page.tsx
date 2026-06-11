import { PageHeader } from "@/components/shared/PageHeader";
import { ChatThread } from "@/components/shared/ChatThread";
import { Card } from "@/components/ui/Card";
import {
  currentOwner,
  currentTenant,
  messages,
  rooms,
  tenancies,
} from "@/lib/mock";

export default function TenantChatPage() {
  const tenancy = tenancies.find((t) => t.tenant_id === currentTenant.id);
  const room = rooms.find((r) => r.id === tenancy?.room_id);
  const thread = messages.filter((m) => m.tenancy_id === tenancy?.id);

  return (
    <>
      <PageHeader
        title="Chat"
        description="Hubungi owner — lapor kerusakan atau tanya apa saja."
      />

      <Card className="flex h-[calc(100vh-13rem)] flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-line px-5 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-light text-xs font-semibold text-brand">
            {currentOwner.name
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")}
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">
              {currentOwner.name}
            </p>
            <p className="text-xs text-ink-soft">
              Owner · Kamar {room?.room_number}
            </p>
          </div>
        </div>
        <ChatThread
          initialMessages={thread}
          currentUserId={currentTenant.id}
          placeholder="Tulis pesan ke owner..."
        />
      </Card>
    </>
  );
}
