// Data dummy untuk frontend-only. Nanti diganti TanStack Query ke Laravel API.
import type {
  Invoice,
  Message,
  Payment,
  Property,
  Room,
  Tenancy,
  User,
} from "@/types";

export const currentOwner: User = {
  id: 1,
  name: "Pak Hasan",
  email: "hasan@kostku.id",
  role: "owner",
  phone: "0812-3456-7890",
  avatar: null,
};

export const currentTenant: User = {
  id: 7,
  name: "Budi Santoso",
  email: "budi@kostku.id",
  role: "tenant",
  phone: "0856-1111-2222",
  avatar: null,
};

export const properties: Property[] = [
  {
    id: 1,
    owner_id: 1,
    name: "Kost Melati",
    address: "Jl. Melati No. 12, Tembalang",
    city: "Semarang",
    description: "Kost putra dekat kampus, 12 kamar.",
    rooms_count: 12,
  },
  {
    id: 2,
    owner_id: 1,
    name: "Kost Anggrek",
    address: "Jl. Anggrek Raya No. 8, Banyumanik",
    city: "Semarang",
    description: "Kost campur, fasilitas lengkap, 8 kamar.",
    rooms_count: 8,
  },
];

export const rooms: Room[] = [
  { id: 101, property_id: 1, room_number: "101", floor: 1, price: 800000, status: "occupied", description: null },
  { id: 102, property_id: 1, room_number: "102", floor: 1, price: 800000, status: "available", description: null },
  { id: 201, property_id: 1, room_number: "201", floor: 2, price: 950000, status: "available", description: null },
  { id: 202, property_id: 1, room_number: "202", floor: 2, price: 950000, status: "occupied", description: null },
  { id: 203, property_id: 1, room_number: "203", floor: 2, price: 950000, status: "maintenance", description: null },
  { id: 301, property_id: 2, room_number: "A1", floor: 1, price: 1100000, status: "occupied", description: null },
];

export const tenancies: Tenancy[] = [
  {
    id: 1,
    room_id: 101,
    tenant_id: 7,
    start_date: "2025-01-10",
    end_date: null,
    status: "active",
    deposit: 800000,
    room: rooms[0],
    tenant: currentTenant,
  },
  {
    id: 2,
    room_id: 202,
    tenant_id: 8,
    start_date: "2024-09-01",
    end_date: null,
    status: "active",
    deposit: 950000,
    room: rooms[3],
    tenant: { id: 8, name: "Sari Dewi", email: "sari@kostku.id", role: "tenant", phone: "0857-3333-4444", avatar: null },
  },
  {
    id: 3,
    room_id: 301,
    tenant_id: 9,
    start_date: "2025-03-15",
    end_date: null,
    status: "active",
    deposit: 1100000,
    room: rooms[5],
    tenant: { id: 9, name: "Andi Pratama", email: "andi@kostku.id", role: "tenant", phone: "0858-5555-6666", avatar: null },
  },
];

export const invoices: Invoice[] = [
  {
    id: 1001,
    tenancy_id: 1,
    invoice_number: "INV-2025-06-101",
    period_month: 6,
    period_year: 2025,
    due_date: "2025-06-20",
    subtotal: 800000,
    total_amount: 950000,
    status: "unpaid",
    notes: null,
    items: [
      { id: 1, invoice_id: 1001, name: "Sewa Kamar", amount: 800000, note: "Juni 2025" },
      { id: 2, invoice_id: 1001, name: "Listrik", amount: 150000, note: "Diinput 12 Juni" },
    ],
  },
  {
    id: 1000,
    tenancy_id: 1,
    invoice_number: "INV-2025-05-101",
    period_month: 5,
    period_year: 2025,
    due_date: "2025-05-20",
    subtotal: 800000,
    total_amount: 800000,
    status: "paid",
    notes: null,
    items: [{ id: 3, invoice_id: 1000, name: "Sewa Kamar", amount: 800000, note: "Mei 2025" }],
  },
  {
    id: 1002,
    tenancy_id: 2,
    invoice_number: "INV-2025-06-202",
    period_month: 6,
    period_year: 2025,
    due_date: "2025-06-10",
    subtotal: 950000,
    total_amount: 950000,
    status: "overdue",
    notes: null,
    items: [{ id: 4, invoice_id: 1002, name: "Sewa Kamar", amount: 950000, note: "Juni 2025" }],
  },
  {
    id: 1003,
    tenancy_id: 3,
    invoice_number: "INV-2025-06-A1",
    period_month: 6,
    period_year: 2025,
    due_date: "2025-06-25",
    subtotal: 1100000,
    total_amount: 1100000,
    status: "paid",
    notes: null,
    items: [{ id: 5, invoice_id: 1003, name: "Sewa Kamar", amount: 1100000, note: "Juni 2025" }],
  },
];

export const payments: Payment[] = [
  {
    id: 1,
    invoice_id: 1000,
    midtrans_order_id: "ORD-1000-XK21",
    amount: 800000,
    payment_method: "BCA Virtual Account",
    status: "success",
    paid_at: "2025-05-18T09:24:00",
    snap_token: null,
  },
  {
    id: 2,
    invoice_id: 1003,
    midtrans_order_id: "ORD-1003-PL93",
    amount: 1100000,
    payment_method: "GoPay",
    status: "success",
    paid_at: "2025-06-21T14:02:00",
    snap_token: null,
  },
  {
    id: 3,
    invoice_id: 1001,
    midtrans_order_id: "ORD-1001-QQ08",
    amount: 950000,
    payment_method: "QRIS",
    status: "pending",
    paid_at: null,
    snap_token: "snap-demo-token",
  },
];

export const messages: Message[] = [
  { id: 1, sender_id: 1, receiver_id: 7, tenancy_id: 1, body: "Halo Budi, tagihan Juni sudah terbit ya.", is_read: true, created_at: "2025-06-10T08:00:00", sender: currentOwner },
  { id: 2, sender_id: 7, receiver_id: 1, tenancy_id: 1, body: "Baik pak, nanti saya bayar sebelum jatuh tempo.", is_read: true, created_at: "2025-06-10T08:05:00", sender: currentTenant },
  { id: 3, sender_id: 7, receiver_id: 1, tenancy_id: 1, body: "Pak, keran kamar mandi agak bocor.", is_read: false, created_at: "2025-06-11T19:30:00", sender: currentTenant },
];

/** Pendapatan 6 bulan terakhir untuk chart reports. */
export const monthlyRevenue = [
  { month: "Jan", value: 3800000 },
  { month: "Feb", value: 4000000 },
  { month: "Mar", value: 4200000 },
  { month: "Apr", value: 4200000 },
  { month: "Mei", value: 4200000 },
  { month: "Jun", value: 3600000 },
];
