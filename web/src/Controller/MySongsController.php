<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\SongRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

#[AsController]
class MySongsController extends AbstractController
{
    private const PAGINATION = 10;

    public function __construct(
        private EntityManagerInterface $em,
        private TokenStorageInterface $tokenStorage,
        private SongRepository $songRepository
    ) {
    }

    public function getUser(): ?User
    {
        $token = $this->tokenStorage->getToken();

        if (!$token) {
            return null;
        }

        $user = $token->getUser();

        if (!$user instanceof User) {
            return null;
        }

        return $user;
    }

    public function __invoke(Request $request)
    {
        $page = (int) $request->query->get('page', 1);
        $itemsPerPage = (int) $request->query->get('itemsPerPage', self::PAGINATION);
        $search = $request->query->get('s', null);
        $user = $this->getUser();

        if ($user != null && $search == null) {
            $artist = $user->getArtist();
            return $this->songRepository->findByAuthorPaginated($artist, $page, $itemsPerPage);
        } elseif ($user != null && !is_null($search)) {
            $artist = $user->getArtist();
            return $this->songRepository->findByAuthorAndSearchPaginated($artist, $search, $page, $itemsPerPage);
        }
    }
}
