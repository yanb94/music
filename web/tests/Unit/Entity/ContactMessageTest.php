<?php

namespace App\Tests\Unit\Entity;

use App\Model\ContactMessage;
use App\Tests\Utils\FakeData;

class ContactMessageTest extends EntityCase
{
    private function getValidEntity(): ContactMessage
    {
        return (new ContactMessage())
            ->setFirstname('John')
            ->setLastname('Doe')
            ->setEmail("example@example.com")
            ->setMessage("Je suis une description")
        ;
    }

    public function testNoErrorsWithValidEntity(): void
    {
        $contactMessage = $this->getValidEntity();

        $this->assertHasErrors($contactMessage);
    }

    public function testFirstname(): void
    {
        $contactMessage = $this->getValidEntity();

        // Valid firstname
        $this->assertHasErrors($contactMessage, 0);

        // Blank Firstname
        $contactMessage->setFirstname("");
        $this->assertHasErrors($contactMessage, 2);

        // Too short Firstname
        $contactMessage->setFirstname("a");
        $this->assertHasErrors($contactMessage, 1);

        // Too long Firstname
        $contactMessage->setFirstname("Lorem ipsum dolor sit amet consectetur adipiscing elit vel");
        $this->assertHasErrors($contactMessage, 1);

        // Bad characters
        $contactMessage->setFirstname("Henri40");
        $this->assertHasErrors($contactMessage, 1);
    }

    public function testLastname(): void
    {
        $contactMessage = $this->getValidEntity();

        // Valid Lastname
        $this->assertHasErrors($contactMessage, 0);

        // Blank Lastname
        $contactMessage->setLastname("");
        $this->assertHasErrors($contactMessage, 2);

        // Too short Lastname
        $contactMessage->setLastname("a");
        $this->assertHasErrors($contactMessage, 1);

        // Too long Lastname
        $contactMessage->setLastname("Lorem ipsum dolor sit amet consectetur adipiscing elit vel");
        $this->assertHasErrors($contactMessage, 1);

        // Bad characters
        $contactMessage->setLastname("Henri?");
        $this->assertHasErrors($contactMessage, 1);
    }

    public function testEmail(): void
    {
        $contactMessage = $this->getValidEntity();

        // Blank
        $contactMessage->setEmail("");
        $this->assertHasErrors($contactMessage, nbErrors: 1);

        // Not Valid Email
        $contactMessage->setEmail("aa");
        $this->assertHasErrors($contactMessage, nbErrors: 1);
    }

    public function testMessage(): void
    {
        $contactMessage = $this->getValidEntity();

        // Blank
        $contactMessage->setMessage("");
        $this->assertHasErrors($contactMessage, nbErrors: 2);

        // Too short
        $contactMessage->setMessage("aa");
        $this->assertHasErrors($contactMessage, nbErrors: 1);

        // Too long
        $contactMessage->setMessage(FakeData::generateText(401));
        $this->assertHasErrors($contactMessage, nbErrors: 1);
    }
}
