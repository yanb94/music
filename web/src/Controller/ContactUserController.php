<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\ContactUserType;
use App\Service\SendContactUser;
use App\Service\SendContactMessage;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ContactUserController extends AbstractController
{
    #[Route('admin/contact/user', name: 'contact_user')]
    public function index(User $user, Request $request, SendContactUser $sendContactUser): Response
    {
        $form = $this->createForm(ContactUserType::class, []);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $data = $form->getData();
            $sendContactUser->send(
                object: $data['object'],
                message: $data['message'],
                user: $user
            );

            return $this->render('contact_user/success.html.twig');
        }

        return $this->render('contact_user/index.html.twig', [
            "user" => $user,
            "form" => $form->createView()
        ]);
    }
}
