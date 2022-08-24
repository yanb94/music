import FormBuilder from '@app/form/formBuilder/FormBuilder'
import React, {useEffect, useState} from 'react'
import "./EditArtist.scss"
import formFields from './formConfig'
import schemaValidation from './validation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '@app/auth/auth'
import { getInitialData, sendRequest, hasError } from './processForm'
import Header from '@app/module/header/Header'

export default function EditArtist({openNotification})
{
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const [isRedirect, setIsRedirect] = useState(false)
    const [isSendError, setIsSendError] = useState(false)

    const [defaultImage, setDefaultImage] = useState(null)
    const [idArtist, setIdArtist] = useState(null)

    const {auth, logout} =  useAuth();

    const formParams = useForm({
        resolver: yupResolver(schemaValidation),
        mode: "onChange",
    });

    const { setValue, setError } = formParams

    const initDefaultImage = () => {
        const imageLabel = document.getElementById('label-image-image');
        if(imageLabel != null)
        {
            imageLabel.style.setProperty('--backgroundBefore','url('+defaultImage+')')
            imageLabel.style.setProperty('--afterContent', ' ')
        }
    }

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
                Object.keys(initialValue).map((value) => ['contentUrl','id'].includes(value) ? "" : setValue(value, initialValue[value]))
                setIdArtist(initialValue['slug'])
                setDefaultImage(initialValue['contentUrl'])
                break;
        }
        setIsLoading(false);
    },[])

    useEffect(() => {
        initDefaultImage()
    },[isLoading])

    const onSubmit = async (data) => {
        setIsSendError(false);
        const result = await sendRequest(idArtist,auth.token,data)

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
    }

    return <>
        <Header
            title="Modifier mes infos d'artiste"
            description="Modifier mes infos d'artiste"
        />
        <FormBuilder
            formClass='edit-artist'
            formFields={formFields}
            onSubmit={onSubmit}
            title="Modifier mes infos d'artiste"
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