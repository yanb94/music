import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime';
import FormErrorServor from './FormErrorServor';
import { expectElementExist } from '@app/test/util';

it("FormErrorServor return an error msg when isSendError is true", async() => {
    const {container} = render(<FormErrorServor isSendError={true} formClass="test"/>)

    expectElementExist(".test--head--content--container--form--error",container)
})

it("FormErrorServor return nothing when isSendError is false", async() => {
    const {container} = render(<FormErrorServor isSendError={false} formClass="test"/>)

    expect(container.innerHTML).toBe("")
})