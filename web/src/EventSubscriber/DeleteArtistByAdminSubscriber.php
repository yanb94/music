<?php

namespace App\EventSubscriber;

use App\Entity\Artist;
use App\Service\SendDeleteArtistNotification;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use EasyCorp\Bundle\EasyAdminBundle\Event\AfterEntityDeletedEvent;

class DeleteArtistByAdminSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private SendDeleteArtistNotification $sendDeleteArtistNotification
    ) {
    }

    public function onAfterEntityDeletedEvent(AfterEntityDeletedEvent $event)
    {
        $entity = $event->getEntityInstance();

        if (!($entity instanceof Artist)) {
            return;
        }

        $this->sendDeleteArtistNotification->send($entity);
    }

    public static function getSubscribedEvents()
    {
        return [
            AfterEntityDeletedEvent::class => 'onAfterEntityDeletedEvent',
        ];
    }
}
