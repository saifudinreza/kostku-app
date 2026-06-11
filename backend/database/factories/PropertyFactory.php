<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PropertyFactory extends Factory
{
    public function definition(): array
    {
        $names = [
            'Kost Melati Indah', 'Kost Budi Sejahtera', 'Kost Maju Jaya',
            'Wisma Putri Cantik', 'Kost Harmoni', 'Kost Al-Barokah',
            'Kost Damai Sentosa', 'Rumah Kost Kenanga', 'Kost Fajar Baru',
        ];

        $cities = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Malang', 'Medan', 'Semarang'];

        return [
            'owner_id'    => User::factory(),
            'name'        => $this->faker->randomElement($names) . ' ' . $this->faker->randomNumber(2),
            'address'     => 'Jl. ' . $this->faker->streetName() . ' No. ' . $this->faker->buildingNumber(),
            'city'        => $this->faker->randomElement($cities),
            'description' => $this->faker->paragraph(2),
        ];
    }
}
