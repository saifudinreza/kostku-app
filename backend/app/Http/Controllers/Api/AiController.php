<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Tenancy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class AiController extends Controller
{
    private function callGroq(string $systemPrompt, string $userMessage): ?string
    {
        $apiKey = env('GROQ_API_KEY', '');

        if (empty($apiKey)) {
            return null;
        }

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$apiKey}",
            'Content-Type'  => 'application/json',
        ])->post('https://api.groq.com/openai/v1/chat/completions', [
            'model'    => env('GROQ_MODEL', 'llama-3.3-70b-versatile'),
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user',   'content' => $userMessage],
            ],
            'max_tokens' => 800,
        ]);

        if ($response->failed()) {
            return null;
        }

        return $response->json('choices.0.message.content');
    }

    public function invoiceChat(Request $request): JsonResponse
    {
        $user = Auth::user();

        if ($user->isOwner()) {
            return response()->json(['message' => 'Fitur ini hanya untuk penyewa.'], 403);
        }

        $request->validate([
            'message' => 'required|string',
        ]);

        $tenancyIds = $user->tenancies()->pluck('id');
        $invoices   = Invoice::whereIn('tenancy_id', $tenancyIds)
            ->with(['items', 'payment'])
            ->latest()
            ->take(6)
            ->get();

        $invoiceContext = $invoices->map(fn($inv) => [
            'invoice_number' => $inv->invoice_number,
            'period'         => "{$inv->period_month}/{$inv->period_year}",
            'total_amount'   => $inv->total_amount,
            'status'         => $inv->status,
            'due_date'       => $inv->due_date,
        ])->toJson(JSON_PRETTY_PRINT);

        $system = "Kamu adalah asisten keuangan KostKu. Bantu penyewa memahami tagihan mereka. Berikut data 6 tagihan terakhir mereka:\n{$invoiceContext}\nJawab dalam Bahasa Indonesia, singkat dan membantu.";

        $answer = $this->callGroq($system, $request->message);

        if ($answer === null) {
            return response()->json([
                'answer' => 'Maaf, layanan AI sedang tidak tersedia. Silakan hubungi pemilik kost untuk informasi tagihan.',
            ]);
        }

        return response()->json(['answer' => $answer]);
    }

    public function financialInsight(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user->isOwner()) {
            return response()->json(['message' => 'Fitur ini hanya untuk pemilik kost.'], 403);
        }

        $request->validate([
            'message' => 'nullable|string',
        ]);

        $propertyIds = $user->properties()->pluck('id');
        $tenancyIds  = Tenancy::whereHas('room', fn($q) => $q->whereIn('property_id', $propertyIds))->pluck('id');

        // Last 6 months revenue
        $revenueData = [];
        for ($i = 5; $i >= 0; $i--) {
            $date  = now()->subMonths($i);
            $total = Invoice::whereIn('tenancy_id', $tenancyIds)
                ->where('status', 'paid')
                ->where('period_month', $date->month)
                ->where('period_year', $date->year)
                ->sum('total_amount');

            $revenueData[] = [
                'period'  => $date->format('M Y'),
                'revenue' => $total,
            ];
        }

        $totalRooms    = \App\Models\Room::whereIn('property_id', $propertyIds)->count();
        $occupiedRooms = \App\Models\Room::whereIn('property_id', $propertyIds)->where('status', 'occupied')->count();
        $occupancyRate = $totalRooms > 0 ? round(($occupiedRooms / $totalRooms) * 100, 1) : 0;

        $context = json_encode([
            'revenue_last_6_months' => $revenueData,
            'total_rooms'           => $totalRooms,
            'occupied_rooms'        => $occupiedRooms,
            'occupancy_rate'        => "{$occupancyRate}%",
        ], JSON_PRETTY_PRINT);

        $system  = "Kamu adalah konsultan keuangan properti KostKu. Berikan insight bisnis berdasarkan data berikut:\n{$context}\nJawab dalam Bahasa Indonesia, analitis dan actionable.";
        $message = $request->input('message', 'Berikan ringkasan performa keuangan saya dan saran untuk meningkatkan pendapatan.');

        $answer = $this->callGroq($system, $message);

        if ($answer === null) {
            return response()->json([
                'insight' => 'Layanan AI sedang tidak tersedia. Pastikan GROQ_API_KEY sudah dikonfigurasi.',
                'data'    => ['revenue' => $revenueData, 'occupancy_rate' => $occupancyRate],
            ]);
        }

        return response()->json([
            'insight' => $answer,
            'data'    => ['revenue' => $revenueData, 'occupancy_rate' => $occupancyRate],
        ]);
    }

    public function generateRoomDescription(Request $request): JsonResponse
    {
        if (!Auth::user()->isOwner()) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        $data = $request->validate([
            'room_number' => 'required|string',
            'floor'       => 'nullable|integer',
            'price'       => 'required|integer',
            'facilities'  => 'nullable|array',
            'facilities.*' => 'string',
            'size'        => 'nullable|string',
        ]);

        $facilitiesList = implode(', ', $data['facilities'] ?? []);
        $prompt = "Buatkan deskripsi menarik untuk kamar kost nomor {$data['room_number']}"
            . ($data['floor'] ? " di lantai {$data['floor']}" : '')
            . " dengan harga sewa Rp " . number_format($data['price'], 0, ',', '.')
            . ($data['size'] ? ", ukuran {$data['size']}" : '')
            . ($facilitiesList ? ", fasilitas: {$facilitiesList}" : '')
            . ". Tulis dalam Bahasa Indonesia, 2-3 kalimat, singkat dan menarik untuk calon penyewa.";

        $description = $this->callGroq(
            'Kamu adalah copywriter iklan properti kost Indonesia.',
            $prompt
        );

        if ($description === null) {
            $description = "Kamar {$data['room_number']} yang nyaman dan strategis. Tersedia dengan harga terjangkau dan fasilitas lengkap untuk mendukung aktivitas Anda sehari-hari.";
        }

        return response()->json(['description' => trim($description)]);
    }
}
