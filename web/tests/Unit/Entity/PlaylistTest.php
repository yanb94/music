<?php

namespace App\Tests\Unit\Entity;

use DateTime;
use App\Entity\Song;
use App\Entity\User;
use App\Entity\Artist;
use App\Entity\Playlist;
use App\Tests\Utils\FakeData;
use App\Tests\Unit\Entity\EntityCase;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class PlaylistTest extends EntityCase
{
    private function getValidEntity(): Playlist
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

        $song = (new Song())
            ->setName("Artist 1")
            ->setAuthor($artist)
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

        return (new Playlist())
            ->setAuthor($user)
            ->setName("Playlist 1")
            ->setIsPublic(true)
            ->setImageFile(
                new UploadedFile(
                    path: str_replace("/Unit", "/files", dirname(__DIR__)) . "/image.jpg",
                    originalName: "name.jpeg",
                    mimeType: "image/jpeg",
                    test: true
                )
            )
            ->addSong($song)
        ;
    }

    public function testNoErrorsWithValidEntity(): void
    {
        $song = $this->getValidEntity();

        $this->assertHasErrors($song, groups: "post");
    }

    public function testName(): void
    {
        $playlist = $this->getValidEntity();

        // Blank
        $playlist->setName("");
        $this->assertHasErrors($playlist, nbErrors: 2, groups: "post");

        // Too Short
        $playlist->setName(FakeData::generateText(1));
        $this->assertHasErrors($playlist, nbErrors: 1, groups: "post");

        // Too long
        $playlist->setName(FakeData::generateText(51));
        $this->assertHasErrors($playlist, nbErrors: 1, groups: "post");

        // Bad characters
        $playlist->setName("??????????");
        $this->assertHasErrors($playlist, nbErrors: 1, groups: "post");
    }

    public function testImageFile(): void
    {
        $playlist = $this->getValidEntity();

        // Blank
        $playlist->setImageFile(null);
        $this->assertHasErrors($playlist, nbErrors: 1, groups: "post");

        // Bad Type
        $playlist->setImageFile(
            new UploadedFile(
                path: str_replace("/Unit", "/files", dirname(__DIR__)) . "/song.mp3",
                originalName: "song.mp3",
                mimeType: "audio/mpeg",
                test: true
            )
        );
        $this->assertHasErrors($playlist, nbErrors: 1, groups: "post");

        // Too Big File
        $playlist->setImageFile(
            new UploadedFile(
                path: str_replace("/Unit", "/files", dirname(__DIR__)) . "/bigImage.jpg",
                originalName: "bigImage.jpg",
                mimeType: "image/jpeg",
                test: true
            )
        );
        $this->assertHasErrors($playlist, nbErrors: 1, groups: "post");
    }

    public function testIsPublic(): void
    {
        $playlist = $this->getValidEntity();

        // True
        $playlist->setIsPublic(true);
        $this->assertHasErrors($playlist, nbErrors: 0, groups: "post");

        // False
        $playlist->setIsPublic(false);
        $this->assertHasErrors($playlist, nbErrors: 0, groups: "post");
    }
}
