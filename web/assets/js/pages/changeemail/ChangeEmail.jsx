import React, {useState} from "react"
import "./ChangeEmail.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import schemaValidation from "./validation"
import {useAuth} from "@app/auth/auth"
import { hasError, sendRequest } from "./processForm";
import FormBuilder from "@app/form/formBuilder/FormBuilder";
import formFields from "./formConfig";
import Header from "@app/module/header/Header";

export default function ChangeEmail({openNotification})
{
    const [isRedirect, setIsRedirect] = useState(false)
    const [isSendError, setIsSendError] = useState(false)
    const {auth, logout} = useAuth() 

    const formParams = useForm({
        resolver: yupResolver(schemaValidation),
        mode: "onChange",
    });

    const {setError} = formParams;

    const onSubmit = async (data) => {
        setIsSendError(false);
        const result = await sendRequest(auth.id,auth.token,data);

        switch (result) {
            case "ok":
                openNotification("Votre demande de changement d'email a bien été effecuté vous allez bientôt recevoir un mail de confirmation a votre nouvelle adresse")
                setIsRedirect(true)
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
            title="Changer d'email"
            description="Changer d'email"
        />
        <FormBuilder
            formClass="change-email"
            formFields={formFields}
            onSubmit={onSubmit}
            title="Changer d'email"
            buttonLabel="Modifier"
            isRedirect={isRedirect}
            isSendError={isSendError}
            redirectTarget="/space-member"
            formParams={formParams}
            errorServorMsg="Une erreur du serveur n'a pas permis a votre requête d'être traité. Veuillez réessayer ultérieurement."
        />
    </>
}