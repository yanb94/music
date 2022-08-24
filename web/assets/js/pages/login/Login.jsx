import React from "react";
import "./Login.scss";
import TextInput from "@app/form/textInput/TextInput";
import { useForm } from "react-hook-form";
import Button from "@app/module/button/Button";
import schemaValidation from "./validation";
import { yupResolver } from '@hookform/resolvers/yup';
import Loader from "@app/module/loader/Loader";
import sendRequest from "./processForm"
import { useAuth } from "@app/auth/auth";
import Header from '@app/module/header/Header';
import image from '../../../image/login-head.jpg';

export default function Login()
{
    const {login} = useAuth();

    const { register, handleSubmit, formState: { errors, isDirty, isValid, isSubmitting }, control, setError} = useForm({
        resolver: yupResolver(schemaValidation),
        mode: "onChange"
    });

    const onSubmit = async (data) => {
        const result = await sendRequest(data)

        if(result.error)
            setError("username",{ type: "manual", message: result.error }, {shouldFocus: true})
        else
            login({token: result.token, id: result.id, artist: result.artist, isSubscribe: result.isSubscribe})
    }

    return <div className="login">
        <Header
            title="Se connecter - Song"
            description="Connectez-vous dès a présent sur Song, la plateforme des passionés de musique"
            ogOption={{
                image: image
            }}
            twitterOption={{
                image: image
            }}
        />
        <div className="login--image"></div>
        <div className="login--content">
            <div className="login--content--card">
                <form className="login--content--card--form" onSubmit={handleSubmit(onSubmit)}>
                    <h1 className="login--content--card--form--title">Se connecter</h1>
                    <TextInput register={register} errors={errors} id="username" name="username" label="Nom d'utilisateur" placeholder="Entrez votre nom d'utilisateur"/>
                    <TextInput register={register} errors={errors} id="password" name="password" label="Mot de passe" placeholder="Entrez votre mot de passe" type="password"/>
                    <div className="login--content--card--form--cont-btn">
                        <Button theme="secondary" disabled={isSubmitting} type="submit">Se connecter</Button>
                        {isSubmitting ? <Loader size="30px" style={{"marginTop": "25px"}}/> : ""}
                    </div>
                </form>
            </div>
        </div>
    </div>
}