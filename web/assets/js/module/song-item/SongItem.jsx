import React from "react";
import "./SongItem.scss";
import moment from 'moment'
import { Link, useHistory } from "react-router-dom";
import secondsToHms from "@app/utils/secondsToHms";
import useLazyLoad from "@app/hooks/useLazyLoad";


function ago(date)
{
    return moment(date).locale('fr').fromNow();
}

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

export default function SongItem({data,size = "250px"})
{
    const [imgRef] = useLazyLoad();

    return <Link className="song-item" style={{"--size": size}} to={"/song/"+data.slug}>
        <div className="song-item--cont-image">
            <img ref={imgRef} className="song-item--cont-image--image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=" data-src={ getTheGoodImage(size,data.contentImageUrl,data.contentImageResponsive) } alt={data.name} />
            <div className="song-item--cont-image--duration">
                {secondsToHms(data.songDuration)}
            </div>
        </div>
        <div className="song-item--info">
            <p className="song-item--info--name">
                {data.name}
            </p>
            <p className="song-item--info--date">
                {ago(data.createdAt)}
            </p>
        </div>
    </Link>
}