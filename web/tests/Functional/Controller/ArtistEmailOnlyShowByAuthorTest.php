<?php

namespace App\Tests\Functional\Controller;

use Symfony\Contracts\HttpClient\ResponseInterface;
use App\DataFixtures\TwoUserWithArtistAndSongFixtures;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\Client;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;

class ArtistEmailOnlyShowByAuthorTest extends ApiTestCase
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

    private function getRequestGetArtist(Client $client, string $slug, string $token = null): ResponseInterface
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
            "/api/artists/" . $slug,
            $params
        );
    }

    public function testNoLoggedUserCanSeeArtistEmail(): void
    {
        $this->databaseTool->loadFixtures([TwoUserWithArtistAndSongFixtures::class]);

        $client = $this->testClient;
        $result = $this->getRequestGetArtist($client, 'artist-1');

        $data = json_decode($result->getContent(), true);
        $this->assertFalse(isset($data['email']));
    }

    public function testUserLoggedNoAuthorCannotSeeEmail(): void
    {
        $this->databaseTool->loadFixtures([TwoUserWithArtistAndSongFixtures::class]);

        $client = $this->testClient;
        $token = $this->getAuthToken($client, 'henri');
        $result = $this->getRequestGetArtist($client, 'artist-1', $token);

        $data = json_decode($result->getContent(), true);
        $this->assertFalse(isset($data['email']));
    }

    public function testUserLoggedAuthorCanSeeEmail(): void
    {
        $this->databaseTool->loadFixtures([TwoUserWithArtistAndSongFixtures::class]);

        $client = $this->testClient;
        $token = $this->getAuthToken($client, 'john');
        $result = $this->getRequestGetArtist($client, 'artist-1', $token);

        $data = json_decode($result->getContent(), true);
        $this->assertTrue(isset($data['email']), $result->getContent());
    }
}
