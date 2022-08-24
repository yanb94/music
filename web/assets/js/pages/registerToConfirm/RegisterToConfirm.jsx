import React from "react";
import "./RegisterToConfirm.scss";
import Button from "@app/module/button/Button";
import { useHistory } from "react-router-dom";
import PageCard from "@app/module/pageCard/PageCard";
import Header from "@app/module/header/Header";

export default function RegisterToConfirm()
{
    const history = useHistory();

    return <>
        <Header
            title="Inscription a confirmée"
            description="Inscription a confirmée"
        />
        <PageCard
            className="register-to-confirm"
            title="Inscription a confirmée"
            desc="Votre inscription a bien été prise en compte. Pour pouvoir vous connectez sur Song, vous devez validé votre inscription en cliquant sur le lien présent dans l'email de confirmation qui vous sera envoyé prochainement."
            buttons={
                [
                    <Button key="home" theme="primary" onClick={() => history.push('/')}>Accueil</Button>,
                    <Button key="catalogue" theme="secondary" onClick={() => history.push('/catalogue')}>Notre catalogue</Button>
                ]
            }
        />
    </>
}