<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Tenancy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    private function getOtherPartyId(Tenancy $tenancy, int $userId): int
    {
        if ($userId === $tenancy->tenant_id) {
            return $tenancy->room->property->owner_id;
        }

        return $tenancy->tenant_id;
    }

    private function userIsPartOfTenancy(int $userId, Tenancy $tenancy): bool
    {
        return $userId === $tenancy->tenant_id
            || $userId === $tenancy->room->property->owner_id;
    }

    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'tenancy_id' => 'required|exists:tenancies,id',
        ]);

        $tenancy = Tenancy::with('room.property')->findOrFail($request->tenancy_id);
        $userId  = Auth::id();

        if (!$this->userIsPartOfTenancy($userId, $tenancy)) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        $messages = Message::where('tenancy_id', $tenancy->id)
            ->with(['sender', 'receiver'])
            ->orderBy('created_at')
            ->get();

        return response()->json($messages);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'tenancy_id' => 'required|exists:tenancies,id',
            'body'       => 'required|string',
        ]);

        $tenancy = Tenancy::with('room.property')->findOrFail($data['tenancy_id']);
        $userId  = Auth::id();

        if (!$this->userIsPartOfTenancy($userId, $tenancy)) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        $receiverId = $this->getOtherPartyId($tenancy, $userId);

        $message = Message::create([
            'tenancy_id'  => $tenancy->id,
            'sender_id'   => $userId,
            'receiver_id' => $receiverId,
            'body'        => $data['body'],
        ]);

        $message->load('sender', 'receiver');

        return response()->json($message, 201);
    }

    public function markRead(Request $request): JsonResponse
    {
        $request->validate([
            'tenancy_id' => 'required|exists:tenancies,id',
        ]);

        $tenancy = Tenancy::with('room.property')->findOrFail($request->tenancy_id);
        $userId  = Auth::id();

        if (!$this->userIsPartOfTenancy($userId, $tenancy)) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        $updated = Message::where('tenancy_id', $tenancy->id)
            ->where('receiver_id', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['message' => "{$updated} pesan ditandai telah dibaca."]);
    }
}
