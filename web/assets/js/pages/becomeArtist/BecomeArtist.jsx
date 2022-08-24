import React, {useState} from 'react'
import "./BecomeArtist.scss"
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '@app/auth/auth';
import schemaValidation from './validation';
import { hasError, processForm } from './processForm';
import FormBuilder from '@app/form/formBuilder/FormBuilder';
import formFields from './formConfig';
import Header from '@app/module/header/Header';

export default function BecomeArtist({openNotification})
{
    const [isRedirect, setIsRedirect] = useState(false)
    const [isSendError, setIsSendError] = useState(false)
    const {auth, logout, updateAuth} = useAuth() 

    const formParams = useForm({
        resolver: yupResolver(schemaValidation),
        mode: "onChange",
    });

    const {setError} = formParams;

    const onSubmit = async (data) => {
        setIsSendError(false);
        const result = await processForm(auth.id,data,auth.token)

        switch (result) {
            case "ok":
                openNotification("Vous êtes désormais inscrit en tant qu'artiste")
                auth.artist = true;
                updateAuth(auth)
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
    }

    return <>
        <Header
            title="Devenir artiste sur Song"
            description="Devenir artiste sur Song"
        />
        <FormBuilder
            formClass='become-artist'
            formFields={formFields}
            onSubmit={onSubmit}
            title="Devenir artiste sur Song"
            buttonLabel="Débuter"
            isRedirect={isRedirect}
            isSendError={isSendError}
            redirectTarget="/space-member"
            formParams={formParams}
            errorServorMsg="Une erreur du serveur n'a pas permis a votre requête d'être traité. Veuillez réessayer ultérieurement."
            errorsToListen={['user']}
        />
    </>;
}