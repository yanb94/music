<?php

namespace App\Tests\Unit\Entity;

use DateTime;
use App\Entity\User;
use App\Entity\Legal;
use App\Tests\Utils\FakeData;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class LegalTest extends EntityCase
{
    private function getValidEntity(): Legal
    {
        return (new Legal())
            ->setTitle("Legal 1")
            ->setLabel("Legal 1")
            ->setContent("Je suis une phrase")
        ;
    }

    public function testTitle(): void
    {
        $legal = $this->getValidEntity();

        // Blank
        $legal->setTitle("");
        $this->assertHasErrors($legal, 2);

        // Too small
        $legal->setTitle("aaaa");
        $this->assertHasErrors($legal, 1);

        // Too big
        $legal->setTitle(FakeData::generateText(51));
        $this->assertHasErrors($legal, 1);
    }

    public function testLabel(): void
    {
        $legal = $this->getValidEntity();

        // Blank
        $legal->setLabel("");
        $this->assertHasErrors($legal, 2);

        // Too small
        $legal->setLabel("aaaa");
        $this->assertHasErrors($legal, 1);

        // Too big
        $legal->setLabel(FakeData::generateText(26));
        $this->assertHasErrors($legal, 1);
    }

    public function testContent(): void
    {
        $legal = $this->getValidEntity();

        // Blank
        $legal->setContent("");
        $this->assertHasErrors($legal, 1);
    }
}
