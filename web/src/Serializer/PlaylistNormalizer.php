<?php

// api/src/Serializer/MediaObjectNormalizer.php

namespace App\Serializer;

use App\Entity\Playlist;
use Liip\ImagineBundle\Service\FilterService;
use Vich\UploaderBundle\Storage\StorageInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\ContextAwareNormalizerInterface;

final class PlaylistNormalizer implements ContextAwareNormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    private const ALREADY_CALLED = 'PLAYLIST_NORMALIZER_ALREADY_CALLED';

    public function __construct(
        private StorageInterface $storage,
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

        if (!is_null($object->contentImageUrl)) {
            $object->contentImageResponsive['150x150'] = $this->filterService
                ->getUrlOfFilteredImage($object->contentImageUrl, '150_thumbnail')
            ;
            $object->contentImageResponsive['200x200'] = $this->filterService
                ->getUrlOfFilteredImage($object->contentImageUrl, '200_thumbnail')
            ;
            $object->contentImageResponsive['250x250'] = $this->filterService
                ->getUrlOfFilteredImage($object->contentImageUrl, '250_thumbnail')
            ;
        }

        return $this->normalizer->normalize($object, $format, $context);
    }

    public function supportsNormalization($data, ?string $format = null, array $context = []): bool
    {
        if (isset($context[self::ALREADY_CALLED])) {
            return false;
        }

        return $data instanceof Playlist;
    }
}
