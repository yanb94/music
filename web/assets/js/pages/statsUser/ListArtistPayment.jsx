import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons'
import { getArtistPayment, getNextArtistPayment } from './getData';
import { useAuth } from '@app/auth/auth';
import ShowChildIfTrue from '@app/utils/ShowChildIfTrue';
import Loader from '@app/module/loader/Loader';
import useInfiniteLoop from '@app/hooks/useInfiniteLoop';

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

function priceShow(amount) {
    return (amount / 100)+"€" 
}

function PaymentArtistItem({data})
{
    const [show,setShow] = useState(false);

    return <div className="stats-user--content--paiement-item">
        <div className="stats-user--content--paiement-item--id">
            { pad(data?.id,10) }
        </div>
        <div className={"stats-user--content--paiement-item--month"+(!show ? " hidden" : "")}>
            <span className="stats-user--content--paiement-item--phone-label">Mois:</span> { data?.month }
        </div>
        <div className={"stats-user--content--paiement-item--status"+(!show ? " hidden" : "")}>
            <span className="stats-user--content--paiement-item--phone-label">Status:</span> { data?.status }
        </div>
        <div className={"stats-user--content--paiement-item--amount"+(!show ? " hidden" : "")}>
            <span className="stats-user--content--paiement-item--phone-label">Montant:</span> { priceShow(data?.amount) }
        </div>
        <div className="stats-user--content--paiement-item--see-more">
            <FontAwesomeIcon icon={(!show ? faSortDown : faSortUp)} onClick={() => setShow(!show)} />
        </div>
    </div>
}

export default function ListArtistPayment()
{
    const [listPayment, setListPayment] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [nextPage, setNextPage] = useState(null)

    const [isPartialLoading, setIsPartialLoading] = useState(false)

    const { auth, logout } = useAuth(); 

    const [containerRef] = useInfiniteLoop({
        loadMore: () => getNewPayment(),
        stopLoad: () => isLoadMore()
    })

    const isLoadMore = () => {
        return nextPage
    }

    const setNextPageWhenExist = (result) => {
        if(!result['hydra:view'] || !result['hydra:view']['hydra:next'])
            setNextPage(null)
        else
            setNextPage(result['hydra:view']['hydra:next'])
    }

    const getNewPayment = async() => {

        setIsPartialLoading(true)

        const result = await getNextArtistPayment(nextPage,auth.token)

        switch (result) {
            case 401:
                logout();
                break;
            case "error":
                setIsError(true)
                break;
            default:
                setNextPageWhenExist(result)
                setListPayment(listPayment.concat(result['hydra:member']))
                break;
        }

        setIsPartialLoading(false)
    }

    useEffect(async () => {

        const result = await getArtistPayment(auth.token)
        switch (result) {
            case 401:
                logout();
                break;
            case "error":
                setIsError(true)
                break;
            default:
                setNextPageWhenExist(result)
                setListPayment(result['hydra:member'])
                break;
        }
        setIsLoading(false)
    },[])

    return <>
        <ShowChildIfTrue isControl={!isLoading} alternateElem={ <div className="stats-user--content--loader"><Loader size="100px"/></div> }>
            <ShowChildIfTrue isControl={!isError} alternateElem={ <div className="stats-user--content--error"> Une erreur n'a pas permit de récupérer vos paiements. Veuillez réessayer ultérieurement. </div> } >
                <>
                    <div className="stats-user--content--paiement-title">
                        Vos derniers paiements
                    </div>
                    <div className="stats-user--content--paiement-list">
                        <div className="stats-user--content--paiement-label">
                            <div className="stats-user--content--paiement-label--id">
                                Identifiant
                            </div>
                            <div className="stats-user--content--paiement-label--month">
                                Mois
                            </div>
                            <div className="stats-user--content--paiement-label--status">
                                Status
                            </div>
                            <div className="stats-user--content--paiement-label--amount">
                                Montant
                            </div>
                        </div>
                        {listPayment.map((data) => <PaymentArtistItem key={data?.id} data={data}/>)}
                        <div ref={containerRef}></div>
                        <ShowChildIfTrue isControl={isPartialLoading} alternateElem="">
                            <div className="stats-user--content--partial-loader">
                                <Loader size="50px"/>
                            </div>
                        </ShowChildIfTrue>
                    </div>
                </>
            </ShowChildIfTrue>
        </ShowChildIfTrue>
    </>
}