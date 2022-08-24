import React, {useState, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons'
import PlaylistItem from '@app/module/playlist-item/PlaylistItem'
import { Error, Loading, PartialLoading } from './handlers'
import { getPlaylists, getNewPlaylists } from './getData'
import useInfiniteLoop from '@app/hooks/useInfiniteLoop'

export default function ListPlaylists({className, isMore, moreAction})
{
    const [listPlaylists, setListPlaylists] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [nextPage, setNextPage] = useState(null)
    const [isLoadingPartial, setIsLoadingPartial] = useState(false)

    const [enableInfiniteLoop, setEnableInfiniteLoop] = useState(false)

    const [ containerRef ] = useInfiniteLoop({
        loadMore: () => getNextPlaylists(),
        stopLoad: () => isLoadMore()
    })

    const loadMore = (moreAction) => {
        moreAction(!isMore)
        setEnableInfiniteLoop(true)
    }

    const setNextPageWhenExist = (result) => {
        if(!result['hydra:view'] || !result['hydra:view']['hydra:next'])
            setNextPage(null)
        else
            setNextPage(result['hydra:view']['hydra:next'])
    }

    const isLoadMore = () => {
        return nextPage
    }

    const getNextPlaylists = async () => {
        setIsLoadingPartial(true)
        const result = await getNewPlaylists(nextPage)
        switch (result) {
            case "error":
                break;
            default:
                setListPlaylists(listPlaylists.concat(result['hydra:member']))
                break;
        }
        setNextPageWhenExist(result)
        setIsLoadingPartial(false)
    }

    useEffect(async() => {
        const result = await getPlaylists()
        switch (result) {
            case "error":
                setIsError(true)
                break;
            default:
                setListPlaylists(result['hydra:member'])
                setNextPageWhenExist(result)
                break;
        }
        setIsLoading(false);
    },[])

    return <section className={className}>
        <h1 className={className+"--title"}>Playlist Populaire
            <div className={className+"--title--more"} tabIndex="0" onClick={() => loadMore(moreAction)}>
                {isMore ? <FontAwesomeIcon icon={faArrowCircleLeft}/> : <FontAwesomeIcon icon={faPlus}/>}
            </div>
            <div className={className+"--title--more-text"} tabIndex="0" onClick={() => loadMore(moreAction)}>
                {isMore ? "Revenir" : "Voir plus"} 
            </div>
        </h1>
        <Loading isLoading={isLoading}>
            <Error isError={isError} className={className}>
                <div className={className+"--list"}>
                    {listPlaylists.map((data) => <PlaylistItem key={data.id} data={data} size="150px"/>)}
                </div>
            </Error>
        </Loading>
        { enableInfiniteLoop ? <div ref={containerRef}></div> : ""}
        <PartialLoading isPartialLoading={isLoadingPartial} />
    </section>
}