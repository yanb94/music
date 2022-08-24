<?php

namespace App\Service;

use App\Entity\User;
use Symfony\Component\Mime\Address;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;

class SendNotPaySubscriptionNotfication
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
                ->subject("Le renouvellement de votre abonnement n'a pas pu être effectué")
                ->htmlTemplate('email/not_renew_subscription.mjml.twig')
                ->context([
                    "firstname" => $user->getFirstname(),
                    "lastname" => $user->getLastname(),
                ])
        );
    }
}
