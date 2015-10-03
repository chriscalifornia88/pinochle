<?php

namespace App;

/**
 * App\Player
 *
 * @property integer $id
 * @property integer $player_id
 * @pdroperty integer $game_id
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
 * @property integer $game_id
 */
class Player extends BaseModel
{
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
     * @return $this
     */
    public function setUser(User $user)
    {
        $this->user()->associate($user);

        return $this;
    }
}

