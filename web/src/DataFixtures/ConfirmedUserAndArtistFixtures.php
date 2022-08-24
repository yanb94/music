<?php

namespace App\DataFixtures;

use DateTime;
use App\Entity\User;
use App\Entity\Artist;
use App\Service\EncryptPassword;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class ConfirmedUserAndArtistFixtures extends Fixture
{
    public function __construct(private EncryptPassword $encryptPassword)
    {
    }

    public function load(ObjectManager $manager)
    {
        $file = new UploadedFile(
            path: str_replace("/src", "/tests/files", dirname(__DIR__)) . "/image.jpg",
            originalName: "name.jpeg",
            mimeType: "image/jpeg",
            test: true
        );

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


        $user2 = (new User())
            ->setEmail("henri@doe.fr")
            ->setFirstname("henri")
            ->setLastname('doe')
            ->setUsername("henri")
            ->setSexe("m")
            ->setBirthday(new DateTime('- 27 years'))
            ->setPlainPassword("password")
            ->setConfirmationToken("token")
            ->setIsValidate(true)
        ;

        $this->encryptPassword->encrypt($user2, $user2->getPlainPassword());

        $artist = (new Artist())
            ->setName("Artist 1")
            ->setDescription("Je suis une description")
            ->setEmail("example@example.com")
            ->setUser($user)
            ->setFile($file)
        ;

        $user->setArtist($artist);

        $manager->persist($user);
        $manager->persist($user2);
        $manager->persist($artist);

        $manager->flush();
    }
}
