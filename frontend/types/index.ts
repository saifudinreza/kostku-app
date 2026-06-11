// =============================================================================
// KostKu — Definisi Tipe Data (TypeScript interfaces)
// -----------------------------------------------------------------------------
// ANALOGI: file ini adalah "cetakan kue" (cetakan/mould) untuk setiap data.
// Dia tidak menyimpan data apa pun, hanya menjelaskan BENTUK data yang sah:
// "User itu harus punya id, name, email, ..." Kalau ada kode yang mencoba
// membuat User tanpa email, TypeScript langsung menegur sebelum program jalan.
//
// Semua bentuk di sini mengikuti struktur tabel database di backend (Laravel),
// jadi data dari API nanti tinggal "dituang" ke cetakan yang sama.
// =============================================================================

// Peran pengguna cuma ada dua: pemilik kost ("owner") atau penghuni ("tenant").
// `type ... = "a" | "b"` artinya nilainya WAJIB salah satu dari dua teks itu.
export type UserRole = "owner" | "tenant";

// User = akun seseorang (entah pemilik atau penghuni).
// `| null` artinya boleh kosong (mis. belum isi nomor HP / belum pasang foto).
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole; // menentukan dia diarahkan ke dashboard owner atau tenant
  phone: string | null;
  avatar: string | null;
}

// Property = satu bangunan kost milik owner (mis. "Kost Melati").
// Satu owner bisa punya banyak Property. Penghubungnya: `owner_id` -> User.id.
export interface Property {
  id: number;
  owner_id: number; // "kunci" yang menunjuk ke pemiliknya (User.id)
  name: string;
  address: string;
  city: string;
  description: string | null;
  rooms_count?: number; // tanda `?` = opsional, kadang ada kadang tidak
}

// Status sebuah kamar: kosong / terisi / sedang diperbaiki.
export type RoomStatus = "available" | "occupied" | "maintenance";

// Room = satu kamar di dalam sebuah Property.
// Penghubungnya: `property_id` -> Property.id (kamar ini milik gedung mana).
export interface Room {
  id: number;
  property_id: number; // menunjuk ke gedung induknya (Property.id)
  room_number: string;
  floor: number | null;
  price: number;
  status: RoomStatus;
  description: string | null;
  images?: RoomImage[]; // daftar foto kamar (lihat RoomImage di bawah)
  active_tenancy?: Tenancy; // sewa yang sedang aktif di kamar ini, bila ada
  property?: Property; // relasi eager load dari backend
}

// RoomImage = satu foto milik sebuah Room.
// Penghubungnya: `room_id` -> Room.id. `is_primary` menandai foto utama (sampul).
export interface RoomImage {
  id: number;
  room_id: number;
  image_path: string;
  is_primary: boolean;
}

// Status sewa: masih berjalan ("active") atau sudah berakhir ("ended").
export type TenancyStatus = "active" | "ended";

// Tenancy = "kontrak sewa", yaitu hubungan SIAPA menyewa kamar MANA.
// ANALOGI: ini seperti surat perjanjian yang menempelkan satu penghuni ke satu
// kamar. Dua penghubung sekaligus: `room_id` -> Room.id, `tenant_id` -> User.id.
export interface Tenancy {
  id: number;
  room_id: number; // kamar yang disewa
  tenant_id: number; // penghuni yang menyewa
  start_date: string;
  end_date: string | null; // null = belum berakhir / masih menyewa
  status: TenancyStatus;
  deposit: number | null;
  room?: Room; // data kamar lengkap, agar tidak perlu cari manual
  tenant?: User; // data penghuni lengkap
}

// Status tagihan dari belum bayar sampai lunas / lewat tempo.
export type InvoiceStatus = "unpaid" | "pending" | "paid" | "overdue";

// Invoice = tagihan bulanan untuk sebuah Tenancy (sewa).
// Penghubungnya: `tenancy_id` -> Tenancy.id (tagihan ini untuk kontrak yang mana).
// ANALOGI: seperti struk belanja — ada beberapa baris item, lalu totalnya.
export interface Invoice {
  id: number;
  tenancy_id: number; // tagihan ini milik kontrak sewa yang mana
  invoice_number: string;
  period_month: number; // bulan periode (1-12)
  period_year: number;
  due_date: string;
  subtotal: number;
  total_amount: number; // jumlah akhir yang harus dibayar
  status: InvoiceStatus;
  notes: string | null;
  items?: InvoiceItem[]; // rincian baris tagihan (sewa, listrik, dll)
  payment?: Payment; // data pembayaran bila sudah/akan dibayar
  tenancy?: Tenancy; // relasi eager load dari backend
}

// InvoiceItem = satu baris rincian di dalam Invoice (mis. "Listrik: 150.000").
// Penghubungnya: `invoice_id` -> Invoice.id.
export interface InvoiceItem {
  id: number;
  invoice_id: number;
  name: string;
  amount: number;
  note: string | null;
}

// Status pembayaran di gerbang pembayaran (Midtrans).
export type PaymentStatus = "pending" | "success" | "failed" | "expired";

// Payment = catatan transaksi pembayaran sebuah Invoice lewat Midtrans.
// Penghubungnya: `invoice_id` -> Invoice.id.
// `snap_token` & `midtrans_order_id` adalah "tiket" dari Midtrans untuk
// melanjutkan/melacak pembayaran (dipakai saat integrasi gerbang bayar).
export interface Payment {
  id: number;
  invoice_id: number;
  midtrans_order_id: string;
  amount: number;
  payment_method: string | null; // mis. "GoPay", "BCA Virtual Account"
  status: PaymentStatus;
  paid_at: string | null; // kapan lunas; null = belum dibayar
  snap_token: string | null;
}

// Message = satu pesan chat antara owner dan tenant.
// Tiga penghubung: `sender_id` & `receiver_id` -> User.id (pengirim/penerima),
// `tenancy_id` -> Tenancy.id (chat ini menyangkut kontrak sewa yang mana).
export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  tenancy_id: number;
  body: string;
  is_read: boolean; // sudah dibaca atau belum (untuk tanda "belum dibaca")
  created_at: string;
  sender?: User;
}

// ApiResponse<T> = "amplop" standar balasan dari API.
// ANALOGI: `<T>` adalah kotak kosong yang isinya menyesuaikan — bisa berisi
// satu User, satu Invoice, dll. `data` = isinya, `message` = catatan opsional.
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// PaginatedResponse<T> = balasan API yang datanya dipotong per halaman
// (mis. daftar tagihan dibagi 15 per halaman) supaya tidak berat sekali kirim.
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}
