<?php

namespace App\Repository;

use App\Entity\Playlist;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\Tools\Pagination\Paginator as DoctrinePaginator;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Paginator;

/**
 * @method Playlist|null find($id, $lockMode = null, $lockVersion = null)
 * @method Playlist|null findOneBy(array $criteria, array $orderBy = null)
 * @method Playlist[]    findAll()
 * @method Playlist[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PlaylistRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Playlist::class);
    }

    public function findByUserWhoPinPlaylists(User $user, int $page, int $pagination): Paginator
    {
        $firstResult = ($page - 1) * $pagination;

        $queryBuilder = $this->createQueryBuilder('s');

        $queryBuilder = $this->createQueryBuilder('s')
            ->select("s")
            ->join("s.followers", "f")
            ->where($queryBuilder->expr()->in('f', ':user'))
            ->setParameter('user', $user)
            ->orderBy('s.name', 'ASC')

        ;

        $query = $queryBuilder->getQuery()
            ->setFirstResult($firstResult)
            ->setMaxResults($pagination)
        ;

        $doctrinePaginator = new DoctrinePaginator($query);
        $paginator = new Paginator($doctrinePaginator);

        return $paginator;
    }

    public function findByAuthorPaginated(User $author, int $page, int $pagination): Paginator
    {
        $firstResult = ($page - 1) * $pagination;

        $queryBuilder = $this->createQueryBuilder('s')
            ->select("s")
            ->join("s.author", "a", "WITH", "a = :author")
            ->setParameter('author', $author)
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

    public function findByAuthorAndSearchPaginated(User $author, string $search, int $page, int $pagination): Paginator
    {
        $firstResult = ($page - 1) * $pagination;

        $queryBuilder = $this->createQueryBuilder('s');

        $queryBuilder = $queryBuilder
            ->select("s")
            ->join("s.author", "a", "WITH", "a = :author")
            ->setParameter('author', $author)
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

    public function findSearchElements(array $ids)
    {
        $queryBuilder = $this->createQueryBuilder('p');

        $queryBuilder->select("p")
            ->where($queryBuilder->expr()->in('p.id', ':ids'))
            ->setParameter(':ids', $ids)
        ;

        return $queryBuilder->getQuery()->getResult();
    }

    public function getRandomPlaylists(int $limit = 4)
    {
        $queryBuilder = $this->createQueryBuilder('p');

        $queryBuilder->select("p")
            ->where('p.isPublic = :isPublic')
            ->setParameter('isPublic', true)
            ->orderBy('RAND()')
        ;

        return $queryBuilder->getQuery()->getResult();
    }
}
