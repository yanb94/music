<?php

namespace App\Controller;

use App\Entity\Song;
use App\Repository\SongRepository;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[AsController]
class SimilarsSongsController extends AbstractController
{
    public function __construct(private SongRepository $songRepository)
    {
    }

    public function __invoke(Song $song)
    {
        return $this->songRepository->getRandomSongsExceptOne($song->getId());
    }
}
