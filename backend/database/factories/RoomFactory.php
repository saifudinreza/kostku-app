<?php

namespace Database\Factories;

use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;

class RoomFactory extends Factory
{
    public function definition(): array
    {
        static $counter = 100;
        $counter++;

        return [
            'property_id' => Property::factory(),
            'room_number' => (string) $counter,
            'floor'       => $this->faker->numberBetween(1, 4),
            'price'       => $this->faker->numberBetween(500000, 1500000),
            'status'      => 'available',
            'description' => $this->faker->sentence(),
        ];
    }
}
