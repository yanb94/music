<?php

namespace App\Controller\Admin;

use App\Entity\User;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class UserCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return User::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular("utilisateur")
            ->setEntityLabelInPlural("utilisateurs")
            ->setPageTitle("index", "Liste des %entity_label_plural%")
            ->setDefaultSort(['username' => "ASC"])
        ;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('username')
        ];
    }

    public function configureActions(Actions $actions): Actions
    {
        $contactUser = Action::new('contactUser', "Contacter", "fas fa-envelope")
            ->linkToRoute('contact_user', fn(User $user) => [
                "id" => $user->getId()
            ])
        ;

        return $actions
            ->remove(Crud::PAGE_INDEX, Action::NEW)
            ->remove(Crud::PAGE_INDEX, Action::EDIT)
            ->remove(Crud::PAGE_INDEX, Action::DELETE)
            ->add(Crud::PAGE_INDEX, $contactUser)
        ;
    }
}
