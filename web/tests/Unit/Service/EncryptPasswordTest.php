<?php

namespace App\Tests\Unit\Service;

use DateTime;
use App\Entity\User;
use PHPUnit\Framework\TestCase;
use App\Service\EncryptPassword;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasher;

class EncryptPasswordTest extends TestCase
{
    private function getValidUser(): User
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

    public function testEncryptIsUsed()
    {
        $passwordHasher = $this->getMockBuilder(UserPasswordHasher::class)->disableOriginalConstructor()->getMock();

        $passwordHasher->expects($this->once())->method('hashPassword');

        /** @var UserPasswordHasher */
        $passwordHasher = $passwordHasher;

        $encryptPassword = new EncryptPassword($passwordHasher);

        $encryptPassword->encrypt($this->getValidUser(), "password");
    }
}
