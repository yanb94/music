<?php

namespace App\Tests\Functional\Controller;

use App\DataFixtures\ConfirmedUserFixtures;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;

class ChangePasswordControllerTest extends ApiTestCase
{
    /** @var AbstractDatabaseTool */
    protected $databaseTool;

    private $testClient = null;

    public function setUp(): void
    {
        $this->testClient = static::createClient();
        $this->databaseTool = $this->testClient->getContainer()->get(DatabaseToolCollection::class)->get();
    }

    public function testWhenGoodData()
    {
        $this->databaseTool->loadFixtures([ConfirmedUserFixtures::class]);

        $client = static::createClient();

        $response = $client->request('POST', '/authentication_token', [
            'json' => [
                "username" => "john",
                "password" => "password"
            ]
        ]);

        $token = json_decode($response->getContent(), true)['token'];

        $client->request('PUT', '/api/users/1/change-password', [
            'json' => [
                "oldPassword" => "password",
                "plainPassword" => "newpassword"
            ],
            'auth_bearer' => $token
        ]);

        $this->assertResponseIsSuccessful();

        $client->request('POST', '/authentication_token', [
            'json' => [
                "username" => "john",
                "password" => "newpassword"
            ]
        ]);

        $this->assertResponseIsSuccessful();
    }

    public function testWhenBadData()
    {
        $this->databaseTool->loadFixtures([ConfirmedUserFixtures::class]);

        $client = static::createClient();

        $response = $client->request('POST', '/authentication_token', [
            'json' => [
                "username" => "john",
                "password" => "password"
            ]
        ]);

        $token = json_decode($response->getContent(), true)['token'];

        $client->request('PUT', '/api/users/1/change-password', [
            'json' => [
                "oldPassword" => "badpassword",
                "plainPassword" => "newpassword"
            ],
            'auth_bearer' => $token
        ]);

        $this->assertResponseStatusCodeSame(422);
    }
}
