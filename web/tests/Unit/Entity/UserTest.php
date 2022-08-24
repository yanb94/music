<?php

namespace App\Tests\Unit\Entity;

use DateTime;
use App\Entity\User;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;

class UserTest extends EntityCase
{
    /** @var AbstractDatabaseTool */
    protected $databaseTool;

    public function setUp(): void
    {
        parent::setUp();

        self::bootKernel();

        $this->databaseTool = static::getContainer()->get(DatabaseToolCollection::class)->get();

        $this->databaseTool->loadFixtures();
    }

    private function getValidEntity(): User
    {
        return (new User())
            ->setEmail("johh@doe.fr")
            ->setFirstname("john")
            ->setLastname('doe')
            ->setUsername("john")
            ->setSexe("m")
            ->setBirthday(new DateTime('- 27 years'))
            ->setPlainPassword("password")
        ;
    }

    public function testFirstname(): void
    {
        $user = $this->getValidEntity();

        // Valid firstname
        $this->assertHasErrors($user, 0, ['post','patch']);

        // Blank Firstname
        $user->setFirstname("");
        $this->assertHasErrors($user, 2, ['post','patch']);

        // Too short Firstname
        $user->setFirstname("a");
        $this->assertHasErrors($user, 1, ['post','patch']);

        // Too long Firstname
        $user->setFirstname("Lorem ipsum dolor sit amet consectetur adipiscing elit vel");
        $this->assertHasErrors($user, 1, ['post','patch']);

        // Bad characters
        $user->setFirstname("Henri40");
        $this->assertHasErrors($user, 1, ['post','patch']);
    }

    public function testLastname(): void
    {
        $user = $this->getValidEntity();

        // Valid Lastname
        $this->assertHasErrors($user, 0, ["post", "patch"]);

        // Blank Lastname
        $user->setLastname("");
        $this->assertHasErrors($user, 2, ["post", "patch"]);

        // Too short Lastname
        $user->setLastname("a");
        $this->assertHasErrors($user, 1, ["post", "patch"]);

        // Too long Lastname
        $user->setLastname("Lorem ipsum dolor sit amet consectetur adipiscing elit vel");
        $this->assertHasErrors($user, 1, ["post", "patch"]);

        // Bad characters
        $user->setLastname("Henri?");
        $this->assertHasErrors($user, 1, ["post", "patch"]);
    }

    public function testUsername(): void
    {
        $user = $this->getValidEntity();

        // Valid Username
        $this->assertHasErrors($user, 0, ['post']);

        // Blank Username
        $user->setUsername("");
        $this->assertHasErrors($user, 2, ['post']);

        // Too short Username
        $user->setUsername("a");
        $this->assertHasErrors($user, 1, ['post']);

        // Too long Username
        $user->setUsername("Lorem ipsum dolor sit amet consectetur adipiscing elit vel");
        $this->assertHasErrors($user, 1, ['post']);

        // Bad characters
        $user->setUsername("Olu$");
        $this->assertHasErrors($user, 1, ['post']);
    }

    public function testEmail(): void
    {
        $user = $this->getValidEntity();

        // Valid Email
        $this->assertHasErrors($user, 0, ['post']);

        // Blank Email
        $user->setEmail("");
        $this->assertHasErrors($user, 1, ['post']);

        // Not Valid Email
        $user->setEmail("bloblo");
        $this->assertHasErrors($user, 1, ['post']);
    }

    public function testSexe(): void
    {
        $user = $this->getValidEntity();

        // Valid Sexe
        $this->assertHasErrors($user, 0, ['post', 'patch']);

        // Valid Female
        $user->setSexe("f");
        $this->assertHasErrors($user, 0, ['post', 'patch']);

        // No valid value
        $user->setSexe("w");
        $this->assertHasErrors($user, 1, ['post', 'patch']);

        // Blank Value
        $user->setSexe("");
        $this->assertHasErrors($user, 2, ['post', 'patch']);
    }

    public function testPlainPassword(): void
    {
        $user = $this->getValidEntity();

        // Valid PlainPassword
        $this->assertHasErrors($user, 0, ['post']);

        // Blank PlainPassword
        $user->setPlainPassword("");
        $this->assertHasErrors($user, 1, ['post']);

        // Too short PlainPassword
        $user->setPlainPassword("aaaa");
        $this->assertHasErrors($user, 1, ['post']);

        // Too long PlainPassword
        $user->setPlainPassword("Lorem ipsum dolor sit amet");
        $this->assertHasErrors($user, 1, ['post']);
    }

    public function testBirthday(): void
    {
        $user = $this->getValidEntity();

        // Valid Birthday
        $this->assertHasErrors($user, 0, ['post', 'patch']);

        // Invalid Birthday
        $user->setBirthday(new DateTime("now"));
        $this->assertHasErrors($user, 1, ['post', 'patch']);
    }
}
