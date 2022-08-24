<?php

namespace App\Serializer;

use ApiPlatform\Core\Serializer\SerializerContextBuilderInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

final class SubscriberContextBuilder implements SerializerContextBuilderInterface
{
    public function __construct(
        private SerializerContextBuilderInterface $decorated,
        private AuthorizationCheckerInterface $authorizationChecker
    ) {
        $this->decorated = $decorated;
        $this->authorizationChecker = $authorizationChecker;
    }

    public function createFromRequest(Request $request, bool $normalization, ?array $extractedAttributes = null): array
    {
        $context = $this->decorated->createFromRequest($request, $normalization, $extractedAttributes);

        if ($this->authorizationChecker->isGranted("ROLE_SUBSCRIBER")) {
            if (is_array($context['groups'])) {
                $context['groups'][] = 'subscriber';
            } elseif (is_string($context['groups'])) {
                $context['groups'] = [$context['groups'],'subscriber'];
            }
        }

        return $context;
    }
}
