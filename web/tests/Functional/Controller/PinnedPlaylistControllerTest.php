<?php

namespace App\Tests\Functional\Controller;

use App\DataFixtures\PlaylistFixtures;
use Symfony\Contracts\HttpClient\ResponseInterface;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\Client;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;

class PinnedPlaylistControllerTest extends ApiTestCase
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

    private function getRequestPinPlaylist(Client $client, string $slug, string $token): ResponseInterface
    {
        return $client->request(
            'GET',
            "/api/playlists/" . $slug . "/pin",
            [
                "headers" => [
                    "Accept" => "application/ld+json",
                    'Content-Type' => 'application/json'
                ],
                'auth_bearer' => $token
            ]
        );
    }

    private function getRequestPinnedPlaylist(Client $client, string $token): ResponseInterface
    {
        return $client->request(
            'GET',
            "/api/playlists/pinned",
            [
                "headers" => [
                    "Accept" => "application/ld+json",
                    'Content-Type' => 'application/json'
                ],
                'auth_bearer' => $token
            ]
        );
    }

    public function testGetListOfPinnedPlaylist(): void
    {
        $this->databaseTool->loadFixtures([PlaylistFixtures::class]);

        $client = $this->testClient;
        $token = $this->getAuthToken($client);

        $this->getRequestPinPlaylist($client, 'playlist-1', $token);
        $this->assertResponseStatusCodeSame(200);

        $result = $this->getRequestPinnedPlaylist($client, $token);
        $this->assertResponseStatusCodeSame(200);

        $nbItems = json_decode($result->getContent(), true)['hydra:totalItems'];
        $this->assertSame(1, $nbItems);
    }

    public function testWhenNoAuth(): void
    {
        $this->databaseTool->loadFixtures([PlaylistFixtures::class]);

        $client = $this->testClient;
        $this->getRequestPinnedPlaylist($client, '');
        $this->assertResponseStatusCodeSame(401);
    }
}
