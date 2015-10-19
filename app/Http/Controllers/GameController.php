<?php

namespace App\Http\Controllers;

use App\Card;
use App\Exceptions\AccessDeniedException;
use App\Exceptions\ModelNotFoundException;
use App\Player;
use App\Game;

class GameController extends Controller
{
    protected static $model = Game::class;

    /**
     * Display a listing of the user's games.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $players = \Auth::user()->getPlayers();

            $this->response->setData(
                array_map(
                    function (Player $player) {
                        return $player->getGame();
                    },
                    $players
                )
            );
        } catch (\Exception $ex) {
            $this->response->setError($ex);
        }

        return $this->createResponse();
    }

    /**
     * Display the current game state
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $user = \Auth::user();
            $game = Game::fetch($id);

            if (!$user->inGame($game)) {
                throw new AccessDeniedException(Game::getRelativeClassName());
            }

            $this->response->setData($this->getGameState($game));
        } catch (\Exception $ex) {
            $this->response->setError($ex);
        }

        return $this->createResponse();
    }

    /**
     * Move a card from the player's hand to the play area
     * @param $id
     * @param $index
     * @return \Illuminate\Http\Response
     */
    public function putCard($id, $index)
    {
        try {
            $user = \Auth::user();
            $game = Game::fetch($id);
            $player = $game->getPlayerForUser($user);

            if (!$user->inGame($game)) {
                throw new AccessDeniedException(Game::getRelativeClassName());
            }

            $card = $player->getCardByIndex($index);
            if (is_null($card)) {
                throw new ModelNotFoundException('Card');
            }

            $player
                ->removeCardByIndex($index)
                ->save();

            $game
                ->addCard($card)
                ->save();

            $this->response->setData($this->getGameState($game));
        } catch (\Exception $ex) {
            $this->response->setError($ex);
        }

        return $this->createResponse();
    }

    /**
     * Get the current game state
     * @param Game $game
     * @return Game
     */
    private function getGameState(Game $game) {
        $user = \Auth::user();
        $game = $game->load(['players']);

        // Remove opponent's cards from the result
        foreach ($game->players as $index => $player) {
            /** @var Player $player */
            if (!$player->isUser($user)) {
                $player->addHidden(['hand']);
            }
        }
        
        return $game;
    }
}
