<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\LegalRepository;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use ApiPlatform\Core\Annotation\ApiProperty;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=LegalRepository::class)
 */
#[ApiResource(
    paginationEnabled: false,
    order: ['position' => 'ASC'],
    collectionOperations: [
        'get' => [
            'normalization_context' => ["groups" => ['list']]
        ],
    ],
    itemOperations: [
        "get" => [
            'normalization_context' => ["groups" => ['item']]
        ]
    ]
)]
class Legal
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    #[
        ApiProperty(identifier: false),
        Groups(['list','item'])
    ]
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    #[
        Assert\NotNull(),
        Assert\NotBlank(),
        Assert\Length(
            min: 5,
            max: 50
        ),
        Groups(['list','item'])
    ]
    private $title;

    /**
     * @ORM\Column(type="string", length=255)
     */
    #[
        Assert\NotNull(),
        Assert\NotBlank(),
        Assert\Length(
            min: 5,
            max: 25
        ),
        Groups(['list','item'])
    ]
    private $label;

    /**
     * @ORM\Column(type="text")
     */
    #[
        Assert\NotNull(),
        Assert\NotBlank(),
        Groups(['item'])
    ]
    private $content;

    /**
     * @Gedmo\Slug(fields={"title"})
     * @ORM\Column(type="string", length=255, unique=true)
     */
    #[
        ApiProperty(identifier: true),
        Groups(['list','item'])
    ]
    private $slug;

    /**
     * @Gedmo\SortablePosition
     * @ORM\Column(type="integer")
     */
    private $position;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getLabel(): ?string
    {
        return $this->label;
    }

    public function setLabel(string $label): self
    {
        $this->label = $label;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;

        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): self
    {
        $this->slug = $slug;

        return $this;
    }

    public function getPosition(): ?int
    {
        return $this->position;
    }

    public function setPosition(int $position): self
    {
        $this->position = $position;

        return $this;
    }
}
