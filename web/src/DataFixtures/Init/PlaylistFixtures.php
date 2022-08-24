<?php

namespace App\DataFixtures\Init;

use App\Entity\Playlist;
use App\Repository\SongRepository;
use App\Repository\UserRepository;
use App\DataFixtures\Init\UserFixtures;
use Doctrine\Persistence\ObjectManager;
use App\DataFixtures\Init\ArtistFixtures;
use App\Entity\Song;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class PlaylistFixtures extends InitFixtures implements DependentFixtureInterface
{
    public function __construct(
        private UserRepository $userRepository,
        private SongRepository $songRepository
    ) {
    }

    public function load(ObjectManager $manager): void
    {
        $users = $this->userRepository->findAll();
        $arrayUsers = [];

        foreach ($users as $user) {
            $arrayUsers[$user->getUserIdentifier()] = $user;
        }

        $songs = $this->songRepository->findAll();
        /** @var Song[] */
        $arraySongs = [];

        foreach ($songs as $song) {
            $arraySongs[$song->getName()] = $song;
        }

        $imageFile1 = $this->getImage(1);
        $imageFile2 = $this->getImage(2);
        $imageFile3 = $this->getImage(3);

        $playlist1Duration = array_sum([
            $arraySongs['Chanson 1']->getSongDuration(),
            $arraySongs['Chanson 2']->getSongDuration(),
            $arraySongs['Chanson 3']->getSongDuration()
        ]);

        $playlist2Duration = array_sum([
            $arraySongs['Chanson 4']->getSongDuration(),
            $arraySongs['Chanson 5']->getSongDuration(),
            $arraySongs['Chanson 6']->getSongDuration()
        ]);

        $playlist3Duration = array_sum([
            $arraySongs['Chanson 7']->getSongDuration(),
            $arraySongs['Chanson 8']->getSongDuration()
        ]);

        $playlist1 = (new Playlist())
            ->setName("Playlist 1")
            ->setIsPublic(true)
            ->setAuthor($arrayUsers['admin'])
            ->setImageFile($imageFile1)
            ->addSong($arraySongs['Chanson 1'])
            ->addSong($arraySongs['Chanson 2'])
            ->addSong($arraySongs['Chanson 3'])
            ->setNbSongs(3)
            ->setDuration($playlist1Duration)
        ;

        $playlist2 = (new Playlist())
            ->setName("Playlist 2")
            ->setIsPublic(true)
            ->setAuthor($arrayUsers['henri'])
            ->setImageFile($imageFile2)
            ->addSong($arraySongs['Chanson 4'])
            ->addSong($arraySongs['Chanson 5'])
            ->addSong($arraySongs['Chanson 6'])
            ->setNbSongs(3)
            ->setDuration($playlist2Duration)
        ;

        $playlist3 = (new Playlist())
            ->setName("Playlist 3")
            ->setIsPublic(true)
            ->setAuthor($arrayUsers['admin'])
            ->setImageFile($imageFile3)
            ->addSong($arraySongs['Chanson 7'])
            ->addSong($arraySongs['Chanson 8'])
            ->setNbSongs(2)
            ->setDuration($playlist3Duration)
        ;

        $manager->persist($playlist1);
        $manager->persist($playlist2);
        $manager->persist($playlist3);

        $manager->flush();
    }

    public function getDependencies()
    {
        return [
            ArtistFixtures::class,
            UserFixtures::class,
            SongFixtures::class
        ];
    }

    private function getImage(int $index): UploadedFile
    {
        $basePath = __DIR__ . '/../../../imageFixtures/';

        copy($basePath . 'song-' . $index . '.jpg', $basePath . 'song-' . $index . '-copy.jpg');

        $imagePath = realpath($basePath . 'song-' . $index . '-copy.jpg');
        return new UploadedFile($imagePath, $imagePath, "image/jpeg", null, true);
    }
}
