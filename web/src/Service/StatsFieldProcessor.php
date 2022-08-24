<?php

namespace App\Service;

use App\Entity\Artist;
use DateTime;
use App\Entity\Song;
use App\Entity\Playlist;
use App\Entity\User;
use App\Entity\ViewSongDaily;
use App\Entity\ViewPlaylistDaily;
use Doctrine\Persistence\ManagerRegistry;
use App\Repository\ViewSongDailyRepository;
use App\Repository\ViewPlaylistDailyRepository;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

class StatsFieldProcessor
{
    public function __construct(private ManagerRegistry $manager)
    {
    }

    private function generateDateRange(int $limit): array
    {
        $nbs = range(0, $limit);
        $result = [];

        for ($i = count($nbs) - 1; $i >= 0; $i--) {
            $relative = $nbs[$i] == 0 ? 'now' : '- ' . $nbs[$i] . ' days';

            $date = (new DateTime($relative))->format('d-m-Y');

            $result[$date] = 0;
        }

        return $result;
    }

    private function findDataByDate(string $search, iterable $data): ?int
    {
        foreach ($data as $item) {
            if (is_object($item) && $item->getDate()->format('d-m-Y') == $search) {
                return $item->getNbViews();
            }
            if (is_array($item) && $item['date']->format('d-m-Y') == $search) {
                return $item['views'];
            }
        }

        return null;
    }

    private function generateGraphViewWeekByDayAndEntity(
        object $entity,
        ServiceEntityRepository $repository,
        string $method
    ): array {
        $allViews = $repository->$method($entity, new DateTime('- 7 days'));

        $dateRange = $this->generateDateRange(7);

        $views = array_map(function ($index) use ($allViews) {

            $dbValue = $this->findDataByDate($index, $allViews);
            return is_null($dbValue) ? 0 : $dbValue;
        }, array_keys($dateRange));
        $date = array_map(fn($k) => "\"" . $k . "\"", array_keys($dateRange));

        $viewsString = "[" . implode(",", $views) . "]";
        $dateString = "[" . implode(',', $date) . "]";

        return [$viewsString, $dateString];
    }

    private function getStatsForSong(Song $song): array
    {
        /** @var ViewSongDailyRepository */
        $repository = $this->manager->getRepository(ViewSongDaily::class);

        return $this->generateGraphViewWeekByDayAndEntity($song, $repository, 'findByViewSongByDayAndSong');
    }

    private function getStatsForPlaylist(Playlist $playlist): array
    {
        /** @var ViewPlaylistDailyRepository */
        $repository = $this->manager->getRepository(ViewPlaylistDaily::class);

        return $this->generateGraphViewWeekByDayAndEntity($playlist, $repository, 'findByViewPlaylistByDayAndPlaylist');
    }

    public function getStatsByArtistForSong(Artist $artist): array
    {
        /** @var ViewSongDailyRepository */
        $repository = $this->manager->getRepository(ViewSongDaily::class);

        return $this->generateGraphViewWeekByDayAndEntity($artist, $repository, 'findByViewSongByArtistAndDay');
    }

    public function getStatsByUserForPlaylist(User $user): array
    {
        /** @var ViewPlaylistDailyRepository */
        $repository = $this->manager->getRepository(ViewPlaylistDaily::class);

        return $this->generateGraphViewWeekByDayAndEntity($user, $repository, 'findByViewPlaylistByUserAndDay');
    }

    public function getStats(object $object): ?array
    {
        if ($object instanceof Song) {
            return $this->getStatsForSong($object);
        } elseif ($object instanceof Playlist) {
            return $this->getStatsForPlaylist($object);
        } else {
            return null;
        }
    }
}
