import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import { BrowserRouter } from 'react-router-dom'
import { useAuth } from "@app/auth/auth"
import { expectElementExist } from '@app/test/util';
import SubscribePage from './SubscribePage';
import { processPayement } from './processForm';

jest.mock('./processForm.js')
jest.mock("@app/auth/auth")

function mockUseAuth(logout = () => {},token = "token", isAuth = true, id = "1")
{
    const authData = {
        token: token,
        isAuth: isAuth,
        id: id
    }

    useAuth.mockImplementation(() => {
        return {
            auth: authData,
            logout: logout
        }
    })
}

function mockProcessPayement(result)
{
    processPayement.mockImplementation(() => Promise.resolve(result))
}

async function renderMainElement()
{
    let renderElements = {}

    await act(async () => {
        renderElements = render(<SubscribePage />,{wrapper: BrowserRouter})
    })

    return renderElements
}

it("begin are rendered when no url params", async() => {

    window.location.search = "";

    mockUseAuth()
    const {container} = await renderMainElement()

    expectElementExist('.subscribe-page--begin',container)

})

it("canceled are rendered when url param canceled exist", async() => {
    
    delete window.location
    window.location = new URL('https://www.example.com/space-member/subscribe?canceled=true')

    mockUseAuth()
    const {container} = await renderMainElement()

    expectElementExist('.subscribe-page--canceled',container)
})

it("success are rendered when url param success exist", async() => {
    
    delete window.location
    window.location = new URL('https://www.example.com/space-member/subscribe?success=true')
    
    mockUseAuth()
    const {container} = await renderMainElement()

    expectElementExist('.subscribe-page--success',container)
})

it("return to begin when click on return button in cancel", async() => {
    
    delete window.location
    window.location = new URL('https://www.example.com/space-member/subscribe?canceled=true')
    
    mockUseAuth()
    const {container} = await renderMainElement()

    expectElementExist('.subscribe-page--canceled',container)

    const button = container.querySelector('.subscribe-page--button')

    await act(async () => {
        button.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expectElementExist('.subscribe-page--begin',container)
})

it("logout after click on logout button in success", async() => {

    delete window.location
    window.location = new URL('https://www.example.com/space-member/subscribe?success=true')
    
    const mockLogout = jest.fn(() => {});
    mockUseAuth(mockLogout)

    const {container} = await renderMainElement()

    expectElementExist('.subscribe-page--success',container)

    const button = container.querySelector('.subscribe-page--button')

    await act(async () => {
        button.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expect(mockLogout).toBeCalled()
})

it("request not launch is checkbox not checked", async() => {

    delete window.location
    window.location = new URL('https://www.example.com/space-member/subscribe')

    mockProcessPayement()
    mockUseAuth()

    const {container} = await renderMainElement()
    expectElementExist('.subscribe-page--begin',container)

    const button = container.querySelector('.subscribe-page--button')

    await act(async () => {
        button.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expect(processPayement).not.toBeCalled()

})

it("error is shown when request fail",async() => {

    delete window.location
    window.location = new URL('https://www.example.com/space-member/subscribe')

    mockProcessPayement("error")
    mockUseAuth()

    const {container} = await renderMainElement()
    expectElementExist('.subscribe-page--begin',container)

    const checkbox = container.querySelector('.subscribe-page--checkbox .checkbox label')
    await act(async () => {
        checkbox.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    const button = container.querySelector('.subscribe-page--button')
    await act(async () => {
        button.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expect(processPayement).toBeCalled()
    expectElementExist('.subscribe-page--error',container)
})

it("logout when session expired", async() => {
    delete window.location
    window.location = new URL('https://www.example.com/space-member/subscribe')

    mockProcessPayement(401)

    const mockLogout = jest.fn(() => {});
    mockUseAuth(mockLogout)

    const {container} = await renderMainElement()
    expectElementExist('.subscribe-page--begin',container)

    const checkbox = container.querySelector('.subscribe-page--checkbox .checkbox label')
    await act(async () => {
        checkbox.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    const button = container.querySelector('.subscribe-page--button')
    await act(async () => {
        button.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expect(processPayement).toBeCalled()
    expect(mockLogout).toBeCalled()
})

it("redirect to checkout page when request succeed", async() => {
 
    const mockReplaceUrl = jest.fn(() => {})

    window.location = new URL('https://www.example.com/space-member/subscribe')
    window.location.replace = mockReplaceUrl

    mockProcessPayement({
        "checkout_url": "https://www.example.com/truc"
    })
    mockUseAuth()

    const {container} = await renderMainElement()
    expectElementExist('.subscribe-page--begin',container)

    const checkbox = container.querySelector('.subscribe-page--checkbox .checkbox label')
    await act(async () => {
        checkbox.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    const button = container.querySelector('.subscribe-page--button')
    await act(async () => {
        button.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expect(processPayement).toBeCalled()
    expect(mockReplaceUrl).toBeCalled()
})