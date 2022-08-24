<?php

namespace App\Tests\Functional\Controller;

use App\DataFixtures\ConfirmedUserFixtures;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\Client;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;

class ChangeEmailControllerTest extends ApiTestCase
{
    /** @var AbstractDatabaseTool */
    protected $databaseTool;

    private $testClient = null;

    public function setUp(): void
    {
        $this->testClient = static::createClient();
        $this->databaseTool = $this->testClient->getContainer()->get(DatabaseToolCollection::class)->get();
    }

    private function getAuthToken(Client $client): string
    {
        $response = $client->request('POST', '/authentication_token', [
            'json' => [
                "username" => "john",
                "password" => "password"
            ]
        ]);

        return json_decode($response->getContent(), true)['token'];
    }

    public function testWhenGoodData()
    {
        $this->databaseTool->loadFixtures([ConfirmedUserFixtures::class]);

        $client = $this->testClient;

        $token = $this->getAuthToken($client);

        $client->request('PUT', '/api/users/1/change-email', [
            'json' => [
                "newEmail" => "example@example.com"
            ],
            'auth_bearer' => $token
        ]);

        $this->assertResponseIsSuccessful();
    }

    public function testWhenNewEmailIsActualEmail()
    {
        $this->databaseTool->loadFixtures([ConfirmedUserFixtures::class]);

        $client = $this->testClient;

        $token = $this->getAuthToken($client);

        $client->request('PUT', '/api/users/1/change-email', [
            'json' => [
                "newEmail" => "johh@doe.fr"
            ],
            'auth_bearer' => $token
        ]);

        $this->assertResponseStatusCodeSame(422);
    }

    public function testWhenNewEmailIsNotValidEmail()
    {
        $this->databaseTool->loadFixtures([ConfirmedUserFixtures::class]);

        $client = $this->testClient;

        $token = $this->getAuthToken($client);

        $client->request('PUT', '/api/users/1/change-email', [
            'json' => [
                "newEmail" => "johhdoe.fr"
            ],
            'auth_bearer' => $token
        ]);

        $this->assertResponseStatusCodeSame(422);
    }
}
