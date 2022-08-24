<?php

namespace App\Service;

use App\Entity\Song;
use Elastica\Result;
use Elastica\ResultSet;
use App\Entity\Playlist;
use App\Repository\SongRepository;
use App\Serializer\SongNormalizer;
use App\Repository\PlaylistRepository;
use App\Serializer\PlaylistNormalizer;
use FOS\ElasticaBundle\Index\IndexManager;

class SearchSongsAndPlaylistsService
{
    public function __construct(
        private IndexManager $manager,
        private SongRepository $songRepository,
        private PlaylistRepository $playlistRepository,
        private SongNormalizer $songNormalizer,
        private PlaylistNormalizer $playlistNormalizer
    ) {
    }

    public function search(string $search, string $uri, int $pagination = 10, int $page = 1): array
    {
        $searchQuery = $this->createSearch($search);
        $paginateResult = $this->paginateResult($searchQuery, $page, $pagination);
        $nbElements = $searchQuery->getTotalHits();
        $maxPage = $this->getMaxPage($searchQuery, $pagination);

        [$listSongsId, $listPlaylistsId] = $this->getIdListsOfElements($paginateResult);

        $songs = $this->hydrateListSongs($listSongsId);
        $playlists = $this->hydrateListPlaylists($listPlaylistsId);

        $listOfObject = $this->normalizeAndOrderElements($paginateResult, $songs, $playlists);
        $paginateInfos = $this->generatePaginatePath($uri, $page, $maxPage);

        return [
            "@id" => "/api/search",
            "@type" => "hydra:Collection",
            "hydra:member" => $listOfObject,
            "hydra:totalItems" => $nbElements,
            "hydra:view" => $paginateInfos
        ];
    }

    private function createSearch(string $searchParams): ResultSet
    {
        $search = $this->manager->getIndex('song')->createSearch($searchParams);
        $search->addIndex('playlist');

        return $search->search();
    }

    /**
     * Return raw paginated result of search
     *
     * @param ResultSet $searchQuery
     * @param integer $page
     * @param integer $pagination
     * @return Result[]
     */
    private function paginateResult(ResultSet $searchQuery, int $page, int $pagination): iterable
    {
        $results = $searchQuery->getResults();
        $results = array_slice($results, ($page - 1) * $pagination, $pagination);

        return $results;
    }

    private function getMaxPage(ResultSet $searchQuery, int $pagination): int
    {
        return ceil($searchQuery->getTotalHits() / $pagination);
    }

    /**
     * Get lists of id for all type of entities
     *
     * @param Result[] $paginateResult
     * @return array
     */
    private function getIdListsOfElements(iterable $paginateResult): array
    {
        $listSongsId = [];
        $listPlaylistsId = [];

        foreach ($paginateResult as $item) {
            switch ($item->getIndex()) {
                case 'song':
                    $listSongsId[] = $item->getId();
                    break;
                case 'playlist':
                    $listPlaylistsId[] = $item->getId();
                    break;
                default:
                    break;
            }
        }

        return [$listSongsId, $listPlaylistsId];
    }

    /**
     * Hydrate song elements
     *
     * @param array $listSongsId
     * @return Song[]
     */
    private function hydrateListSongs(array $listSongsId): iterable
    {
        return $this->songRepository->findSearchElements($listSongsId);
    }

    /**
     * Hydrate playlist elements
     *
     * @param array $listPlaylistsId
     * @return Playlist[]
     */
    private function hydrateListPlaylists(array $listPlaylistsId): iterable
    {
        return $this->playlistRepository->findSearchElements($listPlaylistsId);
    }

    private function normalizeSongs(Song $song): array
    {
        return $this->songNormalizer->normalize($song);
    }

    private function normalizePlaylist(Playlist $playlist): array
    {
        return $this->playlistNormalizer->normalize($playlist);
    }

    private function findAndNormalizeElement(
        iterable $list,
        string $type,
        string $url,
        string $normalizeFunction,
        int $id
    ): ?array {
        foreach ($list as $item) {
            if ($item->getId() == $id) {
                $info = [
                    "@id" => $url . $item->getId(),
                    "@type" => $type
                ];
                $normalizeItem = $this->$normalizeFunction($item);
                return array_merge($info, $normalizeItem);
            }
        }

        return null;
    }

    private function normalizeAndOrderElements(iterable $results, iterable $songs, iterable $playlists): array
    {
        $listOfObject = [];

        foreach ($results as $item) {
            if ($item->getIndex() == 'song') {
                $listOfObject[] = $this->findAndNormalizeElement(
                    $songs,
                    "Song",
                    "/api/songs/",
                    "normalizeSongs",
                    $item->getId()
                );
            }

            if ($item->getIndex() == 'playlist') {
                $listOfObject[] = $this->findAndNormalizeElement(
                    $playlists,
                    "Playlist",
                    "/api/playlists/",
                    "normalizePlaylist",
                    $item->getId()
                );
            }
        }

        return $listOfObject;
    }

    private function generatePaginatePath(string $uri, int $page, int $maxPage): array
    {
        $result = [
            "@id" => $this->createLinkForPagination($uri, $page),
            "@type" => "hydra:PartialCollectionView"
        ];

        if ($maxPage > 1) {
            $result['hydra:first'] = $this->createLinkForPagination($uri, 1);
            $result['hydra:last'] = $this->createLinkForPagination($uri, $maxPage);
        }

        if ($page > 1) {
            $result['hydra:previous'] = $this->createLinkForPagination($uri, $page - 1);
        }

        if ($page < $maxPage) {
            $result['hydra:next'] = $this->createLinkForPagination($uri, $page + 1);
        }

        return $result;
    }

    private function createLinkForPagination(string $url, int $page): string
    {
        if (str_contains($url, "page=")) {
            return preg_replace("/(page=[\d]+)/", "page=" . $page, $url);
        }

        if ($page > 1) {
            return $url . "&page=" . $page;
        }

        return $url;
    }
}
