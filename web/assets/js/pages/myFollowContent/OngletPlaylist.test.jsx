import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import { BrowserRouter } from 'react-router-dom'
import { getInitialPlaylistData } from './getData'
import { useAuth } from '@app/auth/auth';
import { expectElementExist } from '@app/test/util';
import OngletPlaylist from './OngletPlaylist';

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

async function renderMainElement(moreAction = () => {}, isMore = false, className = 'test')
{
    let renderElements = {}

    await act(async () => {
        renderElements = render(<OngletPlaylist/>,{wrapper: BrowserRouter})
    })

    return renderElements
}

function mockGetInitialPlaylistData(result)
{
    getInitialPlaylistData.mockImplementation(() => Promise.resolve(result))
}

function fakeDataPlaylist(nb)
{
    let playlists = []

    for (let index = 0; index < nb; index++) {
        
        playlists.push({
                "@id": "/api/playlists/10",
                "@type": "Playlist",
                "id": (index+1),
                "name": "Playlist "+(index+1),
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
        })
        
    }

    return {
        "hydra:member":playlists
    }
}

const intersectionObserverMock = () => ({
    observe: () => null,
    unobserve: () => null
})

window.IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMock);

it("playlists are rendered when request success", async() => {

    mockUseAuth(authData)
    mockGetInitialPlaylistData(fakeDataPlaylist(8))

    const {container} = await renderMainElement()

    const nbPlaylistsShow = container.querySelectorAll(".playlist-item").length

    expect(nbPlaylistsShow).toBe(8)
    expect(getInitialPlaylistData).toBeCalled()
})

it("user is disconnected when session expire", async() => {

    const mockLogout = jest.fn()

    mockUseAuth(authData,mockLogout)
    mockGetInitialPlaylistData(401)

    const {container} = await renderMainElement()

    expect(getInitialPlaylistData).toBeCalled();
    expect(mockLogout).toBeCalled();
})

it("error message is returned when request fail", async() => {

    mockUseAuth(authData)
    mockGetInitialPlaylistData('error')

    const {container} = await renderMainElement()

    expectElementExist('.onglet--error',container)
    expect(getInitialPlaylistData).toBeCalled();

})