<?php

use App\Game;
use App\Player;
use App\Response;
use App\Exceptions\ErrorCode;

class GameControllerTest extends TestCase
{
    protected $baseUrl = "/game";

    public function testIndex()
    {
        $response = $this->restCall(self::METHOD_GET);

        $this->assertSame(Response::STATUS_SUCCESS, $response->getStatus());
        $this->assertEquals(Response::CODE_OK, $this->httpResponse->getStatusCode());

        /** @var Game[] $games */
        $games = $response->getData();
        $this->assertCount(1, $games);

        $game = $games[0];
        $this->assertSame('Game 1', $game->name);
    }

    public function testShow()
    {
        $response = $this->restCall(self::METHOD_GET, "/1");

        $this->assertSame(Response::STATUS_SUCCESS, $response->getStatus());
        $this->assertEquals(Response::CODE_OK, $this->httpResponse->getStatusCode());

        /** @var Game $game */
        $game = $response->getData();
        $this->assertSame('Game 1', $game->name);

        /** @var Player $player */
        $player = current($game->players);
        $this->assertObjectHasAttribute('hand', $player);
        $this->assertEquals(4, $player->card_count);

        // Check that opponent's cards are hidden
        $player = next($game->players);
        $this->assertObjectNotHasAttribute('hand', $player);
        $this->assertEquals(2, $player->card_count);

        $player = next($game->players);
        $this->assertObjectNotHasAttribute('hand', $player);
        $this->assertEquals(3, $player->card_count);

        $player = next($game->players);
        $this->assertObjectNotHasAttribute('hand', $player);
        $this->assertEquals(2, $player->card_count);
    }

    public function testShowWrongGameThrowsAccessDeniedException()
    {
        $response = $this->restCall(self::METHOD_GET, "/2");

        $this->assertSame(Response::STATUS_FAILURE, $response->getStatus());
        $this->assertEquals(ErrorCode::ACCESS_DENIED, $response->getErrorCode());
        $this->assertEquals(Response::CODE_FORBIDDEN, $this->httpResponse->getStatusCode());
    }
}
