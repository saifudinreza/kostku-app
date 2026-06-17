<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pengingat Tagihan KostKu</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,.1); }
        .header { background: #4F46E5; color: #fff; padding: 24px 32px; }
        .header h1 { margin: 0; font-size: 22px; }
        .body { padding: 32px; }
        .body p { color: #374151; line-height: 1.6; }
        .detail-box { background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 6px; padding: 16px 20px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 6px 0; color: #374151; }
        .detail-label { font-weight: 600; }
        .badge { display: inline-block; background: #FEF3C7; color: #92400E; border-radius: 12px; padding: 4px 12px; font-size: 14px; font-weight: 600; }
        .badge.urgent { background: #FEE2E2; color: #991B1B; }
        .footer { background: #F9FAFB; padding: 16px 32px; text-align: center; color: #9CA3AF; font-size: 13px; border-top: 1px solid #E5E7EB; }
        .cta { display: block; width: fit-content; margin: 20px auto; background: #4F46E5; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: 600; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>KostKu — Pengingat Tagihan</h1>
        </div>
        <div class="body">
            <p>Halo, <strong>{{ $tenancy->tenant->name ?? 'Penyewa' }}</strong>!</p>
            <p>
                Ini adalah pengingat bahwa Anda memiliki tagihan sewa yang akan jatuh tempo dalam
                <span class="badge {{ $daysUntilDue <= 1 ? 'urgent' : '' }}">{{ $daysUntilDue }} hari lagi</span>.
            </p>

            <div class="detail-box">
                <div class="detail-row">
                    <span class="detail-label">Nomor Invoice</span>
                    <span>{{ $invoice->invoice_number }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Kamar</span>
                    <span>{{ $tenancy->room->room_number ?? '-' }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Periode</span>
                    <span>{{ str_pad($invoice->period_month, 2, '0', STR_PAD_LEFT) }}/{{ $invoice->period_year }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Total Tagihan</span>
                    <span><strong>Rp {{ number_format($invoice->total_amount, 0, ',', '.') }}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Jatuh Tempo</span>
                    <span>{{ \Carbon\Carbon::parse($invoice->due_date)->translatedFormat('d F Y') }}</span>
                </div>
            </div>

            <p>Harap segera melakukan pembayaran sebelum tanggal jatuh tempo untuk menghindari denda.</p>

            <a href="{{ env('FRONTEND_URL', 'http://localhost:3000') }}/tenant/invoices/{{ $invoice->id }}" class="cta">
                Bayar Sekarang
            </a>

            <p style="color:#6B7280; font-size:13px;">Jika Anda sudah melakukan pembayaran, abaikan email ini.</p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} KostKu. Semua hak dilindungi.
        </div>
    </div>
</body>
</html>
