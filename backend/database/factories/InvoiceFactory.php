<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\Tenancy;
use Illuminate\Database\Eloquent\Factories\Factory;

class InvoiceFactory extends Factory
{
    public function definition(): array
    {
        $month  = $this->faker->numberBetween(1, 12);
        $year   = now()->year;
        $amount = $this->faker->numberBetween(500000, 1500000);

        return [
            'tenancy_id'     => Tenancy::factory(),
            'invoice_number' => Invoice::generateNumber(),
            'period_month'   => $month,
            'period_year'    => $year,
            'due_date'       => now()->setMonth($month)->setDay(10)->format('Y-m-d'),
            'subtotal'       => $amount,
            'total_amount'   => $amount,
            'status'         => 'unpaid',
            'notes'          => null,
        ];
    }
}
