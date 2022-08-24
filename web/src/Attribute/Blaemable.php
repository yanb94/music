<?php

namespace App\Attribute;

use Attribute;

#[Attribute(Attribute::TARGET_PROPERTY)]
class Blaemable
{
    public function __construct(private ?string $property)
    {
    }

    /**
     * Get the value of property
     */
    public function getProperty(): ?string
    {
        return $this->property;
    }

    /**
     * Set the value of property
     *
     * @return  self
     */
    public function setProperty(?string $property): self
    {
        $this->property = $property;

        return $this;
    }
}
