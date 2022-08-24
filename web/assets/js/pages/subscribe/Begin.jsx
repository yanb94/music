import React,{ useState } from 'react'
import Button from '@app/module/button/Button'
import { useAuth } from '@app/auth/auth'
import CheckBox from './CheckBox'
import { processPayement } from './processForm';
import Header from '@app/module/header/Header';

export default function Begin({setIsError, setIsLoading})
{
    const {auth, logout} = useAuth()

    const onSubmit = async () => {
        if(!isValid) return

        setIsLoading(true)

        const result = await processPayement(auth.token)

        switch (result) {
            case 401:
                logout()
                break;
            case "error":
                setIsError(true)
                setIsLoading(false)
                break;
            default:
                window.location.replace(result['checkout_url'])
                break;
        }
    }

    const [isValid, setIsValid] = useState(false)

    return <>
        <Header
            title="Souscrire"
            description="Souscrire"
        />
        <div className="subscribe-page--head--content--container--title subscribe-page--begin">
            Souscrire
        </div>
        <hr className="subscribe-page--separator" />
        <div className="subscribe-page--price">15.99€</div>
        <div className="subscribe-page--price-info">par mois HT</div>
        <div className="subscribe-page--tva">TVA selon localisation</div>
        <div className="subscribe-page--checkbox">
            <CheckBox label="J'accepte les conditions générale de souscription" name="confirm" setValid={setIsValid} />
        </div>
        <hr className="subscribe-page--separator" />
        <div className="subscribe-page--button-cont">
            <Button theme="secondary" className="subscribe-page--button" type="button" disabled={!isValid} onClick={() => onSubmit()}> Procéder au paiement </Button>
        </div>
    </>
}