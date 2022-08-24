<?php

namespace App\Service;

use App\Entity\Artist;
use App\Repository\InvoiceMonthRepository;
use App\Repository\ViewSongDailyRepository;
use DateTime;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class StatsUpcomingIncomeForArtist
{
    public function __construct(
        private ViewSongDailyRepository $viewSongDailyRepository,
        private InvoiceMonthRepository $invoiceMonthRepository,
        private ParameterBagInterface $parameterBagInterface
    ) {
    }

    public function generateUpcomingIncome(Artist $artist): float
    {
        $nowDate = new DateTime();

        $nbViewForArtist = $this->viewSongDailyRepository->findByViewSongByArtistAndMonth($artist, $nowDate);
        $nbViewTotal = $this->viewSongDailyRepository->findAllViewsSongsByMonth($nowDate);

        if ($nbViewTotal == 0 || $nbViewForArtist == 0) {
            return 0.0;
        }

        $percentOfIncomeForArtist = ($nbViewForArtist / $nbViewTotal);

        $invoiceMonth = $this->invoiceMonthRepository->findOneBy(['month' => $nowDate->format('m-Y')]);

        if (is_null($invoiceMonth)) {
            return 0.0;
        }

        $artistsPart = $invoiceMonth->getSubTotal() * $this->parameterBagInterface->get('artistPart');

        $artistUpcomingIncome = ($percentOfIncomeForArtist * $artistsPart) / 100;

        return round($artistUpcomingIncome, 2);
    }
}
