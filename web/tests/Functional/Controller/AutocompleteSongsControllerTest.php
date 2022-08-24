<?php

namespace App\Tests\Functional\Controller;

use Symfony\Contracts\HttpClient\ResponseInterface;
use App\DataFixtures\TwoUserWithArtistAndSongFixtures;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\Client;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;

class AutocompleteSongsControllerTest extends ApiTestCase
{
    /** @var AbstractDatabaseTool */
    protected $databaseTool;

    private $testClient = null;

    public function setUp(): void
    {
        $this->testClient = static::createClient();
        $this->databaseTool = $this->testClient->getContainer()->get(DatabaseToolCollection::class)->get();
    }

    private function getAutocompleteSongs(Client $client, ?string $param): ResponseInterface
    {
        return $client->request(
            'GET',
            "/api/songs/autocomplete" . (!is_null($param) ? "?s=" . $param : ""),
            [
                "headers" => [
                    "Accept" => "application/ld+json",
                    'Content-Type' => 'application/json'
                ]
            ]
        );
    }

    public function testReturn404WhenNoParams(): void
    {
        $this->databaseTool->loadFixtures([TwoUserWithArtistAndSongFixtures::class]);

        $client = $this->testClient;

        $this->getAutocompleteSongs($client, null);

        $this->assertResponseStatusCodeSame(404);
    }

    public function testReturnWaitedSongsWhenParam(): void
    {
        $this->databaseTool->loadFixtures([TwoUserWithArtistAndSongFixtures::class]);

        $client = $this->testClient;

        $response = $this->getAutocompleteSongs($client, "Chanson 1");

        $data = json_decode($response->getContent(), true);

        $this->assertResponseStatusCodeSame(200);
        $this->assertSame(1, $data['hydra:totalItems']);
        $this->assertSame("Chanson 1", $data['hydra:member'][0]['name']);
    }

    public function testReturnSongWithNameSimilarToTheKeyword(): void
    {
        $this->databaseTool->loadFixtures([TwoUserWithArtistAndSongFixtures::class]);

        $client = $this->testClient;

        $response = $this->getAutocompleteSongs($client, "Chanson");

        $data = json_decode($response->getContent(), true);

        $this->assertResponseStatusCodeSame(200);
        $this->assertSame(6, $data['hydra:totalItems']);
    }
}
