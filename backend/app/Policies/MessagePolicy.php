<?php

namespace App\Policies;

use App\Models\Message;
use App\Models\Tenancy;
use App\Models\User;

class MessagePolicy
{
    private function isPartOfTenancy(User $user, Tenancy $tenancy): bool
    {
        return $user->id === $tenancy->tenant_id
            || $user->id === $tenancy->room->property->owner_id;
    }

    public function viewAny(User $user, Tenancy $tenancy): bool
    {
        return $this->isPartOfTenancy($user, $tenancy);
    }

    public function create(User $user, Tenancy $tenancy): bool
    {
        return $this->isPartOfTenancy($user, $tenancy);
    }
}
