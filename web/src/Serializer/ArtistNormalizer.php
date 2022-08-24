<?php

// api/src/Serializer/MediaObjectNormalizer.php

namespace App\Serializer;

use App\Entity\Artist;
use Liip\ImagineBundle\Service\FilterService;
use Vich\UploaderBundle\Storage\StorageInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\ContextAwareNormalizerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

final class ArtistNormalizer implements ContextAwareNormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    private const ALREADY_CALLED = 'ARTIST_NORMALIZER_ALREADY_CALLED';

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

        $object->contentUrl = $this->storage->resolveUri($object, 'file');

        if (!is_null($object->contentUrl)) {
            $object->contentImageResponsive['60x60'] = $this->filterService
                ->getUrlOfFilteredImage($object->contentUrl, '60_thumbnail')
            ;
            $object->contentImageResponsive['130x130'] = $this->filterService
                ->getUrlOfFilteredImage($object->contentUrl, '130_thumbnail')
            ;
            $object->contentImageResponsive['150x150'] = $this->filterService
                ->getUrlOfFilteredImage($object->contentUrl, '150_thumbnail')
            ;
        }

        $context = $this->userIsAuthor($object, $context);

        return $this->normalizer->normalize($object, $format, $context);
    }

    public function supportsNormalization($data, ?string $format = null, array $context = []): bool
    {
        if (isset($context[self::ALREADY_CALLED])) {
            return false;
        }

        return $data instanceof Artist;
    }

    private function userIsAuthor(Artist $artist, array $context): array
    {
        /** @var User */
        $user = $this->tokenStorage->getToken()?->getUser();

        if ($user === $artist->getUser()) {
            if (is_array($context['groups'])) {
                $context['groups'][] = 'author';
            } elseif (is_string($context['groups'])) {
                $context['groups'] = [$context['groups'],'author'];
            }
        }

        return $context;
    }
}
