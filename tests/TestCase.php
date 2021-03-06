<?php

use Illuminate\Foundation\Testing\DatabaseTransactions;
use App\User;
use App\Response;

class TestCase extends \Illuminate\Foundation\Testing\TestCase
{
    use DatabaseTransactions;

    const METHOD_GET = 'GET';
    const METHOD_POST = 'POST';
    const METHOD_PUT = 'PUT';
    const METHOD_DELETE = 'DELETE';

    /** @var int */
    protected $userId = 1;

    /** @var \Illuminate\Http\Response */
    protected $httpResponse;

    /**
     * The base URL to use while testing the application.
     *
     * @var string
     */
    protected $baseUrl = 'http://localhost';

    public function setUp()
    {
        parent::setUp();

        $this->prepareForTests();

        $this->userId = 1;

        // Clear response
        $this->httpResponse = new \Illuminate\Http\Response();
    }

    /**
     * Creates the application.
     *
     * @return \Illuminate\Foundation\Application
     */
    public function createApplication()
    {
        $app = require __DIR__ . '/../bootstrap/app.php';

        $app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

        return $app;
    }

    public function prepareForTests()
    {
        Config::set('database.default', 'test');
    }

    /**
     * @param $method
     * @param $uri
     * @param $parameters
     * @return Response
     */
    protected function restCall($method, $uri = '', $parameters = [])
    {
        $this->httpResponse = $this
            ->actingAs(User::fetch($this->userId))
            ->call($method, $uri, $parameters);

        return Response::jsonDeserialize($this->httpResponse->content());
    }
}
