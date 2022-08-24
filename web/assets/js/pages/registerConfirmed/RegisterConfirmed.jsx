import React, { useEffect, useState } from "react";
import "./RegisterConfirmed.scss";
import Button from "@app/module/button/Button";
import { useHistory, useParams } from "react-router-dom";
import PageCard from "@app/module/pageCard/PageCard";
import processConfirmation from "./processConfirmation";
import Loader from "@app/module/loader/Loader";
import Header from "@app/module/header/Header";

export default function RegisterConfirmed()
{
    const history = useHistory();

    const { confirmToken } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect( async () => {
        const result = await processConfirmation(confirmToken);
        result == 200 ? setIsSuccess(true) : setIsSuccess(false);
        setIsLoading(false);
    },[]);

    return isLoading ? <div style={{'height': "100vh", "display": "flex", "alignItems": "center", "justifyContent": "center"}}> <Loader size="150px"/> </div>  : ( isSuccess ? <>
        <Header
            title="Inscription validée"
            description="Inscription validée"
        />
        <PageCard
            className="register-confirmed"
            title="Inscription validée"
            desc="Votre inscription a bien été validée. Vous pouvez dès a présent vous connectez et souscrire un abonnement pour profiter de notre catalogue de musique."
            buttons={
                [
                    <Button key="catalogue" theme="primary" onClick={() => history.push('/catalogue')}>Notre catalogue</Button>,
                    <Button key="login" theme="secondary" onClick={() => history.push('/login')}>Se connecter</Button>
                ]
            }
        />
    </> : <>
        <Header
            title="Inscription non validée"
            description="Inscription non validée"
        />
        <PageCard
            className="register-confirmed"
            title="Inscription non validée"
            desc="Une erreur est survenu et votre inscription n'a pas été validé. Si le problème persite veuillez contacter les administrateurs."
            buttons={
                [
                    <Button key="catalogue" theme="primary" onClick={() => history.push('/catalogue')}>Notre catalogue</Button>,
                    <Button key="login" theme="secondary" onClick={() => history.push('/')}>Accueil</Button>
                ]
            }
        />
    </>)
}