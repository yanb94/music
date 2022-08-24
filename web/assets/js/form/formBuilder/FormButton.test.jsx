import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime';
import FormButton from './FormButton';
import { expectElementExist, expectElementHasValue } from '@app/test/util';

it("Button is disabled when form is not valid", async () => {

    const {container} = render(<FormButton
        formClass="test"
        formState={{
            isValid: false,
            isSubmitting: false
        }}
        buttonLabel="Envoyer"
    />)

    expectElementExist("input[type='submit'][disabled]",container)
})

it("Button is disabled when form is submitting", async () => {

    const {container} = render(<FormButton
        formClass="test"
        formState={{
            isValid: true,
            isSubmitting: true
        }}
        buttonLabel="Envoyer"
    />)

    expectElementExist("input[type='submit'][disabled]",container)
})

it("Button is enabled when form is valid and not submitting", async () => {

    const {container} = render(<FormButton
        formClass="test"
        formState={{
            isValid: true,
            isSubmitting: false
        }}
        buttonLabel="Envoyer"
    />)

    const button = expectElementExist("input[type='submit']",container)

    expect(button.getAttribute('disabled')).toBe(null)
})

it("Button is enabled when validation not required", async() => {

    const {container} = render(<FormButton
        formClass="test"
        formState={{
            isValid: false,
            isSubmitting: false
        }}
        buttonLabel="Envoyer"
        mustBeValid={false}
    />)
    
    const button = expectElementExist("input[type='submit']",container)

    expect(button.getAttribute('disabled')).toBe(null)
})

it("Good class and good button label are apply", async () => {
    const {container} = render(<FormButton
        formClass="test"
        formState={{
            isValid: true,
            isSubmitting: false
        }}
        buttonLabel="Envoyer"
    />)

    expectElementExist(".test--head--content--container--form--cont-button",container)
    expectElementHasValue(expectElementExist("input[type='submit']",container),"Envoyer")
})