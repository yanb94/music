<?php

namespace App\Tests\Functional\Controller;

use App\Entity\ArtistPayout;
use App\Entity\ArtistBatchPayout;
use App\Service\PayoutEventsHandler;
use App\Repository\ArtistPayoutRepository;
use App\DataFixtures\InvoiceAndPayoutFixtures;
use App\Repository\ArtistBatchPayoutRepository;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;

class PaypalWebHookControllerTest extends WebTestCase
{
    /** @var AbstractDatabaseTool */
    protected $databaseTool;

    private $testClient = null;

    public function setUp(): void
    {
        $this->testClient = static::createClient();
        $this->databaseTool = $this->testClient->getContainer()->get(DatabaseToolCollection::class)->get();
    }

    /**
     * @dataProvider getBatchPayoutStatus
     */
    public function testWhenBatchPayementStatusChange(string $waitedEventStatus, string $waitedBatchPayoutStatus): void
    {
        $client = $this->testClient;

        $this->databaseTool->loadFixtures([InvoiceAndPayoutFixtures::class]);

        $client->request(
            'POST',
            "/api/paypal-webhook",
            [
            'headers' => [
                "Accept" => "application/json",
            ]
            ],
            content: json_encode([
                "event_type" => $waitedEventStatus,
                "resource" => [
                    "batch_header" => [
                        "sender_batch_header" => [
                            "sender_batch_id" => "batch_payout"
                        ]
                    ]
                ]
            ])
        );

        /** @var ArtistBatchPayoutRepository */
        $artistBatchPayoutRepository = $client->getContainer()->get(ArtistBatchPayoutRepository::class);

        $batchPayout = $artistBatchPayoutRepository->findOneBy(['trackingId' => "batch_payout"]);

        $this->assertSame($waitedBatchPayoutStatus, $batchPayout->getStatus());

        $this->assertResponseIsSuccessful();
    }

    /**
     * @dataProvider getBadDataForTheHandler
     */
    public function testWhenHookReceivedUnexpectedData(array $dataFromPaypal): void
    {
        $client = $this->testClient;

        $this->databaseTool->loadFixtures([InvoiceAndPayoutFixtures::class]);

        $client->request(
            'POST',
            "/api/paypal-webhook",
            [
            'headers' => [
                "Accept" => "application/json",
            ]
            ],
            content: json_encode($dataFromPaypal)
        );

        $this->assertResponseStatusCodeSame(500);
    }

    /**
     * @dataProvider getStatusForItemPayout
     */
    public function testWhenBatchItemPayementStatusChange(string $waitedEventStatus, string $payoutItemStatus): void
    {
        $client = $this->testClient;

        $this->databaseTool->loadFixtures([InvoiceAndPayoutFixtures::class]);

        $client->request(
            'POST',
            "/api/paypal-webhook",
            [
            'headers' => [
                "Accept" => "application/json",
            ]
            ],
            content: json_encode([
                "event_type" => $waitedEventStatus,
                "resource" => [
                    "payout_item" => [
                        "sender_item_id" => "batch_payout_item_1"
                    ]
                ]
            ])
        );

        /** @var ArtistPayoutRepository */
        $artistPayoutRepository = $client->getContainer()->get(ArtistPayoutRepository::class);

        $payout = $artistPayoutRepository->findOneBy(['trackingId' => "batch_payout_item_1"]);

        $this->assertSame($payoutItemStatus, $payout->getStatus());

        $this->assertResponseIsSuccessful();
    }

    public function getBatchPayoutStatus(): array
    {
        return [
            [PayoutEventsHandler::BATCH_PAYOUT_DENIED, ArtistBatchPayout::DENIED],
            [PayoutEventsHandler::BATCH_PAYOUT_PROCESSING, ArtistBatchPayout::PROCESSING],
            [PayoutEventsHandler::BATCH_PAYOUT_SUCCESS, ArtistBatchPayout::SUCCESS]
        ];
    }

    public function getBadDataForTheHandler(): array
    {
        return [
            //Unexpected data
            [[]],
            // Bad event
            [
                [
                    "event_type" => "truc",
                    "resource" => [
                        "batch_header" => [
                            "sender_batch_header" => [
                                "sender_batch_id" => "batch_payout"
                            ]
                        ]
                    ]
                ]
            ],
            // Not found batch element
            [
                [
                    "event_type" => PayoutEventsHandler::BATCH_PAYOUT_SUCCESS,
                    "resource" => [
                        "batch_header" => [
                            "sender_batch_header" => [
                                "sender_batch_id" => "batch_payout_not_found"
                            ]
                        ]
                    ]
                ]
            ],
            // Not found batch item element
            [
                [
                    "event_type" => PayoutEventsHandler::PAYOUT_ITEM_FAILED,
                    "resource" => [
                        "payout_item" => [
                            "sender_item_id" => "batch_payout_item_not_found"
                        ]
                    ]
                ]
            ]
        ];
    }

    public function getStatusForItemPayout(): array
    {
        return [
            [PayoutEventsHandler::PAYOUT_ITEM_BLOCKED, ArtistPayout::BLOCKED],
            [PayoutEventsHandler::PAYOUT_ITEM_CANCELED, ArtistPayout::CANCELED],
            [PayoutEventsHandler::PAYOUT_ITEM_DENIED, ArtistPayout::DENIED],
            [PayoutEventsHandler::PAYOUT_ITEM_FAILED, ArtistPayout::FAILED],
            [PayoutEventsHandler::PAYOUT_ITEM_HELD, ArtistPayout::ONHOLD],
            [PayoutEventsHandler::PAYOUT_ITEM_REFUNDED, ArtistPayout::REFUNDED],
            [PayoutEventsHandler::PAYOUT_ITEM_RETURNED, ArtistPayout::RETURNED],
            [PayoutEventsHandler::PAYOUT_ITEM_SUCCEEDED, ArtistPayout::SUCCESS],
            [PayoutEventsHandler::PAYOUT_ITEM_UNCLAIMED, ArtistPayout::UNCLAIMED],
        ];
    }
}
