import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import { BrowserRouter } from 'react-router-dom'
import { getData, getInitialListOfSongs, getNextSongs } from './getData'
import PlaylistPage from './PlaylistPage';
import { expectElementExist } from '@app/test/util';
import { useAuth } from "@app/auth/auth"
import { checkIsPin } from "@app/module/pin-playlist-button/getData"

jest.mock('./getData.js')
jest.mock("@app/auth/auth")
jest.mock("@app/module/pin-playlist-button/getData")

const intersectionObserverMock = () => ({
    observe: () => null,
    unobserve: () => null
})

window.IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMock);

function mockGetData(result)
{
    getData.mockImplementation(() => Promise.resolve(result))
}

function mockGetInitialListOfSongs(result)
{
    getInitialListOfSongs.mockImplementation(() => Promise.resolve(result))
}

function mockGetNextSongs(result)
{
    getNextSongs.mockImplementation(() => Promise.resolve(result))
}

function mockCheckIsPin(result)
{
    checkIsPin.mockImplementation(() => Promise.resolve(result))
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

function fakePlaylist()
{  
    return {
        "@id": "/api/playlists/10",
        "@type": "Playlist",
        "id": "1",
        "name": "Playlist 1",
        "createdAt": "2021-10-06T14:20:21+02:00",
        "songs": [
            {
            "@id": "/api/songs/5",
            "@type": "Song",
            "id": 5,
            "name": "Chanson 4",
            "createdAt": "2021-09-21T16:23:55+02:00",
            "author": {
                "@id": "/api/artists/26",
                "@type": "Artist",
                "id": 26,
                "name": "Artiste 1",
                "email": "example@example.com",
                "description": "Je suis une description",
                "contentUrl": "/images/avatar/61471466aa9d9111218074.jpg"
            },
            "contentImageUrl": "/images/song/6149eafb728ce272848891.jpg",
            "contentSongUrl": "/song/6149eafb73396379533453.mp3",
            "songDuration": 104.98612244898
            },
            {
            "@id": "/api/songs/7",
            "@type": "Song",
            "id": 7,
            "name": "Chanson 6",
            "createdAt": "2021-09-21T16:27:04+02:00",
            "author": {
                "@id": "/api/artists/26",
                "@type": "Artist",
                "id": 26,
                "name": "Artiste 1",
                "email": "example@example.com",
                "description": "Je suis une description",
                "contentUrl": "/images/avatar/61471466aa9d9111218074.jpg"
            },
            "contentImageUrl": "/images/song/6149ebb8b93db629804233.jpg",
            "contentSongUrl": "/song/6149ebb8ba02a446872620.mp3",
            "songDuration": 104.98612244898
            }
        ],
        "isPublic": false,
        "contentImageUrl": "/images/playlist/615d9485a11b2500084223.jpg",
        "author": "/api/users/12",
        "nbSongs": 2
    }
        
}

async function renderMainElement()
{
    let renderElements = {}

    await act(async () => {
        renderElements = render(<PlaylistPage />,{wrapper: BrowserRouter})
    })

    return renderElements
}

it("playlists is rendered when request success", async() => {

    mockUseAuth()
    mockCheckIsPin({
        "isPinned": false
    })
    mockGetData(fakePlaylist())
    mockGetInitialListOfSongs(fakeDataSongs(4))

    const {container} = await renderMainElement()

    expectElementExist('.playlist-page--content--card-playlist',container)

    const nbSongs = container.querySelectorAll('.playlist-song').length;

    expect(nbSongs).toBe(4)
    expect(getData).toBeCalled()
    expect(getInitialListOfSongs).toBeCalled()
})

it("error message is returned when request fail", async() => {
    
    mockUseAuth()
    mockGetData('error')

    const {container} = await renderMainElement()

    expectElementExist('.playlist-page--content--error',container)

    expect(getData).toBeCalled()
})

it("redirected when playlist not found", async() => {

    mockUseAuth()
    mockGetData(404)

    await renderMainElement()

    expect(getData).toBeCalled()
    expect(window.location.pathname).toBe('/error404')
})

it("error message is returned when request for songs fail", async() => {

    mockUseAuth()
    mockGetData(fakePlaylist())
    mockGetInitialListOfSongs('error')

    const {container} = await renderMainElement()

    expectElementExist('.playlist-page--content--error',container)

    expect(getData).toBeCalled()
    expect(getInitialListOfSongs).toBeCalled()
})

it("playlists is rendered has expected when user subscribe", async() => {

    mockUseAuth(() => {},"token",true,"1",true)
    mockCheckIsPin({
        "isPinned": false
    })
    mockGetData(fakePlaylist())
    mockGetInitialListOfSongs(fakeDataSongs(4))

    const {container} = await renderMainElement()

    expectElementExist('.playlist-page--content--card-playlist',container)

    const nbSongs = container.querySelectorAll('.playlist-song').length;

    expectElementExist('.playlist-page--content--card-playlist--cont-image--button',container)

    expect(nbSongs).toBe(4)
    expect(getData).toBeCalled()
    expect(getInitialListOfSongs).toBeCalled()
})

it("playlists is rendered has expected when user not subscribe", async() => {

    mockUseAuth(() => {},"token",true,"1",false)
    mockCheckIsPin({
        "isPinned": false
    })
    mockGetData(fakePlaylist())
    mockGetInitialListOfSongs(fakeDataSongs(4))

    const {container} = await renderMainElement()

    expectElementExist('.playlist-page--content--card-playlist',container)

    const nbSongs = container.querySelectorAll('.playlist-song').length;

    expectElementExist('.playlist-page--content--card-playlist--cont-image--subscribe',container)

    expect(nbSongs).toBe(4)
    expect(getData).toBeCalled()
    expect(getInitialListOfSongs).toBeCalled()
})