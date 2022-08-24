import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime';
import FormIsLoadingError from './FormIsLoadingError';
import { expectElementExist, expectElementHasContent } from '@app/test/util';

it("FormIsLoadingError return an error when isError is true",async() => {

    const {container} = render(<FormIsLoadingError isError={true} formClass={"test"}  >
        Test
    </FormIsLoadingError>)

    expectElementExist(".test--head--content--container--error",container)
})

it("FormIsLoadingError return children when isError is false",async() => {
    
    const {container} = render(<FormIsLoadingError >
        Test
    </FormIsLoadingError>)

    expectElementHasContent(container,"Test")
})