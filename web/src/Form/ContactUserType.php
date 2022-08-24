<?php

namespace App\Form;

use FOS\CKEditorBundle\Form\Type\CKEditorType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;

class ContactUserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('object', TextType::class, [
                "label" => "Objet",
                "constraints" => [
                    new NotBlank(message: "Vous devez indiquer un objet"),
                    new Length(
                        min: 2,
                        max: 50,
                        minMessage: "L'objet du message doit faire au moins {{ limit }} caractères",
                        maxMessage: "L'objet du message ne dois pas dépasser les {{ limit }} caractères"
                    )
                ]
            ])
            ->add('message', CKEditorType::class, [
                "label" => "Message",
                "attr" => [
                    "rows" => 10
                ],
                "constraints" => [
                    new NotBlank(message: "Vous devez indiquer un message"),
                    new Length(
                        min: 2,
                        max: 10000,
                        minMessage: "Votre message doit faire au moins {{ limit }} caractères",
                        maxMessage: "Votre message ne dois pas dépasser les {{ limit }} caractères"
                    )
                ]
            ])
            ->add('submit', SubmitType::class, [
                "label" => "Envoyer"
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            // Configure your form options here
        ]);
    }
}
