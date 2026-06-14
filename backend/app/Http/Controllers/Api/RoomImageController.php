<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\RoomImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RoomImageController extends Controller
{
    public function store(Request $request, Room $room): JsonResponse
    {
        $this->authorize('update', $room);

        $request->validate([
            'image' => 'required|image|max:10240',
        ]);

        $path = $request->file('image')->store('room-images', 'public');

        $isPrimary = $room->images()->count() === 0;

        $image = $room->images()->create([
            'image_path' => $path,
            'is_primary' => $isPrimary,
        ]);

        return response()->json($image, 201);
    }

    public function destroy(RoomImage $image): JsonResponse
    {
        $this->authorize('update', $image->room);

        Storage::disk('public')->delete($image->image_path);
        $wasPrimary = $image->is_primary;
        $roomId     = $image->room_id;

        $image->delete();

        // Assign primary ke foto pertama jika foto yang dihapus adalah primary
        if ($wasPrimary) {
            RoomImage::where('room_id', $roomId)->oldest()->first()?->update(['is_primary' => true]);
        }

        return response()->json(['message' => 'Foto dihapus.']);
    }

    public function setPrimary(RoomImage $image): JsonResponse
    {
        $this->authorize('update', $image->room);

        RoomImage::where('room_id', $image->room_id)->update(['is_primary' => false]);
        $image->update(['is_primary' => true]);

        return response()->json($image);
    }
}
