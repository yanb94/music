<?php

namespace App\Tests\Functional\Controller;

use Symfony\Contracts\HttpClient\ResponseInterface;
use App\DataFixtures\TwoUserWithArtistAndSongFixtures;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\Client;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;

class SongAccessSubscriberTest extends ApiTestCase
{
    /** @var AbstractDatabaseTool */
    protected $databaseTool;

    private $testClient = null;

    public function setUp(): void
    {
        $this->testClient = static::createClient();
        $this->databaseTool = $this->testClient->getContainer()->get(DatabaseToolCollection::class)->get();
    }

    private function getAuthTokenSubscribe(Client $client): string
    {
        $response = $client->request('POST', '/authentication_token', [
            'json' => [
                "username" => "henri",
                "password" => "password"
            ]
        ]);

        return json_decode($response->getContent(), true)['token'];
    }

    private function getAuthTokenUnSubscribe(Client $client): string
    {
        $response = $client->request('POST', '/authentication_token', [
            'json' => [
                "username" => "john",
                "password" => "password"
            ]
        ]);

        return json_decode($response->getContent(), true)['token'];
    }

    private function getRequestGetSong(Client $client, string $slug, string $token = null): ResponseInterface
    {
        $params = [
            "headers" => [
                "Accept" => "application/ld+json",
                'Content-Type' => 'application/json'
            ],
            'auth_bearer' => $token
        ];

        if ($token != null) {
            $params['auth_bearer'] = $token;
        }

        return $client->request(
            'GET',
            "/api/songs/" . $slug,
            $params
        );
    }

    public function testWhenUserIsNoLogged(): void
    {
        $this->databaseTool->loadFixtures([TwoUserWithArtistAndSongFixtures::class]);

        $client = $this->testClient;

        $result = $this->getRequestGetSong($client, 'chanson-1');

        $data = json_decode($result->getContent(), true);

        $this->assertFalse(isset($data['contentSongUrl']));
    }

    public function testWhenUserSubscribe(): void
    {
        $this->databaseTool->withDatabaseCacheEnabled(false)->loadFixtures([TwoUserWithArtistAndSongFixtures::class]);

        $client = $this->testClient;
        $token = $this->getAuthTokenSubscribe($client);

        $result = $this->getRequestGetSong($client, 'chanson-1', $token);
        $data = json_decode($result->getContent(), true);

        $this->assertTrue(isset($data['contentSongUrl']));
    }

    public function testWhenUserNotSubscribe(): void
    {
        $this->databaseTool->loadFixtures([TwoUserWithArtistAndSongFixtures::class]);

        $client = $this->testClient;
        $token = $this->getAuthTokenUnSubscribe($client);

        $result = $this->getRequestGetSong($client, 'chanson-5', $token);
        $data = json_decode($result->getContent(), true);

        $this->assertFalse(isset($data['contentSongUrl']));
    }

    public function testWhenUserNotSubscribeButAuthorOfSong(): void
    {
        $this->databaseTool->loadFixtures([TwoUserWithArtistAndSongFixtures::class]);

        $client = $this->testClient;
        $token = $this->getAuthTokenUnSubscribe($client);

        $result = $this->getRequestGetSong($client, 'chanson-1', $token);
        $data = json_decode($result->getContent(), true);

        $this->assertTrue(isset($data['contentSongUrl']));
    }
}
