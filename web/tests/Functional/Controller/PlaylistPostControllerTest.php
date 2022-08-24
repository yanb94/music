<?php

namespace App\Tests\Functional\Controller;

use App\DataFixtures\ConfirmedUserFixtures;
use App\DataFixtures\TwoUserWithArtistAndSongFixtures;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\Client;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;

class PlaylistPostControllerTest extends ApiTestCase
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

    public function testPostPlaylistWorkWhenGoodData(): void
    {
        $this->databaseTool->loadFixtures([TwoUserWithArtistAndSongFixtures::class]);

        $client = $this->testClient;

        $token = $this->getAuthToken($client);

        $imageFile = new UploadedFile(
            path: str_replace("/Functional", "/files", dirname(__DIR__)) . "/image.jpg",
            originalName: "name.jpeg",
            mimeType: "image/jpeg",
            test: true
        );

        $response = $client->request('POST', "/api/playlists", [
            "headers" => [
                "Accept" => "application/json",
                'Content-Type' => 'multipart/form-data'
            ],
            "extra" => [
                "parameters" => [
                    "json" => '{ "name": "Playlist 1","isPublic": true,"songs": [ { "id": 1 }, { "id": 2 } ] }'
                ],
                "files" => [
                    "imageFile" => $imageFile
                ]
            ],
            'auth_bearer' => $token,
        ]);

        $returnData = json_decode($response->getContent(), true);



        $this->assertSame(2, count($returnData['songs']));
        $this->assertSame(2, $returnData['nbSongs']);

        $totalDuration = $returnData['songs'][0]['songDuration'] + $returnData['songs'][1]['songDuration'];
        $this->assertSame($totalDuration, $returnData['duration']);

        $this->assertResponseStatusCodeSame(201);
    }

    public function testPostPlaylistWorkWhenBadFile(): void
    {
        $this->databaseTool->loadFixtures([TwoUserWithArtistAndSongFixtures::class]);

        $client = $this->testClient;

        $token = $this->getAuthToken($client);

        $imageFile = new UploadedFile(
            path: str_replace("/Functional", "/files", dirname(__DIR__)) . "/text.txt",
            originalName: "text.txt",
            mimeType: "text/plain",
            test: true
        );

        $client->request('POST', "/api/playlists", [
            "headers" => [
                "Accept" => "application/json",
                'Content-Type' => 'multipart/form-data'
            ],
            "extra" => [
                "parameters" => [
                    "json" => '{ "name": "Playlist 1","isPublic": true,"songs": [ { "id": 1 }, { "id": 2 } ] }'
                ],
                "files" => [
                    "imageFile" => $imageFile
                ]
            ],
            'auth_bearer' => $token,
        ]);

        $this->assertResponseStatusCodeSame(422);
    }

    public function testPostPlaylistWorkWhenBadData(): void
    {
        $this->databaseTool->loadFixtures([TwoUserWithArtistAndSongFixtures::class]);

        $client = $this->testClient;

        $token = $this->getAuthToken($client);

        $imageFile = new UploadedFile(
            path: str_replace("/Functional", "/files", dirname(__DIR__)) . "/image.jpg",
            originalName: "name.jpeg",
            mimeType: "image/jpeg",
            test: true
        );

        $client->request('POST', "/api/playlists", [
            "headers" => [
                "Accept" => "application/json",
                'Content-Type' => 'multipart/form-data'
            ],
            "extra" => [
                "parameters" => [
                    "json" => '{ "name": "","isPublic": true,"songs": [ { "id": 1 }, { "id": 2 } ] }'
                ],
                "files" => [
                    "imageFile" => $imageFile
                ]
            ],
            'auth_bearer' => $token,
        ]);

        $this->assertResponseStatusCodeSame(422);
    }
}
