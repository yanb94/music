import React, {useState, useEffect} from 'react'
import FormBuilder from '@app/form/formBuilder/FormBuilder'
import formFields from './formConfig'
import { processForm, hasError, getInitialData } from './processForm'
import { useForm } from "react-hook-form";
import { useAuth } from '@app/auth/auth'
import { yupResolver } from '@hookform/resolvers/yup';
import schemaValidation from './validation';
import { useParams } from 'react-router-dom';
import './EditSong.scss';
import Header from '@app/module/header/Header'


export default function EditSong({openNotification}){
    
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const [isRedirect, setIsRedirect] = useState(false)
    const [isSendError, setIsSendError] = useState(false)
    const {auth, logout} = useAuth()

    const [defaultImage, setDefaultImage] = useState(null)

    const {id} = useParams()

    const formParams = useForm({
        resolver: yupResolver(schemaValidation),
        mode: "onChange",
    });

    const {setError, setValue} = formParams;

    const initDefaultImage = () => {
        const imageLabel = document.getElementById('label-image-imageFile');
        if(imageLabel != null)
        {
            imageLabel.style.setProperty('--backgroundBefore','url('+defaultImage+')')
            imageLabel.style.setProperty('--afterContent', ' ')
        }
    }

    const onSubmit = async(data) => {
        setIsSendError(false);
        const result = await processForm(id,data,auth.token)
        switch (result) {
            case "ok":
                openNotification("Votre chanson a bien été modifié")
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

    useEffect(() => {
        initDefaultImage()
    },[isLoading])

    useEffect(async () => {
        const initialValue = await getInitialData(id,auth.token)
        switch (initialValue) {
            case 401:
                logout()
                break;
            case "error":
                setIsError(true)
                break;
            default:
                Object.keys(initialValue).map((value) => ['name'].includes(value) ? setValue(value, initialValue[value]) : "")
                setDefaultImage(initialValue['contentImageUrl'])
                break;
        }
        setIsLoading(false);
    },[])

    return <>
        <Header
            title="Modifier la chanson"
            description="Modifier la chanson"
        />
        <FormBuilder
            formClass='edit-song'
            formFields={formFields}
            onSubmit={onSubmit}
            title="Modifier la chanson"
            buttonLabel="Éditer"
            isRedirect={isRedirect}
            isSendError={isSendError}
            redirectTarget="/space-member/my-songs"
            formParams={formParams}
            errorServorMsg="Une erreur du serveur n'a pas permis a votre requête d'être traité. Veuillez réessayer ultérieurement."
            previousLink="/space-member/my-songs"
            isErrorLoading={isError}
            isLoading={isLoading}
        />
    </>
}