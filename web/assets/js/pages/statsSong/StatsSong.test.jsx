import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import { BrowserRouter } from 'react-router-dom'
import { getInitialData, getStats } from './getData'
import StatsSong from './StatsSong';
import { useAuth } from "@app/auth/auth"
import { expectElementExist } from '@app/test/util';


jest.mock('./getData.js')
jest.mock("@app/auth/auth")
jest.mock('react-chartjs-2', () => ({
    Line: () => null
}));

async function renderMainElement()
{
    let renderElements = {}

    await act(async () => {
        renderElements = render(<StatsSong />,{wrapper: BrowserRouter})
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

function fakeSong()
{
    return {
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
        "id": 1,
        "name": "Chanson 1",
        "songDuration": 104.98612244898
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
    mockGetInitialData(fakeSong())
    mockGetStats("error")
    await renderMainElement()

    expect(window.location.pathname).toBe('/error404')
    expect(getInitialData).toBeCalled();
    expect(getStats).toBeCalled();
})

it("logout when session expired on request to get stats", async() => {

    const mockLogout = jest.fn(() => {});

    mockUseAuth(mockLogout)

    mockGetInitialData(fakeSong())
    mockGetStats(401)
    await renderMainElement()

    expect(mockLogout).toBeCalled()
    expect(getInitialData).toBeCalled();
    expect(getStats).toBeCalled();
})

it("page are rendered when requests success", async() => {
    mockUseAuth()
    mockGetInitialData(fakeSong())
    mockGetStats(fakeStats())

    const {container} = await renderMainElement()

    expectElementExist('.stats-song--content--card-song',container)

    expect(getInitialData).toBeCalled();
    expect(getStats).toBeCalled();
})