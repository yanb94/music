import React from 'react'
import Button from '@app/module/button/Button'
import Header from '@app/module/header/Header'

export default function Canceled({setStatePage, returnState})
{
    return <>
        <Header
            title="Souscription non complété"
            description="Souscription non complété"
        />
        <div className="subscribe-page--head--content--container--title subscribe-page--canceled">
            Souscription non complété
        </div>
        <hr className="subscribe-page--separator" />
        <div className="subscribe-page--msg-canceled">
            Vous n'avez pas finalisée votre paiement et votre abonnement n'a pas été activé.
            Pour souscrire au service de song veuillez revenir à la page de soucription en cliquant sur le bouton ci-dessous.
        </div>
        <hr className="subscribe-page--separator" />
        <div className="subscribe-page--button-cont">
            <Button theme="secondary" className="subscribe-page--button" type="button" onClick={() => setStatePage(returnState) }> Retour </Button>
        </div>
    </>
}