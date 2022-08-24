<?php

namespace App\Repository;

use App\Entity\Artist;
use App\Entity\ArtistPayout;
use Doctrine\Persistence\ManagerRegistry;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Paginator;
use Doctrine\ORM\Tools\Pagination\Paginator as DoctrinePaginator;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @method ArtistPayout|null find($id, $lockMode = null, $lockVersion = null)
 * @method ArtistPayout|null findOneBy(array $criteria, array $orderBy = null)
 * @method ArtistPayout[]    findAll()
 * @method ArtistPayout[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ArtistPayoutRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ArtistPayout::class);
    }

    public function findArtistPayoutByArtist(Artist $artist, int $page, int $pagination): Paginator
    {
        $firstResult = ($page - 1) * $pagination;

        $queryBuilder = $this->createQueryBuilder('a')
            ->join("a.artist", "artist", "WITH", "artist = :artist")
            ->setParameter("artist", $artist)
            ->orderBy('a.id', 'DESC')
        ;

        $query = $queryBuilder->getQuery()
            ->setFirstResult($firstResult)
            ->setMaxResults($pagination)
        ;

        $doctrinePaginator = new DoctrinePaginator($query);
        $paginator = new Paginator($doctrinePaginator);

        return $paginator;
    }

    // /**
    //  * @return ArtistPayout[] Returns an array of ArtistPayout objects
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
    public function findOneBySomeField($value): ?ArtistPayout
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
