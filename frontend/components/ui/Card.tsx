// =============================================================================
// Card — "kartu" panel ber-sudut-tumpul dengan bayangan, wadah utama konten.
// ANALOGI: seperti map/folder di atas meja. Hampir semua bagian aplikasi
// (tabel, statistik, form) diletakkan di dalam Card supaya tampak rapi & rata.
// =============================================================================
import { cn } from "@/lib/utils";

// Card = kotak pembungkus. `...props` artinya semua atribut <div> biasa
// (onClick, id, dll) diteruskan apa adanya. `cn(...)` menggabung style bawaan
// dengan `className` tambahan dari pemakai, jadi tampilannya bisa disesuaikan.
export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-card bg-card shadow-card", className)}
      {...props}
    />
  );
}

// CardHeader = bagian judul di atas sebuah Card (garis pemisah di bawahnya).
// ANALOGI: seperti "kop surat" — judul di kiri, dan `action` (mis. tombol)
// di kanan. `description` & `action` opsional (tanda `?`), tampil hanya bila ada.
export function CardHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 border-b border-line/70 px-5 py-4",
        className
      )}
    >
      <div>
        <h3 className="text-[18px] font-semibold text-ink">{title}</h3>
        {description && (
          <p className="mt-0.5 text-sm text-ink-soft">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
