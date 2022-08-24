<?php

namespace App\Tests\Unit\Service;

use App\Model\ContactMessage;
use PHPUnit\Framework\TestCase;
use App\Service\SendContactMessage;
use Symfony\Component\Mailer\MailerInterface;

class SendContactMessageTest extends TestCase
{
    private function getValidChangeEmail(): ContactMessage
    {
        $contactMessage = (new ContactMessage())
            ->setFirstname('John')
            ->setLastname('Doe')
            ->setEmail("example@example.com")
            ->setMessage("Je suis une description")
        ;

        return $contactMessage;
    }

    public function testEmailIsSend(): void
    {
        $mailer = $this->getMockBuilder(MailerInterface::class)->getMock();

        $mailer->expects($this->once())->method("send");

        /** @var MailerInterface */
        $mailer = $mailer;

        $sendChangeEmail = new SendContactMessage($mailer, "admin@admin.com");

        $sendChangeEmail->send($this->getValidChangeEmail());
    }
}
