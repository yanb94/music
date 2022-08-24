<?php

namespace App\Tests\Unit\Service;

use DateTime;
use App\Entity\User;
use App\Entity\Artist;
use App\Entity\InvoiceMonth;
use PHPUnit\Framework\TestCase;
use App\Repository\InvoiceMonthRepository;
use App\Repository\ViewSongDailyRepository;
use App\Service\StatsUpcomingIncomeForArtist;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class StatsUpcomingIncomeForArtistTest extends TestCase
{
    private function fakeInvoiceMonth(): InvoiceMonth
    {
        return (new InvoiceMonth())
            ->setSubTotal(2000)
            ->setVat(400)
            ->setTotal(2400)
            ->setMonth('12-2021')
        ;
    }

    private function fakeArtist(): Artist
    {
        return (new Artist())
            ->setEmail("johh@doe.fr")
            ->setDescription("je suis une description")
            ->setName("Artist 1")
            ->setUser(
                (new User())
                    ->setEmail("johh@doe.fr")
                    ->setFirstname("john")
                    ->setLastname('doe')
                    ->setUsername("john")
                    ->setSexe("m")
                    ->setBirthday(new DateTime('- 27 years'))
                    ->setPlainPassword("password")
            )
            ->setFile(new UploadedFile(
                path: str_replace("/Unit", "/files", dirname(__DIR__)) . "/image.jpg",
                originalName: "name.jpeg",
                mimeType: "image/jpeg",
                test: true
            ))
        ;
    }

    private function createMockViewSongDailyRepository(int $resultArtistView, int $resultTotalView)
    {
        $mockViewSongDailyRepository = $this->getMockBuilder(ViewSongDailyRepository::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
        $mockViewSongDailyRepository
            ->expects($this->once())
            ->method('findByViewSongByArtistAndMonth')
            ->willReturn($resultArtistView)
        ;

        $mockViewSongDailyRepository
            ->expects($this->once())
            ->method('findAllViewsSongsByMonth')
            ->willReturn($resultTotalView)
        ;

        return $mockViewSongDailyRepository;
    }

    private function createMockInvoiceMonthRepository($expect, $return = null)
    {
        $mockInvoiceMonthRepository = $this->getMockBuilder(InvoiceMonthRepository::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;

        $mockInvoiceMonthRepository
            ->expects($expect)
            ->method('findOneBy')
            ->willReturn($return)
        ;

        return $mockInvoiceMonthRepository;
    }

    private function createmockParameterBagInterface($expect, $return = null)
    {
        $mockParameterBagInterface = $this->getMockBuilder(ParameterBagInterface::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;

        $mockParameterBagInterface
            ->expects($expect)
            ->method('get')
            ->willReturn($return)
        ;

        return $mockParameterBagInterface;
    }

    public function testWhenTotalViewsIsZero(): void
    {
        /** @var ViewSongDailyRepository */
        $mockViewSongDailyRepository = $this->createMockViewSongDailyRepository(10, 0);

        /** @var InvoiceMonthRepository */
        $mockInvoiceMonthRepository = $this->createMockInvoiceMonthRepository($this->never());

        /** @var ParameterBagInterface */
        $mockParameterBagInterface = $this->createmockParameterBagInterface($this->never());

        $statsUpcomingIncomeForArtist = new StatsUpcomingIncomeForArtist(
            $mockViewSongDailyRepository,
            $mockInvoiceMonthRepository,
            $mockParameterBagInterface
        );

        $this->assertSame(0.0, $statsUpcomingIncomeForArtist->generateUpcomingIncome($this->fakeArtist()));
    }

    public function testWhenNbViewsArtistIsZero(): void
    {
        /** @var ViewSongDailyRepository */
        $mockViewSongDailyRepository = $this->createMockViewSongDailyRepository(0, 40);

        /** @var InvoiceMonthRepository */
        $mockInvoiceMonthRepository = $this->createMockInvoiceMonthRepository($this->never());

        /** @var ParameterBagInterface */
        $mockParameterBagInterface = $this->createmockParameterBagInterface($this->never());

        $statsUpcomingIncomeForArtist = new StatsUpcomingIncomeForArtist(
            $mockViewSongDailyRepository,
            $mockInvoiceMonthRepository,
            $mockParameterBagInterface
        );

        $this->assertSame(0.0, $statsUpcomingIncomeForArtist->generateUpcomingIncome($this->fakeArtist()));
    }

    public function testWhenViewsArtistAreMoreThanZero(): void
    {
        /** @var ViewSongDailyRepository */
        $mockViewSongDailyRepository = $this->createMockViewSongDailyRepository(10, 20);

        /** @var InvoiceMonthRepository */
        $mockInvoiceMonthRepository = $this->createMockInvoiceMonthRepository($this->once(), $this->fakeInvoiceMonth());

        /** @var ParameterBagInterface */
        $mockParameterBagInterface = $this->createmockParameterBagInterface($this->once(), 0.8);

        $statsUpcomingIncomeForArtist = new StatsUpcomingIncomeForArtist(
            $mockViewSongDailyRepository,
            $mockInvoiceMonthRepository,
            $mockParameterBagInterface
        );

        $this->assertSame(8.0, $statsUpcomingIncomeForArtist->generateUpcomingIncome($this->fakeArtist()));
    }
}
