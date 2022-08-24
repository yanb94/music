<?php

namespace App\Service;

use App\Entity\User;
use Symfony\Component\Mime\Address;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;

class SendSubscriptionNotification
{
    public function __construct(
        private MailerInterface $mailer,
        private string $adminEmail
    ) {
    }

    public function send(User $user)
    {
        $this->mailer->send(
            (new TemplatedEmail())
                ->from(new Address($this->adminEmail, 'Song'))
                ->to($user->getEmail())
                ->subject("Confirmation de souscription")
                ->htmlTemplate('email/subscription_notification.mjml.twig')
                ->context([
                    "firstname" => $user->getFirstname(),
                    "lastname" => $user->getLastname(),
                ])
        );
    }
}
