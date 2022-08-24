import React, {useEffect, useRef, useState} from "react";

export default function useAudioPlayer({audioUrl,durationOptionnal = 0, volume = 0.5})
{
    const [audio, setAudio] = useState(null);
    const audioRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMute, setIsMute] = useState(true)
    const [changeVolumeToggle, setChangeVolumeToggle] = useState(true);
    const [progressUpdate, setProgressUpdate] = useState(null);
    const progressUpdateRef = useRef();

    const [currentTime, setCurrentTime] = useState(0)

    const [ended, setEnded] = useState(false);

    const reset = () => {
        audioRef.current = null
        
        if(audio != null)
            audio.currentTime = 0

        setAudio(null)
        setIsPlaying(false)
        setIsMute(false)
        setChangeVolumeToggle(true)
        window.clearInterval(progressUpdate)
        setProgressUpdate(null)
        setCurrentTime(0)
    }

    const getUpdateTime = (audio) => {
        const interval = setInterval(() => {
            setCurrentTime(audio.currentTime)
            if(audio.currentTime == audio.duration)
            {
                clearInterval(interval)
                setIsPlaying(false)
                audio.currentTime = 0
                setCurrentTime(0)
            }
        },100)

        return interval;
    };

    const getAudioPercent = () => {
        return percent(audio?.currentTime, audio?.duration)
    }

    const getVolumePercent = () => {
        return percent(audio?.volume, 1)
    }

    const getIsMute = () => {
        return isMute
    }

    const getIsPlaying = () => {
        return isPlaying
    }

    const returnZeroIfNull = (value) => value ?? 0 

    const getRestingTime = () => {
        const duration = audio?.duration == null || audio?.duration == undefined || isNaN(audio?.duration) ? durationOptionnal : audio.duration
        return duration - returnZeroIfNull(audio?.currentTime)
    }

    const togglePlay = () => {
        
        let audioFile = null
        
        setEnded(false)

        if(audio == null)
        {
            audioFile = new Audio(audioUrl)
            audioFile.volume = volume
            audioFile.addEventListener('ended',() => setEnded(true));
            audioRef.current = audioFile
            setAudio(audioFile)

            if(audioFile.volume <= 0)
                setIsMute(true)
            else
                setIsMute(false)
        }
        else
            audioFile = audio
        
        if(isPlaying)
        {
            audioFile.pause()
            window.clearInterval(progressUpdate)
            setIsPlaying(false)
        }
        else
        {         
            audioFile.play()

            const localProgressUpdate = getUpdateTime(audioFile)
            setProgressUpdate(localProgressUpdate)
            progressUpdateRef.current = localProgressUpdate

            window.setInterval(progressUpdate)
            setIsPlaying(true)
        }
    }

    const stopPlay = () => {
        audio.pause()
        window.clearInterval(progressUpdate)
        setIsPlaying(false)
        audio.currentTime = 0
        setCurrentTime(0)
    }

    const percent = (value,total) => {
        return (value/total)*100
    }

    const toggleMute = () => {
        
        if(audio == null)
            return;
        
        if(!isMute)
            audio.volume = 0
        else
            audio.volume = 1
        setIsMute(!isMute)
    }

    const changeVolume = (e) => {

        if(audio == null)
            return;

        const target = e.currentTarget;

        const rect = target.getBoundingClientRect();

        const x = e.clientX - rect.left;

        if(x < 0){
            audio.volume = 0
            setChangeVolumeToggle(!changeVolumeToggle);
            setIsMute(true)
            return;
        }

        const percentToApply = percent(x,rect.width) / 100;
        audio.volume = 1 * percentToApply

        setChangeVolumeToggle(!changeVolumeToggle);
        if(audio.volume > 0)
            setIsMute(false)
        
        return audio.volume
    }

    const changePositionOnClick = (e) => {
        
        if(audio?.duration == null)
            return;

        const target = e.currentTarget;

        const rect = target.getBoundingClientRect();

        const x = e.clientX - rect.left;

        const percentToApply = percent(x,rect.width) / 100;
        audio.currentTime = audio.duration * percentToApply

        setCurrentTime(audio.currentTime)
    }

    const isEnded = () => ended

    useEffect(() =>{
        return () => {
            
            if(progressUpdateRef.current != null)
                window.clearInterval(progressUpdateRef.current)

            if(audioRef.current != null)
            {
                audioRef.current.pause()
                audioRef.current.remove()   
            }           
        }
    },[])

    return {
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
        reset,
        isEnded
    }
}