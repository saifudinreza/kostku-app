<?php

namespace App\Console\Commands;

use App\Models\Invoice;
use App\Models\Tenancy;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class GenerateMonthlyInvoices extends Command
{
    protected $signature = 'invoices:generate-monthly';

    protected $description = 'Generate monthly invoices for all active tenancies';

    public function handle(): int
    {
        $month = now()->month;
        $year  = now()->year;
        $count = 0;

        $tenancies = Tenancy::where('status', 'active')
            ->with('room')
            ->get();

        DB::beginTransaction();
        try {
            foreach ($tenancies as $tenancy) {
                $exists = Invoice::where('tenancy_id', $tenancy->id)
                    ->where('period_month', $month)
                    ->where('period_year', $year)
                    ->exists();

                if ($exists) {
                    continue;
                }

                $dueDate  = now()->setDay(10)->toDateString();
                $subtotal = $tenancy->room->price;

                $invoice = Invoice::create([
                    'tenancy_id'     => $tenancy->id,
                    'invoice_number' => Invoice::generateNumber(),
                    'period_month'   => $month,
                    'period_year'    => $year,
                    'due_date'       => $dueDate,
                    'subtotal'       => $subtotal,
                    'total_amount'   => $subtotal,
                    'status'         => 'unpaid',
                ]);

                $invoice->items()->create([
                    'name'   => "Sewa Kamar {$tenancy->room->room_number} — " . now()->format('m') . "/" . $year,
                    'amount' => $subtotal,
                ]);

                $count++;
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            $this->error("Gagal: {$e->getMessage()}");
            return self::FAILURE;
        }

        $this->info("{$count} invoice berhasil dibuat untuk {$month}/{$year}.");

        return self::SUCCESS;
    }
}
