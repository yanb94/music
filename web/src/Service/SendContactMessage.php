<?php

namespace App\Service;

use App\Entity\User;
use App\Model\ContactMessage;
use Symfony\Component\Mime\Address;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;

class SendContactMessage
{
    public function __construct(
        private MailerInterface $mailer,
        private string $adminEmail
    ) {
    }

    public function send(ContactMessage $contactMessage)
    {
        $this->mailer->send(
            (new TemplatedEmail())
                ->from(new Address($this->adminEmail, 'Song'))
                ->to(new Address($this->adminEmail, 'Song'))
                ->subject(
                    "Un nouveau message de " . $contactMessage->getFirstname() . " " . $contactMessage->getLastname()
                )
                ->htmlTemplate('email/contact.mjml.twig')
                ->context([
                    "firstname" => $contactMessage->getFirstname(),
                    "lastname" => $contactMessage->getLastname(),
                    "userEmail" => $contactMessage->getEmail(),
                    "message" => $contactMessage->getMessage()
                ])
        );
    }
}
