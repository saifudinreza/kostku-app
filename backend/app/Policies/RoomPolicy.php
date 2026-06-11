<?php

namespace App\Policies;

use App\Models\Room;
use App\Models\User;

class RoomPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isOwner();
    }

    public function view(User $user, Room $room): bool
    {
        return $user->id === $room->property->owner_id;
    }

    public function create(User $user): bool
    {
        return $user->isOwner();
    }

    public function update(User $user, Room $room): bool
    {
        return $user->id === $room->property->owner_id;
    }

    public function delete(User $user, Room $room): bool
    {
        return $user->id === $room->property->owner_id;
    }
}
