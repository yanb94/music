import React, {useState, useEffect} from 'react'
import Loader from '@app/module/loader/Loader'
import ShowChildIfTrue from '@app/utils/ShowChildIfTrue'
import { Redirect, useParams, Link } from 'react-router-dom'
import { useAuth } from '@app/auth/auth'
import './StatsPlaylist.scss'
import { getInitialData, getStats } from './getData'
import secondsToHmsWithLetter from '@app/utils/secondsToHmsWithLetter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Line } from 'react-chartjs-2'
import Header from '@app/module/header/Header'

function getTheGoodImage(size, rawImage, responsiveImage)
{
    if(size == '250px')
        return responsiveImage?.['250x250'] ?? rawImage
}

export default function StatsPlaylist(){

    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    const [playlistData, setPlaylistData] = useState({})
    const [statsData, setStatsData] = useState({})
    const [statsConfig, setStatsConfig] = useState(null)

    const {slug} = useParams()
    const {auth, logout} = useAuth()

    const initStatsConfig = async (result) => {
        setStatsConfig(
            {
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
        )
    }

    const getStatsAction = async () => {
        const result = await getStats(slug, auth.token)
        switch (result) {
            case 401:
                logout();
                break;
            case "error":
                setIsError(true)
                break;
            default:
                setStatsData(result)
                await initStatsConfig(result)
                break;
        }

        setIsLoading(false)
    }

    useEffect(async() => {
        setIsLoading(true)

        const result = await getInitialData(slug,auth.token)
        switch (result) {
            case 401:
                logout();
                break;
            case "error":
                setIsError(true)
                setIsLoading(false)
                break;
            default:
                setPlaylistData(result)
                await getStatsAction()
                break;
        }
    },[])

    return <div className="stats-playlist">
        <div className="stats-playlist--content">
            <ShowChildIfTrue isControl={!isLoading} alternateElem={ <div className="stats-playlist--content--loading"><Loader/></div> }>
                <ShowChildIfTrue isControl={!isError} alternateElem={ <Redirect to="/error404" /> }>
                    <>
                        <Header
                            title={"Statistique de la playlist "+playlistData.name}
                            description={"Statistique de la playlist "+playlistData.name}
                        />
                        <div className="stats-playlist--content--previous">
                            <Link to="/space-member/my-playlists" ><FontAwesomeIcon icon={faArrowLeft}/> Retour</Link>
                        </div>
                        <div className="stats-playlist--content--card-playlist">
                            <div className="stats-playlist--content--card-playlist--cont-image">
                                <img src={ getTheGoodImage("250px", playlistData.contentImageUrl, playlistData.contentImageResponsive) } alt={playlistData.name} className="stats-playlist--content--card-playlist--cont-image--image"/>
                            </div>
                            <div className="stats-playlist--content--card-playlist--infos">
                                <h1 className="stats-playlist--content--card-playlist--infos--title">{playlistData.name}</h1>
                                <div className="stats-playlist--content--card-playlist--infos--nbSongs">{playlistData?.nbSongs} Chansons</div>
                                <div className="stats-playlist--content--card-playlist--infos--status">Status: <b>{playlistData?.isPublic ? "Public" : "Privée"}</b></div>
                                <div className="stats-playlist--content--card-playlist--infos--duration" >{"Durée "+secondsToHmsWithLetter(playlistData.duration)}</div>
                            </div>
                        </div>
                        <div className="stats-playlist--content--title-graph">Nombre d'écoute cette semaine</div>
                        {statsConfig ? <Line className="stats-playlist--content--graph" data={statsConfig} /> : ""}
                    </>
                </ShowChildIfTrue>
            </ShowChildIfTrue>
        </div>
    </div>

}