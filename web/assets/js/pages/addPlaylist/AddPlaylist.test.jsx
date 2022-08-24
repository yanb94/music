import React from 'react'
import { jest, expect } from "@jest/globals";
import { render, waitFor } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import AddPlaylist from './AddPlaylist';
import { BrowserRouter } from 'react-router-dom'
import { expectElementExist, fillInputWithValue, fillInputWithFile, expectElementExistForWaitFor, searchAndSelectSong } from '@app/test/util';
import { processForm, hasError } from "./processForm";
import { useAuth } from '@app/auth/auth';
import { getData } from '@app/form/songListInput/getData';

const authData = {
    token: "token",
    isAuth: true,
    id: "1",
    artist: false
}

jest.mock("./processForm.js")
jest.mock("@app/auth/auth")
jest.mock('@app/form/songListInput/getData')

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

function mockGetData()
{
    getData.mockImplementation(() => Promise.resolve({
        "hydra:member": [
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
    }))
}

async function fillCorrectlySongSelector(container)
{
    await searchAndSelectSong("Chanson", 0, 1, getData, container)
    await searchAndSelectSong("Chanso", 1, 2, getData, container)
}

function renderMainElement(openNotification = () => {})
{
    return render(<AddPlaylist openNotification={openNotification}/>,{wrapper: BrowserRouter})
}

async function fillAndSendForm(container)
{
    mockGetData()

    const button = container.querySelector("input[type='submit']");
    const imageFile = [new File(['(⌐□_□)'], 'chucknorris.jpeg', { type: 'image/jpeg' })];

    global.URL.createObjectURL = jest.fn(() => 'chucknorris.jpeg');

    await fillCorrectlySongSelector(container)

    await act(async () => {
        fillInputWithFile("input#imageFile",container,imageFile)
        fillInputWithValue('input#name', container, "Playlist 1")
    })

    await act(async () => {
        button.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })
}

it("add playlist render waited element", async () => {

    mockUseAuth(authData);

    const {container} = renderMainElement();

    expectElementExist(".add-playlist--head--content--container--title", container)
    expectElementExist(".input-image",container)
    expectElementExist("input#name",container)
    expectElementExist("input[type='submit']", container)

})

it("add playlist work has expected when request is successful", async () => {

    const notificationFunction = jest.fn(() => {})
    
    mockUseAuth(authData);
    mockProcessForm("ok");

    const {container} = renderMainElement(notificationFunction);
    
    await fillAndSendForm(container);

    expect(processForm).toHaveBeenCalled()
    expect(notificationFunction).toHaveBeenCalled()
})

it("add playlist work has expected when session expired", async() => {
    
    const mockLogout = jest.fn(() => "logout");

    mockUseAuth(authData,mockLogout);
    mockProcessForm(401);

    const {container} = renderMainElement();
    
    await fillAndSendForm(container);

    expect(processForm).toHaveBeenCalled()
    expect(mockLogout).toHaveBeenCalled();
})

it("add playlist work has expected when servor error happened", async() => {

    mockUseAuth(authData);
    mockProcessForm("error");

    const {container} = renderMainElement();
    
    await fillAndSendForm(container);

    expect(processForm).toHaveBeenCalled()
    expectElementExist('.add-playlist--head--content--container--form--error', container)
})

it('add playlist work has expected when bad data is sent', async() => {

    mockUseAuth(authData);
    mockProcessForm({violations: [
        {
            "propertyPath": "name",
            "message": "This value is of bad shape."
        }
    ]});
    mockHasError()

    const {container} = renderMainElement();
    
    await fillAndSendForm(container);

    expect(processForm).toHaveBeenCalled()
    expectElementExist("input#name + .input-text--error",container)
})