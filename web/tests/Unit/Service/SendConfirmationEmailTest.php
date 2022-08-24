<?php

namespace App\Tests\Unit\Service;

use DateTime;
use App\Entity\User;
use PHPUnit\Framework\TestCase;
use App\Service\SendConfirmationEmail;
use Symfony\Component\Mailer\MailerInterface;

class SendConfirmationEmailTest extends TestCase
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

        $sendConfirmationEmail = new SendConfirmationEmail($mailer, "example@example.com");

        $sendConfirmationEmail->send($this->getValidUser());
    }
}
