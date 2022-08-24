<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[AsController]
class ConfirmRegistrationController extends AbstractController
{
    public function __construct(private EntityManagerInterface $em)
    {
    }

    public function __invoke(User $user)
    {
        $user->setIsValidate(true);
        $user->setConfirmationToken(null);

        $this->em->persist($user);
        $this->em->flush();

        return $user;
    }
}
