// "use client" = WAJIB di atas. Memberi tahu Next.js bahwa komponen ini jalan
// di browser (punya tombol, ketikan, state yang berubah). Tanpa ini, fitur
// interaktif seperti useState/onClick tidak bisa dipakai.
"use client";

import { useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// =============================================================================
// AiAssistant — kotak chat "Asisten Tagihan AI".
// ANALOGI: seperti customer service yang menjawab pertanyaan soal tagihan.
// SEKARANG masih boong-boongan: jawabannya tetap (MOCK_REPLIES) dan ada jeda
// 0,9 detik untuk meniru "AI sedang berpikir". Nanti diganti panggilan API
// ke model AI sungguhan (mis. LLM via Groq) lewat endpoint backend.
// =============================================================================

// Satu giliran percakapan: dari "user" (pengguna) atau "ai" (asisten).
interface ChatTurn {
  role: "user" | "ai";
  text: string;
}

// Jawaban tetap untuk simulasi. Kunci "default" dipakai untuk semua pertanyaan.
const MOCK_REPLIES: Record<string, string> = {
  default:
    "Tagihan Juni 2025 kamu Rp 950.000, jatuh tempo 20 Juni 2025 dan belum dibayar. Terdiri dari Sewa Kamar Rp 800.000 + Listrik Rp 150.000.",
};

export function AiAssistant() {
  // useState = "ingatan" komponen. Saat isinya diubah, tampilan otomatis
  // digambar ulang. `turns` = riwayat percakapan (mulai dengan sapaan AI).
  // `input` = teks yang sedang diketik. `loading` = sedang menunggu jawaban?
  const [turns, setTurns] = useState<ChatTurn[]>([
    {
      role: "ai",
      text: "Halo! Aku asisten tagihan KostKu. Tanya apa saja soal tagihanmu ya.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Dijalankan saat pengguna menekan tombol kirim / Enter.
  function send(e: React.FormEvent) {
    e.preventDefault(); // cegah halaman reload (perilaku bawaan form HTML)
    const q = input.trim(); // buang spasi di ujung
    if (!q || loading) return; // abaikan kalau kosong atau masih menunggu jawaban
    // Tambah pesan pengguna ke riwayat. `[...t, baru]` = salin semua yang lama
    // lalu tempel yang baru di akhir (bikin daftar baru, tidak mengubah aslinya).
    setTurns((t) => [...t, { role: "user", text: q }]);
    setInput(""); // kosongkan kolom ketik
    setLoading(true); // tampilkan animasi "sedang mengetik"
    // Tiru jeda jaringan: setelah 0,9 detik, munculkan jawaban AI.
    // Nanti `setTimeout` ini diganti `fetch`/`await` ke API AI sungguhan.
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
        </div>
      </div>

      {/* Area gulung berisi gelembung chat. `turns.map(...)` = gambar satu
          gelembung untuk tiap pesan. Pesan user dirata-kanan & berwarna ungu,
          pesan AI dirata-kiri & polos (lihat `cn(...)` di bawah). */}
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
