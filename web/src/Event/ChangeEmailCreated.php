<?php

namespace App\Event;

use App\Entity\ChangeEmail;

class ChangeEmailCreated
{
    public function __construct(private ChangeEmail $changeEmail)
    {
    }

    /**
     * Get the value of changeEmail
     */
    public function getChangeEmail(): ChangeEmail
    {
        return $this->changeEmail;
    }

    /**
     * Set the value of changeEmail
     *
     * @return  self
     */
    public function setChangeEmail($changeEmail): self
    {
        $this->changeEmail = $changeEmail;

        return $this;
    }
}
