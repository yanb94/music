import React, { useEffect, useState } from 'react'
import { useParams, Link, Redirect } from 'react-router-dom'
import './SongPage.scss'
import {getData} from './getData';
import Loader from '@app/module/loader/Loader';
import moment from 'moment'
import Button from '@app/module/button/Button';
import OtherPlaylists from './OtherPlaylists';
import OtherSongs from './OtherSongs';
import SongPlayer from './SongPlayer';
import { useAuth } from '@app/auth/auth';
import shortNumber from '@app/utils/shortNumber';
import FollowButton from '@app/module/follow-button/FollowButton';
import Header from '@app/module/header/Header';

function getTheGoodImage(size, rawImage, responsiveImage)
{
    if(size == '60px')
        return responsiveImage?.['60x60'] ?? rawImage
}

function ago(date)
{
    return moment(date).locale('fr').fromNow();
}

function SongPageLoading({isLoading, className, children})
{
    return !isLoading ? children : <div className={className+"--loading"}><Loader size="150px"/></div>
}

function SongPageNotFound({isNotFound, children})
{
    return !isNotFound ? children : <Redirect to="/error404"/>
}

export default function SongPage()
{
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [isNotFound, setIsNotFound] = useState(false)

    const [isNotAllowToListenSong, setIsNotAllowToListenSong] = useState(false)

    const { slug } = useParams();
    const [songData, setSongData] = useState({})
    const { auth, logout } = useAuth()

    useEffect(async () => {
        setIsLoading(true)
        const songData = await getData(slug,auth.token)
        switch (songData) {
            case 404:
                setIsNotFound(true)
                break;
            case 401:
                logout()
                return;
            case "error":
                setIsError(true)
                break;
            default:
                setSongData(songData)
                songData.contentSongUrl ?? setIsNotAllowToListenSong(true)
                break;
        }
        setIsLoading(false)
    },[slug])

    return <div className='song-page'>
        <div className="song-page--content">
            <SongPageLoading className="song-page--content" isLoading={isLoading}>
                <SongPageNotFound isNotFound={isError}>
                    <SongPageNotFound isNotFound={isNotFound}>
                        <Header
                            title={songData.name+" - Song"}
                            description={"Écoutez et apprécié la chanson "+songData.name}
                            ogOption={{
                                image: songData?.contentImageUrl
                            }}
                            twitterOption={{
                                image: songData?.contentImageUrl
                            }}
                        />
                        <SongPlayer songData={songData} allowToListen={!isNotAllowToListenSong} auth={auth} />
                        <div className="song-page--content--info">
                            <h1 className="song-page--content--info--title">{songData.name}</h1>
                            <div className="song-page--content--info--views">{shortNumber(songData.nbViews)} vue{songData.nbViews > 1 ? "s" : "" }</div>
                            <div className="song-page--content--info--date">{ago(songData.createdAt)}</div>
                        </div>
                        <div className="song-page--content--artist-info">
                            <div className="song-page--content--artist-info--bar">
                                <div className="song-page--content--artist-info--bar--artist">
                                    <img className="song-page--content--artist-info--bar--artist--image" src={ getTheGoodImage('60px',songData?.author?.contentUrl,songData?.author?.contentImageResponsive) } alt={songData?.author?.name} />
                                    <div className="song-page--content--artist-info--bar--artist--info">
                                        <Link className="song-page--content--artist-info--bar--artist--info--name" to={"/artist/"+songData?.author?.slug}>
                                            {songData?.author?.name}
                                        </Link>
                                        <div className="song-page--content--artist-info--bar--artist--info--followers">
                                            {shortNumber(songData?.author?.nbFollowers)} abonnés
                                        </div>
                                    </div>
                                </div>
                                <FollowButton slug={songData?.author?.slug} className="song-page--content--artist-info--bar--artist--button" />
                            </div>
                            <div className="song-page--content--artist-info--desc">
                                {songData?.author?.description}
                            </div>
                        </div>
                        <OtherPlaylists/>
                        <OtherSongs data={songData} />
                    </SongPageNotFound>
                </SongPageNotFound>
            </SongPageLoading>
        </div>
    </div>
}