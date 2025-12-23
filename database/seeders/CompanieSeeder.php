<?php

namespace Database\Seeders;

use App\Models\Companie;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class CompanieSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Companie::create([
            'name' => 'Insurance Services',
            'document' => '123456789',
            'dv' => '0',
            'address' => 'Carrera 10 #52-155 Girardot, Colombia',
            'phone' => '123-456-7890',
            'cellphone' => '098-765-4321',
            'logo' => 'companies/insurance-services.png',
        ]);
    }
}
