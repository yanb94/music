<?php

namespace App\Tests\Unit\Tests\Utils;

use App\Tests\Utils\FakeData;
use PHPUnit\Framework\TestCase;

class FakeDataTest extends TestCase
{
    public function testGenerateText()
    {
        for ($i = 0; $i < 5; $i++) {
            $nb = rand(1, 400);
            $this->assertSame($nb, strlen(FakeData::generateText($nb)));
        }
    }
}
