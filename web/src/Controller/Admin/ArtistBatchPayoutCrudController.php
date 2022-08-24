<?php

namespace App\Controller\Admin;

use App\AdminField\ListArtistBatchPayoutField;
use App\Entity\ArtistBatchPayout;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\MoneyField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;

class ArtistBatchPayoutCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return ArtistBatchPayout::class;
    }


    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular("Paiement aux artistes")
            ->setEntityLabelInPlural("Paiements aux artistes")
            ->setPageTitle("index", "Liste des %entity_label_plural%")
            ->setPageTitle("detail", fn(ArtistBatchPayout $artistBatchPayout) => $artistBatchPayout->getTrackingId())
            ->setDefaultSort(['id' => "DESC"])
        ;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id', 'Id'),
            TextField::new('trackingId', "Identifiant du paiement"),
            TextField::new('paypalId', "Identifiant sur Paypal"),
            TextField::new('status', "Status")->setTemplatePath("admin/field/artist_batch_payout_status.html.twig"),
            MoneyField::new('amount', 'Montant')->setCurrency("EUR"),
            TextField::new('month', "Mois"),
            ListArtistBatchPayoutField::new('artistPayouts', 'Listes des paiments individuels')->onlyOnDetail()
        ];
    }

    public function configureActions(Actions $actions): Actions
    {
        $refreshAction = Action::new("refreshPayout", "Rafraichir status");
        $refreshAction->addCssClass("btn btn-primary");
        $refreshAction->linkToRoute(
            "refreshPayout",
            fn(ArtistBatchPayout $artistBatchPayout) => ["id" => $artistBatchPayout->getId()]
        );

        return $actions
            ->remove(Crud::PAGE_INDEX, Action::NEW)
            ->remove(Crud::PAGE_INDEX, Action::EDIT)
            ->remove(Crud::PAGE_INDEX, Action::DELETE)
            ->add(Crud::PAGE_INDEX, Action::DETAIL)

            ->remove(Crud::PAGE_DETAIL, Action::EDIT)
            ->remove(Crud::PAGE_DETAIL, Action::DELETE)
            ->add(Crud::PAGE_DETAIL, $refreshAction)
        ;
    }
}
