<?php

// api/src/Serializer/MediaObjectNormalizer.php

namespace App\Serializer;

use App\Entity\Song;
use App\Entity\User;
use Liip\ImagineBundle\Service\FilterService;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Serializer\Normalizer\ContextAwareNormalizerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Vich\UploaderBundle\Storage\StorageInterface;

final class SongNormalizer implements ContextAwareNormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    private const ALREADY_CALLED = 'SONG_NORMALIZER_ALREADY_CALLED';

    public function __construct(
        private StorageInterface $storage,
        private TokenStorageInterface $tokenStorage,
        private FilterService $filterService
    ) {
    }

    public function normalize(
        $object,
        ?string $format = null,
        array $context = []
    ): array|string|int|float|bool|\ArrayObject|null {
        $context[self::ALREADY_CALLED] = true;

        $object->contentImageUrl = $this->storage->resolveUri($object, 'imageFile');
        $object->contentSongUrl = $this->storage->resolveUri($object, 'songFile');

        if (!is_null($object->contentImageUrl)) {
            $object->contentImageResponsive['100x90'] = $this->filterService
                ->getUrlOfFilteredImage($object->contentImageUrl, '100x90_thumbnail')
            ;
            $object->contentImageResponsive['120x120'] = $this->filterService
                ->getUrlOfFilteredImage($object->contentImageUrl, '120_thumbnail')
            ;
            $object->contentImageResponsive['150x150'] = $this->filterService
                ->getUrlOfFilteredImage($object->contentImageUrl, '150_thumbnail')
            ;
            $object->contentImageResponsive['200x200'] = $this->filterService
                ->getUrlOfFilteredImage($object->contentImageUrl, '200_thumbnail')
            ;
            $object->contentImageResponsive['250x250'] = $this->filterService
                ->getUrlOfFilteredImage($object->contentImageUrl, '250_thumbnail')
            ;
            $object->contentImageResponsive['850x500'] = $this->filterService
                ->getUrlOfFilteredImage($object->contentImageUrl, '850x500_thumbnail')
            ;
        }

        $context = $this->userHasPermissionForSong($object, $context);

        return $this->normalizer->normalize($object, $format, $context);
    }

    public function supportsNormalization($data, ?string $format = null, array $context = []): bool
    {
        if (isset($context[self::ALREADY_CALLED])) {
            return false;
        }

        return $data instanceof Song;
    }

    private function userHasPermissionForSong(Song $song, array $context): array
    {
        /** @var User */
        $user = $this->tokenStorage->getToken()?->getUser();

        if ($user === $song->getAuthor()->getUser()) {
            if (is_array($context['groups'])) {
                $context['groups'][] = 'author';
            } elseif (is_string($context['groups'])) {
                $context['groups'] = [$context['groups'],'author'];
            }
        }

        return $context;
    }
}
