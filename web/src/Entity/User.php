<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\UserRepository;
use App\Controller\ChangeEmailController;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use App\Controller\ChangePasswordController;
use App\Controller\ConfirmChangeEmailController;
use Doctrine\Common\Collections\ArrayCollection;
use App\Controller\ConfirmRegistrationController;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\Validator\Constraints as SecurityAssert;

/**
 *  @ORM\Entity(repositoryClass=UserRepository::class)
 */
#[
    UniqueEntity(fields: 'username', message: "Ce nom d'utilisateur est déjà utilisé"),
    UniqueEntity(fields: 'email', message: "Cette adresse email est déjà utilisé"),
    ApiResource(
        collectionOperations: [
            "get" => ["security" => "is_granted('ROLE_ADMIN')"],
            "post" => [
                'denormalization_context' => ['groups' => ['post']],
                "security" => "is_granted('IS_AUTHENTICATED_ANONYMOUSLY')",
                "validation_groups" => ['post']
            ]
        ],
        itemOperations: [
            "get" => ["security" => "is_granted('ROLE_ADMIN') or object == user"],
            "patch" => [
                "security" => "object == user",
                'denormalization_context' => ['groups' => ['patch']],
                "validation_groups" => ['patch']
            ],
            "user_confirmation" => [
                'method' => "GET",
                'path' => '/users/{confirmationToken}/confirmation',
                'controller' => ConfirmRegistrationController::class,
                'denormalization_context' => ['groups' => ['confirmation']],
                'normalizationContext' => ["groups" => ['confirmation']],
                'read' => false,
                'openapi_context' => [
                    'summary' => 'Confirm user registration'
                ]
            ],
            "change_password" => [
                'method' => "PUT",
                "security" => "object == user",
                'path' => '/users/{id}/change-password',
                'controller' => ChangePasswordController::class,
                'denormalization_context' => ['groups' => ['changePassword']],
                "validation_groups" => ['changePassword'],
                'openapi_context' => [
                    'summary' => 'Change user password'
                ]
            ],
            "change_email" => [
                'method' => "PUT",
                "security" => "object == user",
                'path' => '/users/{id}/change-email',
                'controller' => ChangeEmailController::class,
                'denormalization_context' => ['groups' => ['changeEmail']],
                "validation_groups" => ['changeEmail'],
                'openapi_context' => [
                    'summary' => 'Change email'
                ]
            ],
            "change_email_confirm" => [
                'method' => "GET",
                'path' => '/users/{token}/confirmation-change-email',
                'controller' => ConfirmChangeEmailController::class,
                'read' => false,
                'openapi_context' => [
                    'summary' => 'Confirm email change'
                ]
            ]

        ],
        normalizationContext: ["groups" => ['read']]
    )
]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     */
    #[
        Assert\NotBlank(groups: ['post']),
        Assert\Length(min: 2, max: 50, groups: ['post']),
        Assert\Regex(
            pattern: "/^[ 0-9a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`'\-]+$/",
            message: "Votre nom d'utilisateur ne doit pas contenir de caractères spéciaux",
            match: true,
            groups: ['post']
        ),
        Groups(["read","post"])
    ]
    private $username;

    /**
     * @ORM\Column(type="json")
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     */

    private $password;

    /**
     * @ORM\Column(type="string", length=255)
     */
    #[
        Assert\NotBlank(groups: ['post','patch']),
        Assert\Length(min: 2, max: 50, groups: ['post','patch']),
        Assert\Regex(
            pattern: "/^[ a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`'\-]+$/",
            message: "Votre nom de famille ne doit pas contenir de caractères spéciaux",
            match: true,
            groups: ['post','patch']
        ),
        Groups(["read","post","patch"])
    ]
    private $lastname;

    /**
     * @ORM\Column(type="string", length=255)
     */
    #[
        Assert\NotBlank(groups: ['post','patch']),
        Assert\Length(min: 2, max: 50, groups: ['post','patch']),
        Assert\Regex(
            pattern: "/^[ a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`'\-]+$/",
            message: "Votre prénom ne doit pas contenir de caractères spéciaux",
            match: true,
            groups: ['post','patch']
        ),
        Groups(["read","post","patch"]),
    ]
    private $firstname;

    /**
     * @ORM\Column(type="string", length=1)
     */
    #[
        Assert\NotBlank(groups: ['post','patch']),
        Assert\Choice(choices: ['f','m'], groups: ['post','patch']),
        Groups(["read","post","patch"])
    ]
    private $sexe;

    /**
     * @ORM\Column(type="string", length=255)
     */
    #[
        Assert\NotBlank(groups: ['post']),
        Assert\Email(groups: ['post']),
        Groups(["read","post","patch"])
    ]
    private $email;

    /**
     * @ORM\Column(type="date")
     */
    #[
        Assert\NotBlank(groups: ['post','patch']),
        Assert\LessThanOrEqual(value: "- 18 years", groups: ['post','patch']),
        Groups(["read","post","patch"])
    ]
    private $birthday;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    #[
        Groups(["confirmation"])
    ]
    private $confirmationToken;

    /**
     * @ORM\Column(type="boolean")
     */
    private $isValidate = false;

    #[
        Assert\NotNull(groups: ['post','changePassword']),
        Assert\Length(min:8, max:20, groups: ['post','changePassword']),
        Groups(["post","changePassword"])
    ]
    private $plainPassword;

    #[
        Groups(["changePassword"])
    ]
    private $oldPassword;

    #[
        Groups(["changeEmail"]),
        Assert\NotNull(groups: ['changeEmail']),
        Assert\NotBlank(groups: ['changeEmail']),
        Assert\Email(groups: ['changeEmail']),
    ]
    private $newEmail;

    /**
     * @ORM\OneToMany(targetEntity=ChangeEmail::class, mappedBy="user", orphanRemoval=true)
     */
    private $changeEmails;

    /**
     * @ORM\OneToOne(targetEntity=Artist::class, mappedBy="user", cascade={"persist", "remove"})
     */
    #[
        ApiSubresource()
    ]
    private $artist;

    /**
     * @ORM\OneToMany(targetEntity=Playlist::class, mappedBy="author", orphanRemoval=true)
     */
    private $playlists;

    /**
     * @ORM\ManyToMany(targetEntity=Artist::class, inversedBy="followers", cascade={"persist"})
     */
    #[
        ApiSubresource
    ]
    private $subscribes;

    /**
     * @ORM\ManyToMany(targetEntity=Playlist::class, inversedBy="followers")
     */
    private $playlistsPinned;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $customerId;

    /**
     * @ORM\Column(type="date", nullable=true)
     */
    private $subscribeUntil;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $subscription;

    /**
     * @ORM\OneToMany(targetEntity=Invoice::class, mappedBy="customer", orphanRemoval=false)
     */
    private $invoices;

    public function __construct()
    {
        if (is_null($this->id) && is_null($this->confirmationToken)) {
            $this->confirmationToken = md5(uniqid("7a,."));
        }
        $this->changeEmails = new ArrayCollection();
        $this->playlists = new ArrayCollection();
        $this->subscribes = new ArrayCollection();
        $this->playlistsPinned = new ArrayCollection();
        $this->invoices = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @deprecated since Symfony 5.3, use getUserIdentifier instead
     */
    public function getUsername(): string
    {
        return (string) $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->username;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * Returning a salt is only needed, if you are not using a modern
     * hashing algorithm (e.g. bcrypt or sodium) in your security.yaml.
     *
     * @see UserInterface
     */
    public function getSalt(): ?string
    {
        return null;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getSexe(): ?string
    {
        return $this->sexe;
    }

    public function setSexe(string $sexe): self
    {
        $this->sexe = $sexe;

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

    public function getBirthday(): ?\DateTimeInterface
    {
        return $this->birthday;
    }

    public function setBirthday(\DateTimeInterface $birthday): self
    {
        $this->birthday = $birthday;

        return $this;
    }

    public function getConfirmationToken(): ?string
    {
        return $this->confirmationToken;
    }

    public function setConfirmationToken(?string $confirmationToken): self
    {
        $this->confirmationToken = $confirmationToken;

        return $this;
    }

    public function getIsValidate(): ?bool
    {
        return $this->isValidate;
    }

    public function setIsValidate(bool $isValidate): self
    {
        $this->isValidate = $isValidate;

        return $this;
    }

    /**
     * Get the value of plainPassword
     */
    public function getPlainPassword(): string
    {
        return $this->plainPassword;
    }

    /**
     * Set the value of plainPassword
     *
     * @return  self
     */
    public function setPlainPassword($plainPassword): self
    {
        $this->plainPassword = $plainPassword;

        return $this;
    }

    /**
     * Get the value of oldPassword
     */
    public function getOldPassword(): string
    {
        return $this->oldPassword;
    }

    /**
     * Set the value of oldPassword
     *
     * @return  self
     */
    public function setOldPassword($oldPassword): self
    {
        $this->oldPassword = $oldPassword;

        return $this;
    }

    /**
     * Get the value of newEmail
     */
    public function getNewEmail(): string
    {
        return $this->newEmail;
    }

    /**
     * Set the value of newEmail
     *
     * @return  self
     */
    public function setNewEmail($newEmail): self
    {
        $this->newEmail = $newEmail;

        return $this;
    }

    /**
     * @return Collection|ChangeEmail[]
     */
    public function getChangeEmails(): Collection
    {
        return $this->changeEmails;
    }

    public function addChangeEmail(ChangeEmail $changeEmail): self
    {
        if (!$this->changeEmails->contains($changeEmail)) {
            $this->changeEmails[] = $changeEmail;
            $changeEmail->setUser($this);
        }

        return $this;
    }

    public function removeChangeEmail(ChangeEmail $changeEmail): self
    {
        if ($this->changeEmails->removeElement($changeEmail)) {
            // set the owning side to null (unless already changed)
            if ($changeEmail->getUser() === $this) {
                $changeEmail->setUser(null);
            }
        }

        return $this;
    }

    public function getArtist(): ?Artist
    {
        return $this->artist;
    }

    public function setArtist(Artist $artist): self
    {
        // set the owning side of the relation if necessary
        if ($artist->getUser() !== $this) {
            $artist->setUser($this);
        }

        $this->artist = $artist;

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
            $playlist->setAuthor($this);
        }

        return $this;
    }

    public function removePlaylist(Playlist $playlist): self
    {
        if ($this->playlists->removeElement($playlist)) {
            // set the owning side to null (unless already changed)
            if ($playlist->getAuthor() === $this) {
                $playlist->setAuthor(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Artist[]
     */
    public function getSubscribes(): Collection
    {
        return $this->subscribes;
    }

    public function addSubscribe(Artist $subscribe): self
    {
        if (!$this->subscribes->contains($subscribe)) {
            $this->subscribes[] = $subscribe;
        }

        return $this;
    }

    public function removeSubscribe(Artist $subscribe): self
    {
        $this->subscribes->removeElement($subscribe);

        return $this;
    }

    /**
     * @return Collection|Playlist[]
     */
    public function getPlaylistsPinned(): Collection
    {
        return $this->playlistsPinned;
    }

    public function addPlaylistsPinned(Playlist $playlistsPinned): self
    {
        if (!$this->playlistsPinned->contains($playlistsPinned)) {
            $this->playlistsPinned[] = $playlistsPinned;
        }

        return $this;
    }

    public function removePlaylistsPinned(Playlist $playlistsPinned): self
    {
        $this->playlistsPinned->removeElement($playlistsPinned);

        return $this;
    }

    public function getCustomerId(): ?string
    {
        return $this->customerId;
    }

    public function setCustomerId(?string $customerId): self
    {
        $this->customerId = $customerId;

        return $this;
    }

    public function getSubscribeUntil(): ?\DateTimeInterface
    {
        return $this->subscribeUntil;
    }

    public function setSubscribeUntil(?\DateTimeInterface $subscribeUntil): self
    {
        $this->subscribeUntil = $subscribeUntil;

        return $this;
    }

    public function getSubscription(): ?string
    {
        return $this->subscription;
    }

    public function setSubscription(?string $subscription): self
    {
        $this->subscription = $subscription;

        return $this;
    }

    /**
     * @return Collection|Invoice[]
     */
    public function getInvoices(): Collection
    {
        return $this->invoices;
    }

    public function addInvoice(Invoice $invoice): self
    {
        if (!$this->invoices->contains($invoice)) {
            $this->invoices[] = $invoice;
            $invoice->setCustomer($this);
        }

        return $this;
    }

    public function removeInvoice(Invoice $invoice): self
    {
        if ($this->invoices->removeElement($invoice)) {
            // set the owning side to null (unless already changed)
            if ($invoice->getCustomer() === $this) {
                $invoice->setCustomer(null);
            }
        }

        return $this;
    }
}
