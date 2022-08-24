<?php

namespace App\Tests\Unit\Service;

use DateTime;
use App\Entity\User;
use App\Service\SendContactUser;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Mailer\MailerInterface;

class SendContactUserTest extends TestCase
{
    private function getValidUser(): User
    {
        return (new User())
            ->setEmail("johh@doe.fr")
            ->setFirstname("john")
            ->setLastname('doe')
            ->setUsername("john")
            ->setSexe("m")
            ->setBirthday(new DateTime('- 27 years'))
            ->setPlainPassword("password")
        ;
    }

    public function testEmailIsSend(): void
    {
        $mailer = $this->getMockBuilder(MailerInterface::class)->getMock();

        $mailer->expects($this->once())->method("send");

        /** @var MailerInterface */
        $mailer = $mailer;

        $sendContactUser = new SendContactUser($mailer, "admin@admin.com");

        $sendContactUser->send(
            object: "Message de Test",
            message: "Je suis le message",
            user: $this->getValidUser()
        );
    }
}
