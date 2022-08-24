<?php

namespace App\Tests\Unit\EventSubscriber;

use DateTime;
use App\Entity\Song;
use App\Entity\User;
use App\Entity\Artist;
use App\Entity\Playlist;
use PHPUnit\Framework\TestCase;
use App\Service\SendDeletePlaylistNotification;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use App\EventSubscriber\DeletePlaylistByAdminSubscriber;
use EasyCorp\Bundle\EasyAdminBundle\Event\AfterEntityDeletedEvent;

class DeletePlaylistByAdminSubscriberTest extends TestCase
{
    private function getValidEntity(): Playlist
    {
        $user = (new User())
            ->setEmail("johh@doe.fr")
            ->setFirstname("john")
            ->setLastname('doe')
            ->setUsername("john")
            ->setSexe("m")
            ->setBirthday(new DateTime('- 27 years'))
            ->setPlainPassword("password")
        ;

        $artist = (new Artist())
            ->setEmail("johh@doe.fr")
            ->setDescription("je suis une description")
            ->setName("Artist 1")
            ->setUser($user)
        ;

        $song = (new Song())
            ->setName("Artist 1")
            ->setAuthor($artist)
            ->setImageFile(
                new UploadedFile(
                    path: str_replace("/Unit", "/files", dirname(__DIR__)) . "/image.jpg",
                    originalName: "name.jpeg",
                    mimeType: "image/jpeg",
                    test: true
                )
            )
            ->setSongFile(
                new UploadedFile(
                    path: str_replace("/Unit", "/files", dirname(__DIR__)) . "/song.mp3",
                    originalName: "song.mp3",
                    mimeType: "audio/mpeg",
                    test: true
                )
            )
        ;

        return (new Playlist())
            ->setAuthor($user)
            ->setName("Playlist 1")
            ->setIsPublic(true)
            ->setImageFile(
                new UploadedFile(
                    path: str_replace("/Unit", "/files", dirname(__DIR__)) . "/image.jpg",
                    originalName: "name.jpeg",
                    mimeType: "image/jpeg",
                    test: true
                )
            )
            ->addSong($song)
        ;
    }

    public function testEmailIsSendWhenEventIsDispatch()
    {
        $service = $this->getMockBuilder(SendDeletePlaylistNotification::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
        $service->expects($this->once())->method("send");

        /** @var SendDeletePlaylistNotification */
        $service = $service;

        $subscriber = new DeletePlaylistByAdminSubscriber($service);

        $event = new AfterEntityDeletedEvent($this->getValidEntity());

        $dispatcher = new EventDispatcher();
        $dispatcher->addSubscriber($subscriber);
        $dispatcher->dispatch($event);
    }
}
