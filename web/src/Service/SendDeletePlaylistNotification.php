<?php

namespace App\Service;

use App\Entity\Playlist;
use Symfony\Component\Mime\Address;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;

class SendDeletePlaylistNotification
{
    public function __construct(
        private MailerInterface $mailer,
        private string $adminEmail
    ) {
    }

    public function send(Playlist $playlist)
    {
        $this->mailer->send(
            (new TemplatedEmail())
                ->from(new Address($this->adminEmail, 'Song'))
                ->to($playlist->getAuthor()->getEmail())
                ->subject("Votre playlist \"" . $playlist->getName() . "\" a été supprimé par les administrateurs")
                ->htmlTemplate('email/delete_playlist.mjml.twig')
                ->context([
                    "firstname" => $playlist->getAuthor()->getFirstname(),
                    "lastname" => $playlist->getAuthor()->getLastname(),
                    "playlistName" => $playlist->getName()
                ])
        );
    }
}
