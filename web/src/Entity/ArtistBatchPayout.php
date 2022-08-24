<?php

namespace App\Entity;

use App\Repository\ArtistBatchPayoutRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ArtistBatchPayoutRepository::class)
 */
class ArtistBatchPayout
{
    public const SUCCESS = 'SUCCESS';
    public const DENIED = 'DENIED';
    public const PENDING = 'PENDING';
    public const PROCESSING = 'PROCESSING';
    public const CANCELED = 'CANCELED';
    public const CREATED = 'CREATED';

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $amount;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $month;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $status = self::CREATED;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $trackingId;

    /**
     * @ORM\OneToMany(targetEntity=ArtistPayout::class, mappedBy="batchPayout", orphanRemoval=true)
     */
    private $artistPayouts;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $paypalId;

    public function __construct()
    {
        $this->artistPayouts = new ArrayCollection();
    }

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

    public function getTrackingId(): ?string
    {
        return $this->trackingId;
    }

    public function setTrackingId(?string $trackingId): self
    {
        $this->trackingId = $trackingId;

        return $this;
    }

    /**
     * @return Collection|ArtistPayout[]
     */
    public function getArtistPayouts(): Collection
    {
        return $this->artistPayouts;
    }

    public function addArtistPayout(ArtistPayout $artistPayout): self
    {
        if (!$this->artistPayouts->contains($artistPayout)) {
            $this->artistPayouts[] = $artistPayout;
            $artistPayout->setBatchPayout($this);
        }

        return $this;
    }

    public function removeArtistPayout(ArtistPayout $artistPayout): self
    {
        if ($this->artistPayouts->removeElement($artistPayout)) {
            // set the owning side to null (unless already changed)
            if ($artistPayout->getBatchPayout() === $this) {
                $artistPayout->setBatchPayout(null);
            }
        }

        return $this;
    }

    public function getPaypalId(): ?string
    {
        return $this->paypalId;
    }

    public function setPaypalId(string $paypalId): self
    {
        $this->paypalId = $paypalId;

        return $this;
    }
}
