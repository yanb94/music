import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import { BrowserRouter } from 'react-router-dom'
import { getOtherSongs } from './getData'
import { expectElementExist } from '@app/test/util';
import OtherSongs from './OtherSongs';

jest.mock('./getData.js')

async function renderMainElement(data={})
{
    let renderElements = {}

    await act(async () => {
        renderElements = render(<OtherSongs data={data} />,{wrapper: BrowserRouter})
    })

    return renderElements
}

function mockOtherSongs(result)
{
    getOtherSongs.mockImplementation(() => Promise.resolve(result))
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

    mockOtherSongs(fakeDataSongs(8))

    const {container} = await renderMainElement()

    const nbSongsShow = container.querySelectorAll(".song-item").length

    expect(nbSongsShow).toBe(8)
    expect(getOtherSongs).toBeCalled()
})

it("error message is returned when request fail", async() => {

    mockOtherSongs('error')

    const {container} = await renderMainElement()

    expectElementExist('.other-song--error',container)
    expect(getOtherSongs).toBeCalled();

})