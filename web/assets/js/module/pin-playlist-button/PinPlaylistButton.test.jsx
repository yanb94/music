import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import PinPlaylistButton from './PinPlaylistButton'
import { checkIsPin, pinPlaylist, unPinPlaylist } from './getData';
import { expectElementExist } from '@app/test/util';
import { useAuth } from "@app/auth/auth";

jest.mock('./getData.js')
jest.mock("@app/auth/auth")

const authData = {
    token: "token",
    isAuth: true,
    id: "1",
    artist: true
}

function mockUseAuth(authData, logout = () => {}, updateAuth = () => {})
{
    useAuth.mockImplementation(() => {
        return {
            auth: authData,
            logout: logout,
            updateAuth: updateAuth
        }
    })
}

async function renderMainElement()
{
    let renderElements = {}

    await act(async () => {
        renderElements = render(<PinPlaylistButton slug="truc"/>)
    })

    return renderElements
}

function mockPinPlaylist(result)
{
    pinPlaylist.mockImplementation(() => Promise.resolve(result))
}

function mockCheckIsPin(result)
{
    checkIsPin.mockImplementation(() => Promise.resolve(result))
}

function mockUnPinPlaylist(result)
{
    unPinPlaylist.mockImplementation(() => Promise.resolve(result))
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

it("element not render correctly when not authenticated", async () => {

    mockUseAuth({...authData,...{isAuth: false}})
    mockCheckIsPin({})

    const {container} = await renderMainElement()

    expectElementExist(".pin-playlist-button",container)
    
    const nb = container.querySelector('.pin-playlist-button').children.length

    expect(nb).toBe(0)

})

it("element render correctly when user not pin the playlist", async () => {

    mockUseAuth(authData)
    mockCheckIsPin({'isPinned': false})

    const {container} = await renderMainElement()

    expectElementExist(".pin-playlist-button",container)
    expectElementExist(".button-secondary",container)

})

it("element render correctly when user pin the playlist", async () => {

    mockUseAuth(authData)
    mockCheckIsPin({'isPinned': true})

    const {container} = await renderMainElement()

    expectElementExist(".pin-playlist-button",container)
    expectElementExist(".button-primary",container)

})

it("element render correctly when error", async () => {

    mockUseAuth(authData)
    mockCheckIsPin("error")

    const {container} = await renderMainElement()

    expectElementExist(".pin-playlist-button",container)
    expectElementExist(".pin-playlist-button--button--error",container)

})

it("element disconnect user when token expire", async () => {

    const mockLogout = jest.fn()

    mockUseAuth(authData,mockLogout)
    mockCheckIsPin(401)

    const {container} = await renderMainElement()

    expectElementExist(".pin-playlist-button",container)
    
    expect(mockLogout).toBeCalled();
})

it("element render correctly when user click on the unpin button", async () => {

    mockUseAuth(authData)
    mockCheckIsPin({'isPinned': true})
    mockUnPinPlaylist(fakePlaylist())

    const {container} = await renderMainElement()

    expectElementExist(".pin-playlist-button",container)
    expectElementExist(".button-primary",container)

    const button = container.querySelector('.button-primary')

    await act(async () => {
        button.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expect(unPinPlaylist).toBeCalled()
    expectElementExist(".button-secondary",container)
})

it("element render correctly when user click on the pin button", async () => {

    mockUseAuth(authData)
    mockCheckIsPin({'isPinned': false})
    mockPinPlaylist(fakePlaylist())

    const {container} = await renderMainElement()

    expectElementExist(".pin-playlist-button",container)
    expectElementExist(".button-secondary",container)

    const button = container.querySelector('.button-secondary')

    await act(async () => {
        button.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expect(pinPlaylist).toBeCalled()
    expectElementExist(".button-primary",container)
})