import React from "react";
import { jest, expect } from "@jest/globals";
import { render, fireEvent } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import ChangeEmail from "./ChangeEmail";
import { BrowserRouter } from "react-router-dom";
import { sendRequest, hasError } from "./processForm";
import { useAuth } from "@app/auth/auth";
import { expectElementExist, fillInputWithValue } from "@app/test/util"

const authData = {
    token: "token",
    isAuth: true,
    id: "1"
}

jest.mock("./processForm.js")
jest.mock("@app/auth/auth")

function mockUseAuth(authData, logout = () => {})
{
    useAuth.mockImplementation(() => {
        return {
            auth: authData,
            logout: logout
        }
    })
}

function mockSendRequest(result)
{
    sendRequest.mockImplementation(() => Promise.resolve(result));
}

function mockHasError()
{
    hasError.mockImplementation(
        (resultRequest, setError) => jest.requireActual("./processForm.js").hasError(resultRequest, setError)
    )
}

function renderMainElement(openNotification = () => {})
{
    return render(<ChangeEmail openNotification={openNotification}/>,{wrapper: BrowserRouter})
}

async function fillAndSendForm(container)
{
    const button = container.querySelector("input[type='submit']")

    await act(async () => {
        fillInputWithValue("input#newEmail",container,"example@example.com")
        fillInputWithValue("input#newEmail_confirm",container,"example@example.com")
    })

    await act(async () => {
        button.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })
}

it("change email render has expected", async() => {

    mockUseAuth(authData);

    const {container} = renderMainElement()

    expectElementExist(".change-email--head--content--container--title", container)
    expectElementExist("input#newEmail", container)
    expectElementExist("input#newEmail_confirm", container)
    expectElementExist("input[type='submit']", container)

})

it("change email render has expected when request sent successfuly", async () => {

    const notificationFunction = jest.fn(() => {})

    mockUseAuth(authData);
    mockSendRequest("ok")

    const {container} = renderMainElement(notificationFunction)

    await fillAndSendForm(container)

    expect(sendRequest).toHaveBeenCalled()
    expect(notificationFunction).toHaveBeenCalled()

})

it("change email render has expected when session expired", async () => {

    const mockLogout = jest.fn(() => {})

    mockUseAuth(authData, mockLogout);
    mockSendRequest(401)

    const {container} = renderMainElement()

    await fillAndSendForm(container)

    expect(sendRequest).toHaveBeenCalled()
    expect(mockLogout).toHaveBeenCalled()
})

it("change email render has expected when servor error happened", async () => {

    mockUseAuth(authData);
    mockSendRequest("error")

    const {container} = renderMainElement()

    await fillAndSendForm(container)

    expect(sendRequest).toHaveBeenCalled();
    expectElementExist('.change-email--head--content--container--form--error', container)

})

it("change email render has expected when bad data was sent", async () => {

    mockUseAuth(authData)
    mockSendRequest({violations: [
        {
            "propertyPath": "newEmail",
            "message": "This value is of bad shape."
        }
    ]})
    mockHasError()

    const {container} = renderMainElement()

    await fillAndSendForm(container)
    
    expect(sendRequest).toHaveBeenCalled();
    expectElementExist("input#newEmail + .input-text--error",container);
})