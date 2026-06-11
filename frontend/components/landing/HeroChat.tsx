"use client"; // animasi mengetik berjalan di browser

import { useEffect, useRef, useState } from "react";

// =============================================================================
// HeroChat — demo chat AI yang "hidup" di halaman depan (landing).
// ANALOGI: seperti iklan di etalase yang memutar adegan berulang. Ini BUKAN
// chat sungguhan — ia memutar naskah tetap (SCRIPT): pertanyaan muncul, lalu
// jawaban "diketik" huruf demi huruf, lalu mengulang dari awal. Tujuannya
// memamerkan fitur asisten AI ke calon pengguna.
// =============================================================================

// Bentuk satu pesan: dari "user" atau "ai".
type Msg = { role: "user" | "ai"; text: string };

// Naskah percakapan yang diputar berulang (tanya-jawab tetap).
const SCRIPT = [
  {
    q: "Kenapa tagihan bulan ini lebih mahal?",
    a: "Tagihan Juni Rp 850.000 — naik Rp 150.000 dari bulan lalu. Ada tambahan listrik Rp 150.000 yang diinput owner 12 Juni.",
  },
  {
    q: "Kapan jatuh tempo tagihan saya?",
    a: "Tagihan Juni jatuh tempo 20 Juni 2025. Sisa 3 hari lagi — dan belum dibayar, ya.",
  },
];

// sleep = "tunggu sekian milidetik" sebelum lanjut. Dipakai untuk memberi jeda
// antar adegan supaya animasi terasa alami (seperti orang mengetik & berpikir).
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Lingkaran kecil bertuliskan "AI" sebagai foto profil si asisten.
function AiAvatar() {
  return (
    <div
      className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[10.5px] font-extrabold text-white"
      style={{
        background: "linear-gradient(135deg,#8b7bff,#6c5ce7)",
        boxShadow: "3px 3px 7px #cccede,-3px -3px 7px #ffffff",
      }}
    >
      AI
    </div>
  );
}

export function HeroChat() {
  const [msgs, setMsgs] = useState<Msg[]>([]); // pesan yang sudah tampil
  const [typing, setTyping] = useState(false); // sedang menampilkan AI mengetik?
  const [typingText, setTypingText] = useState(""); // teks separuh jadi saat diketik
  const bodyRef = useRef<HTMLDivElement | null>(null); // penanda kotak chat (untuk auto-scroll)
  // aliveRef = "saklar nyala/mati". Saat komponen ditutup, kita set false agar
  // perulangan animasi berhenti (tidak jalan di latar sia-sia / mencegah error).
  const aliveRef = useRef(true);

  // Setiap ada pesan baru, geser otomatis ke bawah supaya pesan terbaru terlihat.
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, typing, typingText]);

  // "Sutradara" animasi: menjalankan naskah berulang-ulang.
  useEffect(() => {
    aliveRef.current = true;
    // Hormati pengaturan "kurangi animasi" di perangkat pengguna: kalau aktif,
    // jawaban langsung muncul utuh tanpa efek mengetik.
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    async function run() {
      // Ulangi selamanya selama komponen masih "nyala".
      while (aliveRef.current) {
        setMsgs([]); // kosongkan layar, mulai dari awal
        setTyping(false);
        setTypingText("");
        await sleep(600);

        // Mainkan tiap pasang tanya-jawab di naskah.
        for (const turn of SCRIPT) {
          if (!aliveRef.current) return; // berhenti bila komponen sudah ditutup
          setMsgs((s) => [...s, { role: "user", text: turn.q }]); // tampilkan pertanyaan
          await sleep(680);
          if (!aliveRef.current) return;

          setTyping(true); // mulai indikator "mengetik..."
          setTypingText("");
          await sleep(750);

          if (reduce) {
            setTypingText(turn.a); // mode hemat animasi: langsung utuh
          } else {
            // Efek ketik: tambah satu huruf tiap 16 ms.
            let buf = "";
            for (const ch of turn.a) {
              if (!aliveRef.current) return;
              buf += ch;
              setTypingText(buf);
              await sleep(16);
            }
          }

          setMsgs((s) => [...s, { role: "ai", text: turn.a }]);
          setTyping(false);
          setTypingText("");
          await sleep(1700);
        }
        await sleep(1000);
      }
    }

    run();
    return () => {
      aliveRef.current = false;
    };
  }, []);

  return (
    <div
      ref={bodyRef}
      className="kk-scroll h-[266px] overflow-y-auto rounded-[18px] p-1 nm-inset"
    >
      <div className="p-3.5">
        {msgs.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="mb-3.5 flex justify-end">
              <div
                className="max-w-[82%] rounded-[17px_7px_17px_17px] px-[15px] py-[11px] text-[13.5px] font-medium leading-[1.5] text-white"
                style={{
                  background: "linear-gradient(135deg,#8b7bff,#6c5ce7)",
                  boxShadow: "5px 5px 12px #cdcfe0",
                }}
              >
                {m.text}
              </div>
            </div>
          ) : (
            <div key={i} className="mb-3.5 flex items-end gap-[9px]">
              <AiAvatar />
              <div
                className="max-w-[82%] rounded-[7px_17px_17px_17px] px-[15px] py-[11px] text-[13.5px] leading-[1.55] text-[#3a3d55]"
                style={{
                  background: "#e9eaf2",
                  boxShadow: "5px 5px 12px #c7c9da,-5px -5px 12px #ffffff",
                }}
              >
                {m.text}
              </div>
            </div>
          ),
        )}

        {typing && (
          <div className="mb-3.5 flex items-end gap-[9px]">
            <AiAvatar />
            <div
              className="min-h-4 max-w-[82%] rounded-[7px_17px_17px_17px] px-[15px] py-[11px] text-[13.5px] leading-[1.55] text-[#3a3d55]"
              style={{
                background: "#e9eaf2",
                boxShadow: "5px 5px 12px #c7c9da,-5px -5px 12px #ffffff",
              }}
            >
              {typingText ? (
                <>
                  {typingText}
                  <span
                    className="ml-0.5 inline-block h-3.5 w-0.5 align-[-2px]"
                    style={{
                      background: "#6c5ce7",
                      animation: "kkBlink 1s steps(1) infinite",
                    }}
                  />
                </>
              ) : (
                <span className="inline-flex items-center gap-[5px]">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="inline-block h-[7px] w-[7px] rounded-full"
                      style={{
                        background: "#9a93d6",
                        animation: `kkDotPulse 1.2s ${i * 0.15}s infinite`,
                      }}
                    />
                  ))}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
