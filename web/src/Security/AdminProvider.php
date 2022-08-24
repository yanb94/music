<?php

namespace App\Security;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;
use Symfony\Component\Security\Core\Exception\UserNotFoundException;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;

class AdminProvider implements UserProviderInterface, PasswordUpgraderInterface
{
    public function __construct(
        private EntityManagerInterface $em,
        private UserRepository $userRepository
    ) {
    }

    /**
     * The loadUserByIdentifier() method was introduced in Symfony 5.3.
     * In previous versions it was called loadUserByUsername()
     *
     * Symfony calls this method if you use features like switch_user
     * or remember_me. If you're not using these features, you do not
     * need to implement this method.
     *
     * @throws UserNotFoundException if the user is not found
     */
    public function loadUserByIdentifier(string $identifier): UserInterface
    {
        $user = $this->userRepository->findOneBy(['username' => $identifier]);

        if (is_null($user) || !in_array("ROLE_ADMIN", $user->getRoles())) {
            throw new UserNotFoundException("Admin not found");
        }

        return $user;
    }

    public function loadUserByUsername(string $username): UserInterface
    {
        return $this->loadUserByIdentifier($username);
    }

    /**
     * Refreshes the user after being reloaded from the session.
     *
     * When a user is logged in, at the beginning of each request, the
     * User object is loaded from the session and then this method is
     * called. Your job is to make sure the user's data is still fresh by,
     * for example, re-querying for fresh User data.
     *
     * If your firewall is "stateless: true" (for a pure API), this
     * method is not called.
     *
     * @return UserInterface
     */
    public function refreshUser(UserInterface $user)
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Invalid user class "%s".', get_class($user)));
        }

        $freshUser = $this->userRepository->findOneBy(['id' => $user->getId()]);

        if ($freshUser != $user || !in_array("ROLE_ADMIN", $freshUser->getRoles())) {
            throw new UserNotFoundException();
        }

        return $user;
    }

    /**
     * Tells Symfony to use this provider for this User class.
     */
    public function supportsClass(string $class)
    {
        return User::class === $class || is_subclass_of($class, User::class);
    }

    /**
     * Upgrades the hashed password of a user, typically for using a better hash algorithm.
     */
    public function upgradePassword(UserInterface $user, string $newHashedPassword): void
    {
        $username = $user->getUserIdentifier();

        $userData = $this->userRepository->findOneBy(['username' => $username]);
        $userData->setPassword($newHashedPassword);

        $this->em->persist($userData);
        $this->em->flush();

        /** @var User */
        $user = $user;
        $user->setPassword($newHashedPassword);
    }
}
