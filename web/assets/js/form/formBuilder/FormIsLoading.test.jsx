import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime';
import FormIsLoading from './FormIsLoading';
import { expectElementExist, expectElementHasContent } from '@app/test/util';

it("formIsLoading return child when isLoading is undefined", async () => {

    const {container} = render(<FormIsLoading>
        Test
    </FormIsLoading>)

    expectElementHasContent(container,"Test")
})

it("formIsLoading return child when isLoading is false", async () => {
    const {container} = render(<FormIsLoading isLoading={false}>
        Test
    </FormIsLoading>)

    expectElementHasContent(container,"Test")
})

it("formIsLoading return child when isLoading is true", async () => {
    const {container} = render(<FormIsLoading isLoading={true} formClass="test">
        Test
    </FormIsLoading>)

    expectElementExist(".test--head--content--container--cont-loader",container)
})