<?php

namespace Database\Seeders;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Payment;
use App\Models\Property;
use App\Models\Room;
use App\Models\Tenancy;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create owner
        $owner = User::create([
            'name'              => 'Pak Hasan',
            'email'             => 'owner@kostku.test',
            'password'          => Hash::make('password'),
            'role'              => 'owner',
            'email_verified_at' => now(),
        ]);

        // Create tenant
        $tenant = User::create([
            'name'              => 'Budi Santoso',
            'email'             => 'tenant@kostku.test',
            'password'          => Hash::make('password'),
            'role'              => 'tenant',
            'email_verified_at' => now(),
        ]);

        // Create property
        $property = Property::create([
            'owner_id'    => $owner->id,
            'name'        => 'Kost Pak Hasan',
            'address'     => 'Jl. Mawar Indah No. 12',
            'city'        => 'Bandung',
            'description' => 'Kost nyaman dan strategis dekat kampus dan pusat kota.',
        ]);

        // Create 5 rooms
        $rooms = [];
        for ($i = 1; $i <= 5; $i++) {
            $rooms[] = Room::create([
                'property_id' => $property->id,
                'room_number' => (string)(100 + $i),
                'floor'       => 1,
                'price'       => 750000,
                'status'      => $i === 1 ? 'occupied' : 'available',
                'description' => "Kamar no " . (100 + $i) . " — kamar luas dan terang dengan jendela besar.",
            ]);
        }

        // Create active tenancy for tenant in room 101
        $tenancy = Tenancy::create([
            'room_id'    => $rooms[0]->id,
            'tenant_id'  => $tenant->id,
            'start_date' => now()->subMonths(3)->toDateString(),
            'end_date'   => null,
            'status'     => 'active',
            'deposit'    => 750000,
        ]);

        // Create 3 invoices — 2 paid, 1 unpaid
        for ($m = 2; $m >= 0; $m--) {
            $date   = now()->subMonths($m);
            $month  = (int) $date->format('m');
            $year   = (int) $date->format('Y');
            $isPaid = $m > 0; // last 2 months paid, current month unpaid

            $invoice = Invoice::create([
                'tenancy_id'     => $tenancy->id,
                'invoice_number' => Invoice::generateNumber(),
                'period_month'   => $month,
                'period_year'    => $year,
                'due_date'       => $date->copy()->setDay(10)->toDateString(),
                'subtotal'       => 750000,
                'total_amount'   => 750000,
                'status'         => $isPaid ? 'paid' : 'unpaid',
            ]);

            InvoiceItem::create([
                'invoice_id' => $invoice->id,
                'name'       => "Sewa Kamar 101 — {$month}/{$year}",
                'amount'     => 750000,
            ]);

            if ($isPaid) {
                Payment::create([
                    'invoice_id'        => $invoice->id,
                    'midtrans_order_id' => 'KOSTKU-SEED-' . $invoice->id . '-' . $m,
                    'amount'            => 750000,
                    'payment_method'    => 'bank_transfer',
                    'status'            => 'success',
                    'paid_at'           => $date->copy()->setDay(8),
                ]);
            }
        }
    }
}
