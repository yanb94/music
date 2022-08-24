import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import { BrowserRouter } from 'react-router-dom'
import { getInitialData, getStats } from './getData'
import { useAuth } from "@app/auth/auth"
import { expectElementExist } from '@app/test/util';
import StatsPlaylist from './StatsPlaylist';


jest.mock('./getData.js')
jest.mock("@app/auth/auth")
jest.mock('react-chartjs-2', () => ({
    Line: () => null
}));

async function renderMainElement()
{
    let renderElements = {}

    await act(async () => {
        renderElements = render(<StatsPlaylist />,{wrapper: BrowserRouter})
    })

    return renderElements
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

function mockGetInitialData(result)
{
    getInitialData.mockImplementation(() => Promise.resolve(result))
}

function mockGetStats(result)
{
    getStats.mockImplementation(() => Promise.resolve(result))
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

function fakeStats()
{
    return {
        "dates": [
            "13-11-2021"
            ,"14-11-2021"
            ,"15-11-2021"
            ,"16-11-2021"
            ,"17-11-2021"
            ,"18-11-2021"
            ,"19-11-2021"
            ,"20-11-2021"
        ],
        "views": [
            0
            ,0
            ,0
            ,0
            ,0
            ,0
            ,0
            ,1
        ]
    }
}

it("page are rendered when request fail", async() => {

    mockUseAuth()
    mockGetInitialData("error")
    await renderMainElement()

    expect(window.location.pathname).toBe('/error404')
    expect(getInitialData).toBeCalled();
})

it("logout when session expired", async() => {

    const mockLogout = jest.fn(() => {});

    mockUseAuth(mockLogout)

    mockGetInitialData(401)
    await renderMainElement()

    expect(mockLogout).toBeCalled()
    expect(getInitialData).toBeCalled();
})

it("page are rendered when request to get stats fail", async() => {

    mockUseAuth()
    mockGetInitialData(fakePlaylist())
    mockGetStats("error")
    await renderMainElement()

    expect(window.location.pathname).toBe('/error404')
    expect(getInitialData).toBeCalled();
    expect(getStats).toBeCalled();
})

it("logout when session expired on request to get stats", async() => {

    const mockLogout = jest.fn(() => {});

    mockUseAuth(mockLogout)

    mockGetInitialData(fakePlaylist())
    mockGetStats(401)
    await renderMainElement()

    expect(mockLogout).toBeCalled()
    expect(getInitialData).toBeCalled();
    expect(getStats).toBeCalled();
})

it("page are rendered when requests success", async() => {
    mockUseAuth()
    mockGetInitialData(fakePlaylist())
    mockGetStats(fakeStats())

    const {container} = await renderMainElement()

    expectElementExist('.stats-playlist--content--card-playlist',container)

    expect(getInitialData).toBeCalled();
    expect(getStats).toBeCalled();
})