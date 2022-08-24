import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import MySongs from "./MySongs"
import { BrowserRouter } from 'react-router-dom'
import { getData, getNewData,  getDataAutocomplete} from "./getData"
import { expectElementExist, fillInputWithValue } from '@app/test/util';
import { useAuth } from "@app/auth/auth"
import { fireEvent } from "@testing-library/dom"

jest.mock('./getData.js')
jest.mock("@app/auth/auth")

async function renderMainElement()
{
    let renderElements = {}

    await act(async () => {
        renderElements = render(<MySongs/>,{wrapper: BrowserRouter})
    })

    return renderElements
}

function mockGetData(result)
{
    getData.mockImplementation(() => Promise.resolve(result))
}

function mockGetNewData(result)
{
    getNewData.mockImplementation(() => Promise.resolve(result))
}

function mockGetDataAutocomplete(result)
{
    getDataAutocomplete.mockImplementation(() => Promise.resolve(result))
}

function mockUseAuth(logout = () => {},token = "token", isAuth = true, id = "1")
{
    const authData = {
        token: token,
        isAuth: isAuth,
        id: id
    }

    useAuth.mockImplementation(() => {
        return {
            auth: authData,
            logout: logout
        }
    })
}

const intersectionObserverMock = () => ({
    observe: () => null,
    unobserve: () => null
})

window.IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMock);

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


it("songs are rendered when request success", async () => {
    mockUseAuth()
    mockGetData(fakeDataSongs(5))

    const {container} = await renderMainElement()
    
    const nbSongsShow = container.querySelectorAll(".my-song-item").length

    expect(nbSongsShow).toBe(5)
    expect(getData).toBeCalled()
})

it("songs show info when no songs found", async() => {
    mockUseAuth()
    mockGetData(fakeDataSongs(0))

    const {container} = await renderMainElement()
    
    const nbSongsShow = container.querySelectorAll(".my-song-item").length

    expectElementExist('.my-songs--content--list--notFound',container)

    expect(nbSongsShow).toBe(0)
    expect(getData).toBeCalled()
})

it("error shown when request failed", async () => {
    mockUseAuth()
    mockGetData("error")

    const {container} = await renderMainElement()

    expectElementExist(".my-songs--content--list--error",container)

    expect(getData).toBeCalled()
})

it("user disconnected when session expired", async () => {
    const mockLogout = jest.fn(() => {});
    
    mockUseAuth(mockLogout)
    mockGetData(401)

    const {container} = await renderMainElement()

    expect(mockLogout).toBeCalled()
})
