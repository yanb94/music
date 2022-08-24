<?php

namespace App\Repository;

use DateTime;
use App\Entity\User;
use App\Entity\Artist;
use Doctrine\Persistence\ManagerRegistry;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Paginator;
use Doctrine\ORM\Tools\Pagination\Paginator as DoctrinePaginator;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @method Artist|null find($id, $lockMode = null, $lockVersion = null)
 * @method Artist|null findOneBy(array $criteria, array $orderBy = null)
 * @method Artist[]    findAll()
 * @method Artist[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ArtistRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Artist::class);
    }

    public function findByUserWhoFollowPaginated(
        User $user,
        int $page,
        int $pagination
    ): Paginator {
        $firstResult = ($page - 1) * $pagination;

        $queryBuilder = $this->createQueryBuilder('a');

        $queryBuilder->select("a")
            ->join('a.followers', 'f')
            ->where($queryBuilder->expr()->in('f', ':user'))
            ->setParameter('user', $user)
            ->orderBy('a.name', 'ASC')
        ;

        $query = $queryBuilder->getQuery()
            ->setFirstResult($firstResult)
            ->setMaxResults($pagination)
        ;

        $doctrinePaginator = new DoctrinePaginator($query);
        $paginator = new Paginator($doctrinePaginator);

        return $paginator;
    }

    private function betweenMonth(DateTime $limitDate): array
    {
        $year = $limitDate->format('Y');
        $month = $limitDate->format('m');

        $startDate = new DateTime("$year-$month-01T00:00:00");
        $endDate = $limitDate->modify('last day of this month')->setTime(23, 59, 59);

        return [$startDate,$endDate];
    }

    public function findAllByViewSongByArtistAndMonth(DateTime $limitDate)
    {
        [$startMonth,$endMonth] = $this->betweenMonth($limitDate);

        return $this->createQueryBuilder('a')
            ->select('a AS artist, SUM(v.nbViews) AS views')
            ->leftJoin('a.songs', 's')
            ->leftJoin('s.viewsSongDaily', 'v')
            ->andWhere('v.date BETWEEN :startMonth AND :endMonth')
            ->setParameter('startMonth', $startMonth)
            ->setParameter('endMonth', $endMonth)
            ->groupBy('a.id')
            ->getQuery()
            ->getResult()
        ;
    }

    // /**
    //  * @return Artist[] Returns an array of Artist objects
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
    public function findOneBySomeField($value): ?Artist
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
