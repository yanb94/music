<?php

namespace App\Controller;

use App\Entity\Artist;
use App\Entity\User;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;

#[AsController]
class IsFollowerController extends AbstractController
{
    public function __construct()
    {
    }


    public function __invoke(Artist $artist)
    {
        /** @var User */
        $user = $this->getUser();

        if ($user != null) {
            if ($artist->getFollowers()->contains($user)) {
                return new JsonResponse([
                    "isFollower" => true
                ]);
            }
        }

        return new JsonResponse([
            "isFollower" => false
        ]);
    }
}
