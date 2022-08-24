<?php

namespace App\Tests\Functional\Controller;

use App\DataFixtures\PlaylistFixtures;
use Symfony\Contracts\HttpClient\ResponseInterface;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\Client;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;

class MyPlaylistsControllerTest extends ApiTestCase
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
                "username" => 'john',
                "password" => "password"
            ]
        ]);

        return json_decode($response->getContent(), true)['token'];
    }

    private function getListOfPlaylist(Client $client, string $token): ResponseInterface
    {
        return $client->request('GET', "/api/playlists/my_playlists", [
            "headers" => [
                "Accept" => "application/ld+json",
                'Content-Type' => 'application/json'
            ],
            'auth_bearer' => $token,
        ]);
    }

    public function testGetPlaylistOfTheCurrentUser()
    {
        $this->databaseTool->loadFixtures([PlaylistFixtures::class]);

        $client = $this->testClient;
        $token = $this->getAuthToken($client);

        $response = $this->getListOfPlaylist($client, $token);
        $responseData = json_decode($response->getContent(), true);

        $this->assertSame(1, $responseData['hydra:member'][0]['id']);
    }
}
