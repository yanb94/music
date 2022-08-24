<?php

namespace App\Tests\Functional\Controller;

use App\DataFixtures\TwoUserWithArtistAndSongFixtures;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;

class ViewSongControllerTest extends ApiTestCase
{
    /** @var AbstractDatabaseTool */
    protected $databaseTool;

    private $testClient = null;

    public function setUp(): void
    {
        $this->testClient = static::createClient();
        $this->databaseTool = $this->testClient->getContainer()->get(DatabaseToolCollection::class)->get();
    }

    public function testViewAddedHasExpected(): void
    {
        $this->databaseTool->loadFixtures([TwoUserWithArtistAndSongFixtures::class]);

        $client = static::createClient();

        $response = $client->request('POST', "/api/view_song", [
            "headers" => [
                "Accept" => "application/json",
                'Content-Type' => 'application/json'
            ],
            'json' => [
                "song" => 1
            ]
        ]);

        $msg = json_decode($response->getContent(), true)['info'];

        $this->assertSame('View added', $msg);

        $response = $client->request('GET', "/api/songs/chanson-0", [
            "headers" => [
                "Accept" => "application/ld+json",
                'Content-Type' => 'application/ld+json'
            ]
        ]);

        $nbViews = json_decode($response->getContent(), true)['nbViews'];

        $this->assertSame(1, $nbViews);
    }
}
