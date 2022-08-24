import ShowChildIfTrue from '@app/utils/ShowChildIfTrue';
import React, { useEffect, useState } from 'react'
import './Onglet.scss'
import Loader from '@app/module/loader/Loader';
import { useAuth } from '@app/auth/auth';
import useInfiniteLoop from '@app/hooks/useInfiniteLoop';

export default function Onglet({getInitial, getNext, showFunction})
{
    const [list, setList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const [nextPage, setNextPage] = useState(null)
    const [isLoadingPartial, setIsLoadingPartial] = useState(false)

    const {auth, logout} = useAuth()

    const [ containerRef ] = useInfiniteLoop({
        loadMore: () => getNextItems(),
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

    const getNextItems = async () => {
        setIsLoadingPartial(true)
        const result = await getNext(nextPage,auth.token)
        switch (result) {
            case "error":
                break;
            case 401:
                logout()
                break;
            default:
                setList(list.concat(result['hydra:member']))
                break;
        }
        setNextPageWhenExist(result)
        setIsLoadingPartial(false)
    }

    useEffect(async() => {
        const result = await getInitial(auth.token)

        switch (result) {
            case 'error':
                setIsError(true)
                break;
            case 401:
                logout()
                break;
            default:
                setList(result['hydra:member'])
                setNextPageWhenExist(result)
                break;
        }
        setIsLoading(false);
    },[])


    return <div className="onglet">
        <ShowChildIfTrue isControl={!isLoading} alternateElem={
            <div className="onglet--loading">
                <Loader size="150px"/>
            </div>
        }>
            <ShowChildIfTrue isControl={!isError} alternateElem={
                <div className="onglet--error">
                    Une erreur ne nous a pas permit de récupérer les données demandées.<br/> Veuillez actualiser la page. 
                </div>
            }>
                <div className="onglet--list">
                    { list.map((value) => showFunction(value)) }
                </div>
                <div ref={containerRef}></div>
                <ShowChildIfTrue isControl={isLoadingPartial} alternateElem="" >
                    <div className="onglet--partial-loading">
                        <Loader size="100px"/>
                    </div>
                </ShowChildIfTrue>
            </ShowChildIfTrue>
        </ShowChildIfTrue>
    </div>
}