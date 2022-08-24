import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import BecomeArtist from '@app/pages/becomeArtist/BecomeArtist'
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
    return render(<BecomeArtist openNotification={openNotification}/>,{wrapper: BrowserRouter})
}

async function fillAndSendForm(container)
{
    const button = container.querySelector("input[type='submit']");
    const file = [new File(['(⌐□_□)'], 'chucknorris.jpeg', { type: 'image/jpeg' })];

    global.URL.createObjectURL = jest.fn(() => 'chucknorris.jpeg');

    await act(async () => {
        fillInputWithFile("input#image",container,file)
        fillInputWithValue("input#name",container,"Artist 1")
        fillInputWithValue('input#email', container, "example@example.com")
        fillInputWithValue('input#email_confirm', container, "example@example.com")
        fillInputWithValue('textarea#description',container,"Je suis une description")
    })

    await act(async () => {
        button.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })
}

it("become artist render waited element", async () => {

    mockUseAuth(authData);

    const {container} = renderMainElement();

    expectElementExist(".become-artist--head--content--container--title", container)
    expectElementExist(".input-image",container)
    expectElementExist("input#name",container)
    expectElementExist('input#email',container)
    expectElementExist('input#email_confirm',container)
    expectElementExist('textarea#description',container)
    expectElementExist("input[type='submit']", container)

})

it("become artist work has expected when request is successful", async () => {

    const notificationFunction = jest.fn(() => {})
    
    mockUseAuth(authData);
    mockProcessForm("ok");

    const {container} = renderMainElement(notificationFunction);
    
    await fillAndSendForm(container);

    expect(processForm).toHaveBeenCalled()
    expect(notificationFunction).toHaveBeenCalled()
})

it("become artist work has expected when session expired", async() => {
    
    const mockLogout = jest.fn(() => "logout");

    mockUseAuth(authData,mockLogout);
    mockProcessForm(401);

    const {container} = renderMainElement();
    
    await fillAndSendForm(container);

    expect(processForm).toHaveBeenCalled()
    expect(mockLogout).toHaveBeenCalled();
})

it("become artist work has expected when servor error happened", async() => {

    mockUseAuth(authData);
    mockProcessForm("error");

    const {container} = renderMainElement();
    
    await fillAndSendForm(container);

    expect(processForm).toHaveBeenCalled()
    expectElementExist('.become-artist--head--content--container--form--error', container)
})

it('become artist work has expected when bad data is sent', async() => {

    mockUseAuth(authData);
    mockProcessForm({violations: [
        {
            "propertyPath": "email",
            "message": "This value is of bad shape."
        }
    ]});
    mockHasError()

    const {container} = renderMainElement();
    
    await fillAndSendForm(container);

    expect(processForm).toHaveBeenCalled()
    expectElementExist("input#email + .input-text--error",container)
})