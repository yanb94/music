<?php

namespace App\Tests\Unit\Entity;

use DateTime;
use App\Entity\Song;
use App\Entity\User;
use App\Entity\Artist;
use App\Tests\Utils\FakeData;
use App\Tests\Unit\Entity\EntityCase;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class SongTest extends EntityCase
{
    private function getValidEntity(): Song
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

        return (new Song())
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
    }

    public function testNoErrorsWithValidEntity(): void
    {
        $song = $this->getValidEntity();

        $this->assertHasErrors($song, groups: "post");
    }

    public function testName(): void
    {
        $song = $this->getValidEntity();

        // Blank
        $song->setName("");
        $this->assertHasErrors($song, nbErrors: 2, groups: "post");

        // Too Short
        $song->setName(FakeData::generateText(1));
        $this->assertHasErrors($song, nbErrors: 1, groups: "post");

        // Too long
        $song->setName(FakeData::generateText(51));
        $this->assertHasErrors($song, nbErrors: 1, groups: "post");

        // Bad characters
        $song->setName("??????????");
        $this->assertHasErrors($song, nbErrors: 1, groups: "post");
    }

    public function testImageFile(): void
    {
        $song = $this->getValidEntity();

        // Blank
        $song->setImageFile(null);
        $this->assertHasErrors($song, nbErrors: 1, groups: "post");

        // Bad Type
        $song->setImageFile(
            new UploadedFile(
                path: str_replace("/Unit", "/files", dirname(__DIR__)) . "/song.mp3",
                originalName: "song.mp3",
                mimeType: "audio/mpeg",
                test: true
            )
        );
        $this->assertHasErrors($song, nbErrors: 1, groups: "post");

        // Too Big File
        $song->setImageFile(
            new UploadedFile(
                path: str_replace("/Unit", "/files", dirname(__DIR__)) . "/bigImage.jpg",
                originalName: "bigImage.jpg",
                mimeType: "image/jpeg",
                test: true
            )
        );
        $this->assertHasErrors($song, nbErrors: 1, groups: "post");
    }

    public function testSongFile(): void
    {
        $song = $this->getValidEntity();

        // Blank
        $song->setSongFile(null);
        $this->assertHasErrors($song, nbErrors: 1, groups: "post");

        // Bad Type
        $song->setSongFile(
            new UploadedFile(
                path: str_replace("/Unit", "/files", dirname(__DIR__)) . "/image.jpg",
                originalName: "name.jpeg",
                mimeType: "image/jpeg",
                test: true
            )
        );
        $this->assertHasErrors($song, nbErrors: 1, groups: "post");
    }
}
