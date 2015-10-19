<?php
use App\User;

class UserTest extends TestCase
{
    public function testGetPlayers()
    {
        $user = User::fetch(1);

        $players = $user->getPlayers();
        $player = $players[0];
        $this->assertSame('Game 1', $player->getGame()->getName());
    }
}
