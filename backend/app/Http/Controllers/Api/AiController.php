<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Tenancy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiController extends Controller
{
    // -------------------------------------------------------------------------
    // Provider 1: Groq (cepat, gratis dengan limit harian)
    // Kembalikan null kalau gagal (key kosong, error, atau 429 rate limit).
    // -------------------------------------------------------------------------
    private function callGroq(string $systemPrompt, string $userMessage): ?string
    {
        $apiKey = env('GROQ_API_KEY', '');
        if (empty($apiKey)) return null;

        $response = Http::timeout(15)->withHeaders([
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

        // 429 = rate limit Groq habis → fallback ke OpenRouter
        if ($response->failed()) {
            Log::info('Groq failed (status ' . $response->status() . '), akan coba OpenRouter.');
            return null;
        }

        return $response->json('choices.0.message.content');
    }

    // -------------------------------------------------------------------------
    // Provider 2: OpenRouter (fallback, mendukung banyak model gratis)
    // Header HTTP-Referer & X-Title wajib agar OpenRouter melacak penggunaan.
    // -------------------------------------------------------------------------
    private function callOpenRouter(string $systemPrompt, string $userMessage): ?string
    {
        $apiKey = env('OPENROUTER_API_KEY', '');
        if (empty($apiKey)) return null;

        $response = Http::timeout(20)->withHeaders([
            'Authorization' => "Bearer {$apiKey}",
            'HTTP-Referer'  => env('APP_URL', 'http://localhost:8000'),
            'X-Title'       => 'KostKu',
            'Content-Type'  => 'application/json',
        ])->post('https://openrouter.ai/api/v1/chat/completions', [
            'model'    => env('OPENROUTER_MODEL', 'meta-llama/llama-3.3-70b-instruct:free'),
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user',   'content' => $userMessage],
            ],
            'max_tokens' => 800,
        ]);

        if ($response->failed()) {
            Log::warning('OpenRouter juga gagal (status ' . $response->status() . ').');
            return null;
        }

        return $response->json('choices.0.message.content');
    }

    // -------------------------------------------------------------------------
    // callAi — coba Groq dulu, kalau gagal auto-switch ke OpenRouter.
    // Semua endpoint di bawah memanggil method ini, bukan callGroq/callOpenRouter
    // secara langsung.
    // -------------------------------------------------------------------------
    private function callAi(string $systemPrompt, string $userMessage): ?string
    {
        $result = $this->callGroq($systemPrompt, $userMessage);

        if ($result === null) {
            $result = $this->callOpenRouter($systemPrompt, $userMessage);
        }

        return $result;
    }

    // -------------------------------------------------------------------------
    // POST /api/ai/invoice-chat — asisten tagihan untuk penyewa (tenant)
    // -------------------------------------------------------------------------
    public function invoiceChat(Request $request): JsonResponse
    {
        $user = Auth::user();

        if ($user->isOwner()) {
            return response()->json(['message' => 'Fitur ini hanya untuk penyewa.'], 403);
        }

        $request->validate(['message' => 'required|string|max:500']);

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

        $system = "Kamu adalah asisten keuangan KostKu untuk penyewa kost. "
            . "Bantu penyewa memahami tagihan mereka dengan ramah dan jelas. "
            . "Berikut data 6 tagihan terakhir mereka:\n{$invoiceContext}\n"
            . "Jawab dalam Bahasa Indonesia, singkat dan membantu. Jangan berikan informasi di luar data tagihan.";

        $answer = $this->callAi($system, $request->message);

        if ($answer === null) {
            return response()->json([
                'answer' => 'Maaf, layanan AI sedang tidak tersedia. Silakan hubungi pemilik kost langsung untuk informasi tagihan.',
            ]);
        }

        return response()->json(['answer' => trim($answer)]);
    }

    // -------------------------------------------------------------------------
    // POST /api/ai/financial-insight — konsultan keuangan untuk owner
    // -------------------------------------------------------------------------
    public function financialInsight(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user->isOwner()) {
            return response()->json(['message' => 'Fitur ini hanya untuk pemilik kost.'], 403);
        }

        $request->validate(['message' => 'nullable|string|max:500']);

        $propertyIds = $user->properties()->pluck('id');
        $tenancyIds  = Tenancy::whereHas('room', fn($q) => $q->whereIn('property_id', $propertyIds))->pluck('id');

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

        $system  = "Kamu adalah konsultan keuangan properti KostKu yang berpengalaman. "
            . "Berikan insight bisnis yang actionable berdasarkan data berikut:\n{$context}\n"
            . "Jawab dalam Bahasa Indonesia. Analitis, singkat (maks 3 paragraf), dan langsung ke poin.";

        $message = $request->input('message', 'Berikan ringkasan performa keuangan saya dan saran konkret untuk meningkatkan pendapatan.');

        $answer = $this->callAi($system, $message);

        if ($answer === null) {
            return response()->json([
                'answer' => 'Layanan AI sedang tidak tersedia. Pastikan GROQ_API_KEY atau OPENROUTER_API_KEY sudah dikonfigurasi di .env.',
                'data'   => ['revenue' => $revenueData, 'occupancy_rate' => $occupancyRate],
            ]);
        }

        return response()->json([
            'answer' => trim($answer),
            'data'   => ['revenue' => $revenueData, 'occupancy_rate' => $occupancyRate],
        ]);
    }

    // -------------------------------------------------------------------------
    // POST /api/ai/generate-room-description — buat deskripsi kamar otomatis
    // -------------------------------------------------------------------------
    public function generateRoomDescription(Request $request): JsonResponse
    {
        if (!Auth::user()->isOwner()) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        $data = $request->validate([
            'room_number'  => 'required|string',
            'floor'        => 'nullable|integer',
            'price'        => 'required|integer',
            'facilities'   => 'nullable|array',
            'facilities.*' => 'string',
            'size'         => 'nullable|string',
        ]);

        $facilitiesList = implode(', ', $data['facilities'] ?? []);
        $prompt = "Buatkan deskripsi menarik untuk kamar kost nomor {$data['room_number']}"
            . ($data['floor'] ? " di lantai {$data['floor']}" : '')
            . " dengan harga sewa Rp " . number_format($data['price'], 0, ',', '.')
            . ($data['size'] ? ", ukuran {$data['size']}" : '')
            . ($facilitiesList ? ", fasilitas: {$facilitiesList}" : '')
            . ". Tulis dalam Bahasa Indonesia, 2-3 kalimat, singkat dan menarik untuk calon penyewa.";

        $description = $this->callAi(
            'Kamu adalah copywriter iklan properti kost Indonesia yang berpengalaman.',
            $prompt
        );

        if ($description === null) {
            $description = "Kamar {$data['room_number']} yang nyaman dan strategis. "
                . "Tersedia dengan harga terjangkau dan fasilitas lengkap untuk mendukung aktivitas Anda sehari-hari.";
        }

        return response()->json(['description' => trim($description)]);
    }
}
