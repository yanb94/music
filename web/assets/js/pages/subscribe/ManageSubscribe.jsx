import React,{useEffect, useState} from 'react'
import Button from '@app/module/button/Button'
import { getSubscriptionInfo, pauseSubscription, cancelSubscription } from './processForm'
import { useAuth } from '@app/auth/auth'
import ShowChildIfTrue from '@app/utils/ShowChildIfTrue';
import Loader from '@app/module/loader/Loader';
import Header from '@app/module/header/Header';

function Loading()
{
    return <div className="subscribe-page--loader-cont">
        <Loader/>
    </div>
}

function Error()
{
    return <>
        <div className="subscribe-page--head--content--container--title">
            Erreur
        </div>
        <hr className="subscribe-page--separator" />
        <div className="subscribe-page--error">
            Une erreur n'a pas permit de mener à bien la requête. Veuillez réessayer ultérieurement.
        </div>
        <hr className="subscribe-page--separator" />
        <div className="subscribe-page--button-cont">
            <Button theme="secondary" className="subscribe-page--button" type="button" onClick={() => location.reload()}> Retour </Button>
        </div>
    </>
}

export default function ManageSubscribe(){
    
    const [info, setInfo] = useState({})

    const {auth, logout, updateAuth} = useAuth()

    const [subscriptionPause, setSubscriptionPause] = useState(false)

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const [isLoadingPause, setIsLoadingPause] = useState(false);
    const [isErrorPause, setIsErrorPause] = useState(false);

    const [isLoadingCancel, setIsLoadingCancel] = useState(false);
    const [isErrorCancel, setIsErrorCancel] = useState(false);

    const initSubscriptionInfo = async() => {
        setIsLoading(true)

        const result = await getSubscriptionInfo(auth.token)

        switch (result) {
            case 401:
                logout()
                break;
            case "error":
                setIsError(true)
                setIsLoading(false)
                break;
            default:
                setInfo(result)
                setSubscriptionPause(result?.pause != null)
                setIsLoading(false)
                break;
        }
    }

    useEffect(async () => await initSubscriptionInfo(),[])

    const pauseSubscriptionAction = async() => {
        
        setIsErrorPause(false)
        setIsLoadingPause(true)

        let result

        if(subscriptionPause)
            result = await pauseSubscription(auth.token,"unpause")
        else
            result = await pauseSubscription(auth.token,"pause")

        switch (result) {
            case 401:
                logout()
                break;
            case "error":
                setIsErrorPause(true)
                setIsLoadingPause(false)
                break;
            default:
                setIsLoadingPause(false)
                await initSubscriptionInfo()
                break;
        }
    }

    const pauseButtonText = () => {
        if (isLoadingPause) 
            return <Loader size="40px"/> 
        
        if(info?.pause == null)
            return "Suspendre l'abonnement"
        
        return "Reprendre l'abonnement"
    }

    const status = () => {
        if(info == {})
            return ""
        
        if(info?.status == 'active')
        {
            if(info?.pause ==  null)
                return "Actif"
            
            return "En pause"
        }
        else if(info?.status == 'past_due')
        {
            return "Payement en retard"
        }
    }

    const nextPaiement = () => {
        if(info == {})
            return ""
        
        if(info?.pause == null)
            return <> 
                <b>{info?.upcomingInvoiceDate} - {info?.upcomingInvoiceAmount}€</b>
                <span className="info">(prévisionel)</span>
            </>
        
        return <span className="pause">Suspendu</span>
    }

    const cancelSubscriptionAction = async() => {

        setIsErrorCancel(false)
        setIsLoadingCancel(true)
        const result = await cancelSubscription(auth.token)

        switch (result) {
            case 401:
                logout()
                break;
            case "error":
                setIsErrorCancel(true)
                setIsLoadingCancel(false)
                break;
            default:
                setIsLoadingCancel(false)
                auth.isSubscribe = false
                updateAuth(auth)
                window.location.reload()
                break;
        }

    }

    const cancelButtonText = () => {
        if (isLoadingCancel) 
            return <Loader size="40px"/>
        
        return "Annuler l'abonnement"
    }

    return <>
        <ShowChildIfTrue isControl={!isLoading} alternateElem={<Loading/>}>
            <ShowChildIfTrue isControl={!isError} alternateElem={<Error/>}>
                <Header
                    title="Gérer mon abonnement"
                    description="Gérer mon abonnement"
                />
                <div className="subscribe-page--head--content--container--title">
                    Gérer mon abonnement
                </div>
                <hr className="subscribe-page--separator" />

                <ShowChildIfTrue isControl={isErrorPause} alternateElem="">
                    <div className="subscribe-page--error-action">Une erreur n'a pas permit à l'opération d'être effectuée</div>
                </ShowChildIfTrue>

                <ShowChildIfTrue isControl={isErrorCancel} alternateElem="">
                    <div className="subscribe-page--error-action">Une erreur n'a pas permit à l'opération d'être effectuée</div>
                </ShowChildIfTrue>

                <div className="subscribe-page--subscribe-info">
                    Status de l'abonnement <br /> <b>{ status() }</b>
                </div>
                <div className="subscribe-page--subscribe-info">
                    Abonnement valide jusqu'au <br /> <b>{info?.endDate}</b>
                </div>
                <div className="subscribe-page--subscribe-info">
                    Dernier paiement:<br/> <b>{info?.lastInvoiceDate} - {info?.lastInvoiceAmount}€</b>
                </div>
                <div className="subscribe-page--subscribe-info">
                    Prochain paiement:<br/> { nextPaiement() }
                </div>

                <hr className="subscribe-page--separator" />

                <div className="subscribe-page--button-cont">
                    <Button theme="secondary" className="subscribe-page--button manage" type="button" onClick={() => window.location.href = info?.seeInvoicesLink}> Gérer mon abonnement </Button>
                </div>
                <div className="subscribe-page--button-cont under-button">
                    <Button theme="primary_light" className="subscribe-page--button pause" type="button" onClick={ () => pauseSubscriptionAction() } > { pauseButtonText() } </Button>
                </div>
                <div className="subscribe-page--button-cont under-button">
                    <Button theme="primary" className="subscribe-page--button cancel" type="button" onClick={ () => cancelSubscriptionAction() } > { cancelButtonText() } </Button>
                </div>
            </ShowChildIfTrue>
        </ShowChildIfTrue>
    </>
}