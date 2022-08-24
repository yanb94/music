<?php

namespace App\Service;

use App\Entity\ArtistBatchPayout;
use App\Entity\ArtistPayout;
use App\Repository\ArtistRepository;
use App\Repository\InvoiceMonthRepository;
use App\Repository\ViewSongDailyRepository;
use App\Service\PaypalBridge;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class ProcessArtistPayout
{
    public function __construct(
        private PaypalBridge $paypalBridge,
        private InvoiceMonthRepository $invoiceMonthRepository,
        private ViewSongDailyRepository $viewSongDailyRepository,
        private ArtistRepository $artistRepository,
        private EntityManagerInterface $em,
        private ParameterBagInterface $parameterBag
    ) {
    }

    public function defineAmountByArtist(
        DateTime $date,
        int $amountForArtist,
        ArtistBatchPayout $artistBatchPayout
    ): array {
        $totalViewMonth = $this->viewSongDailyRepository->findAllViewsSongsByMonth($date);
        $viewsByArtist = $this->artistRepository->findAllByViewSongByArtistAndMonth($date);

        $partForArtist = array_map(function ($data) use ($totalViewMonth, $amountForArtist) {
            return [
                "artist" => $data['artist'],
                "amount" => ($data['views'] / $totalViewMonth) * $amountForArtist
            ];
        }, $viewsByArtist);

        return array_map(function ($data) use ($date, $artistBatchPayout) {

            return (new ArtistPayout())
                ->setAmount($data['amount'])
                ->setArtist($data['artist'])
                ->setStatus(ArtistPayout::CREATED)
                ->setMonth($date->format('m-Y'))
                ->setBatchPayout($artistBatchPayout)
            ;
        }, $partForArtist);
    }

    public function createBatchPayout()
    {
        $date = new DateTime('- 1 month');

        $invoicesMonth = $this->invoiceMonthRepository->findOneBy(['month' => $date->format('m-Y')]);

        if (is_null($invoicesMonth)) {
            throw new Exception("Il n'y a aucun revenu a distribuer");
        }

        $artistsPart = $invoicesMonth->getSubTotal() * $this->parameterBag->get('artistPart');


        $trackingId = "Payout_" . $date->format('m') . "_" . $date->format('Y');

        $artistBatchPayout = (new ArtistBatchPayout())
            ->setAmount($artistsPart)
            ->setMonth($date->format('m-Y'))
            ->setStatus(ArtistBatchPayout::CREATED)
            ->setTrackingId($trackingId)
        ;

        $artistPayouts = $this->defineAmountByArtist($date, $artistsPart, $artistBatchPayout);

        $index = 1;

        array_map(function (ArtistPayout $artistPayout) use ($artistBatchPayout, &$index) {
            $artistPayout->setBatchPayout($artistBatchPayout);
            $artistBatchPayout->addArtistPayout($artistPayout);

            $artistPayout->setTrackingId(
                $artistBatchPayout->getTrackingId() . "_Item_" . str_pad((string)$index++, 20, "0", STR_PAD_LEFT)
            );

            $this->em->persist($artistPayout);
            return null;
        }, $artistPayouts);

        $this->em->persist($artistBatchPayout);
        $this->em->flush();

        $this->executeBatchPayoutWithPaypal($artistBatchPayout);
    }

    public function executeBatchPayoutWithPaypal(ArtistBatchPayout $artistBatchPayout)
    {
        $this->paypalBridge->makePayout($artistBatchPayout);
    }
}
