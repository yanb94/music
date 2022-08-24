<?php

namespace App\EventSubscriber;

use App\Entity\Song;
use App\Service\SendDeleteSongNotification;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use EasyCorp\Bundle\EasyAdminBundle\Event\AfterEntityDeletedEvent;

class DeleteSongByAdminSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private SendDeleteSongNotification $sendDeleteSongNotification
    ) {
    }

    public function onAfterEntityDeletedEvent(AfterEntityDeletedEvent $event)
    {
        $entity = $event->getEntityInstance();

        if (!($entity instanceof Song)) {
            return;
        }

        $this->sendDeleteSongNotification->send($entity);
    }

    public static function getSubscribedEvents()
    {
        return [
            AfterEntityDeletedEvent::class => 'onAfterEntityDeletedEvent',
        ];
    }
}
