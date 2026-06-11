<?php

namespace App\Jobs;

use App\Mail\InvoiceReminderMail;
use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendInvoiceReminderJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Invoice $invoice,
        public int $daysUntilDue,
    ) {}

    public function handle(): void
    {
        $tenancy = $this->invoice->tenancy->load('tenant', 'room.property');
        $tenant  = $tenancy->tenant;

        if (!$tenant || !$tenant->email) {
            return;
        }

        Mail::to($tenant->email)->send(
            new InvoiceReminderMail($tenancy, $this->invoice, $this->daysUntilDue)
        );
    }
}
