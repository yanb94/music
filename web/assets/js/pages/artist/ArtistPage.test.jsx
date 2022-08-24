import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import { BrowserRouter } from 'react-router-dom'
import { getData, getSongs } from './getData'
import ArtistPage from './ArtistPage';
import { expectElementHasContent } from '@app/test/util';

jest.mock('./getData.js')

const intersectionObserverMock = () => ({
    observe: () => null,
    unobserve: () => null
})

window.IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMock);

async function renderMainElement()
{
    let renderElements = {}

    await act(async () => {
        renderElements = render(<ArtistPage/>,{wrapper: BrowserRouter})
    })

    return renderElements
}

function mockGetData(result)
{
    getData.mockImplementation(() => Promise.resolve(result))
}

function mockGetSongs(result)
{
    getSongs.mockImplementation(() => Promise.resolve(result))
}

function fakeArtist()
{
    return {
        contentUrl: "/images/avatar/61471466aa9d9111218074.jpg",
        description: "Je suis une description",
        email: "example@example.com",
        id: 26,
        name: "Artiste 1",
        nbSongs: 7,
        slug: "artiste-1"
    }
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

it("expected element are rendered when request success", async() => {

    mockGetData(fakeArtist())
    mockGetSongs(fakeDataSongs(8))

    const {container} = await renderMainElement()

    expectElementHasContent(container.querySelector('.artist-page--content--info--title'),"Artiste 1")

    const nbSongsShow = container.querySelectorAll(".song-item").length

    expect(getData).toBeCalled()
    expect(nbSongsShow).toBe(8)
    expect(getSongs).toBeCalled()
})

it("expected redirection when error in first request", async() => {
    
    mockGetData('error')
    
    await renderMainElement()

    expect(getData).toBeCalled()
    expect(window.location.pathname).toBe('/error404')
})

it("expected redirection when error in second request", async() => {
    
    mockGetData(fakeArtist())
    mockGetSongs('error')
    
    await renderMainElement()

    expect(window.location.pathname).toBe('/error404')
    expect(getData).toBeCalled()
    expect(getSongs).toBeCalled()
})