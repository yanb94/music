<?php

namespace App\EventSubscriber;

use App\Entity\Song;
use Doctrine\ORM\Events;
use Liip\ImagineBundle\Service\FilterService;
use Vich\UploaderBundle\Storage\StorageInterface;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Doctrine\Bundle\DoctrineBundle\EventSubscriber\EventSubscriberInterface;

class SongPreRemoveSubscriber implements EventSubscriberInterface
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

        if (!$entity instanceof Song) {
            return;
        }

        $entity->contentImageUrl = $this->storage->resolveUri($entity, 'imageFile');

        $this->filterService->bustCache($entity->contentImageUrl, '100x90_thumbnail');
        $this->filterService->bustCache($entity->contentImageUrl, '120_thumbnail');
        $this->filterService->bustCache($entity->contentImageUrl, '150_thumbnail');
        $this->filterService->bustCache($entity->contentImageUrl, '200_thumbnail');
        $this->filterService->bustCache($entity->contentImageUrl, '250_thumbnail');
        $this->filterService->bustCache($entity->contentImageUrl, '850x500_thumbnail');
    }
}
