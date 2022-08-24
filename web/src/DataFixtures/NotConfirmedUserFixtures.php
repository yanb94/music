<?php

namespace App\DataFixtures;

use DateTime;
use App\Entity\User;
use App\Service\EncryptPassword;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;

class NotConfirmedUserFixtures extends Fixture
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
        ;

        $this->encryptPassword->encrypt($user, $user->getPlainPassword());

        $manager->persist($user);

        $manager->flush();
    }
}
