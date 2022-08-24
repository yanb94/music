<?php

namespace App\DataFixtures;

use DateTime;
use App\Entity\User;
use App\Entity\Artist;
use App\Entity\Playlist;
use App\Entity\Song;
use App\Service\EncryptPassword;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class PlaylistFixtures extends Fixture
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

        $imageFile = new UploadedFile(
            path: str_replace("/src", "/tests/files", dirname(__DIR__)) . "/image.jpg",
            originalName: "name.jpeg",
            mimeType: "image/jpeg",
            test: true
        );

        $songFile = new UploadedFile(
            path: str_replace("/src", "/tests/files", dirname(__DIR__)) . "/song.mp3",
            originalName: "song.mp3",
            mimeType: "audio/mpeg",
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
            ->setEmail("johh@doe.fr")
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

        $playlist = (new Playlist())
            ->setName("Playlist 1")
            ->setIsPublic(true)
            ->setImageFile($imageFile)
            ->setAuthor($user)
        ;

        $user->setArtist($artist);

        $manager->persist($playlist);
        $manager->persist($user);
        $manager->persist($artist);
        $manager->persist($user2);

        for ($i = 0; $i < 3; $i++) {
            $song = (new Song())
                ->setName("Chanson n" . $i)
                ->setAuthor($artist)
                ->setSongFile($songFile)
                ->setSongDuration(105)
                ->setImageFile($imageFile)
            ;

            $playlist->addSong($song);

            $manager->persist($song);
        }

        $manager->flush();
    }
}
