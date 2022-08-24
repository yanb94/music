<?php

namespace App\Tests\Utils;

class FakeData
{
    public static function generateText($exactLength): string
    {
        $alphabet = array_merge(
            range('a', 'z'),
            range('A', 'Z'),
            [' ', '-']
        );
        $result = '';

        for ($i = 0; $i < $exactLength; $i++) {
            $result .= $alphabet[rand(0, count($alphabet) - 1)];
        }

        return $result;
    }
}
