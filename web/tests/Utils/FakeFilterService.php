<?php

namespace App\Tests\Utils;

use Liip\ImagineBundle\Service\FilterService;

class FakeFilterService extends FilterService
{
    public function bustCache($path, $filter): bool
    {
        return true;
    }

    public function getUrlOfFilteredImage($path, $filter, $resolver = null, $webpSupported = false): string
    {
        $rawFileName = explode("/", $path);

        $fileName = $rawFileName[count($rawFileName) - 1];
        $pathCache = "/media/cache/";

        switch ($filter) {
            case '60_thumbnail':
                return $pathCache . "60_thumbnail/" . $fileName;
            case '100x90_thumbnail':
                return $pathCache . "100x90_thumbnail/" . $fileName;
            case '120_thumbnail':
                return $pathCache . '120_thumbnail/' . $fileName;
            case '130_thumbnail':
                return $pathCache . '130_thumbnail/' . $fileName;
            case '150_thumbnail':
                return $pathCache . '150_thumbnail/' . $fileName;
            case '200_thumbnail':
                return $pathCache . '200_thumbnail/' . $fileName;
            case '250_thumbnail':
                return $pathCache . '250_thumbnail/' . $fileName;
            case '850x500_thumbnail':
                return $pathCache . '850x500_thumbnail/' . $fileName;
            default:
                return "";
        }
    }
}
