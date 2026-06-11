<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PropertyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Property::class);

        $properties = Property::withCount('rooms')
            ->forOwner(Auth::id())
            ->get();

        return response()->json($properties);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Property::class);

        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'address'     => 'required|string',
            'city'        => 'required|string|max:100',
            'description' => 'nullable|string',
        ]);

        $data['owner_id'] = Auth::id();
        $property = Property::create($data);

        return response()->json($property, 201);
    }

    public function show(Property $property): JsonResponse
    {
        $this->authorize('view', $property);

        $property->load('rooms');

        return response()->json($property);
    }

    public function update(Request $request, Property $property): JsonResponse
    {
        $this->authorize('update', $property);

        $data = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'address'     => 'sometimes|string',
            'city'        => 'sometimes|string|max:100',
            'description' => 'nullable|string',
        ]);

        $property->update($data);

        return response()->json($property);
    }

    public function destroy(Property $property): JsonResponse
    {
        $this->authorize('delete', $property);

        $property->delete();

        return response()->json(['message' => 'Properti berhasil dihapus.']);
    }
}
