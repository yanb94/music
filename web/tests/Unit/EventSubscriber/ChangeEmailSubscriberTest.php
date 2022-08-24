<?php

namespace App\Tests\Unit\EventSubscriber;

use DateTime;
use App\Entity\User;
use App\Entity\ChangeEmail;
use PHPUnit\Framework\TestCase;
use App\Service\SendChangeEmail;
use App\Event\ChangeEmailCreated;
use App\EventSubscriber\ChangeEmailSubscriber;
use Symfony\Component\EventDispatcher\EventDispatcher;

class ChangeEmailSubscriberTest extends TestCase
{
    private function getValidChangeEmail(): ChangeEmail
    {
        $user = (new User())
            ->setEmail("johh@doe.fr")
            ->setFirstname("john")
            ->setLastname('doe')
            ->setUsername("john")
            ->setSexe("m")
            ->setBirthday(new DateTime('- 27 years'))
            ->setPlainPassword("password")
        ;

        $token = "testToken";
        $email = "example@example.com";

        return (new ChangeEmail())
            ->setUser($user)
            ->setToken($token)
            ->setEmail($email)
        ;
    }

    public function testEmailIsSendWhenEventIsDispatch()
    {
        $service = $this->getMockBuilder(SendChangeEmail::class)->disableOriginalConstructor()->getMock();
        $service->expects($this->once())->method("send");

        /** @var SendChangeEmail */
        $service = $service;

        $subscriber = new ChangeEmailSubscriber($service);

        $event = new ChangeEmailCreated($this->getValidChangeEmail());

        $dispatcher = new EventDispatcher();
        $dispatcher->addSubscriber($subscriber);
        $dispatcher->dispatch($event);
    }
}
