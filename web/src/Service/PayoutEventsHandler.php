<?php

namespace App\Service;

use App\Entity\ArtistBatchPayout;
use App\Entity\ArtistPayout;
use App\Repository\ArtistBatchPayoutRepository;
use App\Repository\ArtistPayoutRepository;
use Doctrine\ORM\EntityManagerInterface;
use Exception;

class PayoutEventsHandler
{
    public const BATCH_PAYOUT_DENIED = 'PAYMENT.PAYOUTSBATCH.DENIED';
    public const BATCH_PAYOUT_PROCESSING = 'PAYMENT.PAYOUTSBATCH.PROCESSING';
    public const BATCH_PAYOUT_SUCCESS = 'PAYMENT.PAYOUTSBATCH.SUCCESS';

    public const PAYOUT_ITEM_BLOCKED = 'PAYMENT.PAYOUTS-ITEM.BLOCKED';
    public const PAYOUT_ITEM_CANCELED = 'PAYMENT.PAYOUTS-ITEM.CANCELED';
    public const PAYOUT_ITEM_DENIED = 'PAYMENT.PAYOUTS-ITEM.DENIED';
    public const PAYOUT_ITEM_FAILED = 'PAYMENT.PAYOUTS-ITEM.FAILED';
    public const PAYOUT_ITEM_HELD = 'PAYMENT.PAYOUTS-ITEM.HELD';
    public const PAYOUT_ITEM_REFUNDED = 'PAYMENT.PAYOUTS-ITEM.REFUNDED';
    public const PAYOUT_ITEM_RETURNED = 'PAYMENT.PAYOUTS-ITEM.RETURNED';
    public const PAYOUT_ITEM_SUCCEEDED = 'PAYMENT.PAYOUTS-ITEM.SUCCEEDED';
    public const PAYOUT_ITEM_UNCLAIMED = 'PAYMENT.PAYOUTS-ITEM.UNCLAIMED';

    public function __construct(
        private EntityManagerInterface $em,
        private ArtistBatchPayoutRepository $artistBatchPayoutRepository,
        private ArtistPayoutRepository $artistPayoutRepository
    ) {
    }

    public function handleEvent(array $data)
    {
        if (!isset($data['event_type'])) {
            throw new Exception('Event of bad shape');
        }

        switch ($data['event_type']) {
            case self::BATCH_PAYOUT_DENIED:
                $this->batchPayoutDenied($data);
                break;
            case self::BATCH_PAYOUT_PROCESSING:
                $this->batchPayoutProcessing($data);
                break;
            case self::BATCH_PAYOUT_SUCCESS:
                $this->batchPayoutSuccess($data);
                break;
            case self::PAYOUT_ITEM_BLOCKED:
                $this->itemPayoutBlocked($data);
                break;
            case self::PAYOUT_ITEM_CANCELED:
                $this->itemPayoutCanceled($data);
                break;
            case self::PAYOUT_ITEM_DENIED:
                $this->itemPayoutDenied($data);
                break;
            case self::PAYOUT_ITEM_FAILED:
                $this->itemPayoutFailed($data);
                break;
            case self::PAYOUT_ITEM_HELD:
                $this->itemPayoutHeld($data);
                break;
            case self::PAYOUT_ITEM_REFUNDED:
                $this->itemPayoutRefunded($data);
                break;
            case self::PAYOUT_ITEM_RETURNED:
                $this->itemPayoutReturned($data);
                break;
            case self::PAYOUT_ITEM_SUCCEEDED:
                $this->itemPayoutSucceeded($data);
                break;
            case self::PAYOUT_ITEM_UNCLAIMED:
                $this->itemPayoutUnclaimed($data);
                break;
            default:
                throw new Exception('Event unknow');
                break;
        }
    }

    private function getBatchPayoutInDatabase(array $data): ArtistBatchPayout
    {
        $trackingId = $data['resource']['batch_header']['sender_batch_header']['sender_batch_id'];

        $batchPayout = $this->artistBatchPayoutRepository->findOneBy(['trackingId' => $trackingId]);

        if (is_null($batchPayout)) {
            throw new Exception('No corresponding batch payout payment in database');
        }

        return $batchPayout;
    }

    private function getPayoutItemInDatabase(array $data): ArtistPayout
    {
        $trackingId = $data['resource']['payout_item']['sender_item_id'];

        $itemPayout = $this->artistPayoutRepository->findOneBy(['trackingId' => $trackingId]);

        if (is_null($itemPayout)) {
            throw new Exception('No corresponding item payout payment in database');
        }

        return $itemPayout;
    }

    private function handleBatchPayout(array $data, string $newStatus)
    {
        $batchPayout = $this->getBatchPayoutInDatabase($data);
        $batchPayout->setStatus($newStatus);

        if (is_null($batchPayout->getPaypalId())) {
            $batchPayout->setPaypalId($data['resource']['batch_header']['payout_batch_id']);
        }

        $this->em->persist($batchPayout);
        $this->em->flush();
    }

    private function handleItemPayout(array $data, string $newStatus)
    {
        $itemPayout = $this->getPayoutItemInDatabase($data);
        $itemPayout->setStatus($newStatus);

        if (is_null($itemPayout->getPaypalId())) {
            $itemPayout->setPaypalId($data['resource']['payout_item_id']);
        }

        $this->em->persist($itemPayout);
        $this->em->flush();
    }

    private function batchPayoutDenied(array $data)
    {
        $this->handleBatchPayout($data, ArtistBatchPayout::DENIED);
    }

    private function batchPayoutProcessing(array $data)
    {
        $this->handleBatchPayout($data, ArtistBatchPayout::PROCESSING);
    }

    private function batchPayoutSuccess(array $data)
    {
        $this->handleBatchPayout($data, ArtistBatchPayout::SUCCESS);
    }

    // Item Payout

    private function itemPayoutSucceeded(array $data)
    {
        $this->handleItemPayout($data, ArtistPayout::SUCCESS);
    }

    private function itemPayoutBlocked(array $data)
    {
        $this->handleItemPayout($data, ArtistPayout::BLOCKED);
    }

    private function itemPayoutDenied(array $data)
    {
        $this->handleItemPayout($data, ArtistPayout::DENIED);
    }

    private function itemPayoutFailed(array $data)
    {
        $this->handleItemPayout($data, ArtistPayout::FAILED);
    }

    private function itemPayoutHeld(array $data)
    {
        $this->handleItemPayout($data, ArtistPayout::ONHOLD);
    }

    private function itemPayoutRefunded(array $data)
    {
        $this->handleItemPayout($data, ArtistPayout::REFUNDED);
    }

    private function itemPayoutReturned(array $data)
    {
        $this->handleItemPayout($data, ArtistPayout::RETURNED);
    }

    private function itemPayoutUnclaimed(array $data)
    {
        $this->handleItemPayout($data, ArtistPayout::UNCLAIMED);
    }

    private function itemPayoutCanceled(array $data)
    {
        $this->handleItemPayout($data, ArtistPayout::CANCELED);
    }
}
