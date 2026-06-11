# Panduan Belajar Project KostKu

Project ini terdiri dari dua bagian besar yang bekerja sama:

```
kostku-app/
├── backend/    ← Laravel 13  (server, database, API)
└── frontend/   ← Next.js 16  (tampilan web)
```

**Analogi:** backend = dapur restoran (proses & simpan data), frontend = ruang makan (tampilan untuk pengguna).

---

## FRONTEND (Next.js 16)

### Tahap 1 — Pondasi Data
> Pelajari ini dulu sebelum buka file lain. Semua file lain bergantung pada ini.

| File | Fungsi |
|------|--------|
| `frontend/types/index.ts` | **Cetakan semua data** — bentuk User, Property, Room, Tenancy, Invoice, Payment. Seperti KTP: mendefinisikan field apa saja yang ada. |
| `frontend/lib/mock.ts` | **Database palsu** sementara. Data array yang dipakai selama backend belum nyambung. |
| `frontend/lib/utils.ts` | Fungsi pembantu: `formatRupiah`, `formatTanggal`, `formatPeriode`, `cn`. |
| `frontend/lib/payments.ts` | Daftar 9 metode pembayaran + kode Midtrans (`enabled_payments`). |

**Rantai relasi data yang wajib dipahami:**
```
User (owner)
  └─ owner_id ──→ Property (gedung kos)
                    └─ property_id ──→ Room (kamar)
                                         └─ room_id ──→ Tenancy (kontrak sewa)
                                                           ├─ tenant_id ──→ User (penghuni)
                                                           └─ tenancy_id ──→ Invoice (tagihan)
                                                                               ├─ invoice_id ──→ InvoiceItem
                                                                               └─ invoice_id ──→ Payment
```

---

### Tahap 2 — Styling Global

| File | Fungsi |
|------|--------|
| `frontend/app/globals.css` | Semua warna, variabel CSS (`--kk-violet`, `--kk-grad`), class tombol, efek neumorphic. **Jika warna tidak muncul, cek di sini.** |
| `frontend/app/layout.tsx` | Root layout — "sampul buku" yang membungkus semua halaman. Mengatur font dan metadata SEO. |

---

### Tahap 3 — Komponen UI Dasar
> Building blocks terkecil. Dipakai oleh komponen lain di atasnya.

| File | Fungsi |
|------|--------|
| `frontend/components/ui/Button.tsx` | Tombol dengan varian: `primary`, `outline`, `ghost`. Analogi: pola jahit baju. |
| `frontend/components/ui/Card.tsx` | Kotak panel / kartu. Analogi: map/folder di atas meja. |
| `frontend/components/ui/Table.tsx` | Komponen tabel: `Table`, `Th`, `Tr`, `Td`. |

---

### Tahap 4 — Komponen Shared
> Komponen yang dipakai berulang di banyak halaman.

| File | Fungsi |
|------|--------|
| `frontend/components/shared/StatusBadge.tsx` | Label status berwarna: `paid`, `unpaid`, `overdue`, dll. Analogi: stempel di berkas. |
| `frontend/components/shared/PageHeader.tsx` | Judul + deskripsi di atas tiap halaman. |
| `frontend/components/shared/StatCard.tsx` | Kartu statistik (ikon + angka + label). Analogi: papan skor. |
| `frontend/components/shared/BarChart.tsx` | Grafik batang CSS murni. Analogi: deretan gelas diisi air. |
| `frontend/components/shared/AiAssistant.tsx` | Widget chat AI (mock → nanti diganti Groq API). |
| `frontend/components/shared/ChatThread.tsx` | Thread pesan antara owner dan penghuni. |
| `frontend/components/shared/PaymentMethods.tsx` | Grid logo metode bayar yang bisa dipilih (GoPay, OVO, DANA, dll). |

---

### Tahap 5 — Layout Aplikasi
> Kerangka tampilan dashboard (sidebar + topbar + area konten).

| File | Fungsi |
|------|--------|
| `frontend/components/layout/nav-config.ts` | Daftar item menu sidebar untuk owner dan tenant. Analogi: daftar tombol lift. |
| `frontend/components/layout/AppShell.tsx` | "Bingkai foto" — menyatukan sidebar, topbar, dan konten halaman. |
| `frontend/components/layout/Sidebar.tsx` | Menu samping. Deteksi menu aktif dengan `usePathname()`. Responsif (drawer di mobile). |
| `frontend/components/layout/TopBar.tsx` | Bar atas: nama user, avatar inisial, ikon notifikasi. |

> **Catatan penting:** `app/owner/layout.tsx` dan `app/tenant/layout.tsx` WAJIB `"use client"` karena mereka mengoper icon (fungsi) sebagai prop ke AppShell — tidak bisa dilakukan dari Server Component.

---

### Tahap 6 — Halaman Auth (Login & Register)

| File | Fungsi |
|------|--------|
| `frontend/app/(auth)/layout.tsx` | Layout dua panel: kiri ilustrasi, kanan form. `(auth)` = folder grup, tidak muncul di URL. |
| `frontend/app/(auth)/login/page.tsx` | Form login. Menyimpan role ke cookie, lalu redirect ke `/owner/dashboard` atau `/tenant/dashboard`. |
| `frontend/app/(auth)/register/page.tsx` | Form daftar akun baru. |

---

### Tahap 7 — Halaman Owner (Pemilik Kos)

| File | Fungsi |
|------|--------|
| `frontend/app/owner/layout.tsx` | Wrapper yang memasang AppShell + menu owner. |
| `frontend/app/owner/dashboard/page.tsx` | Kokpit owner: statistik, grafik pendapatan, daftar penghuni, AI assistant. |
| `frontend/app/owner/properties/page.tsx` | Daftar semua gedung/kos milik owner ini. |
| `frontend/app/owner/tenants/page.tsx` | Daftar semua penghuni aktif beserta info kamarnya. |
| `frontend/app/owner/invoices/page.tsx` | Semua tagihan dari semua penghuni. |
| `frontend/app/owner/invoices/[id]/page.tsx` | Detail satu tagihan. `[id]` = dynamic route, `await params` wajib di Next.js 16. |
| `frontend/app/owner/payments/page.tsx` | Riwayat semua pembayaran. |
| `frontend/app/owner/reports/page.tsx` | Laporan keuangan bulanan + grafik. |
| `frontend/app/owner/chat/page.tsx` | Chat owner ↔ semua penghuni (pilih percakapan di sidebar kiri). |

---

### Tahap 8 — Halaman Tenant (Penghuni)

| File | Fungsi |
|------|--------|
| `frontend/app/tenant/layout.tsx` | Wrapper yang memasang AppShell + menu tenant. |
| `frontend/app/tenant/dashboard/page.tsx` | Kartu penghuni digital: info kamar, tagihan terbaru, AI assistant. |
| `frontend/app/tenant/invoices/page.tsx` | Daftar tagihan **milik penghuni ini saja**. |
| `frontend/app/tenant/invoices/[id]/page.tsx` | Detail tagihan + pilih metode bayar. Ada pengecekan keamanan: tidak bisa lihat tagihan orang lain. |
| `frontend/app/tenant/payments/page.tsx` | Riwayat pembayaran pribadi. Pakai `Set` untuk lookup efisien O(1). |
| `frontend/app/tenant/chat/page.tsx` | Chat ke owner. Langsung satu thread (tenant hanya punya satu lawan bicara). |

---

### Tahap 9 — Landing Page (Halaman Publik)

| File | Fungsi |
|------|--------|
| `frontend/app/page.tsx` | Halaman utama: Hero, Fitur, Masalah, AI Features, Cara Kerja, Testimoni, CTA, **Footer** (baris 585–642). |
| `frontend/components/landing/Reveal.tsx` | Animasi muncul saat scroll (IntersectionObserver). Analogi: tirai panggung. |
| `frontend/components/landing/HeroChat.tsx` | Simulasi chat AI yang mengetik otomatis di hero section. |
| `frontend/components/landing/LandingNav.tsx` | Navbar landing page dengan link anchor (`#fitur`, `#harga`, dll). |
| `frontend/components/landing/KostBackground.tsx` | Ilustrasi gedung kos animasi di hero. Dekoratif saja (`aria-hidden`). |
| `frontend/components/landing/LandingScrollEffects.tsx` | Aktifkan/matikan `kk-snap` scroll snapping. Tidak render elemen (`return null`). |

---

## BACKEND (Laravel 13)

### Tahap 1 — Konfigurasi Awal

| File | Fungsi |
|------|--------|
| `backend/.env` | **Setting utama**: nama DB, user/password MySQL, key Midtrans, config mail. Jangan di-commit ke git. |
| `backend/config/database.php` | Konfigurasi koneksi (MySQL/SQLite). |
| `backend/config/cors.php` | Izinkan domain frontend mengakses API. |
| `backend/config/sanctum.php` | Konfigurasi autentikasi token (Laravel Sanctum). |

---

### Tahap 2 — Database (Struktur Tabel)

> File di `database/migrations/` dijalankan **berurutan sesuai nama file** dengan perintah `php artisan migrate`.

| File | Tabel yang dibuat |
|------|-------------------|
| `0001_01_01_000000_create_users_table.php` | `users` (default Laravel) |
| `2026_06_11_000010_add_fields_to_users_table.php` | Tambah kolom `role`, `phone`, dll ke `users` |
| `2026_06_11_000020_create_properties_table.php` | `properties` |
| `2026_06_11_000030_create_rooms_table.php` | `rooms` |
| `2026_06_11_000040_create_room_images_table.php` | `room_images` |
| `2026_06_11_000050_create_tenancies_table.php` | `tenancies` |
| `2026_06_11_000060_create_invoices_table.php` | `invoices` |
| `2026_06_11_000070_create_invoice_items_table.php` | `invoice_items` |
| `2026_06_11_000080_create_payments_table.php` | `payments` |
| `2026_06_11_000090_create_messages_table.php` | `messages` |

---

### Tahap 3 — Model (Representasi Tabel)

> Setiap model = satu tabel. Di sini juga didefinisikan relasi antar tabel.

| File | Tabel | Relasi penting |
|------|-------|----------------|
| `app/Models/User.php` | `users` | `hasMany(Property)`, `hasMany(Tenancy)` |
| `app/Models/Property.php` | `properties` | `belongsTo(User)`, `hasMany(Room)` |
| `app/Models/Room.php` | `rooms` | `belongsTo(Property)`, `hasMany(Tenancy)` |
| `app/Models/Tenancy.php` | `tenancies` | `belongsTo(Room)`, `belongsTo(User)`, `hasMany(Invoice)` |
| `app/Models/Invoice.php` | `invoices` | `belongsTo(Tenancy)`, `hasMany(InvoiceItem)`, `hasOne(Payment)` |
| `app/Models/InvoiceItem.php` | `invoice_items` | `belongsTo(Invoice)` |
| `app/Models/Payment.php` | `payments` | `belongsTo(Invoice)` |
| `app/Models/Message.php` | `messages` | `belongsTo(Tenancy)`, `belongsTo(User, 'sender_id')` |
| `app/Models/RoomImage.php` | `room_images` | `belongsTo(Room)` |

---

### Tahap 4 — Routes & Controllers

> **Mulai dari routes** — ini peta semua endpoint API yang tersedia.

| File | Fungsi |
|------|--------|
| `backend/routes/api.php` | **Pintu masuk semua request.** Daftar semua endpoint: `GET /api/properties`, `POST /api/invoices`, dll. |
| `app/Http/Controllers/Api/AuthController.php` | Register, login, logout, get user (`/api/auth/...`) |
| `app/Http/Controllers/Api/DashboardController.php` | Data statistik untuk dashboard owner |
| `app/Http/Controllers/Api/PropertyController.php` | CRUD gedung kos |
| `app/Http/Controllers/Api/RoomController.php` | CRUD kamar |
| `app/Http/Controllers/Api/TenancyController.php` | CRUD kontrak sewa |
| `app/Http/Controllers/Api/InvoiceController.php` | CRUD tagihan |
| `app/Http/Controllers/Api/PaymentController.php` | Buat transaksi Midtrans, terima webhook |
| `app/Http/Controllers/Api/MessageController.php` | Kirim & ambil pesan chat |
| `app/Http/Controllers/Api/AiController.php` | Proxy ke Groq API untuk AI assistant |

---

### Tahap 5 — Fitur Tambahan

| File | Fungsi |
|------|--------|
| `app/Console/Commands/GenerateMonthlyInvoices.php` | Otomatis buat tagihan tiap awal bulan (cron job) |
| `app/Console/Commands/MarkOverdueInvoices.php` | Tandai tagihan jatuh tempo sebagai `overdue` |
| `app/Console/Commands/SendInvoiceReminders.php` | Kirim reminder ke penghuni yang belum bayar |
| `app/Jobs/SendInvoiceReminderJob.php` | Background job untuk kirim email |
| `app/Mail/InvoiceReminderMail.php` | Template email reminder tagihan |
| `app/Policies/PropertyPolicy.php` | Aturan: owner hanya bisa edit property miliknya |
| `app/Policies/InvoicePolicy.php` | Aturan: owner buat, tenant hanya lihat |

---

## Alur Data Lengkap

```
Pengguna buka browser
    ↓
Next.js (frontend) — render halaman, tampilkan UI
    ↓  HTTP request ke /api/...
Laravel (backend) — routes/api.php
    ↓
Controller — validasi, logika bisnis
    ↓
Model — baca/tulis database
    ↓
MySQL — simpan data permanen
```

---

## Urutan Membaca yang Disarankan

1. **`frontend/types/index.ts`** — pahami bentuk semua data
2. **`frontend/lib/mock.ts`** — lihat contoh data nyata
3. **`backend/routes/api.php`** — lihat endpoint apa saja yang ada
4. **`backend/database/migrations/`** — pahami struktur tabel (urut dari atas)
5. **`backend/app/Models/`** — lihat relasi antar tabel
6. **`frontend/app/owner/dashboard/page.tsx`** — halaman paling kompleks, paling banyak konsepnya
7. **`frontend/components/layout/AppShell.tsx`** — pahami struktur layout dashboard
