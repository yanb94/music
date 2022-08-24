<?php

namespace App\Controller;

use Psr\Log\LoggerInterface;
use App\Service\PayoutEventsHandler;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class PaypalWebHookController extends AbstractController
{
    #[Route('/api/paypal-webhook', name: 'paypal_webhook', methods: 'POST')]
    public function index(Request $request, LoggerInterface $logger, PayoutEventsHandler $handler): JsonResponse
    {
        $logger->info("PayPalWebHook");

        $dataEvent = $request->getContent();
        $data = json_decode($dataEvent, true);

        $logger->info($data['event_type']);

        $handler->handleEvent($data);

        return new JsonResponse();
    }
}
