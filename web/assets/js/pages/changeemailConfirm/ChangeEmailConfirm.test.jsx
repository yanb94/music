import React from 'react'
import processConfirmation from './processConfirmation'
import { useAuth } from "@app/auth/auth";
import { BrowserRouter } from "react-router-dom";
import { jest, expect } from "@jest/globals";
import { render, fireEvent } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import ChangeEmailConfirm from './ChangeEmailConfirm';
import { expectElementHasContent } from '@app/test/util'

function mockUseAuth(authData, logout = () => {})
{
    useAuth.mockImplementation(() => {
        return {
            auth: authData,
            logout: logout
        }
    })
}

const authData = {
    token: "token",
    isAuth: true,
    id: "1"
}

jest.mock("./processConfirmation.js")
jest.mock("@app/auth/auth")

function mockProcessConfirmation(value)
{
    processConfirmation.mockImplementation(() => Promise.resolve(value))
}

async function renderMainElement()
{
    let renderElements = {}

    await act(async () => {
        renderElements = render(<ChangeEmailConfirm/>,{wrapper: BrowserRouter})
    })

    return renderElements
}

it("ChangeEmailComfirm render has expected when response is successful", async () => {

    mockUseAuth(authData)
    mockProcessConfirmation(200)

    const {container} = await renderMainElement()

    const title = container.querySelector(".change-email-confirmed--card--title")

    expectElementHasContent(title,"Changement d'email validé")
})

it("ChangeEmailComfirm render has expected when error is returned", async () => {
    
    mockUseAuth(authData)
    mockProcessConfirmation(404)

    const {container} = await renderMainElement()

    const title = container.querySelector(".change-email-confirmed--card--title")

    expectElementHasContent(title,"Changement d'email non validé")
})