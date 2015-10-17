<?php
use Illuminate\Foundation\Testing\DatabaseTransactions;
use App\Game;
use App\Card;

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
