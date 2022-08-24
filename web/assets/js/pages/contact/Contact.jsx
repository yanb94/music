import FormBuilder from '@app/form/formBuilder/FormBuilder';
import React, { useState } from 'react'
import "./Contact.scss";
import { useForm } from 'react-hook-form';
import formFields from './formConfig';
import { sendRequest, hasError } from './processForm';
import { yupResolver } from '@hookform/resolvers/yup';
import schemaValidation from './validation';
import Header from '@app/module/header/Header';
import image from '../../../image/contact-head.jpg';

export default function Contact()
{
    const [isRedirect, setIsRedirect] = useState(false);
    const [isSendError, setIsSendError] = useState(false)

    const formParams = useForm({
        resolver: yupResolver(schemaValidation),
        mode: "onChange",
    })

    const { setError } = formParams

    const onSubmit = async (data) => {
        setIsSendError(false)
        const result = await sendRequest(data)

        switch(result){
            case "ok":
                setIsRedirect(true)
                break;
            case "error":
                setIsSendError(true)
                break;
            default:
                hasError(result['violations'],setError)
                break;
        }
    }

    return <>
        <Header
            title="Nous contacter - Song"
            description="Contacter l'équipe de Song via notre formulaire de contact"
            ogOption={{
                image: image
            }}
            twitterOption={{
                image: image
            }}
        />
        <FormBuilder
            formClass="contact"
            formFields={formFields}
            onSubmit={onSubmit}
            title="Nous contacter"
            buttonLabel="Envoyer"
            isRedirect={isRedirect}
            isSendError={isSendError}
            redirectTarget="/contact/confirmed"
            formParams={formParams}
            errorServorMsg="Une erreur du serveur n'a pas permis a votre requête d'être traité. Veuillez réessayer ultérieurement."
        />
    </>
}