<?php

namespace App\Tests\Functional\Controller;

use App\DataFixtures\PlaylistFixtures;
use App\DataFixtures\ConfirmedUserFixtures;
use Symfony\Contracts\HttpClient\ResponseInterface;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\Client;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;

class PlaylistPutControllerTest extends ApiTestCase
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

    private function goodFile(): UploadedFile
    {
        return new UploadedFile(
            path: str_replace("/Functional", "/files", dirname(__DIR__)) . "/image.jpg",
            originalName: "name.jpeg",
            mimeType: "image/jpeg",
            test: true
        );
    }

    private function badFile(): UploadedFile
    {
        return new UploadedFile(
            path: str_replace("/Functional", "/files", dirname(__DIR__)) . "/text.txt",
            originalName: "text.txt",
            mimeType: "text/plain",
            test: true
        );
    }

    private function getInitialEntity(Client $client, string $token): ResponseInterface
    {
        return $client->request('GET', "/api/playlists/playlist-1", [
            "headers" => [
                "Accept" => "application/json",
                'Content-Type' => 'application/json'
            ],
            'auth_bearer' => $token,
        ]);
    }

    private function makeRequest(
        Client $client,
        UploadedFile $imageFile,
        string $json,
        string $token
    ): ResponseInterface {
        return $client->request('POST', "/api/playlists/playlist-1", [
            "headers" => [
                "Accept" => "application/json",
                'Content-Type' => 'multipart/form-data'
            ],
            "extra" => [
                "parameters" => [
                    "json" => $json
                ],
                "files" => [
                    "imageFile" => $imageFile
                ]
            ],
            'auth_bearer' => $token,
        ]);
    }

    public function testPutPlaylistWorkWhenGoodData(): void
    {
        $this->databaseTool->loadFixtures([PlaylistFixtures::class]);

        $client = $this->testClient;
        $token = $this->getAuthToken($client);

        $initalEntity = $this->getInitialEntity($client, $token);
        $initialData = json_decode($initalEntity->getContent(), true);

        $imageFile = $this->goodFile();
        $jsonData = '{ "name": "Playlist Test","isPublic": true,"songs": [ { "id": 1 }, { "id": 2 } ] }';

        $response = $this->makeRequest($client, $imageFile, $jsonData, $token);
        $returnData = json_decode($response->getContent(), true);

        $this->assertSame(2, count($returnData['songs']));
        $this->assertSame(2, $returnData['nbSongs']);
        $totalDuration = $returnData['songs'][0]['songDuration'] + $returnData['songs'][1]['songDuration'];
        $this->assertSame($totalDuration, $returnData['duration']);
        $this->assertNotSame($initialData['contentImageUrl'], $returnData['contentImageUrl']);
        $this->assertSame("Playlist Test", $returnData['name']);
        $this->assertResponseStatusCodeSame(200);
    }

    public function testPutPlaylistWorkWhenBadFile(): void
    {
        $this->databaseTool->loadFixtures([PlaylistFixtures::class]);

        $client = $this->testClient;
        $token = $this->getAuthToken($client);

        $imageFile = $this->badFile();
        $jsonData = '{ "name": "Playlist 1","isPublic": true,"songs": [ { "id": 1 }, { "id": 2 } ] }';

        $this->makeRequest($client, $imageFile, $jsonData, $token);

        $this->assertResponseStatusCodeSame(422);
    }

    public function testPutPlaylistWorkWhenBadData(): void
    {
        $this->databaseTool->loadFixtures([PlaylistFixtures::class]);

        $client = $this->testClient;
        $token = $this->getAuthToken($client);

        $imageFile = $this->goodFile();
        $jsonData = '{ "name": "","isPublic": true,"songs": [ { "id": 1 }, { "id": 2 } ] }';

        $this->makeRequest($client, $imageFile, $jsonData, $token);

        $this->assertResponseStatusCodeSame(422);
    }
}
