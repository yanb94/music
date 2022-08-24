import shortNumber from '@app/utils/shortNumber'
import React, { useState, useEffect } from 'react'
import './StatsUser.scss'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Link, Redirect } from 'react-router-dom'
import ShowChildIfTrue from '@app/utils/ShowChildIfTrue'
import { useAuth } from '@app/auth/auth'
import Loader from '@app/module/loader/Loader'
import { getInitialData } from './getData'
import { Line } from 'react-chartjs-2'
import ListArtistPayment from './ListArtistPayment'
import Header from '@app/module/header/Header'

function NbStatsItem({title, nb, additionalClass, suffix})
{
    return <div className="stats-user--content--datas--item">
        <div className={"stats-user--content--datas--item--title"+(" "+additionalClass)}>
            { title }
        </div>
        <div className="stats-user--content--datas--item--nb">
            { shortNumber(nb) + (suffix != null ? " "+ suffix : "") }
        </div>
    </div>
}

function GraphItem({datas, title})
{
    return <div className="stats-user--content--graph">
        <div className="stats-user--content--graph--title">{title}</div>
        {datas ? <Line className="stats-user--content--graph--canvas" data={datas} /> : ""}
    </div>
}

export default function StatsUser(){

    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const {auth, logout} = useAuth()

    const [statsData, setStatsData] = useState({})
    
    const [statsSongConfig, setStatsSongConfig] = useState(null)
    const [statsPlaylistConfig, setStatsPlaylistConfig] = useState(null)

    const initStatsConfig = (result) => {
        
        return {
            labels: result['dates'],
            datasets: [
                {
                    label: "Nombre d'écoute",
                    data: result['views'],
                    fill: false,
                    borderWidth: 1,
                    backgroundColor: "#fff",
                    borderWidth: 4,
                    borderColor:'rgb(0,191,255,0.7)'
                },
            ],
        }
    }

    useEffect(async() => {
        setIsLoading(true)

        const result = await getInitialData(auth.token)
        switch (result) {
            case 401:
                logout();
                break;
            case "error":
                setIsError(true)
                setIsLoading(false)
                break;
            default:
                setStatsData(result)
                setStatsSongConfig(initStatsConfig(result['viewsSongs']))
                setStatsPlaylistConfig(initStatsConfig(result['viewsPlaylists']))
                break;
        }

        setIsLoading(false)
    },[])

    return <div className="stats-user">
        <div className="stats-user--content">
            <ShowChildIfTrue isControl={!isLoading} alternateElem={ <div className="stats-user--content--loading"><Loader/></div> }>
                <ShowChildIfTrue isControl={!isError} alternateElem={ <Redirect to="/error404" /> } >
                    <Header
                        title="Vos statistiques d'artiste"
                        description="Vos statistiques d'artiste"
                    />
                    <div className="stats-user--content--previous">
                        <Link to="/space-member" ><FontAwesomeIcon icon={faArrowLeft}/> Retour</Link>
                    </div>
                    <div className="stats-user--content--datas">
                        <NbStatsItem title="Chanson" nb={statsData.nbSongs} />
                        <NbStatsItem title="Playlist" nb={statsData.nbPlaylists} />
                        <NbStatsItem title="Abonnés" nb={statsData.nbFollowers} />
                        <NbStatsItem title="Revenu prévisionnel du mois" nb={statsData.upcomingIncome} suffix="€" additionalClass="stats-user--content--datas--item--long-title" />
                    </div>
                    <GraphItem datas={statsSongConfig} title="Nombre d'écoute de vos chansons cette semaine" />
                    <GraphItem datas={statsPlaylistConfig} title="Nombre d'écoute de vos playlists cette semaine" />
                    <ListArtistPayment/>
                </ShowChildIfTrue>
            </ShowChildIfTrue>
        </div>
    </div>
}