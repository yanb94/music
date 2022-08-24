<?php

namespace App\Tests\Functional\Controller;

use App\DataFixtures\PlaylistFixtures;
use Symfony\Contracts\HttpClient\ResponseInterface;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\Client;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;

class ArtistStatsControllerTest extends ApiTestCase
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

    private function getRequestMyStats(Client $client, string $token): ResponseInterface
    {
        return $client->request(
            'GET',
            "/api/users/my-stats",
            [
                "headers" => [
                    "Accept" => "application/ld+json",
                    'Content-Type' => 'application/json'
                ],
                'auth_bearer' => $token
            ]
        );
    }

    public function testIsNoAuth(): void
    {
        $this->databaseTool->loadFixtures([PlaylistFixtures::class]);
        $client = $this->testClient;

        $this->getRequestMyStats($client, '');

        $this->assertResponseStatusCodeSame(401);
    }

    public function testAuthWithNoArtist(): void
    {
        $this->databaseTool->loadFixtures([PlaylistFixtures::class]);
        $client = $this->testClient;
        $token = $this->getBadAuthToken($client);

        $this->getRequestMyStats($client, $token);

        $this->assertResponseStatusCodeSame(403);
    }

    public function testRequestReturnWaitedElement(): void
    {
        $this->databaseTool->loadFixtures([PlaylistFixtures::class]);
        $client = $this->testClient;
        $token = $this->getAuthToken($client);

        $result = $this->getRequestMyStats($client, $token);

        $datas = json_decode($result->getContent(), true);

        $this->assertSame(3, $datas['nbSongs']);
        $this->assertSame(1, $datas['nbPlaylists']);
        $this->assertSame(0, $datas['nbFollowers']);

        $this->assertSame(8, count($datas['viewsPlaylists']['dates']));
        $this->assertSame(8, count($datas['viewsPlaylists']['views']));

        $this->assertSame(8, count($datas['viewsSongs']['dates']));
        $this->assertSame(8, count($datas['viewsSongs']['views']));
        $this->assertSame(0, $datas['upcomingIncome']);
    }
}
