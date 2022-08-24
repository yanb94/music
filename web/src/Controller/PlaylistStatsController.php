<?php

namespace App\Controller;

use App\Entity\Playlist;
use App\Service\StatsFieldProcessor;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class PlaylistStatsController extends AbstractController
{
    #[Route('/api/playlists/{slug}/stats', name: 'playlist_stats')]
    public function playlistStats(Playlist $playlist, StatsFieldProcessor $statsFieldProcessor): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_USER');

        $user = $this->getUser();

        if ($user != $playlist->getAuthor()) {
            throw $this->createAccessDeniedException();
        }

        [$viewsString, $dateString] = $statsFieldProcessor->getStats($playlist);

        $views = json_decode($viewsString, true);
        $dates = json_decode($dateString, true);

        return new JsonResponse([
            "views" => $views,
            "dates" => $dates
        ]);
    }
}
