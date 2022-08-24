import React from 'react'
import { Link } from 'react-router-dom'
import './PlaylistItem.scss'
import useLazyLoad from "@app/hooks/useLazyLoad"

function getTheGoodImage(size, rawImage, responsiveImage)
{
    switch (size) {
        case "150px":
            return responsiveImage?.['150x150'] ?? rawImage
        case "200px":
            return responsiveImage?.['200x200'] ?? rawImage
        case "250px":
            return responsiveImage?.['250x250'] ?? rawImage
        default:
            return rawImage
    }
}

export default function PlaylistItem({data,size = "250px"})
{
    const [imgRef] = useLazyLoad();

    return <Link className="playlist-item" style={{"--size": size}} to={"/playlist/"+data.slug}>
        <div className="playlist-item--cont-image">
            <div className="playlist-item--cont-image--wrap">
                <img ref={imgRef} className="playlist-item--cont-image--wrap--image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=" data-src={ getTheGoodImage(size,data.contentImageUrl,data.contentImageResponsive) } alt={data.name} />
            </div>
        </div>
        <div className="playlist-item--info">
            <p className="playlist-item--info--name">
                {data.name}
            </p>
            <p className="playlist-item--info--nb-songs">
                {data.nbSongs} Chanson{data.nbSongs > 1 ? "s" : ""}
            </p>
        </div>
    </Link>
}