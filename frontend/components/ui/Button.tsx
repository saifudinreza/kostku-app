// =============================================================================
// Button — tombol seragam untuk seluruh aplikasi.
// ANALOGI: daripada menjahit baju (tombol) baru tiap kali butuh, kita punya
// satu pola dengan beberapa "model" (variant) dan "ukuran" (size). Cukup pilih.
// =============================================================================
import { cn } from "@/lib/utils";

// Variant = gaya/warna tombol. Size = ukuran. Menulisnya sebagai `type` dengan
// pilihan terbatas membuat TypeScript menolak nilai salah ketik (mis. "primry").
type Variant = "primary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

// "Kamus" yang memetakan tiap variant -> kumpulan class CSS-nya.
// primary = tombol utama (gradien ungu), outline = netral, ghost = transparan,
// danger = merah untuk aksi berbahaya (mis. hapus).
const VARIANTS: Record<Variant, string> = {
  primary: "kk-btn kk-btn-primary",
  outline: "kk-btn kk-btn-soft",
  ghost: "text-ink-soft hover:bg-black/[0.04] hover:text-ink",
  danger:
    "kk-btn text-white [background:linear-gradient(135deg,#f87171,#dc2626)] [box-shadow:6px_6px_14px_#d4b4bd,-6px_-6px_14px_#ffffff]",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

// Props tombol = atribut <button> biasa (onClick, disabled, type, ...) DITAMBAH
// dua pilihan kita sendiri: variant & size. `extends` artinya "warisi semua
// atribut tombol standar, lalu tambahkan punyaku".
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

// Kalau pemakai tidak menyebut variant/size, dipakai default: primary & md.
// `...props` meneruskan sisa atribut (onClick, dll) ke <button> asli.
export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:pointer-events-none disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    />
  );
}
