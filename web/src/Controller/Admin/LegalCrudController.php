<?php

namespace App\Controller\Admin;

use App\Entity\Legal;
use FOS\CKEditorBundle\Form\Type\CKEditorType;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class LegalCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Legal::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular("Document légal")
            ->setEntityLabelInPlural("Documents légaux")
            ->setPageTitle("index", "Liste des %entity_label_plural%")
            ->setPageTitle("new", "Créer un nouveau document légal")
            ->setPageTitle("edit", "Modifier un document légal")
            ->addFormTheme('@FOSCKEditor/Form/ckeditor_widget.html.twig')
            ->setDefaultSort(['position' => "ASC"])
        ;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            // IdField::new('id'),
            NumberField::new('position', label: "Position")
                ->hideOnForm()
                ->setSortable(true)
            ,
            TextField::new('title', label: "Titre"),
            TextField::new('label', label: "Label pour les menus"),
            TextEditorField::new('content', label: "Contenu")
                ->setFormType(CKEditorType::class)
                ->setFormTypeOptions([
                    "config" => [
                        "toolbar" => "my_toolbar"
                    ]
                ])
                ->setSortable(false)
                ,
        ];
    }

    public function configureActions(Actions $actions): Actions
    {
        $increasePosition = Action::new('increasePosition', "Monter", 'fas fa-arrow-up');
        $increasePosition->linkToRoute('legal-up', fn (Legal $legal) => ["id" => $legal->getId()]);

        $decreasePosition = Action::new('decreasePosition', "Descendre", 'fas fa-arrow-down');
        $decreasePosition->linkToRoute('legal-down', fn (Legal $legal) => ["id" => $legal->getId()]);

        return $actions
            ->update(Crud::PAGE_INDEX, Action::NEW, fn (Action $action) =>
                $action->setLabel("Créer un %entity_label_singular%"))
            ->add(Crud::PAGE_INDEX, $decreasePosition)
            ->add(Crud::PAGE_INDEX, $increasePosition)
        ;
    }
}
