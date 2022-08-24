<?php

namespace App\Tests\Functional\Controller;

use Symfony\Contracts\HttpClient\ResponseInterface;
use App\DataFixtures\TwoUserWithArtistAndSongFixtures;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\Client;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;

class IsFollowerControllerTest extends ApiTestCase
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

    private function getRequestIsFollower(Client $client, string $slug, string $token): ResponseInterface
    {
        return $client->request(
            'GET',
            "/api/artists/is_follower/" . $slug,
            [
                "headers" => [
                    "Accept" => "application/ld+json",
                    'Content-Type' => 'application/json'
                ],
                'auth_bearer' => $token
            ]
        );
    }

    private function getRequestAddFollower(Client $client, string $slug, string $token): ResponseInterface
    {
        return $client->request(
            'GET',
            "/api/artists/add_follower/" . $slug,
            [
                "headers" => [
                    "Accept" => "application/ld+json",
                    'Content-Type' => 'application/json'
                ],
                'auth_bearer' => $token
            ]
        );
    }

    public function testArtistIsNotFollowByUser(): void
    {
        $this->databaseTool->loadFixtures([TwoUserWithArtistAndSongFixtures::class]);

        $client = $this->testClient;

        $token = $this->getAuthToken($client);

        $result = $this->getRequestIsFollower($client, 'artist-1', $token);

        $this->assertResponseStatusCodeSame(200);

        $isFollower = json_decode($result->getContent(), true);

        $this->assertSame(false, $isFollower['isFollower']);
    }

    public function testArtistIsFollowByUser(): void
    {
        $this->databaseTool->loadFixtures([TwoUserWithArtistAndSongFixtures::class]);

        $client = $this->testClient;

        $token = $this->getAuthToken($client);

        $this->getRequestAddFollower($client, 'artist-1', $token);

        $this->assertResponseStatusCodeSame(200);

        $result = $this->getRequestIsFollower($client, 'artist-1', $token);

        $this->assertResponseStatusCodeSame(200);

        $isFollower = json_decode($result->getContent(), true);

        $this->assertSame(true, $isFollower['isFollower']);
    }

    public function testArtistIsNotFound(): void
    {
        $this->databaseTool->loadFixtures([TwoUserWithArtistAndSongFixtures::class]);

        $client = $this->testClient;

        $token = $this->getAuthToken($client);

        $this->getRequestIsFollower($client, 'artist-truc', $token);

        $this->assertResponseStatusCodeSame(404);
    }
}
