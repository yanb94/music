import React from 'react'
import './MyPlaylistItem.scss'
import { Link } from 'react-router-dom'

function getTheGoodImage(size, rawImage, responsiveImage)
{
    if(size == '150px')
        return responsiveImage?.['150x150'] ?? rawImage
}

export default function MyPlaylistItem({data, deleteAction, statsLink})
{
    return <div className="my-playlist-item">
        <img className="my-playlist-item--image" src={ getTheGoodImage("150px", data.contentImageUrl, data.contentImageResponsive) } alt={data.name}/>
        <div className="my-playlist-item--info">
            <div className="my-playlist-item--info--title">{data.name}</div>
            <div className="my-playlist-item--info--public">Status: <span>{data.isPublic ? "Public" : "Privée"}</span></div>
            <div className="my-playlist-item--info--nb-songs">Nb de chansons: <span>{data.nbSongs}</span></div>
        </div>
        <div className="my-playlist-item--action">
            <Link to={'/space-member/edit-playlists/'+data.slug} className="my-playlist-item--action--edit">Éditer</Link>
            <Link to={statsLink} className="my-playlist-item--action--stats">Statistique</Link>
            <button className="my-playlist-item--action--delete" onClick={async () => await deleteAction(data) }>Supprimer</button>
        </div>
    </div>
}