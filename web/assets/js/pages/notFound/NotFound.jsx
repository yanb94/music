import PageCard from '@app/module/pageCard/PageCard'
import React from 'react'
import './NotFound.scss'
import Button from '@app/module/button/Button'
import { useHistory } from 'react-router-dom'
import Header from '@app/module/header/Header'

export default function NotFound(){

    const history = useHistory()

    return <>
        <Header
            title="Page non trouvé"
            description="Page non trouvé"
        />
        <PageCard
            className="not-found"
            title="Page non trouvé"
            desc="La page que vous cherchiez n'a pas été trouvée. Mais vous pouvez dès a présent continuer votre navigation sur Song"
            buttons={
                [
                    <Button key="catalogue" theme="primary" onClick={() => history.push('/catalogue')}>Notre catalogue</Button>,
                    <Button key="home" theme="secondary" onClick={() => history.push('/')}>Accueil</Button>
                ]
            }
        />
    </>
}