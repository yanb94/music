import React, { useState } from 'react'
import './SubscribePage.scss'
import ShowChildIfTrue from '@app/utils/ShowChildIfTrue';
import Loader from '@app/module/loader/Loader';
import { useAuth } from '@app/auth/auth';
import Begin from './Begin';
import Canceled from './Canceled';
import Success from './Success';
import ManageSubscribe from './ManageSubscribe';
import Button from '@app/module/button/Button';

function Loading()
{
    return <div className="subscribe-page--loader-cont">
        <Loader/>
    </div>
}

function Error({setStatePage, returnState, setIsError})
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
            <Button theme="secondary" className="subscribe-page--button" type="button" onClick={() => {
                setStatePage(returnState)
                setIsError(false)
            }}> Retour </Button>
        </div>
    </>
}

function getQueryParameter(label)
{
    const search = window.location.search
    const params = new URLSearchParams(search)
    const param = params.get(label)

    return param
}

const CANCELED = 'canceled'
const SUCCESS = 'success'
const BEGIN = 'begin'

function pageState(){

    if(getQueryParameter('canceled'))
    {
        return CANCELED
    }
    
    if(getQueryParameter('success'))
    {
        return SUCCESS
    }
    
    return BEGIN
}

export default function SubscribePage()
{
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const pageStateValue = pageState();

    const [statePage, setStatePage] = useState(pageStateValue)

    const {auth} = useAuth()

    const showDependingState = (state) => {
        switch (state) {
            case BEGIN:
                return <Begin setIsError={setIsError} setIsLoading={setIsLoading} />
            case CANCELED:
                return <Canceled setStatePage={setStatePage} returnState={BEGIN} />
            case SUCCESS:
                return <Success setStatePage={setStatePage} />
            default:
                break;
        }
    }

    return <div className="subscribe-page">
        <div className="subscribe-page--head">
            <div className="subscribe-page--head--image"></div>
            <div className="subscribe-page--head--content">
                <div className="subscribe-page--head--content--container">
                    <ShowChildIfTrue isControl={!isLoading} alternateElem={<Loading/>}>
                        <ShowChildIfTrue isControl={!isError} alternateElem={<Error setStatePage={setStatePage} returnState={BEGIN} setIsError={setIsError} />}>
                            <ShowChildIfTrue isControl={!auth.isSubscribe} alternateElem={
                                <ManageSubscribe/>
                            } >
                                {showDependingState(statePage)}
                            </ShowChildIfTrue>
                        </ShowChildIfTrue>
                    </ShowChildIfTrue>
                </div>
            </div>
        </div>
    </div>
}