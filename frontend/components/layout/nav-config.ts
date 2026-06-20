import {
  Building2,
  CreditCard,
  LayoutDashboard,
  MessageSquare,
  Receipt,
  Settings,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

// =============================================================================
// nav-config — daftar menu sidebar. "Daftar isi" navigasi aplikasi.
// ANALOGI: seperti daftar tombol lift di gedung — tiap lantai (halaman) punya
// satu tombol. Owner & tenant punya daftar berbeda karena haknya berbeda.
// Memisahkan daftar ini dari komponen Sidebar membuatnya mudah diubah:
// tambah/hapus menu cukup di sini, tampilan ikut menyesuaikan.
// =============================================================================

// Bentuk satu item menu: teks, tujuan (URL), dan ikon.
export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon; // komponen ikon dari lucide-react
}

// Menu untuk PEMILIK kost — punya akses penuh (properti, penghuni, laporan, dll).
export const ownerNav: NavItem[] = [
  { label: "Dashboard", href: "/owner/dashboard", icon: LayoutDashboard },
  { label: "Properti", href: "/owner/properties", icon: Building2 },
  { label: "Penghuni", href: "/owner/tenants", icon: Users },
  { label: "Tagihan", href: "/owner/invoices", icon: Receipt },
  { label: "Pembayaran", href: "/owner/payments", icon: CreditCard },
  { label: "Laporan", href: "/owner/reports", icon: TrendingUp },
  { label: "Chat", href: "/owner/chat", icon: MessageSquare },
  { label: "Pengaturan", href: "/owner/settings", icon: Settings },
];

// Menu untuk PENGHUNI — lebih sedikit, hanya yang relevan baginya.
export const tenantNav: NavItem[] = [
  { label: "Dashboard", href: "/tenant/dashboard", icon: LayoutDashboard },
  { label: "Tagihan", href: "/tenant/invoices", icon: Receipt },
  { label: "Pembayaran", href: "/tenant/payments", icon: CreditCard },
  { label: "Chat", href: "/tenant/chat", icon: MessageSquare },
  { label: "Pengaturan", href: "/tenant/settings", icon: Settings },
];
