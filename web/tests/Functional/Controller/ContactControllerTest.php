<?php

namespace App\Tests\Functional\Controller;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;

class ContactControllerTest extends ApiTestCase
{
    public function testWhenGoodData()
    {
        $client = static::createClient();

        $client->request('POST', '/api/contact', [
            'json' => [
                "firstname" => "John",
                "lastname" => "Doe",
                "email" => "example@example.com",
                "message" => "Je t'envoie un message"
            ]
        ]);

        $this->assertResponseIsSuccessful();
    }

    public function testWhenBadData()
    {
        $client = static::createClient();

        $client->request('POST', '/api/contact', [
            'json' => [
                "firstname" => "John",
                "lastname" => "Doe",
                "email" => "exampleexample.com", // Not Valid Email
                "message" => "Je t'envoie un message"
            ]
        ]);

        $this->assertResponseStatusCodeSame(422);
    }
}
