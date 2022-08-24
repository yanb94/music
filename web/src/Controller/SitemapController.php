<?php

namespace App\Controller;

use App\Entity\Song;
use App\Entity\Playlist;
use App\Repository\SongRepository;
use App\Repository\PlaylistRepository;
use Symfony\Contracts\Cache\ItemInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\Cache\TagAwareCacheInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class SitemapController extends AbstractController
{
    #[Route('/sitemap.xml', name: 'sitemap', format: "xml")]
    public function index(
        Request $request,
        SongRepository $songRepository,
        PlaylistRepository $playlistRepository,
        TagAwareCacheInterface $cache
    ): Response {
        return $cache->get('sitemap', function (ItemInterface $item) use (
            $request,
            $songRepository,
            $playlistRepository
) {

            $item->expiresAfter(60);

            $pages = $this->getStaticUrlInfo($request->getSchemeAndHttpHost());

            $urlsSong = $this->getUrlSongsInfo($songRepository, $request->getSchemeAndHttpHost());
            $urlsPlaylist = $this->getPlaylistPublicUrlInfo($playlistRepository, $request->getSchemeAndHttpHost());

            $pages = [...$pages, ...$urlsSong, ...$urlsPlaylist];

            return $this->render('sitemap/index.html.twig', [
                'pages' => $pages
            ]);
        });
    }

    private function getStaticUrlInfo(string $schemaHost): array
    {
        return [
            [
                "loc" => $schemaHost,
                "priority" => 1
            ],
            [
                "loc" => $schemaHost . '/catalogue',
                "priority" => 0.8
            ],
            [
                "loc" => $schemaHost . '/register',
                "priority" => 0.5
            ],
            [
                "loc" => $schemaHost . '/login',
                "priority" => 0.5
            ],
            [
                "loc" => $schemaHost . '/contact',
                "priority" => 0.5
            ]
        ];
    }

    private function getUrlSongsInfo(SongRepository $songRepository, string $schemaHost): array
    {
        $songs = $songRepository->findAll();

        return array_map(fn(Song $song) => [
            "loc" => $schemaHost . "/song/" . $song->getSlug(),
            "priority" => 0.9
        ], $songs);
    }

    private function getPlaylistPublicUrlInfo(PlaylistRepository $playlistRepository, string $schemaHost): array
    {
        $playlists = $playlistRepository->findBy(['isPublic' => true]);

        return array_map(fn(Playlist $playlist) => [
            "loc" => $schemaHost . "/playlist/" . $playlist->getSlug(),
            "priority" => 0.9
        ], $playlists);
    }
}
