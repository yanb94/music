<?php

namespace App\Security\Voter;

use App\Entity\User;
use DateTime;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

class SubscriberVoter extends Voter
{
    protected function supports(string $attribute, $subject): bool
    {
        if ($attribute == 'ROLE_SUBSCRIBER' && is_null($subject)) {
            return true;
        }

        return false;
    }

    protected function voteOnAttribute(string $attribute, $subject, TokenInterface $token): bool
    {
        /** @var User|null */
        $user = $token->getUser();

        if (!$user instanceof UserInterface) {
            return false;
        }

        if ($user->getSubscribeUntil() > new DateTime()) {
            return true;
        }

        return false;
    }
}
