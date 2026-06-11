"use client";

import { useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatTurn {
  role: "user" | "ai";
  text: string;
}

// Smart Invoice Assistant (PRD §5.1). Frontend-only: jawaban di-mock.
// Produksi: POST /api/ai/invoice-chat -> Groq LLaMA 3.3 70B.
const MOCK_REPLIES: Record<string, string> = {
  default:
    "Tagihan Juni 2025 kamu Rp 950.000, jatuh tempo 20 Juni 2025 dan belum dibayar. Terdiri dari Sewa Kamar Rp 800.000 + Listrik Rp 150.000.",
};

export function AiAssistant() {
  const [turns, setTurns] = useState<ChatTurn[]>([
    {
      role: "ai",
      text: "Halo! Aku asisten tagihan KostKu. Tanya apa saja soal tagihanmu ya.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  function send(e: React.FormEvent) {
    e.preventDefault();
    const q = input.trim();
    if (!q || loading) return;
    setTurns((t) => [...t, { role: "user", text: q }]);
    setInput("");
    setLoading(true);
    // Simulasi panggilan API Groq
    setTimeout(() => {
      setTurns((t) => [...t, { role: "ai", text: MOCK_REPLIES.default }]);
      setLoading(false);
    }, 900);
  }

  return (
    <div className="flex h-full flex-col rounded-card bg-card shadow-card">
      <div className="flex items-center gap-2 border-b border-line/70 px-5 py-4">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-xl text-white nm-raised-sm"
          style={{ background: "linear-gradient(135deg,#8b7bff,#6c5ce7)" }}
        >
          <Sparkles className="h-4 w-4" />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-ink">Asisten Tagihan AI</h3>
          <p className="text-xs text-ink-soft">LLaMA 3.3 70B via Groq</p>
        </div>
      </div>

      <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto p-4">
        {turns.map((t, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-2",
              t.role === "user" && "flex-row-reverse"
            )}
          >
            {t.role === "ai" && (
              <span className="nm-chip flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-brand">
                <Bot className="h-4 w-4" />
              </span>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm",
                t.role === "user"
                  ? "rounded-br-sm text-white [background:linear-gradient(135deg,#8b7bff,#6c5ce7)] [box-shadow:4px_4px_10px_#cdcfe0]"
                  : "rounded-bl-sm text-ink [box-shadow:inset_3px_3px_7px_#d0d2e2,inset_-3px_-3px_7px_#ffffff]"
              )}
            >
              {t.text}
            </div>
          </div>
        ))}
        {loading && (
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
      </div>

      <form onSubmit={send} className="flex gap-2 border-t border-line/70 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Kenapa tagihan bulan ini lebih mahal?"
          className="nm-input h-11 flex-1 rounded-xl px-3.5 text-sm text-ink outline-none placeholder:text-ink-soft"
        />
        <button
          type="submit"
          disabled={loading}
          className="kk-btn kk-btn-primary flex h-11 w-11 items-center justify-center rounded-xl text-white disabled:opacity-50"
          aria-label="Kirim"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
