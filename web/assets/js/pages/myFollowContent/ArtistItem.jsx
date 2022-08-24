import React from 'react'
import './ArtistItem.scss'
import shortNumber from '@app/utils/shortNumber'
import FollowButton from '@app/module/follow-button/FollowButton'
import { Link } from 'react-router-dom'

function getTheGoodImage(size, rawImage, responsiveImage)
{
    if(size == '130px')
        return responsiveImage?.['130x130'] ?? rawImage
}

export default function ArtistItem({data, size = "130px"})
{
    return <div className="artist-item" style={{width: size}}>
        <Link to={"/artist/"+data.slug}>
            <img className="artist-item--img" style={{height: size}} src={ getTheGoodImage(size, data.contentUrl, data.contentImageResponsive) } alt={data.name} />
        </Link>
        <div className="artist-item--title">
            <Link to={"/artist/"+data.slug}>{data.name}</Link>
        </div>
        <div className="artist-item--nb-follower">{shortNumber(data.nbFollowers)} abonnés</div>
        <FollowButton slug={data.slug}/>
    </div>
}