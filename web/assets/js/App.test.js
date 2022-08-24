import React from "react";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import App from "./App"
import { expect, jest } from "@jest/globals";
import getLegalList from "./getLegalList";
import {expectElementExist} from "@app/test/util"
import { getTopSongs } from './pages/home/getData.js'
import { useAuth, AuthProvider } from "@app/auth/auth"

jest.mock('./getLegalList.js');
jest.mock('./pages/home/getData.js')
jest.mock("@app/auth/auth")

const intersectionObserverMock = () => ({
    observe: () => null,
    unobserve: () => null
})

window.IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMock);

function mockGetLegalList()
{
    getLegalList.mockImplementation(() => Promise.resolve(
        [
            {
                "id": 2,
                "title": "Mention Légale",
                "label": "Mention Légale",
                "slug": "mention-legale"
            },
            {
                "id": 3,
                "title": "Politique de confidentialité",
                "label": "Confidentialité",
                "slug": "politique-de-confidentialite"
            },
            {
                "id": 1,
                "title": "Conditions générale d'utilisation",
                "label": "C.G.U",
                "slug": "conditions-generale-dutilisation"
            }
        ]
    ));
}

async function renderMainElement()
{
    let renderElements = {}

    await act(async () => {
        renderElements = render(<App/>)
    })

    return renderElements
}


function mockGetTopSongs(result)
{
    getTopSongs.mockImplementation(() => Promise.resolve(result))
}

function mockAuthProvider()
{
    AuthProvider.mockImplementation(jest.requireActual("@app/auth/auth").AuthProvider)
}

function mockUseAuth(logout = () => {},token = "token", isAuth = true, id = "1", isSubscribe = false)
{
    const authData = {
        token: token,
        isAuth: isAuth,
        id: id,
        isSubscribe: isSubscribe
    }

    useAuth.mockImplementation(() => {
        return {
            auth: authData,
            logout: logout
        }
    })
}

function fakeDataSongs(nb)
{
    let songs = []

    for (let index = 0; index < nb; index++) {
        
        songs.push({
            "@id": "/api/songs/"+(index+1),
            "@type": "Song",
            "author": {
                "@id": "/api/artists/26",
                "@type": "Artist",
                "contentUrl": "/images/avatar/61471466aa9d9111218074.jpg",
                "description": "Je suis une description",
                "email": "example@example.com",
                "id": 26,
                "name": "Artiste 1",
            },
            "contentImageUrl": "/images/song/6149eca0f0cb8842719191.jpg",
            "contentSongUrl": "/song/6149eca0f18a0573296342.mp3",
            "createdAt": "2021-09-21T16:30:56+02:00",
            "id": (index+1),
            "name": "Chanson "+(index+1),
            "songDuration": 104.98612244898
        })
        
    }

    return {
        "hydra:member":songs
    }
}


it("drawer work has expected", async() => {

    window.scrollTo = jest.fn();

    mockAuthProvider()
    mockUseAuth()
    mockGetTopSongs(fakeDataSongs(4))
    mockGetLegalList();

    const { container } = await renderMainElement()

    const drawer = container.querySelector('.drawer');
    const drawerBackground = container.querySelector('.drawer--background');
    const buttonDrawer = container.querySelector('.header--title-cont--drawer-button');

    // Drawer is close at begin
    expect(drawer.classList.contains('open')).toBe(false);
    expect(drawerBackground.classList.contains('open')).toBe(false);

    await act(async () => {
        buttonDrawer.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    // Drawer is open after a click on the opening button
    expect(drawer.classList.contains('open')).toBe(true);
    expect(drawerBackground.classList.contains('open')).toBe(true);

    await act(async () => {
        drawerBackground.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    // Drawer is close after click on drawer background 
    expect(drawer.classList.contains('open')).toBe(false);
    expect(drawerBackground.classList.contains('open')).toBe(false);

})

it("list of legals is render has expected when request succeed", async() => {

    mockAuthProvider()
    mockUseAuth()
    mockGetTopSongs(fakeDataSongs(4))

    getLegalList.mockImplementation(() => Promise.resolve(
        [
            {
              "id": 2,
              "title": "Mention Légale",
              "label": "Mention Légale",
              "slug": "mention-legale"
            },
            {
              "id": 3,
              "title": "Politique de confidentialité",
              "label": "Confidentialité",
              "slug": "politique-de-confidentialite"
            },
            {
              "id": 1,
              "title": "Conditions générale d'utilisation",
              "label": "C.G.U",
              "slug": "conditions-generale-dutilisation"
            }
          ]
    ));

    const { container } = await renderMainElement();

    expectElementExist(".footer--infos--links--item[href='/legal/mention-legale']", container)
    expectElementExist(".footer--infos--links--item[href='/legal/politique-de-confidentialite']", container)
    expectElementExist(".footer--infos--links--item[href='/legal/conditions-generale-dutilisation']", container)

    expectElementExist(".drawer--body--list--item[href='/legal/mention-legale']", container)
    expectElementExist(".drawer--body--list--item[href='/legal/politique-de-confidentialite']", container)
    expectElementExist(".drawer--body--list--item[href='/legal/conditions-generale-dutilisation']", container)

    expect(getLegalList).toHaveBeenCalled()

})

it("render normally when can't retrieve legal list", async() => {

    mockAuthProvider()
    mockUseAuth()
    mockGetTopSongs(fakeDataSongs(4))

    getLegalList.mockImplementation(() => Promise.resolve("error"));

    const { container } = await renderMainElement();

})