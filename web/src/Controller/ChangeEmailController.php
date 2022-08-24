<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Validator\ConstraintViolationList;
use ApiPlatform\Core\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use ApiPlatform\Core\Bridge\Symfony\Validator\Exception\ValidationException;
use App\Entity\ChangeEmail;
use App\Event\ChangeEmailCreated;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

#[AsController]
class ChangeEmailController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private ValidatorInterface $validator,
        private EventDispatcherInterface $dispatcher
    ) {
    }

    public function __invoke(User $user)
    {
        if ($user->getNewEmail() == $user->getEmail()) {
            throw new ValidationException(
                new ConstraintViolationList(
                    [
                        new ConstraintViolation(
                            message: "L'email que vous avez indiquer est déjà votre email actuel",
                            messageTemplate: null,
                            parameters: [],
                            root:$user->getNewEmail(),
                            invalidValue: $user->getNewEmail(),
                            propertyPath:"newEmail"
                        )
                    ]
                )
            )
            ;
        }

        $errors = $this->validator->validate($user, [
            "groups" => ['changeEmail']
        ]);

        if (!is_null($errors) && count($errors) > 0) {
            throw new ValidationException($errors);
        }

        $changeEmail = new ChangeEmail();
        $changeEmail->setEmail($user->getNewEmail());
        $changeEmail->setUser($user);

        $this->em->persist($changeEmail);
        $this->em->flush();

        $this->dispatcher->dispatch(new ChangeEmailCreated($changeEmail));

        return $user;
    }
}
