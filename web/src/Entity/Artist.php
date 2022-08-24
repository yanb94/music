<?php

namespace App\Entity;

use DateTime;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\ArtistRepository;
use Gedmo\Mapping\Annotation as Gedmo;
use App\Controller\PutArtistController;
use App\Controller\IsFollowerController;
use App\Controller\PostArtistController;
use App\Controller\AddFollowerController;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\RemoveFollowerController;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Symfony\Component\HttpFoundation\File\File;
use App\Controller\ArtistFollowByUserController;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * @ORM\Entity(repositoryClass=ArtistRepository::class)
 * @Vich\Uploadable
 */
#[ApiResource(
    normalizationContext: ['groups' => 'get'],
    itemOperations: [
        "get",
        "put" => [
            'method' => 'POST',
            "status" => 200,
            "controller" => PutArtistController::class,
            'denormalization_context' => ['groups' => ['put']],
            "security" => "object.getUser() == user",
            "validation_groups" => ['put'],
            'input_formats' => [
                'multipart' => ['multipart/form-data'],
            ],
        ],
        "is_follower" => [
            'method' => 'GET',
            "status" => 200,
            'path' => "/artists/is_follower/{slug}",
            'controller' => IsFollowerController::class,
            "security" => "is_granted('ROLE_USER')"
        ],
        "add_follower" => [
            'method' => 'GET',
            "status" => 200,
            'path' => "/artists/add_follower/{slug}",
            'controller' => AddFollowerController::class,
            "security" => "is_granted('ROLE_USER')"
        ],
        "remove_follower" => [
            'method' => 'GET',
            "status" => 200,
            'path' => "/artists/remove_follower/{slug}",
            'controller' => RemoveFollowerController::class,
            "security" => "is_granted('ROLE_USER')"
        ],
        "delete" => [
            "security" => "object.getUser() == user"
        ]
    ],
    collectionOperations: [
        'get',
        'post' => [
            'controller' => PostArtistController::class,
            'denormalization_context' => ['groups' => ['post']],
            "security" => "is_granted('ROLE_USER')",
            "validation_groups" => ['post'],
            'input_formats' => [
                'multipart' => ['multipart/form-data'],
            ],
        ],
        'followedByUser' => [
            'method' => 'GET',
            'path' => "/artists/followed",
            'controller' => ArtistFollowByUserController::class,
            "security" => "is_granted('ROLE_USER')",
            'openapi_context' => [
                'summary' => 'Get artists who are follow by the current user'
            ]
        ]
    ],
    subresourceOperations: [
        'api_user_artist_get_subresource' => [
            'method' => 'GET'
        ],
        'api_users_subscribes_get_subresource' => [
            'method' => 'GET',
            "security" => "is_granted('ROLE_USER') && id == user.getId()",
            'normalization_context' => [
                'groups' => ['get'],
            ],
            'openapi_context' => [
                'summary' => 'Get artists who the user subscribe'
            ]
        ],

    ]
)]
class Artist
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    #[
        Groups(['get']),
        ApiProperty(identifier: false)
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
            message: "Votre nom d'utilisateur ne doit pas contenir de caractères spéciaux",
            match: true,
            groups: ['post','put']
        ),
        Groups(['post','get','put'])
    ]
    private $name;

    /**
     * @ORM\Column(type="string", length=255)
     */
    #[
        Assert\NotBlank(groups: ['post','put']),
        Assert\Email(groups: ['post','put']),
        Groups(['post','author','put'])
    ]
    private $email;

    /**
     * @ORM\Column(type="text")
     */
    #[
        Assert\NotBlank(groups: ['post','put']),
        Assert\Length(min: 20, max: 250, groups: ['post','put']),
        Groups(['post','get','put'])
    ]
    private $description;

    /**
     * @ORM\OneToOne(targetEntity=User::class, inversedBy="artist", cascade={"persist"})
     * @ORM\JoinColumn(nullable=false)
     */
    #[
        Assert\NotNull(groups: ['post']),
        Groups(['post'])
    ]
    private $user;

    #[
        ApiProperty(iri: 'http://schema.org/contentUrl'),
        Groups(['get'])
    ]
    public ?string $contentUrl = null;

    #[
        Groups(['get'])
    ]
    public array $contentImageResponsive = [];

    /**
     * @Vich\UploadableField(mapping="avatars", fileNameProperty="filePath")
     */
    #[
        Assert\NotBlank(groups: ['post']),
        Assert\File(
            groups: ['post','put'],
            mimeTypes: ['image/jpeg','image/png'],
            maxSize: '2M'
        ),
    ]
    public ?File $file = null;

    /**
     * @ORM\Column(nullable=true)
     */
    public ?string $filePath = null;

    /**
     * @ORM\Column(type="datetime",nullable=true)
     *
     * @var DateTime
     */
    public DateTime $imageUpdatedAt;

    /**
     * @ORM\OneToMany(targetEntity=Song::class, mappedBy="author", orphanRemoval=true)
     */
    #[
        ApiSubresource
    ]
    private $songs;

    /**
     * @Gedmo\Slug(fields={"name"})
     * @ORM\Column(type="string", length=255, unique=true)
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
    private $nbSongs = 0;

    /**
     * @ORM\ManyToMany(targetEntity=User::class, mappedBy="subscribes", cascade={"persist"})
     */
    private $followers;

    /**
     * @ORM\Column(type="integer")
     */
    #[
        Groups(['get'])
    ]
    private $nbFollowers = 0;

    /**
     * @ORM\OneToMany(targetEntity=ArtistPayout::class, mappedBy="artist")
     */
    private $artistPayouts;

    public function __construct()
    {
        $this->songs = new ArrayCollection();
        $this->followers = new ArrayCollection();
        $this->artistPayouts = new ArrayCollection();
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

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): self
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get the value of file
     */
    public function getFile(): ?File
    {
        return $this->file;
    }

    /**
     * Set the value of file
     *
     * @return  self
     */
    public function setFile(?File $file): self
    {
        $this->file = $file;

        if ($file instanceof UploadedFile) {
            $this->setImageUpdatedAt(new DateTime());
        }

        return $this;
    }

    /**
     * Get the value of imageUpdatedAt
     *
     * @return  DateTime
     */
    public function getImageUpdatedAt(): ?DateTime
    {
        return $this->imageUpdatedAt;
    }

    /**
     * Set the value of imageUpdatedAt
     *
     * @param  DateTime  $imageUpdatedAt
     *
     * @return  self
     */
    public function setImageUpdatedAt(DateTime $imageUpdatedAt): self
    {
        $this->imageUpdatedAt = $imageUpdatedAt;

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
            $song->setAuthor($this);
        }

        return $this;
    }

    public function removeSong(Song $song): self
    {
        if ($this->songs->removeElement($song)) {
            // set the owning side to null (unless already changed)
            if ($song->getAuthor() === $this) {
                $song->setAuthor(null);
            }
        }

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

    public function getNbSongs(): ?int
    {
        return $this->nbSongs;
    }

    public function setNbSongs(int $nbSongs): self
    {
        $this->nbSongs = $nbSongs;

        return $this;
    }

    public function incrementNbSong(): self
    {
        $this->nbSongs++;

        return $this;
    }

    public function decrementNbSong(): self
    {
        $this->nbSongs--;

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
            $follower->addSubscribe($this);
        }

        return $this;
    }

    public function removeFollower(User $follower): self
    {
        if ($this->followers->removeElement($follower)) {
            $follower->removeSubscribe($this);
        }

        return $this;
    }

    public function getNbFollowers(): ?int
    {
        return $this->nbFollowers;
    }

    public function setNbFollowers(int $nbFollowers): self
    {
        $this->nbFollowers = $nbFollowers;

        return $this;
    }

    public function incrementNbFollowers(): self
    {
        $this->nbFollowers++;

        return $this;
    }

    public function decrementNbFollowers(): self
    {
        $this->nbFollowers--;

        return $this;
    }

    /**
     * @return Collection|ArtistPayout[]
     */
    public function getArtistPayouts(): Collection
    {
        return $this->artistPayouts;
    }

    public function addArtistPayout(ArtistPayout $artistPayout): self
    {
        if (!$this->artistPayouts->contains($artistPayout)) {
            $this->artistPayouts[] = $artistPayout;
            $artistPayout->setArtist($this);
        }

        return $this;
    }

    public function removeArtistPayout(ArtistPayout $artistPayout): self
    {
        if ($this->artistPayouts->removeElement($artistPayout)) {
            // set the owning side to null (unless already changed)
            if ($artistPayout->getArtist() === $this) {
                $artistPayout->setArtist(null);
            }
        }

        return $this;
    }
}
