import React, { useEffect, useState } from 'react'
import './PinPlaylistButton.scss'
import { checkIsPin, pinPlaylist, unPinPlaylist } from './getData';
import Button from '@app/module/button/Button';
import { useAuth } from '@app/auth/auth';
import Loader from '@app/module/loader/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';

function ShowIfTrue({control, alternateElement ,children})
{
    return control ? children : alternateElement;
}

export default function PinPlaylistButton({slug ,style, className = ''})
{
    const [isLoading, setIsLoading] = useState(true);
    const [isPinned, setIsPinned] = useState(false);
    const [isError, setIsError] = useState(true)

    const { auth, logout } = useAuth()

    const pinThePlaylistAction = async () => {
        setIsLoading(true)
        const result = await pinPlaylist(slug, auth.token);

        switch (result) {
            case "error":
                setIsError(true)
                break;
            default:
                setIsPinned(true)
                break;
        }
        setIsLoading(false)
    }

    const unPinThePlaylistAction = async () => {
        setIsLoading(true)
        const result = await unPinPlaylist(slug, auth.token);

        switch (result) {
            case "error":
                setIsError(true)
                break;
            default:
                setIsPinned(false)
                break;
        }
        setIsLoading(false)
    }

    const initButton = async () => {

        if(!auth.isAuth) return;

        setIsLoading(true)
        setIsError(false)
        const result = await checkIsPin(slug, auth.token)
        switch (result) {
            case "error":
                setIsError(true)
                break;
            case 401:
                logout()
                break;
            default:
                setIsPinned(result['isPinned'])
                break;
        }
        setIsLoading(false)
    }

    useEffect(async () => {
        await initButton()
    },[])

    return <div className={'pin-playlist-button '+className} style={style}>
        <ShowIfTrue control={auth.isAuth} alternateElement="">
            <ShowIfTrue control={!isLoading} alternateElement={ <div className="pin-playlist-button--button--loading" ><Loader size="20px" /></div> }>
                <ShowIfTrue control={!isError} alternateElement={ <div className="pin-playlist-button--button--error" onClick={() => initButton()} > <FontAwesomeIcon icon={faRedo} /> <span>Actualiser</span></div>}>
                    {
                        isPinned ?
                        <Button theme="primary" className="pin-playlist-button--button unfollow" onClick={() => unPinThePlaylistAction()}>
                            Ne plus épingler
                        </Button>
                        :
                        <Button theme="secondary" className="pin-playlist-button--button" onClick={() => pinThePlaylistAction()}>
                            Épingler
                        </Button>
                    }
                </ShowIfTrue>
            </ShowIfTrue>
        </ShowIfTrue> 
    </div>              
}