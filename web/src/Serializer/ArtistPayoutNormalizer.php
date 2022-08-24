<?php

namespace App\Serializer;

use App\Entity\ArtistPayout;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\ContextAwareNormalizerInterface;

class ArtistPayoutNormalizer implements ContextAwareNormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    private const ALREADY_CALLED = 'ARTIST_PAYOUT_NORMALIZER_ALREADY_CALLED';

    public function __construct()
    {
    }

    public function normalize($object, $format = null, array $context = []): array
    {
        $context[self::ALREADY_CALLED] = true;

        $statusLabel = $this->handlePayoutStatus($object->getStatus());

        $object->setStatus($statusLabel);

        return $this->normalizer->normalize($object, $format, $context);
    }

    public function supportsNormalization($data, ?string $format = null, array $context = []): bool
    {
        if (isset($context[self::ALREADY_CALLED])) {
            return false;
        }

        return $data instanceof ArtistPayout;
    }

    private function handlePayoutStatus($value)
    {
        switch ($value) {
            case ArtistPayout::BLOCKED:
                return "Bloqué";
            case ArtistPayout::CANCELED:
                return "Annulé";
            case ArtistPayout::CREATED:
                return "En attente de traitement";
            case ArtistPayout::DENIED:
                return "Refusé";
            case ArtistPayout::FAILED:
                return "Échoué";
            case ArtistPayout::ONHOLD:
                return "En cours de révision";
            case ArtistPayout::PENDING:
                return "En attente";
            case ArtistPayout::REFUNDED:
                return "Remboursé";
            case ArtistPayout::RETURNED:
                return "Retourné";
            case ArtistPayout::REVERSED:
                return "Reversé";
            case ArtistPayout::SUCCESS:
                return "Traité";
            case ArtistPayout::UNCLAIMED:
                return "Non réclamé";
            default:
                break;
        }
    }
}
