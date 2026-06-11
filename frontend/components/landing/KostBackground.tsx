// =============================================================================
// KostBackground — hiasan latar halaman depan: deretan gedung kost yang
// jendelanya berkelip, awan yang melayang, dan cahaya lembut.
// ANALOGI: seperti lukisan kota di dinding belakang panggung. Murni hiasan
// (`aria-hidden` = disembunyikan dari pembaca layar), tidak bisa diklik.
// Semua gerakan dibuat lewat CSS (lihat globals.css), tanpa JavaScript.
// =============================================================================

// Bentuk data satu gedung: posisi-x, lebar, tinggi, jumlah kolom & baris
// jendela, dan warnanya.
type Building = {
  x: number;
  w: number;
  h: number;
  cols: number;
  rows: number;
  fill: string;
};

// Daftar gedung dengan tinggi/lebar beragam supaya terlihat seperti gerombolan
// rumah kost (skyline). Angka-angka ini koordinat di dalam kanvas SVG.
const BUILDINGS: Building[] = [
  { x: 20, w: 120, h: 150, cols: 3, rows: 4, fill: "#cfd0e6" },
  { x: 150, w: 96, h: 210, cols: 2, rows: 6, fill: "#c3c4df" },
  { x: 256, w: 140, h: 178, cols: 3, rows: 5, fill: "#d4d5ea" },
  { x: 406, w: 104, h: 248, cols: 2, rows: 7, fill: "#bcbddb" },
  { x: 520, w: 128, h: 166, cols: 3, rows: 4, fill: "#cfd0e6" },
  { x: 658, w: 92, h: 224, cols: 2, rows: 6, fill: "#c3c4df" },
  { x: 760, w: 150, h: 188, cols: 4, rows: 5, fill: "#d4d5ea" },
  { x: 920, w: 100, h: 232, cols: 2, rows: 6, fill: "#bcbddb" },
  { x: 1030, w: 134, h: 160, cols: 3, rows: 4, fill: "#cfd0e6" },
  { x: 1174, w: 110, h: 206, cols: 3, rows: 6, fill: "#c6c7e1" },
];

const BASE_Y = 300; // garis tanah di dalam kanvas SVG 1300x320

// Windows = menggambar petak-petak jendela pada satu gedung.
// Sebagian jendela diberi class "kk-window" agar berkelip; sisanya redup tetap.
function Windows({ b, bi }: { b: Building; bi: number }) {
  const pad = 14;
  const gapX = (b.w - pad * 2) / b.cols;
  const gapY = (b.h - pad * 2) / b.rows;
  const ww = Math.min(gapX * 0.52, 12);
  const wh = Math.min(gapY * 0.5, 14);
  const cells = [];
  for (let r = 0; r < b.rows; r++) {
    for (let c = 0; c < b.cols; c++) {
      const wx = b.x + pad + c * gapX + (gapX - ww) / 2;
      const wy = BASE_Y - b.h + pad + r * gapY + (gapY - wh) / 2;
      const twinkle = (r + c + bi) % 3 === 0;
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={wx}
          y={wy}
          width={ww}
          height={wh}
          rx={2}
          fill="#fff7d6"
          className={twinkle ? "kk-window" : undefined}
          style={{
            opacity: twinkle ? undefined : 0.32,
            animationDelay: twinkle ? `${((r * 7 + c * 3 + bi) % 10) * 0.32}s` : undefined,
          }}
        />,
      );
    }
  }
  return <>{cells}</>;
}

export function KostBackground() {
  return (
    <div className="kk-bg" aria-hidden>
      {/* glow blobs */}
      <div
        className="kk-blob"
        style={{
          width: 360,
          height: 360,
          top: -80,
          left: -60,
          background: "radial-gradient(circle,#b9acff,transparent 70%)",
          animation: "kkDrift 16s ease-in-out infinite",
        }}
      />
      <div
        className="kk-blob"
        style={{
          width: 300,
          height: 300,
          top: 40,
          right: -40,
          background: "radial-gradient(circle,#c9b6ff,transparent 70%)",
          animation: "kkDriftAlt 19s ease-in-out infinite",
        }}
      />

      {/* drifting clouds */}
      {[
        { top: "12%", dur: 46, scale: 1, op: 0.8 },
        { top: "26%", dur: 64, scale: 0.7, op: 0.6 },
        { top: "6%", dur: 80, scale: 1.25, op: 0.5 },
      ].map((c, i) => (
        <div
          key={i}
          className="kk-cloud"
          style={{
            top: c.top,
            left: 0,
            animationDuration: `${c.dur}s`,
            animationDelay: `${-i * 12}s`,
            opacity: c.op,
            transform: `scale(${c.scale})`,
          }}
        >
          <div
            style={{
              width: 120,
              height: 36,
              borderRadius: 99,
              background: "rgba(255,255,255,0.85)",
              boxShadow:
                "34px 6px 0 -4px rgba(255,255,255,0.85), -30px 8px 0 -6px rgba(255,255,255,0.8)",
              filter: "blur(2px)",
            }}
          />
        </div>
      ))}

      {/* skyline */}
      <svg
        viewBox="0 0 1300 320"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 bottom-0 h-[58%] w-full opacity-[0.55]"
      >
        {BUILDINGS.map((b, bi) => (
          <g key={bi} className="kk-rise" style={{ animation: `kkRise ${7 + (bi % 4)}s ease-in-out ${bi * 0.4}s infinite` }}>
            <rect
              x={b.x}
              y={BASE_Y - b.h}
              width={b.w}
              height={b.h}
              rx={10}
              fill={b.fill}
            />
            {/* little pitched roof accent */}
            <rect
              x={b.x + b.w / 2 - 10}
              y={BASE_Y - b.h - 12}
              width={20}
              height={14}
              rx={3}
              fill="#8b7bff"
              opacity={0.65}
            />
            <Windows b={b} bi={bi} />
          </g>
        ))}
      </svg>
    </div>
  );
}
