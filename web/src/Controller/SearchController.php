<?php

namespace App\Controller;

use App\Service\SearchSongsAndPlaylistsService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class SearchController extends AbstractController
{
    #[Route('/api/search', name: 'search')]
    public function index(
        Request $request,
        SearchSongsAndPlaylistsService $searchService
    ): Response {
        $searchParams = $request->query->get('s', null);

        $uri = $request->getRequestUri();


        if (is_null($searchParams) || $searchParams == '') {
            $schemeAndHost = $request->getSchemeAndHttpHost();

            return new JsonResponse([
                "@context" => "/api/contexts/Error",
                "@type" => "hydra:Error",
                "hydra:title" => "An error occurred",
                "hydra:description" => "No route found for " . $schemeAndHost . $uri
            ], 404);
        }

        $pagination = $request->query->get('pagination', 10);
        $pageParams = $request->query->get('page', 1);

        $finalResult = $searchService->search($searchParams, $uri, $pagination, $pageParams);

        return new JsonResponse($finalResult, 200);
    }
}
