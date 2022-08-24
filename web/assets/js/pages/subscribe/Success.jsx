import React from 'react'
import Button from '@app/module/button/Button';
import { useAuth } from '@app/auth/auth';
import Header from '@app/module/header/Header';

export default function Success({setStatePage})
{
    const { logout } = useAuth()

    return <>
        <Header
            title="Souscription complétée avec succès"
            description="Souscription complétée avec succès"
        />
        <div className="subscribe-page--head--content--container--title subscribe-page--success">
            Souscription complétée avec succès
        </div>
        <hr className="subscribe-page--separator" />
        <div className="subscribe-page--msg-canceled">
            Votre souscription a bien été pris en compte, un email va vous être envoyée pour confirmer votre abonnement.
            Pour pouvoir accéder a nos contenu veuillez vous déconnectez puis vous reconnectez après avoir reçu l'email de confirmation.
            Pour que le changement de status soit pris en compte.
        </div>
        <hr className="subscribe-page--separator" />
        <div className="subscribe-page--button-cont">
            <Button theme="secondary" className="subscribe-page--button" type="button" onClick={() => logout() }> Se déconnecter </Button>
        </div>
    </>
}