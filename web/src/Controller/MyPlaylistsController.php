<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\PlaylistRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

#[AsController]
class MyPlaylistsController extends AbstractController
{
    private const PAGINATION = 10;

    public function __construct(
        private EntityManagerInterface $em,
        private TokenStorageInterface $tokenStorage,
        private PlaylistRepository $playlistRepository
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

        if ($user != null && is_null($search)) {
            return $this->playlistRepository->findByAuthorPaginated($user, $page, $itemsPerPage);
        } elseif ($user != null && !is_null($search)) {
            return $this->playlistRepository->findByAuthorAndSearchPaginated($user, $search, $page, $itemsPerPage);
        }
    }
}
