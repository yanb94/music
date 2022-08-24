<?php

namespace App\EventSubscriber;

use App\Entity\Song;
use Doctrine\ORM\Events;
use App\Service\SendAddSongNotification;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Doctrine\Bundle\DoctrineBundle\EventSubscriber\EventSubscriberInterface;

class SongPostPersistSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private SendAddSongNotification $sendAddSongNotification
    ) {
    }

    public function getSubscribedEvents(): array
    {
        return [
            Events::postPersist
        ];
    }

    public function postPersist(LifecycleEventArgs $args): void
    {
        $entity = $args->getObject();

        if (!$entity instanceof Song) {
            return;
        }

        if ($entity->getAuthor() == null) {
            return;
        }

        $this->sendAddSongNotification->send($entity);
    }
}
