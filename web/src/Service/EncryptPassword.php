<?php

namespace App\Service;

use App\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class EncryptPassword
{
    public function __construct(private UserPasswordHasherInterface $passwordEncoder)
    {
    }

    /**
     * Encrypt the password
     *
     * @param User $user the user entity
     * @param string $plainPassword the plain password
     * @return void
     */
    public function encrypt(User $user, string $plainPassword): void
    {
        $user->setPassword(
            $this->passwordEncoder->hashPassword($user, $plainPassword)
        );
    }
}
