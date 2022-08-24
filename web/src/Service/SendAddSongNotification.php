<?php

namespace App\Service;

use App\Entity\Song;
use App\Entity\User;
use Symfony\Component\Mime\Address;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;

class SendAddSongNotification
{
    public function __construct(
        private MailerInterface $mailer,
        private string $adminEmail
    ) {
    }

    public function send(Song $song)
    {
        $artist = $song->getAuthor();

        /** @var User[] */
        $followers = $artist->getFollowers();

        $songName = $song->getName();
        $artistName = $artist->getName();
        $slug = $song->getSlug();

        foreach ($followers as $follower) {
            $this->mailer->send(
                (new TemplatedEmail())
                    ->from(new Address($this->adminEmail, 'Song'))
                    ->to($follower->getEmail())
                    ->subject("Une nouvelle chanson de " . $artistName . " vient d'être publiée")
                    ->htmlTemplate('email/add_song_notification.mjml.twig')
                    ->context([
                        "slug" => $slug,
                        "song_name" => $songName,
                        "artist_name" => $artistName,
                        "firstname" => $follower->getFirstname(),
                        "lastname" => $follower->getLastname()
                    ])
            );
        }
    }
}
