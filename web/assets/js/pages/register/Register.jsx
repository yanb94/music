import React, { useState } from "react"
import "./Register.scss";

import schemaValidation from "./validation";
import { hasError, sendRequest } from "./processForm";

import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import FormBuilder from "@app/form/formBuilder/FormBuilder";
import formFields from "./formConfig";
import Header from "@app/module/header/Header";
import image from '../../../image/register-head.jpg'

export default function Register()
{
    const [isRedirect, setIsRedirect] = useState(false);
    const [isSendError, setIsSendError] = useState(false)

    const formParams = useForm({
        resolver: yupResolver(schemaValidation),
        mode: "onChange"
    })

    const { setError } = formParams

    const onSubmit = async (data) => {
        const result = await sendRequest(data);

        switch (result) {
            case "ok":
                setIsRedirect(true);
                break;
            case "error":
                setIsSendError(true)
                break;
            default:
                hasError(result['violations'],setError)
                break;
        }
    };

    return <div className="register">
        <Header
            title="S'inscrire - Song"
            description="Rejoignez-nous sur Song la plateforme des passionés de musique"
            ogOption={{
                image: image
            }}
            twitterOption={{
                image: image
            }}
        />
        <FormBuilder
            formClass="register"
            formFields={formFields}
            onSubmit={onSubmit}
            title="S'inscrire"
            buttonLabel="S'inscrire"
            isRedirect={isRedirect}
            isSendError={isSendError}
            redirectTarget="/register-to-confirm"
            formParams={formParams}
            errorServorMsg="Une erreur du serveur n'a pas permis a votre requête d'être traité. Veuillez réessayer ultérieurement."
        />
    </div>
}