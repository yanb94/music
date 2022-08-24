<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\ArtistPayoutRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class MyArtistPayoutController extends AbstractController
{
    private const PAGINATION = 10;

    public function __construct(
        private EntityManagerInterface $em,
        private TokenStorageInterface $tokenStorage,
        private ArtistPayoutRepository $artistPayoutRepository
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
        $user = $this->getUser();

        if (!is_null($user)) {
            return $this->artistPayoutRepository->findArtistPayoutByArtist($user->getArtist(), $page, $itemsPerPage);
        }
    }
}
