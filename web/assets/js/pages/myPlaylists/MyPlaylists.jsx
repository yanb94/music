import React, { useEffect, useState } from 'react'
import './MyPlaylists.scss'
import { getData, getNewData, getDataAutocomplete, deletePlaylist } from './getData'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { useAuth } from '@app/auth/auth'
import Loader from '@app/module/loader/Loader'
import MyPlaylistItem from './MyPlaylistItem'
import useInfiniteLoop from '@app/hooks/useInfiniteLoop'
import Header from '@app/module/header/Header'

function MyPlaylistsLoading({isLoading, children})
{
    return !isLoading ? children : <div className="my-playlists--content--list--loading">
        <Loader/>
    </div>
}

function MyPlaylistsError({isError, children})
{
    return !isError ? children : <div className="my-playlists--content--list--error">
        Une erreur sur le serveur nous empêche de récupérer les données demandées.
        Veuillez réessayer ultérieurement.
    </div>
}

function MyPlaylistsEmpty({list, children})
{
    if(!list || list.length <= 0)
        return <div className="my-playlists--content--list--notFound">
            Aucune playlist trouvée
        </div>

    return children
}

function MyPlaylistsPartialLoading({isLoadingPartial})
{
    return !isLoadingPartial ? "" : <div  className="my-playlists--content--list--partialLoading">
        <Loader size="80px" />
    </div>
}

export default function MyPlaylist()
{
    const [playlists,setPlaylists] = useState([])
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [nextPage, setNextPage] = useState(null)
    const [isLoadingPartial, setIsLoadingPartial] = useState(false);

    const [callAutocomplete, setCallAutoComplete] = useState(null)

    const {auth, logout} = useAuth()

    const [containerRef] = useInfiniteLoop({
        loadMore: () => getNewPlaylists(),
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

    const getNewPlaylists = async () => {
        setIsLoadingPartial(true)
        const playlistsResult = await getNewData(auth.token, nextPage)
        switch (playlistsResult) {
            case 401:
                logout()
                break;
            case "error":
                break;
            default:
                setPlaylists(playlists.concat(playlistsResult['hydra:member']))
                break;
        }
        setNextPageWhenExist(playlistsResult)
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
        const playlistsResult = request
        switch (playlistsResult) {
            case 401:
                logout()
                break;
            case "error":
                setIsError(true)
                break;
            default:
                setPlaylists(playlistsResult['hydra:member'])
                break;
        }
        setNextPageWhenExist(playlistsResult)
        setIsLoading(false)
    }

    useEffect(async () => {
        initData(await getData(auth.token))
    },[])

    const deleteAction = async (data) => {
        const confirmResult = confirm("Voulez vous supprimer la playlist "+data.name+" ?")
        if(confirmResult)
        {
            const result = await deletePlaylist(data.slug,auth.token)
            switch (result) {
                case "error":
                    alert("Une erreur sur le serveur n'a pas permit de supprimer cette playlist. Veuillez réassayer ultérieurement.")
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

    return <div className="my-playlists">
        <div className="my-playlists--content">
            <h1 className="my-playlists--content--title">
                Mes playlists
                <Link className="my-playlists--content--add" to="/space-member/add-playlists">Ajouter</Link>
            </h1>
            <div className="my-playlists--content--search">
                <input type="search" name="search" id="search" onChange={(e) => filterBySearch(e.target.value)}/>
                <FontAwesomeIcon icon={faSearch} color={"#FFF"} />
            </div>
            <div className="my-playlists--content--list">
                <MyPlaylistsError isError={isError}>
                    <MyPlaylistsLoading isLoading={isLoading}>
                        <Header
                            title="Mes playlists"
                            description="Mes playlists"
                        />
                        <MyPlaylistsEmpty list={playlists}>
                            { playlists.map((value) => <MyPlaylistItem key={value['id']} data={value} deleteAction={deleteAction}  statsLink={"/space-member/stats-playlist/"+value.slug}/> ) }
                            <div ref={containerRef}></div>
                            <MyPlaylistsPartialLoading isLoadingPartial={isLoadingPartial}/>
                        </MyPlaylistsEmpty>
                    </MyPlaylistsLoading>
                </MyPlaylistsError>
            </div>
        </div>
    </div>
}