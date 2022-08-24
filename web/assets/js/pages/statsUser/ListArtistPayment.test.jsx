import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import { BrowserRouter } from 'react-router-dom'
import { getArtistPayment } from './getData'
import { useAuth } from "@app/auth/auth"
import { expectElementExist } from '@app/test/util';
import ListArtistPayment from './ListArtistPayment';

jest.mock('./getData.js')
jest.mock("@app/auth/auth")

const intersectionObserverMock = () => ({
    observe: () => null,
    unobserve: () => null
})

window.IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMock);

async function renderMainElement()
{
    let renderElements = {}

    await act(async () => {
        renderElements = render(<ListArtistPayment />,{wrapper: BrowserRouter})
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

it("logout when session expired",async() => {

    const mockLogout = jest.fn(() => {});

    mockUseAuth(mockLogout)
    mockGetArtistPayment(401)

    await renderMainElement()

    expect(mockLogout).toBeCalled()
    expect(getArtistPayment).toBeCalled()
})

it("error show when request return an error", async() => {

    mockGetArtistPayment("error")

    const {container} = await renderMainElement()

    expectElementExist('.stats-user--content--error',container)

    expect(getArtistPayment).toBeCalled()
})

it("element render as expected when request succeed", async() => {

    mockGetArtistPayment(fakeArtistPayment())

    const {container} = await renderMainElement()

    expectElementExist(".stats-user--content--paiement-item",container)

    expect(getArtistPayment).toBeCalled()
})

