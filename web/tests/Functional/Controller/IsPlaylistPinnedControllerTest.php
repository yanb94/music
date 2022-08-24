<?php

namespace App\Tests\Functional\Controller;

use App\DataFixtures\PlaylistFixtures;
use Symfony\Contracts\HttpClient\ResponseInterface;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\Client;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;

class IsPlaylistPinnedControllerTest extends ApiTestCase
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

    private function getRequestIsPinned(Client $client, string $slug, string $token): ResponseInterface
    {
        return $client->request(
            'GET',
            "/api/playlists/" . $slug . "/is-pinned",
            [
                "headers" => [
                    "Accept" => "application/ld+json",
                    'Content-Type' => 'application/json'
                ],
                'auth_bearer' => $token
            ]
        );
    }

    public function testPlaylistIsPinned(): void
    {
        $this->databaseTool->loadFixtures([PlaylistFixtures::class]);

        $client = $this->testClient;
        $token = $this->getAuthToken($client);

        $this->getRequestPinPlaylist($client, 'playlist-1', $token);
        $this->assertResponseStatusCodeSame(200);

        $result = $this->getRequestIsPinned($client, 'playlist-1', $token);
        $this->assertResponseStatusCodeSame(200);

        $isPinned = json_decode($result->getContent(), true)['isPinned'];

        $this->assertTrue($isPinned);
    }

    public function testPlaylistIsNotPinned(): void
    {
        $this->databaseTool->loadFixtures([PlaylistFixtures::class]);

        $client = $this->testClient;
        $token = $this->getAuthToken($client);

        $result = $this->getRequestIsPinned($client, 'playlist-1', $token);
        $this->assertResponseStatusCodeSame(200);

        $isPinned = json_decode($result->getContent(), true)['isPinned'];

        $this->assertFalse($isPinned);
    }

    public function testWhenNoAuth(): void
    {
        $this->databaseTool->loadFixtures([PlaylistFixtures::class]);

        $client = $this->testClient;
        $this->getRequestIsPinned($client, 'playlist-1', '');
        $this->assertResponseStatusCodeSame(401);
    }
}
