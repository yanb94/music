<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\EncryptPassword;
use Doctrine\ORM\EntityManagerInterface;
use ApiPlatform\Core\Validator\ValidatorInterface;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Validator\ConstraintViolationList;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use ApiPlatform\Core\Bridge\Symfony\Validator\Exception\ValidationException;

#[AsController]
class ChangePasswordController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private EncryptPassword $encryptPassword,
        private UserPasswordHasherInterface $passwordEncoder,
        private ValidatorInterface $validator
    ) {
    }

    public function __invoke(User $user)
    {
        if (!$this->passwordEncoder->isPasswordValid($user, $user->getOldPassword())) {
            throw new ValidationException(
                new ConstraintViolationList(
                    [
                            new ConstraintViolation(
                                message: "Le mot de passe indiquer n'est pas le mot de passe actuel",
                                messageTemplate: null,
                                parameters: [],
                                root:$user->getOldPassword(),
                                invalidValue: $user->getOldPassword(),
                                propertyPath:"oldPassword"
                            )
                        ]
                )
            )
            ;
        }

        $this->encryptPassword->encrypt($user, $user->getPlainPassword());

        $this->em->persist($user);
        $this->em->flush();

        return $user;
    }
}
