<?php

namespace App\Tests\Unit\Security\Voter;

use DateTime;
use App\Entity\User;
use PHPUnit\Framework\TestCase;
use App\Security\Voter\SubscriberVoter;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

class SubscriberVoterTest extends TestCase
{
    private function getSubscribeUser(): User
    {
        return (new User())
            ->setEmail("johh@doe.fr")
            ->setFirstname("john")
            ->setLastname('doe')
            ->setUsername("john")
            ->setSexe("m")
            ->setBirthday(new DateTime('- 27 years'))
            ->setPlainPassword("password")
            ->setSubscribeUntil(new DateTime('+ 20 days'))
        ;
    }

    private function getUnsubscribeUser(): User
    {
        return (new User())
            ->setEmail("johh@doe.fr")
            ->setFirstname("john")
            ->setLastname('doe')
            ->setUsername("john")
            ->setSexe("m")
            ->setBirthday(new DateTime('- 27 years'))
            ->setPlainPassword("password")
            ->setSubscribeUntil(null)
        ;
    }

    private function processTestOnVoteOnAttribute(User $user, bool $return): void
    {
        $mockedInstance = $this->getMockBuilder(SubscriberVoter::class)
        ->disableOriginalConstructor()
        ->getMock();

        $mockedToken = $this->getMockBuilder(TokenInterface::class)->getMock();
        $mockedToken->method('getUser')->willReturn($user);

        $reflectedMethod = new \ReflectionMethod(
            SubscriberVoter::class,
            'voteOnAttribute'
        );

        $reflectedMethod->setAccessible(true);

        $supportResult = $reflectedMethod->invokeArgs($mockedInstance, [
            "ROLE_SUBSCRIBER",
            null,
            $mockedToken
        ]);

        $this->assertSame($return, $supportResult);
    }

    private function processTestOnSupports($methodTested, $instanceTested, array $params, bool $return): void
    {
        $supportResult = $methodTested->invokeArgs($instanceTested, [
            "ROLE_SUBSCRIBER",
            null
        ]);
        $this->assertSame($return, $supportResult);
    }

    public function testSupport(): void
    {
        $mockedInstance = $this->getMockBuilder(SubscriberVoter::class)
        ->disableOriginalConstructor()
        ->getMock();

        $reflectedMethod = new \ReflectionMethod(
            SubscriberVoter::class,
            'supports'
        );

        $reflectedMethod->setAccessible(true);

        // Good Case
        $this->processTestOnSupports($reflectedMethod, $mockedInstance, [
            "ROLE_SUBSCRIBER",
            null
        ], true);

        // Bad role
        $this->processTestOnSupports($reflectedMethod, $mockedInstance, [
            "ROLE_USER",
            null
        ], true);

        // Subject not Null
        $this->processTestOnSupports($reflectedMethod, $mockedInstance, [
            "ROLE_USER",
            "truc"
        ], true);
    }

    public function testVoteOnAttributeWhenUserSubscribe()
    {
        $this->processTestOnVoteOnAttribute(
            $this->getSubscribeUser(),
            true
        );
    }

    public function testVoteOnAttributeWhenUserNotSubscribe()
    {
        $this->processTestOnVoteOnAttribute(
            $this->getUnsubscribeUser(),
            false
        );
    }
}
