<?php

namespace App\Twig;

use App\Entity\ArtistBatchPayout;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class ArtistBatchPayoutExtension extends AbstractExtension
{
    public function getFunctions(): array
    {
        return [
            new TwigFunction('show_status_artist_batch_payout', [$this, 'handleStatus']),
            new TwigFunction('get_class_batch_payout', [$this, 'getClassForStatus']),
        ];
    }

    public function getClassForStatus(string $value)
    {
        switch ($value) {
            case ArtistBatchPayout::SUCCESS:
                return strtolower($value);
            case ArtistBatchPayout::DENIED:
                return strtolower($value);
            case ArtistBatchPayout::PROCESSING:
                return strtolower($value);
            case ArtistBatchPayout::CANCELED:
                return strtolower($value);
            case ArtistBatchPayout::PENDING:
                return strtolower($value);
            case ArtistBatchPayout::CREATED:
                return strtolower($value);
            default:
                break;
        }
    }

    public function handleStatus(string $value)
    {
        switch ($value) {
            case ArtistBatchPayout::SUCCESS:
                return "Traité";
            case ArtistBatchPayout::DENIED:
                return "Refusé";
            case ArtistBatchPayout::PROCESSING:
                return "En traitement";
            case ArtistBatchPayout::CANCELED:
                return "Annulé";
            case ArtistBatchPayout::PENDING:
                return "En attente";
            case ArtistBatchPayout::CREATED:
                return "En attente de traitement";
            default:
                break;
        }
    }
}
