<?php

namespace App\Controller;

use App\Model\ContactMessage;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use ApiPlatform\Core\Validator\ValidatorInterface;
use App\Service\SendContactMessage;
use Symfony\Component\HttpFoundation\JsonResponse;
// use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[AsController]
class ContactController extends AbstractController
{
    private function hydrate(array $data, ContactMessage $message): void
    {
        foreach ($data as $key => $value) {
            $method = "set" . ucfirst($key);
            $message->$method($value);
        }
    }

    #[Route('api/contact', name: 'contact')]
    public function sendContact(
        Request $request,
        ValidatorInterface $validator,
        SendContactMessage $sendContactMessage
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $message = new ContactMessage();

        $this->hydrate($data, $message);
        $validator->validate($message);

        $sendContactMessage->send($message);

        return new JsonResponse(null, 200);
    }
}
