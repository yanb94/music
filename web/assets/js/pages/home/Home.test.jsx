import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import Home from './Home';
import { BrowserRouter } from 'react-router-dom'
import { getTopSongs } from './getData'
import { expectElementExist } from '@app/test/util';
import { useAuth } from "@app/auth/auth"

jest.mock('./getData.js')
jest.mock("@app/auth/auth")

const intersectionObserverMock = () => ({
    observe: () => null,
    unobserve: () => null
})

window.IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMock);

async function renderMainElement(className = 'test')
{
    let renderElements = {}

    await act(async () => {
        renderElements = render(<Home />,{wrapper: BrowserRouter})
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

function mockGetTopSongs(result)
{
    getTopSongs.mockImplementation(() => Promise.resolve(result))
}

function fakeDataSongs(nb)
{
    let songs = []

    for (let index = 0; index < nb; index++) {
        
        songs.push({
            "@id": "/api/songs/"+(index+1),
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
            "id": (index+1),
            "name": "Chanson "+(index+1),
            "songDuration": 104.98612244898
        })
        
    }

    return {
        "hydra:member":songs
    }
}

it("new songs are rendered when request success", async() => {

    mockUseAuth()
    mockGetTopSongs(fakeDataSongs(4))

    const {container} = await renderMainElement()

    const nbSongsShow = container.querySelectorAll(".home--news--content--new-songs .song-item").length

    expect(nbSongsShow).toBe(4)
    expect(getTopSongs).toBeCalled()
})

it("error message is returned when request fail", async() => {

    mockUseAuth()
    mockGetTopSongs('error')

    const {container} = await renderMainElement()

    expectElementExist('.home--news--content--error-songs',container)
    expect(getTopSongs).toBeCalled();

})