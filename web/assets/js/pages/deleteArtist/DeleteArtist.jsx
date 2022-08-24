import FormBuilder from '@app/form/formBuilder/FormBuilder'
import React, {useEffect, useState} from 'react'
import "./DeleteArtist.scss"
import { useAuth } from '@app/auth/auth';
import { useForm } from 'react-hook-form';
import { getInitialData, sendRequest, hasError } from './processForm';
import { yupResolver } from '@hookform/resolvers/yup';
import schemaValidation from './validation';
import Header from '@app/module/header/Header';

export default function DeleteArtist({openNotification})
{
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const [isRedirect, setIsRedirect] = useState(false)
    const [isSendError, setIsSendError] = useState(false)

    const [idArtist, setIdArtist] = useState(null)

    const {auth, logout, updateAuth} =  useAuth();

    const formParams = useForm({
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            id: null
        },
        resolver: yupResolver(schemaValidation)
    });

    const { setError } = formParams

    const onSubmit = async (data) => {
        setIsSendError(false);
        const result = await sendRequest(idArtist,auth.token,data)

        switch(result){
            case "ok":
                auth.artist = false;
                updateAuth(auth)
                setIsRedirect(true)
                openNotification("Votre profil d'artiste a bien été supprimé")
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

    useEffect(async () => {
        const initialValue = await getInitialData(auth.id,auth.token)
        switch (initialValue) {
            case 401:
                logout()
                break;
            case "error":
                setIsError(true)
                break;
            default:
                formParams.setValue("id",initialValue['id'])
                setIdArtist(initialValue['slug'])
                break;
        }
        setIsLoading(false);
    },[])

    return <>
        <Header
            title="Supprimer mon profil d'artiste"
            description="Supprimer mon profil d'artiste"
        />
        <FormBuilder
            formClass='delete-artist'
            formFields={[]}
            onSubmit={onSubmit}
            title="Supprimer mon profil d'artiste"
            buttonLabel="Supprimer"
            isRedirect={isRedirect}
            isSendError={isSendError}
            redirectTarget="/space-member"
            formParams={formParams}
            errorServorMsg="Une erreur du serveur n'a pas permis a votre requête d'être traité. Veuillez réessayer ultérieurement."
            isErrorLoading={isError}
            isLoading={isLoading}
            mustBeValid={false}
            errorsToListen={['id']}
        />
    </>
}