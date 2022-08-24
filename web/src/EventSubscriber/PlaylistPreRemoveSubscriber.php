<?php

namespace App\EventSubscriber;

use App\Entity\Playlist;
use Doctrine\ORM\Events;
use Liip\ImagineBundle\Service\FilterService;
use Vich\UploaderBundle\Storage\StorageInterface;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Doctrine\Bundle\DoctrineBundle\EventSubscriber\EventSubscriberInterface;

class PlaylistPreRemoveSubscriber implements EventSubscriberInterface
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

        if (!$entity instanceof Playlist) {
            return;
        }

        $entity->contentImageUrl = $this->storage->resolveUri($entity, 'imageFile');

        if (!is_null($entity->contentImageUrl) && !str_contains($entity->contentImageUrl, "/tests/files")) {
            $this->filterService->bustCache($entity->contentImageUrl, '150_thumbnail');
            $this->filterService->bustCache($entity->contentImageUrl, '200_thumbnail');
            $this->filterService->bustCache($entity->contentImageUrl, '250_thumbnail');
        }
    }
}
