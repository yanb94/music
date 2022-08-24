import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import EditPlaylist from './EditPlaylist';
import { BrowserRouter } from 'react-router-dom'
import { processForm, hasError, getInitialData } from "./processForm";
import { useAuth } from '@app/auth/auth';
import { expectElementExist, expectElementHasValue, fillInputWithValue, fillInputWithFile } from '@app/test/util';

const authData = {
    token: "token",
    isAuth: true,
    id: "1",
    artist: true
}

jest.mock("./processForm.js")
jest.mock("@app/auth/auth")

const sampleData = {
    "id": 2,
    "name": "Playlist 1",
    "contentImageUrl": "/images/613b356384fd8793430487.jpeg",
    "songs": [
        {
            "@id": "/api/songs/7",
            "@type": "Song",
            "author": {
                "@id": "/api/artists/26",
                "@type": "Artist",
                contentUrl: "/images/avatar/61471466aa9d9111218074.jpg",
                description: "Je suis une description",
                email: "example@example.com",
                id: 26,
                name: "Artiste 1",
            },
            contentImageUrl: "/images/song/6149ebb8b93db629804233.jpg",
            contentSongUrl: "/song/6149ebb8ba02a446872620.mp3",
            createdAt: "2021-09-21T16:27:04+02:00",
            id: 7,
            name: "Chanson 6",
            songDuration: 104.98612244898
        },
        {
            "@id": "/api/songs/8",
            "@type": "Song",
            "author": {
                "@id": "/api/artists/26",
                "@type": "Artist",
                contentUrl: "/images/avatar/61471466aa9d9111218074.jpg",
                description: "Je suis une description",
                email: "example@example.com",
                id: 26,
                name: "Artiste 1",
            },
            contentImageUrl: "/images/song/6149ebb8b93db629804233.jpg",
            contentSongUrl: "/song/6149ebb8ba02a446872620.mp3",
            createdAt: "2021-09-21T16:27:04+02:00",
            id: 8,
            name: "Chanson 8",
            songDuration: 104.98612244898
        },
    ]
}

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

function mockGetInitialData(result)
{
    getInitialData.mockImplementation(() => Promise.resolve(result))
}

function mockHasError()
{
    hasError.mockImplementation(
        (resultRequest, setError) => jest.requireActual("./processForm.js").hasError(resultRequest, setError)
    )
}

async function renderMainElement(openNotification = () => {})
{
    let renderElements = {}

    await act(async () => {
        renderElements = render(<EditPlaylist openNotification={openNotification}/>,{wrapper: BrowserRouter})
    })

    return renderElements
}

async function fillAndSendForm(container)
{
    const button = container.querySelector("input[type='submit']");
    const file = [new File(['(⌐□_□)'], 'chucknorris.jpeg', { type: 'image/jpeg' })];

    global.URL.createObjectURL = jest.fn(() => 'chucknorris.jpeg');

    await act(async () => {
        fillInputWithFile("input#imageFile",container,file)
        fillInputWithValue("input#name",container,"Playlist Test")
    })

    await act(async () => {
        button.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })
}

it("editPlaylist render waited element", async () => {

    mockUseAuth(authData);
    mockGetInitialData(sampleData)

    const {container} = await renderMainElement();

    expectElementExist(".edit-playlist--head--content--container--title", container)
    expectElementExist(".input-image",container)
    
    expect(
        expectElementExist("label#label-image-imageFile",container).style.getPropertyValue('--backgroundBefore')
    ).toBe("url("+sampleData.contentImageUrl+")")
        
    expectElementHasValue(
        expectElementExist("input#name",container),
        sampleData.name
    )
    
    expectElementExist("input[type='submit']", container)

    const nbSelectedItem = container.querySelectorAll(".song-list-input--selected-items--item").length

    expect(nbSelectedItem).toBe(2)

})

it("editPlaylist form render has expected when there are a server error", async() => {
    
    mockUseAuth(authData);
    mockGetInitialData("error")

    const {container} = await renderMainElement()

    expectElementExist(".edit-playlist--head--content--container--error", container)
})

it("editPlaylist form render has expected when session expired", async() => {
    
    const logoutFunction = jest.fn(() => {})

    mockUseAuth(authData, logoutFunction)
    mockGetInitialData(401)

    const {container} = await renderMainElement()

    expect(logoutFunction).toBeCalled()
})

it("editPlaylist form work has expected when data is correct", async() => {
    
    mockUseAuth(authData);
    mockGetInitialData(sampleData)
    mockProcessForm("ok")

    const mockOpenNotification = jest.fn();

    const {container} = await renderMainElement(mockOpenNotification)
    const buttonSubmit = container.querySelector("input[type='submit']")

    await act(async() => {
        fillAndSendForm(container)
    })

    await act(async() => {
        buttonSubmit.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expect(processForm).toHaveBeenCalled()
    expect(mockOpenNotification).toHaveBeenCalled()
})

it("editPlaylist form work has expected when session expired", async() => {
    
    const logoutFunction = jest.fn(() => {})

    mockUseAuth(authData, logoutFunction);
    mockGetInitialData(sampleData)
    mockProcessForm(401)

    const {container} = await renderMainElement()
    const buttonSubmit = container.querySelector("input[type='submit']")

    await act(async() => {
        buttonSubmit.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expect(processForm).toHaveBeenCalled()
    expect(logoutFunction).toHaveBeenCalled()
})

it("editPlaylist form work has expected when servor error", async() => {
    
    mockUseAuth(authData);
    mockHasError()
    mockGetInitialData(sampleData)
    mockProcessForm("error")

    const {container} = await renderMainElement()
    const buttonSubmit = container.querySelector("input[type='submit']")

    await act(async() => {
        buttonSubmit.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expect(processForm).toHaveBeenCalled()
    expectElementExist(".edit-playlist--head--content--container--form--error", container)
})

it("editPlaylist form work has expected when datas are incorrect", async() => {

    mockUseAuth(authData);
    mockGetInitialData(sampleData)
    mockProcessForm({violations: [
            {
                "propertyPath": "name",
                "message": "This value is of bad shape."
            }
        ]
    })

    const {container} = await renderMainElement()
    const buttonSubmit = container.querySelector("input[type='submit']")

    await act(async() => {
        buttonSubmit.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expect(processForm).toHaveBeenCalled()
    expectElementExist('input#name + .input-text--error',container);

})
