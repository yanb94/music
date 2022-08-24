import React from "react";
import "./ContactConfirmed.scss";
import Button from "@app/module/button/Button";
import { useHistory } from "react-router-dom";
import PageCard from "@app/module/pageCard/PageCard";
import Header from "@app/module/header/Header";

export default function ContactConfirmed()
{
    const history = useHistory();

    return <>
        <Header
            title="Message envoyé"
            description="Message envoyé"
        />
        <PageCard
            className="contact-confirmed"
            title="Message envoyé"
            desc="Votre message a bien été envoyé. Nous ferons en sorte de vous répondre dans les meilleurs délais"
            buttons={
                [
                    <Button key="home" theme="primary" onClick={() => history.push('/')}>Accueil</Button>,
                    <Button key="catalogue" theme="secondary" onClick={() => history.push('/catalogue')}>Notre catalogue</Button>
                ]
            }
        />
    </>
}