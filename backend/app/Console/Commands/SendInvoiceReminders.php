<?php

namespace App\Console\Commands;

use App\Jobs\SendInvoiceReminderJob;
use App\Models\Invoice;
use Illuminate\Console\Command;

class SendInvoiceReminders extends Command
{
    protected $signature = 'invoices:send-reminders';

    protected $description = 'Send email reminders for invoices due in 7 days and 1 day';

    public function handle(): int
    {
        $sevenDayCount = 0;
        $oneDayCount   = 0;

        // Invoices due in exactly 7 days
        $sevenDayInvoices = Invoice::whereIn('status', ['unpaid', 'pending'])
            ->whereDate('due_date', now()->addDays(7)->toDateString())
            ->with('tenancy.tenant')
            ->get();

        foreach ($sevenDayInvoices as $invoice) {
            SendInvoiceReminderJob::dispatch($invoice, 7);
            $sevenDayCount++;
        }

        // Invoices due in exactly 1 day
        $oneDayInvoices = Invoice::whereIn('status', ['unpaid', 'pending'])
            ->whereDate('due_date', now()->addDay()->toDateString())
            ->with('tenancy.tenant')
            ->get();

        foreach ($oneDayInvoices as $invoice) {
            SendInvoiceReminderJob::dispatch($invoice, 1);
            $oneDayCount++;
        }

        $this->info("Reminder terkirim: {$sevenDayCount} (7 hari), {$oneDayCount} (1 hari).");

        return self::SUCCESS;
    }
}
