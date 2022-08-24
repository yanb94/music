import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import EditSong from './EditSong';
import { BrowserRouter } from 'react-router-dom'
import { processForm, hasError, getInitialData } from "./processForm";
import { useAuth } from '@app/auth/auth';
import { expectElementExist, expectElementHasValue, fillInputWithValue, fillInputWithFile } from '@app/test/util';

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
    "name": "Chanson 1",
    "contentImageUrl": "/images/613b356384fd8793430487.jpeg"
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

function mockProcessForm(result)
{
    processForm.mockImplementation(() => Promise.resolve(result));
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
        renderElements = render(<EditSong openNotification={openNotification}/>,{wrapper: BrowserRouter})
    })

    return renderElements
}

async function fillAndSendForm(container)
{
    const button = container.querySelector("input[type='submit']");
    const file = [new File(['(⌐□_□)'], 'chucknorris.jpeg', { type: 'image/jpeg' })];

    global.URL.createObjectURL = jest.fn(() => 'chucknorris.jpeg');

    await act(async () => {
        fillInputWithFile("input#imageFile",container,file)
        fillInputWithValue("input#name",container,"Artist 1")
    })

    await act(async () => {
        button.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })
}

it("editSong render waited element", async () => {

    mockUseAuth(authData);
    mockGetInitialData(sampleData)

    const {container} = await renderMainElement();

    expectElementExist(".edit-song--head--content--container--title", container)
    expectElementExist(".input-image",container)
    
    expect(
        expectElementExist("label#label-image-imageFile",container).style.getPropertyValue('--backgroundBefore')
    ).toBe("url("+sampleData.contentImageUrl+")")
        
    expectElementHasValue(
        expectElementExist("input#name",container),
        sampleData.name
    )
    
    expectElementExist("input[type='submit']", container)

})

it("editSong form render has expected when there are a server error", async() => {
    
    mockUseAuth(authData);
    mockGetInitialData("error")

    const {container} = await renderMainElement()

    expectElementExist(".edit-song--head--content--container--error", container)
})

it("editSong form render has expected when session expired", async() => {
    
    const logoutFunction = jest.fn(() => {})

    mockUseAuth(authData, logoutFunction)
    mockGetInitialData(401)

    const {container} = await renderMainElement()

    expect(logoutFunction).toBeCalled()
})

it("editSong form work has expected when data is correct", async() => {
    
    mockUseAuth(authData);
    mockGetInitialData(sampleData)
    mockProcessForm("ok")

    const mockOpenNotification = jest.fn();

    const {container} = await renderMainElement(mockOpenNotification)
    const buttonSubmit = container.querySelector("input[type='submit']")

    await act(async() => {
        fillAndSendForm(container)
    })

    await act(async() => {
        buttonSubmit.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expect(processForm).toHaveBeenCalled()
    expect(mockOpenNotification).toHaveBeenCalled()
})

it("editSong form work has expected when session expired", async() => {
    
    const logoutFunction = jest.fn(() => {})

    mockUseAuth(authData, logoutFunction);
    mockGetInitialData(sampleData)
    mockProcessForm(401)

    const {container} = await renderMainElement()
    const buttonSubmit = container.querySelector("input[type='submit']")

    await act(async() => {
        buttonSubmit.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expect(processForm).toHaveBeenCalled()
    expect(logoutFunction).toHaveBeenCalled()
})

it("editSong form work has expected when servor error", async() => {
    
    mockUseAuth(authData);
    mockHasError()
    mockGetInitialData(sampleData)
    mockProcessForm("error")

    const {container} = await renderMainElement()
    const buttonSubmit = container.querySelector("input[type='submit']")

    await act(async() => {
        buttonSubmit.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expect(processForm).toHaveBeenCalled()
    expectElementExist(".edit-song--head--content--container--form--error", container)
})

it("editSong form work has expected when datas are incorrect", async() => {

    mockUseAuth(authData);
    mockGetInitialData(sampleData)
    mockProcessForm({violations: [
            {
                "propertyPath": "name",
                "message": "This value is of bad shape."
            }
        ]
    })

    const {container} = await renderMainElement()
    const buttonSubmit = container.querySelector("input[type='submit']")

    await act(async() => {
        buttonSubmit.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expect(processForm).toHaveBeenCalled()
    expectElementExist('input#name + .input-text--error',container);

})
