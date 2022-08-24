import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import AddSong from './AddSong';
import { BrowserRouter } from 'react-router-dom'
import { expectElementExist, fillInputWithValue, fillInputWithFile } from '@app/test/util';
import { processForm, hasError } from "./processForm";
import { useAuth } from '@app/auth/auth';

const authData = {
    token: "token",
    isAuth: true,
    id: "1",
    artist: false
}

jest.mock("./processForm.js")
jest.mock("@app/auth/auth")

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

function mockHasError()
{
    hasError.mockImplementation(
        (resultRequest, setError) => jest.requireActual("./processForm.js").hasError(resultRequest, setError)
    )
}

function renderMainElement(openNotification = () => {})
{
    return render(<AddSong openNotification={openNotification}/>,{wrapper: BrowserRouter})
}

async function fillAndSendForm(container)
{
    const button = container.querySelector("input[type='submit']");
    const imageFile = [new File(['(⌐□_□)'], 'chucknorris.jpeg', { type: 'image/jpeg' })];
    const songFile = [new File(['(⌐□_□)'], 'chucknorris.mp3', { type: 'audio/mpeg' })];

    global.URL.createObjectURL = jest.fn(() => 'chucknorris.jpeg');

    await act(async () => {
        fillInputWithFile("input#imageFile",container,imageFile)
        fillInputWithFile("input#songFile",container,songFile)
        fillInputWithValue('input#name', container, "Chanson 1")
    })

    await act(async () => {
        button.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })
}

it("add song render waited element", async () => {

    mockUseAuth(authData);

    const {container} = renderMainElement();

    expectElementExist(".add-song--head--content--container--title", container)
    expectElementExist(".input-image",container)
    expectElementExist("input#name",container)
    expectElementExist('input#songFile',container)
    expectElementExist("input[type='submit']", container)

})

it("add song work has expected when request is successful", async () => {

    const notificationFunction = jest.fn(() => {})
    
    mockUseAuth(authData);
    mockProcessForm("ok");

    const {container} = renderMainElement(notificationFunction);
    
    await fillAndSendForm(container);

    expect(processForm).toHaveBeenCalled()
    expect(notificationFunction).toHaveBeenCalled()
})

it("add song work has expected when session expired", async() => {
    
    const mockLogout = jest.fn(() => "logout");

    mockUseAuth(authData,mockLogout);
    mockProcessForm(401);

    const {container} = renderMainElement();
    
    await fillAndSendForm(container);

    expect(processForm).toHaveBeenCalled()
    expect(mockLogout).toHaveBeenCalled();
})

it("add song work has expected when servor error happened", async() => {

    mockUseAuth(authData);
    mockProcessForm("error");

    const {container} = renderMainElement();
    
    await fillAndSendForm(container);

    expect(processForm).toHaveBeenCalled()
    expectElementExist('.add-song--head--content--container--form--error', container)
})

it('add song work has expected when bad data is sent', async() => {

    mockUseAuth(authData);
    mockProcessForm({violations: [
        {
            "propertyPath": "name",
            "message": "This value is of bad shape."
        }
    ]});
    mockHasError()

    const {container} = renderMainElement();
    
    await fillAndSendForm(container);

    expect(processForm).toHaveBeenCalled()
    expectElementExist("input#name + .input-text--error",container)
})