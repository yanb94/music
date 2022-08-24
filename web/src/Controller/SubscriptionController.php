<?php

namespace App\Controller;

use App\Entity\Invoice as EntityInvoice;
use App\Entity\InvoiceMonth;
use App\Entity\User;
use App\Repository\InvoiceMonthRepository;
use App\Repository\UserRepository;
use App\Service\InvoiceHandler;
use App\Service\SubscriptionHandler;
use App\Service\SubscriptionInfosProcessor;
use DateTime;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Error;
use Psr\Log\LoggerInterface;
use Stripe\Event;
use Stripe\Price;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use UnexpectedValueException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Stripe\Customer;
use Stripe\Invoice;
use Stripe\StripeClient;
use Stripe\Subscription;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class SubscriptionController extends AbstractController
{
    #[
        Route("/api/paiement", methods: 'POST'),
        IsGranted("ROLE_USER")
    ]
    public function paiementProcess(Request $request, EntityManagerInterface $em)
    {
        $user = $this->getUserOrReturnAccessException();

        $id_price = json_decode($request->getContent(), true)['id_price'];

        Stripe::setApiKey($this->getParameter('stripePrivateKey'));

        $domain = $request->getSchemeAndHttpHost() . '/space-member/subscribe';

        try {
            if (!is_null($user->getCustomerId())) {
                $listSubscription = Subscription::all(['customer' => $user->getCustomerId()]);

                if (count($listSubscription) >= 1) {
                    /** @var Subscription */
                    $subscription = $listSubscription->first();
                    $subscription = $subscription->id;

                    $sessions = Session::all(['subscription' => $subscription]);

                    /** @var Session */
                    $checkout_session = $sessions->first();

                    if (is_null($checkout_session->url)) {
                        throw new Error("La session n'a renvoyé aucune url");
                    }
                    return new JsonResponse(['checkout_url' => $checkout_session->url], 200);
                }
            }


            $price = Price::retrieve($id_price);

            $customer = null;
            $persist = false;

            if (is_null($user->getCustomerId())) {
                $customer = Customer::create([
                    "email" => $user->getEmail(),
                    "name" => strtoupper($user->getLastname()) . " " . $user->getFirstname(),
                ]);

                $user->setCustomerId($customer->id);
                $persist = true;
            } else {
                $customer = Customer::retrieve($user->getCustomerId());
            }

            $checkout_session = Session::create([
                'line_items' => [[
                  'price' => $price->id,
                  'quantity' => 1,
                ]],
                'mode' => 'subscription',
                'customer' => $customer,
                'success_url' => $domain . '?success=true&session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => $domain . '?canceled=true',
                'billing_address_collection' => 'required',
                'customer_update' => [
                    'address' => 'auto',
                    'shipping' => 'auto',
                    'name' => 'never'
                ],
                'automatic_tax' => [
                    'enabled' => true,
                ]
            ]);

            if (is_null($checkout_session->url)) {
                throw new Error("La session n'a renvoyé aucune url");
            }

            if ($persist) {
                $em->persist($user);
                $em->flush();
            }

            return new JsonResponse(['checkout_url' => $checkout_session->url], 200);
        } catch (Error $e) {
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }
    }

    #[
        Route("/api/subscription_hook", methods: 'POST')
    ]
    public function webHook(
        LoggerInterface $logger,
        SubscriptionHandler $subscriptionHandler,
        InvoiceHandler $invoiceHandler
    ) {
        Stripe::setApiKey($this->getParameter('stripePrivateKey'));

        $payload = file_get_contents('php://input');
        $event = null;

        try {
            $event = Event::constructFrom(
                json_decode($payload, true)
            );
        } catch (UnexpectedValueException $e) {
            return new Response("⚠️ Webhook error while parsing basic request.", 400);
        }

        switch ($event->type) {
            case 'customer.subscription.created':
              /** @var Subscription */
                $subscription = $event->data->object;
                $logger->info("Subscription created");
                $subscriptionHandler->subscriptionCreated($subscription);
                break;
            case 'customer.subscription.deleted':
               /** @var Subscription */
                $subscription = $event->data->object;
                $eventRequest = $event->request;
                $subscriptionHandler->subscriptionDeleted($subscription, $eventRequest);
                break;
            case 'customer.subscription.updated':
                $logger->info("Subscription updated");
               /** @var Subscription */
                $subscription = $event->data->object;
                $subscriptionHandler->subscriptionUpdated($subscription);
                break;
            case 'invoice.paid':
                $logger->info("Invoice paid");
                /** @var Invoice */
                $invoice = $event->data->object;
                $invoiceHandler->invoiceCreated($invoice);
                break;
            default:
              // Unexpected event type
                echo 'Received unknown event type';
        }

        return new Response("", 200);
    }

    #[
        Route("/api/my_subscription", methods: "GET"),
        IsGranted("ROLE_USER")
    ]
    public function mySubscription(Request $request, SubscriptionInfosProcessor $subscriptionInfosProcessor)
    {
        $user = $this->getUserOrReturnAccessException();

        $stripe = $this->getStripeClient();

        $infos = $subscriptionInfosProcessor->getSubscriptionData($user, $stripe, $request);

        return new JsonResponse($infos);
    }

    #[
        Route("/api/pause_subscription", methods: "GET"),
        IsGranted("ROLE_USER")
    ]
    public function pauseSubscription(Request $request)
    {
        $user = $this->getUserOrReturnAccessException();

        $action = $request->query->get('action');

        if (is_null($action) || !in_array($action, ['pause','unpause'])) {
            throw new NotFoundHttpException();
        }

        $params = match ($action) {
            'pause' => ['behavior' => 'void'],
            'unpause' => null
        };

            $stripe = $this->getStripeClient();

            $subscription = $stripe->subscriptions->retrieve($user->getSubscription());

            $stripe->subscriptions->update($subscription->id, [
            'pause_collection' => $params
            ]);

        return new JsonResponse(status: 204);
    }

    #[
        Route("/api/cancel_subscription", methods: "GET"),
        IsGranted("ROLE_USER")
    ]
    public function cancelSubscription(EntityManagerInterface $em)
    {
        $user = $this->getUserOrReturnAccessException();
        $stripe = $this->getStripeClient();

        $subscription = $stripe->subscriptions->retrieve($user->getSubscription());

        $stripe->subscriptions->cancel($subscription->id);

        $user->setSubscribeUntil(null);

        $em->persist($user);
        $em->flush();

        return new JsonResponse(status: 204);
    }

    private function getStripeClient(): StripeClient
    {
        return new StripeClient($this->getParameter('stripePrivateKey'));
    }

    private function getUserOrReturnAccessException(): User
    {
        /** @var User|null */
        $user = $this->getUser();

        if (is_null($user)) {
            throw $this->createAccessDeniedException("Utilisateur non autorisé");
        }

        return $user;
    }
}
