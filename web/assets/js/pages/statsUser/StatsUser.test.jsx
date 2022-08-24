import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import { BrowserRouter } from 'react-router-dom'
import { getInitialData, getArtistPayment } from './getData'
import { useAuth } from "@app/auth/auth"
import { expectElementExist } from '@app/test/util';
import StatsUser from './StatsUser';

jest.mock('./getData.js')
jest.mock("@app/auth/auth")
jest.mock('react-chartjs-2', () => ({
    Line: () => null
}));

const intersectionObserverMock = () => ({
    observe: () => null,
    unobserve: () => null
})

window.IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMock);

async function renderMainElement()
{
    let renderElements = {}

    await act(async () => {
        renderElements = render(<StatsUser />,{wrapper: BrowserRouter})
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

function mockGetArtistPayment(result)
{
    getArtistPayment.mockImplementation(() => Promise.resolve(result))
}

function fakeArtistPayment()
{
    return {
        "hydra:member" : [
            {
                "@id": "/api/artist_payouts/65",
                "@type": "ArtistPayout",
                "amount": 1180,
                "id": 65,
                "month": "12-2021",
                "status": "Traité"
            }
        ]
    }
}

function fakeStats()
{
    return {
        "nbSongs":7,
        "nbPlaylists":3,
        "nbFollowers":1,
        "viewsSongs":{
            "dates":
                [
                    "16-11-2021",
                    "17-11-2021",
                    "18-11-2021",
                    "19-11-2021",
                    "20-11-2021",
                    "21-11-2021",
                    "22-11-2021",
                    "23-11-2021"
                ],
            "views":
                [
                    0,
                    0,
                    0,
                    0,
                    2,
                    1,
                    0,
                    0
                ]
        },
        "viewsPlaylists":{
            "dates":
                [
                    "16-11-2021",
                    "17-11-2021",
                    "18-11-2021",
                    "19-11-2021",
                    "20-11-2021",
                    "21-11-2021",
                    "22-11-2021",
                    "23-11-2021"
                ],
            "views":
                [
                    0,
                    0,
                    0,
                    0,
                    1,
                    1,
                    0,
                    0
                ]
        }
    }
}

it("page are rendered when request fail", async() => {

    mockUseAuth()
    mockGetInitialData("error")
    mockGetArtistPayment(fakeArtistPayment())
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

it("page are rendered when requests success", async() => {
    mockUseAuth()
    mockGetInitialData(fakeStats())
    mockGetArtistPayment(fakeArtistPayment())

    const {container} = await renderMainElement()

    expectElementExist('.stats-user--content--datas',container)

    const nbItem = container.querySelectorAll('.stats-user--content--datas--item');

    expect(nbItem.length).toBe(4)
    expect(getInitialData).toBeCalled();
})