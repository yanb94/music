<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\SongRepository;
use App\Exception\NotFoundException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[AsController]
class AutocompleteSongsController extends AbstractController
{
    private const PAGINATION = 10;

    public function __construct(
        private SongRepository $songRepository
    ) {
    }


    public function __invoke(Request $request)
    {
        $itemsPerPage = (int) $request->query->get('itemsPerPage', self::PAGINATION);
        $search = $request->query->get('s', null);

        if ($search == null) {
            throw new NotFoundException("Pas de mot clé");
        }

        return $this->songRepository->findAutocomplete($search, $itemsPerPage);
    }
}
