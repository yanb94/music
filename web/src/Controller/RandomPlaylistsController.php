<?php

namespace App\Controller;

use App\Repository\PlaylistRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[AsController]
class RandomPlaylistsController extends AbstractController
{
    public function __construct(private PlaylistRepository $playlistRepository)
    {
    }

    public function __invoke(Request $request)
    {
        return $this->playlistRepository->getRandomPlaylists(4);
    }
}
