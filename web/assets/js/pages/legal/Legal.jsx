import React, { useEffect, useState } from 'react'
import "./Legal.scss"
import { useParams, useHistory, Redirect } from "react-router-dom"
import DOMPurify from "dompurify";
import getData from "./getData"
import Loader from '@app/module/loader/Loader';
import PageCard from '@app/module/pageCard/PageCard';
import Button from '@app/module/button/Button';
import Header from '@app/module/header/Header';
import image from '../../../image/legal.jpg'

function LegalLoading({isLoading, children})
{
    return !isLoading ? children : <Loader size="300px"/>
}

function LegalError({isError, children})
{
    const history = useHistory();

    return !isError ? children : <PageCard
        className="card-error-legal"
        title="Impossible de charger les données"
        desc="Une erreur provenant du serveur n'a pas permis d'afficher ce document veuillez réassayer ultérieurement"
        buttons={
            [
                <Button key="catalogue" theme="primary">Notre catalogue</Button>,
                <Button key="home" theme="secondary" onClick={() => history.push('/')}>Accueil</Button>
            ]
        }
    />
}

function LegalNotFound({isNotFound, children})
{
    return !isNotFound ? children : <Redirect to="/error404"/>
}

export default function Legal(){

    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [isNotFound, setIsNotFound] = useState(false)

    const {slug} = useParams()
    const [legal, setLegal] = useState({})

    useEffect(async () => {
        
        const legalData = await getData(slug)
        switch (legalData) {
            case 404:
                setIsNotFound(true)
                break;
            case "error":
                setIsError(true)
                break;
            default:
                legalData.content = DOMPurify.sanitize(legalData.content, {
                    USE_PROFILES: { html: true },
                })
                setLegal(legalData)
                break;
        }
        setIsLoading(false)

    },[slug])

    return <div className="legal">
        <div className="legal--image"></div>
        <div className={"legal--content"+(isLoading ? " loading" : "")+(isError ? " error" : "") }>
            <LegalLoading isLoading={isLoading}>
                <LegalError isError={isError}>
                    <LegalNotFound isNotFound={isNotFound}>
                        <div className="legal--content--document">
                            <Header
                                title={legal.title}
                                description={legal?.content?.replaceAll(/(<([^>]+)>)/gi, "").substring(0, 200)}
                                ogOption={{
                                    image: image
                                }}
                                twitterOption={{
                                    image: image
                                }}
                            />
                            <h1 className="legal--content--document--title">
                                {legal.title}
                            </h1>
                            <div className="legal--content--document--content" dangerouslySetInnerHTML={{ __html: legal.content }}>
                            </div>
                        </div>
                    </LegalNotFound>
                </LegalError>
            </LegalLoading>
        </div>
    </div>
}