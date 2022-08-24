<?php

namespace App\DataFixtures\Init;

use App\Repository\UserRepository;
use App\DataFixtures\Init\InitFixtures;
use App\DataFixtures\Init\UserFixtures;
use App\Entity\Artist;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class ArtistFixtures extends InitFixtures implements DependentFixtureInterface
{
    public function __construct(private UserRepository $userRepository)
    {
    }

    public function load(ObjectManager $manager): void
    {
        $image1 = $this->getImage(1);
        $image2 = $this->getImage(2);

        $users = $this->userRepository->findAll();
        $arrayUsers = [];

        foreach ($users as $user) {
            $arrayUsers[$user->getUserIdentifier()] = $user;
        }

        $artist = (new Artist())
            ->setEmail("paypal@payment.com")
            ->setName("Artist 1")
            ->setDescription("Je suis une description d'un compte d'artiste")
            ->setFile($image1)
            ->setUser($arrayUsers['admin'])
        ;

        $artist2 = (new Artist())
            ->setEmail("paypal2@payment.com")
            ->setName("Artist 2")
            ->setDescription("Je suis une description d'un compte d'artiste")
            ->setFile($image2)
            ->setUser($arrayUsers['henri'])
        ;

        $manager->persist($artist);
        $manager->persist($artist2);

        $manager->flush();
    }

    public function getDependencies()
    {
        return [
            UserFixtures::class
        ];
    }

    private function getImage(int $index): UploadedFile
    {
        $basePath = __DIR__ . '/../../../artistImageFixtures/';

        copy($basePath . 'artist-' . $index . '.jpg', $basePath . 'artist-' . $index . '-copy.jpg');

        $imagePath = realpath($basePath . 'artist-' . $index . '-copy.jpg');
        return new UploadedFile($imagePath, $imagePath, "image/jpeg", null, true);
    }
}
