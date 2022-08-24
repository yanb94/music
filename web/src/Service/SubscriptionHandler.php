<?php

namespace App\Service;

use App\Entity\User;
use App\Repository\UserRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Error;
use Psr\Log\LoggerInterface;
use Stripe\StripeObject;
use Stripe\Subscription;

class SubscriptionHandler
{
    public function __construct(
        private EntityManagerInterface $em,
        private UserRepository $userRepository,
        private LoggerInterface $logger,
        private SendNotPaySubscriptionNotfication $sendNotPaySubscriptionNotfication,
        private SendCanceledAfterSubscriptionUnpaid $sendCanceledAfterSubscriptionUnpaid,
        private SendSubscriptionNotification $sendSubscriptionNotification
    ) {
    }

    public function subscriptionCreated(Subscription $subscription): void
    {
    }

    public function subscriptionUpdated(Subscription $subscription): void
    {
        $user = $this->findUserFormCustomer($subscription);

        if ($subscription->status == 'active') {
            $control = is_null($user->getSubscription());
            $this->setUserNewExpireSubscriptionDate($subscription, $user);

            if ($control) {
                $this->sendSubscriptionNotification->send($user);
            }
        } elseif (in_array($subscription->status, ['past_due'])) {
            $this->logger->info('Unpaid');
            $this->subscriptionNotRenewAlert($user);
        }
    }

    public function subscriptionDeleted(Subscription $subscription, StripeObject $evenRequest): void
    {
        if ($subscription->status == 'canceled') {
            $user = $this->findUserFormCustomer($subscription);

            $user->setSubscribeUntil(null);
            $user->setSubscription(null);
            $this->em->persist($user);
            $this->em->flush();

            if (is_null($evenRequest)) {
                $this->sendCanceledAfterSubscriptionUnpaid->send($user);
            }
        }
    }

    private function findUserFormCustomer(Subscription $subscription): User
    {
        $user = $this->userRepository->findOneBy(['customerId' => $subscription->customer]);

        if (is_null($user)) {
            throw new Error("Corresponding user not found");
        }

        return $user;
    }

    private function setUserNewExpireSubscriptionDate(Subscription $subscription, User $user): void
    {
        $cancel_at = new DateTime();
        $cancel_at->setTimestamp($subscription->current_period_end);
        $user->setSubscribeUntil($cancel_at);
        $user->setSubscription($subscription->id);

        $this->em->persist($user);
        $this->em->flush();
    }

    private function subscriptionNotRenewAlert(User $user): void
    {
        $this->sendNotPaySubscriptionNotfication->send($user);
    }
}
