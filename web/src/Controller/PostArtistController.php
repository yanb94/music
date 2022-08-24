<?php

namespace App\Controller;

use App\Entity\Artist;
use App\Repository\ArtistRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use ApiPlatform\Core\Validator\ValidatorInterface;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Validator\ConstraintViolationList;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use ApiPlatform\Core\Bridge\Symfony\Validator\Exception\ValidationException;

#[AsController]
class PostArtistController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private ArtistRepository $artistRepository,
        private ValidatorInterface $validator,
    ) {
    }

    public function __invoke(Request $request)
    {
        /** @var Artist */
        $artist = $request->attributes->get("data");

        $otherArtist = $this->artistRepository->findOneBy(["user" => $artist->getUser()]);

        if (!is_null($otherArtist)) {
            throw new ValidationException(
                new ConstraintViolationList(
                    [
                        new ConstraintViolation(
                            message: "Vous êtes déjà inscrit en tant qu'artiste",
                            messageTemplate: null,
                            parameters: [],
                            root:$artist->getUser(),
                            invalidValue: $artist->getUser(),
                            propertyPath:"user"
                        )
                    ]
                )
            );
        }

        $artist->setFile($request->files->get("image"));

        return $artist;
    }
}
