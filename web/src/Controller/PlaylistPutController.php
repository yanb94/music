<?php

namespace App\Controller;

use App\Entity\Playlist;
use App\Repository\SongRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[AsController]
class PlaylistPutController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private SongRepository $songRepository
    ) {
    }

    public function __invoke(Request $request)
    {
        /** @var Playlist */
        $playlist = $request->attributes->get("data");

        $jsonData = json_decode($request->request->get('json'));

        $playlist->setName($jsonData->name);
        $playlist->setIsPublic($jsonData->isPublic);

        $playlist->clearSong();
        $nbSongs = 0;
        $playlistDuration = 0;
        foreach ($jsonData->songs as $songAttach) {
            $song = $this->songRepository->findOneBy(['id' => $songAttach->id]);
            if (!is_null($song)) {
                $playlist->addSong($song);
                $playlistDuration += $song->getSongDuration();
                $nbSongs++;
            }
        }

        $playlist->setDuration($playlistDuration);
        $playlist->setNbSongs($nbSongs);

        return $playlist;
    }
}
