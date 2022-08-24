<?php

namespace App\Service;

use App\Entity\User;
use Symfony\Component\Mime\Address;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;

class SendConfirmationEmail
{
    public function __construct(
        private MailerInterface $mailer,
        private string $noReplyEmail
    ) {
    }

    public function send(User $user)
    {
        $this->mailer->send(
            (new TemplatedEmail())
                ->from(new Address($this->noReplyEmail, 'Song'))
                ->to($user->getEmail())
                ->subject(
                    "Confirmer votre inscription"
                )
                ->htmlTemplate('email/validate_account.mjml.twig')
                ->context([
                    "firstname" => $user->getFirstname(),
                    "lastname" => $user->getLastname(),
                    "token" => $user->getConfirmationToken()
                ])
        );
    }
}
