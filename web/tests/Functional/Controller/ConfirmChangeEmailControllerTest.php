<?php

namespace App\Tests\Functional\Controller;

use App\DataFixtures\ChangeEmailFixtures;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;

class ConfirmChangeEmailControllerTest extends ApiTestCase
{
    /** @var AbstractDatabaseTool */
    protected $databaseTool;

    private $testClient = null;

    public function setUp(): void
    {
        $this->testClient = static::createClient();
        $this->databaseTool = $this->testClient->getContainer()->get(DatabaseToolCollection::class)->get();
    }

    public function testConfirmChangeEmailTokenNotExist(): void
    {
        $this->databaseTool->loadFixtures([]);

        $client = $this->testClient;

        $client->request('GET', '/api/users/BADTOKEN/confirmation-change-email');

        $this->assertResponseStatusCodeSame(404);
    }

    public function testConfirmChangeTokenExist(): void
    {
        $this->databaseTool->loadFixtures([ChangeEmailFixtures::class]);

        $client = $this->testClient;

        $response = $client->request('GET', '/api/users/GOODTOKEN/confirmation-change-email');

        $this->assertResponseStatusCodeSame(200);

        $email = json_decode($response->getContent(), true)['email'];

        $this->assertSame("newEmail@newEmail.com", $email);
    }
}
