<?php

use Illuminate\Database\Seeder;
use App\Game;
use App\Card;

class GameTableSeeder extends Seeder
{
    /**
     * Run the database seeds
     *
     * @return void
     */
    public function run()
    {
        Game::create(
            [
                'name'        => 'Game 1',
                'active'      => true,
                'lead_seat'   => 1,
                'dealer_seat' => 4,
                'play_area'   => json_encode(
                    [
                        (new Card(Card::TYPE_JACK, Card::SUIT_DIAMONDS))->getCode(),
                        (new Card(Card::TYPE_10, Card::SUIT_DIAMONDS))->getCode(),
                        (new Card(Card::TYPE_KING, Card::SUIT_DIAMONDS))->getCode(),
                        (new Card(Card::TYPE_KING, Card::SUIT_CLUBS))->getCode(),
                    ]
                ),
            ]
        );

        Game::create(
            [
                'name'      => 'Game 2',
                'active'    => false,
                'play_area' => json_encode(
                    [
                        (new Card(Card::TYPE_QUEEN, Card::SUIT_SPADES))->getCode(),
                        (new Card(Card::TYPE_9, Card::SUIT_HEARTS))->getCode(),
                    ]
                ),
            ]
        );
    }
}
