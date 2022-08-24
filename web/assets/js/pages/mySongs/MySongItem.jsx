import React from 'react'
import "./MySongItem.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPause, faPlay, faStop, faVolumeMute, faVolumeUp} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import useAudioPlayer from '@app/hooks/useAudioPlayer';
import secondsToHms from '@app/utils/secondsToHms';

function getTheGoodImage(size, rawImage, responsiveImage)
{
    if(size == '150px')
        return responsiveImage?.['150x150'] ?? rawImage
}

export default function MySongItem({data, deleteAction, editLink, statsLink})
{
    const {
        togglePlay,
        stopPlay,
        getIsPlaying,
        toggleMute,
        getIsMute,
        getVolumePercent,
        getAudioPercent,
        changeVolume,
        changePositionOnClick,
        getRestingTime
    } = useAudioPlayer({
        audioUrl: data.contentSongUrl,
        durationOptionnal: data.songDuration
    })

    return <div className="my-song-item">
        <img className="my-song-item--image" src={ getTheGoodImage("150px", data.contentImageUrl, data.contentImageResponsive) } alt={data.name}/>
        <div className="my-song-item--info">
            <div className="my-song-item--info--title">{data.name}</div>
            <div className="my-song-item--info--duration">{secondsToHms(getRestingTime())}</div>
            <div className="my-song-item--info--song">
                <div className="my-song-item--info--song--play">
                    <button className="my-song-item--info--song--play--button" onClick={() => togglePlay()}>
                        <FontAwesomeIcon icon={(!getIsPlaying() ? faPlay : faPause)}/>
                    </button>
                    <button className="my-song-item--info--song--play--button" onClick={() => stopPlay()}>
                        <FontAwesomeIcon icon={faStop}/>
                    </button>
                </div>
                <div className="my-song-item--info--song--volume">
                    <button className="my-song-item--info--song--volume--button" onClick={() => toggleMute()}>
                        <FontAwesomeIcon icon={(getIsMute() ? faVolumeMute : faVolumeUp)}/>
                    </button>
                    <div className="my-song-item--info--song--volume--bar" onClick={(e) => changeVolume(e)} tabIndex="0">
                        <div className="my-song-item--info--song--volume--bar--value" style={{width: getVolumePercent()+"%"}}></div>
                    </div>
                </div>
                <div className='my-song-item--info--song--progressBar' onClick={(e) => changePositionOnClick(e)} tabIndex="0">
                    <div className='my-song-item--info--song--progressBar--value' style={{width: getAudioPercent()+"%"}}>
                    </div>
                </div>
            </div>
        </div>
        <div className="my-song-item--action">
            <Link to={editLink} className="my-song-item--action--edit">Éditer</Link>
            <Link to={statsLink} className="my-song-item--action--stats">Statistique</Link>
            <button className="my-song-item--action--delete" onClick={async () => await deleteAction(data) }>Supprimer</button>
        </div>
    </div>
}