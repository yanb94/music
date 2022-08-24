<?php

namespace App\Controller;

use App\Entity\Artist;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[AsController]
class AddFollowerController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em
    ) {
    }


    public function __invoke(Artist $artist)
    {
        /** @var User */
        $user = $this->getUser();

        if ($user != null) {
            if ($artist->getFollowers()->contains($user)) {
                return $artist;
            }

            $artist->addFollower($user);
            $user->addSubscribe($artist);

            $artist->incrementNbFollowers();

            $this->em->persist($artist);
            $this->em->persist($user);

            $this->em->flush();
        }

        return $artist;
    }
}
