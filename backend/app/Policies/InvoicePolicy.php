<?php

namespace App\Policies;

use App\Models\Invoice;
use App\Models\User;

class InvoicePolicy
{
    private function isOwnerOfInvoice(User $user, Invoice $invoice): bool
    {
        return $user->id === $invoice->tenancy->room->property->owner_id;
    }

    private function isTenantOfInvoice(User $user, Invoice $invoice): bool
    {
        return $user->id === $invoice->tenancy->tenant_id;
    }

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Invoice $invoice): bool
    {
        return $this->isOwnerOfInvoice($user, $invoice) || $this->isTenantOfInvoice($user, $invoice);
    }

    public function create(User $user): bool
    {
        return $user->isOwner();
    }

    public function update(User $user, Invoice $invoice): bool
    {
        return $this->isOwnerOfInvoice($user, $invoice);
    }
}
