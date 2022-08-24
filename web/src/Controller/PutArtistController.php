<?php

namespace App\Controller;

use App\Entity\Artist;
use App\Utils\UploadedBase64File;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Riverline\MultiPartParser\Converters;
use Symfony\Component\HttpFoundation\File\File;

#[AsController]
class PutArtistController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
    ) {
    }

    public function __invoke(Request $request)
    {
        /** @var Artist */
        $artist = $request->attributes->get("data");
        $artist->setFile($request->files->get("image"));

        return $artist;
    }
}
