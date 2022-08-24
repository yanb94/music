import React, {useState, useEffect} from 'react'
import { useHistory, useParams } from "react-router-dom"
import Loader from "@app/module/loader/Loader";
import Button from '@app/module/button/Button';
import { useAuth } from '@app/auth/auth';
import PageCard from "@app/module/pageCard/PageCard";
import "./ChangeEmailConfirm.scss";
import processConfirmation from './processConfirmation';
import Header from '@app/module/header/Header';

export default function ChangeEmailConfirm()
{
    const history = useHistory();
    const {auth} = useAuth()

    const { token } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect( async () => {
        const result = await processConfirmation(token);
        result == 200 ? setIsSuccess(true) : setIsSuccess(false);
        setIsLoading(false);
    },[]);

    return isLoading ? <div style={{'height': "100vh", "display": "flex", "alignItems": "center", "justifyContent": "center"}}> <Loader size="150px"/> </div>  : ( isSuccess ? <>
        <Header
            title="Changement d'email validé"
            description="Changement d'email validé"
        />
        <PageCard
            className="change-email-confirmed"
            title="Changement d'email validé"
            desc="Votre changement d'email a bien été validé. Vous pouvez dès a présent poursuivre votre navigation sur Song."
            buttons={
                [
                    <Button key="catalogue" theme="primary" onClick={() => history.push('/catalogue')}>Notre catalogue</Button>,
                    (auth.isAuth ? <Button key="member" theme="secondary" onClick={() => history.push('/space-member')}>Espace Membre</Button> : <Button key="login" theme="secondary" onClick={() => history.push('/login')}>Se connecter</Button>)
                ]
            }
        />
    </> : <>
        <Header
            title="Changement d'email non validé"
            description="Changement d'email non validé"
        />
        <PageCard
            className="change-email-confirmed"
            title="Changement d'email non validé"
            desc="Une erreur est survenu et votre changement d'email n'a pas été validé. Si le problème persite veuillez contacter les administrateurs."
            buttons={
                [
                    <Button key="catalogue" theme="primary" onClick={() => history.push('/catalogue')}>Notre catalogue</Button>,
                    <Button key="home" theme="secondary" onClick={() => history.push('/')}>Accueil</Button>
                ]
            }
        />
    </>)
}