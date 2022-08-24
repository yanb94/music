<?php

namespace App\Tests\Functional\Controller;

use App\DataFixtures\PlaylistFixtures;
use Symfony\Contracts\HttpClient\ResponseInterface;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\Client;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;

class PlaylistStatsControllerTest extends ApiTestCase
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

    private function getBadAuthToken(Client $client): string
    {
        $response = $client->request('POST', '/authentication_token', [
            'json' => [
                "username" => "henri",
                "password" => "password"
            ]
        ]);

        return json_decode($response->getContent(), true)['token'];
    }

    private function getRequestStatsForPlaylist(Client $client, string $slug, string $token): ResponseInterface
    {
        return $client->request(
            'GET',
            "/api/playlists/" . $slug . "/stats",
            [
                "headers" => [
                    "Accept" => "application/ld+json",
                    'Content-Type' => 'application/json'
                ],
                'auth_bearer' => $token
            ]
        );
    }

    public function testWhenRequestSuccess(): void
    {
        $this->databaseTool->loadFixtures([PlaylistFixtures::class]);

        $client = $this->testClient;
        $token = $this->getAuthToken($client);

        $result = $this->getRequestStatsForPlaylist($client, 'playlist-1', $token);

        $this->assertResponseStatusCodeSame(200);

        $data = json_decode($result->getContent(), true);

        $this->assertTrue(isset($data['dates']));
        $this->assertTrue(isset($data['views']));

        $this->assertSame(count($data['dates']), count($data['views']));

        $this->assertSame(8, count($data['dates']));
    }

    public function testWhenNoAuth(): void
    {
        $this->databaseTool->loadFixtures([PlaylistFixtures::class]);

        $client = $this->testClient;

        $this->getRequestStatsForPlaylist($client, 'playlist-1', '');

        $this->assertResponseStatusCodeSame(401);
    }

    public function testWhenBadAuth(): void
    {
        $this->databaseTool->loadFixtures([PlaylistFixtures::class]);

        $client = $this->testClient;
        $token = $this->getBadAuthToken($client);

        $this->getRequestStatsForPlaylist($client, 'playlist-1', $token);

        $this->assertResponseStatusCodeSame(403);
    }
}
