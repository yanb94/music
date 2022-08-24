import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import { BrowserRouter } from 'react-router-dom'
import { getInitialArtistData } from './getData'
import { useAuth } from '@app/auth/auth';
import { expectElementExist } from '@app/test/util';
import OngletArtist from './OngletArtist';
import { checkIsFollower } from '@app/module/follow-button/getData'

jest.mock('./getData.js')
jest.mock('@app/module/follow-button/getData')
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
        renderElements = render(<OngletArtist/>,{wrapper: BrowserRouter})
    })

    return renderElements
}

function mockGetInitialArtistData(result)
{
    getInitialArtistData.mockImplementation(() => Promise.resolve(result))
}

function mockCheckIsFollower(result)
{
    checkIsFollower.mockImplementation(() => Promise.resolve(result))
}

function fakeArtist(nb)
{
    let artists = []

    for (let index = 0; index < nb; index++) {
        artists.push({
            contentUrl: "/images/avatar/61471466aa9d9111218074.jpg",
            description: "Je suis une description",
            email: "example@example.com",
            id: (index+1),
            name: "Artiste "+(index+1),
            nbSongs: 7,
            slug: "artiste-"+(index+1)
        })
    }

    return {
        "hydra:member": artists
    }
}

const intersectionObserverMock = () => ({
    observe: () => null,
    unobserve: () => null
})

window.IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMock);

it("artists are rendered when request success", async() => {

    mockUseAuth(authData)
    mockCheckIsFollower({'isFollower': true})
    mockGetInitialArtistData(fakeArtist(8))

    const {container} = await renderMainElement()

    const nbArtistsShow = container.querySelectorAll(".artist-item").length

    expect(nbArtistsShow).toBe(8)
    expect(getInitialArtistData).toBeCalled()
})

it("user is disconnected when session expire", async() => {

    const mockLogout = jest.fn()

    mockUseAuth(authData,mockLogout)
    mockGetInitialArtistData(401)
    mockCheckIsFollower({'isFollower': true})

    const {container} = await renderMainElement()

    expect(getInitialArtistData).toBeCalled();
    expect(mockLogout).toBeCalled();
})

it("error message is returned when request fail", async() => {

    mockUseAuth(authData)
    mockCheckIsFollower({'isFollower': true})
    mockGetInitialArtistData('error')

    const {container} = await renderMainElement()

    expectElementExist('.onglet--error',container)
    expect(getInitialArtistData).toBeCalled();

})