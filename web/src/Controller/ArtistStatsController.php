<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\StatsFieldProcessor;
use App\Service\StatsUpcomingIncomeForArtist;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ArtistStatsController extends AbstractController
{
    #[Route('/api/users/my-stats', name: 'artists_stats')]
    public function artistsStats(
        StatsFieldProcessor $statsFieldProcessor,
        StatsUpcomingIncomeForArtist $statsUpcomingIncomeForArtist
    ): JsonResponse {
        $this->denyAccessUnlessGranted("ROLE_USER");

        /** @var User */
        $user = $this->getUser();
        $artist = $user->getArtist();

        if (is_null($artist)) {
            throw $this->createAccessDeniedException("Vous devez être artiste pour accéder aux statistiques");
        }

        $nbPlaylists = count($user->getPlaylists());

        [$viewSongByArtistViews, $viewSongByArtistDates] = $statsFieldProcessor->getStatsByArtistForSong($artist);

        $viewSongByArtistDates = json_decode($viewSongByArtistDates, true);
        $viewSongByArtistViews = json_decode($viewSongByArtistViews, true);

        [$viewPlaylistByUserViews, $viewPlaylistByUserDates] = $statsFieldProcessor->getStatsByUserForPlaylist($user);

        $viewPlaylistByUserDates = json_decode($viewPlaylistByUserDates, true);
        $viewPlaylistByUserViews = json_decode($viewPlaylistByUserViews, true);

        $upcomingIncome = $statsUpcomingIncomeForArtist->generateUpcomingIncome($artist);

        return new JsonResponse([
            "nbSongs" => $artist->getNbSongs(),
            "nbPlaylists" => $nbPlaylists,
            "nbFollowers" => $artist->getNbFollowers(),
            "viewsSongs" => [
                "dates" => $viewSongByArtistDates,
                "views" => $viewSongByArtistViews
            ],
            "viewsPlaylists" => [
                "dates" => $viewPlaylistByUserDates,
                "views" => $viewPlaylistByUserViews
            ],
            "upcomingIncome" => $upcomingIncome
        ], 200);
    }
}
