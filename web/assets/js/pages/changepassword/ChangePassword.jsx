import React, { useState } from "react"
import "./ChangePassword.scss"
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import schemaValidation from "./validation"
import { useAuth } from '@app/auth/auth';
import { sendRequest, hasError } from "./processForm";
import FormBuilder from "@app/form/formBuilder/FormBuilder";
import formFields from "./formConfig";
import Header from "@app/module/header/Header";

export default function ChangePassword({openNotification})
{
    const [isRedirect, setIsRedirect] = useState(false)
    const [isSendError, setIsSendError] = useState(false)
    const {auth, logout} = useAuth() 

    const formParams = useForm({
        resolver: yupResolver(schemaValidation),
        mode: "onChange",
    })

    const {setError} = formParams;

    const onSubmit = async (data) => {
        setIsSendError(false);
        const result = await sendRequest(auth.id,auth.token,data)

        switch (result) {
            case "ok":
                openNotification("Votre mot de passe a bien été modifié.")
                setIsRedirect(true);
                break;
            case 401:
                logout()
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
            title="Modifier votre mot de passe"
            description="Modifier votre mot de passe"
        />
        <FormBuilder
            formClass="change-password"
            formFields={formFields}
            onSubmit={onSubmit}
            title="Changer de mot de passe"
            buttonLabel="Modifier"
            isRedirect={isRedirect}
            isSendError={isSendError}
            redirectTarget="/space-member"
            formParams={formParams}
            errorServorMsg="Une erreur du serveur n'a pas permis a votre requête d'être traité. Veuillez réessayer ultérieurement."
        />
    </>
}