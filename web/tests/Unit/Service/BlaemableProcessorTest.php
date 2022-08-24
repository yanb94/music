<?php

namespace App\Tests\Unit\Service;

use DateTime;
use App\Entity\Song;
use App\Entity\User;
use App\Entity\Artist;
use App\Service\BlaemableProcessor;
use PHPUnit\Framework\TestCase;
use App\Service\EncryptPassword;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasher;

class BlaemableProcessorTest extends TestCase
{
    private function getBlaemableEntity(): Song
    {
        return (new Song())
            ->setName("Artist 1")
            ->setImageFile(
                new UploadedFile(
                    path: str_replace("/Unit", "/files", dirname(__DIR__)) . "/image.jpg",
                    originalName: "name.jpeg",
                    mimeType: "image/jpeg",
                    test: true
                )
            )
            ->setSongFile(
                new UploadedFile(
                    path: str_replace("/Unit", "/files", dirname(__DIR__)) . "/song.mp3",
                    originalName: "song.mp3",
                    mimeType: "audio/mpeg",
                    test: true
                )
            )
        ;
    }

    private function getUser(): User
    {
        $user = (new User())
            ->setEmail("johh@doe.fr")
            ->setFirstname("john")
            ->setLastname('doe')
            ->setUsername("john")
            ->setSexe("m")
            ->setBirthday(new DateTime('- 27 years'))
            ->setPlainPassword("password")
        ;

        $artist = (new Artist())
            ->setEmail("johh@doe.fr")
            ->setDescription("je suis une description")
            ->setName("Artist 1")
            ->setUser($user)
        ;

        $user->setArtist($artist);

        return $user;
    }

    public function testBlaemableProcessorWorkHasExpected()
    {
        $blaemableProcessor = new BlaemableProcessor();

        $song = $this->getBlaemableEntity();
        $user = $this->getUser();

        $blaemableProcessor->process(
            $song,
            $user
        );

        $this->assertSame($user->getArtist(), $song->getAuthor());
    }
}
