import React, { useEffect, useState } from 'react'
import './EditInfo.scss'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '@app/auth/auth';
import schemaValidation from './validation';
import { getInitialData, hasError, sendRequest } from './processForm';
import FormBuilder from '@app/form/formBuilder/FormBuilder';
import formFields from './formConfig';
import Header from '@app/module/header/Header'

export default function EditInfo({openNotification}){

    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isSendError, setIsSendError] = useState(false);
    const [isRedirect, setIsRedirect] = useState(false)
    const {auth, logout} = useAuth();

    const formParams = useForm({
        resolver: yupResolver(schemaValidation),
        mode: "onChange",
    })

    const { setValue, setError } = formParams

    useEffect(async () => {
        const initialValue = await getInitialData(auth.id,auth.token);
        switch (initialValue) {
            case 401:
                logout()
                break;
            case "error":
                setIsError(true)
                break;
            default:
                ["firstname","lastname","sexe","birthday"].map((value) => setValue(value, initialValue[value]))
                break;
        }
        setIsLoading(false);
    },[])

    const onSubmit = async (data) => {
        setIsSendError(false);
        const result = await sendRequest(auth.id,auth.token,data)

        switch(result){
            case "ok":
                setIsRedirect(true)
                openNotification("Vos informations ont bien été modifiées")
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
    };

    return <>
        <Header
            title="Modfier vos informations"
            description="Modifier vos informations"
        />
        <FormBuilder
            formClass="edit-info"
            formFields={formFields}
            onSubmit={onSubmit}
            title="Modifier mes informations"
            buttonLabel="Modifier"
            isRedirect={isRedirect}
            isSendError={isSendError}
            redirectTarget="/space-member"
            formParams={formParams}
            errorServorMsg="Une erreur du serveur n'a pas permis a votre requête d'être traité. Veuillez réessayer ultérieurement."
            isErrorLoading={isError}
            isLoading={isLoading}
        />
    </>
}