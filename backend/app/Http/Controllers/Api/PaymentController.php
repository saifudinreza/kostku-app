<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Tenancy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();

        $query = Payment::with(['invoice.tenancy.room.property', 'invoice.tenancy.tenant']);

        if ($user->isOwner()) {
            $propertyIds = $user->properties()->pluck('id');
            $tenancyIds  = Tenancy::whereHas('room', fn($q) => $q->whereIn('property_id', $propertyIds))->pluck('id');
            $invoiceIds  = Invoice::whereIn('tenancy_id', $tenancyIds)->pluck('id');
            $query->whereIn('invoice_id', $invoiceIds);
        } else {
            $tenancyIds = $user->tenancies()->pluck('id');
            $invoiceIds = Invoice::whereIn('tenancy_id', $tenancyIds)->pluck('id');
            $query->whereIn('invoice_id', $invoiceIds);
        }

        return response()->json($query->latest()->get());
    }

    public function createSnapToken(Request $request, Invoice $invoice): JsonResponse
    {
        $user = Auth::user();

        if ($user->isOwner()) {
            return response()->json(['message' => 'Hanya penyewa yang bisa melakukan pembayaran.'], 403);
        }

        if ($invoice->status === 'paid') {
            return response()->json(['message' => 'Invoice sudah dibayar.'], 422);
        }

        $serverKey  = env('MIDTRANS_SERVER_KEY', '');
        $orderId    = 'KOSTKU-' . $invoice->id . '-' . time();

        // Upsert payment record
        $payment = Payment::updateOrCreate(
            ['invoice_id' => $invoice->id],
            [
                'midtrans_order_id' => $orderId,
                'amount'            => $invoice->total_amount,
                'status'            => 'pending',
            ]
        );

        // Update invoice to pending
        $invoice->update(['status' => 'pending']);

        if (empty($serverKey)) {
            // Return mock token for development
            $snapToken = 'mock-snap-token-' . $invoice->id . '-' . time();
            $payment->update(['snap_token' => $snapToken]);

            return response()->json([
                'snap_token' => $snapToken,
                'client_key' => env('MIDTRANS_CLIENT_KEY', 'mock-client-key'),
                'order_id'   => $orderId,
                'note'       => 'Mock token — Midtrans belum dikonfigurasi.',
            ]);
        }

        $isProduction = env('MIDTRANS_IS_PRODUCTION', false);
        $baseUrl      = $isProduction
            ? 'https://app.midtrans.com/snap/v1/transactions'
            : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

        // enabled_payments = array kode channel dari frontend (mis. ["gopay"]).
        // Kalau tidak dikirim, Midtrans tampilkan semua metode yang aktif.
        $enabledPayments = $request->input('enabled_payments');

        $payload = [
            'transaction_details' => [
                'order_id'     => $orderId,
                'gross_amount' => $invoice->total_amount,
            ],
            'customer_details' => [
                'first_name' => $invoice->tenancy->tenant->name ?? '',
                'email'      => $invoice->tenancy->tenant->email ?? '',
            ],
        ];

        if (!empty($enabledPayments) && is_array($enabledPayments)) {
            $payload['enabled_payments'] = $enabledPayments;
        }

        $response = Http::withBasicAuth($serverKey, '')->post($baseUrl, $payload);

        if ($response->failed()) {
            return response()->json(['message' => 'Gagal membuat snap token.', 'error' => $response->body()], 502);
        }

        $snapToken = $response->json('token');
        $payment->update(['snap_token' => $snapToken]);

        return response()->json([
            'snap_token' => $snapToken,
            'client_key' => env('MIDTRANS_CLIENT_KEY'),
            'order_id'   => $orderId,
        ]);
    }

    public function webhook(Request $request): JsonResponse
    {
        $serverKey  = env('MIDTRANS_SERVER_KEY', '');
        $orderId    = $request->input('order_id');
        $statusCode = $request->input('status_code');
        $grossAmount = $request->input('gross_amount');
        $signatureKey = $request->input('signature_key');

        // Validate signature
        if (!empty($serverKey)) {
            $expected = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);
            if ($expected !== $signatureKey) {
                return response()->json(['message' => 'Signature tidak valid.'], 403);
            }
        }

        $payment = Payment::where('midtrans_order_id', $orderId)->first();
        if (!$payment) {
            return response()->json(['message' => 'Payment tidak ditemukan.'], 404);
        }

        $transactionStatus = $request->input('transaction_status');
        $fraudStatus       = $request->input('fraud_status', 'accept');

        if ($transactionStatus === 'capture' && $fraudStatus === 'accept') {
            $payment->update(['status' => 'success', 'paid_at' => now(), 'payment_method' => $request->input('payment_type')]);
            $payment->invoice->update(['status' => 'paid']);
        } elseif ($transactionStatus === 'settlement') {
            $payment->update(['status' => 'success', 'paid_at' => now(), 'payment_method' => $request->input('payment_type')]);
            $payment->invoice->update(['status' => 'paid']);
        } elseif (in_array($transactionStatus, ['cancel', 'deny', 'expire'])) {
            $payment->update(['status' => 'failed']);
            $payment->invoice->update(['status' => 'unpaid']);
        } elseif ($transactionStatus === 'pending') {
            $payment->update(['status' => 'pending']);
        }

        Log::info('Midtrans webhook', ['order_id' => $orderId, 'status' => $transactionStatus]);

        return response()->json(['message' => 'OK']);
    }
}
