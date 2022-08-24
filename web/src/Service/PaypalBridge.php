<?php

namespace App\Service;

use App\Entity\ArtistBatchPayout;
use App\Entity\ArtistPayout;
use DateTime;
use GuzzleHttp\Client;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class PaypalBridge
{
    private string $clientId;
    private string $secret;
    private ?string $accessToken = null;
    private Client $clientRequest;

    public const AUTH_URL = "https://api-m.sandbox.paypal.com/v1/oauth2/token";
    public const MAKE_PAYOUT_URL = "https://api-m.sandbox.paypal.com/v1/payments/payouts";
    public const DETAIL_ON_BATCH_PAYOUT = "https://api-m.sandbox.paypal.com/v1/payments/payouts/";

    public function __construct(private ParameterBagInterface $parameters)
    {
        $this->clientId = $parameters->get('paypalClientId');
        $this->secret = $parameters->get('paypalSecret');
        $this->clientRequest = new Client();
    }

    public function getAccessToken(): array
    {
        $client = $this->clientRequest;

        $response = $client->request('POST', self::AUTH_URL, [
            'auth' => [
                $this->clientId,
                $this->secret
            ],
            'form_params' => [
                'grant_type' => 'client_credentials'
            ]
        ]);

        return json_decode($response->getBody(), true);
    }

    private function retriveAccessToken(): string
    {
        if (is_null($this->accessToken)) {
            return $this->getAccessToken()['access_token'];
        }

        return $this->accessToken;
    }

    private function getMonthInText(int $index): string
    {
        $months = [
            'Janvier',
            'Février',
            'Mars',
            'Avril',
            'Mai',
            'Juin',
            'Juillet',
            'Août',
            'Septembre',
            'Octobre',
            'Novembre',
            'Décembre'
        ];

        return $months[($index - 1)];
    }

    private function createItemsPayement(ArtistBatchPayout $artistBatchPayout): array
    {
        $artistPayouts = $artistBatchPayout->getArtistPayouts();

        $array = array_map(function (ArtistPayout $artistPayout) {
            return [
                'amount' => $artistPayout->getAmount(),
                'email' => $artistPayout->getArtist()->getEmail(),
                'idPayement' => $artistPayout->getTrackingId()
            ];
        }, $artistPayouts->toArray());


        return array_map(function ($data) {
            return [
                "amount" => [
                    "value" => $data['amount'] / 100,
                    "currency" => "EUR",
                ],
                "receiver" => $data['email'],
                "sender_item_id" => $data['idPayement']
            ];
        }, $array);
    }

    public function createBatchPayementElement(ArtistBatchPayout $artistBatchPayout): array
    {
        $date = new DateTime();

        $month = $date->format('m');
        $year = $date->format('Y');

        return [
            "sender_batch_header" => [
                "sender_batch_id" => $artistBatchPayout->getTrackingId(),
                "email_subject" => "Votre paiement pour le mois de " . $this->getMonthInText((int)$month) . " " . $year,
                "email_message" => "Vous venez de recevoir un paiement correspondant"
                    . " a vos revenus sur Song le mois dernier",
                "recipient_type" => "EMAIL"
            ],
            "items" => $this->createItemsPayement($artistBatchPayout)
        ];
    }

    public function makePayout(ArtistBatchPayout $artistBatchPayout): array
    {
        $accessToken = $this->retriveAccessToken();
        $client = $this->clientRequest;

        $body = $this->createBatchPayementElement($artistBatchPayout);

        $response = $client->request('POST', self::MAKE_PAYOUT_URL, [
            'headers' => [
                'Content-Type' => 'application/json',
                'Content-Length' => count($body),
                'Authorization' => 'Bearer ' . $accessToken
            ],
            'body' => json_encode($body),
            'http_errors' => false
        ]);

        $responseData = json_decode($response->getBody(), true);
        return $responseData;
    }

    public function getDetailOnBatchPayout(string $payoutBatchId): array
    {
        $accessToken = $this->retriveAccessToken();
        $client = $this->clientRequest;

        $response = $client->request('GET', self::DETAIL_ON_BATCH_PAYOUT . $payoutBatchId, [
            'headers' => [
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $accessToken
            ],
            'http_errors' => false
        ]);

        return json_decode($response->getBody(), true);
    }
}
