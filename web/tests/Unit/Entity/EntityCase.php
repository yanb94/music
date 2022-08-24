<?php

namespace App\Tests\Unit\Entity;

use Symfony\Component\Validator\Validation;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Validator\ContainerConstraintValidatorFactory;

class EntityCase extends KernelTestCase
{
    public function assertHasErrors(object $entity, int $nbErrors = 0, $groups = null)
    {
        self::bootKernel();

        $validator = Validation::createValidatorBuilder()
            ->enableAnnotationMapping(true)
            ->addDefaultDoctrineAnnotationReader()
            ->setConstraintValidatorFactory(new ContainerConstraintValidatorFactory(self::$container))
            ->getValidator();

        $errors = $validator->validate($entity, null, $groups);
        $messages = [];
        /** @var ConstraintViolation $error */
        foreach ($errors as $error) {
            $messages[] = $error->getPropertyPath() . ' => ' . $error->getMessage();
        }
        $this->assertCount($nbErrors, $errors, implode(', ', $messages));
    }
}
