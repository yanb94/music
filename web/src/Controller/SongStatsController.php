<?php

namespace App\Controller;

use App\Entity\Song;
use App\Service\StatsFieldProcessor;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class SongStatsController extends AbstractController
{
    #[Route('/api/songs/{slug}/stats', name: 'song_stats')]
    public function songStats(Song $song, StatsFieldProcessor $statsFieldProcessor): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_USER');

        $user = $this->getUser();

        if ($user != $song->getAuthor()->getUser()) {
            throw $this->createAccessDeniedException();
        }

        [$viewsString, $dateString] = $statsFieldProcessor->getStats($song);

        $views = json_decode($viewsString, true);
        $dates = json_decode($dateString, true);

        return new JsonResponse([
            "views" => $views,
            "dates" => $dates
        ]);
    }
}
