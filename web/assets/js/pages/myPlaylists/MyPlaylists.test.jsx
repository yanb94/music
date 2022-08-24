import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import MyPlaylists from "./MyPlaylists"
import { BrowserRouter } from 'react-router-dom'
import { getData, getNewData,  getDataAutocomplete} from "./getData"
import { expectElementExist } from '@app/test/util';
import { useAuth } from "@app/auth/auth"

jest.mock('./getData.js')
jest.mock("@app/auth/auth")

async function renderMainElement()
{
    let renderElements = {}

    await act(async () => {
        renderElements = render(<MyPlaylists/>,{wrapper: BrowserRouter})
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


it("playlists are rendered when request success", async () => {
    mockUseAuth()
    mockGetData(fakeDataPlaylist(5))

    const {container} = await renderMainElement()
    
    const nbSongsShow = container.querySelectorAll(".my-playlist-item").length

    expect(nbSongsShow).toBe(5)
    expect(getData).toBeCalled()
})

it("playlists show info when no songs found", async() => {
    mockUseAuth()
    mockGetData(fakeDataPlaylist(0))

    const {container} = await renderMainElement()
    
    const nbSongsShow = container.querySelectorAll(".my-playlist-item").length

    expectElementExist('.my-playlists--content--list--notFound',container)

    expect(nbSongsShow).toBe(0)
    expect(getData).toBeCalled()
})

it("error shown when request failed", async () => {
    mockUseAuth()
    mockGetData("error")

    const {container} = await renderMainElement()

    expectElementExist(".my-playlists--content--list--error",container)

    expect(getData).toBeCalled()
})

it("user disconnected when session expired", async () => {
    const mockLogout = jest.fn(() => {});
    
    mockUseAuth(mockLogout)
    mockGetData(401)

    const {container} = await renderMainElement()

    expect(mockLogout).toBeCalled()
})