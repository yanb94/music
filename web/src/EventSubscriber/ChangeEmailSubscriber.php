<?php

namespace App\EventSubscriber;

use App\Event\ChangeEmailCreated;
use App\Service\SendChangeEmail;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class ChangeEmailSubscriber implements EventSubscriberInterface
{
    public function __construct(private SendChangeEmail $sendChangeEmail)
    {
    }

    public function changeEmailCreated(ChangeEmailCreated $event)
    {
        $this->sendChangeEmail->send($event->getChangeEmail());
    }

    public static function getSubscribedEvents()
    {
        return [
            ChangeEmailCreated::class => 'changeEmailCreated',
        ];
    }
}
