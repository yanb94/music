<?php

namespace App\Repository;

use App\Entity\Song;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\Tools\Pagination\Paginator as DoctrinePaginator;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Paginator;
use App\Entity\Artist;

/**
 * @method Song|null find($id, $lockMode = null, $lockVersion = null)
 * @method Song|null findOneBy(array $criteria, array $orderBy = null)
 * @method Song[]    findAll()
 * @method Song[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SongRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Song::class);
    }

    public function findByAuthorPaginated(Artist $artist, int $page, int $pagination): Paginator
    {
        $firstResult = ($page - 1) * $pagination;

        $queryBuilder = $this->createQueryBuilder('s')
            ->select("s")
            ->join("s.author", "a", "WITH", "a = :artist")
            ->setParameter('artist', $artist)
            ->orderBy('s.createdAt', 'DESC')

        ;

        $query = $queryBuilder->getQuery()
            ->setFirstResult($firstResult)
            ->setMaxResults($pagination)
        ;

        $doctrinePaginator = new DoctrinePaginator($query);
        $paginator = new Paginator($doctrinePaginator);

        return $paginator;
    }

    public function findByAuthorAndSearchPaginated(
        Artist $artist,
        string $search,
        int $page,
        int $pagination
    ): Paginator {
        $firstResult = ($page - 1) * $pagination;

        $queryBuilder = $this->createQueryBuilder('s');

        $queryBuilder->select("s")
            ->join("s.author", "a", "WITH", "a = :artist")
            ->setParameter('artist', $artist)
            ->where($queryBuilder->expr()->like('s.name', ':search'))
            ->setParameter('search', "%" . $search . "%")
            ->orderBy('s.createdAt', 'DESC')
        ;

        $query = $queryBuilder->getQuery()
            ->setFirstResult($firstResult)
            ->setMaxResults($pagination)
        ;

        $doctrinePaginator = new DoctrinePaginator($query);
        $paginator = new Paginator($doctrinePaginator);

        return $paginator;
    }

    public function findAutocomplete(string $search, int $limit)
    {
        $queryBuilder = $this->createQueryBuilder('s');

        $queryBuilder->select("s")
            ->where($queryBuilder->expr()->like('s.name', ':search'))
            ->setParameter('search', "%" . $search . "%")
            ->orderBy('s.createdAt', 'DESC')
            ->setMaxResults($limit)
        ;

        return $queryBuilder->getQuery()->getResult();
    }

    public function findSearchElements(array $ids)
    {
        $queryBuilder = $this->createQueryBuilder('s');

        $queryBuilder->select("s")
            ->where($queryBuilder->expr()->in('s.id', ':ids'))
            ->setParameter(':ids', $ids)
        ;

        return $queryBuilder->getQuery()->getResult();
    }

    public function getRandomSongsExceptOne(string $id, int $limit = 8)
    {
        $queryBuilder = $this->createQueryBuilder('s');

        $queryBuilder->select('s')
            ->where("s.id != :id")
            ->setParameter('id', $id)
            ->setMaxResults($limit)
            ->orderBy('RAND()')
        ;

        return $queryBuilder->getQuery()->getResult();
    }

    public function findByArtistFollowedPaginated(
        User $user,
        int $page,
        int $pagination
    ): Paginator {
        $firstResult = ($page - 1) * $pagination;

        $queryBuilder = $this->createQueryBuilder('s');

        $queryBuilder->select("s")
            ->join("s.author", "a")
            ->join('a.followers', 'f')
            ->where('f = :user')
            ->setParameter('user', $user)
            ->orderBy('s.createdAt', 'DESC')
        ;

        $query = $queryBuilder->getQuery()
            ->setFirstResult($firstResult)
            ->setMaxResults($pagination)
        ;

        $doctrinePaginator = new DoctrinePaginator($query);
        $paginator = new Paginator($doctrinePaginator);

        return $paginator;
    }
}
