"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { cn, formatTanggal } from "@/lib/utils";
import type { Message } from "@/types";

// Chat internal per kamar (PRD §4). Frontend-only: pesan baru disimpan di state.
// Produksi: Laravel Broadcasting + Pusher untuk realtime.
export function ChatThread({
  initialMessages,
  currentUserId,
  placeholder = "Tulis pesan...",
  className,
}: {
  initialMessages: Message[];
  currentUserId: number;
  placeholder?: string;
  className?: string;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  function send(e: React.FormEvent) {
    e.preventDefault();
    const body = input.trim();
    if (!body) return;
    const last = initialMessages[0];
    setMessages((m) => [
      ...m,
      {
        id: Date.now(),
        sender_id: currentUserId,
        receiver_id:
          last?.sender_id === currentUserId
            ? last.receiver_id
            : last?.sender_id ?? 0,
        tenancy_id: last?.tenancy_id ?? 0,
        body,
        is_read: false,
        created_at: new Date().toISOString(),
      },
    ]);
    setInput("");
  }

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m) => {
          const mine = m.sender_id === currentUserId;
          return (
            <div
              key={m.id}
              className={cn("flex flex-col", mine ? "items-end" : "items-start")}
            >
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
                  mine
                    ? "rounded-br-sm text-white [background:linear-gradient(135deg,#8b7bff,#6c5ce7)] [box-shadow:4px_4px_10px_#cdcfe0]"
                    : "rounded-bl-sm text-ink [box-shadow:inset_3px_3px_7px_#d0d2e2,inset_-3px_-3px_7px_#ffffff]"
                )}
              >
                {m.body}
              </div>
              <span className="mt-1 px-1 text-[11px] text-ink-soft">
                {formatTanggal(m.created_at)}
              </span>
            </div>
          );
        })}
      </div>

      <form onSubmit={send} className="flex gap-2 border-t border-line/70 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="nm-input h-11 flex-1 rounded-xl px-3.5 text-sm text-ink outline-none placeholder:text-ink-soft"
        />
        <button
          type="submit"
          className="kk-btn kk-btn-primary flex h-11 w-11 items-center justify-center rounded-xl text-white"
          aria-label="Kirim"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
