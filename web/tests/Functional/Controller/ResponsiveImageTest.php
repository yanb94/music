<?php

namespace App\Tests\Functional\Controller;

use App\DataFixtures\PlaylistFixtures;
use Symfony\Contracts\HttpClient\ResponseInterface;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\Client;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;

class ResponsiveImageTest extends ApiTestCase
{
    /** @var AbstractDatabaseTool */
    protected $databaseTool;

    private $testClient = null;

    public function setUp(): void
    {
        $this->testClient = static::createClient();
        $this->databaseTool = $this->testClient->getContainer()->get(DatabaseToolCollection::class)->get();
    }

    private function getRequestEntity(Client $client, string $type, string $slug): ResponseInterface
    {
        return $client->request(
            'GET',
            "/api/" . $type . "s/" . $slug,
            [
                "headers" => [
                    "Accept" => "application/ld+json",
                    'Content-Type' => 'application/json'
                ]
            ]
        );
    }

    public function testResponsiveImageForSong(): void
    {
        $this->databaseTool->loadFixtures([PlaylistFixtures::class]);

        $client = $this->testClient;

        $response = $this->getRequestEntity($client, 'song', 'chanson-n0');

        $content = json_decode($response->getContent(), true);

        $responsiveImages = $content['contentImageResponsive'];

        $this->assertStringContainsString('/media/cache/100x90_thumbnail/', $responsiveImages['100x90']);
        $this->assertStringContainsString('/media/cache/120_thumbnail/', $responsiveImages['120x120']);
        $this->assertStringContainsString('/media/cache/150_thumbnail/', $responsiveImages['150x150']);
        $this->assertStringContainsString('/media/cache/200_thumbnail/', $responsiveImages['200x200']);
        $this->assertStringContainsString('/media/cache/250_thumbnail/', $responsiveImages['250x250']);
        $this->assertStringContainsString('/media/cache/850x500_thumbnail/', $responsiveImages['850x500']);
    }

    public function testResponsiveImageForArtist(): void
    {
        $this->databaseTool->loadFixtures([PlaylistFixtures::class]);

        $client = $this->testClient;

        $response = $this->getRequestEntity($client, 'artist', 'artist-1');

        $content = json_decode($response->getContent(), true);

        $responsiveImages = $content['contentImageResponsive'];

        $this->assertStringContainsString('/media/cache/60_thumbnail/', $responsiveImages['60x60']);
        $this->assertStringContainsString('/media/cache/130_thumbnail/', $responsiveImages['130x130']);
        $this->assertStringContainsString('/media/cache/150_thumbnail/', $responsiveImages['150x150']);
    }

    public function testResponsiveImageForPlaylist(): void
    {
        $this->databaseTool->loadFixtures([PlaylistFixtures::class]);

        $client = $this->testClient;

        $response = $this->getRequestEntity($client, 'playlist', 'playlist-1');

        $content = json_decode($response->getContent(), true);

        $responsiveImages = $content['contentImageResponsive'];

        $this->assertStringContainsString('/media/cache/150_thumbnail/', $responsiveImages['150x150']);
        $this->assertStringContainsString('/media/cache/200_thumbnail/', $responsiveImages['200x200']);
        $this->assertStringContainsString('/media/cache/250_thumbnail/', $responsiveImages['250x250']);
    }
}
