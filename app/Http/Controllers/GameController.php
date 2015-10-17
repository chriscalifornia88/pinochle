<?php

namespace App\Http\Controllers;

use App\Exceptions\AccessDeniedException;
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

            $game = $game->load(['players']);

            // Remove opponent's cards from the result
            foreach ($game->players as $index => $player) {
                /** @var Player $player */
                if (!$player->isUser($user)) {
                    $player->addHidden(['hand']);
                }
            }

            $this->response->setData($game);
        } catch (\Exception $ex) {
            $this->response->setError($ex);
        }

        return $this->createResponse();
    }

    /**
     * Play a card from the hand to
     * @param $index
     * @return \Illuminate\Http\Response
     */
    public function putCard($index)
    {
        try {

        } catch (\Exception $ex) {

        }
        
        return $this->createResponse();
    }
}
