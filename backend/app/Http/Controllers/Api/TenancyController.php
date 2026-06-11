<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\Tenancy;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TenancyController extends Controller
{
    public function index(): JsonResponse
    {
        $user = Auth::user();

        if ($user->isOwner()) {
            $propertyIds = $user->properties()->pluck('id');
            $tenancies   = Tenancy::whereHas('room', fn($q) => $q->whereIn('property_id', $propertyIds))
                ->with(['tenant', 'room.property'])
                ->get();
        } else {
            $tenancies = Tenancy::where('tenant_id', $user->id)
                ->with(['room.property'])
                ->get();
        }

        return response()->json($tenancies);
    }

    public function store(Request $request): JsonResponse
    {
        if (!Auth::user()->isOwner()) {
            return response()->json(['message' => 'Akses ditolak. Hanya pemilik kost.'], 403);
        }

        $data = $request->validate([
            'tenant_id'    => 'required_without:tenant_email|nullable|exists:users,id',
            'tenant_email' => 'required_without:tenant_id|nullable|email',
            'room_id'      => 'required|exists:rooms,id',
            'start_date'   => 'required|date',
            'end_date'     => 'nullable|date|after:start_date',
            'deposit'      => 'nullable|integer|min:0',
        ]);

        // Cari tenant lewat email kalau tenant_id tidak diberikan.
        if (empty($data['tenant_id']) && !empty($data['tenant_email'])) {
            $tenant = User::where('email', $data['tenant_email'])->first();
            if (!$tenant) {
                return response()->json(['message' => 'Penghuni dengan email tersebut tidak ditemukan. Minta penghuni daftar akun dulu.'], 422);
            }
            $data['tenant_id'] = $tenant->id;
        } else {
            $tenant = User::findOrFail($data['tenant_id']);
        }

        $room = Room::findOrFail($data['room_id']);

        if ($room->status === 'occupied') {
            return response()->json(['message' => 'Kamar sudah terisi.'], 422);
        }

        if ($tenant->role !== 'tenant') {
            return response()->json(['message' => 'User yang dipilih bukan penghuni (role harus tenant).'], 422);
        }

        $tenancy = Tenancy::create([
            'room_id'    => $data['room_id'],
            'tenant_id'  => $data['tenant_id'],
            'start_date' => $data['start_date'],
            'end_date'   => $data['end_date'] ?? null,
            'deposit'    => $data['deposit'] ?? null,
            'status'     => 'active',
        ]);

        $room->update(['status' => 'occupied']);

        $tenancy->load('tenant', 'room.property');

        return response()->json($tenancy, 201);
    }

    public function update(Request $request, Tenancy $tenancy): JsonResponse
    {
        if (!Auth::user()->isOwner()) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        $data = $request->validate([
            'start_date' => 'sometimes|date',
            'end_date'   => 'nullable|date',
            'deposit'    => 'nullable|integer|min:0',
        ]);

        $tenancy->update($data);

        return response()->json($tenancy->load('tenant', 'room.property'));
    }

    public function end(Tenancy $tenancy): JsonResponse
    {
        if (!Auth::user()->isOwner()) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        $tenancy->update([
            'status'   => 'ended',
            'end_date' => now()->toDateString(),
        ]);

        $tenancy->room->update(['status' => 'available']);

        return response()->json(['message' => 'Sewa berhasil diakhiri.', 'tenancy' => $tenancy]);
    }
}
