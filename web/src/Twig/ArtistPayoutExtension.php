<?php

namespace App\Twig;

use App\Entity\ArtistPayout;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class ArtistPayoutExtension extends AbstractExtension
{
    public function getFunctions(): array
    {
        return [
            new TwigFunction('payout_status', [$this, 'handlePayoutStatus']),
        ];
    }

    public function handlePayoutStatus($value)
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
