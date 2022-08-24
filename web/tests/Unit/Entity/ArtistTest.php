<?php

namespace App\Tests\Unit\Entity;

use DateTime;
use App\Entity\User;
use App\Entity\Artist;
use App\Tests\Utils\FakeData;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class ArtistTest extends EntityCase
{
    private function getValidEntity(): Artist
    {
        return (new Artist())
            ->setEmail("johh@doe.fr")
            ->setDescription("je suis une description")
            ->setName("Artist 1")
            ->setUser(
                (new User())
                    ->setEmail("johh@doe.fr")
                    ->setFirstname("john")
                    ->setLastname('doe')
                    ->setUsername("john")
                    ->setSexe("m")
                    ->setBirthday(new DateTime('- 27 years'))
                    ->setPlainPassword("password")
            )
            ->setFile(new UploadedFile(
                path: str_replace("/Unit", "/files", dirname(__DIR__)) . "/image.jpg",
                originalName: "name.jpeg",
                mimeType: "image/jpeg",
                test: true
            ))
        ;
    }

    public function testNoErrorsWithValidEntity(): void
    {
        $artist = $this->getValidEntity();

        $this->assertHasErrors($artist, groups: "post");
    }

    public function testEmail(): void
    {
        $artist = $this->getValidEntity();

        // Blank
        $artist->setEmail("");
        $this->assertHasErrors($artist, nbErrors: 1, groups: "post");

        // Not Valid Email
        $artist->setEmail("aa");
        $this->assertHasErrors($artist, nbErrors: 1, groups: "post");
    }

    public function testDescription(): void
    {
        $artist = $this->getValidEntity();

        // Blank
        $artist->setDescription("");
        $this->assertHasErrors($artist, nbErrors: 2, groups: "post");

        // Too short
        $artist->setDescription("aa");
        $this->assertHasErrors($artist, nbErrors: 1, groups: "post");

        // Too long
        $artist->setDescription(FakeData::generateText(251));
        $this->assertHasErrors($artist, nbErrors: 1, groups: "post");
    }

    public function testName(): void
    {
        $artist = $this->getValidEntity();

        // Blank
        $artist->setName("");
        $this->assertHasErrors($artist, nbErrors: 2, groups: "post");

        // Too Short
        $artist->setName(FakeData::generateText(1));
        $this->assertHasErrors($artist, nbErrors: 1, groups: "post");

        // Too long
        $artist->setName(FakeData::generateText(51));
        $this->assertHasErrors($artist, nbErrors: 1, groups: "post");

        // Bad characters
        $artist->setName("??????????");
        $this->assertHasErrors($artist, nbErrors: 1, groups: "post");
    }

    public function testFile(): void
    {
        $artist = $this->getValidEntity();

        // Bad type
        $artist->setFile(
            new UploadedFile(
                path: str_replace("/Unit", "/files", dirname(__DIR__)) . "/text.txt",
                originalName: "text.txt",
                mimeType: "text/plain",
                test: true
            )
        );
        $this->assertHasErrors($artist, nbErrors: 1, groups: "post");

        // Too Big File
        $artist->setFile(
            new UploadedFile(
                path: str_replace("/Unit", "/files", dirname(__DIR__)) . "/bigImage.jpg",
                originalName: "bigImage.jpg",
                mimeType: "image/jpeg",
                test: true
            )
        );
        $this->assertHasErrors($artist, nbErrors: 1, groups: "post");

        // Null file
        $artist->setFile(null);
        $this->assertHasErrors($artist, nbErrors: 1, groups: "post");
    }
}
