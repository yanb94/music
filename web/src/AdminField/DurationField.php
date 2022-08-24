<?php

namespace App\AdminField;

use EasyCorp\Bundle\EasyAdminBundle\Contracts\Field\FieldInterface;
use EasyCorp\Bundle\EasyAdminBundle\Field\FieldTrait;

final class DurationField implements FieldInterface
{
    use FieldTrait;

    private static function turnSecondToTime(float $times): string
    {
        $minutes = floor($times % 3600 / 60);
        $secondes = floor($times % 3600 % 60);

        return str_pad($minutes, 2, "0", STR_PAD_LEFT) . ":" . str_pad($secondes, 2, "0", STR_PAD_LEFT);
    }

    /**
     * @param string|false|null $label
     */
    public static function new(string $propertyName, $label = null): self
    {
        return (new self())
            ->setProperty($propertyName)
            ->setLabel($label)
            ->formatValue(fn($value) => self::turnSecondToTime($value))
        ;
    }
}
