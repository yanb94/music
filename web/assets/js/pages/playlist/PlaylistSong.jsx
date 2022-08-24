import React, { useEffect, useState } from 'react'
import "./PlaylistSong.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faPlay, faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons'
import secondsToHms from '@app/utils/secondsToHms'
import useAudioPlayer from '@app/hooks/useAudioPlayer'
import { setViewSong } from "./getData"

function getTheGoodImage(size, rawImage, responsiveImage)
{
    if(size == '120px')
        return responsiveImage?.['120x120'] ?? rawImage
}

function ShowIfTrue({condition, children})
{
    return condition ? children : ""
}

export default function PlaylistSong({data, playChild, index, next, current, setPlay, currentVolume, setCurrentVolume, manageView, isSubscribe})
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
        getRestingTime,
        isEnded
    } = useAudioPlayer({
        audioUrl: data.contentSongUrl,
        durationOptionnal: data.songDuration,
        volume: currentVolume
    })

    playChild.current[index] = togglePlay;


    useEffect(() => {

        if(isEnded())
        {
            stopPlay()
            next()
        }

    },[isEnded()])

    const [viewSend, setViewSend] = useState(false)

    useEffect( async() => {

        if(getIsPlaying() && !viewSend)
        {
            await setViewSong(data.id)
            setViewSend(true)
        }

    },[getIsPlaying()])

    const togglePlayGlobally = () => {
        const state = getIsPlaying()
        setPlay(!state)
        togglePlay()
        manageView()
    }

    return <div className="playlist-song">
        <div className="playlist-song--image-cont">
            <img className="playlist-song--image-cont--image" src={ getTheGoodImage("120px", data.contentImageUrl, data.contentImageResponsive) } alt={data.name} />
            <ShowIfTrue condition={isSubscribe && index == current}>
                <div className="playlist-song--image-cont--button" onClick={() => togglePlayGlobally()}>
                    <FontAwesomeIcon icon={!getIsPlaying() ? faPlay : faPause}/>
                </div>
            </ShowIfTrue>
        </div>
        <div className="playlist-song--info">
            <div className="playlist-song--info--title">
                {data.name}
            </div>
            <div className="playlist-song--info--author">
                De {data.author.name}
            </div>
            <div className="playlist-song--info--progress-cont">
                <ShowIfTrue condition={isSubscribe && index == current}>
                    <div className="playlist-song--info--progress-cont--progress" onClick={(e) => changePositionOnClick(e)}>
                        <div className="playlist-song--info--progress-cont--progress--value" style={{width: getAudioPercent()+"%"}}></div>
                    </div>
                </ShowIfTrue>
            </div>
            <div className="playlist-song--info--time">
                {secondsToHms(getRestingTime())}
            </div>
            <ShowIfTrue condition={isSubscribe && index == current}>
                <div className="playlist-song--info--volume">
                    <button className="playlist-song--info--volume--button" onClick={() => {toggleMute(); setCurrentVolume(0) }}>
                        <FontAwesomeIcon icon={(getIsMute() ? faVolumeMute : faVolumeUp)} />
                    </button>
                    <div className="playlist-song--info--volume--bar" onClick={(e) => setCurrentVolume(changeVolume(e))}>
                        <div className="playlist-song--info--volume--bar--value" style={{width: getVolumePercent()+"%"}}></div>    
                    </div>
                </div>
            </ShowIfTrue>
        </div>
    </div>
}