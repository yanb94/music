<?php

namespace App\DataFixtures;

use DateTime;
use App\Entity\User;
use App\Service\EncryptPassword;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;

class ConfirmedUserFixtures extends Fixture
{
    public function __construct(private EncryptPassword $encryptPassword)
    {
    }

    public function load(ObjectManager $manager)
    {
        $user = (new User())
            ->setEmail("johh@doe.fr")
            ->setFirstname("john")
            ->setLastname('doe')
            ->setUsername("john")
            ->setSexe("m")
            ->setBirthday(new DateTime('- 27 years'))
            ->setPlainPassword("password")
            ->setConfirmationToken("token")
            ->setIsValidate(true)
        ;

        $this->encryptPassword->encrypt($user, $user->getPlainPassword());

        $manager->persist($user);

        $user2 = (new User())
            ->setEmail("admin@admin.fr")
            ->setFirstname("admin")
            ->setLastname('istrateur')
            ->setUsername("admin")
            ->setSexe("m")
            ->setBirthday(new DateTime('- 27 years'))
            ->setPlainPassword("password")
            ->setConfirmationToken("token")
            ->setIsValidate(true)
            ->setRoles(['ROLE_ADMIN'])
        ;

        $this->encryptPassword->encrypt($user2, $user2->getPlainPassword());

        $manager->persist($user2);

        $manager->flush();
    }
}
