<?php

namespace App\Tests\Unit\Service;

use DateTime;
use App\Entity\User;
use App\Entity\Artist;
use PHPUnit\Framework\TestCase;
use App\Service\SendDeleteArtistNotification;
use Symfony\Component\Mailer\MailerInterface;

class SendDeleteArtistNotificationTest extends TestCase
{
    private function getValidArtist(): Artist
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
        ;
    }

    public function testEmailIsSend(): void
    {
        $mailer = $this->getMockBuilder(MailerInterface::class)->getMock();

        $mailer->expects($this->once())->method("send");

        /** @var MailerInterface */
        $mailer = $mailer;

        $sendDeleteArtistNotification = new SendDeleteArtistNotification($mailer, "admin@admin.com");

        $sendDeleteArtistNotification->send($this->getValidArtist());
    }
}
