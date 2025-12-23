<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@insuranceservices.com',
            'password' => Hash::make('yhN?0+C=£aL*12'),
            'password_text' => 'yhN?0+C=£aL*12',
            'companies_id' => null,
        ]);

        User::create([
            'name' => 'Admin',
            'email' => 'admin@insuranceservices.com',
            'password' => Hash::make('8U68qDS(2rDpF%'),
            'password_text' => '8U68qDS(2rDpF%',
            'companies_id' => 1,
        ]);
    }
}
