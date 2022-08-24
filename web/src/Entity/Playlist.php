<?php

namespace App\Entity;

use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\PlaylistRepository;
use Gedmo\Mapping\Annotation as Gedmo;
use App\Controller\MyPlaylistsController;
use App\Controller\PlaylistPutController;
use App\Controller\PlaylistPostController;
use App\Controller\UnPinPlaylistController;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\AddPinPlaylistController;
use App\Controller\PinnedPlaylistController;
use App\Controller\RandomPlaylistsController;
use App\Controller\IsPlaylistPinnedController;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Symfony\Component\HttpFoundation\File\File;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * @ORM\Entity(repositoryClass=PlaylistRepository::class)
 * @Vich\Uploadable
 */
#[ApiResource(
    attributes: [
        "pagination_items_per_page" => 10,
        "pagination_client_items_per_page" => true
    ],
    normalizationContext: ['groups' => 'get'],
    itemOperations: [
        "get",
        "put" => [
            "method" => "POST",
            "status" => 200,
            "controller" => PlaylistPutController::class,
            "security" => "is_granted('ROLE_USER') && object.getAuthor() == user",
            'denormalization_context' => ['groups' => ['put']],
            "validation_groups" => ['put'],
            'input_formats' => [
                'multipart' => ['multipart/form-data'],
            ],
        ],
        "delete" => [
            "security" => "is_granted('ROLE_USER') && object.getAuthor() == user"
        ],
        "pinPlaylist" => [
            "method" => "GET",
            'path' => "/playlists/{slug}/pin",
            "security" => "is_granted('ROLE_USER')",
            'controller' => AddPinPlaylistController::class,
            'openapi_context' => [
                'summary' => 'Pin playlist'
            ],
        ],
        "unPinPlaylist" => [
            "method" => "GET",
            'path' => "/playlists/{slug}/unpin",
            "security" => "is_granted('ROLE_USER')",
            'controller' => UnPinPlaylistController::class,
            'openapi_context' => [
                'summary' => 'Unpin playlist'
            ],
        ],
        "isPinnedPlaylist" => [
            "method" => "GET",
            'path' => "/playlists/{slug}/is-pinned",
            "security" => "is_granted('ROLE_USER')",
            'controller' => IsPlaylistPinnedController::class,
            'openapi_context' => [
                'summary' => 'Check if playlist is pinned'
            ],
        ]
    ],
    collectionOperations: [
        "get",
        "post" => [
            'denormalization_context' => ['groups' => ['post']],
            "security" => "is_granted('ROLE_USER')",
            "controller" => PlaylistPostController::class,
            "validation_groups" => ['post'],
            'input_formats' => [
                'multipart' => [
                    'multipart/form-data',
                    'application/json'
                ],
            ]
        ],
        "my_playlists" => [
            "method" => "GET",
            'path' => "/playlists/my_playlists",
            'controller' => MyPlaylistsController::class,
            "security" => "is_granted('ROLE_USER')",
            'openapi_context' => [
                'summary' => 'Get my playlists'
            ],
        ],
        "random" => [
            "method" => "GET",
            'path' => "/playlists/random",
            'controller' => RandomPlaylistsController::class,
            'openapi_context' => [
                'summary' => 'Get random playlists'
            ],
        ],
        "pinnedPlaylist" => [
            "method" => "GET",
            'path' => "/playlists/pinned",
            'controller' => PinnedPlaylistController::class,
            "security" => "is_granted('ROLE_USER')",
            'openapi_context' => [
                'summary' => 'Get pinned playlists'
            ],
        ]
    ]
)]
class Playlist
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    #[
        Groups(['get']),
        ApiProperty(identifier: false),
    ]
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    #[
        Assert\NotBlank(groups: ['post', 'put']),
        Assert\Length(min: 2, max: 50, groups: ['post', 'put']),
        Assert\Regex(
            pattern: "/^[ 0-9a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`'\-]+$/",
            message: "Le nom de la playlist ne doit pas contenir de caractères spéciaux",
            match: true,
            groups: ['post', 'put']
        ),
        Groups(['get','post','put'])
    ]
    private $name;

    /**
     * @Gedmo\Timestampable(on="create")
     * @ORM\Column(type="datetime_immutable")
     */
    #[
        Groups(['get'])
    ]
    private $createdAt;

    /**
     * @ORM\ManyToMany(targetEntity=Song::class, inversedBy="playlists")
     */
    #[
        Assert\NotBlank(groups: ['post', 'put']),
        Groups(['get','post','put']),
        ApiSubresource
    ]
    private $songs;

    /**
     * @ORM\Column(type="boolean")
     */
    #[
        Assert\NotNull(groups: ['post', 'put']),
        Groups(['get','post','put'])
    ]
    private $isPublic = false;

    #[
        ApiProperty(iri: 'http://schema.org/contentUrl'),
        Groups(['get'])
    ]
    public ?string $contentImageUrl = null;

    #[
        Groups(['get'])
    ]
    public array $contentImageResponsive = [];

    /**
     * @Vich\UploadableField(mapping="playlist_image", fileNameProperty="imageName")
     *
     * @var File|null
     */
    #[
        Assert\NotBlank(groups: ['post']),
        Assert\File(
            mimeTypes: ['image/jpeg','image/png'],
            maxSize: '2M',
            groups: ['post','put']
        ),
        Groups(['post','put'])
    ]
    private ?File $imageFile = null;

    /**
     * @ORM\Column(type="string")
     */
    private ?string $imageName;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="playlists")
     * @ORM\JoinColumn(nullable=false)
     * @Gedmo\Blameable(on="create")
     */
    #[
        Groups(['get'])
    ]
    private $author;

    /**
     * @ORM\Column(type="datetime_immutable", nullable=true)
     */
    private $imageUpdatedAt;

    /**
     * @ORM\Column(type="integer")
     */
    #[
        Groups(['get'])
    ]
    private $nbSongs = 0;

    /**
     * @ORM\Column(type="float")
     */
    #[
        Groups(['get'])
    ]
    private float $duration = 0;

    /**
     * @Gedmo\Slug(fields={"name"})
     * @ORM\Column(type="string", length=255)
     */
    #[
        ApiProperty(identifier: true),
        Groups(['get'])
    ]
    private $slug;

    /**
     * @ORM\Column(type="integer")
     */
    #[
        Groups(['get'])
    ]
    private $nbViews = 0;

    /**
     * @ORM\ManyToMany(targetEntity=User::class, mappedBy="playlistsPinned")
     */
    private $followers;

    public function __construct()
    {
        $this->songs = new ArrayCollection();
        $this->followers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getCreatedAt(): ?DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * @return Collection|Song[]
     */
    public function getSongs(): Collection
    {
        return $this->songs;
    }

    public function addSong(Song $song): self
    {
        if (!$this->songs->contains($song)) {
            $this->songs[] = $song;
        }

        return $this;
    }

    public function removeSong(Song $song): self
    {
        $this->songs->removeElement($song);

        return $this;
    }

    public function clearSong(): self
    {
        $this->songs->clear();

        return $this;
    }

    public function getIsPublic(): ?bool
    {
        return $this->isPublic;
    }

    public function setIsPublic(bool $isPublic): self
    {
        $this->isPublic = $isPublic;

        return $this;
    }

    public function getContentImageUrl(): ?string
    {
        return $this->contentImageUrl;
    }

    public function setContentImageUrl(?string $contentImageUrl): self
    {
        $this->contentImageUrl = $contentImageUrl;

        return $this;
    }

    public function getImageFile(): ?File
    {
        return $this->imageFile;
    }

    public function setImageFile(?File $imageFile): self
    {
        $this->imageFile = $imageFile;

        if ($imageFile instanceof UploadedFile) {
            $this->setImageUpdatedAt(new DateTimeImmutable());
        }

        return $this;
    }

    public function getImageName(): ?string
    {
        return $this->imageName;
    }

    public function setImageName(?string $imageName): self
    {
        $this->imageName = $imageName;

        return $this;
    }

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(?User $author): self
    {
        $this->author = $author;

        return $this;
    }

    public function getImageUpdatedAt(): ?DateTimeImmutable
    {
        return $this->imageUpdatedAt;
    }

    public function setImageUpdatedAt(?DateTimeImmutable $imageUpdatedAt): self
    {
        $this->imageUpdatedAt = $imageUpdatedAt;

        return $this;
    }

    public function getNbSongs(): ?int
    {
        return $this->nbSongs;
    }

    public function setNbSongs(int $nbSongs): self
    {
        $this->nbSongs = $nbSongs;

        return $this;
    }

    public function decrementNbSongs(): void
    {
        $this->nbSongs--;
    }

    public function getDuration(): ?float
    {
        return $this->duration;
    }

    public function setDuration(float $duration): self
    {
        $this->duration = $duration;

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

    public function getNbViews(): ?int
    {
        return $this->nbViews;
    }

    public function setNbViews(int $nbViews): self
    {
        $this->nbViews = $nbViews;

        return $this;
    }

    public function incrementNbViews(): self
    {
        $this->nbViews++;

        return $this;
    }

    /**
     * @return Collection|User[]
     */
    public function getFollowers(): Collection
    {
        return $this->followers;
    }

    public function addFollower(User $follower): self
    {
        if (!$this->followers->contains($follower)) {
            $this->followers[] = $follower;
            $follower->addPlaylistsPinned($this);
        }

        return $this;
    }

    public function removeFollower(User $follower): self
    {
        if ($this->followers->removeElement($follower)) {
            $follower->removePlaylistsPinned($this);
        }

        return $this;
    }
}
