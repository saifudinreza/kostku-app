/**
 * Daftar metode pembayaran yang ditampilkan di halaman tagihan.
 *
 * `midtransType` & `midtransCode` adalah titik integrasi nanti: saat membuat
 * transaksi Midtrans Snap, nilai ini dipetakan ke `enabled_payments`
 * (lihat https://docs.midtrans.com/reference/enabled-payments). Untuk sekarang
 * frontend hanya menampilkan UI; belum ada panggilan API.
 */
export type PaymentGroup = "ewallet" | "va" | "qris";

export interface PaymentMethod {
  id: string;
  label: string;
  /** Path logo di /public/payments. Ganti dengan aset resmi saat produksi. */
  logo: string;
  group: PaymentGroup;
  /** Kode channel Midtrans (untuk enabled_payments). */
  midtransCode: string;
}

export const PAYMENT_GROUPS: { id: PaymentGroup; label: string }[] = [
  { id: "ewallet", label: "E-Wallet" },
  { id: "va", label: "Virtual Account / Transfer Bank" },
  { id: "qris", label: "QRIS" },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "gopay", label: "GoPay", logo: "/payments/gopay.svg", group: "ewallet", midtransCode: "gopay" },
  { id: "ovo", label: "OVO", logo: "/payments/ovo.svg", group: "ewallet", midtransCode: "ovo" },
  { id: "dana", label: "DANA", logo: "/payments/dana.svg", group: "ewallet", midtransCode: "dana" },
  { id: "shopeepay", label: "ShopeePay", logo: "/payments/shopeepay.svg", group: "ewallet", midtransCode: "shopeepay" },
  { id: "bca", label: "BCA Virtual Account", logo: "/payments/bca.svg", group: "va", midtransCode: "bca_va" },
  { id: "mandiri", label: "Mandiri Bill Payment", logo: "/payments/mandiri.svg", group: "va", midtransCode: "echannel" },
  { id: "bni", label: "BNI Virtual Account", logo: "/payments/bni.svg", group: "va", midtransCode: "bni_va" },
  { id: "bri", label: "BRI Virtual Account", logo: "/payments/bri.svg", group: "va", midtransCode: "bri_va" },
  { id: "qris", label: "QRIS", logo: "/payments/qris.svg", group: "qris", midtransCode: "qris" },
];
