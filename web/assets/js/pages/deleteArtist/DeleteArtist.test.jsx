import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import { sendRequest, getInitialData, hasError } from './processForm';
import { useAuth } from '@app/auth/auth';
import DeleteArtist from './DeleteArtist';
import { BrowserRouter } from 'react-router-dom';
import { expectElementExist, expectElementHasContent } from '@app/test/util';

const authData = {
    token: "token",
    isAuth: true,
    id: "1",
    artist: true
}

jest.mock("./processForm.js")
jest.mock("@app/auth/auth")

const sampleData = {
    "id": 2,
    "name": "Artist 1",
    "email": "example@example.com",
    "description": "Je suis une description",
    "contentUrl": "/images/avatar/613b356384fd8793430487.jpg"
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

function mockSendRequest(result)
{
    sendRequest.mockImplementation(() => Promise.resolve(result));
}

function mockGetInitialData(result)
{
    getInitialData.mockImplementation(() => Promise.resolve(result))
}

function mockHasError()
{
    hasError.mockImplementation(
        (resultRequest, setError) => jest.requireActual("./processForm.js").hasError(resultRequest, setError)
    )
}

async function renderMainElement(openNotification = () => {})
{
    let renderElements = {}

    await act(async () => {
        renderElements = render(<DeleteArtist openNotification={openNotification}/>,{wrapper: BrowserRouter})
    })

    return renderElements
}

it("DeleteArtist has expected elements", async () => {
    
    mockUseAuth(authData);
    mockGetInitialData(sampleData)

    const {container} = await renderMainElement();

    expectElementExist(".delete-artist--head--content--container--title", container)
    expectElementExist("input[type='submit']", container)
})

it("DeleteArtist render has expected when there are a server error", async() => {
    
    mockUseAuth(authData);
    mockGetInitialData("error")

    const {container} = await renderMainElement()

    expectElementExist(".delete-artist--head--content--container--error", container)
})

it("DeleteArtist render has expected when session expired", async() => {
    
    const logoutFunction = jest.fn(() => {})

    mockUseAuth(authData, logoutFunction)
    mockGetInitialData(401)

    const {container} = await renderMainElement()

    expect(logoutFunction).toBeCalled()
})

it("DeleteArtist work has expected when data is correct", async() => {
    
    mockUseAuth(authData);
    mockGetInitialData(sampleData)
    mockSendRequest("ok")

    const mockOpenNotification = jest.fn();

    const {container} = await renderMainElement(mockOpenNotification)
    const buttonSubmit = container.querySelector("input[type='submit']")

    await act(async() => {
        buttonSubmit.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expect(sendRequest).toHaveBeenCalled()
    expect(mockOpenNotification).toHaveBeenCalled()
})

it("DeleteArtist work has expected when session expired", async() => {
    
    const logoutFunction = jest.fn(() => {})

    mockUseAuth(authData, logoutFunction);
    mockGetInitialData(sampleData)
    mockSendRequest(401)

    const {container} = await renderMainElement()
    const buttonSubmit = container.querySelector("input[type='submit']")

    await act(async() => {
        buttonSubmit.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expect(sendRequest).toHaveBeenCalled()
    expect(logoutFunction).toHaveBeenCalled()
})

it("DeleteArtist form work has expected when servor error", async() => {
    
    mockUseAuth(authData);
    mockHasError()
    mockGetInitialData(sampleData)
    mockSendRequest("error")

    const {container} = await renderMainElement()
    const buttonSubmit = container.querySelector("input[type='submit']")

    await act(async() => {
        buttonSubmit.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expect(sendRequest).toHaveBeenCalled()
    expectElementExist(".delete-artist--head--content--container--form--error", container)
})

it("DeleteArtist form work has expected when datas are incorrect", async() => {

    mockUseAuth(authData);
    mockGetInitialData(sampleData)
    mockSendRequest({violations: [
            {
                "propertyPath": "id",
                "message": "This value is of bad shape."
            }
        ]
    })

    const {container} = await renderMainElement()
    const buttonSubmit = container.querySelector("input[type='submit']")

    await act(async() => {
        buttonSubmit.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expect(sendRequest).toHaveBeenCalled()
    
    expectElementHasContent(
        expectElementExist(".delete-artist--head--content--container--form--error", container),
        "This value is of bad shape."
    )

})