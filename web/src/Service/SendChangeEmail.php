<?php

namespace App\Service;

use App\Entity\ChangeEmail;
use App\Entity\User;
use Symfony\Component\Mime\Address;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;

class SendChangeEmail
{
    public function __construct(
        private MailerInterface $mailer,
        private string $noReplyEmail
    ) {
    }

    public function send(ChangeEmail $changeEmail)
    {
        $user = $changeEmail->getUser();

        $this->mailer->send(
            (new TemplatedEmail())
                ->from(new Address($this->noReplyEmail, 'Song'))
                ->to($changeEmail->getEmail())
                ->subject(
                    "Votre demande de changement d'email"
                )
                ->htmlTemplate('email/change_email.mjml.twig')
                ->context([
                    "firstname" => $user->getFirstname(),
                    "lastname" => $user->getLastname(),
                    "token" => $changeEmail->getToken()
                ])
        );
    }
}
