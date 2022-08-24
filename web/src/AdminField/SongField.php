<?php

namespace App\AdminField;

use EasyCorp\Bundle\EasyAdminBundle\Contracts\Field\FieldInterface;
use EasyCorp\Bundle\EasyAdminBundle\Field\FieldTrait;

final class SongField implements FieldInterface
{
    use FieldTrait;

    private string $basePath;

    /**
     * @param string|false|null $label
     */
    public static function new(string $propertyName, $label = null): self
    {
        return (new self())
            ->setProperty($propertyName)
            ->setLabel($label)
            ->setTemplatePath('admin/field/song.html.twig')
        ;
    }

    public function setBasePath(string $basePath): self
    {
        $this->setCustomOption('basePath', $basePath);

        return $this;
    }
}
