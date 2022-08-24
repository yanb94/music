import React from "react";
import { jest, expect } from "@jest/globals";
import { render, fireEvent } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import ChangePassword from "./ChangePassword";
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

function renderMainElement(openNotification = () => {})
{
    return render(<ChangePassword openNotification={openNotification}/>,{wrapper: BrowserRouter})
}

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

async function fillAndSendForm(container,oldPassword,newPassword,newPasswordConfirm)
{
    const button = container.querySelector("input[type='submit']")

    await act(async () => {
        fillInputWithValue("input#oldPassword",container,oldPassword)
        fillInputWithValue("input#plainPassword",container,newPassword)
        fillInputWithValue("input#plainPassword_confirm",container,newPasswordConfirm)
    })

    await act(async () => {
        button.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })
}

it("change password page render has expected",async () => {

    mockUseAuth(authData)

    const {container} = renderMainElement()

    expectElementExist(".change-password--head--content--container--title", container)
    expectElementExist("input#oldPassword", container)
    expectElementExist("input#plainPassword", container)
    expectElementExist("input#plainPassword_confirm", container)
    expectElementExist("input[type='submit']", container)

})

it("change password render has expect when sendRequest is sucessful", async () => {
    const notificationFunction = jest.fn(() => {})

    mockUseAuth(authData)
    mockSendRequest("ok")
    
    const {container} = renderMainElement(notificationFunction)

    await fillAndSendForm(container,"oldPassword","newPassword","newPassword")

    expect(sendRequest).toHaveBeenCalled()
    expect(notificationFunction).toHaveBeenCalled()
})

it("change password render has expect when bad data send", async () => {
    mockUseAuth(authData)
    mockSendRequest({violations: [
        {
            "propertyPath": "oldPassword",
            "message": "This value is of bad shape."
        }
    ]})
    hasError.mockImplementation(
        (resultRequest, setError) => jest.requireActual("./processForm.js").hasError(resultRequest, setError)
    )

    const {container} = renderMainElement()

    await fillAndSendForm(container,"badPassword","newPassword","newPassword")

    expectElementExist("input#oldPassword + .input-text--error",container);

})

it("change password render has expect when servor error",async() => {
    mockUseAuth(authData)
    mockSendRequest("error")

    const {container} = renderMainElement()

    await fillAndSendForm(container,"badPassword","newPassword","newPassword")

    expectElementExist(".change-password--head--content--container--form--error",container);
})

it("change password logout user when token expire", async () => {
    const mockLogout = jest.fn(() => {})
    
    mockUseAuth(authData, mockLogout)
    mockSendRequest(401)

    const {container} = renderMainElement()
    
    await fillAndSendForm(container,"badPassword","newPassword","newPassword")

    expect(mockLogout).toHaveBeenCalled()
})