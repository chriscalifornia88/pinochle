<?php

use Illuminate\Database\Seeder;
use App\Player;
use App\Card;

class PlayerTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Player::create(
            [
                'game_id' => 1,
                'user_id' => 1,
                'seat'    => 1,
                'hand'    => json_encode(
                    [
                        (new Card(Card::TYPE_9, Card::SUIT_DIAMONDS))->getCode(),
                        (new Card(Card::TYPE_QUEEN, Card::SUIT_HEARTS))->getCode(),
                        (new Card(Card::TYPE_KING, Card::SUIT_SPADES))->getCode(),
                        (new Card(Card::TYPE_KING, Card::SUIT_CLUBS))->getCode(),
                    ]
                ),
            ]
        );

        Player::create(
            [
                'game_id' => 1,
                'user_id' => 2,
                'seat'    => 2,
                'hand'    => json_encode(
                    [
                        (new Card(Card::TYPE_JACK, Card::SUIT_DIAMONDS))->getCode(),
                        (new Card(Card::TYPE_QUEEN, Card::SUIT_SPADES))->getCode(),
                    ]
                ),
            ]
        );

        Player::create(
            [
                'game_id' => 1,
                'user_id' => 3,
                'seat'    => 3,
                'hand'    => json_encode(
                    [
                        (new Card(Card::TYPE_KING, Card::SUIT_HEARTS))->getCode(),
                        (new Card(Card::TYPE_JACK, Card::SUIT_CLUBS))->getCode(),
                        (new Card(Card::TYPE_10, Card::SUIT_CLUBS))->getCode(),
                    ]
                ),
            ]
        );

        Player::create(
            [
                'game_id' => 1,
                'user_id' => 4,
                'seat'    => 4,
                'hand'    => json_encode(
                    [
                        (new Card(Card::TYPE_9, Card::SUIT_SPADES))->getCode(),
                        (new Card(Card::TYPE_10, Card::SUIT_HEARTS))->getCode(),
                    ]
                ),
            ]
        );

        Player::create(
            [
                'game_id' => 2,
                'user_id' => 2
            ]
        );

        Player::create(
            [
                'game_id' => 2,
                'user_id' => 3
            ]
        );

        Player::create(
            [
                'game_id' => 2,
                'user_id' => 4
            ]
        );
    }
}
