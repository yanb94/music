<?php

namespace App\Controller;

use DateTimeImmutable;
use App\Entity\ViewPlaylist;
use App\Entity\ViewPlaylistDaily;
use App\Repository\PlaylistRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\ViewPlaylistRepository;
use Symfony\Component\HttpFoundation\Request;
use App\Repository\ViewPlaylistDailyRepository;
use DateTime;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ViewPlaylistController extends AbstractController
{
    #[Route('api/view_playlist', name: 'view_playlist')]
    public function index(
        Request $request,
        PlaylistRepository $playlistRepository,
        ViewPlaylistRepository $viewPlaylistRepository,
        ViewPlaylistDailyRepository $viewPlaylistDailyRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        $jsonData = json_decode($request->getContent(), true);

        $playlistId = $jsonData['playlist'];
        $ip = $request->getClientIp();

        $playlist = $playlistRepository->findOneBy(['id' => $playlistId]);

        if (is_null($playlist)) {
            return new JsonResponse([
                "error" => "Playlist not found"
            ], 404);
        }

        $oldView = $viewPlaylistRepository->findOneBy(
            [
                'ip' => $ip,
                'playlist' => $playlist,
                'date' => new DateTime('now')
            ]
        );

        if (!is_null($oldView)) {
            return new JsonResponse([
                "info" => "Playlist already view today"
            ], 200);
        }

        $currentView = (new ViewPlaylist())
            ->setIp($ip)
            ->setPlaylist($playlist)
            ->setDate(new DateTime('now'))
        ;

        $em->persist($currentView);

        $date = new DateTimeImmutable();

        $oldViewDaily = $viewPlaylistDailyRepository->findOneBy(['playlist' => $playlist, 'date' => $date]);

        if (!is_null($oldViewDaily)) {
            $oldViewDaily->incrementNbViews();
            $em->persist($oldViewDaily);
        } else {
            $currentViewDaily = (new ViewPlaylistDaily())
                ->setPlaylist($playlist)
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
