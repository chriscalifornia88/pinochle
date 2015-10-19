<?php
use App\Card;

class CardTest extends TestCase
{
    public function testCreateFromCode()
    {
        $card = Card::createFromCode('KH');
        $this->assertSame(Card::TYPE_KING, $card->getType());
        $this->assertSame(Card::SUIT_HEARTS, $card->getSuit());
        
        $this->assertNull(Card::createFromCode(""));
    }
}
