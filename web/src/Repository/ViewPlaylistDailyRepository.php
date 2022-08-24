<?php

namespace App\Repository;

use App\Entity\User;
use DateTimeInterface;
use App\Entity\Playlist;
use App\Entity\ViewPlaylistDaily;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @method ViewPlaylistDaily|null find($id, $lockMode = null, $lockVersion = null)
 * @method ViewPlaylistDaily|null findOneBy(array $criteria, array $orderBy = null)
 * @method ViewPlaylistDaily[]    findAll()
 * @method ViewPlaylistDaily[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ViewPlaylistDailyRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ViewPlaylistDaily::class);
    }

    public function findByViewPlaylistByUserAndDay(User $user, DateTimeInterface $limitDate)
    {
        return $this->createQueryBuilder('v')
            ->select("v.date, SUM(v.nbViews) AS views")
            ->join('v.playlist', 'p')
            ->join('p.author', 'u')
            ->andWhere('u = :user')
            ->setParameter('user', $user)
            ->andWhere('v.date > :limitDate')
            ->setParameter('limitDate', $limitDate)
            ->orderBy('v.date', 'ASC')
            ->groupBy('v.date')
            ->getQuery()
            ->getResult()
        ;
    }

    public function findByViewPlaylistByDay(DateTimeInterface $limitDate)
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

    public function findBestViewPlaylistByDay(DateTimeInterface $limitDate, int $nbResults)
    {
        $limitDate = $limitDate->format("Y-m-d");

        return $this->createQueryBuilder('v')
            ->select("v,playlist")
            ->join("v.playlist", 'playlist')
            ->andWhere('v.date = :limitDate')
            ->andWhere('playlist.isPublic = :isPublic')
            ->setParameter('isPublic', true)
            ->setParameter('limitDate', $limitDate)
            ->orderBy("v.nbViews", "DESC")
            ->setMaxResults($nbResults)
            ->getQuery()
            ->getResult()
        ;
    }

    public function findByViewPlaylistByDayAndPlaylist(Playlist $playlist, DateTimeInterface $limitDate)
    {
        return $this->createQueryBuilder('v')
            ->andWhere('v.date > :limitDate')
            ->andWhere('v.playlist = :playlist')
            ->setParameter('playlist', $playlist)
            ->setParameter('limitDate', $limitDate)
            ->orderBy('v.date', 'ASC')
            ->getQuery()
            ->getResult()
        ;
    }

    // /**
    //  * @return ViewPlaylistDaily[] Returns an array of ViewPlaylistDaily objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('v')
            ->andWhere('v.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('v.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?ViewPlaylistDaily
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
