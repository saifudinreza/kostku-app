<?php

namespace Database\Factories;

use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TenancyFactory extends Factory
{
    public function definition(): array
    {
        return [
            'room_id'    => Room::factory(),
            'tenant_id'  => User::factory()->state(['role' => 'tenant']),
            'start_date' => $this->faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            'end_date'   => null,
            'status'     => 'active',
            'deposit'    => $this->faker->numberBetween(500000, 2000000),
        ];
    }
}
