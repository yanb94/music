<?php

namespace App\Service;

use App\Entity\Song;
use Symfony\Component\Mime\Address;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;

class SendDeleteSongNotification
{
    public function __construct(
        private MailerInterface $mailer,
        private string $adminEmail
    ) {
    }

    public function send(Song $song)
    {
        $this->mailer->send(
            (new TemplatedEmail())
                ->from(new Address($this->adminEmail, 'Song'))
                ->to($song->getAuthor()->getUser()->getEmail())
                ->subject("Votre chanson \"" . $song->getName() . "\" a été supprimé par les administrateurs")
                ->htmlTemplate('email/delete_song.mjml.twig')
                ->context([
                    "firstname" => $song->getAuthor()->getUser()->getFirstname(),
                    "lastname" => $song->getAuthor()->getUser()->getLastname(),
                    "songName" => $song->getName()
                ])
        );
    }
}
