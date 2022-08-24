import React from "react";
import { jest, expect } from "@jest/globals";
import { render, fireEvent } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import EditInfo from "@app/pages/editInfo/EditInfo";
import { BrowserRouter } from "react-router-dom";
import { getInitialData, sendRequest, hasError } from "./processForm";
import { useAuth } from "@app/auth/auth";
import { expectElementExist, expectElementHasValue, expectElementIsChecked, fillInputWithValue } from "@app/test/util";

async function renderMainElement()
{
    let renderElements = {}

    await act(async () => {
        renderElements = render(<EditInfo openNotification={() => {}}/>,{wrapper: BrowserRouter})
    })

    return renderElements
}

const sampleData = {
    firstname: "John",
    lastname: "Doe",
    sexe: "m",
    birthday: "1980-08-13T00:00:00.000Z"
}

const authData = {
    token: "token",
    isAuth: true,
    id: "1"
}

jest.mock("./processForm.js")
jest.mock("@app/auth/auth")

it("editinfo form render has expected when data get succesfully",async () => {

    useAuth.mockImplementation(() => {
        return {
            auth: authData,
            logout: () => {}
        }
    })
    getInitialData.mockImplementation(() => Promise.resolve(sampleData))

    const {container} = await renderMainElement()

    expectElementExist(".edit-info--head--content--container--title",container)
    const firstnameInput = expectElementExist("input#firstname",container);
    const lastnameInput = expectElementExist("input#lastname",container);
    const sexeInputMen = expectElementExist("input#m",container);
    expectElementExist("input#f",container);
    const birthdayInputDay = expectElementExist("select#day",container);
    const birthdayInputMonth = expectElementExist("select#month",container);
    const birthdayInputYear = expectElementExist("select#year",container);

    expectElementHasValue(firstnameInput, "John")
    expectElementHasValue(lastnameInput, "Doe")
    expectElementIsChecked(sexeInputMen)
    expectElementHasValue(birthdayInputDay, "13")
    expectElementHasValue(birthdayInputMonth, "08")
    expectElementHasValue(birthdayInputYear, "1980")

})

it("editinfo form render has exected when there are a server error", async() => {
    
    getInitialData.mockImplementation(() => Promise.resolve("error"))

    const {container} = await renderMainElement()

    expectElementExist(".edit-info--head--content--container--error", container)
})

it("editinfo form render has exected when session expired", async() => {
    
    const logoutFunction = jest.fn(() => {})

    useAuth.mockImplementation(() => {
        return {
            auth: authData,
            logout: logoutFunction
        }
    })
    getInitialData.mockImplementation(() => Promise.resolve(401))

    const {container} = await renderMainElement()

    expect(logoutFunction).toBeCalled()
})

it("editinfo form work has expected when data is correct", async() => {
    useAuth.mockImplementation(() => {
        return {
            auth: authData,
            logout: () => {}
        }
    })

    getInitialData.mockImplementation(() => Promise.resolve(sampleData))
    sendRequest.mockImplementation(() => Promise.resolve("ok"))

    const {container} = await renderMainElement()
    const buttonSubmit = container.querySelector("input[type='submit']")

    await act(async() => {
        fillInputWithValue("input#firstname",container,"Truc")
    })

    await act(async() => {
        buttonSubmit.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expect(sendRequest).toHaveBeenCalled()
})

it("editinfo form work has expected when session expired", async() => {
    
    const logoutFunction = jest.fn(() => {})
    
    useAuth.mockImplementation(() => {
        return {
            auth: authData,
            logout: logoutFunction
        }
    })

    getInitialData.mockImplementation(() => Promise.resolve(sampleData))
    sendRequest.mockImplementation(() => Promise.resolve(401))

    const {container} = await renderMainElement()
    const buttonSubmit = container.querySelector("input[type='submit']")

    await act(async() => {
        buttonSubmit.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expect(sendRequest).toHaveBeenCalled()
    expect(logoutFunction).toHaveBeenCalled()
})

it("editinfo form work has expected when servor error", async() => {
    
    hasError.mockImplementation(
        (resultRequest, setError) => jest.requireActual("./processForm.js").hasError(resultRequest, setError)
    )
    getInitialData.mockImplementation(() => Promise.resolve(sampleData))
    sendRequest.mockImplementation(() => Promise.resolve("error"))

    const {container} = await renderMainElement()
    const buttonSubmit = container.querySelector("input[type='submit']")

    await act(async() => {
        buttonSubmit.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expect(sendRequest).toHaveBeenCalled()
    expectElementExist(".edit-info--head--content--container--form--error", container)
})

it("editinfo form work has expected when datas are incorrect", async() => {

    getInitialData.mockImplementation(() => Promise.resolve(sampleData))
    sendRequest.mockImplementation(() => Promise.resolve({violations: [
            {
                "propertyPath": "lastname",
                "message": "This value is of bad shape."
            }
        ]
    }))

    const {container} = await renderMainElement()
    const buttonSubmit = container.querySelector("input[type='submit']")

    await act(async() => {
        buttonSubmit.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expect(sendRequest).toHaveBeenCalled()
    expectElementExist('input#lastname + .input-text--error',container);

})