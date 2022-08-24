import React, {useState, useEffect} from 'react'
import './OtherPlaylists.scss'
import { Loading, Error } from './handlers'
import PlaylistItem from '@app/module/playlist-item/PlaylistItem'
import { getRandomPlaylists } from './getData'

export default function OtherPlaylists()
{
    const [otherPlaylists, setOtherPlaylists] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    useEffect(async() => {
        const result = await getRandomPlaylists()
        switch (result) {
            case "error":
                setIsError(true)
                break;
            default:
                setOtherPlaylists(result['hydra:member'])
                break;
        }
        setIsLoading(false);
    },[])

    return <section className="other-playlist">
        <h1 className="other-playlist--title">Playlist à découvrir</h1>
        <Loading isLoading={isLoading}>
            <Error isError={isError} className="other-playlist">
                <div className="other-playlist--list">
                    {otherPlaylists.map((data) => <PlaylistItem key={data.id} data={data} size="150px"/>)}
                </div>
            </Error>
        </Loading>
    </section>
}