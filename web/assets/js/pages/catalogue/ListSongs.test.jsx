import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import ListSongs from './ListSongs';
import { BrowserRouter } from 'react-router-dom'
import {getSongs, getNewSongs} from './getData'
import { expectElementExist } from '@app/test/util';

jest.mock('./getData.js')

async function renderMainElement(moreAction = () => {}, isMore = false, className = 'test')
{
    let renderElements = {}

    await act(async () => {
        renderElements = render(<ListSongs className={className} isMore={isMore} moreAction={moreAction}/>,{wrapper: BrowserRouter})
    })

    return renderElements
}

function mockGetSongs(result)
{
    getSongs.mockImplementation(() => Promise.resolve(result))
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

const intersectionObserverMock = () => ({
    observe: () => null,
    unobserve: () => null
})

window.IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMock);

it("songs are rendered when request success", async() => {

    mockGetSongs(fakeDataSongs(8))

    const {container} = await renderMainElement()

    const nbSongsShow = container.querySelectorAll(".song-item").length

    expect(nbSongsShow).toBe(8)
    expect(getSongs).toBeCalled()
})

it("error message is returned when request fail", async() => {

    mockGetSongs('error')

    const {container} = await renderMainElement()

    expectElementExist('.test--error',container)
    expect(getSongs).toBeCalled();

})