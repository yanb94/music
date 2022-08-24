import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime'
import ListLegalLink from './ListLegalLink';
import { expectElementExist, expectElementHasContent } from '@app/test/util';
import { BrowserRouter } from 'react-router-dom';

const legals = [
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

it("ListLegalLink render has expected", async () => {

    const {container} = render(<ListLegalLink legals={legals} classLink="test-class"/>, {wrapper: BrowserRouter})

    expectElementExist(".test-class[href='/legal/mention-legale']", container)
    expectElementExist(".test-class[href='/legal/politique-de-confidentialite']", container)
    expectElementExist(".test-class[href='/legal/conditions-generale-dutilisation']", container)

})

it("ListLegalLink render has expected when no array", async() => {
    
    const {container} = render(<ListLegalLink legals="error" classLink="test-class"/>, {wrapper: BrowserRouter})

    expectElementHasContent(container,"")
})