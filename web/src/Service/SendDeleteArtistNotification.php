<?php

namespace App\Service;

use App\Entity\User;
use App\Entity\Artist;
use Symfony\Component\Mime\Address;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;

class SendDeleteArtistNotification
{
    public function __construct(
        private MailerInterface $mailer,
        private string $adminEmail
    ) {
    }

    public function send(Artist $artist)
    {
        $this->mailer->send(
            (new TemplatedEmail())
                ->from(new Address($this->adminEmail, 'Song'))
                ->to($artist->getUser()->getEmail())
                ->subject("Votre profil d'artiste a été supprimé par les administrateurs")
                ->htmlTemplate('email/delete_artist.mjml.twig')
                ->context([
                    "firstname" => $artist->getUser()->getFirstname(),
                    "lastname" => $artist->getUser()->getLastname()
                ])
        );
    }
}
