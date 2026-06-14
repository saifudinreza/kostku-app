<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Tenancy;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportController extends Controller
{
    public function invoicesCsv(Request $request): StreamedResponse
    {
        $user        = Auth::user();
        $propertyIds = $user->properties()->pluck('id');
        $tenancyIds  = Tenancy::whereHas('room', fn($q) => $q->whereIn('property_id', $propertyIds))->pluck('id');

        $invoices = Invoice::whereIn('tenancy_id', $tenancyIds)
            ->with(['tenancy.tenant', 'tenancy.room.property'])
            ->latest()
            ->get();

        $filename = 'tagihan-' . now()->format('Ymd') . '.csv';

        return response()->streamDownload(function () use ($invoices) {
            $handle = fopen('php://output', 'w');

            // BOM untuk Excel agar baca UTF-8 dengan benar
            fwrite($handle, "\xEF\xBB\xBF");

            fputcsv($handle, ['No. Invoice', 'Penghuni', 'Properti', 'Kamar', 'Periode', 'Jatuh Tempo', 'Total', 'Status']);

            foreach ($invoices as $inv) {
                fputcsv($handle, [
                    $inv->invoice_number,
                    $inv->tenancy?->tenant?->name ?? '-',
                    $inv->tenancy?->room?->property?->name ?? '-',
                    $inv->tenancy?->room?->room_number ?? '-',
                    str_pad($inv->period_month, 2, '0', STR_PAD_LEFT) . '/' . $inv->period_year,
                    $inv->due_date,
                    $inv->total_amount,
                    $inv->status,
                ]);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    public function paymentsCsv(Request $request): StreamedResponse
    {
        $user        = Auth::user();
        $propertyIds = $user->properties()->pluck('id');
        $tenancyIds  = Tenancy::whereHas('room', fn($q) => $q->whereIn('property_id', $propertyIds))->pluck('id');
        $invoiceIds  = Invoice::whereIn('tenancy_id', $tenancyIds)->pluck('id');

        $payments = Payment::whereIn('invoice_id', $invoiceIds)
            ->with(['invoice.tenancy.tenant', 'invoice.tenancy.room'])
            ->latest()
            ->get();

        $filename = 'pembayaran-' . now()->format('Ymd') . '.csv';

        return response()->streamDownload(function () use ($payments) {
            $handle = fopen('php://output', 'w');

            fwrite($handle, "\xEF\xBB\xBF");

            fputcsv($handle, ['Order ID', 'No. Invoice', 'Penghuni', 'Kamar', 'Metode', 'Nominal', 'Tanggal Bayar', 'Status']);

            foreach ($payments as $p) {
                fputcsv($handle, [
                    $p->midtrans_order_id,
                    $p->invoice?->invoice_number ?? '-',
                    $p->invoice?->tenancy?->tenant?->name ?? '-',
                    $p->invoice?->tenancy?->room?->room_number ?? '-',
                    $p->payment_method ?? '-',
                    $p->amount,
                    $p->paid_at ?? '-',
                    $p->status,
                ]);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    /**
     * Halaman HTML bersih untuk print-to-PDF dari browser.
     * Tidak butuh package PDF — pengguna tinggal Ctrl+P → Simpan sebagai PDF.
     */
    public function invoicesPrintView(Request $request): Response
    {
        $user        = Auth::user();
        $propertyIds = $user->properties()->pluck('id');
        $tenancyIds  = Tenancy::whereHas('room', fn($q) => $q->whereIn('property_id', $propertyIds))->pluck('id');

        $invoices = Invoice::whereIn('tenancy_id', $tenancyIds)
            ->with(['tenancy.tenant', 'tenancy.room.property'])
            ->latest()
            ->get();

        $totalPaid   = $invoices->where('status', 'paid')->sum('total_amount');
        $totalUnpaid = $invoices->whereIn('status', ['unpaid', 'overdue', 'pending'])->sum('total_amount');
        $generatedAt = now()->locale('id')->translatedFormat('d F Y, H:i');

        $rows = '';
        foreach ($invoices as $inv) {
            $statusLabel = match ($inv->status) {
                'paid'    => 'Lunas',
                'unpaid'  => 'Belum Bayar',
                'overdue' => 'Jatuh Tempo',
                'pending' => 'Menunggu',
                default   => $inv->status,
            };
            $statusColor = match ($inv->status) {
                'paid'    => '#15803d',
                'overdue' => '#dc2626',
                'pending' => '#d97706',
                default   => '#505267',
            };
            $period = str_pad($inv->period_month, 2, '0', STR_PAD_LEFT) . '/' . $inv->period_year;
            $amount = 'Rp ' . number_format($inv->total_amount, 0, ',', '.');

            $rows .= "<tr>
                <td>{$inv->invoice_number}</td>
                <td>" . e($inv->tenancy?->tenant?->name ?? '-') . "</td>
                <td>" . e($inv->tenancy?->room?->property?->name ?? '-') . "</td>
                <td>Kamar " . e($inv->tenancy?->room?->room_number ?? '-') . "</td>
                <td>{$period}</td>
                <td>{$inv->due_date}</td>
                <td style='text-align:right'>{$amount}</td>
                <td style='color:{$statusColor};font-weight:600'>{$statusLabel}</td>
            </tr>";
        }

        $html = <<<HTML
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Laporan Tagihan KostKu</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; font-size: 13px; color: #2f3148; padding: 32px; }
  h1 { font-size: 20px; margin-bottom: 4px; }
  .meta { color: #797d99; font-size: 12px; margin-bottom: 20px; }
  .summary { display: flex; gap: 24px; margin-bottom: 24px; }
  .summary-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 20px; min-width: 160px; }
  .summary-card .label { font-size: 11px; color: #797d99; text-transform: uppercase; letter-spacing: .5px; }
  .summary-card .value { font-size: 18px; font-weight: 700; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #f3f4f6; text-align: left; padding: 8px 10px; font-size: 11px; text-transform: uppercase; letter-spacing: .4px; color: #6b7280; }
  td { padding: 8px 10px; border-bottom: 1px solid #f3f4f6; }
  tr:last-child td { border-bottom: none; }
  @media print { body { padding: 16px; } }
</style>
</head>
<body>
<h1>Laporan Tagihan KostKu</h1>
<p class="meta">Digenerate pada {$generatedAt} · {$invoices->count()} tagihan</p>
<div class="summary">
  <div class="summary-card">
    <div class="label">Total Lunas</div>
    <div class="value" style="color:#15803d">Rp {$this->fmt($totalPaid)}</div>
  </div>
  <div class="summary-card">
    <div class="label">Belum Dibayar</div>
    <div class="value" style="color:#dc2626">Rp {$this->fmt($totalUnpaid)}</div>
  </div>
</div>
<table>
  <thead>
    <tr>
      <th>No. Invoice</th><th>Penghuni</th><th>Properti</th><th>Kamar</th>
      <th>Periode</th><th>Jatuh Tempo</th><th>Total</th><th>Status</th>
    </tr>
  </thead>
  <tbody>{$rows}</tbody>
</table>
<script>window.onload = () => window.print();</script>
</body>
</html>
HTML;

        return response($html, 200, ['Content-Type' => 'text/html; charset=UTF-8']);
    }

    private function fmt(float|int $n): string
    {
        return number_format($n, 0, ',', '.');
    }
}
