<?php

use Illuminate\Database\Seeder;
use App\Player;

class PlayerTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Player::create([
            'game_id' => 1,
            'user_id' => 1
        ]);
        
        Player::create([
            'game_id' => 1,
            'user_id' => 2
        ]);
        
        Player::create([
            'game_id' => 1,
            'user_id' => 3
        ]);
        
        Player::create([
            'game_id' => 1,
            'user_id' => 4
        ]);
        
        Player::create([
            'game_id' => 2,
            'user_id' => 2
        ]);
        
        Player::create([
            'game_id' => 2,
            'user_id' => 3
        ]);
        
        Player::create([
            'game_id' => 2,
            'user_id' => 4
        ]);
    }
}
