<?php

namespace App\Controller\Admin;

use App\AdminField\UpcomingArtistIncomeField;
use App\Entity\Artist;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;

class ArtistCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Artist::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular("artiste")
            ->setEntityLabelInPlural("artistes")
            ->setPageTitle("index", "Liste des %entity_label_plural%")
            ->setPageTitle("detail", fn(Artist $artist) => $artist->getName())
            ->setDefaultSort(['name' => "ASC"])
        ;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('name', 'Nom')->setSortable(true),
            ImageField::new('filePath', "Avatar")->setBasePath("images/avatar/")->setSortable(false),
            TextEditorField::new('description')->setSortable(false),
            AssociationField::new('songs', "Chansons"),
            TextField::new('user.username', "Utilisateur"),
            UpcomingArtistIncomeField::new('upcomingIncome', 'Revenu prévisionel du mois')->onlyOnDetail()
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
