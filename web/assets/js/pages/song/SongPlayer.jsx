import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop, faVolumeMute, faPause, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import secondsToHms from '@app/utils/secondsToHms';
import useAudioPlayer from '@app/hooks/useAudioPlayer';
import { setView } from './getData';
import Button from '@app/module/button/Button';
import { Link } from 'react-router-dom'

function getTheGoodImage(size, rawImage, responsiveImage)
{
    if(size == '850x500')
        return responsiveImage?.['850x500'] ?? rawImage
}

function WhenNotAllowed({auth})
{
    const link = () => {
        return auth?.isAuth ? "/space-member/subscribe" : "/register"
    }

    return <div className="song-page--content--player--not-allow">
        <div className="song-page--content--player--not-allow--msg">
            Abonner vous pour écouter ce morceau
        </div>
        <div className="song-page--content--player--not-allow--cont-button">
            <Link to={link()}>
                <Button theme="secondary">
                    S'abonner
                </Button>
            </Link>
        </div>
    </div>
}

export default function SongPlayer({songData, allowToListen, auth})
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
        audioUrl: songData.contentSongUrl,
        durationOptionnal: songData.songDuration
    })

    const [viewSend, setViewSend] = useState(false)

    const startSong = async () => {
        togglePlay()
        if(!viewSend)
        {   
            await setView(songData.id)
            setViewSend(true)
        }
    }

    return <div className="song-page--content--player">
        <img className="song-page--content--player--image" src={ getTheGoodImage('850x500', songData.contentImageUrl, songData.contentImageResponsive) } alt={songData.name} />
        {
            allowToListen ?
            <div className="song-page--content--player--button" onClick={() => startSong()}>
                <FontAwesomeIcon className={(!getIsPlaying() ? "song-page--content--player--button--play" : "")} icon={(!getIsPlaying() ? faPlay : faPause)}/>
            </div>
            : <WhenNotAllowed auth={auth}/>
        }
        {
            allowToListen ?
            <div className="song-page--content--player--bar">
                <div className="song-page--content--player--bar--actions">
                    <button className="song-page--content--player--bar--actions--play" onClick={() => startSong()}>
                        <FontAwesomeIcon icon={(!getIsPlaying() ? faPlay : faPause)}/>
                    </button>
                    <button className="song-page--content--player--bar--actions--stop" onClick={() => stopPlay()}>
                        <FontAwesomeIcon icon={faStop}/>
                    </button>
                </div>
                <div className="song-page--content--player--bar--progress" onClick={(e) => changePositionOnClick(e)}>
                    <div className="song-page--content--player--bar--progress--value" style={{width: getAudioPercent()+"%"}}></div>
                </div>
                <div className="song-page--content--player--bar--time">
                    {secondsToHms(getRestingTime())}
                </div>
                <div className="song-page--content--player--bar--volume">
                    <button className="song-page--content--player--bar--volume--button" onClick={() => toggleMute()}>
                        <FontAwesomeIcon icon={(getIsMute() ? faVolumeMute : faVolumeUp)} />
                    </button>
                    <div className="song-page--content--player--bar--volume--bar" onClick={(e) => changeVolume(e)}>
                        <div className="song-page--content--player--bar--volume--bar--value" style={{width: getVolumePercent()+"%"}}></div>    
                    </div>
                </div>
            </div>
            : ""
        }
    </div>
}