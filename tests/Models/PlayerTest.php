<?php
use App\Player;
use App\User;
use App\Card;

class PlayerTest extends TestCase
{
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

    public function testHand()
    {
        $player = Player::fetch(1);
        $this->assertCount(4, $player->getHand());

        $player
            ->addCard(new Card(Card::TYPE_KING, Card::SUIT_HEARTS))
            ->addCard(new Card(Card::TYPE_10, Card::SUIT_HEARTS))
            ->removeCard(new Card(Card::TYPE_KING, Card::SUIT_HEARTS))
            ->removeCardByIndex(200)
            ->removeCardByIndex(1);
        
        
        $hand = $player->getHand();
        $this->assertCount(4, $hand);
        $card = current($hand);
        $this->assertSame(Card::TYPE_9, Card::createFromCode($card)->getType());
        $this->assertSame(Card::SUIT_DIAMONDS, Card::createFromCode($card)->getSuit());
        
        $card = next($hand);
        $this->assertSame(Card::TYPE_KING, Card::createFromCode($card)->getType());
        $this->assertSame(Card::SUIT_SPADES, Card::createFromCode($card)->getSuit());
        
        $card = next($hand);
        $this->assertSame(Card::TYPE_KING, Card::createFromCode($card)->getType());
        $this->assertSame(Card::SUIT_CLUBS, Card::createFromCode($card)->getSuit());
        
        $card = next($hand);
        $this->assertSame(Card::TYPE_10, Card::createFromCode($card)->getType());
        $this->assertSame(Card::SUIT_HEARTS, Card::createFromCode($card)->getSuit());
    }
    
    public function testGetCardByIndex() {
        $player = Player::fetch(1);
        
        /** @var Card $card */
        $card = $player->getCardByIndex(1);

        $this->assertSame(Card::TYPE_QUEEN, $card->getType());
        $this->assertSame(Card::SUIT_HEARTS, $card->getSuit());
        
        $this->assertNull($player->getCardByIndex(999));
    }
    
    public function testIsUser() {
        $this->assertTrue(Player::fetch(1)->isUser(User::fetch(1)));
        $this->assertFalse(Player::fetch(2)->isUser(User::fetch(1)));
    }
}
