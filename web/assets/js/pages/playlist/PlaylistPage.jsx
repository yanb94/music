import React, {useEffect, useRef, useState} from 'react'
import "./PlaylistPage.scss"
import { useParams, Redirect, Link } from 'react-router-dom'
import { getData, getInitialListOfSongs, getNextSongs, setView } from './getData'
import Loader from '@app/module/loader/Loader';
import secondsToHmsWithLetter from '@app/utils/secondsToHmsWithLetter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import PlaylistSong from './PlaylistSong';
import useInfiniteLoop from '@app/hooks/useInfiniteLoop';
import PinPlaylistButton from '@app/module/pin-playlist-button/PinPlaylistButton';
import { useAuth } from '@app/auth/auth';
import Button from '@app/module/button/Button';
import Header from '@app/module/header/Header';

function getTheGoodImage(size, rawImage, responsiveImage)
{
    if(size == '250px')
        return responsiveImage?.['250x250'] ?? rawImage
}

function PlaylistPageLoading({isLoading, className, children})
{
    return !isLoading ? children : <div className={className+"--loading"}><Loader size="150px"/></div>
}

function PlaylistPageNotFound({isNotFound, children})
{
    return !isNotFound ? children : <Redirect to="/error404"/>
}

function PlaylistPageError({isError, children, className})
{
    return !isError ? children : <div className={className+"--error"}>
        Une erreur ne nous a pas permit de récupérer les données demandées veuillez réessayer ultérieurement.
    </div>
}

function PlaylistPartialLoading({isLoadingPartial, className})
{
    return !isLoadingPartial ? "" : <div  className={className+"--partialLoading"}>
        <Loader size="80px" />
    </div>
}

export default function PlaylistPage()
{
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [isNotFound, setIsNotFound] = useState(false)
    const [playlistData, setPlaylistData] = useState({})
    const [playListRead, setPlaylistRead] = useState(false)
    const [listSongs, setListSongs] = useState([])
    const [nextPage, setNextPage] = useState(null)

    const [isLoadingPartial, setIsLoadingPartial] = useState(false);

    const [currentSong, setCurrentSong] = useState(0)
    const [currentVolume, setCurrentVolume] = useState(0.5)

    const playChild = useRef({current: []})

    const { slug } = useParams();

    const [ containerRef ] = useInfiniteLoop({
        loadMore: () => getNewSongs(),
        stopLoad: () => isLoadMore()
    })

    const [viewSend, setViewSend] = useState(false)

    const {auth} = useAuth()

    const isLoadMore = () => {
        return nextPage
    }

    const getNewSongs = async () => {
        setIsLoadingPartial(true)
        const result = await getNextSongs(nextPage,auth?.token)
        let fullList; 
        switch (result) {
            case "error":
                break;
            default:
                fullList = listSongs.concat(result['hydra:member'])
                setListSongs(fullList)
                break;
        }
        setNextPageWhenExist(result)
        setIsLoadingPartial(false)
        return fullList
    }

    const setNextPageWhenExist = (result) => {
        if(!result['hydra:view'] || !result['hydra:view']['hydra:next'])
            setNextPage(null)
        else
            setNextPage(result['hydra:view']['hydra:next'])
    }

    const getListOfSongs = async(slug) => {
        const resultList = await getInitialListOfSongs(slug,auth?.token)
        switch (resultList) {
            case "error":
                setIsError(true)
                break;
            default:
                setListSongs(resultList['hydra:member'])
                setNextPageWhenExist(resultList)
                break;
        }
        setIsLoading(false)
    }

    useEffect(async() => {
        setIsLoading(true)
        const result = await getData(slug,auth?.token)
        switch (result) {
            case 404:
                setIsNotFound(true)
                setIsLoading(false)
                break;
            case "error":
                setIsError(true)
                setIsLoading(false)
                break;
            default:
                setPlaylistData(result)
                getListOfSongs(slug)
                break;
        }
    },[])

    const manageView = async () => {
        if(!viewSend)
        {   
            await setView(playlistData.id)
            setViewSend(true)
        }
    }

    const readPlaylist = async () => {
        if(listSongs.length == 0)
            return
        
        if(currentSong == null)
            setCurrentSong(0)
        
        playChild.current[currentSong]()

        setPlaylistRead(!playListRead)

        await manageView()
    }

    const nextSongOnPlaylist = async () => {
        if(listSongs[currentSong + 1])
        {
            setCurrentSong(currentSong + 1)
            playChild.current[currentSong + 1]()
            return
        }

        if(nextPage != null)
        {
            const newList = await getNewSongs()
            if(newList[currentSong + 1])
            {
                setCurrentSong(currentSong + 1)
                playChild.current[currentSong + 1]()
            }
        }
        else
        {
            setCurrentSong(0)
            setPlaylistRead(false)
        }
    }

    const linkWhenNotAllowed = () => {
        return auth?.isAuth ? "/space-member/subscribe" : "/register"
    }

    return <div className="playlist-page">
        <div className="playlist-page--content">
            <PlaylistPageLoading isLoading={isLoading} className="playlist-page--content">
                <PlaylistPageNotFound isNotFound={isNotFound}>
                    <PlaylistPageError isError={isError} className="playlist-page--content">
                        <Header
                            title={playlistData.name+" - Song"}
                            description={"Découvrez toutes les chansons de la playlist "+playlistData.name}
                            ogOption={{
                                image: playlistData.contentImageUrl
                            }}
                            twitterOption={{
                                image: playlistData.contentImageUrl
                            }}
                        />
                        <div className="playlist-page--content--card-playlist">
                            <div className="playlist-page--content--card-playlist--cont-image">
                                <img src={ getTheGoodImage("250px", playlistData.contentImageUrl, playlistData.contentImageResponsive) } alt={playlistData.name} className="playlist-page--content--card-playlist--cont-image--image" />
                                {
                                    auth?.isSubscribe ? <div className="playlist-page--content--card-playlist--cont-image--button" onClick={() => readPlaylist()}>
                                        <FontAwesomeIcon icon={playListRead ? faPause : faPlay}/>
                                    </div> : <div className="playlist-page--content--card-playlist--cont-image--subscribe">
                                            <Link to={linkWhenNotAllowed()}>
                                                <Button theme="secondary" fontSize="20px" height="50px" width="150px">S'abonner</Button>
                                            </Link>
                                        </div>
                                }
                            </div>
                            <div className="playlist-page--content--card-playlist--infos">
                                <h1 className="playlist-page--content--card-playlist--infos--title">{playlistData.name}</h1>
                                <div className="playlist-page--content--card-playlist--infos--nb-songs" >{playlistData.nbSongs} Chanson{playlistData.nbSongs > 1 ? "s" : ""}</div>
                                <div className="playlist-page--content--card-playlist--infos--duration" >{"Durée "+secondsToHmsWithLetter(playlistData.duration)}</div>
                                <PinPlaylistButton className="playlist-page--content--card-playlist--infos--pin" slug={playlistData.slug} />
                            </div>
                        </div>
                        <div className="playlist-page--content--list-songs">
                            { listSongs.map((data,index) => <PlaylistSong 
                                    index={index} 
                                    current={currentSong} 
                                    key={data.id} 
                                    data={data} 
                                    playChild={playChild} 
                                    next={nextSongOnPlaylist} 
                                    setPlay={setPlaylistRead}
                                    currentVolume={currentVolume}
                                    setCurrentVolume={setCurrentVolume}
                                    manageView={manageView}
                                    isSubscribe={auth?.isSubscribe}
                                />) 
                            }
                        </div>
                        <div ref={containerRef}></div>
                        <PlaylistPartialLoading isLoadingPartial={isLoadingPartial} className="playlist-page"/>
                    </PlaylistPageError>
                </PlaylistPageNotFound>
            </PlaylistPageLoading>
        </div>
    </div>
}