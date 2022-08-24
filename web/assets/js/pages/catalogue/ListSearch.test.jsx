import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import ListSearch from './ListSearch';
import { BrowserRouter } from 'react-router-dom'
import { getSearch, getNewSearch } from './getData'
import { expectElementExist } from '@app/test/util';

jest.mock('./getData.js')

async function renderMainElement(previousAction = () => {}, search = "search", className = 'test')
{
    let renderElements = {}

    await act(async () => {
        renderElements = render(<ListSearch search={search} className={className} previousAction={previousAction}/>,{wrapper: BrowserRouter})
    })

    return renderElements
}

function mockGetSearch(result)
{
    getSearch.mockImplementation(() => Promise.resolve(result))
}

function fakeDataSearch(nb)
{
    let search = []

    for (let index = 0; index < nb; index++) {
        
        if(index % 2 == 0)
            search.push({
                    "@id": "/api/playlists/10",
                    "@type": "Playlist",
                    "id": (index+1),
                    "name": "Playlist "+(index+1),
                    "createdAt": "2021-10-06T14:20:21+02:00",
                    "songs": [
                    {
                        "@id": "/api/songs/5",
                        "@type": "Song",
                        "id": 5,
                        "name": "Chanson 4",
                        "createdAt": "2021-09-21T16:23:55+02:00",
                        "author": {
                        "@id": "/api/artists/26",
                        "@type": "Artist",
                        "id": 26,
                        "name": "Artiste 1",
                        "email": "example@example.com",
                        "description": "Je suis une description",
                        "contentUrl": "/images/avatar/61471466aa9d9111218074.jpg"
                        },
                        "contentImageUrl": "/images/song/6149eafb728ce272848891.jpg",
                        "contentSongUrl": "/song/6149eafb73396379533453.mp3",
                        "songDuration": 104.98612244898
                    },
                    {
                        "@id": "/api/songs/7",
                        "@type": "Song",
                        "id": 7,
                        "name": "Chanson 6",
                        "createdAt": "2021-09-21T16:27:04+02:00",
                        "author": {
                        "@id": "/api/artists/26",
                        "@type": "Artist",
                        "id": 26,
                        "name": "Artiste 1",
                        "email": "example@example.com",
                        "description": "Je suis une description",
                        "contentUrl": "/images/avatar/61471466aa9d9111218074.jpg"
                        },
                        "contentImageUrl": "/images/song/6149ebb8b93db629804233.jpg",
                        "contentSongUrl": "/song/6149ebb8ba02a446872620.mp3",
                        "songDuration": 104.98612244898
                    }
                    ],
                    "isPublic": false,
                    "contentImageUrl": "/images/playlist/615d9485a11b2500084223.jpg",
                    "author": "/api/users/12",
                    "nbSongs": 2
            })

        if(index % 2 != 0)
            search.push({
                "@id": "/api/songs/5",
                "@type": "Song",
                "id": (index+1),
                "name": "Chanson "+(index+1),
                "createdAt": "2021-09-21T16:23:55+02:00",
                "author": {
                "@id": "/api/artists/26",
                "@type": "Artist",
                "id": 26,
                "name": "Artiste 1",
                "email": "example@example.com",
                "description": "Je suis une description",
                "contentUrl": "/images/avatar/61471466aa9d9111218074.jpg"
                },
                "contentImageUrl": "/images/song/6149eafb728ce272848891.jpg",
                "contentSongUrl": "/song/6149eafb73396379533453.mp3",
                "songDuration": 104.98612244898
            })
        
    }

    return {
        "hydra:member":search
    }
}

const intersectionObserverMock = () => ({
    observe: () => null,
    unobserve: () => null
})

window.IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMock);

it("lists are rendered when request success", async() => {

    mockGetSearch(fakeDataSearch(8))

    const {container} = await renderMainElement()

    const nbPlaylists = container.querySelectorAll(".playlist-item").length
    const nbSongs = container.querySelectorAll('.song-item').length

    expect(nbPlaylists).toBe(4)
    expect(nbSongs).toBe(4)
    expect(getSearch).toBeCalled()
})

it("error message is returned when request fail", async() => {

    mockGetSearch('error')

    const {container} = await renderMainElement()

    expectElementExist('.test--error',container)
    expect(getSearch).toBeCalled();

})