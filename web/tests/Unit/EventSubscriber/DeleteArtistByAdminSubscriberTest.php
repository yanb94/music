<?php

namespace App\Tests\Unit\EventSubscriber;

use DateTime;
use App\Entity\User;
use App\Entity\Artist;
use PHPUnit\Framework\TestCase;
use App\Service\SendDeleteArtistNotification;
use App\EventSubscriber\DeleteArtistByAdminSubscriber;
use Symfony\Component\EventDispatcher\EventDispatcher;
use EasyCorp\Bundle\EasyAdminBundle\Event\AfterEntityDeletedEvent;

class DeleteArtistByAdminSubscriberTest extends TestCase
{
    private function getValidArtist(): Artist
    {
        return (new Artist())
            ->setEmail("johh@doe.fr")
            ->setDescription("je suis une description")
            ->setName("Artist 1")
            ->setUser(
                (new User())
                    ->setEmail("johh@doe.fr")
                    ->setFirstname("john")
                    ->setLastname('doe')
                    ->setUsername("john")
                    ->setSexe("m")
                    ->setBirthday(new DateTime('- 27 years'))
                    ->setPlainPassword("password")
            )
        ;
    }

    public function testEmailIsSendWhenEventIsDispatch()
    {
        $service = $this->getMockBuilder(SendDeleteArtistNotification::class)->disableOriginalConstructor()->getMock();
        $service->expects($this->once())->method("send");

        /** @var SendDeleteArtistNotification */
        $service = $service;

        $subscriber = new DeleteArtistByAdminSubscriber($service);

        $event = new AfterEntityDeletedEvent($this->getValidArtist());

        $dispatcher = new EventDispatcher();
        $dispatcher->addSubscriber($subscriber);
        $dispatcher->dispatch($event);
    }
}
