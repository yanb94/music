<?php

namespace App\Tests\Unit\Service;

use DateTime;
use App\Entity\User;
use PHPUnit\Framework\TestCase;
use App\Service\SendCanceledAfterSubscriptionUnpaid;
use Symfony\Component\Mailer\MailerInterface;

class SendCanceledAfterSubscriptionUnpaidTest extends TestCase
{
    private function getValidEntity(): User
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

        $sendCanceledAfterSubscriptionUnpaid = new SendCanceledAfterSubscriptionUnpaid($mailer, "admin@admin.com");

        $sendCanceledAfterSubscriptionUnpaid->send($this->getValidEntity());
    }
}
