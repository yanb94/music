<?php

namespace App\Repository;

use App\Entity\ViewPlaylist;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ViewPlaylist|null find($id, $lockMode = null, $lockVersion = null)
 * @method ViewPlaylist|null findOneBy(array $criteria, array $orderBy = null)
 * @method ViewPlaylist[]    findAll()
 * @method ViewPlaylist[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ViewPlaylistRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ViewPlaylist::class);
    }

    // /**
    //  * @return ViewPlaylist[] Returns an array of ViewPlaylist objects
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
    public function findOneBySomeField($value): ?ViewPlaylist
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
