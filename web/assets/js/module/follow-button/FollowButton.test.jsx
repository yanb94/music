import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import FollowButton from './FollowButton';
import { followTheArtist, checkIsFollower, unFollowTheArtist } from './getData';
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
        renderElements = render(<FollowButton slug="truc"/>)
    })

    return renderElements
}

function mockFollowTheArtist(result)
{
    followTheArtist.mockImplementation(() => Promise.resolve(result))
}

function mockCheckIsFollower(result)
{
    checkIsFollower.mockImplementation(() => Promise.resolve(result))
}

function mockUnFollowTheArtist(result)
{
    unFollowTheArtist.mockImplementation(() => Promise.resolve(result))
}

function fakeArtist()
{
    return {
        contentUrl: "/images/avatar/61471466aa9d9111218074.jpg",
        description: "Je suis une description",
        email: "example@example.com",
        id: 26,
        name: "Artiste 1",
        nbSongs: 7,
        slug: "artiste-1"
    }
}

it("element not render correctly when not authenticated", async () => {

    mockUseAuth({...authData,...{isAuth: false}})
    mockCheckIsFollower({})

    const {container} = await renderMainElement()

    expectElementExist(".follow-button",container)
    
    const nb = container.querySelector('.follow-button').children.length

    expect(nb).toBe(0)

})

it("element render correctly when user not follow the artist", async () => {

    mockUseAuth(authData)
    mockCheckIsFollower({'isFollower': false})

    const {container} = await renderMainElement()

    expectElementExist(".follow-button",container)
    expectElementExist(".button-secondary",container)

})

it("element render correctly when user follow the artist", async () => {

    mockUseAuth(authData)
    mockCheckIsFollower({'isFollower': true})

    const {container} = await renderMainElement()

    expectElementExist(".follow-button",container)
    expectElementExist(".button-primary",container)

})

it("element render correctly when error", async () => {

    mockUseAuth(authData)
    mockCheckIsFollower("error")

    const {container} = await renderMainElement()

    expectElementExist(".follow-button",container)
    expectElementExist(".follow-button--button--error",container)

})

it("element disconnect user when token expire", async () => {

    const mockLogout = jest.fn()

    mockUseAuth(authData,mockLogout)
    mockCheckIsFollower(401)

    const {container} = await renderMainElement()

    expectElementExist(".follow-button",container)
    
    expect(mockLogout).toBeCalled();
})

it("element render correctly when user click on the unfollow button", async () => {

    mockUseAuth(authData)
    mockCheckIsFollower({'isFollower': true})
    mockUnFollowTheArtist(fakeArtist())

    const {container} = await renderMainElement()

    expectElementExist(".follow-button",container)
    expectElementExist(".button-primary",container)

    const button = container.querySelector('.button-primary')

    await act(async () => {
        button.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expect(unFollowTheArtist).toBeCalled()
    expectElementExist(".button-secondary",container)
})

it("element render correctly when user click on the follow button", async () => {

    mockUseAuth(authData)
    mockCheckIsFollower({'isFollower': false})
    mockFollowTheArtist(fakeArtist())

    const {container} = await renderMainElement()

    expectElementExist(".follow-button",container)
    expectElementExist(".button-secondary",container)

    const button = container.querySelector('.button-secondary')

    await act(async () => {
        button.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expect(followTheArtist).toBeCalled()
    expectElementExist(".button-primary",container)
})