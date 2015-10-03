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
 */
class Game extends BaseModel
{
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
}
