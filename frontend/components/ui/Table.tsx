// =============================================================================
// Komponen tabel: satu set "batu bata" untuk menyusun tabel yang seragam.
// ANALOGI: Table = bingkai tabel, Th = judul kolom (baris paling atas yang
// tebal), Tr = satu baris data, Td = satu sel/kotak di dalam baris.
// Dipakai bersama tag HTML asli <thead>/<tbody>, contoh:
//   <Table><thead><tr><Th>Nama</Th></tr></thead>
//          <tbody><Tr><Td>Budi</Td></Tr></tbody></Table>
// =============================================================================
import { cn } from "@/lib/utils";

// Table = pembungkus tabel. `overflow-x-auto` membuat tabel bisa digeser ke
// samping di layar HP kalau kolomnya kebanyakan (tidak merusak tata letak).
export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  );
}

// Th = "table header", judul kolom (huruf kecil-kapital, abu-abu, rata kiri).
export function Th({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        "border-b border-line bg-black/[0.025] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-soft",
        className
      )}
    >
      {children}
    </th>
  );
}

// Td = "table data", satu sel isi di dalam baris.
export function Td({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("border-b border-line/70 px-4 py-3 text-ink", className)}>
      {children}
    </td>
  );
}

// Tr = "table row", satu baris. Warnanya sedikit berubah saat disorot kursor
// (`hover:bg-black/[0.03]`) supaya enak dibaca baris mana yang sedang ditunjuk.
export function Tr({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <tr className={cn("transition-colors hover:bg-black/[0.03]", className)}>
      {children}
    </tr>
  );
}
