<?php

namespace App\AdminField;

use DateTime;
use App\Repository\ViewSongDailyRepository;
use EasyCorp\Bundle\EasyAdminBundle\Field\FieldTrait;
use EasyCorp\Bundle\EasyAdminBundle\Contracts\Field\FieldInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

final class StatField implements FieldInterface
{
    use FieldTrait;

    /**
     * @param string|false|null $label
     */
    public static function new(string $propertyName, $label = null): self
    {
        return (new self())
            ->setProperty($propertyName)
            ->setLabel($label)
            ->setTemplatePath('admin/field/stats.html.twig')
            ->addWebpackEncoreEntries('statsField')
        ;
    }
}
