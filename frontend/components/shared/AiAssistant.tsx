"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useInvoiceChat, useFinancialInsight } from "@/lib/hooks/useAi";

interface ChatTurn {
  role: "user" | "ai";
  text: string;
}

// Sapaan awal berbeda untuk owner vs tenant
const GREETING: Record<string, string> = {
  owner:  "Halo! Aku asisten keuangan KostKu. Tanya soal performa properti, pendapatan, atau tips meningkatkan okupansi.",
  tenant: "Halo! Aku asisten tagihan KostKu. Tanya apa saja soal tagihan atau pembayaranmu ya.",
};

export function AiAssistant() {
  const { user } = useAuth();
  const role = user?.role ?? "tenant";

  const invoiceChat     = useInvoiceChat();
  const financialInsight = useFinancialInsight();

  const isPending = invoiceChat.isPending || financialInsight.isPending;

  const [turns, setTurns] = useState<ChatTurn[]>([
    { role: "ai", text: GREETING[role] ?? GREETING.tenant },
  ]);
  const [input, setInput] = useState("");

  // Auto-scroll ke pesan terbaru
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns, isPending]);

  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = input.trim();
    if (!q || isPending) return;

    setTurns((t) => [...t, { role: "user", text: q }]);
    setInput("");

    try {
      let answer: string;

      if (role === "owner") {
        const res = await financialInsight.mutateAsync(q);
        answer = res.data.answer;
      } else {
        const res = await invoiceChat.mutateAsync(q);
        answer = res.data.answer;
      }

      setTurns((t) => [...t, { role: "ai", text: answer }]);
    } catch {
      setTurns((t) => [
        ...t,
        {
          role: "ai",
          text: "Maaf, terjadi kesalahan saat menghubungi AI. Coba lagi sebentar.",
        },
      ]);
    }
  }

  return (
    <div className="flex h-full flex-col rounded-card bg-card shadow-card">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-line/70 px-5 py-4">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-xl text-white nm-raised-sm"
          style={{ background: "linear-gradient(135deg,#8b7bff,#6c5ce7)" }}
        >
          <Sparkles className="h-4 w-4" />
        </span>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-ink">Asisten AI</h3>
          <p className="text-[10px] text-ink-soft">
            Groq · OpenRouter fallback
          </p>
        </div>
        {/* Indikator online */}
        <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-600">
          <Zap className="h-2.5 w-2.5" />
          Online
        </span>
      </div>

      {/* Area chat */}
      <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto p-4">
        {turns.map((t, i) => (
          <div
            key={i}
            className={cn("flex gap-2", t.role === "user" && "flex-row-reverse")}
          >
            {t.role === "ai" && (
              <span className="nm-chip flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-brand">
                <Bot className="h-4 w-4" />
              </span>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap",
                t.role === "user"
                  ? "rounded-br-sm text-white [background:linear-gradient(135deg,#8b7bff,#6c5ce7)] [box-shadow:4px_4px_10px_#cdcfe0]"
                  : "rounded-bl-sm text-ink [box-shadow:inset_3px_3px_7px_#d0d2e2,inset_-3px_-3px_7px_#ffffff]"
              )}
            >
              {t.text}
            </div>
          </div>
        ))}

        {/* Animasi "sedang mengetik" */}
        {isPending && (
          <div className="flex gap-2">
            <span className="nm-chip flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-brand">
              <Bot className="h-4 w-4" />
            </span>
            <div className="rounded-2xl rounded-bl-sm px-3 py-2.5 [box-shadow:inset_3px_3px_7px_#d0d2e2,inset_-3px_-3px_7px_#ffffff]">
              <span className="flex gap-1">
                <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-soft [animation-delay:-0.3s]" />
                <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-soft [animation-delay:-0.15s]" />
                <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-soft" />
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={send} className="flex gap-2 border-t border-line/70 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            role === "owner"
              ? "Bagaimana performa keuangan bulan ini?"
              : "Kenapa tagihan bulan ini lebih mahal?"
          }
          className="nm-input h-11 flex-1 rounded-xl px-3.5 text-sm text-ink outline-none placeholder:text-ink-soft"
        />
        <button
          type="submit"
          disabled={isPending || !input.trim()}
          className="kk-btn kk-btn-primary flex h-11 w-11 items-center justify-center rounded-xl text-white disabled:opacity-50"
          aria-label="Kirim"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
