<?php

namespace App\EventSubscriber;

use App\Entity\Song;
use Doctrine\ORM\Events;
use wapmorgan\Mp3Info\Mp3Info;
use App\Service\BlaemableProcessor;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Doctrine\Bundle\DoctrineBundle\EventSubscriber\EventSubscriberInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class SongPersistSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private TokenStorageInterface $tokenStorage,
        private BlaemableProcessor $processor
    ) {
    }

    public function getSubscribedEvents(): array
    {
        return [
            Events::prePersist
        ];
    }

    public function prePersist(LifecycleEventArgs $args): void
    {
        $entity = $args->getObject();

        if (!$entity instanceof Song) {
            return;
        }

        if ($entity->getAuthor() != null) {
            return;
        }

        $user = $this->tokenStorage->getToken()->getUser();
        $this->processor->process($entity, $user);

        $songFile = $entity->getSongFile();

        $songFileInfo = new Mp3Info($songFile->getRealPath(), true);

        $entity->setSongDuration($songFileInfo->duration);
    }
}
