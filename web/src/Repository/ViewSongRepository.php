<?php

namespace App\Repository;

use App\Entity\ViewSong;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ViewSong|null find($id, $lockMode = null, $lockVersion = null)
 * @method ViewSong|null findOneBy(array $criteria, array $orderBy = null)
 * @method ViewSong[]    findAll()
 * @method ViewSong[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ViewSongRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ViewSong::class);
    }

    // /**
    //  * @return ViewSong[] Returns an array of ViewSong objects
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
    public function findOneBySomeField($value): ?ViewSong
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
