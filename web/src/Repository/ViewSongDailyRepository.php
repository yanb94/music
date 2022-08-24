<?php

namespace App\Repository;

use App\Entity\Artist;
use App\Entity\Song;
use DateTimeInterface;
use App\Entity\ViewSongDaily;
use DateTime;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @method ViewSongDaily|null find($id, $lockMode = null, $lockVersion = null)
 * @method ViewSongDaily|null findOneBy(array $criteria, array $orderBy = null)
 * @method ViewSongDaily[]    findAll()
 * @method ViewSongDaily[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ViewSongDailyRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ViewSongDaily::class);
    }

    public function findByViewSongByArtistAndDay(Artist $artist, DateTimeInterface $limitDate)
    {
        return $this->createQueryBuilder('v')
            ->select("v.date, SUM(v.nbViews) AS views")
            ->join('v.song', 's')
            ->join('s.author', 'a')
            ->andWhere('v.date > :limitDate')
            ->andWhere('a = :artist')
            ->setParameter('artist', $artist)
            ->setParameter('limitDate', $limitDate)
            ->orderBy('v.date', 'ASC')
            ->groupBy('v.date')
            ->getQuery()
            ->getResult()
        ;
    }

    private function betweenMonth(DateTime $limitDate): array
    {
        $year = $limitDate->format('Y');
        $month = $limitDate->format('m');

        $startDate = new DateTime("$year-$month-01T00:00:00");
        $endDate = $limitDate->modify('last day of this month')->setTime(23, 59, 59);

        return [$startDate,$endDate];
    }

    public function findByViewSongByArtistAndMonth(Artist $artist, DateTime $limitDate)
    {
        [$startMonth,$endMonth] = $this->betweenMonth($limitDate);

        return $this->createQueryBuilder('v')
            ->select("SUM(v.nbViews)")
            ->join('v.song', 's')
            ->join('s.author', 'a')
            ->andWhere('v.date BETWEEN :startMonth AND :endMonth')
            ->andWhere('a = :artist')
            ->setParameter('artist', $artist)
            ->setParameter('startMonth', $startMonth)
            ->setParameter('endMonth', $endMonth)
            ->getQuery()
            ->getSingleScalarResult()
        ;
    }

    public function findAllViewsSongsByMonth(DateTime $limitDate)
    {
        [$startMonth,$endMonth] = $this->betweenMonth($limitDate);

        return $this->createQueryBuilder('v')
            ->select("SUM(v.nbViews)")
            ->join('v.song', 's')
            ->andWhere('v.date BETWEEN :startMonth AND :endMonth')
            ->setParameter('startMonth', $startMonth)
            ->setParameter('endMonth', $endMonth)
            ->getQuery()
            ->getSingleScalarResult()
        ;
    }

    public function findByViewSongByDay(DateTimeInterface $limitDate)
    {
        return $this->createQueryBuilder('v')
            ->select("v.date, SUM(v.nbViews) AS views")
            ->andWhere('v.date > :limitDate')
            ->setParameter('limitDate', $limitDate)
            ->orderBy('v.date', 'ASC')
            ->groupBy('v.date')
            ->getQuery()
            ->getResult()
        ;
    }

    public function findByViewSongByDayAndSong(Song $song, DateTimeInterface $limitDate)
    {
        return $this->createQueryBuilder('v')
            ->andWhere('v.date > :limitDate')
            ->andWhere('v.song = :song')
            ->setParameter('song', $song)
            ->setParameter('limitDate', $limitDate)
            ->orderBy('v.date', 'ASC')
            ->getQuery()
            ->getResult()
        ;
    }

    public function findBestViewSongByDay(DateTimeInterface $limitDate, int $nbResults)
    {
        $limitDate = $limitDate->format("Y-m-d");

        return $this->createQueryBuilder('v')
            ->select("v,song")
            ->join("v.song", 'song')
            ->andWhere('v.date = :limitDate')
            ->setParameter('limitDate', $limitDate)
            ->orderBy("v.nbViews", "DESC")
            ->setMaxResults($nbResults)
            ->getQuery()
            ->getResult()
        ;
    }

    /*
    public function findOneBySomeField($value): ?ViewSongDaily
    {
        return $this->createQueryBuilder('v')
            ->andWhere('v.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
