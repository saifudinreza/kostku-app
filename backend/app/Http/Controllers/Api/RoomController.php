<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\Room;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class RoomController extends Controller
{
    public function index(Request $request, Property $property): JsonResponse
    {
        $user = Auth::user();

        if ($user->isOwner()) {
            $this->authorize('view', $property);
        }

        $rooms = $property->rooms()->with(['images', 'activeTenancy.tenant'])->get();

        return response()->json($rooms);
    }

    public function allOwnerRooms(): JsonResponse
    {
        $user = Auth::user();

        $propertyIds = $user->isOwner()
            ? $user->properties()->pluck('id')
            : [];

        $rooms = Room::whereIn('property_id', $propertyIds)
            ->with(['property', 'images', 'activeTenancy.tenant'])
            ->get();

        return response()->json($rooms);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Room::class);

        $data = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'room_number' => 'required|string|max:50',
            'floor'       => 'nullable|integer',
            'price'       => 'required|integer|min:0',
            'status'      => 'in:available,occupied,maintenance',
            'description' => 'nullable|string',
        ]);

        $property = Property::findOrFail($data['property_id']);
        $this->authorize('update', $property);

        $room = Room::create($data);

        return response()->json($room, 201);
    }

    public function show(Room $room): JsonResponse
    {
        $room->load(['images', 'activeTenancy.tenant', 'property']);

        return response()->json($room);
    }

    public function update(Request $request, Room $room): JsonResponse
    {
        $this->authorize('update', $room);

        $data = $request->validate([
            'room_number' => 'sometimes|string|max:50',
            'floor'       => 'nullable|integer',
            'price'       => 'sometimes|integer|min:0',
            'status'      => 'sometimes|in:available,occupied,maintenance',
            'description' => 'nullable|string',
        ]);

        $room->update($data);

        return response()->json($room);
    }

    public function destroy(Room $room): JsonResponse
    {
        $this->authorize('delete', $room);

        $room->delete();

        return response()->json(['message' => 'Kamar berhasil dihapus.']);
    }

    public function generateDescription(Request $request): JsonResponse
    {
        $data = $request->validate([
            'room_number' => 'required|string',
            'floor'       => 'nullable|integer',
            'price'       => 'required|integer',
            'facilities'  => 'nullable|array',
            'facilities.*' => 'string',
            'size'        => 'nullable|string',
        ]);

        $groqKey = config('services.groq.api_key', env('GROQ_API_KEY'));

        if (empty($groqKey)) {
            return response()->json([
                'description' => "Kamar {$data['room_number']} yang nyaman dan strategis. Tersedia dengan fasilitas lengkap untuk mendukung aktivitas sehari-hari Anda.",
            ]);
        }

        $facilitiesList = implode(', ', $data['facilities'] ?? []);
        $prompt = "Buatkan deskripsi menarik untuk kamar kost nomor {$data['room_number']}"
            . ($data['floor'] ? " di lantai {$data['floor']}" : '')
            . " dengan harga sewa Rp " . number_format($data['price'], 0, ',', '.')
            . ($data['size'] ? ", ukuran {$data['size']}" : '')
            . ($facilitiesList ? ", fasilitas: {$facilitiesList}" : '')
            . ". Tulis dalam Bahasa Indonesia, 2-3 kalimat, singkat dan menarik.";

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$groqKey}",
            'Content-Type'  => 'application/json',
        ])->post('https://api.groq.com/openai/v1/chat/completions', [
            'model'    => env('GROQ_MODEL', 'llama-3.3-70b-versatile'),
            'messages' => [
                ['role' => 'user', 'content' => $prompt],
            ],
            'max_tokens' => 300,
        ]);

        if ($response->failed()) {
            return response()->json(['message' => 'Gagal menghubungi AI.'], 502);
        }

        $description = $response->json('choices.0.message.content', '');

        return response()->json(['description' => trim($description)]);
    }
}
