<?php

namespace App\EventListener;

use App\Entity\User;
use DateTime;
use Symfony\Component\Security\Core\User\UserInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;

class AuthenticationSuccessListener
{
    /**
     * @param AuthenticationSuccessEvent $event
     */
    public function onAuthenticationSuccessResponse(AuthenticationSuccessEvent $event)
    {
        $data = $event->getData();
        /** @var User */
        $user = $event->getUser();

        if (!$user instanceof UserInterface) {
            return;
        }

        $data['id'] = $user->getId();
        $data['artist'] = !is_null($user->getArtist());
        $data['isSubscribe'] = $this->isSubscribeActive($user);

        $event->setData($data);
    }

    private function isSubscribeActive(User $user): bool
    {
        if ($user->getSubscribeUntil() > new DateTime()) {
            return true;
        }

        return false;
    }
}
