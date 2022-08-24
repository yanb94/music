import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import 'regenerator-runtime/runtime';
import FormPrevious from './FormPrevious';
import { BrowserRouter } from 'react-router-dom'
import { expectElementExist } from '@app/test/util';

it("FormPrevious return a previous Link when link is not null",async() => {

    const {container} = render(<FormPrevious previousLink={"/test"} formClass={"test"} />,{wrapper: BrowserRouter})
    expectElementExist(".test--head--content--container--previous",container)
})

it("FormPrevious return children when isError is false",async() => {
    
    const {container} = render(<FormPrevious previousLink={null} formClass={"test"} />,{wrapper: BrowserRouter})

    const nbPreviousLink = container.querySelectorAll('.test--head--content--container--previous',container).length
    expect(nbPreviousLink).toBe(0)
})