<?php

namespace App\Tests\Functional\Controller;

use Symfony\Component\HttpFoundation\Request;
use App\DataFixtures\NotConfirmedUserFixtures;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;

class ConfirmRegistrationControllerTest extends ApiTestCase
{
    /** @var AbstractDatabaseTool */
    protected $databaseTool;

    private $testClient = null;

    public function setUp(): void
    {
        $this->testClient = static::createClient();
        $this->databaseTool = $this->testClient->getContainer()->get(DatabaseToolCollection::class)->get();
    }

    public function testConfirmationRegistrationWork()
    {
        $client = $this->testClient;
        $client->getContainer()->get('twig')->addGlobal('app', [ 'request' => new Request()]);

        $this->databaseTool->loadFixtures([NotConfirmedUserFixtures::class]);

        $client->request('GET', '/api/users/token/confirmation');

        $this->assertResponseIsSuccessful();

        $client->request('POST', '/authentication_token', [
            'json' => [
                "username" => "john",
                "password" => "password"
            ]
        ]);

        $this->assertResponseIsSuccessful();
    }

    public function testConfirmationRegistrationWhenBadToken()
    {
        $this->databaseTool->loadFixtures([NotConfirmedUserFixtures::class]);

        $client = $this->testClient;

        $client->request('GET', '/api/users/bad_token/confirmation');

        $this->assertResponseStatusCodeSame(404);
    }
}
