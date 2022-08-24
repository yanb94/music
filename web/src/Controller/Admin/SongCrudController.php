<?php

namespace App\Controller\Admin;

use App\AdminField\DurationField;
use App\AdminField\SongField;
use App\AdminField\StatField;
use App\Entity\Song;
use App\Repository\ViewSongDailyRepository;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IntegerField;

class SongCrudController extends AbstractCrudController
{
    public function __construct(private ViewSongDailyRepository $viewSongDailyRepository)
    {
    }

    public static function getEntityFqcn(): string
    {
        return Song::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular("chanson")
            ->setEntityLabelInPlural("chansons")
            ->setPageTitle("index", "Liste des %entity_label_plural%")
            ->setPageTitle("detail", fn(Song $song) => $song->getName())
            ->setDefaultSort(['createdAt' => "DESC"])
        ;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            ImageField::new('imageName', "Couverture")->setBasePath("images/song/")->setSortable(false),
            TextField::new('name', 'Nom')->setSortable(true),
            DateTimeField::new("createdAt", "Date d'ajout")->setSortable(true),
            DurationField::new("songDuration", "Durée")->setSortable(true),
            TextField::new('author.name', "Auteur"),
            SongField::new("songName", "Chanson")->onlyOnDetail()->setBasePath("song/"),
            IntegerField::new('nbViews', 'Nombre de vues')->setSortable(true),
            StatField::new("statsViews", "Statistique")->onlyOnDetail()
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
