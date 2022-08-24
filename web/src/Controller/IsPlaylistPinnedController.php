<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Playlist;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[AsController]
class IsPlaylistPinnedController extends AbstractController
{
    public function __construct()
    {
    }

    public function __invoke(Playlist $playlist)
    {
        /** @var User */
        $user = $this->getUser();

        if ($playlist->getFollowers()->contains($user)) {
            return new JsonResponse([
                "isPinned" => true
            ]);
        }

        return new JsonResponse([
            "isPinned" => false
        ]);
    }
}
