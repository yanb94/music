import React, { useEffect, useState } from "react";
import "./Home.scss"
import Button from "@app/module/button/Button";
import SongItem from "@app/module/song-item/SongItem";
import { useHistory, Link } from "react-router-dom";
import { useAuth } from "@app/auth/auth";
import { getTopSongs } from "./getData";
import ShowChildIfTrue from "@app/utils/ShowChildIfTrue";
import Loader from "@app/module/loader/Loader";
import Header from "@app/module/header/Header";
import image from '../../../image/home-news.jpg';

function LoadingNews()
{
    return <div className="home--news--content--loading-songs">
        <Loader size="200px"/>
    </div>
}

function ErrorNews()
{
    return <div className="home--news--content--error-songs">
        Une erreur n'as pas permit de récupérer les données demandées.
        Veuillez réessayer ultérieurement. 
    </div>
}

export default function Home()
{
    const [listSongs, setListSongs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    const history = useHistory();

    const {auth} = useAuth()

    const link = () => {
        return auth?.isAuth ? "/space-member/subscribe" : "/register"
    }

    useEffect(async() => {
        const result = await getTopSongs()
        switch (result) {
            case "error":
                setIsError(true)
                break;
            default:
                setListSongs(result['hydra:member'])
                break;
        }
        setIsLoading(false);
    },[])

    return <div className="home">
        <Header
            title="Song"
            description="La plateforme des passionnés de musique"
            ogOption={{
                image: image
            }}
            twitterOption={{
                image: image
            }}
        />
        <div className="home--front">
            <div className="home--front--image"></div>
            <div className="home--front--content">
                <h1 className="home--front--content--title">
                    Song
                </h1>
                <p className="home--front--content--subtitle">
                    La plateforme des passionnés de musique
                </p>
                <div className="home--front--content--cont-button">
                    <Link to={link()}>
                        <Button theme="secondary">Je m'abonne</Button>
                    </Link>
                    <Button theme="primary" height="62px" onClick={() => history.push('/catalogue')}>Notre catalogue</Button>
                </div>
            </div>
        </div>
        <div className="home--news">
            <div className="home--news--image"></div>
            <div className="home--news--content">
                <h2 className="home--news--content--title">
                    Nouveautés
                </h2>
                <ShowChildIfTrue isControl={!isLoading} alternateElem={
                    <LoadingNews/>
                }>
                    <ShowChildIfTrue isControl={!isError} alternateElem={
                        <ErrorNews/>
                    }>
                        <div className="home--news--content--new-songs">
                            { listSongs.map((data) => <SongItem key={data.id} data={data} />) }
                        </div>
                    </ShowChildIfTrue>
                </ShowChildIfTrue>
                <Button 
                    theme="secondary" 
                    width="250px" 
                    fontSize="24px" 
                    height="80px" 
                    style={{marginBottom: "20px", marginTop: "10px", lineHeight: "26px"}} 
                    onClick={() => history.push('/catalogue')}
                    >
                        Voir le catalogue complet
                </Button>
            </div>
        </div>
        <div className="home--offer">
            <div className="home--offer--image"></div>
            <div className="home--offer--content">
                <div className="home--offer--content--desc">
                    <h2 className="home--offer--content--desc--title">
                        Découvrez Song
                    </h2>
                    <p className="home--offer--content--desc--subTitle">
                        Le service de streaming des passionés
                    </p>
                    <p className="home--offer--content--desc--desc">
                        La plateforme de streaming Song rassemble les œuvres de très nombreux artistes de tout horizons, pour offrir a ses abonnés le meilleurs de la musique.
                    </p>
                    <p className="home--offer--content--desc--key-point">Points clés</p>
                    <ul className="home--offer--content--desc--list">
                        <li className="home--offer--content--desc--list--item">Un large choix de chanson</li>
                        <li className="home--offer--content--desc--list--item">De nombreux artistes passionés</li>
                        <li className="home--offer--content--desc--list--item">Une plateforme de qualité</li>
                    </ul>
                </div>
                <div className="home--offer--content--price">
                    <h2 className="home--offer--content--price--our-offer">Notre offre</h2>
                    <p className="home--offer--content--price--nb">15.99€</p>
                    <p className="home--offer--content--price--time">par mois TTC</p>
                    <p className="home--offer--content--price--info">Pour un accès complet a notre catalogue</p>
                    <Link to={link()}>
                        <Button theme="secondary">
                            Souscrire
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    </div>
}