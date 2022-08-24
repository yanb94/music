import React, {useEffect, useState} from 'react'
import { faArrowCircleLeft, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SongItem from '@app/module/song-item/SongItem'
import { getNewSongs, getSongs } from './getData'
import { Loading, Error, PartialLoading } from './handlers'
import useInfiniteLoop from '@app/hooks/useInfiniteLoop'

export default function ListSongs({className, isMore, moreAction})
{
    const [listSongs, setListSongs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [nextPage, setNextPage] = useState(null)
    const [isLoadingPartial, setIsLoadingPartial] = useState(false)

    const [enableInfiniteLoop, setEnableInfiniteLoop] = useState(false)

    const [ containerRef ] = useInfiniteLoop({
        loadMore: () => getNextSongs(),
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

    const getNextSongs = async () => {
        setIsLoadingPartial(true)
        const result = await getNewSongs(nextPage)
        switch (result) {
            case "error":
                break;
            default:
                setListSongs(listSongs.concat(result['hydra:member']))
                break;
        }
        setNextPageWhenExist(result)
        setIsLoadingPartial(false)
    }

    useEffect(async() => {
        const result = await getSongs()
        switch (result) {
            case "error":
                setIsError(true)
                break;
            default:
                setListSongs(result['hydra:member'])
                setNextPageWhenExist(result)
                break;
        }
        setIsLoading(false);
    },[])

    return <section className={className}>
        <h1 className={className+"--title"}>Chanson récente
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
                    {listSongs.map((data) => <SongItem key={data.id} data={data} size="150px"/>)}
                </div>
            </Error>
        </Loading>
        { enableInfiniteLoop ? <div ref={containerRef}></div> : ""}
        <PartialLoading isPartialLoading={isLoadingPartial} />
    </section>
}