<?php

use Illuminate\Database\Seeder;
use App\User;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for($i=1; $i<=4; $i++) {
            User::create(
                [
                    'name'     => 'User ' . $i,
                    'email'    => str_random(10) . '@gmail.com',
                    'password' => bcrypt('secret ' . $i),
                ]
            );
        }
    }
}
