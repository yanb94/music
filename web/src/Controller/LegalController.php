<?php

namespace App\Controller;

use App\Entity\Legal;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class LegalController extends AbstractController
{
    private const UP = "up";
    private const DOWN = "down";

    private function changeLegalPosition(
        string $action,
        Legal $entity,
        EntityManagerInterface $manager,
        Request $request
    ): Response {
        $currentPosition = $entity->getPosition();

        $newPosition = match ($action) {
            self::UP => $currentPosition - 1,
            self::DOWN => $currentPosition + 1
        };

        $entity->setPosition($newPosition);

        $manager->persist($entity);
        $manager->flush();

        return $this->redirect($request->headers->get('referer'));
    }

    #[Route('admin/legal-up/{id}', name: 'legal-up')]
    public function legalUp(Legal $legal, EntityManagerInterface $em, Request $request): Response
    {
        return $this->changeLegalPosition(
            action: self::UP,
            entity: $legal,
            manager: $em,
            request: $request
        );
    }

    #[Route('admin/legal-down/{id}', name: 'legal-down')]
    public function legalDown(Legal $legal, EntityManagerInterface $em, Request $request): Response
    {
        return $this->changeLegalPosition(
            action: self::DOWN,
            entity: $legal,
            manager: $em,
            request: $request
        );
    }
}
