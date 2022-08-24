<?php

namespace App\DataFixtures\Init;

use DateTime;
use App\Entity\User;
use App\Service\EncryptPassword;
use App\DataFixtures\Init\InitFixtures;
use Doctrine\Persistence\ObjectManager;

class UserFixtures extends InitFixtures
{
    public function __construct(private EncryptPassword $encryptPassword)
    {
    }

    public function load(ObjectManager $manager): void
    {
        $user = (new User())
            ->setEmail("johh@doe.fr")
            ->setFirstname("Admin")
            ->setLastname('istrator')
            ->setUsername("admin")
            ->setSexe("m")
            ->setBirthday(new DateTime('- 27 years'))
            ->setPlainPassword("password")
            ->setConfirmationToken("token")
            ->setIsValidate(true)
            ->setRoles(['ROLE_ADMIN'])
        ;

        $this->encryptPassword->encrypt($user, $user->getPlainPassword());


        $user2 = (new User())
            ->setEmail("henri@doe.fr")
            ->setFirstname("henri")
            ->setLastname('doe')
            ->setUsername("henri")
            ->setSexe("f")
            ->setBirthday(new DateTime('- 27 years'))
            ->setPlainPassword("password")
            ->setConfirmationToken("token")
            ->setIsValidate(true)
        ;

        $this->encryptPassword->encrypt($user2, $user2->getPlainPassword());

        $manager->persist($user);
        $manager->persist($user2);

        $manager->flush();
    }
}
