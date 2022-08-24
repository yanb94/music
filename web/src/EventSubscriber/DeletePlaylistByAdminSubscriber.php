<?php

namespace App\EventSubscriber;

use App\Entity\Playlist;
use App\Service\SendDeletePlaylistNotification;
use App\Service\SendDeleteSongNotification;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use EasyCorp\Bundle\EasyAdminBundle\Event\AfterEntityDeletedEvent;

class DeletePlaylistByAdminSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private SendDeletePlaylistNotification $sendDeletePlaylistNotification
    ) {
    }

    public function onAfterEntityDeletedEvent(AfterEntityDeletedEvent $event)
    {
        $entity = $event->getEntityInstance();

        if (!($entity instanceof Playlist)) {
            return;
        }

        $this->sendDeletePlaylistNotification->send($entity);
    }

    public static function getSubscribedEvents()
    {
        return [
            AfterEntityDeletedEvent::class => 'onAfterEntityDeletedEvent',
        ];
    }
}
