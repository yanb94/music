<?php

namespace App\Service;

use App\Entity\Song;
use Symfony\Component\HttpKernel\KernelInterface;

class SongIndexable
{
    public function __construct(private KernelInterface $kernel)
    {
    }

    public function isSongIndexable(Song $song): bool
    {
        return in_array($this->kernel->getEnvironment(), ['dev','prod']);
    }
}
