import React, {useState, useEffect} from 'react'
import './OtherSongs.scss'
import { Loading, Error } from './handlers'
import { getOtherSongs } from './getData'
import SongItem from '@app/module/song-item/SongItem'

export default function OtherSongs({data})
{
    const [otherSongs, setOtherSongs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    useEffect(async() => {
        const result = await getOtherSongs(data.slug)
        switch (result) {
            case "error":
                setIsError(true)
                break;
            default:
                setOtherSongs(result['hydra:member'])
                break;
        }
        setIsLoading(false);
    },[])

    return <section className="other-song">
        <h1 className="other-song--title">Chanson à découvrir</h1>
        <Loading isLoading={isLoading}>
            <Error isError={isError} className="other-song">
                <div className="other-song--list">
                    {otherSongs.map((data) => <SongItem key={data.id} data={data} size="150px"/>)}
                </div>
            </Error>
        </Loading>
    </section>
}