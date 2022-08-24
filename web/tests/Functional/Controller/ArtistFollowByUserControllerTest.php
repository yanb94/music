<?php

namespace App\Tests\Functional\Controller;

use Symfony\Contracts\HttpClient\ResponseInterface;
use App\DataFixtures\TwoUserWithArtistAndSongFixtures;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\Client;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;

class ArtistFollowByUserControllerTest extends ApiTestCase
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

    private function getRequestListArtistFollow(Client $client, string $token): ResponseInterface
    {
        return $client->request(
            'GET',
            "/api/artists/followed",
            [
                "headers" => [
                    "Accept" => "application/ld+json",
                    'Content-Type' => 'application/json'
                ],
                'auth_bearer' => $token
            ]
        );
    }

    public function testWhenGoodRequest(): void
    {
        $this->databaseTool->loadFixtures([TwoUserWithArtistAndSongFixtures::class]);

        $client = $this->testClient;

        $token = $this->getAuthToken($client);

        $result = $this->getRequestAddFollower($client, 'artist-1', $token);
        $this->assertResponseStatusCodeSame(200);
        $nbFollowers = json_decode($result->getContent(), true)['nbFollowers'];
        $this->assertSame(1, $nbFollowers);

        $result = $this->getRequestListArtistFollow($client, $token);
        $nbArtistFollow = json_decode($result->getContent(), true)['hydra:member'];
        $this->assertSame(1, count($nbArtistFollow));
    }

    public function testWhenNoAuth(): void
    {
        $this->databaseTool->loadFixtures([TwoUserWithArtistAndSongFixtures::class]);

        $client = $this->testClient;
        $this->getRequestListArtistFollow($client, '');

        $this->assertResponseStatusCodeSame(401);
    }
}
