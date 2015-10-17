<?php
/**
 * User: Christian Augustine
 * Date: 10/3/15
 * Time: 10:19 PM
 */

namespace App;

class Card
{
    const SUIT_HEARTS = 'H';
    const SUIT_CLUBS = 'C';
    const SUIT_SPADES = 'S';
    const SUIT_DIAMONDS = 'D';

    const TYPE_9 = '9';
    const TYPE_10 = '10';
    const TYPE_JACK = 'J';
    const TYPE_QUEEN = 'Q';
    const TYPE_KING = 'K';
    const TYPE_ACE = 'A';

    /** @var string */
    private $type;

    /** @var string */
    private $suit;

    public function __construct($type, $suit)
    {
        $this->type = $type;
        $this->suit = $suit;
    }

    /**
     * @param $code
     * @return Card
     */
    public static function createFromCode($code)
    {
        if (strlen($code) > 1) {
            return new Card(substr($code, 0, strlen($code) - 1), substr($code, -1));
        }

        return null;
    }

    /**
     * @codeCoverageIgnore
     * @return string
     */
    public function getCode()
    {
        return $this->type . $this->suit;
    }

    /**
     * @codeCoverageIgnore
     * @return string
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @codeCoverageIgnore
     * @param string $type
     * @return $this
     */
    public function setType($type)
    {
        $this->type = $type;

        return $this;
    }

    /**
     * @codeCoverageIgnore
     * @return string
     */
    public function getSuit()
    {
        return $this->suit;
    }

    /**
     * @codeCoverageIgnore
     * @param string $suit
     * @return $this
     */
    public function setSuit($suit)
    {
        $this->suit = $suit;

        return $this;
    }
}
