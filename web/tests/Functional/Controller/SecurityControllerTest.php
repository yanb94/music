<?php

namespace App\Tests\Functional\Controller;

use App\Repository\UserRepository;
use App\DataFixtures\ConfirmedUserFixtures;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;

class SecurityControllerTest extends WebTestCase
{
    /** @var AbstractDatabaseTool */
    protected $databaseTool;

    private $testClient = null;

    public function setUp(): void
    {
        $this->testClient = static::createClient();
        $this->databaseTool = $this->testClient->getContainer()->get(DatabaseToolCollection::class)->get();
    }

    public function testLoginPageIsAccessible(): void
    {
        $client = $this->testClient;

        $crawler = $client->request("GET", '/admin/login');

        $this->assertResponseIsSuccessful();

        $this->assertCount(1, $crawler->filter("input#inputUsername"));
        $this->assertCount(1, $crawler->filter("input#inputPassword"));
    }

    public function testLoginPageIsNotAcessibleWhenLogged(): void
    {
        $client = $this->testClient;

        $this->databaseTool->loadFixtures([ConfirmedUserFixtures::class]);

        /** @var UserRepository */
        $userRepository = static::getContainer()->get(UserRepository::class);

        $testUser = $userRepository->findOneBy(["username" => "admin"]);

        $client->loginUser($testUser);

        $client->request("GET", "/admin/login");

        $this->assertResponseRedirects();
    }

    public function testCanLoginWhenAdmin(): void
    {
        $client = $this->testClient;

        $this->databaseTool->loadFixtures([ConfirmedUserFixtures::class]);

        $crawler = $client->request("GET", '/admin/login');

        $form = $crawler->selectButton("Se connecter")->form(
            [
                'username' => "admin",
                'password' => "password"
            ]
        );

        $client->submit($form);

        $crawler = $client->followRedirect();

        $this->assertCount(0, $crawler->filter('.login-form--alert'));
    }

    public function testCannotLoginWhenNotAdmin(): void
    {
        $client = $this->testClient;

        $this->databaseTool->loadFixtures([ConfirmedUserFixtures::class]);

        $crawler = $client->request("GET", '/admin/login');

        $form = $crawler->selectButton("Se connecter")->form(
            [
                'username' => "john",
                'password' => "password"
            ]
        );

        $client->submit($form);

        $crawler = $client->followRedirect();

        $this->assertCount(1, $crawler->filter('.login-form--alert'));
    }
}
