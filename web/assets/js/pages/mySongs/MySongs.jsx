import { useAuth } from '@app/auth/auth'
import Loader from '@app/module/loader/Loader'
import React, { useEffect, useState } from 'react'
import { getData, getNewData, getDataAutocomplete, deleteSong } from './getData'
import './MySongs.scss'
import MySongItem from './MySongItem'
import useInfiniteLoop from '@app/hooks/useInfiniteLoop'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import Header from '@app/module/header/Header'

function MySongsLoading({isLoading, children})
{
    return !isLoading ? children : <div className="my-songs--content--list--loading">
        <Loader/>
    </div>
}

function MySongError({isError, children})
{
    return !isError ? children : <div className="my-songs--content--list--error">
        Une erreur sur le serveur nous empêche de récupérer les données demandées.
        Veuillez réessayer ultérieurement.
    </div>
}

function MySongsPartialLoading({isLoadingPartial})
{
    return !isLoadingPartial ? "" : <div  className="my-songs--content--list--partialLoading">
        <Loader size="80px" />
    </div>
}

export default function MySongs()
{
    const {auth, logout} = useAuth()
    const [songs, setSongs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingPartial, setIsLoadingPartial] = useState(false);
    const [isError, setIsError] = useState(false)
    const [nextPage, setNextPage] = useState(null)

    const [callAutocomplete, setCallAutoComplete] = useState(null)

    const [ containerRef ] = useInfiniteLoop({
        loadMore: () => getNewSongs(),
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

    const getNewSongs = async () => {
        setIsLoadingPartial(true)
        const songsResult = await getNewData(auth.token, nextPage)
        switch (songsResult) {
            case 401:
                logout()
                break;
            case "error":
                break;
            default:
                setSongs(songs.concat(songsResult['hydra:member']))
                break;
        }
        setNextPageWhenExist(songsResult)
        setIsLoadingPartial(false)
    }

    const getDataSearch = async (value) => {
        initData(await getDataAutocomplete(value, auth.token))
    }

    const filterBySearch = async(searchValue) => {

        clearTimeout(callAutocomplete)
        if(searchValue == 0)
            return await initData(await getData(auth.token))
        else if(searchValue.length < 3)
            return;
        
        setCallAutoComplete(setTimeout(async() => await getDataSearch(searchValue), 1000))
    }

    const initData = async (request) => {
        setIsLoading(true)
        const songsResult = request
        switch (songsResult) {
            case 401:
                logout()
                break;
            case "error":
                setIsError(true)
                break;
            default:
                setSongs(songsResult['hydra:member'])
                break;
        }
        setNextPageWhenExist(songsResult)
        setIsLoading(false)
    }

    useEffect(async () => {
        initData(await getData(auth.token))
    },[])

    const deleteAction = async (data) => {
        const confirmResult = confirm("Voulez vous supprimer la chanson "+data.name+" ?")
        if(confirmResult)
        {
            const result = await deleteSong(data.slug,auth.token)

            switch (result) {
                case "error":
                    alert("Une erreur sur le serveur n'a pas permit de supprimer cette chanson. Veuillez réassayer ultérieurement.")
                    break
                case "ok":
                    initData(await getData(auth.token))
                    break
                case 401:
                    logout()
                    break
            }
        }
    }

    return <div className="my-songs">
        <Header
            title="Mes chansons"
            description="Mes chansons"
        />
        <div className="my-songs--content">
            <h1 className="my-songs--content--title">
                Mes chansons
                <Link className="my-songs--content--add" to="/space-member/add-song">Ajouter</Link>
            </h1>
            <div className="my-songs--content--search">
                <input type="search" name="search" id="search" onChange={(e) => filterBySearch(e.target.value)}/>
                <FontAwesomeIcon icon={faSearch} color={"#FFF"} />
            </div>
            <div className="my-songs--content--list">
                <MySongError isError={isError}>
                    <MySongsLoading isLoading={isLoading}>
                        {songs && songs.length > 0 ? songs.map((value) => <MySongItem key={value.id} data={value} deleteAction={deleteAction} editLink={"/space-member/edit-song/"+value.slug} statsLink={"/space-member/stats-song/"+value.slug}/>) : 
                            <div className="my-songs--content--list--notFound">
                                Aucune chanson trouvée
                            </div>
                        }
                        <div ref={containerRef}></div>
                        <MySongsPartialLoading isLoadingPartial={isLoadingPartial} />
                    </MySongsLoading>
                </MySongError>
            </div>
        </div>
    </div>
}