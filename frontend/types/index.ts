// KostKu — TypeScript interfaces (PRD §TypeScript Interface Lengkap)

export type UserRole = "owner" | "tenant";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone: string | null;
  avatar: string | null;
}

export interface Property {
  id: number;
  owner_id: number;
  name: string;
  address: string;
  city: string;
  description: string | null;
  rooms_count?: number;
}

export type RoomStatus = "available" | "occupied" | "maintenance";

export interface Room {
  id: number;
  property_id: number;
  room_number: string;
  floor: number | null;
  price: number;
  status: RoomStatus;
  description: string | null;
  images?: RoomImage[];
  active_tenancy?: Tenancy;
}

export interface RoomImage {
  id: number;
  room_id: number;
  image_path: string;
  is_primary: boolean;
}

export type TenancyStatus = "active" | "ended";

export interface Tenancy {
  id: number;
  room_id: number;
  tenant_id: number;
  start_date: string;
  end_date: string | null;
  status: TenancyStatus;
  deposit: number | null;
  room?: Room;
  tenant?: User;
}

export type InvoiceStatus = "unpaid" | "pending" | "paid" | "overdue";

export interface Invoice {
  id: number;
  tenancy_id: number;
  invoice_number: string;
  period_month: number;
  period_year: number;
  due_date: string;
  subtotal: number;
  total_amount: number;
  status: InvoiceStatus;
  notes: string | null;
  items?: InvoiceItem[];
  payment?: Payment;
}

export interface InvoiceItem {
  id: number;
  invoice_id: number;
  name: string;
  amount: number;
  note: string | null;
}

export type PaymentStatus = "pending" | "success" | "failed" | "expired";

export interface Payment {
  id: number;
  invoice_id: number;
  midtrans_order_id: string;
  amount: number;
  payment_method: string | null;
  status: PaymentStatus;
  paid_at: string | null;
  snap_token: string | null;
}

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  tenancy_id: number;
  body: string;
  is_read: boolean;
  created_at: string;
  sender?: User;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}
