<?php

namespace App\DataFixtures\Init;

use App\Entity\Song;
use wapmorgan\Mp3Info\Mp3Info;
use App\Repository\ArtistRepository;
use App\DataFixtures\Init\InitFixtures;
use Doctrine\Persistence\ObjectManager;
use App\DataFixtures\Init\ArtistFixtures;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class SongFixtures extends InitFixtures implements DependentFixtureInterface
{
    public function __construct(private ArtistRepository $artistRepository)
    {
    }

    public function load(ObjectManager $manager): void
    {
        $artists = $this->artistRepository->findAll();
        $arrayArtists = [];

        foreach ($artists as $artist) {
            $arrayArtists[$artist->getName()] = $artist;
        }

        for ($i = 0; $i < 8; $i++) {
            $t = $i + 1;

            $imageFile = $this->getImage($t);
            $songFile = $this->getSong($t);

            $songFileInfo = new Mp3Info($songFile->getRealPath(), true);
            $songDuration = $songFileInfo->duration;


            $song = (new Song())
                ->setName("Chanson " . $t)
                ->setSongFile($songFile)
                ->setImageFile($imageFile)
                ->setAuthor($t % 2 === 0 ? $arrayArtists['Artist 1'] : $arrayArtists['Artist 2'])
                ->setSongDuration($songDuration)
            ;

            $manager->persist($song);
        }

        $manager->flush();
    }

    public function getDependencies()
    {
        return [
            ArtistFixtures::class
        ];
    }

    private function getImage(int $index): UploadedFile
    {
        $basePath = __DIR__ . '/../../../imageFixtures/';

        copy($basePath . 'song-' . $index . '.jpg', $basePath . 'song-' . $index . '-copy.jpg');

        $imagePath = realpath($basePath . 'song-' . $index . '-copy.jpg');
        return new UploadedFile($imagePath, $imagePath, "image/jpeg", null, true);
    }

    private function getSong(int $index): UploadedFile
    {
        $basePath = __DIR__ . '/../../../songFixtures/';

        copy($basePath . 'song-' . $index . '.mp3', $basePath . 'song-' . $index . '-copy.mp3');

        $songPath = realpath($basePath . 'song-' . $index . '-copy.mp3');
        return new UploadedFile($songPath, $songPath, null, null, true);
    }
}
