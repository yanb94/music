import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import Legal from './Legal';
import { BrowserRouter, Router, Route } from 'react-router-dom'
import getData from './getData';
import { expectElementExist, expectElementHasContent } from '@app/test/util';

async function renderMainElement()
{
    let renderElements = {}

    await act(async () => {
        renderElements = render(<Legal/>,{wrapper: BrowserRouter})
    })

    return renderElements
}

jest.mock('./getData.js')

function mockGetData(result)
{
    getData.mockImplementation(() => Promise.resolve(result))
}

it("return expected element when data get successfuly", async() => {

    mockGetData({
        "id": 3,
        "title": "Politique de confidentialité",
        "label": "Confidentialité",
        "content": "<p>Je suis le contenu</p>",
        "slug": "politique-de-confidentialite"
    })
    const {container} = await renderMainElement()

    expectElementHasContent(
        expectElementExist(".legal--content--document--title",container),
        "Politique de confidentialité"
    )
    
    expectElementHasContent(
        expectElementExist(".legal--content--document--content",container),
        "<p>Je suis le contenu</p>"
    )

})

it("return expected element when servor error",async() => {
    
    mockGetData("error")
    const {container} = await renderMainElement()

    expectElementExist('.card-error-legal',container)
    expectElementExist('.card-error-legal--card',container)
    expectElementExist('.card-error-legal--card--title',container)
    expectElementExist('.card-error-legal--card--desc',container)
    expectElementExist('.card-error-legal--card--btn-cont',container)
})

it("redirect to 404 page when document not found", async() => {
    
    mockGetData(404)
    await renderMainElement()

    expect(window.location.pathname).toBe('/error404')
})