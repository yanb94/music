<?php

namespace App\Entity;

use App\Repository\InvoiceMonthRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=InvoiceMonthRepository::class)
 */
class InvoiceMonth
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $month;

    /**
     * @ORM\Column(type="integer")
     */
    private $total;

    /**
     * @ORM\Column(type="integer")
     */
    private $subTotal;

    /**
     * @ORM\Column(type="integer")
     */
    private $vat;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getTotal(): ?int
    {
        return $this->total;
    }

    public function setTotal(int $total): self
    {
        $this->total = $total;

        return $this;
    }

    public function addToTotal(int $total): self
    {
        $this->total += $total;

        return $this;
    }

    public function getSubTotal(): ?int
    {
        return $this->subTotal;
    }

    public function setSubTotal(int $subTotal): self
    {
        $this->subTotal = $subTotal;

        return $this;
    }

    public function addToSubTotal(int $subTotal): self
    {
        $this->subTotal += $subTotal;

        return $this;
    }

    public function getVat(): ?int
    {
        return $this->vat;
    }

    public function setVat(int $vat): self
    {
        $this->vat = $vat;

        return $this;
    }

    public function addToVat(int $vat): self
    {
        $this->vat += $vat;

        return $this;
    }
}
