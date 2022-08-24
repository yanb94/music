<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\ArtistPayoutRepository;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\MyArtistPayoutController;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ArtistPayoutRepository::class)
 */
#[
    ApiResource(
        order: ['id' => 'DESC'],
        collectionOperations: [
            'my_payement' => [
                'method' => 'GET',
                'path' => "/artist_payouts/my_payement",
                'controller' => MyArtistPayoutController::class,
                'normalization_context' => ["groups" => ['list']],
                "security" => "is_granted('ROLE_USER') && user.getArtist() != null",
            ],
        ],
        itemOperations: [
            "get" => [
                "security" => "object.getArtist().getUser() == user",
                'normalization_context' => ["groups" => ['item']]
            ]
        ]
    )
]
class ArtistPayout
{
    public const SUCCESS = 'SUCCESS';
    public const FAILED = 'FAILED';
    public const PENDING = 'PENDING';
    public const UNCLAIMED = 'UNCLAIMED';
    public const RETURNED = 'RETURNED';
    public const ONHOLD = 'ONHOLD';
    public const BLOCKED = 'BLOCKED';
    public const REFUNDED = 'REFUNDED';
    public const REVERSED = 'REFERSED';
    public const CREATED = 'CREATED';
    public const DENIED = 'DENIED';
    public const CANCELED = 'CANCELED';

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    #[
        Groups(['item','list']),
    ]
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    #[
        Groups(['item','list']),
    ]
    private $amount;

    /**
     * @ORM\Column(type="string", length=255)
     */
    #[
        Groups(['item','list']),
    ]
    private $month;

    /**
     * @ORM\Column(type="string", length=255)
     */
    #[
        Groups(['item','list']),
    ]
    private $status = self::CREATED;

    /**
     * @ORM\ManyToOne(targetEntity=Artist::class, inversedBy="artistPayouts")
     * @ORM\JoinColumn(nullable=true ,onDelete="SET NULL")
     */
    private $artist;

    /**
     * @ORM\ManyToOne(targetEntity=ArtistBatchPayout::class, inversedBy="artistPayouts")
     * @ORM\JoinColumn(nullable=false)
     */
    private $batchPayout;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $trackingId;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $paypalId;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?int
    {
        return $this->amount;
    }

    public function setAmount(int $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getMonth(): ?string
    {
        return $this->month;
    }

    public function setMonth(string $month): self
    {
        $this->month = $month;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getArtist(): ?Artist
    {
        return $this->artist;
    }

    public function setArtist(?Artist $artist): self
    {
        $this->artist = $artist;

        return $this;
    }

    public function getBatchPayout(): ?ArtistBatchPayout
    {
        return $this->batchPayout;
    }

    public function setBatchPayout(?ArtistBatchPayout $batchPayout): self
    {
        $this->batchPayout = $batchPayout;

        return $this;
    }

    public function getTrackingId(): ?string
    {
        return $this->trackingId;
    }

    public function setTrackingId(string $trackingId): self
    {
        $this->trackingId = $trackingId;

        return $this;
    }

    public function getPaypalId(): ?string
    {
        return $this->paypalId;
    }

    public function setPaypalId(?string $paypalId): self
    {
        $this->paypalId = $paypalId;

        return $this;
    }
}
