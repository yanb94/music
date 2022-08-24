<?php

namespace App\Service;

use App\Entity\User;
use Symfony\Component\Mime\Address;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;

class SendContactUser
{
    public function __construct(
        private MailerInterface $mailer,
        private string $adminEmail
    ) {
    }

    public function send(string $object, string $message, User $user)
    {
        $this->mailer->send(
            (new TemplatedEmail())
                ->from(new Address($this->adminEmail, 'Song'))
                ->to($user->getEmail())
                ->subject($object)
                ->htmlTemplate('email/contact_user.mjml.twig')
                ->context([
                    "message" => $message
                ])
        );
    }
}
