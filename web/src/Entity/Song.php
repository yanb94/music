<?php

namespace App\Entity;

use DateTimeImmutable;
use App\Attribute\Blaemable;
use App\Entity\ViewSongDaily;
use App\Entity\ViewSong;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\SongRepository;
use App\Controller\MySongsController;
use App\Controller\PutSongController;
use Gedmo\Mapping\Annotation as Gedmo;
use ApiPlatform\Core\Annotation\ApiFilter;
use App\Controller\SimilarsSongsController;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\AutocompleteSongsController;
use Symfony\Component\HttpFoundation\File\File;
use Doctrine\Common\Collections\ArrayCollection;
use App\Controller\SongOfFollowedArtistsController;
use Symfony\Component\Serializer\Annotation\Groups;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;

/**
 * @ORM\Entity(repositoryClass=SongRepository::class)
 * @Vich\Uploadable
 * @ORM\HasLifecycleCallbacks()
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
            "controller" => PutSongController::class,
            "security" => "object.getAuthor().getUser() == user",
            'denormalization_context' => ['groups' => ['put']],
            "validation_groups" => ['put'],
            'input_formats' => [
                'multipart' => ['multipart/form-data'],
            ],
        ],
        "delete" => [
            "security" => "object.getAuthor().getUser() == user"
        ]
    ],
    collectionOperations: [
        "get",
        "post" => [
            'denormalization_context' => ['groups' => ['post']],
            "security" => "is_granted('ROLE_USER') && user.getArtist() != null",
            "validation_groups" => ['post'],
            'input_formats' => [
                'multipart' => ['multipart/form-data'],
            ],
        ],
        "my_songs" => [
            "method" => "GET",
            'path' => "/songs/my_songs",
            'controller' => MySongsController::class,
            "security" => "is_granted('ROLE_USER') && user.getArtist() != null",
            'openapi_context' => [
                'summary' => 'Get my songs'
            ],
        ],
        "autocomplete_song" => [
            "method" => "GET",
            'path' => "/songs/autocomplete",
            'controller' => AutocompleteSongsController::class,
            'openapi_context' => [
                'summary' => 'Get songs depending of keywords'
            ],
        ],
        "similar" => [
            "method" => "GET",
            'path' => "/songs/similar/{slug}",
            'controller' => SimilarsSongsController::class,
            'openapi_context' => [
                'summary' => 'Get similars songs'
            ],
        ],
        "songs_from_followed_artists" => [
            "method" => "GET",
            'path' => "/songs/song-of-followed-artists",
            'security' => "is_granted('ROLE_USER')",
            'controller' => SongOfFollowedArtistsController::class,
            'openapi_context' => [
                'summary' => 'Get similars songs'
            ],
        ]

    ],
    order: ['createdAt' => 'DESC'],
    subresourceOperations: [
        'api_playlist_song_get_subresource' => [
            'method' => 'GET',
            'normalization_context' => [
                'groups' => ['get'],
            ],
        ],
        'api_artist_song_get_subresource' => [
            'method' => 'GET',
            'normalization_context' => [
                'groups' => ['get'],
            ],
            'openapi_context' => [
                'summary' => 'Get songs by artists'
            ],
        ],
    ]
),
    ApiFilter(OrderFilter::class, properties: ['createdAt'], arguments: ['orderParameterName' => 'order'])
]
class Song
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
            message: "Le nom de la chanson ne doit pas contenir de caractères spéciaux",
            match: true,
            groups: ['post', 'put']
        ),
        Groups(['post','put','get'])
    ]
    private $name;

    /**
     * @ORM\Column(type="datetime_immutable")
     * @Gedmo\Timestampable(on="create")
     */
    #[
        Groups(['get'])
    ]
    private $createdAt;

    /**
     * @ORM\ManyToOne(targetEntity=Artist::class, inversedBy="songs")
     * @ORM\JoinColumn(nullable=false)
     */
    #[
        Blaemable(property: "artist"),
        Groups(['get'])
    ]
    private $author;

    /**
     * @Vich\UploadableField(mapping="song_image", fileNameProperty="imageName")
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
     *
     * @var string|null
     */
    private ?string $imageName;

    /**
     * @Vich\UploadableField(mapping="song_song", fileNameProperty="songName")
     *
     * @var File|null
     */
    #[
        Assert\NotBlank(groups: ['post']),
        Assert\File(
            mimeTypes: ['audio/mpeg'],
            maxSize: '10M',
            groups: ['post']
        ),
        Groups(['post'])
    ]
    private ?File $songFile = null;

    /**
     * @ORM\Column(type="string")
     *
     * @var string|null
     */
    private ?string $songName;

    #[
        ApiProperty(iri: 'http://schema.org/contentUrl'),
        Groups(['get'])
    ]
    public ?string $contentImageUrl = null;

    #[
        Groups(['get'])
    ]
    public array $contentImageResponsive = [];

    #[
        ApiProperty(iri: 'http://schema.org/contentUrl'),
        Groups(['subscriber','author'])
    ]
    public ?string $contentSongUrl = null;

    /**
     * @ORM\Column(type="datetime_immutable", nullable=true)
     */
    private $imageUpdatedAt;

    /**
     * @ORM\Column(type="float")
     */
    #[
        Groups(['get'])
    ]
    private float $songDuration;

    /**
     * @ORM\ManyToMany(targetEntity=Playlist::class, mappedBy="songs")
     */
    private $playlists;

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
    private $nbViews = 0;

    /**
     * @ORM\OneToMany(targetEntity=ViewSongDaily::class, mappedBy="song",orphanRemoval=true)
     *
     */
    private $viewsSongDaily;

    /**
     * @ORM\OneToMany(targetEntity=ViewSong::class, mappedBy="song", orphanRemoval=true)
     *
     */
    private $viewsSong;

    public function __construct()
    {
        $this->playlists = new ArrayCollection();
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

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getAuthor(): ?Artist
    {
        return $this->author;
    }

    public function setAuthor(?Artist $author): self
    {
        $this->author = $author;

        if ($author != null) {
            $this->incrementNbSongForAuthor();
        }

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

        $this->setImageUpdatedAt(new DateTimeImmutable());

        return $this;
    }

    public function getSongFile(): ?File
    {
        return $this->songFile;
    }

    public function setSongFile(?File $songFile)
    {
        $this->songFile = $songFile;

        return $this;
    }

    public function getSongName(): ?string
    {
        return $this->songName;
    }

    public function setSongName(?string $songName): self
    {
        $this->songName = $songName;

        return $this;
    }

    public function getImageUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->imageUpdatedAt;
    }

    public function setImageUpdatedAt(?\DateTimeImmutable $imageUpdatedAt): self
    {
        $this->imageUpdatedAt = $imageUpdatedAt;

        return $this;
    }

    public function getSongDuration(): ?float
    {
        return $this->songDuration;
    }

    public function setSongDuration(float $songDuration): self
    {
        $this->songDuration = $songDuration;

        return $this;
    }

    /**
     * @return Collection|Playlist[]
     */
    public function getPlaylists(): Collection
    {
        return $this->playlists;
    }

    public function addPlaylist(Playlist $playlist): self
    {
        if (!$this->playlists->contains($playlist)) {
            $this->playlists[] = $playlist;
            $playlist->addSong($this);
        }

        return $this;
    }

    public function removePlaylist(Playlist $playlist): self
    {
        if ($this->playlists->removeElement($playlist)) {
            $playlist->removeSong($this);
        }

        return $this;
    }

    /**
     * @ORM\PreRemove
     */
    public function decrementPlaylistNbSongs()
    {
        /** @var Playlist */
        foreach ($this->playlists as $playlist) {
            $playlist->decrementNbSongs();
        }
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


    public function incrementNbSongForAuthor(): self
    {
        $this->author->incrementNbSong();

        return $this;
    }

     /**
     * @ORM\PreRemove
     */
    public function decrementNbSongForAuthor(): self
    {
        $this->author->decrementNbSong();

        return $this;
    }
}
