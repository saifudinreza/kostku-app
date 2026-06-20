<?php

namespace App\Console\Commands;

use App\Jobs\SendInvoiceReminderJob;
use App\Models\Invoice;
use App\Services\WhatsAppService;
use Illuminate\Console\Command;
use Illuminate\Support\Number;

class SendInvoiceReminders extends Command
{
    protected $signature = 'invoices:send-reminders';

    protected $description = 'Send email + WhatsApp reminders for invoices due in 7 days and 1 day';

    public function handle(WhatsAppService $wa): int
    {
        $emailCount = 0;
        $waCount    = 0;

        $invoices = Invoice::whereIn('status', ['unpaid', 'pending'])
            ->where(function ($q) {
                $q->whereDate('due_date', now()->addDays(7)->toDateString())
                  ->orWhereDate('due_date', now()->addDay()->toDateString());
            })
            ->with('tenancy.tenant')
            ->get();

        foreach ($invoices as $invoice) {
            $daysUntilDue = now()->diffInDays($invoice->due_date, false) + 1;
            $days = $daysUntilDue >= 6 ? 7 : 1;

            // Email
            SendInvoiceReminderJob::dispatch($invoice, $days);
            $emailCount++;

            // WhatsApp
            $tenant = $invoice->tenancy?->tenant;
            if ($tenant && $tenant->phone) {
                $amount  = 'Rp ' . number_format($invoice->total_amount, 0, ',', '.');
                $due     = \Carbon\Carbon::parse($invoice->due_date)->translatedFormat('d F Y');
                $message = "Halo *{$tenant->name}*,\n\n"
                    . "Pengingat tagihan sewa KostKu:\n"
                    . "📋 Invoice: *{$invoice->invoice_number}*\n"
                    . "💰 Total: *{$amount}*\n"
                    . "📅 Jatuh tempo: *{$due}* ({$days} hari lagi)\n\n"
                    . "Segera lakukan pembayaran sebelum jatuh tempo.\n"
                    . "Terima kasih! 🙏";

                if ($wa->send($tenant->phone, $message)) {
                    $waCount++;
                }
            }
        }

        $this->info("Email terkirim: {$emailCount} | WhatsApp terkirim: {$waCount}");

        return self::SUCCESS;
    }
}
