<?php

namespace App\Controller;

use App\Entity\Playlist;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[AsController]
class AddPinPlaylistController extends AbstractController
{
    public function __construct(private EntityManagerInterface $em)
    {
    }

    public function __invoke(Playlist $playlist)
    {
        /** @var User */
        $user = $this->getUser();
        $playlist->addFollower($user);
        $user->addPlaylistsPinned($playlist);

        $this->em->persist($playlist);
        $this->em->persist($user);

        $this->em->flush();

        return $playlist;
    }
}
