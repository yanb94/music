<?php

namespace App\Command;

use App\Service\GenerateResponsiveImage;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class ImageResponsiveGenerateCommand extends Command
{
    protected static $defaultName = 'image:responsive:generate';
    protected static $defaultDescription = 'Generate responsive version of image';

    public function __construct(private GenerateResponsiveImage $generateResponsiveImage)
    {
        parent::__construct();
    }

    protected function configure()
    {
        $this
            ->setDescription(self::$defaultDescription)
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        try {
            $this->generateResponsiveImage->generateResponsivesImages();
        } catch (\Throwable $th) {
            $io->error("Une erreur s'est produite pendant le processus de traitement: " . $th->getMessage());
            return Command::FAILURE;
        }

        $io->success('Les images ont bien été générés');

        return Command::SUCCESS;
    }
}
