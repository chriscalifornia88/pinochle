<?php

use App\User;
use App\Response;

class TestCase extends \Illuminate\Foundation\Testing\TestCase
{
    const METHOD_GET = 'GET';
    const METHOD_POST = 'POST';
    const METHOD_PUT = 'PUT';
    const METHOD_DELETE = 'DELETE';

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
            ->actingAs(\App\User::fetch(1))
            ->call($method, $uri, $parameters);

        return Response::jsonDeserialize($this->httpResponse->content());
    }
}
