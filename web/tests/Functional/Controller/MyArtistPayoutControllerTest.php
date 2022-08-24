<?php

namespace App\Tests\Functional\Controller;

use App\DataFixtures\InvoiceAndPayoutFixtures;
use Symfony\Contracts\HttpClient\ResponseInterface;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\Client;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;

class MyArtistPayoutControllerTest extends ApiTestCase
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

    private function getListPayout(Client $client, string $token): ResponseInterface
    {
        return $client->request('GET', "/api/artist_payouts/my_payement", [
            "headers" => [
                "Accept" => "application/ld+json",
                'Content-Type' => 'application/ld+json'
            ],
            'auth_bearer' => $token,
        ]);
    }

    private function processTestUserGetItsPayoutOnly($user, $waitedId)
    {
        $this->databaseTool->loadFixtures([InvoiceAndPayoutFixtures::class]);

        $client = $this->testClient;
        $token = $this->getAuthToken($client, $user);

        $response = $this->getListPayout($client, $token);
        $responseData = json_decode($response->getContent(), true);

        $this->assertSame($waitedId, $responseData['hydra:member'][0]['id']);
    }

    public function testGetMyListOfPayoutForUser1(): void
    {
        $this->processTestUserGetItsPayoutOnly('john', 1);
    }

    public function testGetMyListOfPayoutForUser2(): void
    {
        $this->processTestUserGetItsPayoutOnly('henri', 2);
    }
}
