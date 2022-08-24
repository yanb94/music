<?php

namespace App\Service;

use App\Entity\Playlist;
use Symfony\Component\HttpKernel\KernelInterface;

class PlaylistIndexable
{
    public function __construct(private KernelInterface $kernel)
    {
    }

    public function isPlaylistIndexable(Playlist $playlist): bool
    {
        if (!$playlist->getIsPublic()) {
            return false;
        }

        return in_array($this->kernel->getEnvironment(), ['dev','prod']);
    }
}
