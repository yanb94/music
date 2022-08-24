import React from "react";
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import { BrowserRouter } from "react-router-dom";
import { hasError, sendRequest } from "./processForm";
import { expectElementExist, expectElementHasContent, fillInputWithValue } from "@app/test/util"
import Contact from "./Contact";

const demoData = {
    lastname: "Doe",
    firstname: "John",
    email: "example@example.com",
    message: "Je suis un message"
}

jest.mock("./processForm.js")

async function fillAndSendForm(container,demoData)
{
    const button = container.querySelector("input[type='submit']");

    await act(async () => {
        fillInputWithValue("input#firstname",container,demoData.firstname)
        fillInputWithValue("input#lastname",container,demoData.lastname)
        fillInputWithValue('input#email', container, demoData.email)
        fillInputWithValue('textarea#message',container,demoData.message)
    })

    await act(async () => {
        button.dispatchEvent(new MouseEvent('click',{bubbles: true}))
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

function renderMainElement()
{
    return render(
        <Contact/>,
        {wrapper: BrowserRouter}
    );
}

it("contact page render has expected", async() => {

    const {container} = renderMainElement()

    expectElementExist(".contact--head--content--container--title",container)

    expectElementExist('input#firstname',container)
    expectElementExist('input#lastname',container)
    expectElementExist('input#email',container)
    expectElementExist('textarea#message',container)

    expectElementExist("input[type='submit']",container)
})

it("contact page catch error when bad data", async() => {

    mockSendRequest("ok")

    const {container} = renderMainElement()

    await fillAndSendForm(container,{...demoData, firstname: ""})

    expect(sendRequest).not.toHaveBeenCalled()
}) 

it("contact page work has expected when good data", async() => {

    mockSendRequest("ok")
    const {container} = renderMainElement()

    await fillAndSendForm(container,demoData)
    expect(sendRequest).toHaveBeenCalled()
})

it("contact page work has expected when error servor", async() => {

    mockSendRequest("error")
    const {container} = renderMainElement()

    await fillAndSendForm(container,demoData)
    expect(sendRequest).toHaveBeenCalled()
    expect(container.querySelector('.contact--head--content--container--form--error')).not.toBeNull()
})

it("contact page work has expected when bad data", async() => {

    mockHasError()
    mockSendRequest({
        violations: [
            {
                message: "Ce prénom a une forme inattendu",
                propertyPath: "firstname"
            }
        ]
    })
    const {container} = renderMainElement()

    await fillAndSendForm(container,demoData)

    expectElementHasContent(
        expectElementExist('input#firstname + .input-text--error',container),
        "<i class=\"fas fa-exclamation-triangle\"></i> Ce prénom a une forme inattendu"
    )

    expect(sendRequest).toHaveBeenCalled()
})