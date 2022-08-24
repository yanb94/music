<?php

namespace App\EventSubscriber;

use App\Entity\User;
use App\Service\EncryptPassword;
use App\Service\SendConfirmationEmail;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Event\OnFlushEventArgs;
use Doctrine\ORM\Event\PostFlushEventArgs;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class RegistrationSubscriber implements EventSubscriber
{
    public function __construct(
        private EncryptPassword $encryptPassword,
        private SendConfirmationEmail $sendConfirmationEmail
    ) {
    }

    public function prePersist(LifecycleEventArgs $args): void
    {
        if (!$args->getObject() instanceof User) {
            return;
        }

        /** @var User $user */
        $user = $args->getObject();

        if ($user->getPlainPassword()) {
            $this->encryptPassword->encrypt($user, $user->getPlainPassword());
        }
    }

    public function postPersist(LifecycleEventArgs $args): void
    {
        if (!$args->getObject() instanceof User) {
            return;
        }

        /** @var User $user */
        $user = $args->getObject();

        if (!$user->getIsValidate() && !is_null($user->getConfirmationToken())) {
            $this->sendConfirmationEmail->send($user);
        }
    }

    public function getSubscribedEvents(): array
    {
        return [
            Events::prePersist,
            Events::postPersist
        ];
    }
}
