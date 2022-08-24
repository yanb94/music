<?php

namespace App\Command;

use App\Service\ProcessArtistPayout;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'payout:make-batch-payement',
    description: 'Make the monthly payout batch payement',
)]
class PayoutMakeBatchPayementCommand extends Command
{
    public function __construct(private ProcessArtistPayout $processArtistPayout)
    {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addOption("y", "y", InputOption::VALUE_OPTIONAL, "", false)
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        if ($input->getOption("y") === null) {
            return $this->processPayment($io);
        }

        $consent = $io->ask("Etes vous sur de vouloir procéder au paiement des artistes ? (yes/no)", "no");

        if (!is_null($consent)) {
            if (in_array($consent, ['yes','no'])) {
                if ($consent === 'yes') {
                    return $this->processPayment($io);
                }

                $io->info("Le paiement n'a pas été effectué comme demandé");

                return Command::SUCCESS;
            }

            $io->error("Vous devez répondre par \"yes\" ou \"no\"");

            return Command::INVALID;
        }

        $io->error("Vous devez confirmer votre volonté de procéder au paiement");

        return Command::FAILURE;
    }

    private function processPayment(SymfonyStyle $io): int
    {
        try {
            $this->processArtistPayout->createBatchPayout();

            $io->success("Le paiement des artistes a été effectué");
            return Command::SUCCESS;
        } catch (\Throwable $th) {
            $io->error($th->getMessage());
            return Command::FAILURE;
        }
    }
}
