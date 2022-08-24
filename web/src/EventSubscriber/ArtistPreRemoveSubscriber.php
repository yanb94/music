<?php

namespace App\EventSubscriber;

use App\Entity\Artist;
use Doctrine\ORM\Events;
use Liip\ImagineBundle\Service\FilterService;
use Vich\UploaderBundle\Storage\StorageInterface;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Doctrine\Bundle\DoctrineBundle\EventSubscriber\EventSubscriberInterface;

class ArtistPreRemoveSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private FilterService $filterService,
        private StorageInterface $storage,
    ) {
    }

    public function getSubscribedEvents(): array
    {
        return [
            Events::preRemove
        ];
    }

    public function preRemove(LifecycleEventArgs $args): void
    {
        $entity = $args->getObject();

        if (!$entity instanceof Artist) {
            return;
        }

        $entity->contentUrl = $this->storage->resolveUri($entity, 'file');

        if (!is_null($entity->contentUrl)) {
            $this->filterService->bustCache($entity->contentUrl, '60_thumbnail');
            $this->filterService->bustCache($entity->contentUrl, '130_thumbnail');
            $this->filterService->bustCache($entity->contentUrl, '150_thumbnail');
        }
    }
}
