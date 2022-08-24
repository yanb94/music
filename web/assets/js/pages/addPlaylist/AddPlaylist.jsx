import React,{useState} from 'react'
import './AddPlaylist.scss'
import { useAuth } from '@app/auth/auth';
import { yupResolver } from '@hookform/resolvers/yup';
import schemaValidation from './validation';
import { useForm } from "react-hook-form";
import FormBuilder from '@app/form/formBuilder/FormBuilder'
import formFields from './formConfig'
import { processForm, hasError } from './processForm'
import Header from '@app/module/header/Header';

export default function AddPlaylist({openNotification})
{
    const [isRedirect, setIsRedirect] = useState(false)
    const [isSendError, setIsSendError] = useState(false)
    const {auth, logout} = useAuth()

    const formParams = useForm({
        resolver: yupResolver(schemaValidation),
        mode: "onChange",
    });

    const {setError} = formParams;

    const onSubmit = async(data) => { 
        setIsSendError(false);
        const result = await processForm(data,auth.token)

        switch (result) {
            case "ok":
                openNotification("Votre playlist a bien été ajouté")
                setIsRedirect(true)
                break;
            case 401:
                logout()
                break;
            case "error":
                setIsSendError(true);
                break;
            default:
                hasError(result['violations'],setError)
                break;
        }
    };

    return <>
        <Header
            title="Ajouter une playlist"
            description="Ajouter une playlist"
        />
        <FormBuilder
            formClass='add-playlist'
            formFields={formFields}
            onSubmit={onSubmit}
            title="Ajouter une playlist"
            buttonLabel="Ajouter"
            isRedirect={isRedirect}
            isSendError={isSendError}
            redirectTarget="/space-member/my-playlists"
            formParams={formParams}
            errorServorMsg="Une erreur du serveur n'a pas permis a votre requête d'être traité. Veuillez réessayer ultérieurement."
            previousLink="/space-member/my-playlists"
        />
    </>
}