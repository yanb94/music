<?php

namespace App\Controller;

use App\Entity\Song;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[AsController]
class PutSongController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
    ) {
    }

    public function __invoke(Request $request)
    {
        /** @var Song */
        $song = $request->attributes->get("data");
        $song->setImageFile($request->files->get("imageFile"));

        return $song;
    }
}
