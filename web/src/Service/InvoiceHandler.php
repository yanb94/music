<?php

namespace App\Service;

use DateTime;
use Stripe\Invoice;
use App\Entity\User;
use DateTimeImmutable;
use App\Entity\InvoiceMonth;
use App\Repository\UserRepository;
use App\Entity\Invoice as EntityInvoice;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\InvoiceMonthRepository;

class InvoiceHandler
{
    public function __construct(
        private UserRepository $userRepository,
        private InvoiceMonthRepository $invoiceMonthRepository,
        private EntityManagerInterface $em
    ) {
    }

    public function invoiceCreated(Invoice $invoice): void
    {
        $user = $this->userRepository->findOneBy(['customerId' => $invoice->customer]);

        if (is_null($user)) {
            return;
        }

        $invoiceEntity = $this->createInvoice($invoice, $user);
        $invoiceMonth = $this->createOrUpdateInvoiceMonth($invoice);

        $this->em->persist($invoiceMonth);
        $this->em->persist($invoiceEntity);
        $this->em->flush();
    }

    private function createInvoice(Invoice $invoice, User $user): EntityInvoice
    {
        return (new EntityInvoice())
            ->setInvoiceId($invoice->id)
            ->setNumber($invoice->number)
            ->setTotal($invoice->total)
            ->setSubTotal($invoice->subtotal)
            ->setVat($invoice->tax)
            ->setUrl($invoice->hosted_invoice_url)
            ->setCustomer($user)
            ->setCreatedAt(new DateTimeImmutable())
        ;
    }

    private function createOrUpdateInvoiceMonth(Invoice $invoice): InvoiceMonth
    {
        $invoiceMonth = $this->invoiceMonthRepository->findOneBy(['month' => (new DateTime())->format('m-Y')]);

        if (is_null($invoiceMonth)) {
            return $invoiceMonth = (new InvoiceMonth())
                ->setMonth((new DateTime())->format('m-Y'))
                ->setTotal($invoice->total)
                ->setSubTotal($invoice->subtotal)
                ->setVat($invoice->tax)
            ;
        }

        return $invoiceMonth
            ->addToTotal($invoice->total)
            ->addToSubTotal($invoice->subtotal)
            ->addToVat($invoice->tax)
        ;
    }
}
