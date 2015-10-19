<?php

namespace App;

/**
 * App\Player
 *
 * @property integer $id
 * @property integer $player_id
 * @property integer $game_id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @method static \Illuminate\Database\Query\Builder|\App\Player whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Player wherePlayerId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Player whereGameId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Player whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Player whereUpdatedAt($value)
 * @property-read \Game $game
 * @property-read \User $user
 * @property integer $user_id
 * @method static \Illuminate\Database\Query\Builder|\App\Player whereUserId($value)
 * @property array $hand
 * @property int $card_count
 * @method static \Illuminate\Database\Query\Builder|\App\Player whereHand($value)
 * @property integer $seat
 * @method static \Illuminate\Database\Query\Builder|\App\Player whereSeat($value)
 */
class Player extends BaseModel
{
    protected $casts = [
        'hand' => 'array',
    ];
    protected $appends = ['card_count'];

    public function getCardCountAttribute()
    {
        return count($this->getHand());
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function game()
    {
        return $this->belongsTo(Game::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
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
     * @return Game
     */
    public function getGame()
    {
        return $this->game;
    }

    /**
     * @return User
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @param User $user
     * @return bool
     */
    public function isUser(User $user)
    {
        return $this->getUser()->getId() === $user->getId();
    }

    /**
     * @param User $user
     * @return $this
     */
    public function setUser(User $user)
    {
        $this->user()->associate($user);

        return $this;
    }

    /**
     * @codeCoverageIgnore
     * @return array
     */
    public function getHand()
    {
        if (is_array($this->hand)) {
            return $this->hand;
        }

        return json_decode($this->hand, true);
    }

    /**
     * @param array $cards
     * @return $this
     */
    public function setHand(array $cards)
    {
        $this->hand = json_encode(array_values($cards));

        return $this;
    }

    /**
     * @codeCoverageIgnore
     * @return int
     */
    public function getSeat()
    {
        return $this->seat;
    }

    /**
     * @codeCoverageIgnore
     * @param int $seat
     * @return $this
     */
    public function setSeat($seat)
    {
        $this->seat = $seat;

        return $this;
    }

    /**
     * Add a card to the player's hand
     * @param Card $card
     * @return $this
     */
    public function addCard(Card $card)
    {
        $hand = $this->getHand();
        $hand[] = $card->getCode();
        $this->setHand($hand);

        return $this;
    }

    /**
     * Get the player's card
     * @param int $index
     * @return Card
     */
    public function getCardByIndex($index)
    {
        $hand = $this->getHand();
        if (isset($hand[$index])) {
            return Card::createFromCode($hand[$index]);
        }

        return null;
    }

    /**
     * Remove a card from the player's hand
     * @param Card $card
     * @return $this
     */
    public function removeCard(Card $card)
    {
        $hand = $this->getHand();
        foreach ($hand as $index => $handCard) {
            if ($handCard === $card->getCode()) {
                unset($hand[$index]);
                break;
            }
        }
        $this->setHand($hand);

        return $this;
    }

    /**
     * Remove a card from the player's hand
     * @param int $index
     * @return $this
     */
    public function removeCardByIndex($index)
    {
        $hand = $this->getHand();
        if (isset($hand[$index])) {
            unset($hand[$index]);
            $this->setHand($hand);
        }

        return $this;
    }
}

