import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import { BrowserRouter } from 'react-router-dom'
import { useAuth } from "@app/auth/auth"
import { expectElementExist } from '@app/test/util';
import ManageSubscribe from './ManageSubscribe';
import { getSubscriptionInfo, pauseSubscription, cancelSubscription } from './processForm'

jest.mock('./processForm.js')
jest.mock("@app/auth/auth")

function mockUseAuth(logout = () => {},token = "token", isAuth = true, id = "1")
{
    const authData = {
        token: token,
        isAuth: isAuth,
        id: id,
    }

    useAuth.mockImplementation(() => {
        return {
            auth: authData,
            logout: logout,
            updateAuth: () => {}
        }
    })
}

function mockGetSubscriptionInfo(result)
{
    getSubscriptionInfo.mockImplementation(() => Promise.resolve(result))
}

function mockPauseSubscription(result)
{
    pauseSubscription.mockImplementation(() => Promise.resolve(result))
}

function mockCancelSubscription(result)
{
    cancelSubscription.mockImplementation(() => Promise.resolve(result))
}

function fakeInfo()
{
    return {
        endDate: "06/01/2022",
        lastInvoiceAmount: 19.19,
        lastInvoiceDate: "06/12/2021",
        pause: null,
        seeInvoicesLink: "https://billing.stripe.com/session/test_token",
        status: "active",
        upcomingInvoiceAmount: 19.19,
        upcomingInvoiceDate: "06/01/2022"
    }
}

async function renderMainElement()
{
    let renderElements = {}

    await act(async () => {
        renderElements = render(<ManageSubscribe />,{wrapper: BrowserRouter})
    })

    return renderElements
}

afterEach(() => {
    jest.clearAllMocks();
});

it("render expected element when request succeed", async() => {
    mockUseAuth()
    mockGetSubscriptionInfo(fakeInfo())

    const {container} = await renderMainElement()

    expectElementExist('.subscribe-page--head--content--container--title', container)

    const nbInfoLine = container.querySelectorAll('.subscribe-page--subscribe-info').length
    const nbButton = container.querySelectorAll('.subscribe-page--button').length

    expect(nbInfoLine).toBe(4)
    expect(nbButton).toBe(3)

    expect(getSubscriptionInfo).toBeCalled()
})

it("user is disconnected when session expire", async() => {

    const mockLogout = jest.fn(() => {})
    mockUseAuth(mockLogout)
    mockGetSubscriptionInfo(401)

    const {container} = await renderMainElement()

    expect(getSubscriptionInfo).toBeCalled()
    expect(mockLogout).toBeCalled()
})

it("show error when request fail", async() => {

    mockUseAuth()
    mockGetSubscriptionInfo("error")

    const {container} = await renderMainElement()
    expectElementExist('.subscribe-page--error',container)

    expect(getSubscriptionInfo).toBeCalled()
})

//// Pause Button Test

it("disconnect user when session expired after pause button clicked", async() => {
    
    const mockLogout = jest.fn(() => {})
    mockUseAuth(mockLogout)
    mockGetSubscriptionInfo(fakeInfo())
    mockPauseSubscription(401)

    const {container} = await renderMainElement()

    const button = container.querySelector('.subscribe-page--button.pause')

    await act(async () => {
        button.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expect(getSubscriptionInfo).toBeCalled()
    expect(pauseSubscription).toBeCalled()
})

it("show error when request failed after pause button clicked", async() => {
    mockUseAuth()
    mockGetSubscriptionInfo(fakeInfo())
    mockPauseSubscription("error")

    const {container} = await renderMainElement()

    const button = container.querySelector('.subscribe-page--button.pause')

    await act(async () => {
        button.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expectElementExist('.subscribe-page--error-action',container)

    expect(getSubscriptionInfo).toBeCalled()
    expect(pauseSubscription).toBeCalled()

})

it("data reload when request succeed after pause button clicked",async() => {
    mockUseAuth()
    mockGetSubscriptionInfo(fakeInfo())
    mockPauseSubscription("ok")

    const {container} = await renderMainElement()

    const button = container.querySelector('.subscribe-page--button.pause')

    await act(async () => {
        button.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expect(getSubscriptionInfo).toBeCalledTimes(2)
    expect(pauseSubscription).toBeCalled()
})

// Cancel Button Test

it("disconnect user when session expired after cancel button clicked", async() => {
    
    const mockLogout = jest.fn(() => {})
    mockUseAuth(mockLogout)
    mockGetSubscriptionInfo(fakeInfo())
    mockCancelSubscription(401)

    const {container} = await renderMainElement()

    const button = container.querySelector('.subscribe-page--button.cancel')

    await act(async () => {
        button.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expect(getSubscriptionInfo).toBeCalled()
    expect(cancelSubscription).toBeCalled()
})

it("show error when request failed after cancel button clicked", async() => {
    mockUseAuth()
    mockGetSubscriptionInfo(fakeInfo())
    mockCancelSubscription("error")

    const {container} = await renderMainElement()

    const button = container.querySelector('.subscribe-page--button.cancel')

    await act(async () => {
        button.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expectElementExist('.subscribe-page--error-action',container)

    expect(getSubscriptionInfo).toBeCalled()
    expect(cancelSubscription).toBeCalled()
})

it("refresh page when request succeed after cancel button clicked",async() => {
    
    delete window.location
    window.location = new URL('https://www.example.com/space-member/subscribe')

    const mockReload = jest.fn(() => {})

    window.location.reload = mockReload

    mockUseAuth()
    mockGetSubscriptionInfo(fakeInfo())
    mockCancelSubscription("ok")

    const {container} = await renderMainElement()

    const button = container.querySelector('.subscribe-page--button.cancel')

    await act(async () => {
        button.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expect(mockReload).toBeCalled()

    expect(getSubscriptionInfo).toBeCalled()
    expect(cancelSubscription).toBeCalled()
})

// Manage Button Test

it("go to stripe portal when click on management button", async() => {

    const info = fakeInfo()

    mockUseAuth()
    mockGetSubscriptionInfo(info)

    const {container} = await renderMainElement()

    const button = container.querySelector('.subscribe-page--button.manage')

    await act(async () => {
        button.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expect(window.location.href).toBe(info.seeInvoicesLink)

    expect(getSubscriptionInfo).toBeCalled()
})