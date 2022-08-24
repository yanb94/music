<?php

namespace App\Controller\Admin;

use App\AdminField\StatField;
use App\Entity\Playlist;
use Doctrine\ORM\QueryBuilder;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Dto\EntityDto;
use EasyCorp\Bundle\EasyAdminBundle\Dto\SearchDto;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IntegerField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Orm\EntityRepository;
use EasyCorp\Bundle\EasyAdminBundle\Collection\FieldCollection;
use EasyCorp\Bundle\EasyAdminBundle\Collection\FilterCollection;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class PlaylistCrudController extends AbstractCrudController
{
    public function createIndexQueryBuilder(
        SearchDto $searchDto,
        EntityDto $entityDto,
        FieldCollection $fields,
        FilterCollection $filters
    ): QueryBuilder {
        return $this->get(EntityRepository::class)
            ->createQueryBuilder($searchDto, $entityDto, $fields, $filters)
            ->where("entity.isPublic = true")
        ;
    }

    public static function getEntityFqcn(): string
    {
        return Playlist::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular("playlist")
            ->setEntityLabelInPlural("playlists")
            ->setPageTitle("index", "Liste des %entity_label_plural% publics")
            ->setPageTitle("detail", fn(Playlist $playlist) => $playlist->getName())
            ->setDefaultSort(['createdAt' => "DESC"])
        ;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            ImageField::new('imageName', "Couverture")->setBasePath("images/playlist/")->setSortable(false),
            TextField::new('name')->setSortable(true),
            DateTimeField::new("createdAt", "Date d'ajout")->setSortable(true),
            NumberField::new('nbSongs', "Chansons"),
            TextField::new('author.username', "Auteur")->setSortable(true),
            IntegerField::new('nbViews', 'Nombre de vues')->setSortable(true),
            StatField::new('statsViews', "Statistique")->onlyOnDetail()
        ];
    }

    public function configureActions(Actions $actions): Actions
    {
        return $actions
            ->add(Crud::PAGE_INDEX, Action::DETAIL)
            ->remove(Crud::PAGE_INDEX, Action::NEW)
            ->remove(Crud::PAGE_INDEX, Action::EDIT)
            ->remove(Crud::PAGE_DETAIL, Action::EDIT)
        ;
    }
}
