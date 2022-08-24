<?php

namespace App\Tests\Functional\Controller;

use App\DataFixtures\TwoUserWithArtistAndSongFixtures;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\Client;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;

class MySongsControllerTest extends ApiTestCase
{
    /** @var AbstractDatabaseTool */
    protected $databaseTool;

    private $testClient = null;

    public function setUp(): void
    {
        $this->testClient = static::createClient();
        $this->databaseTool = $this->testClient->getContainer()->get(DatabaseToolCollection::class)->get();
    }

    private function getAuthToken(Client $client, string $user): string
    {
        $response = $client->request('POST', '/authentication_token', [
            'json' => [
                "username" => $user,
                "password" => "password"
            ]
        ]);

        return json_decode($response->getContent(), true)['token'];
    }

    public function testUserCanOnlySeeTheirSong()
    {
        $this->databaseTool->loadFixtures([TwoUserWithArtistAndSongFixtures::class]);

        $client = $this->testClient;

        $token = $this->getAuthToken($client, "john");

        $response = $client->request('GET', '/api/songs/my_songs', [
            'headers' => [
                "Accept" => "application/json"
            ],
            'auth_bearer' => $token
        ]);

        $songs = json_decode($response->getContent(), true);

        $this->assertCount(3, $songs, $response->getContent());
        $this->assertSame("Chanson 0", $songs[0]['name']);
        $this->assertResponseIsSuccessful();

        $token = $this->getAuthToken($client, "henri");

        $response = $client->request('GET', '/api/songs/my_songs', [
            'headers' => [
                "Accept" => "application/json"
            ],
            'auth_bearer' => $token
        ]);

        $songs = json_decode($response->getContent(), true);

        $this->assertCount(3, $songs, $response->getContent());
        $this->assertSame("Chanson 3", $songs[0]['name']);
        $this->assertResponseIsSuccessful();
    }
}
