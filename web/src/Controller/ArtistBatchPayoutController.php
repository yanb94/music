<?php

namespace App\Controller;

use App\Entity\ArtistBatchPayout;
use App\Service\PaypalBridge;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ArtistBatchPayoutController extends AbstractController
{
    #[Route('/admin/refresh-payout/{id}', name: 'refreshPayout')]
    public function index(
        Request $request,
        ArtistBatchPayout $artistBatchPayout,
        PaypalBridge $paypalBridge,
        EntityManagerInterface $em
    ): Response {
        if (!is_null($artistBatchPayout->getPaypalId())) {
            $dataPaypal = $paypalBridge->getDetailOnBatchPayout($artistBatchPayout->getPaypalId());
            $artistBatchPayout->setStatus($dataPaypal['batch_header']['batch_status']);

            foreach ($artistBatchPayout->getArtistPayouts() as $artistPayout) {
                foreach ($dataPaypal['items'] as $data) {
                    if ($artistPayout->getPaypalId() == $data['payout_item_id']) {
                        if ($artistPayout->getStatus() != $data['transaction_status']) {
                            $artistPayout->setStatus($data['transaction_status']);
                            $em->persist($artistPayout);
                        }
                        break;
                    }
                }
            }

            $em->persist($artistBatchPayout);
            $em->flush();
        }

        return $this->redirect($request->headers->get('referer'));
    }
}
