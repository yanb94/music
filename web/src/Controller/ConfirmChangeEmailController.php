<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Validator\ConstraintViolationList;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use ApiPlatform\Core\Bridge\Symfony\Validator\Exception\ValidationException;
use App\Entity\ChangeEmail;
use App\Exception\NotFoundException;

#[AsController]
class ConfirmChangeEmailController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em
    ) {
    }

    public function __invoke(string $token)
    {
        /** @var ChangeEmail */
        $changeEmail = $this->em->getRepository(ChangeEmail::class)->findOneBy(['token' => $token]);

        if (is_null($changeEmail)) {
            throw new NotFoundException();
        }

        $user = $changeEmail->getUser();
        $user->setEmail($changeEmail->getEmail());

        $this->em->remove($changeEmail);
        $this->em->persist($user);
        $this->em->flush();

        return $user;
    }
}
