<?php

namespace App\Storage;

use Vich\UploaderBundle\Mapping\PropertyMapping;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Vich\UploaderBundle\Storage\AbstractStorage;
use Symfony\Component\HttpFoundation\File\File;

class MockStorage extends AbstractStorage
{
    protected function doUpload(PropertyMapping $mapping, File $file, ?string $dir, string $name)
    {
        return null;
    }

    protected function doResolvePath(
        PropertyMapping $mapping,
        ?string $dir,
        string $name,
        ?bool $relative = false
    ): string {
        return '';
    }

    protected function doRemove(PropertyMapping $mapping, ?string $dir, string $name): ?bool
    {
        return true;
    }
}
