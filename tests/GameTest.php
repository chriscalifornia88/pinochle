<?php

use Illuminate\Foundation\Testing\DatabaseTransactions;
use App\Game;

class GameTest extends TestCase
{
    use DatabaseTransactions;

    public function testPlayers()
    {
        $game = Game::fetch(1);
        $this->assertSame('Game 1', $game->getName());

        $players = $game->getPlayers();
        $this->assertCount(4, $players);
        $this->assertSame('User 1', $players[0]->getUser()->getName());
    }
}
