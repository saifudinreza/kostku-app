// =============================================================================
// PageHeader — judul besar di bagian atas tiap halaman.
// ANALOGI: seperti "papan nama" di pintu masuk ruangan: judul (wajib), anak
// judul/description (opsional), dan `action` di kanan (opsional, mis. tombol
// "Tambah"). Dipakai hampir di semua halaman owner & tenant agar seragam.
// =============================================================================
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode; // ReactNode = "apa saja yang bisa ditampilkan": tombol, ikon, teks
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-ink">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-ink-soft">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
