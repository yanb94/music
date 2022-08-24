import React, { useEffect, useState } from 'react'
import './FollowButton.scss'
import { followTheArtist, checkIsFollower, unFollowTheArtist } from './getData';
import Button from '@app/module/button/Button';
import { useAuth } from '@app/auth/auth';
import Loader from '@app/module/loader/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';

function ShowIfTrue({control, alternateElement ,children})
{
    return control ? children : alternateElement;
}

export default function FollowButton({slug ,style, className = ''})
{
    const [isLoading, setIsLoading] = useState(true);
    const [isFollower, setIsFollower] = useState(false);
    const [isError, setIsError] = useState(true)

    const { auth, logout } = useAuth()

    const followTheArtistAction = async () => {
        setIsLoading(true)
        const result = await followTheArtist(slug, auth.token);

        switch (result) {
            case "error":
                setIsError(true)
                break;
            default:
                setIsFollower(true)
                break;
        }
        setIsLoading(false)
    }

    const unfollowTheArtistAction = async () => {
        setIsLoading(true)
        const result = await unFollowTheArtist(slug, auth.token);

        switch (result) {
            case "error":
                setIsError(true)
                break;
            default:
                setIsFollower(false)
                break;
        }
        setIsLoading(false)
    }

    const initButton = async () => {

        if(!auth.isAuth) return;

        setIsLoading(true)
        setIsError(false)
        const result = await checkIsFollower(slug, auth.token)
        switch (result) {
            case "error":
                setIsError(true)
                break;
            case 401:
                logout()
                break;
            default:
                setIsFollower(result['isFollower'])
                break;
        }
        setIsLoading(false)
    }

    useEffect(async () => {
        await initButton()
    },[])

    return <div className={'follow-button '+className} style={style}>
        <ShowIfTrue control={auth.isAuth} alternateElement="">
            <ShowIfTrue control={!isLoading} alternateElement={ <div className="follow-button--button--loading" ><Loader size="20px" /></div> }>
                <ShowIfTrue control={!isError} alternateElement={ <div className="follow-button--button--error" onClick={() => initButton()} > <FontAwesomeIcon icon={faRedo} /> <span>Actualiser</span></div>}>
                    {
                        isFollower ?
                        <Button theme="primary" className="follow-button--button unfollow" onClick={() => unfollowTheArtistAction()}>
                            Ne plus suivre
                        </Button>
                        :
                        <Button theme="secondary" className="follow-button--button" onClick={() => followTheArtistAction()}>
                            Suivre
                        </Button>
                    }
                </ShowIfTrue>
            </ShowIfTrue>
        </ShowIfTrue> 
    </div>              
}