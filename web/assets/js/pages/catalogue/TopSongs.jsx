import React, { useEffect, useState } from 'react'
import SongItem from '@app/module/song-item/SongItem';
import { getTopSongs } from './getData';
import { Error, Loading } from './handlers';

export default function TopSongs({className})
{
    const [listSongs, setListSongs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    useEffect(async() => {
        const result = await getTopSongs()
        switch (result) {
            case "error":
                setIsError(true)
                break;
            default:
                setListSongs(result['hydra:member'])
                break;
        }
        setIsLoading(false);
    },[])

    return <section className={className}>
        <h1 className={className+"--title"}>Chanson en une</h1>
        <Loading isLoading={isLoading}>
            <Error isError={isError} className={className}>
                <div className={className+"--list"}>
                    {listSongs.map((data) => <SongItem key={data.id} data={data} size="200px"/>)}
                </div>
            </Error>
        </Loading>
    </section>
    
}