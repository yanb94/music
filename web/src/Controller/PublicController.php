<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class PublicController extends AbstractController
{
    #[Route(
        '/{reactRouting}',
        name: 'index',
        defaults: ["reactRouting" => null],
        requirements: ['reactRouting' => "^(?!.*(api|admin|authentication_token|sitemap.xml)).*"]
    )]
    public function index(Request $request): Response
    {
        /**
         * Ugly fix who seems to fix a problem with chromium when it is impossible to fix
         * currentTime of an audio correctly
         * https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime
         * https://www.py4u.net/discuss/983656
         */
        $request->getSession()->set("fix", rand());

        return $this->render('base.html.twig');
    }
}
