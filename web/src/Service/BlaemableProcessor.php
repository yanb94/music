<?php

namespace App\Service;

use App\Entity\User;
use ReflectionClass;
use App\Attribute\Blaemable;

class BlaemableProcessor
{
    public function process(object $entity, User $user)
    {
        $reflection = new ReflectionClass($entity);

        $properties = $reflection->getProperties();

        foreach ($properties as $property) {
            $attributes = $property->getAttributes(Blaemable::class);

            if (!empty($attributes)) {
                foreach ($attributes as $attribute) {
                    $field = $attribute->getArguments()['property'];

                    if ($field == null) {
                        $propertyAccessor = "set" . ucfirst($property->name);
                        $entity->$propertyAccessor($user);
                        continue;
                    }

                    $propertyAccessorUser = "get" . ucfirst($field);
                    $object = $user->$propertyAccessorUser();

                    $propertyAccessorEntity = "set" . ucfirst($property->name);
                    $entity->$propertyAccessorEntity($object);
                }
            }
        }
    }
}
