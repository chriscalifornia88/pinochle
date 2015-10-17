<?php

use Illuminate\Foundation\Testing\DatabaseTransactions;
use App\Game;

class BaseModelTest extends TestCase
{
    use DatabaseTransactions;

    public function testFetch()
    {
        $this->assertInstanceOf(Game::getClassName(), Game::fetch(1));
    }

    /**
     * @expectedException \App\Exceptions\ModelNotFoundException
     */
    public function testFetchThrowsModelNotFoundException()
    {
        Game::fetch(99999);
    }
    
    public function testGetClassName() {
        $this->assertSame('App\Game', Game::getClassName());
    }
    
    public function testGetRelativeClassName() {
        $this->assertSame('Game', Game::getRelativeClassName());
    }
}
