<?php

namespace App\Twig;

use Twig\TwigFunction;
use App\Service\StatsFieldProcessor;
use Twig\Extension\AbstractExtension;

class StatsFieldExtension extends AbstractExtension
{
    public function __construct(private StatsFieldProcessor $service)
    {
    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('statsField', [$this, 'statsField'], ['is_safe' => ['html']]),
        ];
    }

    public function statsField(object $object): string
    {
        [$viewsString, $dateString] = $this->service->getStats($object);
        return "<canvas id='statsChart' width='100%' height='250px' data-datas="
        . $viewsString . " data-labels=" . $dateString . " />";
    }
}
