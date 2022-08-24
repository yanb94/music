<?php

namespace App\Tests\Unit\Service;

use DateTime;
use App\Entity\Song;
use App\Entity\User;
use App\Entity\Artist;
use PHPUnit\Framework\TestCase;
use App\Service\SendDeleteSongNotification;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class SendDeleteSongNotificationTest extends TestCase
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

    public function testEmailIsSend(): void
    {
        $mailer = $this->getMockBuilder(MailerInterface::class)->getMock();

        $mailer->expects($this->once())->method("send");

        /** @var MailerInterface */
        $mailer = $mailer;

        $sendDeleteSongNotification = new SendDeleteSongNotification($mailer, "admin@admin.com");

        $sendDeleteSongNotification->send($this->getValidEntity());
    }
}
