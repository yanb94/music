<?php

namespace App\Service;

use Imagick;

class GenerateResponsiveImage
{
    private const IMAGE_XL = 1200;
    private const IMAGE_XL_FOLDER = "XL";

    private const IMAGE_L = 992;
    private const IMAGE_L_FOLDER = "L";

    private const IMAGE_M = 768;
    private const IMAGE_M_FOLDER = "M";

    private const IMAGE_S = 576;
    private const IMAGE_S_FOLDER = "S";

    private string $imagePath;
    private string $imageResponsivePath;

    public function __construct()
    {
        $this->imagePath = __DIR__ . '/../../assets/image';
        $this->imageResponsivePath = __DIR__ . "/../../assets/image_responsive";
    }

    public function generateResponsivesImages()
    {
        $imageList = array_diff(scandir($this->imagePath), array('.', '..'));

        foreach ($imageList as $image) {
            $this->createAndSaveNewImage($image, self::IMAGE_XL, self::IMAGE_XL_FOLDER);
            $this->createAndSaveNewImage($image, self::IMAGE_L, self::IMAGE_L_FOLDER);
            $this->createAndSaveNewImage($image, self::IMAGE_M, self::IMAGE_M_FOLDER);
            $this->createAndSaveNewImage($image, self::IMAGE_S, self::IMAGE_S_FOLDER);
        }
    }

    private function createAndSaveNewImage(string $image, int $dimension, string $folder): void
    {
        $imagick = new Imagick(realpath($this->imagePath . "/" . $image));
        $imagick->resizeImage($dimension, 0, Imagick::FILTER_UNDEFINED, 1);
        $imagick->writeImage($this->imageResponsivePath . "/" . $folder . "/" . $image);
    }
}
