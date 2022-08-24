import { useAuth } from '@app/auth/auth'
import Loader from '@app/module/loader/Loader'
import ShowChildIfTrue from '@app/utils/ShowChildIfTrue'
import React, {useState, useEffect} from 'react'
import { Redirect, useParams } from 'react-router-dom'
import { getInitialData, getStats } from './getData'
import './StatsSong.scss'
import secondsToHmsWithLetter from '@app/utils/secondsToHmsWithLetter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { Line } from 'react-chartjs-2'
import Header from '@app/module/header/Header'

function getTheGoodImage(size, rawImage, responsiveImage)
{
    if(size == '250px')
        return responsiveImage?.['250x250'] ?? rawImage
}

export default function StatsSong(){

    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    const [songData, setSongData] = useState({})
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
                setSongData(result)
                await getStatsAction()
                break;
        }
    },[])

    return <div className="stats-song">
        <div className="stats-song--content">
            <ShowChildIfTrue isControl={!isLoading} alternateElem={ <div className="stats-song--content--loading"><Loader/></div> }>
                <ShowChildIfTrue isControl={!isError} alternateElem={ <Redirect to="/error404" /> }>
                    <>
                        <Header
                            title={"Statistique de la chanson "+songData.name}
                            description={"Statistique de la chanson "+songData.name}
                        />
                        <div className="stats-song--content--previous">
                            <Link to="/space-member/my-songs" ><FontAwesomeIcon icon={faArrowLeft}/> Retour</Link>
                        </div>
                        <div className="stats-song--content--card-song">
                            <div className="stats-song--content--card-song--cont-image">
                                <img src={ getTheGoodImage("250px", songData.contentImageUrl, songData.contentImageResponsive) } alt={songData.name} className="stats-song--content--card-song--cont-image--image"/>
                            </div>
                            <div className="stats-song--content--card-song--infos">
                                <h1 className="stats-song--content--card-song--infos--title">{songData.name}</h1>
                                <div className="stats-song--content--card-song--infos--author">De {songData?.author?.name}</div>
                                <div className="stats-song--content--card-song--infos--duration" >{"Durée "+secondsToHmsWithLetter(songData.songDuration)}</div>
                            </div>
                        </div>
                        <div className="stats-song--content--title-graph">Nombre d'écoute cette semaine</div>
                        {statsConfig ? <Line className="stats-song--content--graph" data={statsConfig} /> : ""}
                    </>
                </ShowChildIfTrue>
            </ShowChildIfTrue>
        </div>
    </div>
}