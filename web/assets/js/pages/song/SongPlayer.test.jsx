import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import { BrowserRouter } from 'react-router-dom'
import SongPlayer from './SongPlayer';
import { useAuth } from "@app/auth/auth"
import { expectElementExist } from '@app/test/util';

jest.mock("@app/auth/auth")

async function renderMainElement(songData,allowToListen,auth)
{
    let renderElements = {}

    await act(async () => {
        renderElements = render(<SongPlayer songData={songData} allowToListen={allowToListen} auth={auth} />,{wrapper: BrowserRouter})
    })

    return renderElements
}

function mockUseAuth(logout = () => {},token = "token", isAuth = true, id = "1", isSubscribe = false)
{
    const authData = {
        token: token,
        isAuth: isAuth,
        id: id,
        isSubscribe: isSubscribe
    }

    useAuth.mockImplementation(() => {
        return {
            auth: authData,
            logout: logout
        }
    })
}

function fakeSong(subscribe)
{
    let song = {
        "@id": "/api/songs/1",
        "@type": "Song",
        "author": {
            "@id": "/api/artists/26",
            "@type": "Artist",
            "contentUrl": "/images/avatar/61471466aa9d9111218074.jpg",
            "description": "Je suis une description",
            "email": "example@example.com",
            "id": 26,
            "name": "Artiste 1",
        },
        "contentImageUrl": "/images/song/6149eca0f0cb8842719191.jpg",
        "contentSongUrl": "/song/6149eca0f18a0573296342.mp3",
        "createdAt": "2021-09-21T16:30:56+02:00",
        "id": "1",
        "name": "Chanson 1",
        "songDuration": 104.98612244898
    }

    if(subscribe)
        song = {...song,...{"contentSongUrl": "/song/6149eca0f18a0573296342.mp3"}}

    return song
}

it("render has expected when user can listen the song", async () => {
    
    mockUseAuth(() => {},"token",true,"1",true)

    const {container} = await renderMainElement(fakeSong(true),true,useAuth())

    expectElementExist('.song-page--content--player--button',container)
})

it("render has expected when user can't listen the song", async () => {
    
    mockUseAuth(() => {},"token",true,"1",false)

    const {container} = await renderMainElement(fakeSong(false),false,useAuth())

    expectElementExist('.song-page--content--player--not-allow',container)
})