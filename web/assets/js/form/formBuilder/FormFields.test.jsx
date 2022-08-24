import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime';
import renderField from './renderField';
import FormFields from './FormFields';
import FormConfig from './configBuilder';
import { expectElementHasContent } from '@app/test/util';

jest.mock("./renderField")

it("renderField was called when fieldconfig pass", async() => {

    const mockRenderField = jest.fn();

    renderField.mockImplementation(mockRenderField);

    render(<FormFields
        formFields={
            FormConfig.build([
                FormConfig.addTextInput()
                    .setId('text1')
                    .setLabel('text1')
                    .setPlaceholder('text1'),
                FormConfig.addTextInput()
                    .setId('text2')
                    .setLabel('text2')
                    .setPlaceholder('text2')
            ])
        }
        formParams={
            {
                register: "",
                formState: {
                    errors: {}
                },
                control: ""
            }
        }
    />)

    expect(renderField).toBeCalledTimes(2)

})

it("FormFields return null when value is not an array", async() => {

    const { container } = render(<FormFields
        formFields={""}
        formParams={
            {
                register: "",
                formState: {
                    errors: {}
                },
                control: ""
            }
        }
    />)
    expectElementHasContent(container,"")
})