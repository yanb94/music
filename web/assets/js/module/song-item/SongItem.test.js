import React from "react";
import { act } from "react-dom/test-utils";
import SongItem from "./SongItem"
import { expect } from "@jest/globals";
import { BrowserRouter } from 'react-router-dom'
import { render } from "@testing-library/react"
import 'regenerator-runtime/runtime'

const intersectionObserverMock = () => ({
    observe: () => null,
    unobserve: () => null
})

window.IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMock);

it('SongItem return the good value associate to its params', async () => {

    const date = new Date();
    date.setDate(date.getDate() - 3);

    const data = {
        name: "Chanson 1",
        contentImageUrl: "example.jpg",
        songDuration: 171.75510204082,
        createdAt: date,
    }

    let renderMain;

    await act(async () => {
        renderMain = await render(<SongItem data={data}></SongItem>, {wrapper: BrowserRouter})
    })

    const { container } = renderMain

    expect(container.children.length).toBe(1)

    /** @type {HTMLElement} */
    let songItemHtml = container.children[0];

    expect(songItemHtml.querySelector('.song-item--cont-image--image').getAttribute('src')).toBe('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=')
    expect(songItemHtml.querySelector('.song-item--cont-image--image').getAttribute('data-src')).toBe('example.jpg')
    expect(songItemHtml.querySelector('.song-item--cont-image--image').getAttribute('alt')).toBe('Chanson 1')
    expect(songItemHtml.querySelector('.song-item--cont-image--duration').textContent).toBe("02:51")
    expect(songItemHtml.querySelector('.song-item--info--name').textContent).toBe("Chanson 1")
    expect(songItemHtml.querySelector('.song-item--info--date').textContent).toBe("il y a 3 jours")
})

it('SongItem return the good image depending of size', async () => {

    const date = new Date();
    date.setDate(date.getDate() - 3);

    const data = {
        name: "Chanson 1",
        contentImageUrl: "example.jpg",
        songDuration: 171.75510204082,
        createdAt: date,
        contentImageResponsive: {
            "150x150": "150.jpg"
        }
    }

    let renderMain;

    await act(async () => {
        renderMain = await render(<SongItem data={data} size="150px"></SongItem>, {wrapper: BrowserRouter})
    })

    const { container } = renderMain

    expect(container.children.length).toBe(1)

    /** @type {HTMLElement} */
    let songItemHtml = container.children[0];

    expect(songItemHtml.querySelector('.song-item--cont-image--image').getAttribute('src')).toBe('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=')
    expect(songItemHtml.querySelector('.song-item--cont-image--image').getAttribute('data-src')).toBe('150.jpg')
})