<?php

namespace App\Controller;

use App\Entity\ViewSong;
use App\Entity\ViewSongDaily;
use App\Repository\SongRepository;
use App\Repository\ViewSongDailyRepository;
use App\Repository\ViewSongRepository;
use DateTime;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ViewSongController extends AbstractController
{
    #[Route('api/view_song', name: 'view_song', methods: ['post'])]
    public function index(
        Request $request,
        SongRepository $songRepository,
        ViewSongRepository $viewSongRepository,
        ViewSongDailyRepository $viewSongDailyRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        $jsonData = json_decode($request->getContent(), true);

        $songId = $jsonData['song'];
        $ip = $request->getClientIp();

        $song = $songRepository->findOneBy(['id' => $songId]);

        if (is_null($song)) {
            return new JsonResponse([
                "error" => "Song not found"
            ], 404);
        }

        $oldView = $viewSongRepository->findOneBy(['ip' => $ip, 'song' => $song, 'date' => new DateTime('now')]);

        if (!is_null($oldView)) {
            return new JsonResponse([
                "info" => "Song already view today"
            ], 200);
        }

        $currentView = (new ViewSong())
            ->setIp($ip)
            ->setSong($song)
            ->setDate(new DateTime('now'))
        ;

        $em->persist($currentView);

        $date = new DateTimeImmutable();

        $oldViewDaily = $viewSongDailyRepository->findOneBy(['song' => $song, 'date' => $date]);

        if (!is_null($oldViewDaily)) {
            $oldViewDaily->incrementNbViews();
            $em->persist($oldViewDaily);
        } else {
            $currentViewDaily = (new ViewSongDaily())
                ->setSong($song)
                ->setNbViews(1)
                ->setDate($date)
            ;

            $em->persist($currentViewDaily);
        }

        $em->flush();

        return new JsonResponse([
            "info" => "View added"
        ], 201);
    }
}
