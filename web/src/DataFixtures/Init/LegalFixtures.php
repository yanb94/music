<?php

namespace App\DataFixtures\Init;

use App\Entity\Legal;
use App\DataFixtures\Init\InitFixtures;
use Doctrine\Persistence\ObjectManager;

class LegalFixtures extends InitFixtures
{
    public function load(ObjectManager $manager): void
    {
        $legalData = [
            [
                "label" => "Mention Légale",
                "title" => "Mention Légale"
            ],
            [
                "label" => "C.G.U",
                "title" => "Conditions générales d'utilisation"
            ],
            [
                "label" => "Confidentialité",
                "title" => "Politique de confidentialité"
            ],
        ];

        $contentData = file_get_contents(__DIR__ . "/../../../filesFixtures/legal.txt");

        foreach ($legalData as $data) {
            $legal = (new Legal())
                ->setLabel($data['label'])
                ->setTitle($data['title'])
                ->setContent($contentData)
            ;

            $manager->persist($legal);
        }

        $manager->flush();
    }
}
