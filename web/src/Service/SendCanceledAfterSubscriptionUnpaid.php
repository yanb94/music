<?php

namespace App\Service;

use App\Entity\User;
use Symfony\Component\Mime\Address;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;

class SendCanceledAfterSubscriptionUnpaid
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
                ->subject("Votre abonnement à été automatiquement annulé")
                ->htmlTemplate('email/canceled_after_unpaid_subscription.mjml.twig')
                ->context([
                    "firstname" => $user->getFirstname(),
                    "lastname" => $user->getLastname(),
                ])
        );
    }
}
