<?php

namespace App\Tests\Unit\Service;

use App\Entity\ChangeEmail;
use DateTime;
use App\Entity\User;
use PHPUnit\Framework\TestCase;
use App\Service\SendChangeEmail;
use Symfony\Component\Mailer\MailerInterface;

class SendChangeEmailTest extends TestCase
{
    private function getValidChangeEmail(): ChangeEmail
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

        $token = "testToken";
        $email = "example@example.com";

        return (new ChangeEmail())
            ->setUser($user)
            ->setToken($token)
            ->setEmail($email)
        ;
    }

    public function testEmailIsSend(): void
    {
        $mailer = $this->getMockBuilder(MailerInterface::class)->getMock();

        $mailer->expects($this->once())->method("send");

        /** @var MailerInterface */
        $mailer = $mailer;

        $sendChangeEmail = new SendChangeEmail($mailer, "admin@admin.com");

        $sendChangeEmail->send($this->getValidChangeEmail());
    }
}
