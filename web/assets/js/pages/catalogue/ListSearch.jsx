import PlaylistItem from '@app/module/playlist-item/PlaylistItem'
import SongItem from '@app/module/song-item/SongItem'
import React, {useState, useEffect} from 'react'
import { getNewSearch, getSearch } from './getData'
import { PartialLoading, Loading, Error } from './handlers'
import useInfiniteLoop from '@app/hooks/useInfiniteLoop'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons'

export default function ListSearch({search, className, previousAction})
{
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    const [nbElements, setNbElements] = useState(0)
    const [elements, setElements] = useState([])

    const [nextPage, setNextPage] = useState(null)
    const [isLoadingPartial, setIsLoadingPartial] = useState(false)

    const [ containerRef ] = useInfiniteLoop({
        loadMore: () => addNewSearch(),
        stopLoad: () => isLoadMore()
    })

    const showGoodView = (data) => {
        switch (data['@type']) {
            case "Song":
                return <SongItem key={data.id} data={data} size="150px"/>
            case "Playlist":
                return <PlaylistItem key={data.id} data={data} size="150px"/>
            default:
                break;
        }
    }

    const setNextPageWhenExist = (result) => {
        if(!result['hydra:view'] || !result['hydra:view']['hydra:next'])
            setNextPage(null)
        else
            setNextPage(result['hydra:view']['hydra:next'])
    }

    const addNewSearch = async() => {
        setIsLoadingPartial(true)
        const result = await getNewSearch(nextPage)
        switch (result) {
            case "error":
                break;
            default:
                setElements(elements.concat(result['hydra:member']))
                break;
        }
        setNextPageWhenExist(result)
        setIsLoadingPartial(false)
    }

    const isLoadMore = () => {
        return nextPage
    }

    useEffect(async() => {
        const result = await getSearch(search)
        switch (result) {
            case "error":
                setIsError(true)
                break;
            default:
                setElements(result['hydra:member'])
                setNbElements(result['hydra:totalItems'])
                setNextPageWhenExist(result)
                break;
        }
        setIsLoading(false);
    },[search])

    return <section className={className}>
        <Loading isLoading={isLoading}>
            <Error isError={isError} className={className}>
                <h1 className={className+"--title"}> {nbElements} Résultats trouvé pour "{search}" 
                    <div className={className+"--title--more"} tabIndex="0" onClick={() => previousAction()}>
                        <FontAwesomeIcon icon={faArrowCircleLeft}/>
                    </div>
                    <div className={className+"--title--more-text"} tabIndex="0" onClick={() => previousAction()}>
                        Revenir 
                    </div>
                </h1>
                <div className={className+"--list"}>
                    {elements.map((data) => showGoodView(data))}
                </div>
                <div ref={containerRef}></div>
                <PartialLoading isPartialLoading={isLoadingPartial} />
            </Error>
        </Loading>
    </section>
}