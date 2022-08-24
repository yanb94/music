<?php

namespace App\Tests\Functional\Controller;

use App\DataFixtures\ConfirmedUserAndArtistFixtures;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\Client;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;

class DeleteArtistControllerTest extends ApiTestCase
{
    /** @var AbstractDatabaseTool */
    protected $databaseTool;

    private $testClient = null;

    public function setUp(): void
    {
        $this->testClient = static::createClient();
        $this->databaseTool = $this->testClient->getContainer()->get(DatabaseToolCollection::class)->get();
    }

    private function getAuthToken(Client $client, string $username): string
    {
        $response = $client->request('POST', '/authentication_token', [
            'json' => [
                "username" => $username,
                "password" => "password"
            ]
        ]);

        return json_decode($response->getContent(), true)['token'];
    }

    private function getAuthTokenForGoodUser(Client $client): string
    {
        return $this->getAuthToken($client, "john");
    }

    private function getAuthTokenForBadUser(Client $client): string
    {
        return $this->getAuthToken($client, "henri");
    }

    private function assertNbArtistsOnRequest(Client $client, int $nb)
    {
        $list = json_decode($client->request("GET", "/api/artists")->getContent(), true);
        $this->assertSame($nb, $list['hydra:totalItems']);
    }

    public function testArtistIsDelete(): void
    {
        $this->databaseTool->loadFixtures([ConfirmedUserAndArtistFixtures::class]);

        $client = $this->testClient;

        $token = $this->getAuthTokenForGoodUser($client);

        $this->assertNbArtistsOnRequest($client, 1);

        $client->request("DELETE", "/api/artists/artist-1", [
            'auth_bearer' => $token,
        ]);
        $this->assertResponseStatusCodeSame(204);

        $this->assertNbArtistsOnRequest($client, 0);
    }

    public function testArtistCanNotBeDeletedByNoAuthorUser()
    {
        $this->databaseTool->loadFixtures([ConfirmedUserAndArtistFixtures::class]);

        $client = $this->testClient;

        $token = $this->getAuthTokenForBadUser($client);

        $this->assertNbArtistsOnRequest($client, 1);

        $client->request("DELETE", "/api/artists/artist-1", [
            'auth_bearer' => $token,
        ]);
        $this->assertResponseStatusCodeSame(403);

        $this->assertNbArtistsOnRequest($client, 1);
    }
}
