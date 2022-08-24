import React, { useEffect, useState } from 'react'
import { useParams, Redirect } from 'react-router-dom'
import './ArtistPage.scss'
import { getData, getSongs, getNewSongs } from './getData'
import Loader from '@app/module/loader/Loader'
import SongItem from '@app/module/song-item/SongItem'
import useInfiniteLoop from '@app/hooks/useInfiniteLoop'
import { useAuth } from '@app/auth/auth'
import shortNumber from '@app/utils/shortNumber'
import FollowButton from '@app/module/follow-button/FollowButton'
import Header from '@app/module/header/Header'

function getTheGoodImage(size, rawImage, responsiveImage)
{
    if(size == '150px')
        return responsiveImage?.['150x150'] ?? rawImage
}

function Loading({isLoading, className, children})
{
    return !isLoading ? children : <div className={className+"--loading"}><Loader size="150px"/></div>
}

function NotFound({isNotFound, children})
{
    return !isNotFound ? children : <Redirect to="/error404"/>
}

function PartialLoading({isPartialLoading, className})
{
    return isPartialLoading ? <div className={className+"--partialLoading"}><Loader size="100px"/></div> : ""
}

export default function ArtistPage()
{
    const [isLoading, setIsLoading] = useState(true)
    const [isNotFound, setIsNotFound] = useState(false)
    const [artistData, setArtistData] = useState({})
    const [listSong, setListSong] = useState([])
    const [nextPage, setNextPage] = useState(null)

    const [isPartialLoading, setIsPartialLoading] = useState(false)

    const {slug} = useParams()

    const { auth } = useAuth();

    const [ containerRef ] = useInfiniteLoop({
        loadMore: () => getNextSongs(),
        stopLoad: () => isLoadMore()
    })

    const setNextPageWhenExist = (result) => {
        if(!result['hydra:view'] || !result['hydra:view']['hydra:next'])
            setNextPage(null)
        else
            setNextPage(result['hydra:view']['hydra:next'])
    }

    const isLoadMore = () => {
        return nextPage
    }

    const getNextSongs = async() => {
        setIsPartialLoading(true)
        const listSongData = await getNewSongs(nextPage)
        switch (listSongData) {
            case "error":
                setIsNotFound(true)
                break;
            default:
                setListSong(listSong.concat(listSongData['hydra:member']))
                break;
        }
        setNextPageWhenExist(listSongData)
        setIsPartialLoading(false)
    }

    const getSongsRequest = async() => {
        const listSongData = await getSongs(slug)
        switch (listSongData) {
            case "error":
                setIsNotFound(true)
                break;
            default:
                setListSong(listSongData['hydra:member'])
                break;
        }
        setNextPageWhenExist(listSongData)
        setIsLoading(false)
    }

    useEffect(async () => {
        setIsLoading(true)
        const artistData = await getData(slug)
        switch (artistData) {
            case 404:
                setIsNotFound(true)
                setIsLoading(false)
                break;
            case "error":
                setIsNotFound(true)
                setIsLoading(false)
                break;
            default:
                setArtistData(artistData)
                await getSongsRequest()
                break;
        }
    },[slug])

    return <div className="artist-page">
        <Loading isLoading={isLoading} className="artist-page">
            <NotFound isNotFound={isNotFound}>
                <Header
                    title={artistData.name+" - Song"}
                    description={"Découvrez et appréciez toutes les chansons de "+artistData.name}
                    ogOption={{
                        image: artistData.contentUrl
                    }}
                    twitterOption={{
                        image: artistData.contentUrl
                    }}
                />
                <div className="artist-page--content">
                    <div className="artist-page--content--info">
                        <img src={ getTheGoodImage("150px", artistData.contentUrl, artistData.contentImageResponsive) } alt={artistData.name} className="artist-page--content--info--image"/>
                        <h1 className="artist-page--content--info--title">{artistData.name}</h1>
                        <p className="artist-page--content--info--follower">{shortNumber(artistData.nbFollowers)} abonnés</p>
                        <FollowButton slug={slug}/>
                        <p className="artist-page--content--info--desc">
                            {artistData.description}
                        </p>
                    </div>
                    <div className="artist-page--content--songs">
                        <div className="artist-page--content--songs--title">
                            {artistData.nbSongs} chansons
                        </div>
                        <div className="artist-page--content--songs--list">
                            { listSong.map((data) => <SongItem key={data.id} data={data} size="150px"/>) }
                        </div>
                        <div ref={containerRef}></div>
                        <PartialLoading isPartialLoading={isPartialLoading} className="artist-page"/>
                    </div>
                </div>
            </NotFound>
        </Loading>
    </div>
}