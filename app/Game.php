<?php

namespace App;

/**
 * App\Game
 *
 * @property integer $id
 * @property string $name
 * @property boolean $active
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @method static \Illuminate\Database\Query\Builder|\App\Game whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Game whereName($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Game whereActive($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Game whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Game whereUpdatedAt($value)
 * @property-read \Illuminate\Database\Eloquent\Collection|\Player[] $players
 * @property string $play_area
 * @method static \Illuminate\Database\Query\Builder|\App\Game wherePlayArea($value)
 */
class Game extends BaseModel
{
    protected $casts = [
        'play_area' => 'array',
    ];

    /**
     * @return Player[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function players()
    {
        return $this->hasMany(Player::class);
    }

    /**
     * @return Player[]
     */
    public function getPlayers()
    {
        return $this->players;
    }

    /**
     * @codeCoverageIgnore
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @codeCoverageIgnore
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @codeCoverageIgnore
     * @param string $name
     * @return $this
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @codeCoverageIgnore
     * @return boolean
     */
    public function isActive()
    {
        return $this->active;
    }

    /**
     * @codeCoverageIgnore
     * @param boolean $active
     * @return $this
     */
    public function setActive($active)
    {
        $this->active = $active;

        return $this;
    }

    /**
     * @codeCoverageIgnore
     * @return array
     */
    public function getPlayArea()
    {
        if (is_array($this->play_area)) {
            return $this->play_area;
        }

        return json_decode($this->play_area, true);
    }

    /**
     * @param array $cards
     * @return $this
     */
    public function setPlayArea(array $cards)
    {
        $this->play_area = json_encode(array_values($cards));

        return $this;
    }

    /**
     * Add a card to the play area
     * @param Card $card
     * @return $this
     */
    public function addCard(Card $card)
    {
        $playArea = $this->getPlayArea();
        $playArea[] = $card->getCode();
        $this->setPlayArea($playArea);

        return $this;
    }

    /**
     * Remove a card from the play area
     * @param Card $card
     * @return $this
     */
    public function removeCard(Card $card)
    {
        $playArea = $this->getPlayArea();
        foreach ($playArea as $index => $playAreaCard) {
            if ($playAreaCard === $card->getCode()) {
                unset($playArea[$index]);
                break;
            }
        }
        $this->setPlayArea($playArea);

        return $this;
    }

    /**
     * Remove a card from the play area
     * @param int $index
     * @return $this
     */
    public function removeCardByIndex($index)
    {
        $playArea = $this->getPlayArea();
        if (isset($playArea[$index])) {
            unset($playArea[$index]);
            $this->setPlayArea($playArea);
        }

        return $this;
    }
}
