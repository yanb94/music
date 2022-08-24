<?php

namespace App\Controller\Admin;

use DateTime;
use App\Entity\Song;
use App\Entity\User;
use App\Entity\Legal;
use App\Entity\Artist;
use App\Entity\Playlist;
use App\Repository\SongRepository;
use App\Repository\UserRepository;
use App\Repository\ArtistRepository;
use App\Repository\PlaylistRepository;
use App\Repository\ViewPlaylistRepository;
use App\Repository\ViewSongDailyRepository;
use App\Controller\Admin\ArtistCrudController;
use App\Entity\ArtistBatchPayout;
use App\Entity\Invoice;
use App\Repository\InvoiceMonthRepository;
use Symfony\Component\HttpFoundation\Response;
use App\Repository\ViewPlaylistDailyRepository;
use Symfony\Component\Routing\Annotation\Route;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;

class DashboardController extends AbstractDashboardController
{
    public function __construct(
        private ViewSongDailyRepository $viewSongDailyRepository,
        private ViewPlaylistDailyRepository $viewPlaylistDailyRepository,
        private SongRepository $songRepository,
        private PlaylistRepository $playlistRepository,
        private ArtistRepository $artistRepository,
        private UserRepository $userRepository,
        private InvoiceMonthRepository $invoiceMonthRepository
    ) {
    }

    /**
     * @Route("/admin", name="admin")
     */
    public function index(): Response
    {
        [$viewsPlaylistString, $datePlaylistString, $playlistLink] = $this->generateViewsPlaylistByDayGraph();

        [$viewsString, $dateString, $songLink] = $this->generateViewsSongByDayGraph();

        $bestSongs = $this->viewSongDailyRepository->findBestViewSongByDay(new DateTime('- 1 day'), 3);
        $bestPlaylists = $this->viewPlaylistDailyRepository->findBestViewPlaylistByDay(new DateTime('- 1 day'), 3);

        $nbSongs = $this->songRepository->count([]);
        $nbPlaylists = $this->playlistRepository->count(["isPublic" => true]);
        $nbArtists = $this->artistRepository->count([]);
        $nbUsers = $this->userRepository->count(["isValidate" => true]);

        $invoicesMonth = $this->invoiceMonthRepository->getLastInvoiceMonth(12);

        if (isset($invoicesMonth[0]) && $invoicesMonth[0]->getMonth() == (new DateTime())->format('m-Y')) {
            $artistPart = ($invoicesMonth[0]->getSubTotal() * $this->getParameter('artistPart')) / 100;
            $profit = ($invoicesMonth[0]->getSubTotal() * $this->getParameter('profit')) / 100;
            $vat = ($invoicesMonth[0]->getVat()) / 100;
        } else {
            $artistPart = 0;
            $profit = 0;
            $vat = 0;
        }

        [$invoicesString, $monthInvoiceString, $linkInvoice] = $this->generateInvoiceByMonth($invoicesMonth);

        return $this->render("admin/dashboard/index.html.twig", [
            "view" => $viewsString,
            "date" => $dateString,
            "songLink" => $songLink,

            "viewPlaylist" => $viewsPlaylistString,
            "datePlaylist" => $datePlaylistString,
            "playlistLink" => $playlistLink,

            "nbSongs" => $this->shortNumber($nbSongs),
            "nbPlaylists" => $this->shortNumber($nbPlaylists),
            "nbArtists" => $this->shortNumber($nbArtists),
            "nbUsers" => $this->shortNumber($nbUsers),

            "bestSongs" => $bestSongs,
            "bestPlaylists" => $bestPlaylists,

            "invoicesString" => $invoicesString,
            "monthInvoiceString" => $monthInvoiceString,
            "linkInvoice" => $linkInvoice,

            "artistPart" => $this->shortNumber($artistPart),
            "profit" => $this->shortNumber($profit),
            "vat" => $this->shortNumber($vat)
        ]);
    }

    private function generateViewsSongByDayGraph(): array
    {
        return $this->generateGraphViewWeekByDay(
            SongCrudController::class,
            $this->viewSongDailyRepository,
            "findByViewSongByDay"
        );
    }

    private function generateViewsPlaylistByDayGraph(): array
    {
        return $this->generateGraphViewWeekByDay(
            PlaylistCrudController::class,
            $this->viewPlaylistDailyRepository,
            "findByViewPlaylistByDay"
        );
    }

    private function generateGraphViewWeekByDay(
        string $classController,
        ServiceEntityRepository $repository,
        string $method
    ): array {
        $routeBuilder = $this->get(AdminUrlGenerator::class);
        $link = $routeBuilder->setController($classController)->generateUrl();

        $allViews = $repository->$method(new DateTime('- 7 days'));

        $dateRange = $this->generateDateRange(7);

        $views = array_map(function ($index) use ($allViews) {

            $dbValue = $this->findDataByDate($index, $allViews);
            return is_null($dbValue) ? 0 : $dbValue;
        }, array_keys($dateRange));
        $date = array_map(fn($k) => "\"" . $k . "\"", array_keys($dateRange));

        $viewsString = "[" . implode(",", $views) . "]";
        $dateString = "[" . implode(',', $date) . "]";

        return [$viewsString, $dateString, $link];
    }

    private function findDataByDate(string $search, iterable $data): ?int
    {
        foreach ($data as $item) {
            if ($item['date']->format('d-m-Y') == $search) {
                return $item['views'];
            }
        }

        return null;
    }

    private function findDataByMonth(string $search, iterable $data): ?float
    {
        foreach ($data as $item) {
            if ($item->getMonth() == $search) {
                return $item->getTotal() / 100;
            }
        }

        return null;
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

    private function generateMonthRange(int $limit): array
    {
        $nbs = range(0, $limit);
        $result = [];

        for ($i = count($nbs) - 1; $i >= 0; $i--) {
            $relative = $nbs[$i] == 0 ? 'now' : '- ' . $nbs[$i] . ' months';

            $date = (new DateTime($relative))->format('m-Y');

            $result[$date] = 0;
        }

        return $result;
    }

    private function generateInvoiceByMonth($collection, $limit = 12)
    {
        $routeBuilder = $this->get(AdminUrlGenerator::class);
        $link = $routeBuilder->setController(InvoiceCrudController::class)->generateUrl();

        $dateRange = $this->generateMonthRange($limit);

        $views = array_map(function ($index) use ($collection) {

            $dbValue = $this->findDataByMonth($index, $collection);
            return is_null($dbValue) ? 0.0 : $dbValue;
        }, array_keys($dateRange));

        $date = array_map(fn($k) => "\"" . $k . "\"", array_keys($dateRange));

        $invoicesString = "[" . implode(",", $views) . "]";
        $dateString = "[" . implode(',', $date) . "]";

        return [$invoicesString, $dateString, $link];
    }

    private function shortNumber($num)
    {
        $units = ['', 'K', 'M', 'B', 'T'];
        for ($i = 0; $num >= 1000; $i++) {
            $num /= 1000;
        }
        return round($num, 1) . $units[$i];
    }

    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('Song');
    }

    public function configureMenuItems(): iterable
    {
        yield MenuItem::linktoDashboard('Accueil', 'fa fa-home');
        yield MenuItem::linkToCrud('Utilisateurs', 'fas fa-user', User::class);
        yield MenuItem::linkToCrud('Artistes', 'fas fa-users', Artist::class);
        yield MenuItem::linkToCrud('Chansons', "fas fa-music", Song::class);
        yield MenuItem::linkToCrud('Playlists', "fas fa-headphones", Playlist::class);
        yield MenuItem::linkToCrud('Document Légaux', 'fas fa-balance-scale', Legal::class);
        yield MenuItem::linkToCrud('Factures', 'fas fa-file-alt', Invoice::class);
        yield MenuItem::linkToCrud('Paiement des artistes', 'fas fa-file-alt', ArtistBatchPayout::class);
    }
}
