<?php

use Illuminate\Database\Seeder;
use App\Game;

class GameTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Game::create(
            [
                'name'   => 'Game 1',
                'active' => true
            ]
        );

        Game::create(
            [
                'name'   => 'Game 2',
                'active' => false
            ]
        );
    }
}
