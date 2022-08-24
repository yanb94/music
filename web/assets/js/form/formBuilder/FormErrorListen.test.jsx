import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime';
import FormErrorListen from './FormErrorListen';
import { expectElementExist, expectElementHasContent } from '@app/test/util';

it("FormErrorListen return nothing when errorsToListen is not an array", async() => {

    const { container } =  render(
        <FormErrorListen
            errorsToListen="" 
            errors={[]}
        />
    )
    expectElementHasContent(container,"")
})

it("FormErrorListen return the listen error", async() => {
    
    const { container } =  render(
        <FormErrorListen
            errorsToListen={[
                "error"
            ]} 
            errors={
                {
                    "error": {
                        message: "Je suis une erreur"
                    }
                }
            }
            formClass="error"
        />
    )

    expectElementHasContent(
        expectElementExist(".error--head--content--container--form--error",container),
        "Je suis une erreur"
    )
})