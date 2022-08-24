import React from "react";
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import Register from "./Register";
import { BrowserRouter } from "react-router-dom";
import { hasError, sendRequest } from "./processForm";
import { expectElementExist, fillInputWithValue } from "@app/test/util"

const demoData = {
    lastname: "Doe",
    firstname: "John",
    day: "05",
    month: "12",
    year: "1995",
    email: "example@example.com",
    emailConfirm: "example@example.com",
    plainPassword: "password",
    plainPasswordConfirm: "password",
    username: "john40"
}

function renderMainElement()
{
    return render(
        <Register/>,
        {wrapper: BrowserRouter}
    );
}

async function fillAndSendForm(container, data = {})
{
    const sexeHomme = container.querySelector('input#m');
    const legal = container.querySelector('input#legal');
    const button = container.querySelector("input[type='submit']")

    await act(async () => {
        fillInputWithValue('input#lastname',container,data.lastname)
        fillInputWithValue('input#firstname',container,data.firstname)

        fillInputWithValue('select#day',container,data.day)
        fillInputWithValue('select#month',container,data.month)
        fillInputWithValue('select#year',container,data.year)

        fillInputWithValue('input#email',container,data.email)
        fillInputWithValue('input#email_confirm',container,data.emailConfirm)

        fillInputWithValue('input#plainPassword',container,data.plainPassword)
        fillInputWithValue('input#plainPassword_confirm',container,data.plainPasswordConfirm)

        fillInputWithValue('input#username',container,data.username)

        sexeHomme.dispatchEvent(new MouseEvent('click',{bubbles: true}))
        legal.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    await act(async () => {
        button.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })
}

it("register page render has expected", () => {

    const {container} = renderMainElement();

    const registerCont = container.querySelector('.register')
    expectElementExist('.register', container)

    // lastname
    expectElementExist('input#lastname', registerCont)
    // firstname
    expectElementExist('input#firstname', registerCont)
    // birthdate
    expectElementExist('div.birthdate-input--cont', registerCont)
    const birthdayCont = container.querySelector('div.birthdate-input--cont')
    expectElementExist('select#day', birthdayCont)
    expectElementExist('select#month', birthdayCont)
    expectElementExist('select#year', birthdayCont)
    // sexe
    expectElementExist('div.radio-input', registerCont)
    const sexeCont = container.querySelector('div.radio-input')
    expectElementExist('input#f', sexeCont)
    expectElementExist('input#m', sexeCont)
    // email
    expectElementExist('input#email', registerCont)
    // email_confirm
    expectElementExist('input#email_confirm', registerCont)
    // username
    expectElementExist('input#username', registerCont)
    // plainPassword
    expectElementExist('input#plainPassword', registerCont)
    // plainPassword_confirm
    expectElementExist('input#plainPassword_confirm', registerCont)
    // legal
    expectElementExist('input#legal', registerCont)
    // button
    expectElementExist("input[type='submit']", registerCont)
})



jest.mock("./processForm.js");

it("register form is send has expected when request was success",async () => {

    sendRequest.mockImplementation(() => Promise.resolve("ok"))

    const {container} = renderMainElement();

    await fillAndSendForm(container,demoData)

    expect(sendRequest).toHaveBeenCalled()

})

it("register form return an errors when bad data send", async () => {    

    hasError.mockImplementation(
        (resultRequest, setError) => jest.requireActual("./processForm.js").hasError(resultRequest, setError)
    )

    sendRequest.mockImplementation(() => Promise.resolve(
        {
            violations: [
                {
                    code: "23bd9dbf-6b9b-41cd-a99e-4844bcf3077f",
                    message: "Ce nom d'utilisateur est déjà utilisé",
                    propertyPath: "username"
                }
            ]
        }
    ))

    const {container} = renderMainElement();

    await fillAndSendForm(container,demoData)

    expect(
        container.querySelector('input#username + .input-text--error').innerHTML
    ).toBe(
        "<i class=\"fas fa-exclamation-triangle\"></i> Ce nom d'utilisateur est déjà utilisé"
    )

    expect(sendRequest).toHaveBeenCalled()
})

it("register form return an error when servor error", async () => {
    sendRequest.mockImplementation(() => Promise.resolve("error"))

    const {container} = renderMainElement();

    await fillAndSendForm(container,demoData)

    expect(container.querySelector('.register--head--content--container--form--error')).not.toBeNull()

    expect(sendRequest).toHaveBeenCalled()
})