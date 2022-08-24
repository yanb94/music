<?php

namespace App\Model;

use Symfony\Component\Validator\Constraints as Assert;

class ContactMessage
{
    #[
        Assert\NotBlank(),
        Assert\Length(min: 2, max: 50),
        Assert\Regex(
            pattern: "/^[ a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`'\-]+$/",
            message: "Votre prénom ne doit pas contenir de caractères spéciaux",
            match: true
        )
    ]
    private string $firstname;

    #[
        Assert\NotBlank(),
        Assert\Length(min: 2, max: 50),
        Assert\Regex(
            pattern: "/^[ a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`'\-]+$/",
            message: "Votre nom de famille ne doit pas contenir de caractères spéciaux",
            match: true
        ),
    ]
    private string $lastname;

    #[
        Assert\NotBlank(),
        Assert\Email(),
    ]
    private string $email;

    #[
        Assert\NotBlank(),
        Assert\Length(min: 10, max: 400),
    ]
    private string $message;

    /**
     * Get the value of firstname
     */
    public function getFirstname(): string
    {
        return $this->firstname;
    }

    /**
     * Set the value of firstname
     *
     * @return  self
     */
    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    /**
     * Get the value of lastname
     */
    public function getLastname(): string
    {
        return $this->lastname;
    }

    /**
     * Set the value of lastname
     *
     * @return  self
     */
    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    /**
     * Get the value of email
     */
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * Set the value of email
     *
     * @return  self
     */
    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * Get the value of message
     */
    public function getMessage(): string
    {
        return $this->message;
    }

    /**
     * Set the value of message
     *
     * @return  self
     */
    public function setMessage(string $message): self
    {
        $this->message = $message;

        return $this;
    }
}
