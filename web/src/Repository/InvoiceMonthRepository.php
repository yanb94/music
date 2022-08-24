<?php

namespace App\Repository;

use App\Entity\InvoiceMonth;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method InvoiceMonth|null find($id, $lockMode = null, $lockVersion = null)
 * @method InvoiceMonth|null findOneBy(array $criteria, array $orderBy = null)
 * @method InvoiceMonth[]    findAll()
 * @method InvoiceMonth[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class InvoiceMonthRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, InvoiceMonth::class);
    }

    /**
     * Get last InvoiceMonth
     *
     * @param integer $limit
     * @return InvoiceMonth[]
     */
    public function getLastInvoiceMonth(int $limit = 12)
    {
        return $this->createQueryBuilder('i')
            ->setMaxResults($limit)
            ->orderBy('i.id', 'DESC')
            ->getQuery()
            ->getResult()
        ;
    }

    // /**
    //  * @return InvoiceMonth[] Returns an array of InvoiceMonth objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('i.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?InvoiceMonth
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
