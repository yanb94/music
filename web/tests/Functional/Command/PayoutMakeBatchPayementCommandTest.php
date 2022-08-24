<?php

namespace App\Tests\Functional\Command;

use Exception;
use App\Service\ProcessArtistPayout;
use PHPUnit\Framework\MockObject\MockObject;
use Symfony\Component\Console\Command\Command;
use PHPUnit\Framework\MockObject\Rule\InvokedCount;
use Symfony\Component\Console\Tester\CommandTester;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class PayoutMakeBatchPayementCommandTest extends KernelTestCase
{
    private function getMockProcessArtistPayout(InvokedCount $nbOfCall, bool $exception): MockObject
    {
        $mockProcessArtistPayout = $this->getMockBuilder(ProcessArtistPayout::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['createBatchPayout'])
            ->getMock()
        ;

        if ($exception) {
            $mockProcessArtistPayout
                ->expects($nbOfCall)
                ->method('createBatchPayout')
                ->willThrowException(new Exception("Le processus de paiement des artistes a échoué"))
            ;
        } else {
            $mockProcessArtistPayout
                ->expects($nbOfCall)
                ->method('createBatchPayout')
                ->willReturn(null)
            ;
        }

        return $mockProcessArtistPayout;
    }

    private function initCommandAndCommandTester(InvokedCount $nbOfCallForMethod, bool $exception = false): array
    {
        $kernel = self::bootKernel();

        $mockProcessArtistPayout = $this->getMockProcessArtistPayout($nbOfCallForMethod, $exception);

        $kernel->getContainer()->set('App\Service\ProcessArtistPayout', $mockProcessArtistPayout);

        $application = new Application($kernel);

        $command = $application->find('payout:make-batch-payement');
        $commandTester = new CommandTester($command);

        return [$command, $commandTester];
    }

    public function testBatchPaymentProcessCommandWhenYesOptionAdded(): void
    {
        /**
         * @var Command $command
         * @var CommandTester $commandTester
         */
        [$command, $commandTester] = $this->initCommandAndCommandTester($this->once());

        $commandTester->execute([
            '-y' => null,
            'command' => $command->getName()
        ]);

        $output = $commandTester->getDisplay();

        $this->assertStringContainsString('Le paiement des artistes a été effectué', $output);
    }

    public function testBatchPaymentProcessCommandeWhenResponseIsYesToQuestion(): void
    {
        /**
         * @var Command $command
         * @var CommandTester $commandTester
         */
        [$command, $commandTester] = $this->initCommandAndCommandTester($this->once());

        $commandTester->setInputs(['yes']);

        $commandTester->execute([
            'command' => $command->getName()
        ]);

        $output = $commandTester->getDisplay();

        $this->assertStringContainsString('Le paiement des artistes a été effectué', $output);
    }

    public function testBatchPaymentProcessCommandeWhenResponseIsNoToQuestion(): void
    {
        /**
         * @var Command $command
         * @var CommandTester $commandTester
         */
        [$command, $commandTester] = $this->initCommandAndCommandTester($this->never());

        $commandTester->setInputs(['no']);

        $commandTester->execute([
            'command' => $command->getName()
        ]);

        $output = $commandTester->getDisplay();

        $this->assertStringContainsString("Le paiement n'a pas été effectué comme demandé", $output);
    }

    public function testBatchPaymentProcessCommandeWhenResponseIsAnythingExceptYesOrNoToQuestion(): void
    {
        /**
         * @var Command $command
         * @var CommandTester $commandTester
         */
        [$command, $commandTester] = $this->initCommandAndCommandTester($this->never());

        $commandTester->setInputs(['truc']);

        $commandTester->execute([
            'command' => $command->getName()
        ]);

        $output = $commandTester->getDisplay();

        $this->assertStringContainsString("Vous devez répondre par \"yes\" ou \"no\"", $output);
    }

    public function testBatchPaymentProcessCommandHandleExceptionWhenFailureWhenYesOption(): void
    {
        /**
         * @var Command $command
         * @var CommandTester $commandTester
         */
        [$command, $commandTester] = $this->initCommandAndCommandTester($this->once(), true);

        $commandTester->execute([
            '-y' => null,
            'command' => $command->getName()
        ]);

        $output = $commandTester->getDisplay();

        $this->assertStringContainsString('Le processus de paiement des artistes a échoué', $output);
    }

    public function testBatchPaymentProcessCommandHandleExceptionWhenFailureWhenQuestionAnswerIsYes(): void
    {
        /**
         * @var Command $command
         * @var CommandTester $commandTester
         */
        [$command, $commandTester] = $this->initCommandAndCommandTester($this->once(), true);

        $commandTester->setInputs(['yes']);

        $commandTester->execute([
            'command' => $command->getName()
        ]);

        $output = $commandTester->getDisplay();

        $this->assertStringContainsString('Le processus de paiement des artistes a échoué', $output);
    }
}
