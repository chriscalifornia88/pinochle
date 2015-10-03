<?php

use Illuminate\Foundation\Testing\DatabaseTransactions;
use App\Player;
use App\User;

class PlayerTest extends TestCase
{
    use DatabaseTransactions;

    public function testGetGame()
    {
        $player = Player::fetch(1);

        $this->assertSame('Game 1', $player->getGame()->getName());
    }

    public function testGetUser()
    {
        $player = Player::fetch(1);

        $this->assertSame('User 1', $player->getUser()->getName());
    }

    public function testSetUser()
    {
        $player = Player::fetch(1);

        $player
            ->setUser(User::fetch(2))
            ->save();
        
        $player = Player::fetch(1);
        $this->assertSame('User 2', $player->getUser()->getName());
    }
}
