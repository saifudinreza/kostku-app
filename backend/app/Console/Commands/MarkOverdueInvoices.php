<?php

namespace App\Console\Commands;

use App\Models\Invoice;
use Illuminate\Console\Command;

class MarkOverdueInvoices extends Command
{
    protected $signature = 'invoices:mark-overdue';

    protected $description = 'Mark unpaid invoices past their due date as overdue';

    public function handle(): int
    {
        $updated = Invoice::where('status', 'unpaid')
            ->where('due_date', '<', now()->toDateString())
            ->update(['status' => 'overdue']);

        $this->info("{$updated} invoice diperbarui menjadi overdue.");

        return self::SUCCESS;
    }
}
