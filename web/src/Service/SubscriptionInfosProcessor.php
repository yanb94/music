<?php

namespace App\Service;

use DateTime;
use App\Entity\User;
use Stripe\BillingPortal\Configuration;
use Stripe\BillingPortal\Session;
use Stripe\Invoice;
use Stripe\StripeClient;
use Stripe\Subscription;
use Symfony\Component\HttpFoundation\Request;

class SubscriptionInfosProcessor
{
    public function getSubscriptionData(User $user, StripeClient $stripe, Request $request): array
    {
        $subscription = $this->getSubscription($user, $stripe);
        $lastInvoice = $this->getLastInvoice($stripe, $subscription);

        $upcomingSubscription = $this->getNextInvoice($user, $stripe, $subscription);

        $billingPortal = $this->getBillingPortalSession($user, $stripe, $request);

        return [
            "status" => $subscription->status,
            "pause" => $subscription->pause_collection,
            "endDate" => $this->dateFromTimestamp($subscription->current_period_end),
            "lastInvoiceAmount" => $this->priceFormat($lastInvoice->amount_paid),
            "lastInvoiceDate" => $this->dateFromTimestamp($lastInvoice->created),
            "upcomingInvoiceAmount" => $this->priceFormat($upcomingSubscription->amount_due),
            "upcomingInvoiceDate" => $this->dateFromTimestamp($upcomingSubscription->created),
            "seeInvoicesLink" => $billingPortal['url']
        ];
    }

    private function getSubscription(User $user, StripeClient $stripe): Subscription
    {
        return $stripe->subscriptions->retrieve($user->getSubscription());
    }

    private function getLastInvoice(StripeClient $stripe, Subscription $subscription): Invoice
    {
        return $stripe->invoices->retrieve($subscription->latest_invoice);
    }

    private function getNextInvoice(User $user, StripeClient $stripe, Subscription $subscription): Invoice
    {
        return $stripe->invoices->upcoming([
            'customer' => $user->getCustomerId(),
            'subscription' => $subscription->id
        ]);
    }

    private function getBillingPortalSession(User $user, StripeClient $stripe, Request $request): Session
    {
        return $stripe->billingPortal->sessions->create([
            'customer' => $user->getCustomerId(),
            'return_url' => $request->getSchemeAndHttpHost() . '/space-member/subscribe',
            'configuration' => $this->getBillingPortalConfiguration(
                $stripe,
                $request
            )
        ]);
    }

    private function getBillingPortalConfiguration(StripeClient $stripe, Request $request): Configuration
    {
        return $stripe->billingPortal->configurations->create([
            'features' => [
                'invoice_history' => ['enabled' => true],
                'customer_update' => [
                    'allowed_updates' => ['email', 'address', 'phone'],
                    'enabled' => true,
                ],
                'payment_method_update' => [
                    'enabled' => true
                ]
            ],
            'business_profile' => [
                'privacy_policy_url' => $request->getSchemeAndHttpHost() . '/legal/politique-de-confidentialite',
                'terms_of_service_url' => $request->getSchemeAndHttpHost() . '/legal/mention-legale',
            ],
        ]);
    }

    private function dateFromTimestamp(string $timestamp)
    {
        return (new DateTime())->setTimestamp($timestamp)->format("d/m/Y");
    }

    private function priceFormat(int $rawPrice): float
    {
        return $rawPrice / 100;
    }
}
