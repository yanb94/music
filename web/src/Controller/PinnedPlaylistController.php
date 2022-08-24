<?php

namespace App\Controller;

use App\Repository\PlaylistRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[AsController]
class PinnedPlaylistController extends AbstractController
{
    private const PAGINATION = 8;

    public function __construct(private PlaylistRepository $playlistRepository)
    {
    }

    public function __invoke(Request $request)
    {
        $user = $this->getUser();

        $page = (int) $request->query->get('page', 1);
        $itemsPerPage = (int) $request->query->get('itemsPerPage', self::PAGINATION);

        return $this->playlistRepository->findByUserWhoPinPlaylists($user, $page, $itemsPerPage);
    }
}
