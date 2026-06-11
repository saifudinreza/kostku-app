import {
  Building2,
  CreditCard,
  LayoutDashboard,
  MessageSquare,
  Receipt,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const ownerNav: NavItem[] = [
  { label: "Dashboard", href: "/owner/dashboard", icon: LayoutDashboard },
  { label: "Properti", href: "/owner/properties", icon: Building2 },
  { label: "Penghuni", href: "/owner/tenants", icon: Users },
  { label: "Tagihan", href: "/owner/invoices", icon: Receipt },
  { label: "Pembayaran", href: "/owner/payments", icon: CreditCard },
  { label: "Laporan", href: "/owner/reports", icon: TrendingUp },
  { label: "Chat", href: "/owner/chat", icon: MessageSquare },
];

export const tenantNav: NavItem[] = [
  { label: "Dashboard", href: "/tenant/dashboard", icon: LayoutDashboard },
  { label: "Tagihan", href: "/tenant/invoices", icon: Receipt },
  { label: "Pembayaran", href: "/tenant/payments", icon: CreditCard },
  { label: "Chat", href: "/tenant/chat", icon: MessageSquare },
];
