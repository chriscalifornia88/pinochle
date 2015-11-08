<?php
use App\Game;
use App\Card;
use App\User;
use App\Player;

class GameTest extends TestCase
{
    public function testPlayers()
    {
        $game = Game::fetch(1);
        $this->assertSame('Game 1', $game->getName());

        $players = $game->getPlayers();
        $this->assertCount(4, $players);
        $this->assertSame('User 1', $players[0]->getUser()->getName());
    }
    
    public function testGetNextPlayer() {
        $game = Game::fetch(1);
        
        $this->assertEquals(2, $game->getNextPlayer(Player::fetch(1))->getId());
        $this->assertEquals(3, $game->getNextPlayer(Player::fetch(2))->getId());
        $this->assertEquals(4, $game->getNextPlayer(Player::fetch(3))->getId());
        $this->assertEquals(1, $game->getNextPlayer(Player::fetch(4))->getId());
    }

    public function testGetPlayerForUser()
    {
        $game = Game::fetch(1);
        $user = User::fetch(1);

        $player = $game->getPlayerForUser($user);
        $this->assertEquals($user->getId(), $player->getUser()->getId());

        $this->assertNull($game->getPlayerForUser(User::fetch(5)));
    }

    public function testGetLeader()
    {
        $game = Game::fetch(1);

        $player = $game->getLeader();
        $this->assertEquals(1, $player->getId());
    }

    public function testGetLeaderWhenNull()
    {
        $game = Game::fetch(2);

        $this->assertNull($game->getLeader());
    }

    public function testSetLeader()
    {
        $game = Game::fetch(1);
        $player = Player::fetch(2);

        $game->setLeader($player);
        $this->assertEquals($player->getId(), $game->getLeader()->getId());
    }

    public function testGetDealer()
    {
        $game = Game::fetch(1);

        $player = $game->getDealer();
        $this->assertEquals(4, $player->getId());
    }

    public function testGetDealerWhenNull()
    {
        $game = Game::fetch(2);

        $this->assertNull($game->getDealer());
    }

    public function testSetDealer()
    {
        $game = Game::fetch(1);
        $player = Player::fetch(3);

        $game->setDealer($player);
        $this->assertEquals($player->getId(), $game->getDealer()->getId());
    }

    public function testGetActivePlayer()
    {
        $game = Game::fetch(1);

        $player = $game->getActivePlayer();
        $this->assertEquals(1, $player->getId());
    }

    public function testGetActivePlayerWhenNull()
    {
        $game = Game::fetch(2);

        $this->assertNull($game->getActivePlayer());
    }

    public function testSetActivePlayer()
    {
        $game = Game::fetch(1);
        $player = Player::fetch(2);

        $game->setActivePlayer($player);
        $this->assertEquals($player->getId(), $game->getActivePlayer()->getId());
    }

    public function testPlayArea()
    {
        $game = Game::fetch(1);
        $this->assertCount(4, $game->getPlayArea());

        $game
            ->addCard(new Card(Card::TYPE_ACE, Card::SUIT_CLUBS))
            ->addCard(new Card(Card::TYPE_JACK, Card::SUIT_DIAMONDS))
            ->removeCard(new Card(Card::TYPE_KING, Card::SUIT_DIAMONDS))
            ->removeCardByIndex(200)
            ->removeCardByIndex(1);

        $playArea = $game->getPlayArea();
        $this->assertCount(4, $playArea);
        $card = current($playArea);
        $this->assertSame(Card::TYPE_JACK, Card::createFromCode($card)->getType());
        $this->assertSame(Card::SUIT_DIAMONDS, Card::createFromCode($card)->getSuit());

        $card = next($playArea);
        $this->assertSame(Card::TYPE_KING, Card::createFromCode($card)->getType());
        $this->assertSame(Card::SUIT_CLUBS, Card::createFromCode($card)->getSuit());

        $card = next($playArea);
        $this->assertSame(Card::TYPE_ACE, Card::createFromCode($card)->getType());
        $this->assertSame(Card::SUIT_CLUBS, Card::createFromCode($card)->getSuit());

        $card = next($playArea);
        $this->assertSame(Card::TYPE_JACK, Card::createFromCode($card)->getType());
        $this->assertSame(Card::SUIT_DIAMONDS, Card::createFromCode($card)->getSuit());
    }
}
