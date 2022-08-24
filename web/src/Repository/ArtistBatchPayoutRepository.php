<?php

namespace App\Repository;

use App\Entity\ArtistBatchPayout;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ArtistBatchPayout|null find($id, $lockMode = null, $lockVersion = null)
 * @method ArtistBatchPayout|null findOneBy(array $criteria, array $orderBy = null)
 * @method ArtistBatchPayout[]    findAll()
 * @method ArtistBatchPayout[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ArtistBatchPayoutRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ArtistBatchPayout::class);
    }

    // /**
    //  * @return ArtistBatchPayout[] Returns an array of ArtistBatchPayout objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('a.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?ArtistBatchPayout
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
