<?php

namespace App\Twig;

use App\Entity\Artist;
use Twig\TwigFunction;
use Twig\Extension\AbstractExtension;
use App\Service\StatsUpcomingIncomeForArtist;

class UpcomingIncomeForArtistExtension extends AbstractExtension
{
    public function __construct(
        private StatsUpcomingIncomeForArtist $statsUpcomingIncomeForArtist
    ) {
    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('upcoming_income_artist', [$this, 'upcomingIncomeArtist']),
        ];
    }

    public function upcomingIncomeArtist(Artist $artist)
    {
        return $this->statsUpcomingIncomeForArtist->generateUpcomingIncome($artist);
    }
}
