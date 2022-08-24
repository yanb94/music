<?php

namespace App\Tests\Functional\Controller;

use App\DataFixtures\ConfirmedUserFixtures;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\Client;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;

class PostArtistControllerTest extends ApiTestCase
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

    public function testPostArtistWorkWhenGoodData(): void
    {
        $this->databaseTool->loadFixtures([ConfirmedUserFixtures::class]);

        $client = $this->testClient;

        $token = $this->getAuthToken($client);

        $file = new UploadedFile(
            path: str_replace("/Functional", "/files", dirname(__DIR__)) . "/image.jpg",
            originalName: "name.jpeg",
            mimeType: "image/jpeg",
            test: true
        );

        $client->request('POST', "/api/artists", [
            "headers" => [
                "Accept" => "application/json",
                'Content-Type' => 'multipart/form-data'
            ],
            "extra" => [
                "parameters" => [
                    "name" => "Artist 1",
                    "description" => "Je suis une description",
                    "email" => "example@example.com",
                    "user" => "api/users/1"
                ],
                "files" => [
                    "image" => $file
                ]
            ],
            'auth_bearer' => $token,
        ]);

        $this->assertResponseStatusCodeSame(201);
    }

    public function testPostArtistWorkWhenBadData()
    {
        $this->databaseTool->loadFixtures([ConfirmedUserFixtures::class]);

        $client = $this->testClient;

        $token = $this->getAuthToken($client);

        $file = new UploadedFile(
            path: str_replace("/Functional", "/files", dirname(__DIR__)) . "/text.txt",
            originalName: "text.txt",
            mimeType: "text/plain",
            test: true
        );

        $client->request('POST', "/api/artists", [
            "headers" => [
                "Accept" => "application/json",
                'Content-Type' => 'multipart/form-data'
            ],
            "extra" => [
                "parameters" => [
                    "name" => "Artist 1",
                    "description" => "Je suis une description",
                    "email" => "example@example.com",
                    "user" => "api/users/1"
                ],
                "files" => [
                    "image" => $file
                ]
            ],
            'auth_bearer' => $token,
        ]);

        $this->assertResponseStatusCodeSame(422);
    }
}
