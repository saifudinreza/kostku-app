"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "ai"; text: string };

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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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

/** Live, looping typed AI-chat demo for the hero mockup. */
export function HeroChat() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [typingText, setTypingText] = useState("");
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const aliveRef = useRef(true);

  // keep the scroll pinned to the latest message
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, typing, typingText]);

  useEffect(() => {
    aliveRef.current = true;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    async function run() {
      while (aliveRef.current) {
        setMsgs([]);
        setTyping(false);
        setTypingText("");
        await sleep(600);

        for (const turn of SCRIPT) {
          if (!aliveRef.current) return;
          setMsgs((s) => [...s, { role: "user", text: turn.q }]);
          await sleep(680);
          if (!aliveRef.current) return;

          setTyping(true);
          setTypingText("");
          await sleep(750);

          if (reduce) {
            setTypingText(turn.a);
          } else {
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
